import crypto from 'crypto';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import { sendEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, companyName, gstin, role } = req.body;

  // Check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email address',
    });
  }

  // Determine starting status. If they are wholesaling, they start as PendingApproval
  const startingStatus = (role === 'wholesaler') ? 'PendingApproval' : 'Active';

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'customer',
    companyName: companyName || '',
    gstin: gstin || '',
    status: startingStatus,
  });

  if (user) {
    sendTokenResponse(user, 201, res);
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid user data provided',
    });
  }
});

// @desc    Login user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email (include password field)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  if (user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: 'This account has been blocked. Please contact support.',
    });
  }

  // Match password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Generate tokens & respond
  sendTokenResponse(user, 200, res);
});

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error('No refresh token provided');
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_1234567890'
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('User associated with token not found');
    }

    if (user.isBlocked) {
      res.status(403);
      throw new Error('Account blocked, cannot refresh session');
    }

    // Generate a fresh access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_1234567890',
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    res.status(401);
    throw new Error('Refresh token is invalid or expired');
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('refreshToken', 'none', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000), // expire in 10s
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update plain fields
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  // Handle password update if specified
  if (req.body.newPassword) {
    if (!req.body.currentPassword) {
      res.status(400);
      throw new Error('Current password is required to set a new password');
    }

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      res.status(400);
      throw new Error('Incorrect current password');
    }

    user.password = req.body.newPassword;
    user.forcePasswordChange = false; // Reset force flag if they changed it
  }

  const updatedUser = await user.save();

  // Return user details (omit password)
  const userObj = updatedUser.toObject();
  delete userObj.password;

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: userObj,
  });
});

// @desc    Forgot Password - Request reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Return success to avoid user enumeration attacks, but still log
    console.log(`Password reset requested for non-existent email: ${email}`);
    return res.status(200).json({
      success: true,
      message: 'If that email exists in our records, a reset link has been sent.',
    });
  }

  // Generate Reset Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set database values with 30m expiration
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  await user.save();

  // Create reset url
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const message = `
    You are receiving this email because you (or someone else) have requested the reset of a password.
    Please make a POST request to: \n\n ${resetUrl} \n\n
    This link will expire in 30 minutes. If you did not request this, please ignore this email.
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg">
      <h2 style="color: #c8102e; text-align: center;">IT SAATHI</h2>
      <p>Hello ${user.name},</p>
      <p>You requested a password reset for your account. Please click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #c8102e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">This link will expire in 30 minutes. If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #64748b; font-size: 12px; text-align: center;">IT SAATHI © 2026. All rights reserved.</p>
    </div>
  `;

  const emailResult = await sendEmail({
    to: user.email,
    subject: 'IT SAATHI - Password Reset Request',
    text: message,
    html,
  });

  if (emailResult.error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error('Email could not be sent. Please try again later.');
  }

  res.status(200).json({
    success: true,
    message: 'Reset link sent successfully to email.',
  });
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash received token to compare with database
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired password reset token');
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.forcePasswordChange = false; // Reset force flag if any

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful. You can now log in.',
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  let users;
  const path = (await import('path')).default;
  const fs = (await import('fs')).default;
  const dbPath = path.resolve(process.cwd(), 'uploads', 'local_db.json');
  
  if (fs.existsSync(dbPath)) {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    users = data.users || [];
  } else {
    users = await User.find({});
  }

  // Remove passwords for safety
  const safeUsers = users.map(u => {
    const userObj = u.toObject ? u.toObject() : { ...u };
    delete userObj.password;
    return userObj;
  });

  res.status(200).json({
    success: true,
    users: safeUsers
  });
});


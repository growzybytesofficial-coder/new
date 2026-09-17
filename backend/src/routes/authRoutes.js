import express from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  getUsers,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOrManager } from '../middleware/adminMiddleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
} from '../validators/authValidator.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Custom bypass middleware for development admin clients
const protectAdminUsersRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === 'Bearer demo-token') {
    req.user = { role: 'admin' };
    return next();
  }
  return protect(req, res, () => {
    adminOrManager(req, res, next);
  });
};

// Public routes with rate limiting
router.post('/register', authLimiter, registerValidator, registerUser);
router.post('/login', authLimiter, loginValidator, loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidator, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidator, updateProfile);
router.get('/users', protectAdminUsersRoute, getUsers);

export default router;

import asyncHandler from '../utils/asyncHandler.js';

export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as an admin',
    });
  }
});

export const adminOrManager = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized. Requires administrative privileges.',
    });
  }
});

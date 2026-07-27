const authService = require('./auth.service');
const User = require('../models/User');

/**
 * Sync Firebase User to MongoDB
 * POST /api/auth/firebase-sync
 * 
 * Called by frontend after Firebase authentication.
 * The verifyFirebaseToken middleware has already verified the Firebase ID token
 * and set req.user with { firebaseUid, email, fullName }.
 */
const firebaseSync = async (req, res, next) => {
  try {
    const { firebaseUid, email, fullName } = req.user;
    const { role, staffPasscode, displayName } = req.body;

    const result = await authService.syncFirebaseUser({
      firebaseUid,
      email,
      fullName: displayName || fullName || email.split('@')[0],
      role,
      staffPasscode,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Authenticated User
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const dbUser = await User.findOne({ firebaseUid });

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database. Please complete registration.',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: dbUser._id || dbUser.id,
        fullName: dbUser.fullName,
        email: dbUser.email,
        role: dbUser.role,
        isVerified: dbUser.isVerified,
        createdAt: dbUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Logout
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('token');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
  firebaseSync,
  getCurrentUser,
  logout,
};

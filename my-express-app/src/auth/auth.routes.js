const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('./auth.controller');
const verifyFirebaseToken = require('../middleware/verifyJWT');

const router = express.Router();

// Rate limiter for Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
});

/**
 * @route   POST /api/auth/firebase-sync
 * @desc    Sync Firebase-authenticated user to MongoDB (create or update)
 * @access  Private (Firebase ID Token required)
 */
router.post('/firebase-sync', authLimiter, verifyFirebaseToken, authController.firebaseSync);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear cookies
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (Firebase ID Token required)
 */
router.get('/me', verifyFirebaseToken, authController.getCurrentUser);

module.exports = router;

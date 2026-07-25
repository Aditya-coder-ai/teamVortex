const express = require('express');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const authController = require('./auth.controller');
const { validateBody } = require('./auth.middleware');
const { registerSchema, verifyOtpSchema, loginSchema, resendOtpSchema } = require('./auth.validation');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();

// Rate limiter for Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many OTP requests from this IP, please try again later',
  },
});

/**
 * @route   POST /api/auth/register
 * @desc    Register user and send verification OTP
 * @access  Public
 */
router.post('/register', authLimiter, validateBody(registerSchema), authController.register);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and generate JWT
 * @access  Public
 */
router.post('/verify-otp', authLimiter, validateBody(verifyOtpSchema), authController.verifyOtp);

/**
 * @route   POST /api/auth/login
 * @desc    Login with Email + Password
 * @access  Public
 */
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP to unverified user
 * @access  Public
 */
router.post('/resend-otp', otpLimiter, validateBody(resendOtpSchema), authController.resendOtp);

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth login
 * @access  Public
 */
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'mock_google_client_id') {
    return res.status(501).json({
      success: false,
      message: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env',
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth Callback
 * @access  Public
 */
router.get(
  '/google/callback',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'mock_google_client_id') {
      return res.status(501).json({
        success: false,
        message: 'Google OAuth is not configured.',
      });
    }
    passport.authenticate('google', { session: false, failureRedirect: '/login' })(req, res, next);
  },
  authController.googleCallback
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear token cookie
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (JWT Protected)
 */
router.get('/me', verifyJWT, authController.getCurrentUser);

module.exports = router;

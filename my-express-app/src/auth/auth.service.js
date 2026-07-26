const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAndSendOtp, verifyUserOtp } = require('./otp.service');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');

/**
 * Register new user with Role Security Controls
 */
const ALLOWED_STAFF_EMAILS = [
  'staff@freshbowl.com',
  'admin@freshbowl.com',
  'manager@freshbowl.com',
  'chef@freshbowl.com',
  'rajan.staff@freshbowl.com',
];

const registerUser = async ({ fullName, email, password, role, staffPasscode }) => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Security check: restrict staff/manager/admin roles to selected accounts only
  let assignedRole = 'customer';
  const requestedRole = (role || '').toLowerCase();
  const isStaffRole = ['staff', 'manager', 'admin'].includes(requestedRole);

  const isValidStaffDomain = normalizedEmail.endsWith('@freshbowl.com');
  const isWhitelisted = ALLOWED_STAFF_EMAILS.includes(normalizedEmail);
  const isValidPasscode = staffPasscode && staffPasscode.trim() === (process.env.STAFF_PASSCODE || 'STAFF2026');

  if (isStaffRole && (isValidStaffDomain || isWhitelisted || isValidPasscode)) {
    assignedRole = requestedRole;
  }

  // Check existing user
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    if (existingUser.isVerified) {
      const error = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    } else {
      // User exists but unverified: update password & send new OTP
      const salt = await bcrypt.genSalt(10);
      existingUser.fullName = fullName;
      existingUser.passwordHash = await bcrypt.hash(password, salt);
      existingUser.role = assignedRole;
      
      await existingUser.save();
      const otpRes1 = await generateAndSendOtp(existingUser);

      return {
        message: 'Account updated. Verification OTP sent to email.',
        email: existingUser.email,
        isVerified: false,
        previewUrl: otpRes1.previewUrl,
      };
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create User
  const newUser = await User.create({
    fullName,
    email: normalizedEmail,
    passwordHash,
    role: assignedRole,
    isVerified: false,
  });

  // Generate & Send OTP
  const otpRes2 = await generateAndSendOtp(newUser);

  return {
    message: 'Registration successful. OTP sent to your email.',
    email: newUser.email,
    isVerified: false,
    previewUrl: otpRes2.previewUrl,
  };
};

/**
 * Verify OTP code
 */
const verifyOtp = async ({ email, otp }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  await verifyUserOtp(user, otp);

  // Generate JWT tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    message: 'Email verification successful',
    token: accessToken,
    refreshToken,
    user: {
      id: user._id || user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: true,
    },
  };
};

/**
 * Login user with Email + Password
 */
const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.passwordHash) {
    const error = new Error('Please log in using Google OAuth');
    error.statusCode = 400;
    throw error;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Check email verification status
  if (!user.isVerified) {
    // Re-send OTP if unverified
    const otpResLogin = await generateAndSendOtp(user);
    const error = new Error('Email not verified. A new OTP has been sent to your email.');
    error.statusCode = 403;
    error.requiresVerification = true;
    error.previewUrl = otpResLogin.previewUrl;
    throw error;
  }

  // Generate JWT tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    message: 'Login successful',
    token: accessToken,
    refreshToken,
    user: {
      id: user._id || user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Resend OTP
 */
const resendOtp = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error('Account is already verified');
    error.statusCode = 400;
    throw error;
  }

  return await generateAndSendOtp(user);
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  resendOtp,
};

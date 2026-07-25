const crypto = require('crypto');
const { sendOtpEmail } = require('../config/mail');

const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
const MAX_VERIFY_ATTEMPTS = 3;
const MAX_OTP_REQUESTS_PER_HOUR = 5;
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * Generate a 6-digit numeric OTP
 */
const generate6DigitOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Handle sending or re-sending OTP to user with rate limiting and rules
 */
const generateAndSendOtp = async (user) => {
  const now = new Date();

  // Rule: Resend cooldown of 60 seconds
  if (user.lastOtpSentAt && now - new Date(user.lastOtpSentAt) < RESEND_COOLDOWN_MS) {
    const remainingSeconds = Math.ceil(
      (RESEND_COOLDOWN_MS - (now - new Date(user.lastOtpSentAt))) / 1000
    );
    const error = new Error(`Please wait ${remainingSeconds} seconds before requesting a new OTP`);
    error.statusCode = 429;
    throw error;
  }

  // Rule: Maximum 5 OTP requests per hour
  let windowStart = user.otpWindowStart ? new Date(user.otpWindowStart) : null;
  let requestsCount = user.otpRequestsInWindow || 0;

  if (!windowStart || now - windowStart > ONE_HOUR_MS) {
    // Reset window
    windowStart = now;
    requestsCount = 1;
  } else {
    if (requestsCount >= MAX_OTP_REQUESTS_PER_HOUR) {
      const error = new Error('Maximum OTP request limit reached (5 per hour). Please try again later.');
      error.statusCode = 429;
      throw error;
    }
    requestsCount += 1;
  }

  // Generate 6-digit OTP and set expiration (5 mins)
  const otpCode = generate6DigitOtp();
  const otpExpires = new Date(now.getTime() + OTP_EXPIRATION_MS);

  // Update user fields
  user.otp = otpCode;
  user.otpExpires = otpExpires;
  user.otpAttempts = 0; // Reset attempts for new OTP
  user.lastOtpSentAt = now;
  user.otpRequestsInWindow = requestsCount;
  user.otpWindowStart = windowStart;

  await user.save();

  // Send email
  const emailResult = await sendOtpEmail(user.email, otpCode);

  return { 
    message: 'OTP sent successfully', 
    expiresAt: otpExpires,
    devOtp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
    previewUrl: emailResult?.previewUrl || null
  };
};

/**
 * Validate received OTP code against user record
 */
const verifyUserOtp = async (user, inputOtp) => {
  const now = new Date();

  if (!user.otp || !user.otpExpires) {
    const error = new Error('No active OTP found. Please request a new OTP.');
    error.statusCode = 400;
    throw error;
  }

  // Rule: Maximum 3 verification attempts
  if (user.otpAttempts >= MAX_VERIFY_ATTEMPTS) {
    // Invalidate OTP on max attempts
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const error = new Error('Maximum OTP verification attempts exceeded. Please request a new OTP.');
    error.statusCode = 400;
    throw error;
  }

  // Rule: Expiry check (5 minutes)
  if (now > new Date(user.otpExpires)) {
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const error = new Error('OTP has expired. Please request a new OTP.');
    error.statusCode = 400;
    throw error;
  }

  // Check OTP match
  if (user.otp !== inputOtp) {
    user.otpAttempts = (user.otpAttempts || 0) + 1;
    await user.save();

    const remainingAttempts = MAX_VERIFY_ATTEMPTS - user.otpAttempts;
    const error = new Error(
      `Invalid OTP code. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : 'Maximum attempts reached.'}`
    );
    error.statusCode = 400;
    throw error;
  }

  // Single use only: clear OTP after successful verification
  user.otp = null;
  user.otpExpires = null;
  user.otpAttempts = 0;
  user.isVerified = true;

  await user.save();

  return true;
};

module.exports = {
  generateAndSendOtp,
  verifyUserOtp,
};

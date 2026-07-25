const nodemailer = require('nodemailer');

let transporter = null;
let etherealReady = false;

/**
 * Initialize transporter - auto-creates Ethereal test account if no real SMTP configured
 */
const getTransporter = async () => {
  if (transporter && etherealReady) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const hasRealCredentials = emailUser && emailPass
    && emailUser !== 'ethereal_user'
    && emailPass !== 'ethereal_pass';

  if (hasRealCredentials) {
    // Use real SMTP credentials from .env
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: { user: emailUser, pass: emailPass },
    });
    etherealReady = true;
    console.log('[MAIL] Using configured SMTP credentials.');
    return transporter;
  }

  // Auto-create a working Ethereal test account
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    etherealReady = true;
    console.log(`[MAIL] Ethereal test account created: ${testAccount.user}`);
    console.log(`[MAIL] View sent emails at: https://ethereal.email/login`);
    console.log(`[MAIL]   Login: ${testAccount.user} / ${testAccount.pass}`);
    return transporter;
  } catch (err) {
    console.error('[MAIL] Failed to create Ethereal account:', err.message);
    etherealReady = true; // prevent retry loops
    return null;
  }
};

/**
 * Send OTP Email to user
 */
const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Fresh Bowl" <noreply@freshbowl.app>',
    to,
    subject: 'Your Fresh Bowl OTP Verification Code',
    text: `Your OTP for verification is ${otp}. It will expire in 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="font-family: 'Work Sans', Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e4beb1; border-radius: 16px; background: #f9f9f7;">
        <h2 style="color: #1a1c1b; text-align: center; font-family: 'DM Serif Display', Georgia, serif;">fresh bowl<span style="color: #ff5b00;">.</span></h2>
        <p style="color: #5b4137; text-align: center;">Your One-Time Verification Code</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ff5b00; text-align: center; margin: 24px 0; padding: 16px; background: #ffffff; border-radius: 12px; border: 2px solid #e4beb1;">
          ${otp}
        </div>
        <p style="color: #907065; font-size: 13px; text-align: center;">This code expires in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const smtp = await getTransporter();
    if (!smtp) {
      console.log(`[DEV FALLBACK] OTP for ${to} is: ${otp}`);
      return { fallback: true, otp };
    }

    const info = await smtp.sendMail(mailOptions);
    console.log(`[MAIL] OTP sent to ${to}. MessageId: ${info.messageId}`);

    // Show Ethereal preview URL (only works for Ethereal-sent emails)
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[MAIL] 📧 Preview email at: ${previewUrl}`);
    }

    return { ...info, previewUrl: previewUrl || null };
  } catch (error) {
    console.error(`[MAIL ERROR] Failed to send OTP to ${to}:`, error.message);
    console.log(`[DEV FALLBACK] OTP for ${to} is: ${otp}`);
    return { fallback: true, otp };
  }
};

module.exports = {
  getTransporter,
  sendOtpEmail,
};

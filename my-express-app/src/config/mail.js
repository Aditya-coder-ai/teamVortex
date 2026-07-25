const nodemailer = require('nodemailer');

// Configure transporter with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

/**
 * Send OTP Email to user
 */
const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Restaurant App" <noreply@restaurantapp.com>',
    to,
    subject: 'Your Authentication OTP Code',
    text: `Your OTP for verification is ${otp}. It will expire in 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Verification Code</h2>
        <p>Your One-Time Password (OTP) for registration/login is:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4CAF50; text-align: center; margin: 20px 0; padding: 10px; background: #f9f9f9; border-radius: 4px;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px;">This OTP expires in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAIL] OTP sent to ${to}. MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[MAIL ERROR] Failed to send OTP to ${to}:`, error.message);
    // In dev mode without valid credentials, log OTP to console as fallback
    console.log(`[DEV FALLBACK] OTP for ${to} is: ${otp}`);
    return { fallback: true, otp };
  }
};

module.exports = {
  transporter,
  sendOtpEmail,
};

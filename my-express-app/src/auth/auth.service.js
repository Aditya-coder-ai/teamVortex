const User = require('../models/User');

/**
 * Allowed staff emails — whitelist for elevated roles
 */
const ALLOWED_STAFF_EMAILS = [
  'staff@freshbowl.com',
  'admin@freshbowl.com',
  'manager@freshbowl.com',
  'chef@freshbowl.com',
  'rajan.staff@freshbowl.com',
];

/**
 * Sync Firebase-authenticated user to MongoDB
 * 
 * Called after Firebase authentication on the frontend.
 * Creates a new MongoDB user record if one doesn't exist,
 * or returns the existing user with their role.
 * 
 * Preserves the staff domain/passcode role assignment logic.
 */
const syncFirebaseUser = async ({ firebaseUid, email, fullName, role, staffPasscode }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists by firebaseUid
  let existingUser = await User.findOne({ firebaseUid });

  if (!existingUser) {
    // Also check by email (in case of email-based collision)
    existingUser = await User.findOne({ email: normalizedEmail });
  }

  if (existingUser) {
    // Update firebaseUid if not set (e.g., migrated user or email match)
    if (!existingUser.firebaseUid || existingUser.firebaseUid !== firebaseUid) {
      existingUser.firebaseUid = firebaseUid;
      await existingUser.save();
    }

    // Update fullName if provided and different
    if (fullName && existingUser.fullName !== fullName) {
      existingUser.fullName = fullName;
      await existingUser.save();
    }

    return {
      message: 'User synced successfully',
      user: {
        id: existingUser._id || existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        isVerified: existingUser.isVerified,
      },
    };
  }

  // New user — determine role with security checks
  let assignedRole = 'customer';
  const requestedRole = (role || '').toLowerCase();
  const isStaffRole = ['staff', 'manager', 'admin'].includes(requestedRole);

  const isValidStaffDomain = normalizedEmail.endsWith('@freshbowl.com');
  const isWhitelisted = ALLOWED_STAFF_EMAILS.includes(normalizedEmail);
  const isValidPasscode = staffPasscode && staffPasscode.trim() === (process.env.STAFF_PASSCODE || 'STAFF2026');

  if (isStaffRole && (isValidStaffDomain || isWhitelisted || isValidPasscode)) {
    assignedRole = requestedRole;
  }

  // Create new user in MongoDB
  const newUser = await User.create({
    firebaseUid,
    fullName: fullName || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    role: assignedRole,
    isVerified: true, // Firebase has already verified the email
  });

  return {
    message: 'User created and synced successfully',
    user: {
      id: newUser._id || newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
    },
  };
};

module.exports = {
  syncFirebaseUser,
};

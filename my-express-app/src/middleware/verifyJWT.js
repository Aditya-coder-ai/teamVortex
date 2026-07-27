const { admin } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token from Authorization header
 * Replaces the old custom JWT verification middleware.
 * 
 * After verification, looks up the user in MongoDB to get role info
 * and sets req.user = { id, email, role, firebaseUid }
 */
const User = require('../models/User');

const verifyFirebaseToken = async (req, res, next) => {
  let idToken = null;

  // Extract token from Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    idToken = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    // Fallback: extract from cookie
    idToken = req.cookies.token;
  }

  if (!idToken) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Look up user in MongoDB to get role
    const dbUser = await User.findOne({ firebaseUid: uid });

    if (dbUser) {
      req.user = {
        id: dbUser._id || dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        firebaseUid: uid,
        fullName: dbUser.fullName,
        isVerified: dbUser.isVerified,
      };
    } else {
      // User authenticated via Firebase but not yet synced to MongoDB
      // Allow request to proceed with basic info (for /firebase-sync endpoint)
      req.user = {
        id: null,
        email: email,
        role: 'customer',
        firebaseUid: uid,
        fullName: decodedToken.name || null,
        isVerified: decodedToken.email_verified || false,
      };
    }

    next();
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please sign in again.',
      });
    }

    if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or revoked token.',
      });
    }

    console.error('[AUTH] Firebase token verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or corrupted token.',
    });
  }
};

module.exports = verifyFirebaseToken;

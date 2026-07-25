const { verifyAccessToken } = require('../config/jwt');

/**
 * Middleware to verify JWT token from Authorization header or cookies
 */
const verifyJWT = (req, res, next) => {
  let token = null;

  // Extract from Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    // Extract from Cookie
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Contains { id, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or corrupted token.',
    });
  }
};

module.exports = verifyJWT;

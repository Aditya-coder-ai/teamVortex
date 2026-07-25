/**
 * Middleware to restrict route access by role
 * Usage: authorizeRole('admin', 'manager')
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required',
      });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : 'customer';
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' does not have permission to access this resource`,
      });
    }

    next();
  };
};

module.exports = authorizeRole;

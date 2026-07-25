const { ZodError } = require('zod');

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Handle Zod validation errors
  if (err instanceof ZodError || err.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const formattedErrors = issues.map((e) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : e.path,
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  // Handle custom status errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(err.requiresVerification ? { requiresVerification: true } : {}),
  });
};

module.exports = errorHandler;

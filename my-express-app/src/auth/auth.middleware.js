/**
 * Middleware generator for Zod request body validation
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validateBody,
};

/**
 * Express async route handler wrapper
 * Ensures async errors are properly caught and passed to error handler
 */

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

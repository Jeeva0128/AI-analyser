/**
 * Global error handling middleware
 */

import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', err.message);

  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File size exceeds the limit (2MB)'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      error: 'Only one file allowed'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected file field'
    });
  }

  // Handle validation errors
  if (err.statusCode === 400) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // Handle API errors
  if (err.statusCode === 503) {
    return res.status(503).json({
      success: false,
      error: 'AI service temporarily unavailable'
    });
  }

  if (err.statusCode === 429) {
    return res.status(429).json({
      success: false,
      error: err.message || 'Too many requests'
    });
  }

  // Generic error
  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'An error occurred while processing your request'
      : err.message
  });
};

export default errorHandler;

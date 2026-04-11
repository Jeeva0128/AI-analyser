/**
 * Usage limit middleware
 * Checks usage limit before processing resume uploads
 */

import usageService from '../services/usageService.js';
import logger from '../utils/logger.js';

export const checkUsageLimit = (req, res, next) => {
  try {
    const usage = usageService.checkUsageLimit();

    if (!usage.allowed) {
      logger.warn('Usage limit reached');
      return res.status(429).json({
        success: false,
        error: usage.message
      });
    }

    // Attach usage info to request for later use
    req.usage = usage;

    next();
  } catch (error) {
    logger.error('Error checking usage limit:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error checking usage limit'
    });
  }
};

export default checkUsageLimit;

/**
 * Usage Service
 * Manages API usage limits and persists data to JSON file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USAGE_FILE = path.join(__dirname, '../usage.json');

const USAGE_LIMIT = 15;

class UsageService {
  constructor() {
    this.usageFile = USAGE_FILE;
    this.limit = USAGE_LIMIT;
    this.initializeUsageFile();
  }

  /**
   * Initialize usage file if it doesn't exist
   */
  initializeUsageFile() {
    try {
      if (!fs.existsSync(this.usageFile)) {
        const initialData = {
          count: 0,
          lastReset: new Date().toISOString().split('T')[0],
          limit: this.limit,
          history: []
        };
        fs.writeFileSync(this.usageFile, JSON.stringify(initialData, null, 2));
        logger.info('Usage file initialized', { filePath: this.usageFile });
      }
    } catch (error) {
      logger.error('Error initializing usage file:', error.message);
    }
  }

  /**
   * Get current usage data
   * @returns {Object} Usage data including count and history
   */
  getUsageData() {
    try {
      const data = fs.readFileSync(this.usageFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading usage file:', error.message);
      return { count: 0, limit: this.limit, history: [] };
    }
  }

  /**
   * Save usage data to file
   * @param {Object} data - Usage data to save
   */
  saveUsageData(data) {
    try {
      fs.writeFileSync(this.usageFile, JSON.stringify(data, null, 2));
    } catch (error) {
      logger.error('Error writing usage file:', error.message);
    }
  }

  /**
   * Check if usage limit is reached
   * @returns {Object} { allowed: boolean, remaining: number, used: number, limit: number }
   */
  checkUsageLimit() {
    const data = this.getUsageData();
    const remaining = this.limit - data.count;
    const allowed = data.count < this.limit;

    return {
      allowed,
      used: data.count,
      remaining: Math.max(0, remaining),
      limit: this.limit,
      message: allowed
        ? `Analysis ${data.count + 1} of ${this.limit}`
        : `Usage limit reached (${this.limit} resumes only)`
    };
  }

  /**
   * Increment usage count after successful analysis
   * @param {string} fileName - Name of the uploaded file
   * @returns {Object} Updated usage info
   */
  incrementUsage(fileName) {
    const data = this.getUsageData();

    // Check if limit is reached
    if (data.count >= this.limit) {
      const error = new Error(`Usage limit reached (${this.limit} resumes only)`);
      error.statusCode = 429;
      throw error;
    }

    // Increment count
    data.count += 1;

    // Add to history
    if (!data.history) {
      data.history = [];
    }
    data.history.push({
      fileName,
      timestamp: new Date().toISOString(),
      analysisNumber: data.count
    });

    // Save updated data
    this.saveUsageData(data);

    logger.info(`Usage incremented: ${data.count}/${this.limit}`, { fileName });

    return {
      used: data.count,
      remaining: this.limit - data.count,
      limit: this.limit,
      message: `Analysis ${data.count} of ${this.limit} completed`
    };
  }

  /**
   * Get usage statistics
   * @returns {Object} Usage statistics
   */
  getStats() {
    const data = this.getUsageData();
    return {
      used: data.count,
      remaining: this.limit - data.count,
      limit: this.limit,
      percentage: Math.round((data.count / this.limit) * 100),
      lastReset: data.lastReset,
      totalAnalyzed: data.history ? data.history.length : 0
    };
  }

  /**
   * Reset usage (admin only - use with caution)
   */
  resetUsage() {
    const initialData = {
      count: 0,
      lastReset: new Date().toISOString().split('T')[0],
      limit: this.limit,
      history: []
    };
    this.saveUsageData(initialData);
    logger.warn('Usage count reset to 0');
    return initialData;
  }
}

export default new UsageService();

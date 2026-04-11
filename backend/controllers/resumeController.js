/**
 * Resume Controller
 * Handles resume upload and analysis requests
 */

import pdfService from '../services/pdfService.js';
import aiService from '../services/aiService.js';
import usageService from '../services/usageService.js';
import validators from '../utils/validators.js';
import logger from '../utils/logger.js';

class ResumeController {
  /**
   * Upload and analyze resume
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async uploadAndAnalyze(req, res, next) {
    let filePath = null;

    try {
      // Validate file
      const validation = validators.isValidFile(req.file);
      if (!validation.valid) {
        const error = new Error(validation.error);
        error.statusCode = 400;
        throw error;
      }

      filePath = req.file.path;
      logger.info('File received for processing', { filename: req.file.originalname });

      // Step 1: Extract text from PDF
      const resumeText = await pdfService.extractTextFromPDF(filePath);

      // Step 2: Analyze resume with AI
      const analysis = await aiService.analyzeResume(resumeText);

      // Check if analysis was successful
      if (analysis.success === false) {
        const error = new Error(analysis.suggestions[0] || 'Failed to analyze resume');
        error.statusCode = 503;
        throw error;
      }

      logger.info('Resume analysis completed successfully');

      // Step 3: Generate improved resume using AI
      const improvedResume = await aiService.generateImprovedResume(resumeText, {
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions
      });

      // Step 4: Increment usage count (must succeed in analysis)
      const usageInfo = usageService.incrementUsage(req.file.originalname);

      // Clean up temporary file
      pdfService.cleanUpFile(filePath);

      // Return response with usage info
      res.status(200).json({
        ...analysis,
        improvedResume,
        usage: usageInfo
      });

    } catch (error) {
      // Clean up file on error
      if (filePath) {
        pdfService.cleanUpFile(filePath);
      }

      logger.error('Error in uploadAndAnalyze:', error.message);
      next(error);
    }
  }
}

export default new ResumeController();

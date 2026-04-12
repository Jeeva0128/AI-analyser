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
      console.log('=== UPLOAD STARTED ===');
      console.log('File received:', req.file ? 'YES' : 'NO');
      
      // Validate file
      const validation = validators.isValidFile(req.file);
      if (!validation.valid) {
        const error = new Error(validation.error);
        error.statusCode = 400;
        throw error;
      }

      filePath = req.file.path;
      logger.info('File received for processing', { 
        filename: req.file.originalname,
        path: filePath,
        size: req.file.size
      });

      // Step 1: Extract text from PDF
      console.log('Step 1: Extracting PDF text...');
      const resumeText = await pdfService.extractTextFromPDF(filePath);
      console.log('PDF extracted:', resumeText.length, 'chars');

      // Step 2: Analyze resume with AI
      console.log('Step 2: Analyzing resume...');
      logger.info('Calling aiService.analyzeResume()', { 
        textLength: resumeText.length 
      });
      const analysis = await aiService.analyzeResume(resumeText);
      console.log('Analysis complete:', analysis);

      logger.info('AI Service response received', {
        success: analysis.success,
        score: analysis.score,
        hasError: !!analysis.error,
        analysisKeys: Object.keys(analysis)
      });

      // Log the response regardless of status
      logger.info('Complete analysis response:', analysis);

      logger.info('Resume analysis completed successfully');

      // Step 3: Generate improved resume using AI
      console.log('Step 3: Generating improved resume...');
      const improvedResume = await aiService.generateImprovedResume(resumeText, {
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions
      });
      console.log('Improved resume generated');

      // Step 4: Increment usage count (must succeed in analysis)
      const usageInfo = usageService.incrementUsage(req.file.originalname);

      // Clean up temporary file
      // Return response with usage info
      const response = {
        ...analysis,
        improvedResume,
        usage: usageInfo
      };
      
      console.log('Sending response:', response);
      res.status(200).json(response);

      await pdfService.cleanUpFile(filePath);

    } catch (error) {
      // Clean up file on error
      if (filePath) {
        await pdfService.cleanUpFile(filePath);
      }

      console.error('=== ERROR IN UPLOAD ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      logger.error('Error in uploadAndAnalyze:', error.message);
      next(error);
    }
  }
}

export default new ResumeController();

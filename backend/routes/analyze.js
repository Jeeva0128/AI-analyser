/**
 * Resume Analysis Routes
 * API endpoints for resume upload and analysis
 */

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import resumeController from '../controllers/resumeController.js';
import { checkUsageLimit } from '../middleware/usageLimit.js';
import usageService from '../services/usageService.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
const uploadTempDir = path.join(os.tmpdir(), 'ai-resume-analyzer-uploads');

if (!fs.existsSync(uploadTempDir)) {
  fs.mkdirSync(uploadTempDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  dest: uploadTempDir,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    logger.info('Multer file validation', {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      size: file.size
    });

    if (file.fieldname !== 'resume') {
      return cb(new Error('Field name must be "resume"'), false);
    }

    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed (application/pdf)'), false);
    }

    cb(null, true);
  }
});

// Custom error handler for multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error('Multer error:', {
      code: err.code,
      message: err.message,
      field: err.field,
      limit: err.limit
    });

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 2MB limit'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Only one file allowed per upload'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Only "resume" field is allowed'
      });
    }

    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`
    });
  }

  if (err) {
    logger.error('Non-multer file upload error:', err.message);
    return res.status(400).json({
      success: false,
      error: err.message || 'File upload failed'
    });
  }

  next();
};

/**
 * POST /api/resume/upload
 * Upload and analyze a resume
 * Expected body: multipart/form-data with 'resume' file field
 * Returns: { success: boolean, score: number, skills: [], missingSkills: [], suggestions: [], usage: {...} }
 */
router.post(
  '/resume/upload',
  checkUsageLimit,
  upload.single('resume'),
  multerErrorHandler,
  asyncHandler(resumeController.uploadAndAnalyze)
);

/**
 * GET /api/usage/stats
 * Get current usage statistics without using an analysis
 * Returns: { used: number, remaining: number, limit: number, percentage: number }
 */
router.get('/usage/stats', (req, res) => {
  try {
    const stats = usageService.getStats();
    res.status(200).json({
      success: true,
      usage: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching usage stats'
    });
  }
});

export default router;

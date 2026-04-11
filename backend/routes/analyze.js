/**
 * Resume Analysis Routes
 * API endpoints for resume upload and analysis
 */

import express from 'express';
import multer from 'multer';
import resumeController from '../controllers/resumeController.js';
import { checkUsageLimit } from '../middleware/usageLimit.js';
import usageService from '../services/usageService.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

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
  resumeController.uploadAndAnalyze
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
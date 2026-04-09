import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { usageLimiter } from '../middleware/usageLimiter.js';
import { analyzeResume } from '../controllers/analyzeController.js';

const router = Router();

router.post('/', usageLimiter, upload.single('resume'), analyzeResume);

export default router;

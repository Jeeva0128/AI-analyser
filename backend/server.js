/**
 * Main Server File
 * Initializes and configures the Express application
 */

// ============================
// ENV CONFIG
// ============================
import dotenv from 'dotenv';
dotenv.config();

// ============================
// IMPORTS
// ============================
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import analyzeRoute from './routes/analyze.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

// ============================
// APP INIT
// ============================
const app = express();

// ============================
// MIDDLEWARE
// ============================

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'https://ai-analyser-nu.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove undefined/null values
    
    // Log for debugging
    if (origin) {
      logger.info('CORS Origin check', { 
        origin, 
        allowed: allowedOrigins.includes(origin),
        environment: process.env.NODE_ENV 
      });
    }
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked origin', { origin, allowed: allowedOrigins });
      callback(new Error(`CORS Error: Origin '${origin}' not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter (general)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Upload limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Too many upload attempts, please try again later.'
});
app.use('/api/resume/upload', uploadLimiter);

// ============================
// ROUTES
// ============================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Backend is running 🚀',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', analyzeRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// ============================
// ERROR HANDLER
// ============================
app.use(errorHandler);

// ============================
// SERVER START
// ============================
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  logger.info(`✅ Server running on http://localhost:${PORT} [${NODE_ENV}]`);
  logger.info('Resume Analyzer Backend initialized successfully');
});
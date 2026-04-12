/**
 * Main Server File
 * Initializes and configures the Express application
 */
// ============================
// ENV CONFIG
// ============================
import dotenv from 'dotenv';
dotenv.config();

// Enable MOCK mode if needed
const MOCK_MODE = process.env.MOCK_MODE === 'true' || !process.env.GEMINI_API_KEY;
if (MOCK_MODE) {
  console.log('\n⚠️  MOCK MODE ENABLED - Using mock responses (no real API calls)');
  console.log('   Set GEMINI_API_KEY in .env to use real Gemini API\n');
}

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

// FIRST: Catch-all logger BEFORE everything else
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    contentType: req.get('content-type')?.substring(0, 50)
  });
  next();
});

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

// Rate limiters (apply BEFORE routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    });
  }
});
app.use(limiter);

// DISABLED FOR TESTING - pass-through middleware
const uploadLimiter = (req, res, next) => next();

// ============================
// ROUTES (MULTER FIRST - NO BODY PARSER)
// ============================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Backend is running 🚀',
    timestamp: new Date().toISOString(),
    timestamp_ms: Date.now()
  });
});

// Test Gemini API key (direct route, before /api router)
app.get('/api/test-key', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test route is working!',
    apiKey: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

// API routes with multer (before body parser)
app.use('/api/resume/upload', uploadLimiter); // Apply upload limiter to prevent abuse
app.use('/api', analyzeRoute);

// Body parser (AFTER file upload routes)
// This ensures multipart/form-data is handled by multer, not body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 404 handler - use regex pattern for Express 5.x
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

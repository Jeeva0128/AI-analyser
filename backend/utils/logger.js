/**
 * Simple logger utility for consistent logging across the application
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, '..', 'app.log');

// Helper to write to log file
const writeLog = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const logLine = `[${level}] ${timestamp} - ${message} ${data ? JSON.stringify(data) : ''}\n`;
  
 // Write to console
  if (level === 'INFO') console.log(logLine.trim());
  else if (level === 'ERROR') console.error(logLine.trim());
  else if (level === 'WARN') console.warn(logLine.trim());
  
  // Write to file (async, don't block)
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err && level === 'ERROR') console.error('Failed to write log:', err);
  });
};

const logger = {
  info: (message, data = '') => {
    writeLog('INFO', message, data);
  },
  error: (message, error = '') => {
    writeLog('ERROR', message, error);
  },
  warn: (message, data = '') => {
    writeLog('WARN', message, data);
  },
  debug: (message, data = '') => {
    if (process.env.NODE_ENV === 'development') {
      writeLog('DEBUG', message, data);
    }
  }
};

export default logger;

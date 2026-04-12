/**
 * PDF processing service
 * Handles PDF file reading and text extraction using pdfjs-dist v5 (ESM)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import logger from '../utils/logger.js';
import validators from '../utils/validators.js';

// Resolve __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the legacy pdfjs-dist build (no DOM / canvas requirement — perfect for Node.js)
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Point to the bundled worker so pdfjs-dist can parse documents
// Convert path to file:// URL for proper ESM module resolution in Node.js
const workerFilePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'pdfjs-dist',
  'legacy',
  'build',
  'pdf.worker.mjs'
);
const workerUrl = pathToFileURL(workerFilePath).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const standardFontDataPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'pdfjs-dist',
  'standard_fonts'
);
const standardFontDataUrl = `${pathToFileURL(standardFontDataPath).href}/`;

class PDFService {
  /**
   * Extract text from PDF file
   * @param {string} filePath - Path to the PDF file
   * @returns {Promise<string>} Extracted text from PDF
   */
  async extractTextFromPDF(filePath) {
    let loadingTask = null;
    let pdfDoc = null;

    try {
      logger.info('Starting PDF extraction', { filePath });
      
      // Validate input
      if (!filePath || typeof filePath !== 'string') {
        const error = new Error('Invalid filePath: ' + JSON.stringify(filePath));
        error.statusCode = 400;
        throw error;
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        const error = new Error(`File not found: ${filePath}`);
        error.statusCode = 400;
        throw error;
      }

      // Read file into a Uint8Array as required by pdfjs-dist
      const fileBuffer = fs.readFileSync(filePath);
      const data = new Uint8Array(fileBuffer);

      logger.info('PDF file read', { fileSize: data.length });

      // Load the PDF document
      loadingTask = pdfjsLib.getDocument({
        data,
        disableAutoFetch: true,
        disableStream: true,
        standardFontDataUrl,
      });

      pdfDoc = await loadingTask.promise;
      logger.info('PDF document loaded', { numPages: pdfDoc.numPages });

      const pageTexts = [];

      // Iterate each page and extract text content
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Concatenate all text items on this page
        const pageText = textContent.items
          .map((item) => item.str || '')
          .join(' ');

        pageTexts.push(pageText);
      }

      // Combine pages and normalise whitespace
      const fullText = pageTexts.join('\n').replace(/\s+/g, ' ').trim();

      logger.info('Text extracted', {
        length: fullText.length,
        preview: fullText.substring(0, 120),
      });

      if (!fullText || fullText.length === 0) {
        throw new Error('No readable text found in PDF');
      }

      // Validate against resume heuristics
      const validation = validators.isValidResumeText(fullText);
      if (!validation.valid) {
        logger.warn('Resume text validation failed', { error: validation.error });
        const error = new Error(validation.error);
        error.statusCode = 400;
        throw error;
      }

      logger.info('PDF text extracted successfully', { length: fullText.length });
      return fullText;
    } catch (error) {
      logger.error('Error extracting text from PDF', {
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
        fullError: JSON.stringify(error, null, 2)
      });

      // Re-throw validation / business errors unchanged
      if (error.statusCode === 400) {
        throw error;
      }

      const err = new Error('Failed to extract text from PDF: ' + error.message);
      err.statusCode = 400;
      throw err;
    } finally {
      if (pdfDoc) {
        try {
          await pdfDoc.cleanup();
        } catch (cleanupError) {
          logger.warn('Error during PDF document cleanup', {
            message: cleanupError.message
          });
        }

        try {
          await pdfDoc.destroy();
        } catch (destroyError) {
          logger.warn('Error destroying PDF document', {
            message: destroyError.message
          });
        }
      } else if (loadingTask) {
        try {
          await loadingTask.destroy();
        } catch (destroyError) {
          logger.warn('Error destroying PDF loading task', {
            message: destroyError.message
          });
        }
      }
    }
  }

  /**
   * Clean up temporary uploaded file
   * @param {string} filePath - Path to the file to delete
   */
  async cleanUpFile(filePath) {
    if (!filePath) {
      return false;
    }

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (!fs.existsSync(filePath)) {
          return true;
        }

        await fs.promises.unlink(filePath);
        logger.info('Temporary file cleaned up', { filePath, attempt });
        return true;
      } catch (error) {
        const shouldRetry = ['EPERM', 'EBUSY'].includes(error.code) && attempt < maxAttempts;

        if (!shouldRetry) {
          logger.warn('Error cleaning up file:', error.message);
          return false;
        }

        await new Promise((resolve) => setTimeout(resolve, attempt * 200));
      }
    }

    return false;
  }
}

export default new PDFService();

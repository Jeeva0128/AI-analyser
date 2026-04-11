/**
 * PDF processing service
 * Handles PDF file reading and text extraction
 */

import fs from 'fs';
import logger from '../utils/logger.js';
import validators from '../utils/validators.js';

class PDFService {
  /**
   * Extract text from PDF file
   * @param {string} filePath - Path to the PDF file
   * @returns {Promise<string>} Extracted text from PDF
   */
  async extractTextFromPDF(filePath) {
    try {
      logger.info('Starting PDF extraction', { filePath });
      
      const dataBuffer = fs.readFileSync(filePath);
      logger.info('PDF file read', { fileSize: dataBuffer.length });

      // Extract text from PDF buffer (simplified - gets readable text)
      // This extracts ASCII text from the PDF binary data
      const text = this.extractTextFromBuffer(dataBuffer);
      
      if (!text || text.length === 0) {
        throw new Error('No readable text found in PDF');
      }

      logger.info('Text extracted', { length: text.length, preview: text.substring(0, 100) });

      // Validate extracted text
      const validation = validators.isValidResumeText(text);
      if (!validation.valid) {
        logger.warn('Resume text validation failed', { error: validation.error });
        const error = new Error(validation.error);
        error.statusCode = 400;
        throw error;
      }

      logger.info('PDF text extracted successfully', { length: text.length });
      return text;
    } catch (error) {
      logger.error('Error extracting text from PDF', { 
        message: error.message, 
        statusCode: error.statusCode 
      });

      if (error.statusCode === 400) {
        throw error;
      }

      const err = new Error('Failed to extract text from PDF: ' + error.message);
      err.statusCode = 400;
      throw err;
    }
  }

  /**
   * Extract readable text from PDF buffer
   * @param {Buffer} buffer - PDF file buffer
   * @returns {string} Extracted text
   */
  extractTextFromBuffer(buffer) {
    try {
      // Convert buffer to string
      let text = buffer.toString('latin1');
      
      // Remove common PDF binary chunks
      text = text.replace(/xref[\s\S]*?startxref[\s\S]*?%%EOF/g, ' ');
      text = text.replace(/stream[\s\S]{0,100}?endstream/g, ' ');
      text = text.replace(/obj[\s\S]{0,50}?endobj/g, ' ');
      
      // Remove control characters
      text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, ' ');
      
      // Remove PDF operators and metadata
      text = text.replace(/\/[A-Za-z]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s+cm/g, ' ');
      text = text.replace(/BT\s.*?\sET/gs, ' ');
      text = text.replace(/\([^)]*\)\s+Tj/g, ' ');
      text = text.replace(/[<\[\](){}]/g, ' ');
      
      // Keep only printable ASCII and common characters
      text = text.split('').filter(char => {
        const code = char.charCodeAt(0);
        return (code >= 32 && code <= 126) || code === 9 || code === 10 || code === 13;
      }).join('');
      
      // Remove extra whitespace
      text = text.replace(/\s+/g, ' ').trim();
      
      // Only keep first 30KB of readable text
      text = text.substring(0, 30 * 1024);
      
      logger.info('Extracted text stats', { 
        originalLength: buffer.length, 
        extractedLength: text.length,
        wordCount: text.split(/\s+/).length
      });
      
      return text;
    } catch (error) {
      logger.error('Error in extractTextFromBuffer:', error.message);
      return '';
    }
  }

  /**
   * Clean up temporary uploaded file
   * @param {string} filePath - Path to the file to delete
   */
  cleanUpFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info('Temporary file cleaned up', { filePath });
      }
    } catch (error) {
      logger.warn('Error cleaning up file:', error.message);
    }
  }
}

export default new PDFService();

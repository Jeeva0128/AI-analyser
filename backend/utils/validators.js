/**
 * Validation utility functions
 */

const validators = {
  isValidFile: (file) => {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    const maxFileSize = 2 * 1024 * 1024; // 2MB
    const allowedMimeTypes = ['application/pdf'];

    if (file.size > maxFileSize) {
      return { valid: false, error: 'File size exceeds 2MB limit' };
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Only PDF files are allowed' };
    }

    return { valid: true };
  },

  isValidResumeText: (text) => {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: 'Resume text is empty' };
    }

    // Minimum 20 characters (less strict than before)
    if (text.trim().length < 20) {
      return { valid: false, error: 'Resume text is too short' };
    }

    // Prevent extremely large resume texts (potential DoS attack)
    const maxLength = 50 * 1024; // 50KB of text
    if (text.length > maxLength) {
      return { valid: false, error: 'Resume text is too large (max 50KB)' };
    }

    return { valid: true };
  }
};

export default validators;

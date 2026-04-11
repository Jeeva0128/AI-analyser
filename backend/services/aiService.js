/**
 * AI Service for resume analysis using Google Gemini
 * Communicates with Google Generative AI API to analyze resumes
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  /**
   * Initialize AI connection lazily
   */
  initializeAI() {
    if (this.model) {
      return; // Already initialized
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error('GEMINI_API_KEY not found in environment. AI features will be unavailable.');
      throw new Error('API key not configured');
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
      logger.info('Gemini AI initialized successfully');
    } catch (error) {
      logger.error('Error initializing Gemini AI:', error.message);
      throw error;
    }
  }

  /**
   * Analyze resume and generate structured response
   * @param {string} resumeText - The extracted resume text
   * @returns {Promise<Object>} Analysis results including score, skills, suggestions
   */
  async analyzeResume(resumeText) {
    try {
      // Initialize AI on first use
      this.initializeAI();

      if (!this.model) {
        throw new Error('AI model not initialized');
      }

      logger.info('Starting resume analysis with Gemini AI');
      
      const prompt = this.buildAnalysisPrompt(resumeText);
      logger.info('Analysis prompt created', { textLength: resumeText.length });

      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const analysisText = response.text();
        
        logger.info('AI response received', { responseLength: analysisText.length });

        const analysis = this.parseAnalysisResponse(analysisText);

        logger.info('Resume analyzed successfully');

        return analysis;
      } catch (apiError) {
        logger.error('Gemini API Error:', {
          message: apiError.message,
          errorType: apiError.constructor.name,
          status: apiError.status,
          details: apiError.toString()
        });
        throw apiError;
      }
    } catch (error) {
      logger.error('Error analyzing resume with AI:', {
        message: error.message,
        errorType: error.constructor.name,
        status: error.status,
        fullError: error.toString()
      });

      const err = new Error('Failed to analyze resume. Please try again.');
      err.statusCode = 503;
      throw err;
    }
  }

  /**
   * Generate an AI-improved version of the resume
   * @param {string} resumeText - Original resume text
   * @param {Object} analysis - Analysis results for context
   * @returns {Promise<string>} Improved resume text
   */
  async generateImprovedResume(resumeText, analysis) {
    try {
      this.initializeAI();

      if (!this.model) {
        throw new Error('AI model not initialized');
      }

      logger.info('Starting improved resume generation');

      const prompt = this.buildImprovedResumePrompt(resumeText, analysis);

      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const improvedText = response.text();

        logger.info('Improved resume generated successfully', { length: improvedText.length });

        return improvedText;
      } catch (apiError) {
        logger.error('Gemini API Error during improvement:', {
          message: apiError.message,
          status: apiError.status,
        });
        throw apiError;
      }
    } catch (error) {
      logger.error('Error generating improved resume:', {
        message: error.message,
      });
      // Return empty string on error instead of throwing
      return '';
    }
  }

  /**
   * Build prompt for generating improved resume
   * @param {string} resumeText - Original resume text
   * @param {Object} analysis - Analysis results
   * @returns {string} Formatted prompt
   */
  buildImprovedResumePrompt(resumeText, analysis) {
    return `You are a professional resume writer. Improve the following resume based on these insights:
- Missing Skills: ${(analysis.missingSkills || []).join(', ')}
- Suggestions for improvement:
${(analysis.suggestions || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

IMPORTANT INSTRUCTIONS:
1. Keep the EXACT same structure and sections as the original
2. Only improve the wording, add better action verbs, and incorporate missing skills naturally
3. Make it more impactful while keeping it realistic and honest
4. Do NOT add fake experiences or skills not mentioned in original
5. Do NOT change the layout - keep it as plain text
6. Start directly with the improved resume, no introduction or explanation

ORIGINAL RESUME:
${resumeText}

IMPROVED RESUME:`;
  }

  /**
   * Build the prompt for AI analysis
   * @param {string} resumeText - Resume text to analyze
   * @returns {string} Formatted prompt
   */
  buildAnalysisPrompt(resumeText) {
    return `Analyze the following resume and provide a detailed JSON response with the following structure:
{
  "score": <0-100 ATS score>,
  "skills": ["skill1", "skill2", ...],
  "missingSkills": ["missing1", "missing2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...]
}

Resume:
${resumeText}

Provide ONLY valid JSON response, no additional text or markdown. 
- ATS score: Rate how well the resume is optimized for Applicant Tracking Systems (0-100)
- Skills: Extract all technical and soft skills mentioned (max 20)
- Missing Skills: Identify common skills that should be added for better opportunities (max 10)
- Suggestions: Provide specific, actionable improvements (max 10)`;
  }

  /**
   * Parse and validate AI response
   * @param {string} responseText - Raw response from AI
   * @returns {Object} Parsed analysis object
   */
  parseAnalysisResponse(responseText) {
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      logger.info('Attempting to parse AI response', { 
        originalLength: responseText.length,
        cleanedLength: cleanedText.length,
        preview: cleanedText.substring(0, 200) 
      });

      const analysis = JSON.parse(cleanedText);

      logger.info('Successfully parsed AI response', { 
        hasScore: typeof analysis.score === 'number',
        hasSkills: Array.isArray(analysis.skills),
        hasMissing: Array.isArray(analysis.missingSkills),
        hasSuggestions: Array.isArray(analysis.suggestions),
        score: analysis.score
      });

      // Validate structure
      if (
        typeof analysis.score !== 'number' ||
        !Array.isArray(analysis.skills) ||
        !Array.isArray(analysis.missingSkills) ||
        !Array.isArray(analysis.suggestions)
      ) {
        logger.warn('Invalid response structure detected', {
          score: typeof analysis.score,
          skills: Array.isArray(analysis.skills),
          missingSkills: Array.isArray(analysis.missingSkills),
          suggestions: Array.isArray(analysis.suggestions)
        });
        throw new Error('Invalid response structure from AI');
      }

      // Ensure score is within 0-100
      analysis.score = Math.max(0, Math.min(100, analysis.score));

      return {
        success: true,
        score: analysis.score,
        skills: analysis.skills.slice(0, 20), // Limit to 20 skills
        missingSkills: analysis.missingSkills.slice(0, 10),
        suggestions: analysis.suggestions.slice(0, 10)
      };
    } catch (error) {
      logger.error('Error parsing AI response:', {
        message: error.message,
        responseLength: responseText?.length || 0,
        responsePreview: responseText?.substring(0, 500) || 'N/A',
        errorType: error.constructor.name
      });

      // Return error response instead of default fallback
      return {
        success: false,
        score: 0,
        skills: [],
        missingSkills: [],
        suggestions: ['AI analysis parsing failed. Please try uploading your resume again.'],
        error: 'Failed to parse AI response: ' + error.message
      };
    }
  }
}

export default new AIService();

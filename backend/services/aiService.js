/**
 * AI Service for resume analysis using Google Gemini
 * Falls back to mock data on API errors
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  /**
   * Analyze resume using Gemini API
   * @param {string} resumeText - The extracted resume text
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeResume(resumeText) {
    try {
      logger.info('analyzeResume() called', {
        textLength: resumeText?.length || 0
      });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.includes('your-')) {
        logger.warn('Gemini API key not configured, using mock analysis');
        return this.getMockAnalysis(resumeText);
      }

      // Initialize Gemini
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Call API
      const prompt = this.buildAnalysisPrompt(resumeText);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      logger.info('✅ Gemini API response received', { length: content.length });

      // Parse response
      return this.parseAnalysisResponse(content);
    } catch (error) {
      logger.warn('Gemini API error:', error.message);
      
      // Check if quota exceeded or rate limited
      if (this.isQuotaExceededError(error)) {
        logger.warn('⚠️ Quota exceeded - using mock analysis');
        const mockData = this.getMockAnalysis(resumeText);
        mockData.warning = 'Using mock data (API quota exceeded - resets daily)';
        return mockData;
      }
      
      // Other errors - also use mock
      logger.warn('⚠️ API error - falling back to mock analysis');
      const mockData = this.getMockAnalysis(resumeText);
      mockData.warning = 'Using mock data (API temporarily unavailable)';
      return mockData;
    }
  }

  /**
   * Check if error is quota exceeded
   */
  isQuotaExceededError(error) {
    const message = (error?.message || '').toLowerCase();
    return (
      message.includes('quota') ||
      message.includes('rate limit') ||
      message.includes('429') ||
      message.includes('too many requests')
    );
  }

  /**
   * Build the prompt for Gemini analysis
   */
  buildAnalysisPrompt(resumeText) {
    return `You are an expert ATS (Applicant Tracking System) optimizer and professional resume analyst. Analyze the given resume and provide ONLY a valid JSON response with NO additional text or markdown.

RESPOND WITH ONLY THIS JSON (no code blocks, no intro, no explanation):
{
  "score": <number 0-100>,
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "missingSkills": ["missing1", "missing2", "missing3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4"]
}

REQUIREMENTS:
- score: Rate ATS optimization (0-100). Higher = better keywords, formatting, structure
- skills: Extract 3-5 key technical/professional skills explicitly mentioned
- missingSkills: Identify 3-4 skills commonly sought in the person's role that are missing
- suggestions: Provide 4 specific, actionable improvements

RESUME:
${resumeText}`;
  }

  /**
   * Parse and validate Gemini response
   */
  parseAnalysisResponse(responseText) {
    try {
      // Clean up response - remove markdown code blocks if present
      let cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      logger.info('Parsing Gemini response', { 
        length: cleanedText.length,
        preview: cleanedText.substring(0, 150)
      });

      const analysis = JSON.parse(cleanedText);

      // Validate structure
      if (
        typeof analysis.score !== 'number' ||
        !Array.isArray(analysis.skills) ||
        !Array.isArray(analysis.missingSkills) ||
        !Array.isArray(analysis.suggestions)
      ) {
        throw new Error('Invalid response structure');
      }

      // Ensure score is within 0-100
      analysis.score = Math.max(0, Math.min(100, Math.round(analysis.score)));

      return {
        success: true,
        score: analysis.score,
        skills: analysis.skills.slice(0, 10),
        missingSkills: analysis.missingSkills.slice(0, 10),
        suggestions: analysis.suggestions.slice(0, 10)
      };
    } catch (error) {
      logger.error('Error parsing Gemini response:', error.message);
      throw error;
    }
  }

  /**
   * Generate mock analysis data with resume-based scoring
   */
  getMockAnalysis(resumeText) {
    const hasEducation = /education|degree|bachelor|master|diploma|university|institute/i.test(resumeText || '');
    const hasSkills = /skills|proficient|expertise|knowledge|proficiency|programming|technical/i.test(resumeText || '');
    const hasExperience = /experience|worked|years|professional|employment|position|role/i.test(resumeText || '');
    const hasAchievements = /achieved|accomplished|increased|improved|led|managed|optimized|enhanced/i.test(resumeText || '');
    
    let baseScore = 45;
    if (hasEducation) baseScore += 12;
    if (hasSkills) baseScore += 13;
    if (hasExperience) baseScore += 15;
    if (hasAchievements) baseScore += 15;

    const finalScore = Math.min(baseScore, 95);

    return {
      success: true,
      score: finalScore,
      skills: [
        'Communication',
        'Problem Solving', 
        'Team Collaboration',
        'Time Management',
        'Attention to Detail'
      ],
      missingSkills: [
        'Project Management',
        'Technical Documentation',
        'Agile/Scrum Methodology',
        'Data Analysis'
      ],
      suggestions: [
        'Add quantifiable metrics and measurable achievements',
        'Use industry-specific keywords for your target role',
        'Highlight leadership and collaboration examples',
        'Improve formatting consistency and spacing'
      ],
      warning: this.genAI ? 'Using mock data due to API error' : 'Gemini API key not configured - using mock data'
    };
  }

  /**
   * Generate an improved version of the resume
   * @param {string} resumeText - Original resume text
   * @param {Object} analysis - Analysis results
   * @returns {Promise<string>} Improved resume text
   */
  async generateImprovedResume(resumeText, analysis) {
    try {
      logger.info('generateImprovedResume() called');
      
      // Return empty string since we're using mock analysis
      // Real implementation would use Gemini API
      return '';
    } catch (error) {
      logger.error('Error generating improved resume:', error.message);
      return '';
    }
  }
}

export default new AIService();

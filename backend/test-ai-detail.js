/**
 * Detailed Gemini analysis test - mirrors aiService.js exactly
 * Run: node test-ai-detail.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Step 1: Extract PDF text (reuse pdfService)
console.log('\n[1] Extracting PDF text...');
const { default: pdfService } = await import('./services/pdfService.js');
const resumeText = await pdfService.extractTextFromPDF(path.resolve(__dirname, 'resume.pdf'));
console.log('✅ PDF extracted:', resumeText.length, 'chars');

// Step 2: Try Gemini with responseMimeType: application/json (as in aiService)
console.log('\n[2] Testing Gemini WITH responseMimeType: application/json ...');
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const models = ['models/gemini-2.5-flash', 'models/gemini-2.0-flash', 'models/gemini-1.5-flash'];

for (const modelName of models) {
  console.log(`\n   Model: ${modelName}`);
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Analyze this resume and return ONLY JSON with no extra text:
{"score": <0-100>, "skills": ["skill1"], "missingSkills": ["missing1"], "suggestions": ["suggestion1"]}

RESUME:
${resumeText.substring(0, 3000)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('   ✅ Response received, length:', text.length);
    console.log('   Preview:', text.substring(0, 200));
    
    const parsed = JSON.parse(text);
    console.log('   ✅ JSON parsed successfully!');
    console.log('   Score:', parsed.score);
    console.log('   Skills:', parsed.skills?.slice(0,3));
    break;
  } catch (err) {
    console.error('   ❌ Error:', err.message);
    if (err.status) console.error('      HTTP status:', err.status);
    if (err.errorDetails) console.error('      Details:', JSON.stringify(err.errorDetails, null, 2));
    // Show full error for debugging
    console.error('      Full error keys:', Object.keys(err));
  }
}

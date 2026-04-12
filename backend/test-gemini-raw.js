/**
 * Minimal Gemini API test - no service wrappers
 * Run: node test-gemini-raw.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key present:', !!apiKey);
console.log('API Key prefix:', apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING');

const genAI = new GoogleGenerativeAI(apiKey);

// Try each model
const models = [
  'models/gemini-2.5-flash',
  'models/gemini-2.0-flash',
  'models/gemini-1.5-flash',
  'gemini-pro',
  'gemini-1.5-pro',
];

for (const modelName of models) {
  console.log(`\n--- Testing model: ${modelName} ---`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say exactly: {"test":"ok"}');
    const text = result.response.text();
    console.log('✅ SUCCESS:', text.substring(0, 100));
    break;
  } catch (err) {
    console.error('❌ FAILED:', err.message);
    if (err.status) console.error('   Status:', err.status);
    if (err.errorDetails) console.error('   Details:', JSON.stringify(err.errorDetails));
  }
}

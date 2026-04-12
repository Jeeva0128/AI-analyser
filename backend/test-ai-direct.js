/**
 * Direct AI analysis test
 * Tests analyzeResume() directly with extracted PDF text
 */

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_PATH = path.resolve(__dirname, 'resume.pdf');

console.log('\n════════════════════════════════════');
console.log(' TESTING AI SERVICE DIRECTLY');
console.log('════════════════════════════════════\n');

try {
  // Step 1: Extract PDF
  console.log('1. Extracting PDF...');
  const { default: pdfService } = await import('./services/pdfService.js');
  const resumeText = await pdfService.extractTextFromPDF(PDF_PATH);
  console.log(`   ✅ Extracted ${resumeText.length} characters\n`);

  // Step 2: Call AIService directly with timeout
  console.log('2. Calling aiService.analyzeResume()...');
  const { default: aiService } = await import('./services/aiService.js');
  
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('AI analysis timeout - API not responding')), 60000)
  );
  
  const analysisPromise = aiService.analyzeResume(resumeText);
  
  const analysis = await Promise.race([analysisPromise, timeoutPromise]);
  
  console.log(`   ✅ AI Service returned\n`);
  console.log('   Response:', JSON.stringify(analysis, null, 2));
  
  if (analysis.success === false) {
    console.log('\n   ❌ ERROR:', analysis.error);
    process.exit(1);
  } else {
    console.log('\n   ✅ SUCCESS - Analysis complete');
  }

} catch (err) {
  console.error('\n❌ ERROR:', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
}

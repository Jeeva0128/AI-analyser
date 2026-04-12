/**
 * Staged diagnostic: PDF extraction → AI analysis → full flow
 * Run: node test-diagnose.js
 */
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_PATH = path.resolve(__dirname, 'resume.pdf');

// ── Stage 1: PDF extraction ──────────────────────────────────────────────────
console.log('\n══════════════════════════════════');
console.log(' STAGE 1: PDF Text Extraction');
console.log('══════════════════════════════════');

let resumeText = '';
try {
  const { default: pdfService } = await import('./services/pdfService.js');
  resumeText = await pdfService.extractTextFromPDF(PDF_PATH);
  console.log('✅ PDF extracted successfully');
  console.log('   Characters:', resumeText.length);
  console.log('   Preview   :', resumeText.substring(0, 200).replace(/\n/g, ' '));
} catch (err) {
  console.error('❌ PDF extraction FAILED:', err.message);
  process.exit(1);
}

// ── Stage 2: AI analysis ─────────────────────────────────────────────────────
console.log('\n══════════════════════════════════');
console.log(' STAGE 2: AI Analysis (Gemini)');
console.log('══════════════════════════════════');
console.log('   API Key present:', !!process.env.GEMINI_API_KEY);
console.log('   Model env      :', process.env.GEMINI_MODEL || '(using default)');

try {
  const { default: aiService } = await import('./services/aiService.js');
  console.log('   Calling analyzeResume() ...');
  const analysis = await aiService.analyzeResume(resumeText);
  if (analysis.success === false) {
    console.error('❌ AI analysis returned error:', analysis.error);
  } else {
    console.log('✅ AI analysis succeeded');
    console.log('   Score        :', analysis.score);
    console.log('   Skills       :', analysis.skills);
    console.log('   Missing Skills:', analysis.missingSkills);
    console.log('   Suggestions  :', analysis.suggestions);
  }
} catch (err) {
  console.error('❌ AI analysis FAILED:', err.message);
  if (err.status) console.error('   HTTP Status  :', err.status);
  process.exit(1);
}

console.log('\n══════════════════════════════════');
console.log(' ALL STAGES PASSED ✅');
console.log('══════════════════════════════════\n');

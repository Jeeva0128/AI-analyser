/**
 * Simulated upload test - loads file and calls controller directly
 */

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock Express request/response
class MockFile {
  constructor(filename, path) {
    this.fieldname = 'resume';
    this.originalname = filename;
    this.mimetype = 'application/pdf';
    this.path = path;
    this.size = fs.statSync(path).size;
  }
}

class MockRequest {
  constructor(file) {
    this.file = file;
  }
}

class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.data = null;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(data) {
    this.data = data;
    console.log('Response:', JSON.stringify(data, null, 2));
  }
}

console.log('\n════════════════════════════════════');
console.log(' SIMULATED UPLOAD TEST');
console.log('════════════════════════════════════\n');

try {
  // Create a temp file to simulate upload
  const pdfPath = path.resolve(__dirname, 'resume.pdf');
  const tempPath = path.resolve(__dirname, 'uploads', 'temp-' + Date.now() + '.pdf');
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Copy file to simulate multer
  fs.copyFileSync(pdfPath, tempPath);
  console.log('✅ Copied PDF to temp upload location:', tempPath);
  console.log('   File size:', fs.statSync(tempPath).size, 'bytes\n');

  // Create mock request/response
  const mockFile = new MockFile('resume.pdf', tempPath);
  const req = new MockRequest(mockFile);
  const res = new MockResponse();

  console.log('Calling resumeController.uploadAndAnalyze()...\n');

  // Call controller
  const { default: controller } = await import('./controllers/resumeController.js');
  const next = (err) => {
    if (err) {
      console.error('❌ Controller error via next():', err.message);
      res.statusCode = err.statusCode || 500;
      res.data = {
        success: false,
        error: err.message
      };
    }
  };

  await controller.uploadAndAnalyze(req, res, next);

  if (res.statusCode === 200) {
    console.log('\n✅ SUCCESS - Upload completed');
    console.log('   Status:', res.statusCode);
    console.log('   Has analysis:', !!res.data.score);
    console.log('   Score:', res.data.score);
  } else {
    console.log('\n❌ FAILED');
    console.log('   Status:', res.statusCode);
  }

  // Cleanup
  try {
    fs.unlinkSync(tempPath);
  } catch (e) {
    // ignore
  }

} catch (err) {
  console.error('\n❌ ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
}

/**
 * Test script: Upload resume.pdf and print the full API response
 * Run with: node test-upload-check.js
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, 'resume.pdf');
const fileData = fs.readFileSync(filePath);
const boundary = 'UploadBoundary' + Date.now();

const CRLF = '\r\n';
const body = Buffer.concat([
  Buffer.from('--' + boundary + CRLF),
  Buffer.from(`Content-Disposition: form-data; name="resume"; filename="resume.pdf"${CRLF}`),
  Buffer.from(`Content-Type: application/pdf${CRLF}${CRLF}`),
  fileData,
  Buffer.from(`${CRLF}--${boundary}--${CRLF}`)
]);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/resume/upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length
  }
};

console.log('🚀 Sending resume to http://localhost:5000/api/resume/upload ...\n');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      if (parsed.success) {
        console.log('\n✅ SUCCESS!');
        console.log('Score:', parsed.score);
        console.log('Skills:', parsed.skills);
        console.log('Missing Skills:', parsed.missingSkills);
        console.log('Suggestions:', parsed.suggestions);
        console.log('Has improvedResume:', !!parsed.improvedResume);
        console.log('Usage:', parsed.usage);
      } else {
        console.log('\n❌ FAILED:', parsed.error);
        console.log('Full response:', JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log('❌ Could not parse JSON response:');
      console.log(data.substring(0, 2000));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Connection error:', e.message);
  console.error('   Make sure backend is running: node server.js');
});

req.write(body);
req.end();

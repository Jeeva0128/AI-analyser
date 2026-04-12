/**
 * Test upload with proper multipart/form-data formatting
 * Uses proper boundary and content-length headers
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_PATH = path.resolve(__dirname, 'resume.pdf');

console.log('\n════════════════════════════════════');
console.log(' HTTP UPLOAD TEST WITH PROPER MULTIPART');
console.log('════════════════════════════════════\n');

try {
  const fileBuffer = fs.readFileSync(PDF_PATH);
  const boundary = '----- NYMM-' + Date.now();
  const CRLF = '\r\n';
  
  // Build multipart body
  const parts = [];
  
  // Part 1: file field header
  parts.push('--' + boundary);
  parts.push('Content-Disposition: form-data; name="resume"; filename="resume.pdf"');
  parts.push('Content-Type: application/pdf');
  parts.push('');
  
  // Part 2: file content (binary)
  // We'll insert the buffer in the middle
  
  // Part 3: closing boundary
  const headerText = parts.join(CRLF) + CRLF;
  const footerText = CRLF + '--' + boundary + '--' + CRLF;
  
  const bodyBuffer = Buffer.concat([
    Buffer.from(headerText),
    fileBuffer,
    Buffer.from(footerText)
  ]);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/resume/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Content-Length': bodyBuffer.length
    }
  };

  console.log('Request options:', {
    path: options.path,
    method: options.method,
    'Content-Length': bodyBuffer.length,
    'Content-Type': options.headers['Content-Type']
  });
  console.log('');

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', chunk => { responseData += chunk; });
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('');
      try {
        const json = JSON.parse(responseData);
        if (json.success) {
          console.log('✅ SUCCESS!');
          console.log('   Score:', json.score);
          console.log('   Skills:', json.skills);
          console.log('   Usage:', json.usage);
        } else {
          console.log('❌ FAILED');
          console.log('   Error:', json.error);
        }
      } catch (e) {
        console.log('Response:', responseData.substring(0, 500));
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request error:', e.message);
  });

  req.write(bodyBuffer);
  req.end();

} catch (err) {
  console.error('❌ ERROR:', err.message);
  process.exit(1);
}

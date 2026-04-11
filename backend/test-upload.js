/**
 * Test script to simulate PDF upload
 */

import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Create a simple test PDF (minimal valid PDF structure)
const testPDF = Buffer.from(`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>
endobj
4 0 obj
<< >>
stream
BT
/F1 12 Tf
100 700 Td
(John Doe) Tj
0 -20 Td
(Senior Software Engineer) Tj
0 -20 Td
(Skills: JavaScript, React, Node.js, TypeScript, Python) Tj
0 -20 Td
(Experience: 5 years in full-stack development) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000279 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
402
%%EOF`);

async function testUpload() {
  try {
    console.log('Creating test PDF...');
    const form = new FormData();
    form.append('resume', testPDF, 'test-resume.pdf');

    console.log('Uploading to http://localhost:5000/api/resume/upload...');
    const response = await fetch('http://localhost:5000/api/resume/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.status !== 200) {
      console.error('Upload failed!');
      process.exit(1);
    } else {
      console.log('Upload successful!');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testUpload();

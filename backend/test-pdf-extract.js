import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workerFilePath = path.join(
  __dirname,
  'node_modules',
  'pdfjs-dist',
  'legacy',
  'build',
  'pdf.worker.mjs'
);
const workerUrl = new URL(`file:///${workerFilePath.replace(/\\/g, '/')}`).href;
console.log('Worker URL:', workerUrl);

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
console.log('Worker configured');

// Test loading PDF
const fileBuffer = fs.readFileSync('./resume.pdf');
const data = new Uint8Array(fileBuffer);
console.log('File read, size:', data.length);

const loadingTask = pdfjsLib.getDocument({
  data,
  disableAutoFetch: true,
  disableStream: true,
});
console.log('Loading task created');

try {
  const pdfDoc = await loadingTask.promise;
  console.log('✅ PDF loaded successfully, pages:', pdfDoc.numPages);
  
  const page = await pdfDoc.getPage(1);
  console.log('✅ Page 1 loaded');
  
  const textContent = await page.getTextContent();
  console.log('✅ Text content retrieved, items:', textContent.items.length);
  console.log('First 3 items:', textContent.items.slice(0, 3).map(i => i.str));
  
  const fullText = textContent.items.map(item => item.str || '').join(' ');
  console.log('\n=== EXTRACTED TEXT (first 200 chars) ===');
  console.log(fullText.substring(0, 200));
  console.log('\n✅ SUCCESS: PDF extraction works!');
} catch(err) {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
}

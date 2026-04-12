import pdfService from './services/pdfService.js';

try {
  console.log('Testing pdfService.extractTextFromPDF...');
  const text = await pdfService.extractTextFromPDF('./resume.pdf');
  console.log('✅ PDF text extracted successfully!');
  console.log('Text length:', text.length);
  console.log('First 200 chars:', text.substring(0, 200));
} catch(err) {
  console.error('❌ Error:', err.message);
  console.error('Full error:', err);
}

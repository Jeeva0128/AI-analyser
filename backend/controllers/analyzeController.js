import { createRequire } from 'module';
import { analyzeResumeText } from '../utils/resumeAnalyzer.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function analyzeResume(req, res, next) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        let text = '';

        if (req.file.mimetype === 'application/pdf') {
            const parsed = await pdfParse(req.file.buffer, { version: 'v2.0.550' });
            text = parsed.text;
        } else {
            return res.status(415).json({
                error: 'DOCX support is coming soon. Please upload a PDF file.',
            });
        }

        if (!text.trim()) {
            return res.status(422).json({
                error: 'Could not extract text from the PDF. The file may be scanned or image-based.',
            });
        }

        const result = await analyzeResumeText(text, req.file.originalname, req.file.size);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

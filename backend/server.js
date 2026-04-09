import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    })
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/analyze', analyzeRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

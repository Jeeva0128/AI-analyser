import rateLimit from 'express-rate-limit';

export const usageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: parseInt(process.env.MAX_UPLOADS_PER_HOUR || '10', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many uploads. You can analyze up to 10 resumes per hour. Please try again later.',
    },
});

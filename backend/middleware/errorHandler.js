export function errorHandler(err, _req, res, _next) {
    console.error('Error:', err.message);

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
    }

    const status = err.status || 500;
    res.status(status).json({
        error: err.message || 'Internal server error',
    });
}

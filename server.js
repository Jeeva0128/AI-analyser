/**
 * Frontend Production Server
 * Serves the built Vite application on port 3000
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist directory
const distPath = join(__dirname, 'dist');

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('❌ Error: dist directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Serve static assets with cache
app.use(express.static(distPath, {
  maxAge: '1h',
  etag: false
}));

// SPA fallback - serve index.html for all non-asset routes
app.use((req, res) => {
  // Don't serve HTML for static asset requests
  if (req.path.includes('.')) {
    res.status(404).send('Not found');
    return;
  }
  res.sendFile(join(distPath, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'frontend' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Frontend server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${distPath}`);
  console.log(`🌍 API URL expected: ${process.env.VITE_API_URL || 'http://localhost:5000/api'}`);
});

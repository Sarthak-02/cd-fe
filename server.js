import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const BASE_PATH = '/control-desk-web';

// Health check endpoint for App Engine
app.get('/_ah/health', (req, res) => {
  res.status(200).send('OK');
});

// Liveness probe (accessible at both root and base path)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'control-desk-web',
    basePath: BASE_PATH
  });
});

app.get(`${BASE_PATH}/health`, (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'control-desk-web',
    basePath: BASE_PATH
  });
});

// Serve static files from the dist directory at the base path
app.use(BASE_PATH, express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d', // Cache static assets for 1 day
  setHeaders: (res, filePath) => {
    // Cache HTML files for a shorter time
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
    }
  }
}));

// Redirect root to base path
app.get('/', (req, res) => {
  res.redirect(301, BASE_PATH + '/');
});

// Handle client-side routing - send all requests under base path to index.html
app.get(`${BASE_PATH}/*`, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Service: control-desk-web`);
  console.log(`📍 Base Path: ${BASE_PATH}`);
});

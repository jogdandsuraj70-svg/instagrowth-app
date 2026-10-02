import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import submissionRoutes from './routes/submissions.js';
import adminRoutes from './routes/admin.js';
import { initDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'OmniConnect Backend API',
    version: '1.0.0'
  });
});

// Serve frontend static assets in production
const clientDistPath = path.join(__dirname, '../dist');
app.use(express.static(clientDistPath));

// Catch-all route for SPA routing in production
app.get('*', (req, res) => {
  const indexHtmlPath = path.join(clientDistPath, 'index.html');
  if (req.accepts('html') && !req.path.startsWith('/api')) {
    res.sendFile(indexHtmlPath, (err) => {
      if (err) {
        res.status(404).send('Application build files not found. Please run "npm run build" first.');
      }
    });
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` OmniConnect API Server running on port ${PORT}`);
  console.log(` Base API URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});

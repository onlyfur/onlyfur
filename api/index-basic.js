const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Simple Express app for testing
const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OnlyFur API',
    version: '3.9.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OnlyFur API',
    version: '3.9.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Simple login endpoint (mock for now)
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint is working',
    data: { demo: true }
  });
});

// Simple register endpoint (mock for now)
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Register endpoint is working',
    data: { demo: true }
  });
});

// Catch-all for API routes
app.get('/api*', (req, res) => {
  res.json({
    message: 'API endpoint under development',
    path: req.path
  });
});

app.post('/api*', (req, res) => {
  res.json({
    message: 'API endpoint under development',
    path: req.path
  });
});

// Default route
app.get('*', (req, res) => {
  res.json({
    message: 'OnlyFur Platform API',
    version: '3.9.0',
    endpoints: [
      'GET /api/health',
      'GET /api/status',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('🚀 OnlyFur Platform API Server (Basic)');
    console.log('======================================');
    console.log(`📍 Port: ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log('======================================');
  });
}

module.exports = app;

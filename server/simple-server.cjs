const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'OnlyFur API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      subscriptions: '/api/subscriptions/*'
    }
  });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'User registration endpoint - implementation in progress',
    user: {
      id: 'mock-user-id',
      email: req.body.email || 'test@example.com',
      role: req.body.role || 'user'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'User login endpoint - implementation in progress',
    token: 'mock-jwt-token',
    user: {
      id: 'mock-user-id',
      email: req.body.email || 'test@example.com',
      role: 'user'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'mock-user-id',
      email: 'test@example.com',
      role: 'user',
      subscriptionTier: 'free',
      subscriptionStatus: 'active'
    }
  });
});

// Mock subscription endpoints
app.get('/api/subscriptions/tiers', (req, res) => {
  res.json({
    success: true,
    tiers: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['Basic content access', 'Community participation']
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 999,
        features: ['Full content access', 'Direct messaging', 'Exclusive content']
      },
      {
        id: 'vip',
        name: 'VIP',
        price: 1999,
        features: ['All Premium features', 'Priority support', 'Custom content requests']
      }
    ]
  });
});

app.get('/api/subscriptions/my', (req, res) => {
  res.json({
    success: true,
    subscription: {
      tier: 'free',
      status: 'active',
      startDate: new Date().toISOString(),
      nextBillingDate: null
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OnlyFur API Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API info: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;

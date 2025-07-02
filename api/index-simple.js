const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@onlyfur.net';

// Initialize Prisma
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://onlyfur.net',
        'https://www.onlyfur.net',
        'https://creatorplattform.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OnlyFur API',
    version: '3.9.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OnlyFur API',
    version: '3.9.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Initialize admin user
async function initializeAdminUser() {
  try {
    let adminUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (!adminUser && process.env.ADMIN_PASSWORD) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      
      adminUser = await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          username: 'admin',
          displayName: 'System Administrator',
          password: hashedPassword,
          role: 'ADMIN',
          authProvider: 'EMAIL',
          isActive: true,
          isVerified: true,
          isEmailVerified: true,
          subscriptionStatus: 'ACTIVE',
          subscriptionTier: 'premium'
        }
      });
      
      console.log('✅ Admin user created successfully');
    }
  } catch (error) {
    console.error('❌ Admin user initialization failed:', error.message);
  }
}

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.password) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false,
        error: 'Account is deactivated' 
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          role: user.role,
          isVerified: user.isVerified,
          subscriptionStatus: user.subscriptionStatus,
          avatar: user.avatar
        },
        token: accessToken,
        refreshToken: refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, displayName, password, role } = req.body;

    if (!email || !username || !displayName || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email, username, display name, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters long' 
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        displayName,
        password: hashedPassword,
        role: role?.toUpperCase() === 'CREATOR' ? 'CREATOR' : 'SUBSCRIBER',
        authProvider: 'EMAIL',
        isActive: true,
        isEmailVerified: false,
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: 'free'
      }
    });

    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          displayName: newUser.displayName,
          role: newUser.role,
          isVerified: newUser.isVerified,
          subscriptionStatus: newUser.subscriptionStatus
        },
        token: accessToken,
        refreshToken: refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
});

// Basic endpoints
app.get('/api/status', (req, res) => {
  res.json({ 
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '3.9.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Placeholder routes
app.get('/api/*', (req, res) => {
  res.json({
    success: false,
    error: 'Endpoint not implemented yet',
    path: req.path,
    message: 'This API endpoint is under development'
  });
});

app.post('/api/*', (req, res) => {
  res.json({
    success: false,
    error: 'Endpoint not implemented yet',
    path: req.path,
    message: 'This API endpoint is under development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/status',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
if (require.main === module) {
  initializeAdminUser().then(() => {
    app.listen(PORT, () => {
      console.log('🚀 OnlyFur Platform API Server Started');
      console.log('=====================================');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('📚 Available Endpoints:');
      console.log('   POST /api/auth/login');
      console.log('   POST /api/auth/register');
      console.log('   GET  /api/status');
      console.log('   GET  /api/health');
      console.log('=====================================');
    });
  });
}

// Export for Vercel
module.exports = app;

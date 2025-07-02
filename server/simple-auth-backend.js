const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'onlyfur-development-jwt-secret-key-that-is-at-least-32-characters-long';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'onlyfur-development-jwt-refresh-secret-key-that-is-at-least-32-characters-long';

// In-memory user storage (replace with database in production)
const users = new Map();
const refreshTokens = new Set();

// Initialize with some test users
const initializeTestUsers = async () => {
  const testUsers = [
    {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      password: 'password123',
      role: 'SUBSCRIBER',
      isVerified: true,
      isActive: true,
      subscriptionTier: 'free',
      subscriptionStatus: 'ACTIVE',
      setupComplete: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'creator@example.com',
      username: 'creator',
      displayName: 'Test Creator',
      password: 'password123',
      role: 'CREATOR',
      isVerified: true,
      isActive: true,
      subscriptionTier: 'premium',
      subscriptionStatus: 'ACTIVE',
      setupComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      email: 'admin@onlyfur.net',
      username: 'admin',
      displayName: 'Admin User',
      password: 'admin123',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      subscriptionTier: 'premium',
      subscriptionStatus: 'ACTIVE',
      setupComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const user of testUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    users.set(user.email, { ...user, password: hashedPassword });
  }

  console.log('✅ Test users initialized');
  console.log('📧 Test credentials:');
  console.log('   - test@example.com / password123 (Subscriber)');
  console.log('   - creator@example.com / password123 (Creator)');
  console.log('   - admin@onlyfur.net / admin123 (Admin)');
};

// Middleware
app.use(cors({
  origin: process.env.CLIENT_BASE_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Helper functions
const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });

  refreshTokens.add(refreshToken);
  return { accessToken, refreshToken };
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }

    // Find user
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    if (!user || !user.isActive) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found or inactive' 
      });
    }

    req.user = user;
    next();
  });
};

const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'OnlyFur Authentication Backend is running'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'OnlyFur Authentication API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      me: 'GET /api/auth/me',
      refresh: 'POST /api/auth/refresh',
      logout: 'POST /api/auth/logout',
      setupComplete: 'PATCH /api/auth/setup-complete'
    }
  });
});

// Authentication endpoints

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = users.get(email.toLowerCase());
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Update last login
    user.lastLoginAt = new Date();
    users.set(email.toLowerCase(), user);

    console.log(`✅ User login successful: ${user.email} (${user.role})`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user),
        token: accessToken,
        refreshToken: refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { email: req.body.email, username: req.body.username });
    
    const { email, username, displayName, password, role } = req.body;

    // Validation
    if (!email || !username || !displayName || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: email, username, displayName, password'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username) || username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        error: 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens'
      });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => 
      u.email.toLowerCase() === email.toLowerCase() || 
      u.username.toLowerCase() === username.toLowerCase()
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: String(users.size + 1),
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      displayName: displayName.trim(),
      password: hashedPassword,
      role: role && ['CREATOR', 'SUBSCRIBER'].includes(role.toUpperCase()) ? role.toUpperCase() : 'SUBSCRIBER',
      isVerified: true, // Auto-verify for development
      isActive: true,
      subscriptionTier: 'free',
      subscriptionStatus: 'ACTIVE',
      setupComplete: false, // New users need setup
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    };

    // Store user
    users.set(newUser.email, newUser);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    console.log(`✅ User registered successfully: ${newUser.email} (${newUser.role})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: sanitizeUser(newUser),
        token: accessToken,
        refreshToken: refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
});

// Get current user endpoint
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: sanitizeUser(req.user)
  });
});

// Refresh token endpoint
app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    if (!refreshTokens.has(refreshToken)) {
      return res.status(403).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        refreshTokens.delete(refreshToken);
        return res.status(403).json({
          success: false,
          error: 'Invalid or expired refresh token'
        });
      }

      // Find user
      const user = Array.from(users.values()).find(u => u.id === decoded.userId);
      if (!user || !user.isActive) {
        refreshTokens.delete(refreshToken);
        return res.status(404).json({
          success: false,
          error: 'User not found or inactive'
        });
      }

      // Generate new tokens
      refreshTokens.delete(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      res.json({
        success: true,
        data: {
          user: sanitizeUser(user),
          token: accessToken,
          refreshToken: newRefreshToken
        }
      });
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during token refresh'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during logout'
    });
  }
});

// Complete setup endpoint
app.patch('/api/auth/setup-complete', authenticateToken, (req, res) => {
  try {
    const user = req.user;
    const { bio, interests, profileData } = req.body;

    // Update user setup status
    user.setupComplete = true;
    user.updatedAt = new Date();

    // Update additional profile data if provided
    if (bio) user.bio = bio;
    if (interests) user.interests = interests;
    if (profileData) {
      Object.assign(user, profileData);
    }

    // Update in storage
    users.set(user.email, user);

    console.log(`✅ User setup completed: ${user.email}`);

    res.json({
      success: true,
      message: 'Setup completed successfully',
      data: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Setup complete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during setup completion'
    });
  }
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    await initializeTestUsers();
    
    app.listen(PORT, () => {
      console.log(`🚀 OnlyFur Authentication Backend running on port ${PORT}`);
      console.log(`🔗 Frontend URL: ${process.env.CLIENT_BASE_URL || 'http://localhost:5173'}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📋 API info: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('✅ Server ready for authentication requests');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

startServer();

module.exports = app;

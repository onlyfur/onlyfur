const http = require('http');
const url = require('url');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'onlyfur-development-jwt-secret-key-that-is-at-least-32-characters-long';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'onlyfur-development-jwt-refresh-secret-key-that-is-at-least-32-characters-long';

// In-memory user storage
const users = new Map();
const refreshTokens = new Set();

// Initialize test users
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

const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const authenticateToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
};

// Parse JSON body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
};

// CORS headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_BASE_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

// Send JSON response
const sendJSON = (res, statusCode, data) => {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Create server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${new Date().toISOString()} - ${method} ${path}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Health check
    if (path === '/api/health' && method === 'GET') {
      sendJSON(res, 200, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        message: 'OnlyFur Authentication Backend is running'
      });
      return;
    }

    // API info
    if (path === '/api' && method === 'GET') {
      sendJSON(res, 200, {
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
      return;
    }

    // Login endpoint
    if (path === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        sendJSON(res, 400, {
          success: false,
          error: 'Email and password are required'
        });
        return;
      }

      const user = users.get(email.toLowerCase());
      if (!user) {
        sendJSON(res, 401, {
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      if (!user.isActive) {
        sendJSON(res, 401, {
          success: false,
          error: 'Account is deactivated. Please contact support.'
        });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        sendJSON(res, 401, {
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      const { accessToken, refreshToken } = generateTokens(user);
      user.lastLoginAt = new Date();
      users.set(email.toLowerCase(), user);

      console.log(`✅ User login successful: ${user.email} (${user.role})`);

      sendJSON(res, 200, {
        success: true,
        message: 'Login successful',
        data: {
          user: sanitizeUser(user),
          token: accessToken,
          refreshToken: refreshToken
        }
      });
      return;
    }

    // Register endpoint
    if (path === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const { email, username, displayName, password, role } = body;

      if (!email || !username || !displayName || !password) {
        sendJSON(res, 400, {
          success: false,
          error: 'All fields are required: email, username, displayName, password'
        });
        return;
      }

      if (password.length < 8) {
        sendJSON(res, 400, {
          success: false,
          error: 'Password must be at least 8 characters long'
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        sendJSON(res, 400, {
          success: false,
          error: 'Please provide a valid email address'
        });
        return;
      }

      const existingUser = Array.from(users.values()).find(u => 
        u.email.toLowerCase() === email.toLowerCase() || 
        u.username.toLowerCase() === username.toLowerCase()
      );

      if (existingUser) {
        sendJSON(res, 409, {
          success: false,
          error: 'User with this email or username already exists'
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = {
        id: String(users.size + 1),
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        displayName: displayName.trim(),
        password: hashedPassword,
        role: role && ['CREATOR', 'SUBSCRIBER'].includes(role.toUpperCase()) ? role.toUpperCase() : 'SUBSCRIBER',
        isVerified: true,
        isActive: true,
        subscriptionTier: 'free',
        subscriptionStatus: 'ACTIVE',
        setupComplete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      };

      users.set(newUser.email, newUser);

      const { accessToken, refreshToken } = generateTokens(newUser);

      console.log(`✅ User registered successfully: ${newUser.email} (${newUser.role})`);

      sendJSON(res, 201, {
        success: true,
        message: 'Registration successful',
        data: {
          user: sanitizeUser(newUser),
          token: accessToken,
          refreshToken: refreshToken
        }
      });
      return;
    }

    // Get current user endpoint
    if (path === '/api/auth/me' && method === 'GET') {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        sendJSON(res, 401, {
          success: false,
          error: 'Access token required'
        });
        return;
      }

      const user = authenticateToken(token);
      if (!user) {
        sendJSON(res, 403, {
          success: false,
          error: 'Invalid or expired token'
        });
        return;
      }

      sendJSON(res, 200, {
        success: true,
        data: sanitizeUser(user)
      });
      return;
    }

    // Setup complete endpoint
    if (path === '/api/auth/setup-complete' && method === 'PATCH') {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        sendJSON(res, 401, {
          success: false,
          error: 'Access token required'
        });
        return;
      }

      const user = authenticateToken(token);
      if (!user) {
        sendJSON(res, 403, {
          success: false,
          error: 'Invalid or expired token'
        });
        return;
      }

      const body = await parseBody(req);
      const { bio, interests, profileData } = body;

      user.setupComplete = true;
      user.updatedAt = new Date();

      if (bio) user.bio = bio;
      if (interests) user.interests = interests;
      if (profileData) {
        Object.assign(user, profileData);
      }

      users.set(user.email, user);

      console.log(`✅ User setup completed: ${user.email}`);

      sendJSON(res, 200, {
        success: true,
        message: 'Setup completed successfully',
        data: sanitizeUser(user)
      });
      return;
    }

    // Logout endpoint
    if (path === '/api/auth/logout' && method === 'POST') {
      const body = await parseBody(req);
      const { refreshToken } = body;
      
      if (refreshToken) {
        refreshTokens.delete(refreshToken);
      }

      sendJSON(res, 200, {
        success: true,
        message: 'Logged out successfully'
      });
      return;
    }

    // 404 for other API routes
    if (path.startsWith('/api/')) {
      sendJSON(res, 404, {
        success: false,
        error: 'API endpoint not found',
        path: path,
        method: method
      });
      return;
    }

    // Default 404
    sendJSON(res, 404, {
      success: false,
      error: 'Not found'
    });

  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, 500, {
      success: false,
      error: 'Internal server error'
    });
  }
});

// Start server
const startServer = async () => {
  try {
    await initializeTestUsers();
    
    server.listen(PORT, () => {
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
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

startServer();

module.exports = server;

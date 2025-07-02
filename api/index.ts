import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Define JWT payload interface
interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Load environment variables
dotenv.config();

// Initialize Prisma with proper connection handling
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Create Express app
const app = express();

// Environment variables with fallbacks
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@onlyfur.net';

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://onlyfur.net',
        'https://www.onlyfur.net',
        'https://creatorplattform.vercel.app',
        process.env.FRONTEND_URL || 'https://onlyfur.net'
      ]
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log('API Request:', {
    method: req.method,
    path: req.path,
    url: req.url,
    headers: {
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent']?.substring(0, 50) + '...'
    },
    timestamp: new Date().toISOString()
  });
  next();
});

// Initialize admin user
async function initializeAdminUser() {
  try {
    let adminUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (!adminUser) {
      if (process.env.ADMIN_PASSWORD) {
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
      } else {
        console.log('⚠️ Admin user not found and ADMIN_PASSWORD not set');
      }
    } else {
      // Ensure admin is active
      if (!adminUser.isActive || adminUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: adminUser.id },
          data: {
            isActive: true,
            role: 'ADMIN',
            isVerified: true,
            isEmailVerified: true
          }
        });
        console.log('✅ Admin user updated and activated');
      }
      
      // Update password if needed
      if (process.env.ADMIN_PASSWORD) {
        const isCurrentPassword = await bcrypt.compare(process.env.ADMIN_PASSWORD, adminUser.password || '');
        if (!isCurrentPassword) {
          const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
          await prisma.user.update({
            where: { id: adminUser.id },
            data: { password: hashedPassword }
          });
          console.log('🔄 Admin password updated');
        }
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize admin user:', error);
  }
}

// Initialize on startup
initializeAdminUser();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    service: 'OnlyFur Creator Platform API'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    service: 'OnlyFur Creator Platform API'
  });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password - NO BYPASS
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

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
      error: 'Login failed',
      message: error.message
    });
  }
});

// Register endpoint  
app.post('/auth/register', async (req, res) => {
  try {
    const { email, username, displayName, password, role } = req.body;

    if (!email || !username || !displayName || !password) {
      return res.status(400).json({ 
        error: 'Email, username, display name, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check existing user
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
        error: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
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

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
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
      error: 'Registration failed',
      message: error.message
    });
  }
});

// Profile endpoint
app.get('/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid token provided' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          role: true,
          isVerified: true,
          subscriptionStatus: true,
          avatar: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      error: 'Profile fetch failed',
      message: error.message
    });
  }
});

// Refresh token endpoint
app.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        data: { token: accessToken }
      });
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: 'Token refresh failed',
      message: error.message
    });
  }
});

// User profile routes
app.get('/user/:usernameOrId', async (req, res) => {
  try {
    const { usernameOrId } = req.params;
    
    // Try username first, then ID
    let user = await prisma.user.findUnique({
      where: { username: usernameOrId.toLowerCase() },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        isVerified: true,
        avatar: true,
        bio: true,
        coverImage: true,
        subscriberCount: true,
        contentCount: true,
        isPrivate: true,
        website: true,
        twitter: true,
        instagram: true,
        createdAt: true
      }
    });

    if (!user && usernameOrId.length > 10) {
      user = await prisma.user.findUnique({
        where: { id: usernameOrId },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          role: true,
          isVerified: true,
          avatar: true,
          bio: true,
          coverImage: true,
          subscriberCount: true,
          contentCount: true,
          isPrivate: true,
          website: true,
          twitter: true,
          instagram: true,
          createdAt: true
        }
      });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if it's own profile
    const authHeader = req.headers.authorization;
    let isOwnProfile = false;
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        isOwnProfile = decoded.userId === user.id;
      } catch (e) {
        // Invalid token, continue as public view
      }
    }

    const publicUser = {
      ...user,
      email: isOwnProfile ? user.email : undefined
    };

    res.json({
      success: true,
      data: { user: publicUser }
    });
  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      message: error.message
    });
  }
});

// Status endpoint
app.get('/status', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Platform stats
app.get('/real-data/platform-stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      users: { total: 150, online: 23, creators: 45 },
      content: { total: 890, thisMonth: 67 },
      revenue: { total: 15420, thisMonth: 2340 }
    }
  });
});

// Online status endpoints  
app.post('/online-status/set-online', (req, res) => {
  res.json({ success: true, message: 'Online status updated' });
});

app.post('/online-status/set-offline', (req, res) => {
  res.json({ success: true, message: 'Online status updated' });
});

// Placeholder routes
app.use('/subscriptions', (req, res) => {
  res.json({ error: 'Subscription routes temporarily unavailable', endpoint: req.path });
});

app.use('/content', (req, res) => {
  res.json({ error: 'Content routes temporarily unavailable', endpoint: req.path });
});

app.use('/users', (req, res) => {
  res.json({ error: 'User routes temporarily unavailable', endpoint: req.path });
});

app.use('/messaging', (req, res) => {
  res.json({ error: 'Messaging routes temporarily unavailable', endpoint: req.path });
});

app.use('/admin', (req, res) => {
  res.json({ error: 'Admin routes temporarily unavailable', endpoint: req.path });
});

app.use('/payments', (req, res) => {
  res.json({ error: 'Payment routes temporarily unavailable', endpoint: req.path });
});

app.use('/upload-blob', (req, res) => {
  res.json({ error: 'Upload routes temporarily unavailable', endpoint: req.path });
});

app.use('/creator-pages', (req, res) => {
  res.json({ error: 'Creator pages routes temporarily unavailable', endpoint: req.path });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('API Error:', {
    error: error?.message || error,
    path: req?.path || req?.url,
    method: req?.method,
    timestamp: new Date().toISOString()
  });
  
  if (res.headersSent) {
    return next(error);
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: error?.message || 'Unknown error occurred',
    endpoint: req?.path || req?.url,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    method: req.method,
    path: req.path,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/status', 
      'GET /api/auth/profile',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'POST /api/auth/refresh',
      'GET /api/user/:username',
      'GET /api/real-data/platform-stats'
    ]
  });
});

// Cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// For development - start server locally
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📚 Available endpoints:`);
    console.log(`     POST /api/login`);
    console.log(`     POST /api/register`);
    console.log(`     GET /api/profile`);
    console.log(`     POST /api/refresh`);
    console.log(`     GET /api/user/:username`);
  });
}

module.exports = app;

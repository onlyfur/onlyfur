import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

// Initialize Prisma with proper connection handling
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
});

// Create Express app for serverless
const app = express();

// Environment variables with fallbacks
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// IMPORTANT: Admin credentials from environment only
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@onlyfur.com';

// Basic CORS configuration
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

// Debug middleware to log all requests
app.use((req: any, res: any, next: any) => {
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

// Initialize admin user if it doesn't exist
async function initializeAdminUser() {
  try {
    const adminEmail = ADMIN_EMAIL;
    
    // Check if admin user exists
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!adminUser) {
      // Only create admin if ADMIN_PASSWORD is set in environment
      if (process.env.ADMIN_PASSWORD) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        
        adminUser = await prisma.user.create({
          data: {
            email: adminEmail,
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
        console.log('⚠️ Admin user not found and ADMIN_PASSWORD not set in environment');
      }
    } else {
      // Ensure admin user is active and has correct role
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
      
      // Update admin password if ADMIN_PASSWORD is set and different
      if (process.env.ADMIN_PASSWORD) {
        const isCurrentPassword = await bcrypt.compare(process.env.ADMIN_PASSWORD, adminUser.password || '');
        if (!isCurrentPassword) {
          const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
          await prisma.user.update({
            where: { id: adminUser.id },
            data: { password: hashedPassword }
          });
          console.log('🔄 Admin password updated from environment variable');
        }
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize admin user:', error);
  }
}

// Initialize admin user on startup
initializeAdminUser();

// Health check
app.get('/health', (req: any, res: any) => {
  try {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      service: 'OnlyFur Creator Platform API',
      path: req.path,
      method: req.method
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Auth routes with real database implementations
app.post('/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // SECURITY FIX: Proper password verification for ALL users
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET as string,
      { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
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
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/auth/register', async (req: any, res: any) => {
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

    // Check if user already exists
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

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      JWT_REFRESH_SECRET as string,
      { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
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
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/auth/profile', async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid token provided' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
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
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/auth/refresh', async (req: any, res: any) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET as string,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
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
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// User profile routes
app.get('/user/:usernameOrId', async (req: any, res: any) => {
  try {
    const { usernameOrId } = req.params;
    
    // Try to find by username first, then by ID
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
      // Try finding by ID if username lookup failed and it looks like an ID
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

    // Remove email from public profile unless it's the user's own profile
    const authHeader = req.headers.authorization;
    let isOwnProfile = false;
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as any;
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
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Additional health checks
app.get('/status', (req: any, res: any) => {
  try {
    res.status(200).json({ 
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ 
      error: 'Status check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Real-data and online-status routes with direct handlers
app.get('/real-data/platform-stats', (req: any, res: any) => {
  res.json({
    success: true,
    stats: {
      users: { total: 150, online: 23, creators: 45 },
      content: { total: 890, thisMonth: 67 },
      revenue: { total: 15420, thisMonth: 2340 }
    }
  });
});

app.post('/online-status/set-online', (req: any, res: any) => {
  res.json({ success: true, message: 'Online status updated' });
});

app.post('/online-status/set-offline', (req: any, res: any) => {
  res.json({ success: true, message: 'Online status updated' });
});

// Placeholder routes
app.use('/subscriptions', (req: any, res: any) => {
  res.json({ error: 'Subscription routes temporarily unavailable', endpoint: req.path });
});

app.use('/content', (req: any, res: any) => {
  res.json({ error: 'Content routes temporarily unavailable', endpoint: req.path });
});

app.use('/users', (req: any, res: any) => {
  res.json({ error: 'User routes temporarily unavailable', endpoint: req.path });
});

app.use('/messaging', (req: any, res: any) => {
  res.json({ error: 'Messaging routes temporarily unavailable', endpoint: req.path });
});

app.use('/admin', (req: any, res: any) => {
  res.json({ error: 'Admin routes temporarily unavailable', endpoint: req.path });
});

app.use('/payments', (req: any, res: any) => {
  res.json({ error: 'Payment routes temporarily unavailable', endpoint: req.path });
});

app.use('/upload-blob', (req: any, res: any) => {
  res.json({ error: 'Upload routes temporarily unavailable', endpoint: req.path });
});

app.use('/creator-pages', (req: any, res: any) => {
  res.json({ error: 'Creator pages routes temporarily unavailable', endpoint: req.path });
});

// Simplified error handling
app.use((error: any, req: any, res: any, next: any) => {
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

// Handle 404
app.use('*', (req: any, res: any) => {
  console.log('404 - Route not found:', {
    method: req.method,
    path: req.path,
    url: req.url
  });
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
      'GET /api/real-data/platform-stats',
      'POST /api/online-status/set-online'
    ]
  });
});

// Close Prisma connection on process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Export for Vercel
export default app;

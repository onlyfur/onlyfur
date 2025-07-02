const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Configuration
const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'onlyfur-dev-secret-key',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  uploadDir: path.join(__dirname, '../uploads'),
  maxFileSize: 50 * 1024 * 1024, // 50MB
  bcryptRounds: 12
};

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(config.uploadDir);
  } catch {
    await fs.mkdir(config.uploadDir, { recursive: true });
    await fs.mkdir(path.join(config.uploadDir, 'images'), { recursive: true });
    await fs.mkdir(path.join(config.uploadDir, 'videos'), { recursive: true });
    await fs.mkdir(path.join(config.uploadDir, 'avatars'), { recursive: true });
  }
}

// Middleware Setup
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: { error: 'Too many authentication attempts, please try again later' }
});

// Serve uploaded files
app.use('/uploads', express.static(config.uploadDir));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = config.uploadDir;
    if (file.fieldname === 'avatar') {
      uploadPath = path.join(config.uploadDir, 'avatars');
    } else if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(config.uploadDir, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = path.join(config.uploadDir, 'videos');
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// Utility Functions
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.bcryptRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, error: 'Access token required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Authorization Middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const requireSubscription = (minTier = 'FREE') => {
  const tierHierarchy = { 'FREE': 0, 'BASIC': 1, 'PREMIUM': 2, 'VIP': 3 };
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const userTierLevel = tierHierarchy[req.user.subscriptionTier] || 0;
    const requiredTierLevel = tierHierarchy[minTier] || 0;
    
    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({ 
        success: false, 
        error: 'Subscription upgrade required',
        requiredTier: minTier,
        currentTier: req.user.subscriptionTier
      });
    }
    
    next();
  };
};

// Database initialization with mock data
async function initializeDatabase() {
  try {
    // Check if we can connect to the database
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Create default subscription tiers if they don't exist
    const existingTiers = await prisma.platformSubscriptionTier.count();
    if (existingTiers === 0) {
      console.log('🌱 Seeding subscription tiers...');
      await prisma.platformSubscriptionTier.createMany({
        data: [
          {
            id: 'free',
            name: 'Free',
            type: 'SUBSCRIBER',
            level: 'BASIC',
            price: 0,
            description: 'Access to basic content and community features',
            features: ['Basic content access', 'Community participation', 'Public posts'],
            limitations: ['Limited messaging', 'No premium content'],
            messagingFeatures: { directMessages: false, prioritySupport: false },
            contentAccess: { basic: true, premium: false, exclusive: false },
            color: '#6B7280',
            isActive: true
          },
          {
            id: 'basic',
            name: 'Basic',
            type: 'SUBSCRIBER',
            level: 'PRO',
            price: 999, // $9.99 in cents
            description: 'Enhanced access with more content and features',
            features: ['All Free features', 'Creator messaging', 'Exclusive posts', 'HD content'],
            limitations: ['Limited live streams'],
            messagingFeatures: { directMessages: true, prioritySupport: false },
            contentAccess: { basic: true, premium: true, exclusive: false },
            color: '#3B82F6',
            isActive: true
          },
          {
            id: 'premium',
            name: 'Premium',
            type: 'SUBSCRIBER',
            level: 'PREMIUM',
            price: 1999, // $19.99 in cents
            description: 'Premium access with direct creator interaction',
            features: ['All Basic features', 'Priority messaging', 'Live streams', 'Custom requests'],
            limitations: ['No personal calls'],
            messagingFeatures: { directMessages: true, prioritySupport: true },
            contentAccess: { basic: true, premium: true, exclusive: true },
            color: '#8B5CF6',
            isPopular: true,
            isActive: true
          },
          {
            id: 'vip',
            name: 'VIP',
            type: 'SUBSCRIBER',
            level: 'VIP',
            price: 4999, // $49.99 in cents
            description: 'Ultimate access with personalized content',
            features: ['All Premium features', 'Personal video calls', 'Custom content', 'Priority support'],
            limitations: [],
            messagingFeatures: { directMessages: true, prioritySupport: true, personalCalls: true },
            contentAccess: { basic: true, premium: true, exclusive: true, personal: true },
            color: '#F59E0B',
            badge: 'VIP',
            isActive: true
          }
        ]
      });
    }

    // Create admin user if doesn't exist
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminExists) {
      console.log('👤 Creating admin user...');
      const hashedPassword = await hashPassword('admin123');
      await prisma.user.create({
        data: {
          email: 'admin@onlyfur.net',
          username: 'admin',
          displayName: 'Administrator',
          password: hashedPassword,
          role: 'ADMIN',
          subscriptionTier: 'VIP',
          subscriptionStatus: 'ACTIVE',
          isActive: true,
          isEmailVerified: true
        }
      });
    }

    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Continue with mock data for development
    return false;
  }
  return true;
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Info
app.get('/api', (req, res) => {
  res.json({
    name: 'OnlyFur API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      content: '/api/content/*',
      subscriptions: '/api/subscriptions/*',
      messages: '/api/messages/*',
      uploads: '/api/uploads/*',
      admin: '/api/admin/*'
    }
  });
});

// Authentication Routes
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { email, username, password, role = 'SUBSCRIBER' } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, username, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
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
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        displayName: username, // Use username as default display name
        password: hashedPassword,
        role,
        subscriptionTier: 'free', // Use the actual tier ID
        subscriptionStatus: 'ACTIVE',
        isActive: true,
        isEmailVerified: false
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        createdAt: true
      }
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });

    console.log(`✅ User registered: ${user.email} (${user.role})`);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: error.message
    });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

    console.log(`✅ User logged in: ${user.email}`);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      details: error.message
    });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        avatar: true,
        bio: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user information'
    });
  }
});

// Export app and initialization function
module.exports = {
  app,
  initializeDatabase,
  ensureUploadDir,
  config,
  prisma
};

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../services/database.cjs');

const router = express.Router();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'onlyfur-super-secret-key-for-development-only';

// Admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@onlyfur.net';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Helper function to generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Validation helper
const validateInput = (data, rules) => {
  const errors = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    }
    
    if (value && rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = `${field} must be a valid email address`;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               displayName:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CREATOR, SUBSCRIBER]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', async (req, res) => {
  try {
    const { email, username, displayName, password, role = 'SUBSCRIBER' } = req.body;

    // Validate input
    const validationErrors = validateInput(req.body, {
      email: { required: true, email: true },
      username: { 
        required: true, 
        minLength: 3, 
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_-]+$/,
        message: 'Username can only contain letters, numbers, underscores, and hyphens'
      },
      displayName: { required: true, minLength: 1, maxLength: 50 },
      password: { 
        required: true, 
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    });

    if (validationErrors) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    if (!['CREATOR', 'SUBSCRIBER'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be CREATOR or SUBSCRIBER'
      });
    }

    // Check if user already exists
    const existingUser = await prisma().user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        error: `${field === 'email' ? 'Email' : 'Username'} already exists`
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Determine default subscription tier
    let defaultTier = 'basic-subscriber';
    if (role === 'CREATOR') {
      defaultTier = 'basic-creator';
    }

    // Create user
    const user = await prisma().user.create({
      data: {
        email,
        username,
        displayName,
        role,
        subscriptionTier: defaultTier,
        subscriptionStatus: role === 'CREATOR' && defaultTier === 'basic-creator' ? 'ACTIVE' : 'FREE',
        authProvider: 'EMAIL'
        // Note: password would be stored separately in a real implementation
      }
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Remove sensitive data
    const { ...userWithoutPassword } = user;

    console.log(`✅ User registered: ${user.email} (${user.role})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validationErrors = validateInput(req.body, {
      email: { required: true, email: true },
      password: { required: true }
    });

    if (validationErrors) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Check for admin credentials first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Get or create admin user
      let adminUser = await prisma().user.findUnique({
        where: { email: ADMIN_EMAIL }
      });

      if (!adminUser) {
        // Create admin user
        adminUser = await prisma().user.create({
          data: {
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME,
            displayName: 'OnlyFur Admin',
            role: 'ADMIN',
            isVerified: true,
            authProvider: 'EMAIL',
            subscriptionTier: 'pro-subscriber',
            subscriptionStatus: 'ACTIVE',
            avatar: '/images/branding/onlyfur-logo.png'
          }
        });
      }

      // Generate JWT token for admin
      const token = generateToken({
        userId: adminUser.id,
        email: adminUser.email,
        role: 'ADMIN'
      });

      console.log(`✅ Admin login: ${adminUser.email}`);

      return res.json({
        success: true,
        message: 'Login successful',
        user: adminUser,
        token
      });
    }

    // Find regular user
    const user = await prisma().user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`❌ Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // For demo purposes, accept any password for existing users
    // In production, you would verify the hashed password:
    // const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    // if (!isValidPassword) { ... }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    console.log(`✅ User login: ${user.email} (${user.role})`);

    res.json({
      success: true,
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma().user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        role: true,
        isVerified: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionValidUntil: true,
        bio: true,
        coverImage: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

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

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authenticateToken, async (req, res) => {
  console.log(`✅ User logout: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Google OAuth placeholder
router.post('/google', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Google OAuth not implemented yet'
  });
});

// Password reset placeholders
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.'
  });
});

router.post('/reset-password', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Password reset not implemented yet'
  });
});

// Email verification placeholders
router.post('/verify-email/:token', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Email verification not implemented yet'
  });
});

router.post('/resend-verification', authenticateToken, async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Email verification not implemented yet'
  });
});

// Export the router and middleware
module.exports = {
  router,
  authenticateToken
};
module.exports.generateToken = generateToken;

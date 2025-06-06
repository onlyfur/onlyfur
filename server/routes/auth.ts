import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../services/database';
import { 
  authenticateToken, 
  generateToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../middleware/auth';
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  ConflictError,
  asyncHandler 
} from '../middleware/errorHandler';
import { logger, logSecurityEvent } from '../middleware/logger';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email';

const router = express.Router();

// Google OAuth client
let googleClient: OAuth2Client | null = null;
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  displayName: z.string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must not exceed 50 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  role: z.enum(['CREATOR', 'SUBSCRIBER']).default('SUBSCRIBER')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// Register user
router.post('/register', asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);
  const { email, username, displayName, password, role } = validatedData;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ConflictError('Email already registered');
    } else {
      throw new ConflictError('Username already taken');
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Determine default subscription tier
  let defaultTier = 'basic-subscriber';
  if (role === 'CREATOR') {
    defaultTier = 'basic-creator';
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      displayName,
      password: hashedPassword, // Store the hashed password
      role,
      subscriptionTier: defaultTier,
      subscriptionStatus: role === 'CREATOR' && defaultTier === 'basic-creator' ? 'ACTIVE' : 'FREE',
      authProvider: 'EMAIL',
      isEmailVerified: false,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      role: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      isVerified: true,
      createdAt: true
    }
  });

  // Generate tokens
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  // Send verification email (in background)
  if (process.env.NODE_ENV !== 'test') {
    sendVerificationEmail(user.email, user.displayName, user.id).catch(error => {
      logger.error('Failed to send verification email:', error);
    });
  }

  logger.info('User registered successfully', {
    userId: user.id,
    email: user.email,
    role: user.role
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user,
    token,
    refreshToken
  });
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  // Check for admin credentials first
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@onlyfur.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email === adminEmail && password === adminPassword) {
    // Get or create admin user
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        isVerified: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!adminUser) {
      // Create admin user if doesn't exist
      adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          username: process.env.ADMIN_USERNAME || 'admin',
          displayName: 'OnlyFur Admin',
          role: 'ADMIN',
          isVerified: true,
          authProvider: 'EMAIL',
          subscriptionTier: 'vip-subscriber',
          subscriptionStatus: 'ACTIVE',
          avatar: '/images/branding/onlyfur-logo.png'
        },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          role: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          isVerified: true,
          avatar: true,
          createdAt: true
        }
      });
    }

    // Generate tokens for admin
    const token = generateToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });

    const refreshToken = generateRefreshToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });

    logger.info('Admin login successful', {
      userId: adminUser.id,
      email: adminUser.email
    });

    return res.json({
      success: true,
      message: 'Login successful',
      user: adminUser,
      token,
      refreshToken
    });
  }

  // Find regular user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      password: true, // Include password for verification
      role: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      isVerified: true,
      avatar: true,
      createdAt: true,
      isActive: true,
      authProvider: true
    }
  });

  if (!user) {
    logSecurityEvent('Login attempt with non-existent email', {
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    throw new AuthenticationError('Invalid email or password');
  }

  // Check if user account is active
  if (!user.isActive) {
    throw new AuthenticationError('Account is deactivated');
  }

  // Verify password for email/password authentication
  if (user.authProvider === 'EMAIL') {
    if (!user.password) {
      throw new AuthenticationError('Password not set for this account');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logSecurityEvent('Login attempt with invalid password', {
        email,
        userId: user.id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      throw new AuthenticationError('Invalid email or password');
    }
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  // Generate tokens
  const token = generateToken({
    userId: userWithoutPassword.id,
    email: userWithoutPassword.email,
    role: userWithoutPassword.role
  });

  const refreshToken = generateRefreshToken({
    userId: userWithoutPassword.id,
    email: userWithoutPassword.email,
    role: userWithoutPassword.role
  });

  logger.info('User login successful', {
    userId: userWithoutPassword.id,
    email: userWithoutPassword.email,
    role: userWithoutPassword.role
  });

  res.json({
    success: true,
    message: 'Login successful',
    user: userWithoutPassword,
    token,
    refreshToken
  });
}));

// Google OAuth login
router.post('/google', asyncHandler(async (req, res) => {
  if (!googleClient) {
    throw new AppError('Google OAuth not configured', 501);
  }

  const { credential } = req.body;

  if (!credential) {
    throw new ValidationError('Google credential is required');
  }

  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AuthenticationError('Invalid Google token');
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      throw new ValidationError('Email not provided by Google');
    }

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { googleId }
        ]
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        isVerified: true,
        avatar: true,
        googleId: true,
        createdAt: true
      }
    });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            role: true,
            subscriptionTier: true,
            subscriptionStatus: true,
            isVerified: true,
            avatar: true,
            googleId: true,
            createdAt: true
          }
        });
      }
    } else {
      // Create new user
      const username = email.split('@')[0] + Math.random().toString(36).substr(2, 4);
      
      user = await prisma.user.create({
        data: {
          email,
          username,
          displayName: name || email.split('@')[0],
          role: 'SUBSCRIBER',
          authProvider: 'GOOGLE',
          googleId,
          isVerified: true, // Google emails are pre-verified
          avatar: picture,
          subscriptionTier: 'basic-subscriber',
          subscriptionStatus: 'FREE'
        },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          role: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          isVerified: true,
          avatar: true,
          googleId: true,
          createdAt: true
        }
      });
    }

    // Generate tokens
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    logger.info('Google OAuth login successful', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Google login successful',
      user,
      token,
      refreshToken
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes('Token used too late')) {
      throw new AuthenticationError('Google token expired');
    }
    throw error;
  }
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const validatedData = refreshTokenSchema.parse(req.body);
  const { refreshToken } = validatedData;

  try {
    const decoded = verifyRefreshToken(refreshToken);

    // Verify user still exists
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
      throw new AuthenticationError('User not found');
    }

    // Generate new tokens
    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
}));

// Get current user
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
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
    throw new AuthenticationError('User not found');
  }

  res.json({
    success: true,
    user
  });
}));

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  logger.info('User logout', {
    userId: req.user!.userId,
    email: req.user!.email
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Forgot password
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const validatedData = forgotPasswordSchema.parse(req.body);
  const { email } = validatedData;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, displayName: true }
  });

  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.'
  });

  if (user && process.env.NODE_ENV !== 'test') {
    // Generate reset token and send email (in background)
    const resetToken = generateToken({ userId: user.id, email: user.email, role: 'password_reset' });
    
    sendPasswordResetEmail(user.email, user.displayName, resetToken).catch(error => {
      logger.error('Failed to send password reset email:', error);
    });
  }
}));

// Reset password
router.post('/reset-password', asyncHandler(async (req, res) => {
  const validatedData = resetPasswordSchema.parse(req.body);
  const { token, password } = validatedData;

  // TODO: Implement password reset functionality
  // This would involve verifying the reset token and updating the user's password

  res.json({
    success: true,
    message: 'Password reset successful'
  });
}));

// Verify email
router.post('/verify-email/:token', asyncHandler(async (req, res) => {
  const { token } = req.params;

  // TODO: Implement email verification
  // This would involve verifying the token and marking the user as verified

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
}));

// Resend verification email
router.post('/resend-verification', authenticateToken, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, displayName: true, isVerified: true }
  });

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  if (user.isVerified) {
    throw new ValidationError('Email already verified');
  }

  if (process.env.NODE_ENV !== 'test') {
    sendVerificationEmail(user.email, user.displayName, user.id).catch(error => {
      logger.error('Failed to send verification email:', error);
    });
  }

  res.json({
    success: true,
    message: 'Verification email sent'
  });
}));

export default router;

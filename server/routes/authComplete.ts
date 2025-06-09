import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import vercelIntegration from '../services/vercelIntegration';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name too long'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms of service'),
  role: z.enum(['USER', 'CREATOR']).default('USER')
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const enableTwoFactorSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  code: z.string().length(6, 'Invalid 2FA code')
});

const verifyTwoFactorSchema = z.object({
  code: z.string().length(6, 'Invalid 2FA code')
});

/**
 * @swagger
 * /api/auth-v2/register:
 *   post:
 *     summary: Register a new user with enhanced security
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               displayName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, CREATOR]
 *               agreeToTerms:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);
  
  // Check if user already exists
  const existingUser = await vercelIntegration.prisma.user.findFirst({
    where: {
      OR: [
        { email: validatedData.email },
        { username: validatedData.username }
      ]
    }
  });

  if (existingUser) {
    throw new ValidationError(
      existingUser.email === validatedData.email 
        ? 'Email already registered' 
        : 'Username already taken'
    );
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

  // Generate email verification token
  const emailVerificationToken = uuidv4();

  try {
    // Create user with enhanced profile
    const user = await vercelIntegration.prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        displayName: validatedData.displayName,
        role: validatedData.role,
        emailVerificationToken,
        isEmailVerified: false,
        categories: validatedData.role === 'CREATOR' ? [] : undefined,
        tags: [],
        notificationSettings: {
          email: true,
          push: true,
          newSubscribers: true,
          newMessages: true,
          contentLikes: true,
          contentComments: true
        },
        settings: {
          theme: 'dark',
          language: 'en',
          timezone: 'UTC'
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    // Create welcome activity
    await vercelIntegration.prisma.activity.create({
      data: {
        userId: user.id,
        type: 'USER_REGISTERED',
        description: `Welcome to OnlyFur! Your ${validatedData.role.toLowerCase()} account has been created.`,
        metadata: {
          registrationMethod: 'email',
          role: validatedData.role
        }
      }
    });

    // TODO: Send welcome email with verification link
    // await sendWelcomeEmail(user.email, user.displayName, emailVerificationToken);

    logger.info(`✅ User registered: ${user.id} (${user.username})`);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        isEmailVerified: user.isEmailVerified 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      },
      token,
      message: 'Registration successful! Please check your email to verify your account.'
    });
  } catch (error) {
    logger.error('❌ Registration failed:', error);
    throw new Error(`Registration failed: ${error.message}`);
  }
}));

/**
 * @swagger
 * /api/auth-v2/login:
 *   post:
 *     summary: Login with enhanced security and 2FA support
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *               password:
 *                 type: string
 *               twoFactorCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  
  // Find user by email or username
  const user = await vercelIntegration.prisma.user.findFirst({
    where: {
      OR: [
        { email: validatedData.identifier },
        { username: validatedData.identifier }
      ]
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      password: true,
      role: true,
      isEmailVerified: true,
      isActive: true,
      avatar: true,
      twoFactorSecret: true,
      isTwoFactorEnabled: true,
      lastLoginAt: true,
      failedLoginAttempts: true,
      lockedUntil: true
    }
  });

  if (!user) {
    throw new ValidationError('Invalid credentials');
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000 / 60);
    throw new ValidationError(`Account locked. Try again in ${lockTimeRemaining} minutes.`);
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ValidationError('Account is disabled. Please contact support.');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
  
  if (!isPasswordValid) {
    // Increment failed login attempts
    const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
    const shouldLockAccount = newFailedAttempts >= 5;
    
    await vercelIntegration.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newFailedAttempts,
        lockedUntil: shouldLockAccount ? new Date(Date.now() + 30 * 60 * 1000) : undefined // 30 minutes
      }
    });

    if (shouldLockAccount) {
      throw new ValidationError('Too many failed attempts. Account locked for 30 minutes.');
    }
    
    throw new ValidationError('Invalid credentials');
  }

  // Check 2FA if enabled
  if (user.isTwoFactorEnabled) {
    if (!validatedData.twoFactorCode) {
      return res.json({
        success: false,
        requiresTwoFactor: true,
        message: 'Two-factor authentication code required'
      });
    }

    const isValidToken = speakeasy.totp.verify({
      secret: user.twoFactorSecret!,
      encoding: 'base32',
      token: validatedData.twoFactorCode,
      window: 2
    });

    if (!isValidToken) {
      throw new ValidationError('Invalid two-factor authentication code');
    }
  }

  // Reset failed login attempts on successful login
  await vercelIntegration.prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date()
    }
  });

  // Create login activity
  await vercelIntegration.prisma.activity.create({
    data: {
      userId: user.id,
      type: 'USER_LOGIN',
      description: 'User logged in',
      metadata: {
        loginMethod: user.isTwoFactorEnabled ? '2fa' : 'password',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    }
  });

  logger.info(`✅ User login: ${user.id} (${user.username})`);

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      role: user.role,
      isEmailVerified: user.isEmailVerified 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar,
      lastLoginAt: user.lastLoginAt
    },
    token,
    message: 'Login successful'
  });
}));

/**
 * @swagger
 * /api/auth-v2/verify-email:
 *   post:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ValidationError('Verification token is required');
  }

  const user = await vercelIntegration.prisma.user.findFirst({
    where: { 
      emailVerificationToken: token,
      isEmailVerified: false
    }
  });

  if (!user) {
    throw new ValidationError('Invalid or expired verification token');
  }

  // Update user as verified
  await vercelIntegration.prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerifiedAt: new Date()
    }
  });

  // Create verification activity
  await vercelIntegration.prisma.activity.create({
    data: {
      userId: user.id,
      type: 'EMAIL_VERIFIED',
      description: 'Email address verified successfully'
    }
  });

  logger.info(`✅ Email verified: ${user.id} (${user.email})`);

  res.json({
    success: true,
    message: 'Email verified successfully!'
  });
}));

/**
 * @swagger
 * /api/auth-v2/forgot-password:
 *   post:
 *     summary: Request password reset
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
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  const user = await vercelIntegration.prisma.user.findUnique({
    where: { email },
    select: { id: true, displayName: true, email: true }
  });

  if (!user) {
    // Don't reveal if email exists - return success anyway
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = uuidv4();
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await vercelIntegration.prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: resetTokenExpires
    }
  });

  // Create password reset activity
  await vercelIntegration.prisma.activity.create({
    data: {
      userId: user.id,
      type: 'PASSWORD_RESET_REQUESTED',
      description: 'Password reset requested',
      metadata: {
        ipAddress: req.ip
      }
    }
  });

  // TODO: Send password reset email
  // await sendPasswordResetEmail(user.email, user.displayName, resetToken);

  logger.info(`✅ Password reset requested: ${user.id} (${user.email})`);

  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.'
  });
}));

/**
 * @swagger
 * /api/auth-v2/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-password', asyncHandler(async (req, res) => {
  const validatedData = resetPasswordSchema.parse(req.body);

  const user = await vercelIntegration.prisma.user.findFirst({
    where: {
      passwordResetToken: validatedData.token,
      passwordResetExpires: {
        gt: new Date()
      }
    }
  });

  if (!user) {
    throw new ValidationError('Invalid or expired reset token');
  }

  // Hash new password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(validatedData.newPassword, saltRounds);

  // Update password and clear reset token
  await vercelIntegration.prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      failedLoginAttempts: 0,
      lockedUntil: null
    }
  });

  // Create password reset activity
  await vercelIntegration.prisma.activity.create({
    data: {
      userId: user.id,
      type: 'PASSWORD_RESET_COMPLETED',
      description: 'Password reset completed successfully'
    }
  });

  logger.info(`✅ Password reset completed: ${user.id}`);

  res.json({
    success: true,
    message: 'Password reset successfully. You can now log in with your new password.'
  });
}));

/**
 * @swagger
 * /api/auth-v2/enable-2fa:
 *   post:
 *     summary: Enable two-factor authentication
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 */
router.post('/enable-2fa', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = enableTwoFactorSchema.parse(req.body);

  // Get user and verify password
  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: { 
      password: true, 
      displayName: true, 
      email: true,
      isTwoFactorEnabled: true,
      tempTwoFactorSecret: true
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.isTwoFactorEnabled) {
    throw new ValidationError('Two-factor authentication is already enabled');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
  if (!isPasswordValid) {
    throw new ValidationError('Invalid password');
  }

  // Get the temporary secret (should be set from setup-2fa endpoint)
  if (!user.tempTwoFactorSecret) {
    throw new ValidationError('Two-factor setup not initiated. Please call setup-2fa first.');
  }

  // Verify the provided code
  const isValidToken = speakeasy.totp.verify({
    secret: user.tempTwoFactorSecret,
    encoding: 'base32',
    token: validatedData.code,
    window: 2
  });

  if (!isValidToken) {
    throw new ValidationError('Invalid two-factor authentication code');
  }

  // Enable 2FA
  await vercelIntegration.prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: user.tempTwoFactorSecret,
      isTwoFactorEnabled: true,
      tempTwoFactorSecret: null
    }
  });

  // Create 2FA enabled activity
  await vercelIntegration.prisma.activity.create({
    data: {
      userId,
      type: 'TWO_FACTOR_ENABLED',
      description: 'Two-factor authentication enabled'
    }
  });

  logger.info(`✅ 2FA enabled: ${userId}`);

  res.json({
    success: true,
    message: 'Two-factor authentication enabled successfully'
  });
}));

/**
 * @swagger
 * /api/auth-v2/setup-2fa:
 *   get:
 *     summary: Get 2FA setup information (QR code)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup information
 */
router.get('/setup-2fa', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: { 
      displayName: true, 
      email: true,
      isTwoFactorEnabled: true
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.isTwoFactorEnabled) {
    throw new ValidationError('Two-factor authentication is already enabled');
  }

  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `OnlyFur (${user.email})`,
    issuer: 'OnlyFur',
    length: 32
  });

  // Store temporary secret
  await vercelIntegration.prisma.user.update({
    where: { id: userId },
    data: {
      tempTwoFactorSecret: secret.base32
    }
  });

  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

  res.json({
    success: true,
    setup: {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
      instructions: 'Scan the QR code with your authenticator app, then enter the 6-digit code to complete setup.'
    }
  });
}));

/**
 * @swagger
 * /api/auth-v2/disable-2fa:
 *   post:
 *     summary: Disable two-factor authentication
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA disabled successfully
 */
router.post('/disable-2fa', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const { password, code } = req.body;

  if (!password || !code) {
    throw new ValidationError('Password and 2FA code are required');
  }

  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: { 
      password: true,
      twoFactorSecret: true,
      isTwoFactorEnabled: true
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.isTwoFactorEnabled) {
    throw new ValidationError('Two-factor authentication is not enabled');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ValidationError('Invalid password');
  }

  // Verify 2FA code
  const isValidToken = speakeasy.totp.verify({
    secret: user.twoFactorSecret!,
    encoding: 'base32',
    token: code,
    window: 2
  });

  if (!isValidToken) {
    throw new ValidationError('Invalid two-factor authentication code');
  }

  // Disable 2FA
  await vercelIntegration.prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: null,
      isTwoFactorEnabled: false
    }
  });

  // Create 2FA disabled activity
  await vercelIntegration.prisma.activity.create({
    data: {
      userId,
      type: 'TWO_FACTOR_DISABLED',
      description: 'Two-factor authentication disabled'
    }
  });

  logger.info(`✅ 2FA disabled: ${userId}`);

  res.json({
    success: true,
    message: 'Two-factor authentication disabled successfully'
  });
}));

/**
 * @swagger
 * /api/auth-v2/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post('/refresh', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      role: true,
      isEmailVerified: true,
      isActive: true
    }
  });

  if (!user || !user.isActive) {
    throw new AuthorizationError('User not found or inactive');
  }

  // Generate new token
  const token = jwt.sign(
    { 
      userId: user.id, 
      role: user.role,
      isEmailVerified: user.isEmailVerified 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  });
}));

/**
 * @swagger
 * /api/auth-v2/logout:
 *   post:
 *     summary: Logout user (invalidate session)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  // Create logout activity
  await vercelIntegration.prisma.activity.create({
    data: {
      userId,
      type: 'USER_LOGOUT',
      description: 'User logged out',
      metadata: {
        ipAddress: req.ip
      }
    }
  });

  logger.info(`✅ User logout: ${userId}`);

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

/**
 * @swagger
 * /api/auth-v2/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 */
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      isVerified: true,
      isTwoFactorEnabled: true,
      categories: true,
      tags: true,
      subscriberCount: true,
      notificationSettings: true,
      settings: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          content: true,
          subscriptions: true,
          subscribers: true
        }
      }
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    user: {
      ...user,
      stats: {
        contentCount: user._count.content,
        subscriptionsCount: user._count.subscriptions,
        subscribersCount: user._count.subscribers
      }
    }
  });
}));

export default router;
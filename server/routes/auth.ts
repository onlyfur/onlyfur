import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { authenticationService } from '../services/authenticationService';
import { googleAuthService } from '../services/googleAuth';
import { blobService } from '../services/blob';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../services/database';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const storage = multer.memoryStorage();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  displayName: z.string().min(1).max(100),
  password: z.string().min(6),
  role: z.enum(['CREATOR', 'SUBSCRIBER']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const googleAuthSchema = z.object({
  credential: z.string(),
  userType: z.enum(['creator', 'subscriber']).optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6)
});

const verifyEmailSchema = z.object({
  token: z.string()
});

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  socialLinks: z.record(z.string()).optional(),
  preferredLanguage: z.string().optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional()
});

const deleteAccountSchema = z.object({
  password: z.string().optional()
});

// Routes
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@onlyfur.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

  if (email === ADMIN_EMAIL) {
    let adminUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      adminUser = await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          username: ADMIN_USERNAME,
          displayName: 'Platform Administrator',
          role: 'ADMIN',
          isVerified: true,
          isActive: true,
          isEmailVerified: true,
          password: hashedPassword,
          authProvider: 'EMAIL',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      console.log(`✅ Default admin user created: ${ADMIN_EMAIL}`);
    } else {
      const passwordMatches = await bcrypt.compare(ADMIN_PASSWORD, adminUser.password);
      if (!passwordMatches) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
        adminUser = await prisma.user.update({
          where: { email: ADMIN_EMAIL },
          data: {
            password: hashedPassword,
            updatedAt: new Date()
          }
        });
        console.log(`🔄 Admin password updated from environment variable for: ${ADMIN_EMAIL}`);
      }
    }

    const validPassword = await bcrypt.compare(password, adminUser.password);
    if (!validPassword) {
      res.status(400).json({
        success: false,
        error: 'Invalid email or password'
      });
      return;
    }

    const tokens = authenticationService['generateTokenPair'](adminUser);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
          displayName: adminUser.displayName,
          role: adminUser.role
        },
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
    return;
  }

  const result = await authenticationService.login({
    email: validatedData.email,
    password: validatedData.password
  });

  if (result.success) {
    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      },
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      error: result.error
    });
  }
}));

router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  
  const result = await authenticationService.register({
    email: validatedData.email,
    username: validatedData.username,
    displayName: validatedData.displayName,
    password: validatedData.password
  });

  if (result.success) {
    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      },
      message: 'User registered successfully'
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
}));

router.get('/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'User not authenticated'
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      role: true,
      avatar: true,
      bio: true,
      isVerified: true,
      isEmailVerified: true,
      createdAt: true
    }
  });

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
    return;
  }

  res.json({
    success: true,
    data: { user },
    message: 'User profile retrieved successfully'
  });
}));

// Google OAuth endpoint
router.post('/google', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = googleAuthSchema.parse(req.body);
  
  const result = await authenticationService.googleAuth(
    validatedData.credential,
    validatedData.userType
  );

  if (result.success) {
    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      },
      message: 'Google authentication successful'
    });
  } else {
    res.status(401).json({
      success: false,
      error: result.error
    });
  }
}));

// Forgot password endpoint
router.post('/forgot-password', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = forgotPasswordSchema.parse(req.body);
  
  const result = await authenticationService.sendPasswordResetEmail(validatedData.email);

  if (result.success) {
    res.json({
      success: true,
      message: result.message
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
}));

// Reset password endpoint
router.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = resetPasswordSchema.parse(req.body);
  
  const result = await authenticationService.resetPassword(
    validatedData.token,
    validatedData.password
  );

  if (result.success) {
    res.json({
      success: true,
      message: result.message
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
}));

// Verify email endpoint
router.post('/verify-email', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = verifyEmailSchema.parse(req.body);
  
  const result = await authenticationService.verifyEmail(validatedData.token);

  if (result.success) {
    res.json({
      success: true,
      message: result.message
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
}));

// Resend verification email endpoint
router.post('/resend-verification', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const result = await authenticationService.sendVerificationEmail(req.user!.userId);

  if (result.success) {
    res.json({
      success: true,
      message: result.message
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
}));

// Refresh token endpoint
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const validatedData = refreshTokenSchema.parse(req.body);
  
  const result = await authenticationService.refreshTokens(validatedData.refreshToken);

  if (result.success) {
    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      },
      message: 'Tokens refreshed successfully'
    });
  } else {
    res.status(401).json({
      success: false,
      error: result.error
    });
  }
}));

// Logout endpoint
router.post('/logout', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const result = await authenticationService.logout(req.user!.userId);

  if (result.success) {
    res.json({
      success: true,
      message: result.message
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
}));

// Update user profile endpoint
router.put('/profile', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = updateProfileSchema.parse(req.body);
  
  const result = await authenticationService.updateProfile(req.user!.userId, validatedData);

  if (result.success) {
    res.json({
      success: true,
      data: {
        user: result.user
      },
      message: 'Profile updated successfully'
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
}));

// Delete account endpoint
router.delete('/delete-account', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = deleteAccountSchema.parse(req.body);
  
  const result = await authenticationService.deleteAccount(
    req.user!.userId,
    validatedData.password
  );

  if (result.success) {
    res.json({
      success: true,
      message: result.message
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
}));

// Get Google OAuth configuration
router.get('/google/config', asyncHandler(async (req: Request, res: Response) => {
  const config = googleAuthService.getClientConfig();
  
  res.json({
    success: true,
    data: config,
    message: 'Google OAuth configuration retrieved'
  });
}));

export default router;

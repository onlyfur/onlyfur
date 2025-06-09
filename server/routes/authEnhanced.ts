import express from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../middleware/logger';
import { authenticationService } from '../services/authenticationService';
import { vercelBlobStorage } from '../services/vercelBlobStorage';

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

// Rate limiting
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

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
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
});

const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string().min(1, 'Password is required')
}).refine(data => data.email || data.username, {
  message: 'Either email or username is required'
});

const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  socialLinks: z.record(z.string()).optional(),
  preferredLanguage: z.string().optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional()
});

const deleteAccountSchema = z.object({
  password: z.string().optional(),
  confirmDelete: z.boolean().refine(val => val === true, {
    message: 'Account deletion must be confirmed'
  })
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - displayName
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *               displayName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const result = await authenticationService.register(validatedData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });
    } else {
      res.status(409).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: error.errors
      });
    }

    logger.error('Registration endpoint error', {
      error: error.message,
      body: req.body
    });

    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
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
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Invalid credentials
 *       423:
 *         description: Account locked
 *       500:
 *         description: Internal server error
 */
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await authenticationService.login(validatedData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } else {
      const statusCode = result.error?.includes('locked') ? 423 : 401;
      res.status(statusCode).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: error.errors
      });
    }

    logger.error('Login endpoint error', {
      error: error.message,
      body: { ...req.body, password: '[REDACTED]' }
    });

    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Google OAuth authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID token
 *     responses:
 *       200:
 *         description: Google authentication successful
 *       400:
 *         description: Invalid Google token
 *       500:
 *         description: Internal server error
 */
router.post('/google', authRateLimit, async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(500).json({
        success: false,
        error: 'Google authentication not configured'
      });
    }

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Google token is required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Google token'
      });
    }

    const result = await authenticationService.googleAuth({
      googleId: payload.sub,
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Google authentication successful',
        user: result.user,
        token: result.token
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    logger.error('Google auth endpoint error', {
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Google authentication failed. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!;

    const user = await authenticationService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    logger.error('Get profile endpoint error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               bio:
 *                 type: string
 *               socialLinks:
 *                 type: string
 *                 description: JSON string of social links
 *               preferredLanguage:
 *                 type: string
 *               timezone:
 *                 type: string
 *               emailNotifications:
 *                 type: boolean
 *               pushNotifications:
 *                 type: boolean
 *               marketingEmails:
 *                 type: boolean
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!;

    // Configure multer for file uploads
    const upload = vercelBlobStorage.configureMulter({
      category: 'avatar',
      userId
    });

    upload.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 }
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      try {
        // Parse and validate profile updates
        const updates: any = {};
        
        if (req.body.displayName) updates.displayName = req.body.displayName;
        if (req.body.bio) updates.bio = req.body.bio;
        if (req.body.socialLinks) {
          try {
            updates.socialLinks = JSON.parse(req.body.socialLinks);
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: 'Invalid socialLinks format'
            });
          }
        }
        if (req.body.preferredLanguage) updates.preferredLanguage = req.body.preferredLanguage;
        if (req.body.timezone) updates.timezone = req.body.timezone;
        if (req.body.emailNotifications !== undefined) updates.emailNotifications = req.body.emailNotifications === 'true';
        if (req.body.pushNotifications !== undefined) updates.pushNotifications = req.body.pushNotifications === 'true';
        if (req.body.marketingEmails !== undefined) updates.marketingEmails = req.body.marketingEmails === 'true';

        // Validate updates
        const validatedUpdates = profileUpdateSchema.parse(updates);

        // Get uploaded files
        const files = req.files as any;
        const avatarFile = files?.avatar?.[0];
        const coverImageFile = files?.coverImage?.[0];

        const result = await authenticationService.updateProfile(
          userId,
          validatedUpdates,
          avatarFile,
          coverImageFile
        );

        if (result.success) {
          res.json({
            success: true,
            message: 'Profile updated successfully',
            user: result.user
          });
        } else {
          res.status(400).json({
            success: false,
            error: result.error
          });
        }
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Invalid input data',
            details: error.errors
          });
        }

        logger.error('Profile update endpoint error', {
          userId,
          error: error.message
        });

        res.status(500).json({
          success: false,
          error: 'Profile update failed. Please try again.'
        });
      }
    });
  } catch (error: any) {
    logger.error('Profile update endpoint error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Profile update failed. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - confirmDelete
 *             properties:
 *               password:
 *                 type: string
 *                 description: Required for email/password users
 *               confirmDelete:
 *                 type: boolean
 *                 description: Must be true to confirm deletion
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Invalid password or unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-account', authMiddleware, authRateLimit, async (req, res) => {
  try {
    const { userId } = req.user!;
    const validatedData = deleteAccountSchema.parse(req.body);

    const result = await authenticationService.deleteAccount(userId, validatedData.password);

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      const statusCode = result.error?.includes('password') ? 401 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: error.errors
      });
    }

    logger.error('Delete account endpoint error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Account deletion failed. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/auth/verify-token:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
router.get('/verify-token', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!;

    const user = await authenticationService.getUserById(userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      valid: true,
      user
    });
  } catch (error: any) {
    logger.error('Token verification error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(401).json({
      success: false,
      valid: false,
      error: 'Token verification failed'
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
router.post('/logout', authMiddleware, generalRateLimit, async (req, res) => {
  try {
    // For JWT tokens, logout is handled client-side by removing the token
    // In a production environment, you might want to implement token blacklisting
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    logger.error('Logout endpoint error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

export default router;

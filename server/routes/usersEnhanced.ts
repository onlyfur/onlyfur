import express from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authEnhanced';
import { logger } from '../middleware/logger';
import { userManagementService } from '../services/userManagementService';
import { vercelBlobStorage } from '../services/vercelBlobStorage';

const router = express.Router();

// Rate limiting
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

const updateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 updates per window
  message: { error: 'Too many profile updates, please try again later.' }
});

// Validation schemas
const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  socialLinks: z.record(z.string()).optional(),
  preferredLanguage: z.string().optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  privacySettings: z.record(z.any()).optional(),
  contentSettings: z.record(z.any()).optional()
});

const updateSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
  timezone: z.string().optional(),
  privacySettings: z.record(z.any()).optional(),
  contentSettings: z.record(z.any()).optional(),
  paymentSettings: z.record(z.any()).optional()
});

const searchUsersSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
  role: z.enum(['CREATOR', 'SUBSCRIBER', 'ADMIN']).optional(),
  isVerified: z.boolean().optional(),
  sortBy: z.enum(['username', 'displayName', 'createdAt', 'followers']).default('username')
});

const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
});

/**
 * @swagger
 * /api/users-v2/profile/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users Enhanced]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile/:userId', optionalAuthMiddleware, generalRateLimit, async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user?.userId;

    const profile = await userManagementService.getUserProfile(userId, requesterId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error: any) {
    logger.error('Get user profile endpoint error', {
      userId: req.params.userId,
      requesterId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

/**
 * @swagger
 * /api/users-v2/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users Enhanced]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile', authMiddleware, generalRateLimit, async (req, res) => {
  try {
    const { userId } = req.user!;

    const profile = await userManagementService.getUserProfile(userId, userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error: any) {
    logger.error('Get current user profile endpoint error', {
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
 * /api/users-v2/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users Enhanced]
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
 *               privacySettings:
 *                 type: string
 *                 description: JSON string of privacy settings
 *               contentSettings:
 *                 type: string
 *                 description: JSON string of content settings
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
router.put('/profile', authMiddleware, updateRateLimit, async (req, res) => {
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
        if (req.body.preferredLanguage) updates.preferredLanguage = req.body.preferredLanguage;
        if (req.body.timezone) updates.timezone = req.body.timezone;
        if (req.body.emailNotifications !== undefined) updates.emailNotifications = req.body.emailNotifications === 'true';
        if (req.body.pushNotifications !== undefined) updates.pushNotifications = req.body.pushNotifications === 'true';
        if (req.body.marketingEmails !== undefined) updates.marketingEmails = req.body.marketingEmails === 'true';

        // Parse JSON fields
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

        if (req.body.privacySettings) {
          try {
            updates.privacySettings = JSON.parse(req.body.privacySettings);
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: 'Invalid privacySettings format'
            });
          }
        }

        if (req.body.contentSettings) {
          try {
            updates.contentSettings = JSON.parse(req.body.contentSettings);
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: 'Invalid contentSettings format'
            });
          }
        }

        // Validate updates
        const validatedUpdates = updateProfileSchema.parse(updates);

        // Get uploaded files
        const files = req.files as any;
        const uploadFiles = {
          avatar: files?.avatar?.[0],
          coverImage: files?.coverImage?.[0]
        };

        const result = await userManagementService.updateUserProfile(
          userId,
          validatedUpdates,
          uploadFiles
        );

        if (result.success) {
          res.json({
            success: true,
            message: 'Profile updated successfully',
            profile: result.user
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
 * /api/users-v2/settings:
 *   get:
 *     summary: Get user settings
 *     tags: [Users Enhanced]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/settings', authMiddleware, generalRateLimit, async (req, res) => {
  try {
    const { userId } = req.user!;

    const settings = await userManagementService.getUserSettings(userId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      settings
    });
  } catch (error: any) {
    logger.error('Get user settings endpoint error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get settings'
    });
  }
});

/**
 * @swagger
 * /api/users-v2/settings:
 *   put:
 *     summary: Update user settings
 *     tags: [Users Enhanced]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications:
 *                 type: boolean
 *               pushNotifications:
 *                 type: boolean
 *               marketingEmails:
 *                 type: boolean
 *               preferredLanguage:
 *                 type: string
 *               timezone:
 *                 type: string
 *               privacySettings:
 *                 type: object
 *               contentSettings:
 *                 type: object
 *               paymentSettings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/settings', authMiddleware, updateRateLimit, async (req, res) => {
  try {
    const { userId } = req.user!;
    const validatedSettings = updateSettingsSchema.parse(req.body);

    const result = await userManagementService.updateUserSettings(userId, validatedSettings);

    if (result.success) {
      res.json({
        success: true,
        message: 'Settings updated successfully',
        settings: result.settings
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

    logger.error('Update user settings endpoint error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Settings update failed. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/users-v2/search:
 *   get:
 *     summary: Search users
 *     tags: [Users Enhanced]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [CREATOR, SUBSCRIBER, ADMIN]
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [username, displayName, createdAt, followers]
 *           default: username
 *     responses:
 *       200:
 *         description: Users search results
 *       400:
 *         description: Invalid search parameters
 *       500:
 *         description: Internal server error
 */
router.get('/search', generalRateLimit, async (req, res) => {
  try {
    const searchParams = {
      q: req.query.q as string,
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0,
      role: req.query.role as any,
      isVerified: req.query.isVerified === 'true' ? true : req.query.isVerified === 'false' ? false : undefined,
      sortBy: (req.query.sortBy as any) || 'username'
    };

    const validatedParams = searchUsersSchema.parse(searchParams);

    const result = await userManagementService.searchUsers(validatedParams.q, {
      limit: validatedParams.limit,
      offset: validatedParams.offset,
      role: validatedParams.role,
      isVerified: validatedParams.isVerified,
      sortBy: validatedParams.sortBy
    });

    res.json({
      success: true,
      users: result.users,
      total: result.total,
      pagination: {
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        hasMore: result.total > validatedParams.offset + validatedParams.limit
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search parameters',
        details: error.errors
      });
    }

    logger.error('User search endpoint error', {
      query: req.query,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'User search failed'
    });
  }
});

/**
 * @swagger
 * /api/users-v2/{userId}/followers:
 *   get:
 *     summary: Get user followers
 *     tags: [Users Enhanced]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *     responses:
 *       200:
 *         description: User followers retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/followers', generalRateLimit, async (req, res) => {
  try {
    const { userId } = req.params;
    const paginationParams = {
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0
    };

    const validatedParams = paginationSchema.parse(paginationParams);

    const result = await userManagementService.getUserFollowers(userId, validatedParams);

    res.json({
      success: true,
      followers: result.followers,
      total: result.total,
      pagination: {
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        hasMore: result.total > validatedParams.offset + validatedParams.limit
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters',
        details: error.errors
      });
    }

    logger.error('Get user followers endpoint error', {
      userId: req.params.userId,
      query: req.query,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get followers'
    });
  }
});

/**
 * @swagger
 * /api/users-v2/{userId}/following:
 *   get:
 *     summary: Get user following
 *     tags: [Users Enhanced]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *     responses:
 *       200:
 *         description: User following retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/following', generalRateLimit, async (req, res) => {
  try {
    const { userId } = req.params;
    const paginationParams = {
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0
    };

    const validatedParams = paginationSchema.parse(paginationParams);

    const result = await userManagementService.getUserFollowing(userId, validatedParams);

    res.json({
      success: true,
      following: result.following,
      total: result.total,
      pagination: {
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        hasMore: result.total > validatedParams.offset + validatedParams.limit
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters',
        details: error.errors
      });
    }

    logger.error('Get user following endpoint error', {
      userId: req.params.userId,
      query: req.query,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get following'
    });
  }
});

/**
 * @swagger
 * /api/users-v2/follow/{userId}:
 *   post:
 *     summary: Follow a user
 *     tags: [Users Enhanced]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 *       400:
 *         description: Cannot follow user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/follow/:userId', authMiddleware, updateRateLimit, async (req, res) => {
  try {
    const { userId: subscriberId } = req.user!;
    const { userId: creatorId } = req.params;

    const result = await userManagementService.followUser(subscriberId, creatorId);

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      const statusCode = result.error?.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    logger.error('Follow user endpoint error', {
      subscriberId: req.user?.userId,
      creatorId: req.params.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to follow user. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/users-v2/unfollow/{userId}:
 *   post:
 *     summary: Unfollow a user
 *     tags: [Users Enhanced]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       400:
 *         description: Not following user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/unfollow/:userId', authMiddleware, updateRateLimit, async (req, res) => {
  try {
    const { userId: subscriberId } = req.user!;
    const { userId: creatorId } = req.params;

    const result = await userManagementService.unfollowUser(subscriberId, creatorId);

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
  } catch (error: any) {
    logger.error('Unfollow user endpoint error', {
      subscriberId: req.user?.userId,
      creatorId: req.params.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to unfollow user. Please try again.'
    });
  }
});

export default router;

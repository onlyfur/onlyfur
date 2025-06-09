import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { createRateLimit } from '../middleware/rateLimiter';
import { userPreferencesService } from '../services/userPreferences';
import { logger } from '../middleware/logger';

const router = express.Router();

// Rate limiting for preferences
const preferencesRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many preference requests, please try again later.'
});

// Validation schemas
const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  subscriptionUpdates: z.boolean().optional(),
  newFollowers: z.boolean().optional(),
  contentLikes: z.boolean().optional(),
  contentComments: z.boolean().optional(),
  directMessages: z.boolean().optional(),
  paymentNotifications: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  monthlyReport: z.boolean().optional()
});

const privacyPreferencesSchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'subscribers_only']).optional(),
  showOnlineStatus: z.boolean().optional(),
  allowDirectMessages: z.enum(['everyone', 'subscribers_only', 'none']).optional(),
  showLastSeen: z.boolean().optional(),
  dataAnalytics: z.boolean().optional(),
  personalizedAds: z.boolean().optional(),
  showInSearch: z.boolean().optional(),
  allowTagging: z.boolean().optional()
});

const contentPreferencesSchema = z.object({
  defaultContentVisibility: z.enum(['public', 'subscribers_only', 'private']).optional(),
  allowComments: z.boolean().optional(),
  allowRatings: z.boolean().optional(),
  allowSharing: z.boolean().optional(),
  contentWarnings: z.boolean().optional(),
  ageRestriction: z.boolean().optional(),
  downloadProtection: z.boolean().optional(),
  watermarkContent: z.boolean().optional()
});

const displayPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  currency: z.string().optional(),
  contentPerPage: z.number().min(10).max(100).optional(),
  autoplayVideos: z.boolean().optional(),
  showNSFWContent: z.boolean().optional(),
  blurNSFWThumbnails: z.boolean().optional(),
  compactMode: z.boolean().optional()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     NotificationPreferences:
 *       type: object
 *       properties:
 *         emailNotifications:
 *           type: boolean
 *         pushNotifications:
 *           type: boolean
 *         smsNotifications:
 *           type: boolean
 *         subscriptionUpdates:
 *           type: boolean
 *         newFollowers:
 *           type: boolean
 *         contentLikes:
 *           type: boolean
 *         contentComments:
 *           type: boolean
 *         directMessages:
 *           type: boolean
 *         paymentNotifications:
 *           type: boolean
 *         securityAlerts:
 *           type: boolean
 *         marketingEmails:
 *           type: boolean
 *         weeklyDigest:
 *           type: boolean
 *         monthlyReport:
 *           type: boolean
 */

/**
 * @swagger
 * /api/preferences:
 *   get:
 *     summary: Get all user preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 preferences:
 *                   type: object
 *                   properties:
 *                     notifications:
 *                       $ref: '#/components/schemas/NotificationPreferences'
 *                     privacy:
 *                       type: object
 *                     content:
 *                       type: object
 *                     display:
 *                       type: object
 */
router.get('/', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const preferences = await userPreferencesService.getAllPreferences(userId);

    res.json({
      preferences,
      message: 'Preferences retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve preferences',
      message: 'An error occurred while fetching your preferences'
    });
  }
});

/**
 * @swagger
 * /api/preferences/notifications:
 *   get:
 *     summary: Get notification preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved
 */
router.get('/notifications', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const preferences = await userPreferencesService.getNotificationPreferences(userId);

    res.json({
      preferences,
      message: 'Notification preferences retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get notification preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve notification preferences',
      message: 'An error occurred while fetching your notification settings'
    });
  }
});

/**
 * @swagger
 * /api/preferences/notifications:
 *   put:
 *     summary: Update notification preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationPreferences'
 *     responses:
 *       200:
 *         description: Notification preferences updated
 */
router.put('/notifications', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = notificationPreferencesSchema.parse(req.body);

    const success = await userPreferencesService.updateNotificationPreferences(userId, validatedData);

    if (success) {
      const updatedPreferences = await userPreferencesService.getNotificationPreferences(userId);
      
      res.json({
        preferences: updatedPreferences,
        message: 'Notification preferences updated successfully'
      });
    } else {
      res.status(500).json({
        error: 'Failed to update preferences',
        message: 'An error occurred while updating your notification settings'
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to update notification preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to update notification preferences',
      message: 'An error occurred while updating your notification settings'
    });
  }
});

/**
 * @swagger
 * /api/preferences/privacy:
 *   get:
 *     summary: Get privacy preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Privacy preferences retrieved
 */
router.get('/privacy', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const preferences = await userPreferencesService.getPrivacyPreferences(userId);

    res.json({
      preferences,
      message: 'Privacy preferences retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get privacy preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve privacy preferences',
      message: 'An error occurred while fetching your privacy settings'
    });
  }
});

/**
 * @swagger
 * /api/preferences/privacy:
 *   put:
 *     summary: Update privacy preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Privacy preferences updated
 */
router.put('/privacy', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = privacyPreferencesSchema.parse(req.body);

    const success = await userPreferencesService.updatePrivacyPreferences(userId, validatedData);

    if (success) {
      const updatedPreferences = await userPreferencesService.getPrivacyPreferences(userId);
      
      res.json({
        preferences: updatedPreferences,
        message: 'Privacy preferences updated successfully'
      });
    } else {
      res.status(500).json({
        error: 'Failed to update preferences',
        message: 'An error occurred while updating your privacy settings'
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to update privacy preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to update privacy preferences',
      message: 'An error occurred while updating your privacy settings'
    });
  }
});

/**
 * @swagger
 * /api/preferences/content:
 *   get:
 *     summary: Get content preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Content preferences retrieved
 */
router.get('/content', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const preferences = await userPreferencesService.getContentPreferences(userId);

    res.json({
      preferences,
      message: 'Content preferences retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get content preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve content preferences',
      message: 'An error occurred while fetching your content settings'
    });
  }
});

/**
 * @swagger
 * /api/preferences/content:
 *   put:
 *     summary: Update content preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Content preferences updated
 */
router.put('/content', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = contentPreferencesSchema.parse(req.body);

    const success = await userPreferencesService.updateContentPreferences(userId, validatedData);

    if (success) {
      const updatedPreferences = await userPreferencesService.getContentPreferences(userId);
      
      res.json({
        preferences: updatedPreferences,
        message: 'Content preferences updated successfully'
      });
    } else {
      res.status(500).json({
        error: 'Failed to update preferences',
        message: 'An error occurred while updating your content settings'
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to update content preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to update content preferences',
      message: 'An error occurred while updating your content settings'
    });
  }
});

/**
 * @swagger
 * /api/preferences/display:
 *   get:
 *     summary: Get display preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Display preferences retrieved
 */
router.get('/display', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const preferences = await userPreferencesService.getDisplayPreferences(userId);

    res.json({
      preferences,
      message: 'Display preferences retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get display preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve display preferences',
      message: 'An error occurred while fetching your display settings'
    });
  }
});

/**
 * @swagger
 * /api/preferences/display:
 *   put:
 *     summary: Update display preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Display preferences updated
 */
router.put('/display', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = displayPreferencesSchema.parse(req.body);

    const success = await userPreferencesService.updateDisplayPreferences(userId, validatedData);

    if (success) {
      const updatedPreferences = await userPreferencesService.getDisplayPreferences(userId);
      
      res.json({
        preferences: updatedPreferences,
        message: 'Display preferences updated successfully'
      });
    } else {
      res.status(500).json({
        error: 'Failed to update preferences',
        message: 'An error occurred while updating your display settings'
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to update display preferences', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to update display preferences',
      message: 'An error occurred while updating your display settings'
    });
  }
});

/**
 * @swagger
 * /api/preferences/{category}:
 *   get:
 *     summary: Get preferences by category
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category preferences retrieved
 */
router.get('/:category', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { category } = req.params;

    if (!['notifications', 'privacy', 'content', 'display'].includes(category)) {
      return res.status(400).json({
        error: 'Invalid category',
        message: 'Category must be one of: notifications, privacy, content, display'
      });
    }

    let preferences;
    switch (category) {
      case 'notifications':
        preferences = await userPreferencesService.getNotificationPreferences(userId);
        break;
      case 'privacy':
        preferences = await userPreferencesService.getPrivacyPreferences(userId);
        break;
      case 'content':
        preferences = await userPreferencesService.getContentPreferences(userId);
        break;
      case 'display':
        preferences = await userPreferencesService.getDisplayPreferences(userId);
        break;
    }

    res.json({
      preferences,
      category,
      message: `${category} preferences retrieved successfully`
    });

  } catch (error) {
    logger.error('Failed to get category preferences', {
      userId: (req as any).user?.id,
      category: req.params.category,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve preferences',
      message: 'An error occurred while fetching your preferences'
    });
  }
});

/**
 * @swagger
 * /api/preferences/reset:
 *   post:
 *     summary: Reset preferences to defaults
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [notifications, privacy, content, display]
 *     responses:
 *       200:
 *         description: Preferences reset successfully
 */
router.post('/reset', authenticateToken, preferencesRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { category } = req.body;

    if (category && !['notifications', 'privacy', 'content', 'display'].includes(category)) {
      return res.status(400).json({
        error: 'Invalid category',
        message: 'Category must be one of: notifications, privacy, content, display'
      });
    }

    const success = await userPreferencesService.resetPreferences(userId, category);

    if (success) {
      const preferences = await userPreferencesService.getAllPreferences(userId);
      
      res.json({
        preferences,
        message: category 
          ? `${category} preferences reset to defaults` 
          : 'All preferences reset to defaults'
      });
    } else {
      res.status(500).json({
        error: 'Failed to reset preferences',
        message: 'An error occurred while resetting your preferences'
      });
    }

  } catch (error) {
    logger.error('Failed to reset preferences', {
      userId: (req as any).user?.id,
      category: req.body?.category,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to reset preferences',
      message: 'An error occurred while resetting your preferences'
    });
  }
});

export default router;

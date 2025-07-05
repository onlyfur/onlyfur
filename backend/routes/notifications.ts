import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler, ValidationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import { NotificationType, NotificationPriority } from '@prisma/client';
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  updateNotificationPreferences,
  cleanupExpiredNotifications
} from '../services/notifications';

const router = express.Router();

// Validation schemas
const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  message: z.string().min(1, 'Message is required').max(500, 'Message too long'),
  priority: z.nativeEnum(NotificationPriority).optional(),
  data: z.record(z.any()).optional(),
  expiresAt: z.string().datetime().optional()
});

const updatePreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),
  categories: z.record(z.boolean()).optional()
});

const notificationQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => Math.min(parseInt(val) || 20, 50)).optional(),
  unreadOnly: z.string().transform(val => val === 'true').optional()
});

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 50
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const query = notificationQuerySchema.parse(req.query);

  const result = await getUserNotifications(
    userId,
    query.page,
    query.limit,
    query.unreadOnly
  );

  res.json({
    success: true,
    ...result
  });
}));

/**
 * @swagger
 * /api/notifications/count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 */
router.get('/count', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const count = await getUnreadNotificationCount(userId);

  res.json({
    success: true,
    unreadCount: count
  });
}));

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.patch('/:id/read', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const notificationId = req.params.id;

  await markNotificationAsRead(notificationId, userId);

  res.json({
    success: true,
    message: 'Notification marked as read'
  });
}));

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.patch('/read-all', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  await markAllNotificationsAsRead(userId);

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const notificationId = req.params.id;

  await deleteNotification(notificationId, userId);

  res.json({
    success: true,
    message: 'Notification deleted'
  });
}));

/**
 * @swagger
 * /api/notifications/preferences:
 *   get:
 *     summary: Get notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved
 */
router.get('/preferences', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  // Get current preferences from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      emailNotifications: true,
      pushNotifications: true,
      userPreferences: {
        where: {
          category: 'notifications'
        }
      }
    }
  });

  if (!user) {
    throw new ValidationError('User not found');
  }

  // Convert preferences to categories object
  const categories = user.userPreferences.reduce((acc, pref) => {
    acc[pref.key] = pref.value === 'true';
    return acc;
  }, {} as Record<string, boolean>);

  res.json({
    success: true,
    preferences: {
      emailNotifications: user.emailNotifications,
      pushNotifications: user.pushNotifications,
      inAppNotifications: true, // Always enabled
      categories
    }
  });
}));

/**
 * @swagger
 * /api/notifications/preferences:
 *   patch:
 *     summary: Update notification preferences
 *     tags: [Notifications]
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
 *               categories:
 *                 type: object
 *                 additionalProperties:
 *                   type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 */
router.patch('/preferences', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = updatePreferencesSchema.parse(req.body);

  await updateNotificationPreferences(userId, validatedData);

  res.json({
    success: true,
    message: 'Notification preferences updated successfully'
  });
}));

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send notification (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [SYSTEM, SUBSCRIPTION, MESSAGE, CONTENT, PAYMENT, SECURITY, MARKETING]
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, NORMAL, HIGH, URGENT]
 *               data:
 *                 type: object
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Notification sent successfully
 */
router.post('/send', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const validatedData = createNotificationSchema.parse(req.body);

  const notificationData = {
    ...validatedData,
    expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined
  };

  await createNotification(notificationData);

  logger.info('Admin notification sent', {
    adminId: req.user!.userId,
    targetUserId: validatedData.userId,
    type: validatedData.type
  });

  res.json({
    success: true,
    message: 'Notification sent successfully'
  });
}));

/**
 * @swagger
 * /api/notifications/broadcast:
 *   post:
 *     summary: Broadcast notification to all users (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               priority:
 *                 type: string
 *               userRole:
 *                 type: string
 *                 enum: [ALL, CREATOR, SUBSCRIBER]
 *                 default: ALL
 *     responses:
 *       200:
 *         description: Broadcast notification sent successfully
 */
router.post('/broadcast', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({
    type: z.nativeEnum(NotificationType),
    title: z.string().min(1).max(100),
    message: z.string().min(1).max(500),
    priority: z.nativeEnum(NotificationPriority).default(NotificationPriority.NORMAL),
    userRole: z.enum(['ALL', 'CREATOR', 'SUBSCRIBER']).default('ALL')
  });

  const validatedData = schema.parse(req.body);

  // Get target users based on role filter
  const whereClause: any = {};
  if (validatedData.userRole !== 'ALL') {
    whereClause.role = validatedData.userRole;
  }

  const targetUsers = await prisma.user.findMany({
    where: whereClause,
    select: { id: true }
  });

  // Send notification to all target users
  const notificationPromises = targetUsers.map(user =>
    createNotification({
      userId: user.id,
      type: validatedData.type,
      title: validatedData.title,
      message: validatedData.message,
      priority: validatedData.priority
    })
  );

  await Promise.all(notificationPromises);

  logger.info('Broadcast notification sent', {
    adminId: req.user!.userId,
    targetRole: validatedData.userRole,
    userCount: targetUsers.length,
    type: validatedData.type
  });

  res.json({
    success: true,
    message: `Broadcast notification sent to ${targetUsers.length} users`
  });
}));

/**
 * @swagger
 * /api/notifications/cleanup:
 *   post:
 *     summary: Cleanup expired notifications (Admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup completed successfully
 */
router.post('/cleanup', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  await cleanupExpiredNotifications();

  res.json({
    success: true,
    message: 'Expired notifications cleaned up successfully'
  });
}));

export default router;

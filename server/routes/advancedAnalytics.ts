import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken, requireCreator, requireAdmin } from '../middleware/auth';
import { asyncHandler, ValidationError, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import {
  trackContentAnalytics,
  trackUserAnalytics,
  getContentAnalytics,
  getUserAnalytics,
  getPlatformAnalytics,
  getCreatorAnalytics,
  trackPageView,
  trackContentView,
  trackContentInteraction,
  trackWatchTime,
  cleanupOldAnalytics
} from '../services/analytics';

const router = express.Router();

// Validation schemas
const analyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(['day', 'week', 'month', 'year']).default('month')
});

const trackEventSchema = z.object({
  eventType: z.string().min(1, 'Event type is required'),
  contentId: z.string().optional(),
  value: z.number().optional(),
  metadata: z.record(z.any()).optional()
});

const trackContentViewSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  uniqueView: z.boolean().default(false),
  watchTime: z.number().optional()
});

const trackInteractionSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  interactionType: z.enum(['like', 'comment', 'share', 'download'])
});

/**
 * @swagger
 * /api/analytics/track/page-view:
 *   post:
 *     summary: Track page view
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Page view tracked successfully
 */
router.post('/track/page-view', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const { page, metadata } = req.body;

  if (!page) {
    throw new ValidationError('Page is required');
  }

  await trackPageView(userId, page, metadata);

  res.json({
    success: true,
    message: 'Page view tracked'
  });
}));

/**
 * @swagger
 * /api/analytics/track/content-view:
 *   post:
 *     summary: Track content view
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *               uniqueView:
 *                 type: boolean
 *                 default: false
 *               watchTime:
 *                 type: integer
 *                 description: Watch time in seconds
 *     responses:
 *       200:
 *         description: Content view tracked successfully
 */
router.post('/track/content-view', asyncHandler(async (req, res) => {
  const validatedData = trackContentViewSchema.parse(req.body);
  const userId = req.user?.userId; // Optional authentication

  await trackContentView(
    validatedData.contentId, 
    userId, 
    validatedData.uniqueView
  );

  if (validatedData.watchTime) {
    await trackWatchTime(validatedData.contentId, validatedData.watchTime, userId);
  }

  res.json({
    success: true,
    message: 'Content view tracked'
  });
}));

/**
 * @swagger
 * /api/analytics/track/interaction:
 *   post:
 *     summary: Track content interaction
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *               interactionType:
 *                 type: string
 *                 enum: [like, comment, share, download]
 *     responses:
 *       200:
 *         description: Interaction tracked successfully
 */
router.post('/track/interaction', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = trackInteractionSchema.parse(req.body);

  await trackContentInteraction(
    validatedData.contentId,
    validatedData.interactionType,
    userId
  );

  res.json({
    success: true,
    message: 'Interaction tracked'
  });
}));

/**
 * @swagger
 * /api/analytics/content/{id}:
 *   get:
 *     summary: Get content analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Content analytics retrieved successfully
 */
router.get('/content/:id', authenticateToken, asyncHandler(async (req, res) => {
  const contentId = req.params.id;
  const userId = req.user!.userId;
  const query = analyticsQuerySchema.parse(req.query);

  // Check if user owns the content or is admin
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { creatorId: true }
  });

  if (!content) {
    throw new ValidationError('Content not found');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (content.creatorId !== userId && user?.role !== 'ADMIN') {
    throw new AuthorizationError('You can only view analytics for your own content');
  }

  const analytics = await getContentAnalytics(contentId, {
    startDate: query.startDate ? new Date(query.startDate) : undefined,
    endDate: query.endDate ? new Date(query.endDate) : undefined,
    period: query.period
  });

  res.json({
    success: true,
    analytics
  });
}));

/**
 * @swagger
 * /api/analytics/user/{id}:
 *   get:
 *     summary: Get user analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: User analytics retrieved successfully
 */
router.get('/user/:id', authenticateToken, asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const requestingUserId = req.user!.userId;
  const query = analyticsQuerySchema.parse(req.query);

  // Check if user is viewing their own analytics or is admin
  const user = await prisma.user.findUnique({
    where: { id: requestingUserId },
    select: { role: true }
  });

  if (targetUserId !== requestingUserId && user?.role !== 'ADMIN') {
    throw new AuthorizationError('You can only view your own analytics');
  }

  const analytics = await getUserAnalytics(targetUserId, {
    startDate: query.startDate ? new Date(query.startDate) : undefined,
    endDate: query.endDate ? new Date(query.endDate) : undefined,
    period: query.period
  });

  res.json({
    success: true,
    analytics
  });
}));

/**
 * @swagger
 * /api/analytics/creator/dashboard:
 *   get:
 *     summary: Get creator analytics dashboard
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Creator analytics retrieved successfully
 */
router.get('/creator/dashboard', authenticateToken, requireCreator, asyncHandler(async (req, res) => {
  const creatorId = req.user!.userId;
  const query = analyticsQuerySchema.parse(req.query);

  const analytics = await getCreatorAnalytics(creatorId, {
    startDate: query.startDate ? new Date(query.startDate) : undefined,
    endDate: query.endDate ? new Date(query.endDate) : undefined
  });

  res.json({
    success: true,
    analytics
  });
}));

/**
 * @swagger
 * /api/analytics/platform:
 *   get:
 *     summary: Get platform analytics (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Platform analytics retrieved successfully
 */
router.get('/platform', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const query = analyticsQuerySchema.parse(req.query);

  const analytics = await getPlatformAnalytics({
    startDate: query.startDate ? new Date(query.startDate) : undefined,
    endDate: query.endDate ? new Date(query.endDate) : undefined
  });

  res.json({
    success: true,
    analytics
  });
}));

/**
 * @swagger
 * /api/analytics/creator/top-content:
 *   get:
 *     summary: Get creator's top performing content
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           enum: [views, likes, comments, shares]
 *           default: views
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year, all_time]
 *           default: month
 *     responses:
 *       200:
 *         description: Top content retrieved successfully
 */
router.get('/creator/top-content', authenticateToken, requireCreator, asyncHandler(async (req, res) => {
  const creatorId = req.user!.userId;
  const metric = (req.query.metric as string) || 'views';
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
  const period = (req.query.period as string) || 'month';

  // Calculate date range based on period
  let startDate: Date | undefined;
  if (period !== 'all_time') {
    startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
  }

  // Map metric to database field
  const orderByField = metric === 'views' ? 'viewsCount' : 
                      metric === 'likes' ? 'likesCount' :
                      metric === 'comments' ? 'commentsCount' :
                      'sharesCount';

  const where: any = { creatorId };
  if (startDate) {
    where.createdAt = { gte: startDate };
  }

  const topContent = await prisma.content.findMany({
    where,
    orderBy: { [orderByField]: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      viewsCount: true,
      likesCount: true,
      commentsCount: true,
      sharesCount: true,
      createdAt: true,
      type: true
    }
  });

  res.json({
    success: true,
    topContent,
    metric,
    period,
    limit
  });
}));

/**
 * @swagger
 * /api/analytics/creator/performance-trends:
 *   get:
 *     summary: Get creator performance trends
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: day
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *           maximum: 365
 *     responses:
 *       200:
 *         description: Performance trends retrieved successfully
 */
router.get('/creator/performance-trends', authenticateToken, requireCreator, asyncHandler(async (req, res) => {
  const creatorId = req.user!.userId;
  const period = (req.query.period as string) || 'day';
  const days = Math.min(parseInt(req.query.days as string) || 30, 365);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get content analytics for the creator's content
  const contentIds = await prisma.content.findMany({
    where: { creatorId },
    select: { id: true }
  });

  const analyticsData = await prisma.contentAnalytics.findMany({
    where: {
      contentId: { in: contentIds.map(c => c.id) },
      date: { gte: startDate }
    },
    orderBy: { date: 'asc' }
  });

  // Group data by period
  const groupedData: { [key: string]: any } = {};

  analyticsData.forEach(item => {
    let key: string;
    const date = new Date(item.date);

    switch (period) {
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default: // day
        key = item.date.toISOString().split('T')[0];
    }

    if (!groupedData[key]) {
      groupedData[key] = {
        date: key,
        views: 0,
        uniqueViews: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        watchTime: 0
      };
    }

    groupedData[key].views += item.views;
    groupedData[key].uniqueViews += item.uniqueViews;
    groupedData[key].likes += item.likes;
    groupedData[key].comments += item.comments;
    groupedData[key].shares += item.shares;
    groupedData[key].watchTime += item.watchTime;
  });

  const trends = Object.values(groupedData).sort((a: any, b: any) => 
    a.date.localeCompare(b.date)
  );

  res.json({
    success: true,
    trends,
    period,
    days
  });
}));

/**
 * @swagger
 * /api/analytics/cleanup:
 *   post:
 *     summary: Cleanup old analytics data (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               retentionDays:
 *                 type: integer
 *                 default: 365
 *     responses:
 *       200:
 *         description: Cleanup completed successfully
 */
router.post('/cleanup', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const { retentionDays = 365 } = req.body;

  await cleanupOldAnalytics(retentionDays);

  logger.info('Analytics cleanup completed', {
    adminId: req.user!.userId,
    retentionDays
  });

  res.json({
    success: true,
    message: `Analytics data older than ${retentionDays} days has been cleaned up`
  });
}));

export default router;

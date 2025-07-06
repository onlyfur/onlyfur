import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const contentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  type: z.enum(['photo', 'video', 'audio', 'text', 'stream']),
  tier: z.string().min(1, 'Tier is required'),
  price: z.number().min(0, 'Price must be non-negative')
});

const contentUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  type: z.enum(['photo', 'video', 'audio', 'text', 'stream']).optional(),
  tier: z.string().optional(),
  price: z.number().min(0).optional(),
  status: z.enum(['published', 'draft', 'scheduled', 'archived']).optional()
});

/**
 * @swagger
 * /api/creator/dashboard/stats:
 *   get:
 *     summary: Get creator dashboard statistics
 *     tags: [Creator Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Creator dashboard statistics
 */
router.get('/dashboard/stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || (user.role !== 'CREATOR' && user.role !== 'creator')) {
    throw new AuthorizationError('Only creators can access dashboard stats');
  }

  // Get subscription stats
  const subscriptionStats = await prisma.subscription.aggregate({
    where: {
      creatorId: userId,
      status: 'ACTIVE'
    },
    _count: { id: true },
    _sum: { amount: true }
  });

  // Get content stats
  const contentStats = await prisma.content.aggregate({
    where: { 
      creatorId: userId,
      status: 'PUBLISHED'
    },
    _count: { id: true },
    _sum: { views: true }
  });

  // Get total content count
  const totalContent = await prisma.content.count({
    where: { creatorId: userId }
  });

  // Get monthly revenue (current month)
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyRevenue = await prisma.subscription.aggregate({
    where: {
      creatorId: userId,
      status: 'ACTIVE',
      createdAt: { gte: currentMonth }
    },
    _sum: { amount: true }
  });

  // Get engagement stats
  const engagementStats = await prisma.content.aggregate({
    where: {
      creatorId: userId,
      status: 'PUBLISHED'
    },
    _sum: {
      likes: true,
      views: true
    }
  });

  const stats = {
    totalRevenue: subscriptionStats._sum.amount || 0,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    totalSubscribers: subscriptionStats._count.id || 0,
    activeSubscribers: subscriptionStats._count.id || 0,
    totalContent: totalContent,
    publishedContent: contentStats._count.id || 0,
    totalViews: contentStats._sum.views || 0,
    totalLikes: engagementStats._sum.likes || 0,
    conversionRate: 0.15, // TODO: Calculate real conversion rate
    retentionRate: 0.85   // TODO: Calculate real retention rate
  };

  res.json({
    success: true,
    stats
  });
}));

/**
 * @swagger
 * /api/creator/content:
 *   get:
 *     summary: Get creator's content
 *     tags: [Creator Dashboard]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [published, draft, scheduled, archived]
 *     responses:
 *       200:
 *         description: Creator's content list
 */
router.get('/content', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const status = req.query.status as string;
  const offset = (page - 1) * limit;

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || (user.role !== 'CREATOR' && user.role !== 'creator')) {
    throw new AuthorizationError('Only creators can access content');
  }

  const whereClause: any = { creatorId: userId };
  if (status) {
    whereClause.status = status.toUpperCase();
  }

  const [content, total] = await Promise.all([
    prisma.content.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    }),
    prisma.content.count({ where: whereClause })
  ]);

  const formattedContent = content.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    type: item.type.toLowerCase(),
    url: item.mediaUrl,
    thumbnailUrl: item.thumbnailUrl,
    tier: item.tier || 'basic',
    price: item.price || 0,
    status: item.status.toLowerCase(),
    createdAt: item.createdAt,
    stats: {
      views: item.views || 0,
      likes: item._count.likes || 0,
      comments: item._count.comments || 0,
      earnings: 0 // TODO: Calculate real earnings per content
    }
  }));

  res.json({
    success: true,
    content: formattedContent,
    total,
    pages: Math.ceil(total / limit),
    pagination: { page, limit, total }
  });
}));

/**
 * @swagger
 * /api/creator/subscribers:
 *   get:
 *     summary: Get creator's subscribers
 *     tags: [Creator Dashboard]
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
 *       - in: query
 *         name: tier
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Creator's subscribers list
 */
router.get('/subscribers', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const tier = req.query.tier as string;
  const offset = (page - 1) * limit;

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || (user.role !== 'CREATOR' && user.role !== 'creator')) {
    throw new AuthorizationError('Only creators can access subscribers');
  }

  const whereClause: any = { 
    creatorId: userId,
    status: 'ACTIVE'
  };
  if (tier) {
    whereClause.tier = tier;
  }

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            lastActivityAt: true
          }
        }
      }
    }),
    prisma.subscription.count({ where: whereClause })
  ]);

  const formattedSubscribers = subscriptions.map(sub => ({
    id: sub.user.id,
    username: sub.user.username,
    displayName: sub.user.displayName,
    avatar: sub.user.avatar,
    tier: sub.tier,
    subscribedAt: sub.createdAt,
    lastActiveAt: sub.user.lastActivityAt || sub.createdAt,
    totalSpent: sub.amount,
    isActive: sub.status === 'ACTIVE'
  }));

  res.json({
    success: true,
    subscribers: formattedSubscribers,
    total,
    pages: Math.ceil(total / limit),
    pagination: { page, limit, total }
  });
}));

/**
 * @swagger
 * /api/creator/revenue:
 *   get:
 *     summary: Get creator revenue data for charts
 *     tags: [Creator Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Revenue data for charts
 */
router.get('/revenue', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const period = req.query.period as string || 'month';

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || (user.role !== 'CREATOR' && user.role !== 'creator')) {
    throw new AuthorizationError('Only creators can access revenue data');
  }

  // Calculate date range
  const now = new Date();
  let startDate = new Date();
  let groupBy = '';

  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      groupBy = 'day';
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      groupBy = 'month';
      break;
    default: // month
      startDate.setDate(now.getDate() - 30);
      groupBy = 'day';
      break;
  }

  // Get revenue data
  const revenueData = await prisma.subscription.findMany({
    where: {
      creatorId: userId,
      createdAt: { gte: startDate }
    },
    select: {
      amount: true,
      createdAt: true
    },
    orderBy: { createdAt: 'asc' }
  });

  // Group by date
  const groupedData: { [key: string]: { revenue: number; subscribers: number } } = {};

  revenueData.forEach(item => {
    const dateKey = period === 'year' 
      ? item.createdAt.toISOString().substring(0, 7) // YYYY-MM
      : item.createdAt.toISOString().substring(0, 10); // YYYY-MM-DD

    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { revenue: 0, subscribers: 0 };
    }
    groupedData[dateKey].revenue += item.amount;
    groupedData[dateKey].subscribers += 1;
  });

  const revenue = Object.entries(groupedData).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    subscribers: data.subscribers
  }));

  res.json({
    success: true,
    revenue
  });
}));

/**
 * @swagger
 * /api/creator/content:
 *   post:
 *     summary: Create new content
 *     tags: [Creator Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [photo, video, audio, text, stream]
 *               tier:
 *                 type: string
 *               price:
 *                 type: number
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Content created successfully
 */
router.post('/content', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = contentCreateSchema.parse(req.body);

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || (user.role !== 'CREATOR' && user.role !== 'creator')) {
    throw new AuthorizationError('Only creators can create content');
  }

  // TODO: Handle file upload to blob storage
  // For now, we'll create content without media URL

  const content = await prisma.content.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      type: validatedData.type.toUpperCase() as any,
      tier: validatedData.tier,
      price: validatedData.price,
      creatorId: userId,
      status: 'DRAFT'
    }
  });

  const formattedContent = {
    id: content.id,
    title: content.title,
    description: content.description,
    type: content.type.toLowerCase(),
    url: content.mediaUrl,
    thumbnailUrl: content.thumbnailUrl,
    tier: content.tier || 'basic',
    price: content.price || 0,
    status: content.status.toLowerCase(),
    createdAt: content.createdAt,
    stats: {
      views: 0,
      likes: 0,
      comments: 0,
      earnings: 0
    }
  };

  res.status(201).json({
    success: true,
    content: formattedContent
  });
}));

/**
 * @swagger
 * /api/creator/content/{id}:
 *   put:
 *     summary: Update content
 *     tags: [Creator Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [published, draft, scheduled, archived]
 *     responses:
 *       200:
 *         description: Content updated successfully
 */
router.put('/content/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const contentId = req.params.id;
  const validatedData = contentUpdateSchema.parse(req.body);

  // Verify content belongs to creator
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { creatorId: true }
  });

  if (!content) {
    throw new NotFoundError('Content not found');
  }

  if (content.creatorId !== userId) {
    throw new AuthorizationError('You can only update your own content');
  }

  const updateData: any = {};
  if (validatedData.title) updateData.title = validatedData.title;
  if (validatedData.description) updateData.description = validatedData.description;
  if (validatedData.type) updateData.type = validatedData.type.toUpperCase();
  if (validatedData.tier) updateData.tier = validatedData.tier;
  if (validatedData.price !== undefined) updateData.price = validatedData.price;
  if (validatedData.status) updateData.status = validatedData.status.toUpperCase();

  const updatedContent = await prisma.content.update({
    where: { id: contentId },
    data: updateData
  });

  const formattedContent = {
    id: updatedContent.id,
    title: updatedContent.title,
    description: updatedContent.description,
    type: updatedContent.type.toLowerCase(),
    url: updatedContent.mediaUrl,
    thumbnailUrl: updatedContent.thumbnailUrl,
    tier: updatedContent.tier || 'basic',
    price: updatedContent.price || 0,
    status: updatedContent.status.toLowerCase(),
    createdAt: updatedContent.createdAt,
    stats: {
      views: updatedContent.views || 0,
      likes: 0, // TODO: Get real likes count
      comments: 0, // TODO: Get real comments count
      earnings: 0
    }
  };

  res.json({
    success: true,
    content: formattedContent
  });
}));

/**
 * @swagger
 * /api/creator/content/{id}:
 *   delete:
 *     summary: Delete content
 *     tags: [Creator Dashboard]
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
 *         description: Content deleted successfully
 */
router.delete('/content/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const contentId = req.params.id;

  // Verify content belongs to creator
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { creatorId: true }
  });

  if (!content) {
    throw new NotFoundError('Content not found');
  }

  if (content.creatorId !== userId) {
    throw new AuthorizationError('You can only delete your own content');
  }

  await prisma.content.delete({
    where: { id: contentId }
  });

  res.json({
    success: true,
    message: 'Content deleted successfully'
  });
}));

export default router;

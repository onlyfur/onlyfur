import express, { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions, extractRequestInfo } from '../services/auditLog';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Validation schemas
const updateUserSchema = z.object({
  role: z.enum(['CREATOR', 'SUBSCRIBER', 'ADMIN']).optional(),
  isVerified: z.boolean().optional(),
  subscriptionStatus: z.enum(['FREE', 'ACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID', 'TRIALING', 'PAUSED', 'EXPIRED']).optional()
});

const moderateContentSchema = z.object({
  status: z.enum(['PUBLISHED', 'ARCHIVED']),
  reason: z.string().optional()
});

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     totalCreators:
 *                       type: integer
 *                     totalSubscribers:
 *                       type: integer
 *                     totalContent:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     activeSubscriptions:
 *                       type: integer
 */
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const [
    totalUsers,
    totalCreators,
    totalSubscribers,
    totalContent,
    activeSubscriptions,
    totalTransactions,
    recentUsers,
    recentContent
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'CREATOR' } }),
    prisma.user.count({ where: { role: 'SUBSCRIBER' } }),
    prisma.content.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.transaction.aggregate({
      where: {
        status: 'COMPLETED',
        type: { in: ['SUBSCRIPTION', 'ONE_TIME'] }
      },
      _sum: { amount: true }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        creator: {
          select: {
            username: true,
            displayName: true
          }
        }
      }
    })
  ]);

  const stats = {
    totalUsers,
    totalCreators,
    totalSubscribers,
    totalContent,
    totalRevenue: totalTransactions._sum.amount || 0,
    activeSubscriptions,
    recentUsers,
    recentContent
  };

  res.json({
    success: true,
    stats
  });
}));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin view)
 *     tags: [Admin]
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
 *         name: role
 *         schema:
 *           type: string
 *           enum: [CREATOR, SUBSCRIBER, ADMIN]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = (page - 1) * limit;
  const role = req.query.role as string;
  const search = req.query.search as string;

  const whereClause: any = {};
  
  if (role) whereClause.role = role;
  
  if (search) {
    whereClause.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
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
        authProvider: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdContent: true,
            subscriptions: true,
            transactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.user.count({ where: whereClause })
  ]);

  res.json({
    success: true,
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   put:
 *     summary: Update user (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               role:
 *                 type: string
 *                 enum: [CREATOR, SUBSCRIBER, ADMIN]
 *               isVerified:
 *                 type: boolean
 *               subscriptionStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/users/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const validatedData = updateUserSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: validatedData,
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      role: true,
      isVerified: true,
      subscriptionStatus: true,
      updatedAt: true
    }
  });

  logger.info('User updated by admin', {
    adminId: req.user!.userId,
    updatedUserId: userId,
    changes: validatedData
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    user: updatedUser
  });
}));

/**
 * @swagger
 * /api/admin/content:
 *   get:
 *     summary: Get all content for moderation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED, SCHEDULED]
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
 *     responses:
 *       200:
 *         description: Content list for moderation
 */
router.get('/content', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = (page - 1) * limit;
  const status = req.query.status as string;

  const whereClause: any = {};
  if (status) whereClause.status = status;

  const [content, total] = await Promise.all([
    prisma.content.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.content.count({ where: whereClause })
  ]);

  res.json({
    success: true,
    content,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

/**
 * @swagger
 * /api/admin/content/{contentId}/moderate:
 *   put:
 *     summary: Moderate content
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
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
 *               status:
 *                 type: string
 *                 enum: [PUBLISHED, ARCHIVED]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content moderated successfully
 */
router.put('/content/:contentId/moderate', asyncHandler(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const validatedData = moderateContentSchema.parse(req.body);
  const { status, reason } = validatedData;

  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      creator: {
        select: { id: true, email: true, displayName: true }
      }
    }
  });

  if (!content) {
    throw new NotFoundError('Content not found');
  }

  const updatedContent = await prisma.content.update({
    where: { id: contentId },
    data: { status }
  });

  logger.info('Content moderated', {
    adminId: req.user!.userId,
    contentId,
    creatorId: content.creatorId,
    status,
    reason
  });

  // TODO: Send notification to creator about moderation action

  res.json({
    success: true,
    message: 'Content moderated successfully',
    content: updatedContent
  });
}));

/**
 * @swagger
 * /api/admin/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of subscriptions
 */
router.get('/subscriptions', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = (page - 1) * limit;
  const status = req.query.status as string;

  const whereClause: any = {};
  if (status) whereClause.status = status;

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true
          }
        },
        tier: {
          select: {
            id: true,
            name: true,
            price: true,
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.subscription.count({ where: whereClause })
  ]);

  res.json({
    success: true,
    subscriptions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = (page - 1) * limit;
  const status = req.query.status as string;
  const type = req.query.type as string;

  const whereClause: any = {};
  if (status) whereClause.status = status;
  if (type) whereClause.type = type;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.transaction.count({ where: whereClause })
  ]);

  res.json({
    success: true,
    transactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Moderation queue endpoints
const reportSchema = z.object({
  contentId: z.string(),
  reason: z.string(),
  customReason: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL')
});

const moderationActionSchema = z.object({
  action: z.enum(['approve', 'remove', 'warn', 'dismiss']),
  resolution: z.string()
});

/**
 * @swagger
 * /api/admin/moderation/queue:
 *   get:
 *     summary: Get moderation queue
 *     tags: [Admin, Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, REVIEWING, RESOLVED, DISMISSED]
 *     responses:
 *       200:
 *         description: List of reports in moderation queue
 */
router.get('/moderation/queue', asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string;
  
  const whereClause: any = {};
  if (status) whereClause.status = status;

  const reports = await prisma.report.findMany({
    where: whereClause,
    include: {
      content: {
        select: {
          id: true,
          title: true,
          type: true,
          preview: true,
          creator: {
            select: {
              id: true,
              username: true,
              avatar: true,
              isVerified: true
            }
          }
        }
      },
      reportedBy: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      reviewedBy: {
        select: {
          id: true,
          username: true
        }
      }
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'asc' }
    ]
  });

  res.json({
    success: true,
    reports
  });
}));

/**
 * @swagger
 * /api/admin/moderation/stats:
 *   get:
 *     summary: Get moderation statistics
 *     tags: [Admin, Moderation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Moderation statistics
 */
router.get('/moderation/stats', asyncHandler(async (req: Request, res: Response) => {
  const [
    totalReports,
    pendingReports,
    resolvedToday,
    averageResponseTime,
    topReasons
  ] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.report.count({
      where: {
        status: 'RESOLVED',
        reviewedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.report.aggregate({
      where: { status: 'RESOLVED' },
      _avg: {
        responseTime: true
      }
    }),
    prisma.report.groupBy({
      by: ['reason'],
      _count: true,
      orderBy: {
        _count: {
          reason: 'desc'
        }
      },
      take: 5
    })
  ]);

  res.json({
    success: true,
    stats: {
      totalReports,
      pendingReports,
      resolvedToday,
      averageResponseTime: averageResponseTime._avg.responseTime || 0,
      topReasons: topReasons.map((r: { reason: string; _count: number }) => ({
        reason: r.reason,
        count: r._count
      })),
      moderationQueue: pendingReports
    }
  });
}));

/**
 * @swagger
 * /api/admin/moderation/reports/{reportId}/action:
 *   post:
 *     summary: Take action on a report
 *     tags: [Admin, Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
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
 *               action:
 *                 type: string
 *                 enum: [approve, remove, warn, dismiss]
 *               resolution:
 *                 type: string
 *     responses:
 *       200:
 *         description: Action taken successfully
 */
router.post('/moderation/reports/:reportId/action', asyncHandler(async (req: Request, res: Response) => {
  const { reportId } = req.params;
  const validatedData = moderationActionSchema.parse(req.body);
  const { action, resolution } = validatedData;

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      content: {
        select: {
          id: true,
          creatorId: true
        }
      }
    }
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Calculate response time
  const responseTime = Date.now() - new Date(report.createdAt).getTime();

  // Update report status
  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: 'RESOLVED',
      resolution,
      reviewedAt: new Date(),
      reviewedById: req.user!.userId,
      responseTime
    }
  });

  // Take action on content based on moderation decision
  if (action === 'remove') {
    await prisma.content.update({
      where: { id: report.content.id },
      data: { status: 'ARCHIVED' }
    });
  }

  // Create audit log
  await createAuditLog({
    adminId: req.user!.userId,
    action: AuditActions.MODERATION_ACTION,
    resource: 'report',
    resourceId: reportId,
    metadata: { action, resolution },
    ...extractRequestInfo(req)
  });

  // TODO: Send notification to content creator about moderation action

  res.json({
    success: true,
    message: 'Moderation action completed successfully',
    report: updatedReport
  });
}));

// TODO: Add more admin endpoints
// - Platform settings management
// - Tier management (CRUD)
// - Email template management
// - System health monitoring
// - Analytics and reporting

// Ban a user (soft ban by setting isActive false and lockedUntil far future)
router.post('/users/:userId/ban', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const adminId = req.user!.userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  if (!user.isActive) {
    return res.status(400).json({ success: false, message: 'User already banned' });
  }

  const lockedUntil = new Date();
  lockedUntil.setFullYear(lockedUntil.getFullYear() + 100); // effectively permanent ban

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: false, lockedUntil }
  });

  await createAuditLog({
    adminId,
    action: AuditActions.ADMIN_ACTION,
    resource: 'user',
    resourceId: userId,
    oldValues: { isActive: true, lockedUntil: null },
    newValues: { isActive: false, lockedUntil },
    metadata: { action: 'ban' },
    ...extractRequestInfo(req)
  });

  res.json({ success: true, message: 'User banned successfully', user: updatedUser });
}));

// Unban a user
router.post('/users/:userId/unban', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const adminId = req.user!.userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  if (user.isActive) {
    return res.status(400).json({ success: false, message: 'User is not banned' });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: true, lockedUntil: null }
  });

  await createAuditLog({
    adminId,
    action: AuditActions.ADMIN_ACTION,
    resource: 'user',
    resourceId: userId,
    oldValues: { isActive: false },
    newValues: { isActive: true, lockedUntil: null },
    metadata: { action: 'unban' },
    ...extractRequestInfo(req)
  });

  res.json({ success: true, message: 'User unbanned successfully', user: updatedUser });
}));

// Bulk ban users
router.post('/users/bulk-ban', asyncHandler(async (req: Request, res: Response) => {
  const { userIds } = req.body as { userIds: string[] };
  const adminId = req.user!.userId;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ValidationError('userIds array is required');
  }

  const lockedUntil = new Date();
  lockedUntil.setFullYear(lockedUntil.getFullYear() + 100);

  const updatedUsers = await prisma.user.updateMany({
    where: { id: { in: userIds }, isActive: true },
    data: { isActive: false, lockedUntil }
  });

  await createAuditLog({
    adminId,
    action: AuditActions.ADMIN_ACTION,
    resource: 'user',
    resourceId: 'bulk',
    newValues: { isActive: false, lockedUntil },
    metadata: { action: 'bulk-ban', userIds },
    ...extractRequestInfo(req)
  });

  res.json({ success: true, message: `Banned ${updatedUsers.count} users` });
}));

// Bulk unban users
router.post('/users/bulk-unban', asyncHandler(async (req: Request, res: Response) => {
  const { userIds } = req.body as { userIds: string[] };
  const adminId = req.user!.userId;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ValidationError('userIds array is required');
  }

  const updatedUsers = await prisma.user.updateMany({
    where: { id: { in: userIds }, isActive: false },
    data: { isActive: true, lockedUntil: null }
  });

  await createAuditLog({
    adminId,
    action: AuditActions.ADMIN_ACTION,
    resource: 'user',
    resourceId: 'bulk',
    newValues: { isActive: true, lockedUntil: null },
    metadata: { action: 'bulk-unban', userIds },
    ...extractRequestInfo(req)
  });

  res.json({ success: true, message: `Unbanned ${updatedUsers.count} users` });
}));

// Set or unset VIP status for a user
router.post('/users/:userId/vip', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { isVip } = req.body as { isVip: boolean };
  const adminId = req.user!.userId;

  if (typeof isVip !== 'boolean') {
    throw new ValidationError('isVip boolean is required');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isVip },
    select: {
      id: true,
      username: true,
      displayName: true,
      isVip: true
    }
  });

  await createAuditLog({
    adminId,
    action: AuditActions.ADMIN_ACTION,
    resource: 'user',
    resourceId: userId,
    oldValues: { isVip: user.isVip },
    newValues: { isVip },
    metadata: { action: 'set-vip' },
    ...extractRequestInfo(req)
  });

  res.json({ success: true, message: `User VIP status set to ${isVip}`, user: updatedUser });
}));

// Delete content (post)
router.delete('/content/:contentId', asyncHandler(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const adminId = req.user!.userId;

  const content = await prisma.content.findUnique({ where: { id: contentId } });
  if (!content) throw new NotFoundError('Content not found');

  await prisma.content.delete({ where: { id: contentId } });

  await createAuditLog({
    adminId,
    action: AuditActions.ADMIN_ACTION,
    resource: 'content',
    resourceId: contentId,
    metadata: { action: 'delete' },
    ...extractRequestInfo(req)
  });

  res.json({ success: true, message: 'Content deleted successfully' });
}));

export default router;

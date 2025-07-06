import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken, requireCreator, requireAdmin } from '../middleware/auth';
import { asyncHandler, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const analyticsRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(['day', 'week', 'month', 'year']).default('month')
});

/**
 * @swagger
 * /api/analytics/creator/overview:
 *   get:
 *     summary: Get creator analytics overview
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Creator analytics overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     totalViews:
 *                       type: integer
 *                     totalLikes:
 *                       type: integer
 *                     totalContent:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     subscriberCount:
 *                       type: integer
 */
router.get('/creator/overview', authenticateToken, requireCreator, asyncHandler(async (req, res) => {
  const creatorId = req.user!.userId;
  const { period } = analyticsRangeSchema.parse(req.query);

  // Calculate date range based on period
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setDate(endDate.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }

  const [
    contentStats,
    revenueStats,
    messageStats,
    topContent
  ] = await Promise.all([
    // Content statistics
    prisma.content.aggregate({
      where: {
        creatorId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        viewsCount: true,
        likesCount: true,
        commentsCount: true,
        sharesCount: true
      },
      _count: true
    }),
    
    // Revenue statistics
    prisma.transaction.aggregate({
      where: {
        userId: creatorId,
        status: 'COMPLETED',
        type: { in: ['SUBSCRIPTION', 'TIP'] },
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        netAmount: true
      },
      _count: true
    }),
    
    // Message statistics
    prisma.message.count({
      where: {
        recipientId: creatorId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    }),
    
    // Top performing content
    prisma.content.findMany({
      where: {
        creatorId,
        status: 'PUBLISHED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        viewsCount: 'desc'
      },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        viewsCount: true,
        likesCount: true,
        commentsCount: true,
        createdAt: true
      }
    })
  ]);

  const analytics = {
    period,
    dateRange: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    },
    overview: {
      totalViews: contentStats._sum.viewsCount || 0,
      totalLikes: contentStats._sum.likesCount || 0,
      totalComments: contentStats._sum.commentsCount || 0,
      totalShares: contentStats._sum.sharesCount || 0,
      totalContent: contentStats._count,
      totalRevenue: revenueStats._sum.netAmount || 0,
      totalTransactions: revenueStats._count,
      messagesReceived: messageStats
    },
    topContent
  };

  res.json({
    success: true,
    analytics
  });
}));

/**
 * @swagger
 * /api/analytics/creator/revenue:
 *   get:
 *     summary: Get creator revenue analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Revenue analytics
 */
router.get('/creator/revenue', authenticateToken, requireCreator, asyncHandler(async (req, res) => {
  const creatorId = req.user!.userId;
  const { period } = analyticsRangeSchema.parse(req.query);

  // Get revenue breakdown
  const [
    subscriptionRevenue,
    tipRevenue,
    revenueByPeriod
  ] = await Promise.all([
    // Subscription revenue
    prisma.transaction.aggregate({
      where: {
        userId: creatorId,
        status: 'COMPLETED',
        type: 'SUBSCRIPTION'
      },
      _sum: { netAmount: true },
      _count: true
    }),
    
    // Tip revenue
    prisma.transaction.aggregate({
      where: {
        userId: creatorId,
        status: 'COMPLETED',
        type: 'TIP'
      },
      _sum: { netAmount: true },
      _count: true
    }),
    
    // Revenue by time period (last 12 periods)
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${period}, created_at) as period,
        SUM(net_amount) as revenue,
        COUNT(*) as transactions
      FROM transactions 
      WHERE user_id = ${creatorId} 
        AND status = 'COMPLETED'
        AND type IN ('SUBSCRIPTION', 'TIP')
        AND created_at >= NOW() - INTERVAL '12 ${period}s'
      GROUP BY period 
      ORDER BY period DESC
    `
  ]);

  const revenue = {
    total: {
      subscriptions: subscriptionRevenue._sum.netAmount || 0,
      tips: tipRevenue._sum.netAmount || 0,
      total: (subscriptionRevenue._sum.netAmount || 0) + (tipRevenue._sum.netAmount || 0)
    },
    transactions: {
      subscriptions: subscriptionRevenue._count,
      tips: tipRevenue._count,
      total: subscriptionRevenue._count + tipRevenue._count
    },
    byPeriod: revenueByPeriod
  };

  res.json({
    success: true,
    revenue
  });
}));

/**
 * @swagger
 * /api/analytics/creator/content:
 *   get:
 *     summary: Get content performance analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Content performance analytics
 */
router.get('/creator/content', authenticateToken, requireCreator, asyncHandler(async (req, res) => {
  const creatorId = req.user!.userId;

  const [
    contentByType,
    contentByPrivacyLevel,
    recentPerformance
  ] = await Promise.all([
    // Content breakdown by type
    prisma.content.groupBy({
      by: ['type'],
      where: { creatorId },
      _count: true,
      _sum: {
        viewsCount: true,
        likesCount: true
      }
    }),
    
    // Content breakdown by privacy level
    prisma.content.groupBy({
      by: ['privacyLevel'],
      where: { creatorId },
      _count: true,
      _avg: {
        viewsCount: true,
        likesCount: true
      }
    }),
    
    // Recent content performance
    prisma.content.findMany({
      where: {
        creatorId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      select: {
        id: true,
        title: true,
        type: true,
        privacyLevel: true,
        viewsCount: true,
        likesCount: true,
        commentsCount: true,
        createdAt: true
      }
    })
  ]);

  const contentAnalytics = {
    byType: contentByType,
    byPrivacyLevel: contentByPrivacyLevel,
    recent: recentPerformance,
    summary: {
      totalContent: contentByType.reduce((sum, item) => sum + item._count, 0),
      totalViews: contentByType.reduce((sum, item) => sum + (item._sum.viewsCount || 0), 0),
      totalLikes: contentByType.reduce((sum, item) => sum + (item._sum.likesCount || 0), 0)
    }
  };

  res.json({
    success: true,
    contentAnalytics
  });
}));

/**
 * @swagger
 * /api/analytics/platform/overview:
 *   get:
 *     summary: Get platform analytics overview (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform analytics
 *       403:
 *         description: Admin access required
 */
router.get('/platform/overview', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const [
    userStats,
    contentStats,
    subscriptionStats,
    revenueStats,
    growthStats
  ] = await Promise.all([
    // User statistics
    prisma.user.groupBy({
      by: ['role'],
      _count: true
    }),
    
    // Content statistics
    prisma.content.aggregate({
      _count: true,
      _sum: {
        viewsCount: true,
        likesCount: true
      }
    }),
    
    // Subscription statistics
    prisma.subscription.groupBy({
      by: ['status'],
      _count: true
    }),
    
    // Revenue statistics
    prisma.transaction.aggregate({
      where: {
        status: 'COMPLETED',
        type: { in: ['SUBSCRIPTION', 'ONE_TIME'] }
      },
      _sum: { amount: true },
      _count: true
    }),
    
    // Growth statistics (last 30 days)
    Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.content.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.subscription.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])
  ]);

  const [newUsers, newContent, newSubscriptions] = growthStats;

  const platformAnalytics = {
    users: {
      byRole: userStats,
      total: userStats.reduce((sum, stat) => sum + stat._count, 0),
      newThisMonth: newUsers
    },
    content: {
      total: contentStats._count,
      totalViews: contentStats._sum.viewsCount || 0,
      totalLikes: contentStats._sum.likesCount || 0,
      newThisMonth: newContent
    },
    subscriptions: {
      byStatus: subscriptionStats,
      total: subscriptionStats.reduce((sum, stat) => sum + stat._count, 0),
      newThisMonth: newSubscriptions
    },
    revenue: {
      total: revenueStats._sum.amount || 0,
      transactions: revenueStats._count
    }
  };

  res.json({
    success: true,
    platformAnalytics
  });
}));

/**
 * @swagger
 * /api/analytics/user/activity:
 *   get:
 *     summary: Get user activity analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User activity analytics
 */
router.get('/user/activity', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  if (userRole === 'SUBSCRIBER') {
    // Subscriber analytics
    const [
      subscriptionHistory,
      messageStats,
      contentInteractions
    ] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId },
        include: { tier: true },
        orderBy: { createdAt: 'desc' }
      }),
      
      prisma.message.count({
        where: { senderId: userId }
      }),
      
      // This would require additional tracking tables in a real app
      // For now, return placeholder data
      Promise.resolve({ likes: 0, comments: 0, views: 0 })
    ]);

    res.json({
      success: true,
      userType: 'subscriber',
      analytics: {
        subscriptions: subscriptionHistory,
        messagesSent: messageStats,
        interactions: contentInteractions
      }
    });
    
  } else if (userRole === 'CREATOR') {
    // Creator analytics - redirect to creator overview
    return res.redirect('/api/analytics/creator/overview');
    
  } else {
    // Admin analytics - redirect to platform overview
    return res.redirect('/api/analytics/platform/overview');
  }
}));

// TODO: Add more analytics endpoints
// - Engagement metrics
// - Conversion funnel analysis
// - Cohort analysis
// - Geographic analytics
// - Device/browser analytics
// - A/B testing results
// - Content recommendation performance

export default router;

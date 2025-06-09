import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ValidationError, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const analyticsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  metrics: z.array(z.enum(['revenue', 'subscribers', 'views', 'engagement', 'retention'])).optional()
});

/**
 * @swagger
 * /api/analytics-v2/dashboard:
 *   get:
 *     summary: Get comprehensive creator analytics dashboard
 *     tags: [Advanced Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Analytics dashboard data
 */
router.get('/dashboard', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const { period } = analyticsQuerySchema.parse(req.query);

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || (user.role !== 'CREATOR' && user.role !== 'creator')) {
    throw new AuthorizationError('Only creators can access analytics');
  }

  // Calculate date range
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  // Get revenue analytics
  const revenueData = await prisma.subscription.aggregate({
    where: {
      creatorId: userId,
      status: 'ACTIVE',
      createdAt: { gte: startDate }
    },
    _sum: { amount: true },
    _count: { id: true }
  });

  // Get content performance
  const contentStats = await prisma.content.aggregate({
    where: {
      creatorId: userId,
      createdAt: { gte: startDate }
    },
    _sum: { views: true, likes: true },
    _count: { id: true }
  });

  // Get subscriber growth
  const subscriberGrowth = await prisma.subscription.groupBy({
    by: ['createdAt'],
    where: {
      creatorId: userId,
      createdAt: { gte: startDate }
    },
    _count: { id: true },
    orderBy: { createdAt: 'asc' }
  });

  // Get top performing content
  const topContent = await prisma.content.findMany({
    where: {
      creatorId: userId,
      createdAt: { gte: startDate }
    },
    orderBy: [
      { views: 'desc' },
      { likes: 'desc' }
    ],
    take: 10,
    select: {
      id: true,
      title: true,
      views: true,
      likes: true,
      createdAt: true,
      type: true
    }
  });

  // Get subscriber demographics
  const subscriberTiers = await prisma.subscription.groupBy({
    by: ['tier'],
    where: {
      creatorId: userId,
      status: 'ACTIVE'
    },
    _count: { id: true },
    _sum: { amount: true }
  });

  // Calculate engagement metrics
  const totalViews = contentStats._sum.views || 0;
  const totalLikes = contentStats._sum.likes || 0;
  const totalContent = contentStats._count.id || 0;
  const engagementRate = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;

  // Calculate retention rate (simplified)
  const retentionRate = await calculateRetentionRate(userId, startDate);

  // Calculate average revenue per user
  const totalRevenue = revenueData._sum.amount || 0;
  const totalSubscribers = revenueData._count.id || 0;
  const arpu = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;

  const analytics = {
    overview: {
      totalRevenue,
      totalSubscribers,
      totalViews,
      totalContent,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      retentionRate,
      arpu: parseFloat(arpu.toFixed(2))
    },
    revenue: {
      current: totalRevenue,
      breakdown: subscriberTiers.map(tier => ({
        tier: tier.tier,
        subscribers: tier._count.id,
        revenue: tier._sum.amount || 0
      }))
    },
    content: {
      totalPublished: totalContent,
      totalViews,
      totalLikes,
      averageViews: totalContent > 0 ? Math.round(totalViews / totalContent) : 0,
      topPerforming: topContent
    },
    growth: {
      subscriberGrowth: subscriberGrowth.map(item => ({
        date: item.createdAt,
        newSubscribers: item._count.id
      }))
    },
    demographics: {
      tierDistribution: subscriberTiers.map(tier => ({
        tier: tier.tier,
        count: tier._count.id,
        percentage: totalSubscribers > 0 ? (tier._count.id / totalSubscribers) * 100 : 0
      }))
    }
  };

  res.json({
    success: true,
    analytics,
    period,
    dateRange: {
      start: startDate,
      end: now
    }
  });
}));

/**
 * @swagger
 * /api/analytics-v2/revenue-forecast:
 *   get:
 *     summary: Get revenue forecasting based on historical data
 *     tags: [Advanced Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue forecast data
 */
router.get('/revenue-forecast', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  // Get historical revenue data (last 12 months)
  const historicalData = await prisma.subscription.groupBy({
    by: ['createdAt'],
    where: {
      creatorId: userId,
      createdAt: {
        gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      }
    },
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { createdAt: 'asc' }
  });

  // Simple linear regression for forecasting
  const forecast = generateRevenueForecast(historicalData);

  res.json({
    success: true,
    forecast: {
      historical: historicalData.map(item => ({
        month: item.createdAt,
        revenue: item._sum.amount || 0,
        subscribers: item._count.id
      })),
      predicted: forecast,
      confidence: 0.75, // Simplified confidence score
      insights: generateRevenueInsights(historicalData, forecast)
    }
  });
}));

/**
 * @swagger
 * /api/analytics-v2/audience-insights:
 *   get:
 *     summary: Get detailed audience analytics and behavior
 *     tags: [Advanced Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audience insights data
 */
router.get('/audience-insights', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  // Get subscriber activity patterns
  const subscriberActivity = await prisma.user.findMany({
    where: {
      subscriptions: {
        some: {
          creatorId: userId,
          status: 'ACTIVE'
        }
      }
    },
    select: {
      id: true,
      lastActivityAt: true,
      createdAt: true,
      subscriptions: {
        where: {
          creatorId: userId,
          status: 'ACTIVE'
        },
        select: {
          tier: true,
          createdAt: true,
          amount: true
        }
      }
    }
  });

  // Get content engagement by subscriber tier
  const engagementByTier = await prisma.subscription.findMany({
    where: {
      creatorId: userId,
      status: 'ACTIVE'
    },
    include: {
      user: {
        select: {
          id: true,
          lastActivityAt: true
        }
      }
    }
  });

  // Calculate audience segments
  const now = new Date();
  const segments = {
    highly_engaged: 0,
    moderately_engaged: 0,
    low_engagement: 0,
    at_risk: 0
  };

  subscriberActivity.forEach(subscriber => {
    const lastActivity = subscriber.lastActivityAt || subscriber.createdAt;
    const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceActivity <= 7) {
      segments.highly_engaged++;
    } else if (daysSinceActivity <= 30) {
      segments.moderately_engaged++;
    } else if (daysSinceActivity <= 60) {
      segments.low_engagement++;
    } else {
      segments.at_risk++;
    }
  });

  // Get tier upgrade/downgrade patterns
  const tierChanges = await analyzeSubscriptionChanges(userId);

  // Calculate lifetime value
  const ltv = await calculateLifetimeValue(userId);

  res.json({
    success: true,
    insights: {
      totalAudience: subscriberActivity.length,
      segments,
      tierDistribution: engagementByTier.reduce((acc, sub) => {
        acc[sub.tier] = (acc[sub.tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      tierChanges,
      lifetimeValue: ltv,
      recommendations: generateAudienceRecommendations(segments, tierChanges)
    }
  });
}));

/**
 * @swagger
 * /api/analytics-v2/content-performance:
 *   get:
 *     summary: Get detailed content performance analytics
 *     tags: [Advanced Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Content performance data
 */
router.get('/content-performance', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  // Get content performance metrics
  const contentMetrics = await prisma.content.findMany({
    where: { creatorId: userId },
    select: {
      id: true,
      title: true,
      type: true,
      views: true,
      likes: true,
      createdAt: true,
      tier: true,
      _count: {
        select: {
          comments: true
        }
      }
    },
    orderBy: { views: 'desc' }
  });

  // Analyze content by type
  const performanceByType = contentMetrics.reduce((acc, content) => {
    const type = content.type.toLowerCase();
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        averageViews: 0,
        engagementRate: 0
      };
    }

    acc[type].count++;
    acc[type].totalViews += content.views || 0;
    acc[type].totalLikes += content.likes || 0;
    acc[type].totalComments += content._count.comments;

    return acc;
  }, {} as Record<string, any>);

  // Calculate averages and engagement rates
  Object.keys(performanceByType).forEach(type => {
    const data = performanceByType[type];
    data.averageViews = Math.round(data.totalViews / data.count);
    data.engagementRate = data.totalViews > 0 
      ? ((data.totalLikes + data.totalComments) / data.totalViews) * 100 
      : 0;
  });

  // Get posting patterns
  const postingPatterns = analyzePostingPatterns(contentMetrics);

  // Get optimal posting times (simplified)
  const optimalTimes = await getOptimalPostingTimes(userId);

  res.json({
    success: true,
    performance: {
      overview: {
        totalContent: contentMetrics.length,
        totalViews: contentMetrics.reduce((sum, c) => sum + (c.views || 0), 0),
        totalLikes: contentMetrics.reduce((sum, c) => sum + (c.likes || 0), 0),
        averageEngagement: calculateAverageEngagement(contentMetrics)
      },
      byType: performanceByType,
      topPerforming: contentMetrics.slice(0, 10),
      postingPatterns,
      optimalTimes,
      recommendations: generateContentRecommendations(performanceByType, postingPatterns)
    }
  });
}));

// Helper functions
async function calculateRetentionRate(creatorId: string, startDate: Date): Promise<number> {
  // Simplified retention calculation
  const totalSubscribers = await prisma.subscription.count({
    where: {
      creatorId,
      createdAt: { gte: startDate }
    }
  });

  const activeSubscribers = await prisma.subscription.count({
    where: {
      creatorId,
      status: 'ACTIVE',
      createdAt: { gte: startDate }
    }
  });

  return totalSubscribers > 0 ? (activeSubscribers / totalSubscribers) * 100 : 0;
}

function generateRevenueForecast(historicalData: any[]): any[] {
  // Simple linear trend forecast for next 6 months
  if (historicalData.length < 2) return [];

  const months = historicalData.length;
  const revenues = historicalData.map(d => d._sum.amount || 0);
  
  // Calculate trend
  const slope = (revenues[revenues.length - 1] - revenues[0]) / months;
  const lastRevenue = revenues[revenues.length - 1];

  const forecast = [];
  for (let i = 1; i <= 6; i++) {
    const predictedRevenue = Math.max(0, lastRevenue + (slope * i));
    forecast.push({
      month: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)),
      predictedRevenue: Math.round(predictedRevenue),
      confidence: Math.max(0.3, 0.9 - (i * 0.1)) // Decreasing confidence
    });
  }

  return forecast;
}

function generateRevenueInsights(historical: any[], forecast: any[]): string[] {
  const insights = [];
  
  if (forecast.length > 0) {
    const growth = forecast[forecast.length - 1].predictedRevenue - (historical[historical.length - 1]?._sum?.amount || 0);
    if (growth > 0) {
      insights.push(`Revenue is projected to grow by $${growth} over the next 6 months`);
    } else {
      insights.push('Revenue growth may slow down - consider new content strategies');
    }
  }

  insights.push('Focus on subscriber retention to maintain steady revenue');
  insights.push('Consider introducing new subscription tiers for revenue optimization');

  return insights;
}

async function analyzeSubscriptionChanges(creatorId: string): Promise<any> {
  // This would analyze tier changes over time
  // Simplified for now
  return {
    upgrades: 0,
    downgrades: 0,
    churned: 0,
    reactivated: 0
  };
}

async function calculateLifetimeValue(creatorId: string): Promise<number> {
  const avgSubscription = await prisma.subscription.aggregate({
    where: {
      creatorId,
      status: 'ACTIVE'
    },
    _avg: { amount: true }
  });

  // Simplified LTV calculation: average monthly revenue * estimated lifetime (12 months)
  return (avgSubscription._avg.amount || 0) * 12;
}

function generateAudienceRecommendations(segments: any, tierChanges: any): string[] {
  const recommendations = [];

  if (segments.at_risk > segments.highly_engaged * 0.3) {
    recommendations.push('High number of at-risk subscribers - consider re-engagement campaigns');
  }

  if (segments.highly_engaged > segments.total * 0.5) {
    recommendations.push('Strong engagement - consider premium content or higher-tier offerings');
  }

  recommendations.push('Regular interaction with subscribers increases retention');

  return recommendations;
}

function analyzePostingPatterns(content: any[]): any {
  // Analyze when content was posted and performance
  const dayOfWeek = content.reduce((acc, c) => {
    const day = new Date(c.createdAt).getDay();
    acc[day] = (acc[day] || 0) + (c.views || 0);
    return acc;
  }, {});

  const hourOfDay = content.reduce((acc, c) => {
    const hour = new Date(c.createdAt).getHours();
    acc[hour] = (acc[hour] || 0) + (c.views || 0);
    return acc;
  }, {});

  return { dayOfWeek, hourOfDay };
}

async function getOptimalPostingTimes(creatorId: string): Promise<any> {
  // This would analyze when subscribers are most active
  // Simplified recommendation
  return {
    bestDays: ['Tuesday', 'Thursday', 'Saturday'],
    bestHours: [19, 20, 21], // 7-9 PM
    timezone: 'UTC'
  };
}

function calculateAverageEngagement(content: any[]): number {
  if (content.length === 0) return 0;
  
  const totalViews = content.reduce((sum, c) => sum + (c.views || 0), 0);
  const totalLikes = content.reduce((sum, c) => sum + (c.likes || 0), 0);
  const totalComments = content.reduce((sum, c) => sum + (c._count?.comments || 0), 0);

  return totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
}

function generateContentRecommendations(byType: any, patterns: any): string[] {
  const recommendations = [];
  
  // Find best performing content type
  const bestType = Object.keys(byType).reduce((best, type) => 
    byType[type].engagementRate > (byType[best]?.engagementRate || 0) ? type : best, 
    Object.keys(byType)[0]
  );

  if (bestType) {
    recommendations.push(`${bestType} content performs best - consider creating more`);
  }

  recommendations.push('Consistent posting schedule improves audience engagement');
  recommendations.push('Engage with comments to boost algorithmic visibility');

  return recommendations;
}

export default router;

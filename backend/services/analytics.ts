import { prisma } from './database';
import { logger } from '../middleware/logger';

export interface AnalyticsEvent {
  userId?: string;
  eventType: string;
  resource: string;
  resourceId?: string;
  value?: number;
  metadata?: any;
}

export interface ContentAnalyticsData {
  contentId: string;
  views?: number;
  uniqueViews?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  downloads?: number;
  watchTime?: number;
  bounceRate?: number;
  engagement?: number;
}

export interface UserAnalyticsData {
  userId: string;
  sessionTime?: number;
  pageViews?: number;
  contentViewed?: number;
  messagesExchanged?: number;
  subscriptionsChanged?: number;
}

export interface AnalyticsQuery {
  startDate?: Date;
  endDate?: Date;
  period?: 'day' | 'week' | 'month' | 'year';
  userId?: string;
  contentId?: string;
}

/**
 * Track content analytics
 */
export async function trackContentAnalytics(data: ContentAnalyticsData): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.contentAnalytics.upsert({
      where: {
        contentId_date: {
          contentId: data.contentId,
          date: today
        }
      },
      create: {
        contentId: data.contentId,
        date: today,
        views: data.views || 0,
        uniqueViews: data.uniqueViews || 0,
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0,
        downloads: data.downloads || 0,
        watchTime: data.watchTime || 0,
        bounceRate: data.bounceRate || 0,
        engagement: data.engagement || 0
      },
      update: {
        views: { increment: data.views || 0 },
        uniqueViews: { increment: data.uniqueViews || 0 },
        likes: { increment: data.likes || 0 },
        comments: { increment: data.comments || 0 },
        shares: { increment: data.shares || 0 },
        downloads: { increment: data.downloads || 0 },
        watchTime: { increment: data.watchTime || 0 },
        bounceRate: data.bounceRate !== undefined ? data.bounceRate : undefined,
        engagement: data.engagement !== undefined ? data.engagement : undefined
      }
    });

    // Update content totals
    await prisma.content.update({
      where: { id: data.contentId },
      data: {
        viewsCount: { increment: data.views || 0 },
        likesCount: { increment: data.likes || 0 },
        commentsCount: { increment: data.comments || 0 },
        sharesCount: { increment: data.shares || 0 }
      }
    });

    logger.debug('Content analytics tracked', { contentId: data.contentId });

  } catch (error) {
    logger.error('Failed to track content analytics', {
      contentId: data.contentId,
      error: error.message
    });
  }
}

/**
 * Track user analytics
 */
export async function trackUserAnalytics(data: UserAnalyticsData): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.userAnalytics.upsert({
      where: {
        userId_date: {
          userId: data.userId,
          date: today
        }
      },
      create: {
        userId: data.userId,
        date: today,
        sessionTime: data.sessionTime || 0,
        pageViews: data.pageViews || 0,
        contentViewed: data.contentViewed || 0,
        messagesExchanged: data.messagesExchanged || 0,
        subscriptionsChanged: data.subscriptionsChanged || 0
      },
      update: {
        sessionTime: { increment: data.sessionTime || 0 },
        pageViews: { increment: data.pageViews || 0 },
        contentViewed: { increment: data.contentViewed || 0 },
        messagesExchanged: { increment: data.messagesExchanged || 0 },
        subscriptionsChanged: { increment: data.subscriptionsChanged || 0 }
      }
    });

    logger.debug('User analytics tracked', { userId: data.userId });

  } catch (error) {
    logger.error('Failed to track user analytics', {
      userId: data.userId,
      error: error.message
    });
  }
}

/**
 * Get content analytics
 */
export async function getContentAnalytics(contentId: string, query: AnalyticsQuery) {
  try {
    const { startDate, endDate, period = 'month' } = query;

    const where: any = { contentId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const analytics = await prisma.contentAnalytics.findMany({
      where,
      orderBy: { date: 'asc' }
    });

    // Group data by period if needed
    const groupedData = groupAnalyticsByPeriod(analytics, period);

    // Calculate totals
    const totals = analytics.reduce((acc, item) => ({
      views: acc.views + item.views,
      uniqueViews: acc.uniqueViews + item.uniqueViews,
      likes: acc.likes + item.likes,
      comments: acc.comments + item.comments,
      shares: acc.shares + item.shares,
      downloads: acc.downloads + item.downloads,
      watchTime: acc.watchTime + item.watchTime
    }), {
      views: 0,
      uniqueViews: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      downloads: 0,
      watchTime: 0
    });

    // Calculate averages
    const averages = {
      bounceRate: analytics.length > 0 ? analytics.reduce((acc, item) => acc + item.bounceRate, 0) / analytics.length : 0,
      engagement: analytics.length > 0 ? analytics.reduce((acc, item) => acc + item.engagement, 0) / analytics.length : 0
    };

    return {
      data: groupedData,
      totals,
      averages,
      period
    };

  } catch (error) {
    logger.error('Failed to get content analytics', { contentId, error: error.message });
    throw error;
  }
}

/**
 * Get user analytics
 */
export async function getUserAnalytics(userId: string, query: AnalyticsQuery) {
  try {
    const { startDate, endDate, period = 'month' } = query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const analytics = await prisma.userAnalytics.findMany({
      where,
      orderBy: { date: 'asc' }
    });

    // Group data by period if needed
    const groupedData = groupAnalyticsByPeriod(analytics, period);

    // Calculate totals
    const totals = analytics.reduce((acc, item) => ({
      sessionTime: acc.sessionTime + item.sessionTime,
      pageViews: acc.pageViews + item.pageViews,
      contentViewed: acc.contentViewed + item.contentViewed,
      messagesExchanged: acc.messagesExchanged + item.messagesExchanged,
      subscriptionsChanged: acc.subscriptionsChanged + item.subscriptionsChanged
    }), {
      sessionTime: 0,
      pageViews: 0,
      contentViewed: 0,
      messagesExchanged: 0,
      subscriptionsChanged: 0
    });

    return {
      data: groupedData,
      totals,
      period
    };

  } catch (error) {
    logger.error('Failed to get user analytics', { userId, error: error.message });
    throw error;
  }
}

/**
 * Get platform overview analytics
 */
export async function getPlatformAnalytics(query: AnalyticsQuery) {
  try {
    const { startDate, endDate } = query;

    const dateFilter: any = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.gte = startDate;
      if (endDate) dateFilter.lte = endDate;
    }

    // Get user stats
    const userStats = await prisma.user.aggregate({
      _count: true,
      where: {
        createdAt: dateFilter
      }
    });

    const creatorStats = await prisma.user.aggregate({
      _count: true,
      where: {
        role: 'CREATOR',
        createdAt: dateFilter
      }
    });

    // Get content stats
    const contentStats = await prisma.content.aggregate({
      _count: true,
      _sum: {
        viewsCount: true,
        likesCount: true,
        commentsCount: true,
        sharesCount: true
      },
      where: {
        createdAt: dateFilter
      }
    });

    // Get subscription stats
    const subscriptionStats = await prisma.subscription.aggregate({
      _count: true,
      where: {
        status: 'ACTIVE',
        createdAt: dateFilter
      }
    });

    // Get revenue stats
    const revenueStats = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
        netAmount: true
      },
      where: {
        status: 'COMPLETED',
        createdAt: dateFilter
      }
    });

    // Get message stats
    const messageStats = await prisma.message.aggregate({
      _count: true,
      where: {
        createdAt: dateFilter
      }
    });

    return {
      users: {
        total: userStats._count,
        creators: creatorStats._count,
        subscribers: userStats._count - creatorStats._count
      },
      content: {
        total: contentStats._count,
        totalViews: contentStats._sum.viewsCount || 0,
        totalLikes: contentStats._sum.likesCount || 0,
        totalComments: contentStats._sum.commentsCount || 0,
        totalShares: contentStats._sum.sharesCount || 0
      },
      subscriptions: {
        active: subscriptionStats._count
      },
      revenue: {
        total: revenueStats._sum.amount || 0,
        net: revenueStats._sum.netAmount || 0
      },
      messages: {
        total: messageStats._count
      }
    };

  } catch (error) {
    logger.error('Failed to get platform analytics', { error: error.message });
    throw error;
  }
}

/**
 * Get creator dashboard analytics
 */
export async function getCreatorAnalytics(creatorId: string, query: AnalyticsQuery) {
  try {
    const { startDate, endDate } = query;

    const dateFilter: any = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.gte = startDate;
      if (endDate) dateFilter.lte = endDate;
    }

    // Get content stats
    const contentStats = await prisma.content.aggregate({
      _count: true,
      _sum: {
        viewsCount: true,
        likesCount: true,
        commentsCount: true,
        sharesCount: true
      },
      where: {
        creatorId,
        createdAt: dateFilter
      }
    });

    // Get subscriber stats
    const subscriberStats = await prisma.subscription.aggregate({
      _count: true,
      where: {
        tier: {
          creatorId // Assuming tier model has creatorId
        },
        status: 'ACTIVE',
        createdAt: dateFilter
      }
    });

    // Get revenue stats
    const revenueStats = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
        netAmount: true
      },
      where: {
        userId: creatorId,
        status: 'COMPLETED',
        createdAt: dateFilter
      }
    });

    // Get message stats
    const messageStats = await prisma.message.aggregate({
      _count: true,
      where: {
        recipientId: creatorId,
        createdAt: dateFilter
      }
    });

    // Get top performing content
    const topContent = await prisma.content.findMany({
      where: {
        creatorId,
        createdAt: dateFilter
      },
      orderBy: [
        { viewsCount: 'desc' },
        { likesCount: 'desc' }
      ],
      take: 10,
      select: {
        id: true,
        title: true,
        viewsCount: true,
        likesCount: true,
        commentsCount: true,
        createdAt: true
      }
    });

    return {
      content: {
        total: contentStats._count,
        totalViews: contentStats._sum.viewsCount || 0,
        totalLikes: contentStats._sum.likesCount || 0,
        totalComments: contentStats._sum.commentsCount || 0,
        totalShares: contentStats._sum.sharesCount || 0
      },
      subscribers: {
        total: subscriberStats._count
      },
      revenue: {
        total: revenueStats._sum.amount || 0,
        net: revenueStats._sum.netAmount || 0
      },
      messages: {
        received: messageStats._count
      },
      topContent
    };

  } catch (error) {
    logger.error('Failed to get creator analytics', { creatorId, error: error.message });
    throw error;
  }
}

/**
 * Clean up old analytics data
 */
export async function cleanupOldAnalytics(retentionDays: number = 365): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const [contentDeleted, userDeleted] = await Promise.all([
      prisma.contentAnalytics.deleteMany({
        where: {
          date: {
            lt: cutoffDate
          }
        }
      }),
      prisma.userAnalytics.deleteMany({
        where: {
          date: {
            lt: cutoffDate
          }
        }
      })
    ]);

    logger.info('Old analytics data cleaned up', {
      contentAnalyticsDeleted: contentDeleted.count,
      userAnalyticsDeleted: userDeleted.count,
      retentionDays,
      cutoffDate
    });

  } catch (error) {
    logger.error('Failed to cleanup old analytics', {
      retentionDays,
      error: error.message
    });
  }
}

// Helper functions

function groupAnalyticsByPeriod(data: any[], period: string) {
  if (period === 'day') {
    return data; // Already grouped by day
  }

  const grouped: { [key: string]: any } = {};

  data.forEach(item => {
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
      case 'year':
        key = String(date.getFullYear());
        break;
      default:
        key = item.date.toISOString().split('T')[0];
    }

    if (!grouped[key]) {
      grouped[key] = { ...item, date: key };
    } else {
      // Sum up the values
      Object.keys(item).forEach(field => {
        if (typeof item[field] === 'number' && field !== 'bounceRate' && field !== 'engagement') {
          grouped[key][field] = (grouped[key][field] || 0) + item[field];
        }
      });
    }
  });

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}

// Event tracking helpers

export async function trackPageView(userId?: string, page: string, metadata?: any) {
  if (userId) {
    await trackUserAnalytics({ userId, pageViews: 1 });
  }
  
  logger.debug('Page view tracked', { userId, page, metadata });
}

export async function trackContentView(contentId: string, userId?: string, uniqueView: boolean = false) {
  await trackContentAnalytics({ 
    contentId, 
    views: 1, 
    uniqueViews: uniqueView ? 1 : 0 
  });
  
  if (userId) {
    await trackUserAnalytics({ userId, contentViewed: 1 });
  }
}

export async function trackContentInteraction(
  contentId: string, 
  interactionType: 'like' | 'comment' | 'share' | 'download',
  userId?: string
) {
  const data: ContentAnalyticsData = { contentId };
  data[interactionType + 's'] = 1;
  
  await trackContentAnalytics(data);
  
  logger.debug('Content interaction tracked', { contentId, interactionType, userId });
}

export async function trackWatchTime(contentId: string, watchTime: number, userId?: string) {
  await trackContentAnalytics({ contentId, watchTime });
  
  if (userId) {
    await trackUserAnalytics({ userId, sessionTime: watchTime });
  }
}

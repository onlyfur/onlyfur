import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import vercelIntegration from '../services/vercelIntegration';

const router = express.Router();

/**
 * @swagger
 * /api/home-v2/feed:
 *   get:
 *     summary: Get personalized home feed with AI recommendations
 *     tags: [Home]
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
 *     responses:
 *       200:
 *         description: Personalized home feed
 */
router.get('/feed', asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;

  let feedSections: any = {};

  if (userId) {
    // Authenticated user - personalized feed
    const [
      subscribedContent,
      recommendedCreators,
      trendingContent,
      newCreators,
      userPreferences
    ] = await Promise.all([
      getSubscribedContent(userId, Math.ceil(limit * 0.4)), // 40% subscribed content
      vercelIntegration.getRecommendedCreators(userId, 6),
      getTrendingContent(Math.ceil(limit * 0.3)), // 30% trending
      vercelIntegration.getNewCreators(4),
      getUserPreferences(userId)
    ]);

    // Get AI-recommended content based on user behavior
    const recommendedContent = await getAIRecommendedContent(userId, Math.ceil(limit * 0.3));

    feedSections = {
      subscribedContent: {
        title: 'From Your Subscriptions',
        items: subscribedContent,
        type: 'content'
      },
      recommendedCreators: {
        title: 'Creators You Might Like',
        items: recommendedCreators,
        type: 'creators'
      },
      recommendedContent: {
        title: 'Recommended for You',
        items: recommendedContent,
        type: 'content'
      },
      trendingContent: {
        title: 'Trending Now',
        items: trendingContent,
        type: 'content'
      },
      newCreators: {
        title: 'New Creators',
        items: newCreators,
        type: 'creators'
      }
    };
  } else {
    // Guest user - public feed
    const [
      trendingContent,
      popularCreators,
      newCreators,
      categories
    ] = await Promise.all([
      getTrendingContent(Math.ceil(limit * 0.5)), // 50% trending for guests
      getPopularCreators(6),
      vercelIntegration.getNewCreators(4),
      getPopularCategories()
    ]);

    feedSections = {
      trendingContent: {
        title: 'Trending Content',
        items: trendingContent,
        type: 'content'
      },
      popularCreators: {
        title: 'Popular Creators',
        items: popularCreators,
        type: 'creators'
      },
      newCreators: {
        title: 'New Creators',
        items: newCreators,
        type: 'creators'
      },
      categories: {
        title: 'Popular Categories',
        items: categories,
        type: 'categories'
      }
    };
  }

  res.json({
    success: true,
    feedSections,
    meta: {
      isPersonalized: !!userId,
      page,
      timestamp: new Date().toISOString()
    }
  });
}));

/**
 * @swagger
 * /api/home-v2/explore:
 *   get:
 *     summary: Advanced explore page with AI-powered discovery
 *     tags: [Home]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [creators, content, all]
 *           default: all
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [recommended, trending, newest, popular]
 *           default: recommended
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 24
 *     responses:
 *       200:
 *         description: Explore content and creators
 */
router.get('/explore', asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const category = req.query.category as string;
  const type = req.query.type as string || 'all';
  const sort = req.query.sort as string || 'recommended';
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 24, 100);
  const offset = (page - 1) * limit;

  let results: any = {
    creators: [],
    content: [],
    total: 0
  };

  if (type === 'creators' || type === 'all') {
    const creators = await getExploreCreators(userId, category, sort, limit, offset);
    results.creators = creators.items;
    if (type === 'creators') results.total = creators.total;
  }

  if (type === 'content' || type === 'all') {
    const content = await getExploreContent(userId, category, sort, limit, offset);
    results.content = content.items;
    if (type === 'content') results.total = content.total;
  }

  if (type === 'all') {
    // Mix creators and content for discovery
    const mixedResults = await getMixedExploreResults(userId, category, sort, limit, offset);
    results = mixedResults;
  }

  // Get related suggestions
  const suggestions = await getExploreSuggestions(userId, category);

  res.json({
    success: true,
    results,
    suggestions,
    pagination: {
      page,
      limit,
      total: results.total,
      pages: Math.ceil(results.total / limit)
    },
    meta: {
      category,
      type,
      sort,
      isPersonalized: !!userId
    }
  });
}));

/**
 * @swagger
 * /api/home-v2/recommendations:
 *   get:
 *     summary: Get AI-powered creator recommendations
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: excludeSubscribed
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: AI-powered creator recommendations
 */
router.get('/recommendations', asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
  const excludeSubscribed = req.query.excludeSubscribed !== 'false';

  if (!userId) {
    // For guest users, show popular creators
    const popularCreators = await getPopularCreators(limit);
    return res.json({
      success: true,
      recommendations: popularCreators,
      meta: {
        isPersonalized: false,
        algorithm: 'popularity'
      }
    });
  }

  // Get AI recommendations for logged-in users
  const recommendations = await vercelIntegration.getRecommendedCreators(userId, limit * 2);

  let filteredRecommendations = recommendations;

  if (excludeSubscribed) {
    // Remove already subscribed creators
    const subscriptions = await vercelIntegration.prisma.subscription.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      select: { creatorId: true }
    });

    const subscribedCreatorIds = new Set(subscriptions.map(sub => sub.creatorId));
    filteredRecommendations = recommendations.filter(creator => 
      !subscribedCreatorIds.has(creator.id)
    );
  }

  // Get additional context for recommendations
  const enhancedRecommendations = await Promise.all(
    filteredRecommendations.slice(0, limit).map(async (creator) => {
      const [recentContent, subscriptionTiers] = await Promise.all([
        vercelIntegration.prisma.content.findMany({
          where: {
            creatorId: creator.id,
            status: 'PUBLISHED',
            isPublic: true
          },
          select: {
            id: true,
            title: true,
            type: true,
            mediaUrls: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        }),
        getCreatorSubscriptionTiers(creator.id)
      ]);

      return {
        ...creator,
        recentContent,
        subscriptionTiers,
        reasonsToSubscribe: generateSubscriptionReasons(creator)
      };
    })
  );

  res.json({
    success: true,
    recommendations: enhancedRecommendations,
    meta: {
      isPersonalized: true,
      algorithm: 'ai_collaborative_filtering',
      totalAvailable: filteredRecommendations.length
    }
  });
}));

/**
 * @swagger
 * /api/home-v2/trending:
 *   get:
 *     summary: Get trending creators and content
 *     tags: [Home]
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: week
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Trending creators and content
 */
router.get('/trending', asyncHandler(async (req, res) => {
  const timeframe = req.query.timeframe as string || 'week';
  const category = req.query.category as string;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

  const timeframeDays = {
    day: 1,
    week: 7,
    month: 30
  };

  const daysAgo = timeframeDays[timeframe as keyof typeof timeframeDays] || 7;
  const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  const [trendingCreators, trendingContent, trendingCategories] = await Promise.all([
    getTrendingCreatorsDetailed(startDate, category, Math.ceil(limit / 2)),
    getTrendingContentDetailed(startDate, category, Math.ceil(limit / 2)),
    getTrendingCategories(startDate)
  ]);

  res.json({
    success: true,
    trending: {
      creators: trendingCreators,
      content: trendingContent,
      categories: trendingCategories
    },
    meta: {
      timeframe,
      category,
      startDate: startDate.toISOString()
    }
  });
}));

/**
 * @swagger
 * /api/home-v2/categories:
 *   get:
 *     summary: Get all categories with statistics
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Categories with creator and content counts
 */
router.get('/categories', asyncHandler(async (req, res) => {
  const categoriesWithStats = await getCategoriesWithStats();

  res.json({
    success: true,
    categories: categoriesWithStats
  });
}));

// Helper functions

async function getSubscribedContent(userId: string, limit: number) {
  const subscriptions = await vercelIntegration.prisma.subscription.findMany({
    where: {
      userId,
      status: 'ACTIVE'
    },
    select: { creatorId: true, tier: true }
  });

  if (subscriptions.length === 0) return [];

  const creatorIds = subscriptions.map(sub => sub.creatorId);
  
  return await vercelIntegration.prisma.content.findMany({
    where: {
      creatorId: { in: creatorIds },
      status: 'PUBLISHED',
      isPublic: true
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          isVerified: true
        }
      },
      _count: {
        select: { likes: true, comments: true, views: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

async function getTrendingContent(limit: number) {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  return await vercelIntegration.prisma.content.findMany({
    where: {
      status: 'PUBLISHED',
      isPublic: true,
      tier: 'FREE',
      createdAt: { gte: threeDaysAgo }
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          isVerified: true
        }
      },
      _count: {
        select: { likes: true, comments: true, views: true }
      }
    },
    orderBy: [
      { likes: 'desc' },
      { views: 'desc' },
      { createdAt: 'desc' }
    ],
    take: limit
  });
}

async function getAIRecommendedContent(userId: string, limit: number) {
  // Get user's interaction history for AI recommendations
  const userInteractions = await vercelIntegration.prisma.contentInteraction.findMany({
    where: { userId },
    include: {
      content: {
        select: {
          category: true,
          tags: true,
          type: true,
          creatorId: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  // Extract preferences from user behavior
  const categoryPreferences = new Map<string, number>();
  const tagPreferences = new Map<string, number>();
  const typePreferences = new Map<string, number>();
  const creatorPreferences = new Map<string, number>();

  userInteractions.forEach(interaction => {
    const weight = interaction.type === 'LIKE' ? 3 : interaction.type === 'SHARE' ? 2 : 1;
    
    // Category preferences
    if (interaction.content.category) {
      categoryPreferences.set(
        interaction.content.category,
        (categoryPreferences.get(interaction.content.category) || 0) + weight
      );
    }

    // Tag preferences
    interaction.content.tags?.forEach(tag => {
      tagPreferences.set(tag, (tagPreferences.get(tag) || 0) + weight);
    });

    // Type preferences
    typePreferences.set(
      interaction.content.type,
      (typePreferences.get(interaction.content.type) || 0) + weight
    );

    // Creator preferences
    creatorPreferences.set(
      interaction.content.creatorId,
      (creatorPreferences.get(interaction.content.creatorId) || 0) + weight
    );
  });

  // Build recommendation query
  const preferredCategories = Array.from(categoryPreferences.keys()).slice(0, 5);
  const preferredTags = Array.from(tagPreferences.keys()).slice(0, 10);
  const preferredTypes = Array.from(typePreferences.keys()).slice(0, 3);

  const recommendedContent = await vercelIntegration.prisma.content.findMany({
    where: {
      status: 'PUBLISHED',
      isPublic: true,
      tier: 'FREE',
      OR: [
        { category: { in: preferredCategories } },
        { tags: { hasSome: preferredTags } },
        { type: { in: preferredTypes } }
      ],
      createdAt: {
        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // Last 2 weeks
      }
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          isVerified: true
        }
      },
      _count: {
        select: { likes: true, comments: true, views: true }
      }
    },
    take: limit * 2
  });

  // Score and sort recommendations
  const scoredContent = recommendedContent.map(content => {
    let score = 0;
    
    // Category match
    if (content.category && categoryPreferences.has(content.category)) {
      score += categoryPreferences.get(content.category)! * 3;
    }

    // Tag matches
    content.tags?.forEach(tag => {
      if (tagPreferences.has(tag)) {
        score += tagPreferences.get(tag)! * 2;
      }
    });

    // Type match
    if (typePreferences.has(content.type)) {
      score += typePreferences.get(content.type)! * 1.5;
    }

    // Creator preference
    if (creatorPreferences.has(content.creatorId)) {
      score += creatorPreferences.get(content.creatorId)! * 1;
    }

    // Boost for recent content
    const daysSinceCreated = (Date.now() - content.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 14 - daysSinceCreated) * 0.5;

    // Boost for popular content
    score += Math.log(content._count.likes + 1) * 2;
    score += Math.log(content._count.views + 1) * 1;

    return { ...content, aiScore: score };
  });

  return scoredContent
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, limit);
}

async function getPopularCreators(limit: number) {
  return await vercelIntegration.prisma.user.findMany({
    where: { role: 'CREATOR' },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatar: true,
      isVerified: true,
      categories: true,
      tags: true,
      subscriberCount: true,
      createdAt: true,
      _count: {
        select: { content: true }
      }
    },
    orderBy: [
      { subscriberCount: 'desc' },
      { isVerified: 'desc' },
      { createdAt: 'desc' }
    ],
    take: limit
  });
}

async function getPopularCategories() {
  const categoryStats = await vercelIntegration.prisma.content.groupBy({
    by: ['category'],
    where: {
      status: 'PUBLISHED',
      isPublic: true,
      category: { not: null }
    },
    _count: { id: true },
    _sum: { views: true, likes: true },
    orderBy: { _count: { id: 'desc' } },
    take: 12
  });

  return categoryStats.map(stat => ({
    name: stat.category,
    contentCount: stat._count.id,
    totalViews: stat._sum.views || 0,
    totalLikes: stat._sum.likes || 0
  }));
}

async function getExploreCreators(userId: string | undefined, category: string | undefined, sort: string, limit: number, offset: number) {
  let orderBy: any = { createdAt: 'desc' };
  
  switch (sort) {
    case 'trending':
      orderBy = [{ subscriberCount: 'desc' }, { createdAt: 'desc' }];
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'popular':
      orderBy = [{ subscriberCount: 'desc' }, { isVerified: 'desc' }];
      break;
    case 'recommended':
      if (userId) {
        // Use AI recommendations for logged-in users
        return {
          items: await vercelIntegration.getRecommendedCreators(userId, limit),
          total: limit
        };
      } else {
        orderBy = [{ isVerified: 'desc' }, { subscriberCount: 'desc' }];
      }
      break;
  }

  const whereClause: any = { role: 'CREATOR' };
  if (category) {
    whereClause.categories = { has: category };
  }

  const [creators, total] = await Promise.all([
    vercelIntegration.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        isVerified: true,
        categories: true,
        tags: true,
        subscriberCount: true,
        createdAt: true,
        _count: {
          select: { content: true }
        }
      },
      orderBy,
      skip: offset,
      take: limit
    }),
    vercelIntegration.prisma.user.count({ where: whereClause })
  ]);

  return { items: creators, total };
}

async function getExploreContent(userId: string | undefined, category: string | undefined, sort: string, limit: number, offset: number) {
  let orderBy: any = { createdAt: 'desc' };
  
  switch (sort) {
    case 'trending':
      orderBy = [{ likes: 'desc' }, { views: 'desc' }];
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'popular':
      orderBy = [{ views: 'desc' }, { likes: 'desc' }];
      break;
  }

  const whereClause: any = {
    status: 'PUBLISHED',
    isPublic: true,
    tier: 'FREE'
  };
  
  if (category) {
    whereClause.category = category;
  }

  const [content, total] = await Promise.all([
    vercelIntegration.prisma.content.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true
          }
        },
        _count: {
          select: { likes: true, comments: true, views: true }
        }
      },
      orderBy,
      skip: offset,
      take: limit
    }),
    vercelIntegration.prisma.content.count({ where: whereClause })
  ]);

  return { items: content, total };
}

async function getMixedExploreResults(userId: string | undefined, category: string | undefined, sort: string, limit: number, offset: number) {
  const creatorLimit = Math.ceil(limit * 0.4); // 40% creators
  const contentLimit = Math.floor(limit * 0.6); // 60% content

  const [creators, content] = await Promise.all([
    getExploreCreators(userId, category, sort, creatorLimit, Math.floor(offset * 0.4)),
    getExploreContent(userId, category, sort, contentLimit, Math.floor(offset * 0.6))
  ]);

  // Mix creators and content for a diverse feed
  const mixed = [];
  let creatorIndex = 0;
  let contentIndex = 0;

  for (let i = 0; i < limit; i++) {
    if (i % 3 === 0 && creatorIndex < creators.items.length) {
      // Every 3rd item is a creator
      mixed.push({ type: 'creator', data: creators.items[creatorIndex++] });
    } else if (contentIndex < content.items.length) {
      mixed.push({ type: 'content', data: content.items[contentIndex++] });
    }
  }

  return {
    items: mixed,
    total: creators.total + content.total,
    creators: creators.items,
    content: content.items
  };
}

async function getExploreSuggestions(userId: string | undefined, category: string | undefined) {
  const suggestions: any = {};

  // Category suggestions
  if (!category) {
    suggestions.categories = await getPopularCategories();
  } else {
    // Related categories based on user behavior
    suggestions.relatedCategories = await getRelatedCategories(category);
  }

  // Tag suggestions
  suggestions.popularTags = await getPopularTags(category);

  // Creator suggestions
  if (userId) {
    suggestions.recommendedCreators = await vercelIntegration.getRecommendedCreators(userId, 4);
  }

  return suggestions;
}

async function getTrendingCreatorsDetailed(startDate: Date, category: string | undefined, limit: number) {
  const whereClause: any = {
    role: 'CREATOR',
    createdAt: { gte: startDate }
  };
  
  if (category) {
    whereClause.categories = { has: category };
  }

  return await vercelIntegration.prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatar: true,
      isVerified: true,
      categories: true,
      subscriberCount: true,
      createdAt: true,
      _count: {
        select: {
          content: { where: { createdAt: { gte: startDate } } },
          subscriptions: { where: { createdAt: { gte: startDate } } }
        }
      }
    },
    orderBy: [
      { subscriberCount: 'desc' },
      { createdAt: 'desc' }
    ],
    take: limit
  });
}

async function getTrendingContentDetailed(startDate: Date, category: string | undefined, limit: number) {
  const whereClause: any = {
    status: 'PUBLISHED',
    isPublic: true,
    tier: 'FREE',
    createdAt: { gte: startDate }
  };
  
  if (category) {
    whereClause.category = category;
  }

  return await vercelIntegration.prisma.content.findMany({
    where: whereClause,
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          isVerified: true
        }
      },
      _count: {
        select: { likes: true, comments: true, views: true }
      }
    },
    orderBy: [
      { likes: 'desc' },
      { views: 'desc' }
    ],
    take: limit
  });
}

async function getTrendingCategories(startDate: Date) {
  return await vercelIntegration.prisma.content.groupBy({
    by: ['category'],
    where: {
      status: 'PUBLISHED',
      isPublic: true,
      createdAt: { gte: startDate },
      category: { not: null }
    },
    _count: { id: true },
    _sum: { views: true, likes: true },
    orderBy: { _sum: { likes: 'desc' } },
    take: 10
  });
}

async function getCategoriesWithStats() {
  const stats = await vercelIntegration.prisma.content.groupBy({
    by: ['category'],
    where: {
      status: 'PUBLISHED',
      category: { not: null }
    },
    _count: { id: true },
    _sum: { views: true, likes: true }
  });

  const creatorStats = await vercelIntegration.prisma.user.groupBy({
    by: ['categories'],
    where: { role: 'CREATOR' },
    _count: { id: true }
  });

  // Flatten category arrays and count creators
  const creatorCounts = new Map<string, number>();
  creatorStats.forEach(stat => {
    stat.categories?.forEach(category => {
      creatorCounts.set(category, (creatorCounts.get(category) || 0) + stat._count.id);
    });
  });

  return stats.map(stat => ({
    name: stat.category,
    contentCount: stat._count.id,
    creatorCount: creatorCounts.get(stat.category!) || 0,
    totalViews: stat._sum.views || 0,
    totalLikes: stat._sum.likes || 0
  })).sort((a, b) => b.contentCount - a.contentCount);
}

async function getUserPreferences(userId: string) {
  return await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: {
      categories: true,
      tags: true,
      notificationSettings: true
    }
  });
}

async function getCreatorSubscriptionTiers(creatorId: string) {
  // This would typically come from creator settings
  return [
    { name: 'Basic', price: 4.99, features: ['Basic content access', 'Community chat'] },
    { name: 'Pro', price: 9.99, features: ['All basic features', 'Exclusive content', 'Direct messages'] },
    { name: 'VIP', price: 19.99, features: ['All pro features', 'Custom requests', 'Video calls'] }
  ];
}

async function getRelatedCategories(category: string) {
  // Simple related category logic - could be enhanced with ML
  const allCategories = await vercelIntegration.prisma.content.groupBy({
    by: ['category'],
    where: {
      status: 'PUBLISHED',
      category: { not: category }
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 6
  });

  return allCategories.map(cat => cat.category);
}

async function getPopularTags(category?: string) {
  const whereClause: any = {
    status: 'PUBLISHED',
    tags: { not: null }
  };
  
  if (category) {
    whereClause.category = category;
  }

  const content = await vercelIntegration.prisma.content.findMany({
    where: whereClause,
    select: { tags: true },
    take: 1000
  });

  // Count tag frequency
  const tagCounts = new Map<string, number>();
  content.forEach(item => {
    item.tags?.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag, count]) => ({ tag, count }));
}

function generateSubscriptionReasons(creator: any): string[] {
  const reasons = [];
  
  if (creator.isVerified) {
    reasons.push('Verified creator');
  }
  
  if (creator.subscriberCount > 1000) {
    reasons.push('Popular creator with large following');
  }
  
  if (creator._count.content > 50) {
    reasons.push('Lots of content available');
  }
  
  if (creator.categories?.length > 0) {
    reasons.push(`Specializes in ${creator.categories.slice(0, 2).join(', ')}`);
  }
  
  return reasons;
}

export default router;
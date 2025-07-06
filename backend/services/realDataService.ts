import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Real Data Service - Replaces all mock data with actual PostgreSQL queries
 * This service provides real statistics and data from the database
 */
export class RealDataService {
  
  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    try {
      const [totalUsers, totalCreators, totalContent, totalSubscriptions] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'CREATOR' } }),
        prisma.content.count({ where: { status: 'PUBLISHED' } }),
        prisma.subscription.count({ where: { status: 'ACTIVE' } })
      ]);

      return {
        totalUsers,
        totalCreators,
        totalContent,
        totalSubscriptions,
        totalRevenue: 0 // Would need transaction data
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        totalUsers: 0,
        totalCreators: 0,
        totalContent: 0,
        totalSubscriptions: 0,
        totalRevenue: 0
      };
    }
  }

  /**
   * Get real creators from database
   */
  async getRealCreators(limit: number = 12, offset: number = 0) {
    try {
      const creators = await prisma.user.findMany({
        where: {
          role: 'CREATOR',
          isActive: true
        },
        include: {
          createdContent: {
            where: { status: 'PUBLISHED' },
            take: 1,
            orderBy: { createdAt: 'desc' }
          },
          followers: {
            take: 1
          },
          _count: {
            select: {
              createdContent: {
                where: { status: 'PUBLISHED' }
              },
              followers: true,
              subscriptions: true
            }
          }
        },
        orderBy: [
          { isVerified: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: offset
      });

      return creators.map(creator => ({
        id: creator.id,
        email: creator.email,
        username: creator.username,
        displayName: creator.displayName,
        avatar: creator.avatar,
        bio: creator.bio,
        coverImage: creator.coverImage,
        role: creator.role,
        isVerified: creator.isVerified,
        createdAt: creator.createdAt,
        updatedAt: creator.updatedAt,
        // V3.5 Online Status (with fallbacks for migration compatibility)
        isOnline: creator.isOnline || false,
        activityStatus: creator.activityStatus || 'OFFLINE',
        lastActivityAt: creator.lastActivityAt || creator.updatedAt,
        lastSeenAt: creator.lastSeenAt || null,
        stats: {
          contentCount: creator.contentCount || creator._count.createdContent,
          followersCount: creator.followersCount || creator._count.followers,
          subscribersCount: creator._count.subscriptions
        },
        latestContent: creator.createdContent[0] || null
      }));
    } catch (error) {
      console.error('Error fetching real creators:', error);
      return [];
    }
  }

  /**
   * Get real content from database
   */
  async getRealContent(limit: number = 20, offset: number = 0, includePrivate: boolean = false) {
    try {
      const whereClause: any = {
        status: 'PUBLISHED'
      };

      if (!includePrivate) {
        whereClause.isPublic = true;
      }

      const content = await prisma.content.findMany({
        where: whereClause,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              isVerified: true,
              role: true
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: offset
      });

      return content.map(item => ({
        id: item.id,
        creatorId: item.creatorId,
        title: item.title,
        description: item.description,
        type: item.type.toLowerCase(),
        mediaUrl: item.mediaUrl,
        thumbnailUrl: item.thumbnailUrl,
        isPublic: item.isPublic,
        requiresSubscription: item.requiresSubscription,
        privacyLevel: item.privacyLevel.toLowerCase(),
        status: item.status.toLowerCase(),
        tags: Array.isArray(item.tags) ? item.tags : [],
        category: item.category,
        likesCount: item.likesCount,
        commentsCount: item.commentsCount,
        viewsCount: item.viewsCount,
        sharesCount: item.sharesCount,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        creator: item.creator
      }));
    } catch (error) {
      console.error('Error fetching real content:', error);
      return [];
    }
  }

  /**
   * Get featured creators (verified creators with recent content)
   */
  async getFeaturedCreators(limit: number = 6) {
    try {
      const creators = await prisma.user.findMany({
        where: {
          role: 'CREATOR',
          isActive: true,
          isVerified: true,
          createdContent: {
            some: {
              status: 'PUBLISHED',
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            }
          }
        },
        include: {
          createdContent: {
            where: { 
              status: 'PUBLISHED',
              isPublic: true 
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              createdContent: {
                where: { status: 'PUBLISHED' }
              },
              followers: true
            }
          }
        },
        orderBy: [
          { isVerified: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });

      return creators.map(creator => ({
        id: creator.id,
        username: creator.username,
        displayName: creator.displayName,
        avatar: creator.avatar,
        bio: creator.bio,
        isVerified: creator.isVerified,
        contentCount: creator._count.createdContent,
        followersCount: creator._count.followers,
        recentContent: creator.createdContent
      }));
    } catch (error) {
      console.error('Error fetching featured creators:', error);
      return [];
    }
  }

  /**
   * Get trending content (based on recent engagement)
   */
  async getTrendingContent(limit: number = 10) {
    try {
      const content = await prisma.content.findMany({
        where: {
          status: 'PUBLISHED',
          isPublic: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
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
          }
        },
        orderBy: [
          { likesCount: 'desc' },
          { viewsCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });

      return content.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type.toLowerCase(),
        mediaUrl: item.mediaUrl,
        thumbnailUrl: item.thumbnailUrl,
        tags: Array.isArray(item.tags) ? item.tags : [],
        category: item.category,
        likesCount: item.likesCount,
        commentsCount: item.commentsCount,
        viewsCount: item.viewsCount,
        createdAt: item.createdAt,
        creator: item.creator
      }));
    } catch (error) {
      console.error('Error fetching trending content:', error);
      return [];
    }
  }

  /**
   * Search real users
   */
  async searchUsers(query: string, limit: number = 10) {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          _count: {
            select: {
              createdContent: {
                where: { status: 'PUBLISHED' }
              },
              followers: true
            }
          }
        },
        orderBy: [
          { isVerified: 'desc' },
          { role: 'desc' }, // Creators first
          { createdAt: 'desc' }
        ],
        take: limit
      });

      return users.map(user => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
        contentCount: user._count.createdContent,
        followersCount: user._count.followers
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  /**
   * Get user by ID with full details
   */
  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          createdContent: {
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            take: 12
          },
          followers: {
            include: {
              follower: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true,
                  isVerified: true
                }
              }
            },
            take: 50
          },
          following: {
            include: {
              following: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true,
                  isVerified: true
                }
              }
            },
            take: 50
          },
          _count: {
            select: {
              createdContent: {
                where: { status: 'PUBLISHED' }
              },
              followers: true,
              following: true
            }
          }
        }
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        coverImage: user.coverImage,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        subscriptionStatus: user.subscriptionStatus,
        authProvider: user.authProvider,
        socialLinks: user.socialLinks,
        preferredLanguage: user.preferredLanguage,
        timezone: user.timezone,
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications,
        marketingEmails: user.marketingEmails,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        stats: {
          contentCount: user._count.createdContent,
          totalViews: user.createdContent.reduce((sum, content) => sum + content.viewsCount, 0),
          followersCount: user._count.followers,
          followingCount: user._count.following
        },
        content: user.createdContent,
        followers: user.followers.map(f => f.follower),
        following: user.following.map(f => f.following)
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  /**
   * Get recent activity (for dashboard)
   */
  async getRecentActivity(limit: number = 20) {
    try {
      const recentContent = await prisma.content.findMany({
        where: {
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
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return recentContent.map(content => ({
        type: 'content_created',
        id: content.id,
        title: content.title,
        description: content.description,
        mediaUrl: content.mediaUrl,
        thumbnailUrl: content.thumbnailUrl,
        createdAt: content.createdAt,
        creator: content.creator
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }
}

export const realDataService = new RealDataService();
export default realDataService;

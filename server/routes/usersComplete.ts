import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import vercelIntegration from '../services/vercelIntegration';

const router = express.Router();

// Configure multer for avatar uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for avatars
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
  }
});

// Validation schemas
const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  twitter: z.string().max(50, 'Twitter handle too long').optional(),
  instagram: z.string().max(50, 'Instagram handle too long').optional(),
  categories: z.array(z.string()).max(10, 'Too many categories').optional(),
  tags: z.array(z.string()).max(20, 'Too many tags').optional(),
  isPrivate: z.boolean().optional(),
  allowMessages: z.boolean().optional(),
  notificationSettings: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    newSubscribers: z.boolean().optional(),
    newMessages: z.boolean().optional(),
    contentLikes: z.boolean().optional(),
    contentComments: z.boolean().optional()
  }).optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string().min(1, 'Password confirmation is required')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const creatorApplicationSchema = z.object({
  reason: z.string().min(50, 'Please provide a detailed reason (minimum 50 characters)').max(1000, 'Reason too long'),
  contentTypes: z.array(z.string()).min(1, 'Please select at least one content type'),
  portfolio: z.string().url('Invalid portfolio URL').optional(),
  socialMedia: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional()
  }).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
});

/**
 * @swagger
 * /api/users-v2/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      avatar: true,
      website: true,
      twitter: true,
      instagram: true,
      role: true,
      isVerified: true,
      isPrivate: true,
      allowMessages: true,
      categories: true,
      tags: true,
      subscriberCount: true,
      notificationSettings: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          content: true,
          subscriptions: true,
          subscribers: true
        }
      }
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    user: {
      ...user,
      stats: {
        contentCount: user._count.content,
        subscriptionsCount: user._count.subscriptions,
        subscribersCount: user._count.subscribers
      }
    }
  });
}));

/**
 * @swagger
 * /api/users-v2/profile:
 *   patch:
 *     summary: Update user profile with avatar upload
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *               displayName:
 *                 type: string
 *               bio:
 *                 type: string
 *               website:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch('/profile', authenticateToken, upload.single('avatar'), asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const avatarFile = req.file;

  // Parse form data
  let formData = { ...req.body };
  
  // Parse JSON fields
  if (formData.categories && typeof formData.categories === 'string') {
    formData.categories = JSON.parse(formData.categories);
  }
  if (formData.tags && typeof formData.tags === 'string') {
    formData.tags = JSON.parse(formData.tags);
  }
  if (formData.notificationSettings && typeof formData.notificationSettings === 'string') {
    formData.notificationSettings = JSON.parse(formData.notificationSettings);
  }
  
  // Convert boolean strings
  if (formData.isPrivate) formData.isPrivate = formData.isPrivate === 'true';
  if (formData.allowMessages) formData.allowMessages = formData.allowMessages === 'true';

  const validatedData = updateProfileSchema.parse(formData);

  try {
    // Update profile using Vercel integration (handles avatar upload)
    const updatedUser = await vercelIntegration.updateUserProfile(
      userId,
      validatedData,
      avatarFile?.buffer,
      avatarFile?.originalname
    );

    // Create activity log
    await vercelIntegration.prisma.activity.create({
      data: {
        userId,
        type: 'PROFILE_UPDATED',
        description: 'User updated their profile',
        metadata: {
          hasNewAvatar: !!avatarFile,
          updatedFields: Object.keys(validatedData)
        }
      }
    });

    logger.info(`✅ Profile updated: ${userId}`);

    res.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    logger.error('❌ Profile update failed:', error);
    throw new Error(`Profile update failed: ${error.message}`);
  }
}));

/**
 * @swagger
 * /api/users-v2/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.post('/change-password', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = changePasswordSchema.parse(req.body);

  // Get current user
  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: { password: true, email: true }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new ValidationError('Current password is incorrect');
  }

  // Hash new password
  const saltRounds = 12;
  const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, saltRounds);

  // Update password
  await vercelIntegration.prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
      updatedAt: new Date()
    }
  });

  // Create security activity log
  await vercelIntegration.prisma.activity.create({
    data: {
      userId,
      type: 'PASSWORD_CHANGED',
      description: 'User changed their password',
      metadata: {
        timestamp: new Date().toISOString(),
        ipAddress: req.ip
      }
    }
  });

  logger.info(`✅ Password changed: ${userId}`);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

/**
 * @swagger
 * /api/users-v2/apply-creator:
 *   post:
 *     summary: Apply to become a creator
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               contentTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *               portfolio:
 *                 type: string
 *               agreeToTerms:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Creator application submitted
 */
router.post('/apply-creator', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = creatorApplicationSchema.parse(req.body);

  // Check if user is already a creator
  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, displayName: true, email: true }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role === 'CREATOR') {
    throw new ValidationError('You are already a creator');
  }

  // Check if there's already a pending application
  const existingApplication = await vercelIntegration.prisma.creatorApplication.findFirst({
    where: {
      userId,
      status: 'PENDING'
    }
  });

  if (existingApplication) {
    throw new ValidationError('You already have a pending creator application');
  }

  // Create creator application
  const application = await vercelIntegration.prisma.creatorApplication.create({
    data: {
      userId,
      reason: validatedData.reason,
      contentTypes: validatedData.contentTypes,
      portfolio: validatedData.portfolio,
      socialMedia: validatedData.socialMedia || {},
      status: 'PENDING'
    }
  });

  // Create notification for admins
  const admins = await vercelIntegration.prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true }
  });

  await Promise.all(
    admins.map(admin =>
      vercelIntegration.prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'CREATOR_APPLICATION',
          title: 'New Creator Application',
          message: `${user.displayName} has applied to become a creator`,
          data: {
            applicationId: application.id,
            applicantId: userId,
            applicantName: user.displayName
          }
        }
      })
    )
  );

  logger.info(`✅ Creator application submitted: ${userId}`);

  res.status(201).json({
    success: true,
    application: {
      id: application.id,
      status: application.status,
      submittedAt: application.createdAt
    },
    message: 'Creator application submitted successfully. You will be notified of the decision.'
  });
}));

/**
 * @swagger
 * /api/users-v2/search:
 *   get:
 *     summary: Search users with AI-powered recommendations
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [creators, users, all]
 *           default: all
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
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
 *         description: Search results
 */
router.get('/search', asyncHandler(async (req, res) => {
  const query = req.query.q as string;
  const type = req.query.type as string || 'all';
  const category = req.query.category as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;
  const userId = req.user?.userId;

  let whereClause: any = {};

  // Filter by type
  if (type === 'creators') {
    whereClause.role = 'CREATOR';
  } else if (type === 'users') {
    whereClause.role = 'USER';
  }

  // Search query
  if (query) {
    whereClause.OR = [
      { displayName: { contains: query, mode: 'insensitive' } },
      { username: { contains: query, mode: 'insensitive' } },
      { bio: { contains: query, mode: 'insensitive' } }
    ];
  }

  // Filter by category
  if (category) {
    whereClause.categories = {
      has: category
    };
  }

  // Exclude private profiles for non-authenticated users
  if (!userId) {
    whereClause.isPrivate = false;
  }

  const [users, total] = await Promise.all([
    vercelIntegration.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        role: true,
        isVerified: true,
        categories: true,
        tags: true,
        subscriberCount: true,
        createdAt: true,
        _count: {
          select: {
            content: true
          }
        }
      },
      orderBy: [
        { isVerified: 'desc' },
        { subscriberCount: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    }),
    vercelIntegration.prisma.user.count({ where: whereClause })
  ]);

  // Add AI similarity scores if user is logged in
  let scoredUsers = users;
  if (userId && !query) {
    // Get user preferences for AI scoring
    const userProfile = await vercelIntegration.prisma.user.findUnique({
      where: { id: userId },
      select: { categories: true, tags: true }
    });

    if (userProfile) {
      scoredUsers = users.map(user => {
        let similarityScore = 0;

        // Category similarity
        const commonCategories = user.categories?.filter(cat => 
          userProfile.categories?.includes(cat)
        ).length || 0;
        similarityScore += commonCategories * 3;

        // Tag similarity
        const commonTags = user.tags?.filter(tag => 
          userProfile.tags?.includes(tag)
        ).length || 0;
        similarityScore += commonTags * 2;

        // Boost for verified users
        if (user.isVerified) similarityScore += 5;

        // Boost for active creators
        similarityScore += Math.min(user._count.content * 0.1, 5);

        return {
          ...user,
          similarityScore
        };
      }).sort((a, b) => b.similarityScore - a.similarityScore);
    }
  }

  res.json({
    success: true,
    users: scoredUsers.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      categories: user.categories,
      tags: user.tags,
      subscriberCount: user.subscriberCount,
      contentCount: user._count.content,
      createdAt: user.createdAt
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    meta: {
      query,
      type,
      category,
      hasAIScoring: !!userId && !query
    }
  });
}));

/**
 * @swagger
 * /api/users-v2/{userId}:
 *   get:
 *     summary: Get public user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public user profile
 */
router.get('/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user?.userId;

  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatar: true,
      website: true,
      twitter: true,
      instagram: true,
      role: true,
      isVerified: true,
      isPrivate: true,
      categories: true,
      tags: true,
      subscriberCount: true,
      createdAt: true,
      _count: {
        select: {
          content: true,
          subscribers: true
        }
      }
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check privacy settings
  if (user.isPrivate && requesterId !== userId) {
    throw new AuthorizationError('This profile is private');
  }

  // Check if requester is subscribed (for creators)
  let isSubscribed = false;
  let subscriptionTier = null;
  if (requesterId && user.role === 'CREATOR') {
    const subscription = await vercelIntegration.prisma.subscription.findFirst({
      where: {
        userId: requesterId,
        creatorId: userId,
        status: 'ACTIVE'
      },
      select: { tier: true }
    });
    
    isSubscribed = !!subscription;
    subscriptionTier = subscription?.tier || null;
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatar: user.avatar,
      website: user.website,
      twitter: user.twitter,
      instagram: user.instagram,
      role: user.role,
      isVerified: user.isVerified,
      categories: user.categories,
      tags: user.tags,
      stats: {
        subscribers: user._count.subscribers,
        content: user._count.content
      },
      createdAt: user.createdAt,
      isSubscribed,
      subscriptionTier
    }
  });
}));

/**
 * @swagger
 * /api/users-v2/follow/{userId}:
 *   post:
 *     summary: Follow or unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow status updated
 */
router.post('/follow/:userId', authenticateToken, asyncHandler(async (req, res) => {
  const followerId = req.user!.userId;
  const { userId: followingId } = req.params;

  if (followerId === followingId) {
    throw new ValidationError('You cannot follow yourself');
  }

  // Check if target user exists
  const targetUser = await vercelIntegration.prisma.user.findUnique({
    where: { id: followingId },
    select: { id: true, displayName: true, allowMessages: true }
  });

  if (!targetUser) {
    throw new NotFoundError('User not found');
  }

  // Check if already following
  const existingFollow = await vercelIntegration.prisma.follow.findFirst({
    where: {
      followerId,
      followingId
    }
  });

  let isFollowing = false;

  if (existingFollow) {
    // Unfollow
    await vercelIntegration.prisma.follow.delete({
      where: { id: existingFollow.id }
    });
    isFollowing = false;
  } else {
    // Follow
    await vercelIntegration.prisma.follow.create({
      data: {
        followerId,
        followingId
      }
    });
    isFollowing = true;

    // Create notification
    await vercelIntegration.prisma.notification.create({
      data: {
        userId: followingId,
        type: 'NEW_FOLLOWER',
        title: 'New Follower!',
        message: `You have a new follower`,
        data: {
          followerId
        }
      }
    });
  }

  logger.info(`✅ Follow updated: ${followerId} -> ${followingId} (${isFollowing ? 'following' : 'unfollowed'})`);

  res.json({
    success: true,
    isFollowing,
    message: isFollowing ? `You are now following ${targetUser.displayName}` : `You unfollowed ${targetUser.displayName}`
  });
}));

/**
 * @swagger
 * /api/users-v2/dashboard-stats:
 *   get:
 *     summary: Get user dashboard statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard-stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const user = await vercelIntegration.prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  let stats: any = {};

  if (user.role === 'CREATOR') {
    // Creator dashboard stats
    const [
      subscriberStats,
      contentStats,
      revenueStats,
      recentActivity
    ] = await Promise.all([
      vercelIntegration.prisma.subscription.groupBy({
        by: ['tier'],
        where: {
          creatorId: userId,
          status: 'ACTIVE'
        },
        _count: { id: true },
        _sum: { amount: true }
      }),
      vercelIntegration.prisma.content.groupBy({
        by: ['type'],
        where: { creatorId: userId },
        _count: { id: true },
        _sum: { views: true, likes: true }
      }),
      vercelIntegration.prisma.subscription.aggregate({
        where: {
          creatorId: userId,
          status: 'ACTIVE'
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      vercelIntegration.prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          type: true,
          description: true,
          createdAt: true
        }
      })
    ]);

    stats = {
      type: 'creator',
      subscribers: {
        total: revenueStats._count || 0,
        byTier: subscriberStats.reduce((acc, item) => {
          acc[item.tier] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      content: {
        byType: contentStats.reduce((acc, item) => {
          acc[item.type] = {
            count: item._count.id,
            totalViews: item._sum.views || 0,
            totalLikes: item._sum.likes || 0
          };
          return acc;
        }, {} as Record<string, any>)
      },
      revenue: {
        total: revenueStats._sum.amount || 0,
        monthly: revenueStats._sum.amount || 0, // This would need monthly calculation
        byTier: subscriberStats.reduce((acc, item) => {
          acc[item.tier] = item._sum.amount || 0;
          return acc;
        }, {} as Record<string, number>)
      },
      recentActivity
    };
  } else {
    // Regular user dashboard stats
    const [
      subscriptionStats,
      interactionStats,
      recentActivity
    ] = await Promise.all([
      vercelIntegration.prisma.subscription.groupBy({
        by: ['tier'],
        where: {
          userId,
          status: 'ACTIVE'
        },
        _count: { id: true },
        _sum: { amount: true }
      }),
      vercelIntegration.prisma.contentInteraction.groupBy({
        by: ['type'],
        where: { userId },
        _count: { id: true }
      }),
      vercelIntegration.prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          type: true,
          description: true,
          createdAt: true
        }
      })
    ]);

    stats = {
      type: 'user',
      subscriptions: {
        total: subscriptionStats.reduce((sum, item) => sum + item._count.id, 0),
        byTier: subscriptionStats.reduce((acc, item) => {
          acc[item.tier] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
        totalSpent: subscriptionStats.reduce((sum, item) => sum + (item._sum.amount || 0), 0)
      },
      interactions: {
        byType: interactionStats.reduce((acc, item) => {
          acc[item.type] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      recentActivity
    };
  }

  res.json({
    success: true,
    stats
  });
}));

export default router;
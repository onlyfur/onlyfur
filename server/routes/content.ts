import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { 
  authenticateToken, 
  optionalAuth, 
  requireCreator, 
  requireSelfOrAdmin 
} from '../middleware/auth';
import { 
  asyncHandler, 
  ValidationError, 
  NotFoundError, 
  AuthorizationError 
} from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  type: z.enum(['PHOTO', 'VIDEO', 'TEXT', 'LIVESTREAM']),
  mediaUrl: z.string().url().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  thumbnailUrl: z.string().url().optional(),
  isPublic: z.boolean().default(true),
  requiresSubscription: z.boolean().default(false),
  privacyLevel: z.enum(['PUBLIC', 'SUBSCRIBERS', 'PREMIUM', 'PRIVATE']).default('PUBLIC'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).default('PUBLISHED'),
  scheduledAt: z.string().datetime().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional()
});

const updateContentSchema = createContentSchema.partial();

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get content feed with access control
 *     tags: [Content]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PHOTO, VIDEO, TEXT, LIVESTREAM]
 *         description: Content type filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter
 *       - in: query
 *         name: creatorId
 *         schema:
 *           type: string
 *         description: Filter by creator
 *     responses:
 *       200:
 *         description: Content feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *                 pagination:
 *                   type: object
 */
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;
  
  const type = req.query.type as string;
  const category = req.query.category as string;
  const creatorId = req.query.creatorId as string;

  // Build where clause based on user's access level
  const whereClause: any = {
    status: 'PUBLISHED'
  };

  // Apply filters
  if (type) whereClause.type = type;
  if (category) whereClause.category = category;
  if (creatorId) whereClause.creatorId = creatorId;

  // Apply access control
  if (!req.user) {
    // Anonymous users can only see public content
    whereClause.isPublic = true;
    whereClause.privacyLevel = 'PUBLIC';
  } else {
    // Authenticated users can see content based on their subscription
    const userTier = req.user.subscriptionTier;
    const userRole = req.user.role;

    if (userRole === 'ADMIN') {
      // Admin can see everything - no additional restrictions
    } else {
      // Apply subscription-based access control
      const accessiblePrivacyLevels = ['PUBLIC'];
      
      // Check subscription tier capabilities
      if (userTier) {
        const tier = await prisma.platformSubscriptionTier.findUnique({
          where: { id: userTier }
        });

        if (tier?.contentAccess) {
          const contentAccess = tier.contentAccess as any;
          if (contentAccess.canViewPremiumContent) {
            accessiblePrivacyLevels.push('SUBSCRIBERS');
          }
          if (contentAccess.canViewExclusiveContent) {
            accessiblePrivacyLevels.push('PREMIUM');
          }
        }
      }

      whereClause.OR = [
        { privacyLevel: { in: accessiblePrivacyLevels } },
        { creatorId: req.user.userId } // Users can always see their own content
      ];
    }
  }

  const [content, total] = await Promise.all([
    prisma.content.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            role: true,
            isVerified: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    }),
    prisma.content.count({
      where: whereClause
    })
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
 * /api/content/{id}:
 *   get:
 *     summary: Get specific content by ID
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 content:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 *       403:
 *         description: Access denied
 */
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const content = await prisma.content.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          isVerified: true
        }
      }
    }
  });

  if (!content) {
    throw new NotFoundError('Content not found');
  }

  // Check access permissions
  const hasAccess = await checkContentAccess(content, req.user);
  if (!hasAccess) {
    throw new AuthorizationError('Access denied to this content');
  }

  // Increment view count if user has access
  if (hasAccess && req.user) {
    await prisma.content.update({
      where: { id },
      data: {
        viewsCount: {
          increment: 1
        }
      }
    });
  }

  res.json({
    success: true,
    content
  });
}));

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create new content (Creator only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Content title
 *               description:
 *                 type: string
 *                 description: Content description
 *               type:
 *                 type: string
 *                 enum: [PHOTO, VIDEO, TEXT, LIVESTREAM]
 *               mediaUrl:
 *                 type: string
 *                 format: uri
 *               privacyLevel:
 *                 type: string
 *                 enum: [PUBLIC, SUBSCRIBERS, PREMIUM, PRIVATE]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Content created successfully
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Creator access required
 */
router.post('/', authenticateToken, requireCreator, asyncHandler(async (req, res) => {
  const validatedData = createContentSchema.parse(req.body);
  const creatorId = req.user!.userId;

  // Check creator's tier limitations
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        include: { tier: true },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!creator) {
    throw new NotFoundError('Creator not found');
  }

  const activeTier = creator.subscriptions[0]?.tier;
  if (activeTier?.creatorFeatures) {
    const creatorFeatures = activeTier.creatorFeatures as any;
    
    // Check monthly post limit
    if (creatorFeatures.maxPostsPerMonth > 0) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const postsThisMonth = await prisma.content.count({
        where: {
          creatorId,
          createdAt: {
            gte: startOfMonth
          }
        }
      });

      if (postsThisMonth >= creatorFeatures.maxPostsPerMonth) {
        throw new ValidationError('Monthly post limit reached for your subscription tier');
      }
    }

    // Check premium content creation permission
    if (validatedData.privacyLevel === 'PREMIUM' && !creatorFeatures.canCreatePremiumContent) {
      throw new ValidationError('Premium content creation not allowed for your subscription tier');
    }

    // Check exclusive content creation permission
    if (validatedData.privacyLevel === 'PRIVATE' && !creatorFeatures.canCreateExclusiveContent) {
      throw new ValidationError('Exclusive content creation not allowed for your subscription tier');
    }
  }

  // Create content
  const content = await prisma.content.create({
    data: {
      ...validatedData,
      creatorId,
      scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          isVerified: true
        }
      }
    }
  });

  logger.info('Content created', {
    contentId: content.id,
    creatorId,
    title: content.title,
    type: content.type,
    privacyLevel: content.privacyLevel
  });

  res.status(201).json({
    success: true,
    message: 'Content created successfully',
    content
  });
}));

/**
 * @swagger
 * /api/content/{id}:
 *   put:
 *     summary: Update content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
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
 *               privacyLevel:
 *                 type: string
 *                 enum: [PUBLIC, SUBSCRIBERS, PREMIUM, PRIVATE]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Content not found
 */
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateContentSchema.parse(req.body);
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  const content = await prisma.content.findUnique({
    where: { id },
    include: { creator: true }
  });

  if (!content) {
    throw new NotFoundError('Content not found');
  }

  // Check permissions: owner or admin
  if (content.creatorId !== userId && userRole !== 'ADMIN') {
    throw new AuthorizationError('Access denied');
  }

  const updatedContent = await prisma.content.update({
    where: { id },
    data: {
      ...validatedData,
      updatedAt: new Date(),
      scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          isVerified: true
        }
      }
    }
  });

  logger.info('Content updated', {
    contentId: id,
    updatedBy: userId,
    changes: Object.keys(validatedData)
  });

  res.json({
    success: true,
    message: 'Content updated successfully',
    content: updatedContent
  });
}));

/**
 * @swagger
 * /api/content/{id}:
 *   delete:
 *     summary: Delete content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Content not found
 */
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  const content = await prisma.content.findUnique({
    where: { id }
  });

  if (!content) {
    throw new NotFoundError('Content not found');
  }

  // Check permissions: owner or admin
  if (content.creatorId !== userId && userRole !== 'ADMIN') {
    throw new AuthorizationError('Access denied');
  }

  await prisma.content.delete({
    where: { id }
  });

  logger.info('Content deleted', {
    contentId: id,
    deletedBy: userId,
    originalCreator: content.creatorId
  });

  res.json({
    success: true,
    message: 'Content deleted successfully'
  });
}));

/**
 * @swagger
 * /api/content/my:
 *   get:
 *     summary: Get current user's content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED, SCHEDULED]
 *         description: Filter by status
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
 *         description: User's content
 */
router.get('/my', authenticateToken, requireCreator, asyncHandler(async (req, res) => {
  const creatorId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;
  const status = req.query.status as string;

  const whereClause: any = { creatorId };
  if (status) whereClause.status = status;

  const [content, total] = await Promise.all([
    prisma.content.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    }),
    prisma.content.count({
      where: whereClause
    })
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

// Helper function to check content access
async function checkContentAccess(content: any, user?: any): Promise<boolean> {
  // Public content is accessible to everyone
  if (content.isPublic && content.privacyLevel === 'PUBLIC') {
    return true;
  }

  // Unauthenticated users can only access public content
  if (!user) {
    return false;
  }

  // Admin can access everything
  if (user.role === 'ADMIN') {
    return true;
  }

  // Creators can access their own content
  if (content.creatorId === user.userId) {
    return true;
  }

  // Check subscription-based access
  if (user.subscriptionTier) {
    const tier = await prisma.platformSubscriptionTier.findUnique({
      where: { id: user.subscriptionTier }
    });

    if (tier?.contentAccess) {
      const contentAccess = tier.contentAccess as any;
      
      switch (content.privacyLevel) {
        case 'SUBSCRIBERS':
          return contentAccess.canViewPremiumContent || false;
        case 'PREMIUM':
          return contentAccess.canViewExclusiveContent || false;
        case 'PRIVATE':
          return false; // Private content only accessible to creator
        default:
          return true;
      }
    }
  }

  return false;
}

export default router;

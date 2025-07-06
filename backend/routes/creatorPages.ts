import express, { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const updatePageSettingsSchema = z.object({
  customUrl: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  socialLinks: z.record(z.string().url()).optional()
});

/**
 * @swagger
 * /api/creator/{username}:
 *   get:
 *     summary: Get creator's public page
 *     tags: [Creator]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Creator page data
 */
router.get('/:username', asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const userId = req.user?.userId; // Optional authentication

  // Find creator by username or custom URL
  const creator = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { customUrl: username }
      ],
      role: 'CREATOR'
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      coverImage: true,
      bio: true,
      socialLinks: true,
      isVerified: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          createdContent: {
            where: {
              status: 'PUBLISHED',
              isPublic: true
            }
          }
        }
      }
    }
  });

  if (!creator) {
    throw new NotFoundError('Creator not found');
  }

  // Get creator's public content
  const content = await prisma.content.findMany({
    where: {
      creatorId: creator.id,
      status: 'PUBLISHED',
      isPublic: true
    },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      mediaUrls: true,
      thumbnailUrl: true,
      tier: true,
      createdAt: true,
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  });

  // Check if user is subscribed to this creator
  let subscription = null;
  if (userId) {
    subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        creatorId: creator.id,
        status: 'ACTIVE'
      },
      select: {
        tier: true,
        status: true,
        currentPeriodEnd: true
      }
    });
  }

  // Process content based on subscription status
  const processedContent = content.map((item: any, index: number) => {
    // Show full content for first post or if user is subscribed
    const isFirstPost = index === 0;
    const hasAccess = subscription || isFirstPost || item.tier === 'FREE';

    return {
      ...item,
      mediaUrls: hasAccess ? item.mediaUrls : null,
      isBlurred: !hasAccess,
      requiresSubscription: !hasAccess
    };
  });

  res.json({
    success: true,
    creator: {
      ...creator,
      stats: {
        followers: creator._count.followers,
        contentCount: creator._count.createdContent
      }
    },
    content: processedContent,
    subscription: subscription ? {
      tier: subscription.tier,
      status: subscription.status,
      expiresAt: subscription.currentPeriodEnd
    } : null
  });
}));

/**
 * @swagger
 * /api/creator/settings:
 *   put:
 *     summary: Update creator page settings
 *     tags: [Creator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customUrl:
 *                 type: string
 *               displayName:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
router.put('/settings', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const validatedData = updatePageSettingsSchema.parse(req.body);

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || user.role !== 'CREATOR') {
    throw new ValidationError('Only creators can update page settings');
  }

  // Check if custom URL is available
  if (validatedData.customUrl) {
    const existingUser = await prisma.user.findFirst({
      where: {
        customUrl: validatedData.customUrl,
        id: { not: userId }
      }
    });

    if (existingUser) {
      throw new ValidationError('Custom URL is already taken');
    }
  }

  // Update settings
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: validatedData,
    select: {
      id: true,
      username: true,
      customUrl: true,
      displayName: true,
      bio: true,
      avatar: true,
      coverImage: true,
      socialLinks: true
    }
  });

  logger.info('Creator page settings updated', {
    userId,
    updates: Object.keys(validatedData)
  });

  res.json({
    success: true,
    settings: updatedUser,
    message: 'Creator page settings updated successfully'
  });
}));

export default router;

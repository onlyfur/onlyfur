import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken, requireSelfOrAdmin } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  socialLinks: z.record(z.string().url()).optional()
});

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/profile/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      coverImage: true,
      role: true,
      isVerified: true,
      bio: true,
      socialLinks: true,
      createdAt: true,
      // Don't expose sensitive information
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    user
  });
}));

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
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
 *               displayName:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: uri
 *               coverImage:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile/:userId', authenticateToken, requireSelfOrAdmin('userId'), asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const validatedData = updateProfileSchema.parse(req.body);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: validatedData,
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      coverImage: true,
      role: true,
      isVerified: true,
      bio: true,
      socialLinks: true,
      updatedAt: true
    }
  });

  logger.info('User profile updated', {
    userId,
    updatedBy: req.user!.userId,
    changes: Object.keys(validatedData)
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser
  });
}));

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [CREATOR, SUBSCRIBER]
 *         description: Filter by role
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
  const role = req.query.role as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;

  if (!query || query.length < 2) {
    return res.json({
      success: true,
      users: [],
      pagination: { page, limit, total: 0, pages: 0 }
    });
  }

  const whereClause: any = {
    OR: [
      { username: { contains: query, mode: 'insensitive' } },
      { displayName: { contains: query, mode: 'insensitive' } }
    ]
  };

  if (role) {
    whereClause.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: {
        username: 'asc'
      },
      skip: offset,
      take: limit
    }),
    prisma.user.count({
      where: whereClause
    })
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
 * /api/users/creators:
 *   get:
 *     summary: Get featured creators
 *     tags: [Users]
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
 *         description: List of creators
 */
router.get('/creators', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;

  const [creators, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'CREATOR'
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        coverImage: true,
        role: true,
        isVerified: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            createdContent: {
              where: { status: 'PUBLISHED' }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    }),
    prisma.user.count({
      where: { role: 'CREATOR' }
    })
  ]);

  res.json({
    success: true,
    creators,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// TODO: Add more user management endpoints
// - Get user statistics
// - Update user settings
// - Block/unblock users
// - Report users
// - Follow/unfollow functionality

export default router;

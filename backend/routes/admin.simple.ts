import express, { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Basic validation schemas
const updateUserSchema = z.object({
  role: z.enum(['CREATOR', 'SUBSCRIBER', 'ADMIN']).optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional()
});

// GET /api/admin/dashboard - Get dashboard analytics
router.get('/dashboard', limiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalCreators,
      totalSubscribers,
      totalContent,
      activeSubscriptions
    ] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { role: 'CREATOR' } }),
      prisma.users.count({ where: { role: 'SUBSCRIBER' } }),
      prisma.content.count(),
      prisma.subscriptions.count({ where: { status: 'ACTIVE' } })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCreators,
        totalSubscribers,
        totalContent,
        activeSubscriptions,
        recentUsers: [],
        recentContent: []
      }
    });
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
}));

// GET /api/admin/users - Get all users with pagination
router.get('/users', limiter, asyncHandler(async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const search = req.query.search as string;
    const role = req.query.role as string;
    const isActive = req.query.isActive as string;

    // Build where clause
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (role && role !== 'all') {
      whereClause.role = role;
    }
    
    if (isActive && isActive !== 'all') {
      whereClause.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          isVerified: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              content: true,
              subscriptions: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.users.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
}));

// GET /api/admin/users/credentials - Enhanced user credentials listing  
router.get('/users/credentials', asyncHandler(async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const search = req.query.search as string;
    const role = req.query.role as string;
    const isActive = req.query.isActive as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    // Build where clause
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (role && role !== 'all') {
      whereClause.role = role;
    }
    
    if (isActive && isActive !== 'all') {
      whereClause.isActive = isActive === 'true';
    }

    const [users, total, totalActive, totalVerified, totalCreators, totalAdmins] = await Promise.all([
      prisma.users.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          isVerified: true,
          isActive: true,
          isEmailVerified: true,
          authProvider: true,
          googleId: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          lastActivityAt: true,
          failedLoginAttempts: true,
          lockedUntil: true,
          isTwoFactorEnabled: true,
          _count: {
            select: {
              content: true,
              subscriptions: true,
              payment_intents: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.users.count({ where: whereClause }),
      prisma.users.count({ where: { isActive: true } }),
      prisma.users.count({ where: { isVerified: true } }),
      prisma.users.count({ where: { role: 'CREATOR' } }),
      prisma.users.count({ where: { role: 'ADMIN' } })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        metadata: {
          totalActiveUsers: totalActive,
          totalVerifiedUsers: totalVerified,
          totalCreators,
          totalSubscribers: total - totalCreators - totalAdmins,
          totalAdmins
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching user credentials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user credentials'
    });
  }
}));

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        isVerified: true,
        isActive: true
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
}));

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await prisma.users.delete({
      where: { id: userId }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
}));

export default router;

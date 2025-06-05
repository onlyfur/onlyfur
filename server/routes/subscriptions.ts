import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken, requireRole } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const subscribeSchema = z.object({
  tierId: z.string().min(1, 'Tier ID is required')
});

/**
 * @swagger
 * /api/subscriptions/tiers:
 *   get:
 *     summary: Get all available subscription tiers
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of subscription tiers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 tiers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubscriptionTier'
 */
router.get('/tiers', asyncHandler(async (req, res) => {
  const tiers = await prisma.platformSubscriptionTier.findMany({
    where: { isActive: true },
    orderBy: [
      { type: 'asc' },
      { level: 'asc' },
      { price: 'asc' }
    ]
  });

  res.json({
    success: true,
    tiers
  });
}));

/**
 * @swagger
 * /api/subscriptions/tiers/{id}:
 *   get:
 *     summary: Get subscription tier by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tier ID
 *     responses:
 *       200:
 *         description: Subscription tier details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 tier:
 *                   $ref: '#/components/schemas/SubscriptionTier'
 *       404:
 *         description: Tier not found
 */
router.get('/tiers/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tier = await prisma.platformSubscriptionTier.findUnique({
    where: { id }
  });

  if (!tier) {
    throw new NotFoundError('Subscription tier not found');
  }

  res.json({
    success: true,
    tier
  });
}));

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Subscribe to a tier
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tierId:
 *                 type: string
 *                 description: Subscription tier ID
 *             required:
 *               - tierId
 *     responses:
 *       200:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 subscription:
 *                   type: object
 *                   description: Subscription details
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Tier not found
 */
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = subscribeSchema.parse(req.body);
  const { tierId } = validatedData;
  const userId = req.user!.userId;

  // Check if tier exists and is active
  const tier = await prisma.platformSubscriptionTier.findUnique({
    where: { id: tierId }
  });

  if (!tier || !tier.isActive) {
    throw new NotFoundError('Subscription tier not found or inactive');
  }

  // Cancel existing active subscription if any
  await prisma.subscription.updateMany({
    where: {
      userId,
      status: 'ACTIVE'
    },
    data: {
      status: 'CANCELLED',
      canceledAt: new Date()
    }
  });

  // Calculate subscription period
  const currentPeriodStart = new Date();
  const currentPeriodEnd = new Date();
  
  if (tier.billingPeriod === 'MONTHLY') {
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  } else if (tier.billingPeriod === 'YEARLY') {
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
  }

  // Create new subscription
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      tierId,
      status: tier.price === 0 ? 'ACTIVE' : 'PENDING', // Free tiers are immediately active
      currentPeriodStart,
      currentPeriodEnd,
    },
    include: {
      tier: true,
      user: {
        select: {
          id: true,
          email: true,
          displayName: true
        }
      }
    }
  });

  // Update user subscription info
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tierId,
      subscriptionStatus: subscription.status,
      subscriptionValidUntil: subscription.currentPeriodEnd
    }
  });

  // If it's a free tier, create a completed transaction
  if (tier.price === 0) {
    await prisma.transaction.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        amount: 0,
        currency: tier.currency,
        type: 'SUBSCRIPTION',
        status: 'COMPLETED',
        paymentMethodType: 'STRIPE', // Default
        description: `Subscription to ${tier.name}`,
        fees: 0,
        netAmount: 0,
        processedAt: new Date()
      }
    });
  }

  logger.info('User subscribed to tier', {
    userId,
    tierId,
    tierName: tier.name,
    price: tier.price,
    subscriptionId: subscription.id
  });

  res.json({
    success: true,
    message: 'Subscription created successfully',
    subscription: {
      id: subscription.id,
      tierId: subscription.tierId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      tier: subscription.tier
    }
  });
}));

/**
 * @swagger
 * /api/subscriptions/my:
 *   get:
 *     summary: Get current user's subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current subscription details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 subscription:
 *                   type: object
 *                   description: Current subscription
 */
router.get('/my', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE'
    },
    include: {
      tier: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json({
    success: true,
    subscription
  });
}));

/**
 * @swagger
 * /api/subscriptions/my/cancel:
 *   post:
 *     summary: Cancel current subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/my/cancel', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE'
    },
    include: {
      tier: true
    }
  });

  if (!subscription) {
    throw new NotFoundError('No active subscription found');
  }

  // Cancel subscription
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'CANCELLED',
      canceledAt: new Date(),
      cancelAtPeriodEnd: true
    }
  });

  // Update user subscription status
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'CANCELLED'
    }
  });

  logger.info('User cancelled subscription', {
    userId,
    subscriptionId: subscription.id,
    tierName: subscription.tier.name
  });

  res.json({
    success: true,
    message: 'Subscription cancelled successfully. You will continue to have access until the end of your current billing period.'
  });
}));

/**
 * @swagger
 * /api/subscriptions/my/history:
 *   get:
 *     summary: Get subscription history
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
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
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Subscription history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 subscriptions:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 */
router.get('/my/history', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId },
      include: {
        tier: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    }),
    prisma.subscription.count({
      where: { userId }
    })
  ]);

  res.json({
    success: true,
    subscriptions,
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
 * /api/subscriptions/admin/tiers:
 *   post:
 *     summary: Create new subscription tier (Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionTier'
 *     responses:
 *       201:
 *         description: Tier created successfully
 *       403:
 *         description: Admin access required
 */
router.post('/admin/tiers', authenticateToken, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  // TODO: Implement tier creation validation and logic
  res.status(501).json({
    success: false,
    message: 'Admin tier management not implemented yet'
  });
}));

export default router;

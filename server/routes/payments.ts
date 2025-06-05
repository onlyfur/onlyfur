import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, PaymentError } from '../middleware/errorHandler';
import { logger, logPaymentOperation } from '../middleware/logger';
import { 
  createPaymentIntent, 
  createSubscription, 
  createOrRetrieveCustomer, 
  verifyWebhookSignature,
  handleWebhookEvent 
} from '../services/stripe';

const router = express.Router();

// Validation schemas
const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('usd'),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional()
});

const createSubscriptionSchema = z.object({
  tierId: z.string().min(1, 'Tier ID is required')
});

/**
 * @swagger
 * /api/payments/intent:
 *   post:
 *     summary: Create payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               currency:
 *                 type: string
 *                 default: usd
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment intent created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 clientSecret:
 *                   type: string
 *                 paymentIntentId:
 *                   type: string
 */
router.post('/intent', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = createPaymentIntentSchema.parse(req.body);
  const { amount, currency, description, metadata } = validatedData;
  const userId = req.user!.userId;

  // Get user for customer creation
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, displayName: true }
  });

  if (!user) {
    throw new PaymentError('User not found');
  }

  // Create or retrieve Stripe customer
  const customer = await createOrRetrieveCustomer(
    user.email,
    user.displayName,
    userId
  );

  // Create payment intent
  const paymentIntent = await createPaymentIntent(
    amount,
    currency,
    {
      userId,
      customerId: customer.id,
      description: description || 'OnlyFur Platform Payment',
      ...metadata
    }
  );

  // Create transaction record
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      currency: currency.toUpperCase(),
      type: 'ONE_TIME',
      status: 'PENDING',
      paymentMethodType: 'STRIPE',
      paymentIntentId: paymentIntent.id,
      description: description || 'Payment',
      fees: 0, // Will be updated on completion
      netAmount: amount
    }
  });

  logPaymentOperation('Payment intent created', {
    userId,
    paymentIntentId: paymentIntent.id,
    transactionId: transaction.id,
    amount,
    currency
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    transactionId: transaction.id
  });
}));

/**
 * @swagger
 * /api/payments/subscription:
 *   post:
 *     summary: Create subscription with payment
 *     tags: [Payments]
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
 *     responses:
 *       200:
 *         description: Subscription created
 *       400:
 *         description: Invalid tier or payment setup
 */
router.post('/subscription', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = createSubscriptionSchema.parse(req.body);
  const { tierId } = validatedData;
  const userId = req.user!.userId;

  // Get tier details
  const tier = await prisma.platformSubscriptionTier.findUnique({
    where: { id: tierId }
  });

  if (!tier || !tier.isActive) {
    throw new PaymentError('Invalid subscription tier');
  }

  // For free tiers, handle directly without Stripe
  if (tier.price === 0) {
    return res.status(400).json({
      success: false,
      message: 'Use subscription endpoint for free tiers'
    });
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, displayName: true }
  });

  if (!user) {
    throw new PaymentError('User not found');
  }

  // TODO: Implement Stripe subscription creation
  // This would involve:
  // 1. Create or retrieve Stripe customer
  // 2. Create Stripe price/product if needed
  // 3. Create Stripe subscription
  // 4. Return client_secret for payment confirmation

  res.status(501).json({
    success: false,
    message: 'Stripe subscription implementation pending'
  });
}));

/**
 * @swagger
 * /api/payments/webhooks/stripe:
 *   post:
 *     summary: Handle Stripe webhooks
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 *       400:
 *         description: Invalid webhook
 */
router.post('/webhooks/stripe', asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new PaymentError('Webhook secret not configured');
  }

  // Get raw body for signature verification
  const payload = JSON.stringify(req.body);

  try {
    // Verify webhook signature
    const event = verifyWebhookSignature(payload, signature, webhookSecret);

    // Handle webhook event
    await handleWebhookEvent(event);

    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(400).json({
      success: false,
      message: 'Webhook verification failed'
    });
  }
}));

/**
 * @swagger
 * /api/payments/transactions:
 *   get:
 *     summary: Get user's transaction history
 *     tags: [Payments]
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [SUBSCRIPTION, TIP, ONE_TIME, REFUND, PAYOUT]
 *     responses:
 *       200:
 *         description: Transaction history
 */
router.get('/transactions', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;
  const type = req.query.type as string;

  const whereClause: any = { userId };
  if (type) whereClause.type = type;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    }),
    prisma.transaction.count({
      where: whereClause
    })
  ]);

  res.json({
    success: true,
    transactions,
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
 * /api/payments/methods:
 *   get:
 *     summary: Get user's saved payment methods
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods
 *       501:
 *         description: Not implemented
 */
router.get('/methods', authenticateToken, asyncHandler(async (req, res) => {
  // TODO: Implement payment methods management
  res.status(501).json({
    success: false,
    message: 'Payment methods management not implemented yet'
  });
}));

// TODO: Add more payment endpoints
// - Update payment method
// - Cancel subscription
// - Process refunds
// - Handle failed payments
// - Creator payout management

export default router;

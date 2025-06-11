import express, { Request, Response } from 'express';
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
  handleWebhookEvent,
  createProduct,
  createPrice,
  getStripeInstance
} from '../services/stripe';
import { createAuditLog } from '../services/auditLog';
import type { Stripe } from 'stripe';

const stripe = getStripeInstance();

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
router.post('/intent', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
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
router.post('/subscription', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createSubscriptionSchema.parse(req.body);
  const { tierId } = validatedData;
  const userId = req.user!.userId;

  // Get tier details
  const tier = await prisma.platformSubscriptionTier.findUnique({
    where: { id: tierId },
    include: {
      subscriptions: {
        where: { userId, status: 'ACTIVE' },
        take: 1
      }
    }
  });

  if (!tier || !tier.isActive) {
    throw new PaymentError('Invalid subscription tier');
  }

  // Check for existing active subscription
  if (tier.subscriptions.length > 0) {
    throw new PaymentError('User already has an active subscription to this tier');
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      displayName: true,
      stripeCustomerId: true
    }
  });

  if (!user) {
    throw new PaymentError('User not found');
  }

  // Handle free tiers
  if (tier.price === 0) {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        tierId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: tier.name
      }
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_CREATE',
      resource: 'subscription',
      resourceId: subscription.id,
      metadata: {
        tierId,
        tierName: tier.name,
        price: 0
      }
    });

    return res.json({
      success: true,
      message: 'Free subscription activated successfully',
      subscription
    });
  }

  // Handle paid tiers
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    // Create or retrieve Stripe customer
    let stripeCustomer;
    if (user.stripeCustomerId) {
      stripeCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      stripeCustomer = await createOrRetrieveCustomer(
        user.email,
        user.displayName,
        userId
      );

      // Save Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: stripeCustomer.id }
      });
    }

    // Create or retrieve Stripe product and price
    let stripePrice = await stripe.prices.list({
      lookup_keys: [`tier_${tierId}`],
      limit: 1
    }).then(res => res.data[0]);

    if (!stripePrice) {
      const product = await createProduct(
        tier.name,
        tier.description
      );

      stripePrice = await createPrice(
        product.id,
        tier.price,
        tier.currency.toLowerCase(),
        tier.billingPeriod.toLowerCase() as 'month' | 'year'
      );

      // Update price with lookup key
      await stripe.prices.update(stripePrice.id, {
        lookup_key: `tier_${tierId}`
      });
    }

    // Create Stripe subscription
    const subscription = await createSubscription(
      stripeCustomer.id,
      stripePrice.id,
      {
        tierId,
        userId,
        tierName: tier.name
      }
    );

    // Create platform subscription record
    const platformSubscription = await prisma.subscription.create({
      data: {
        userId,
        tierId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }
    });

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        subscriptionId: platformSubscription.id,
        amount: tier.price,
        currency: tier.currency,
        type: 'SUBSCRIPTION',
        status: 'PENDING',
        paymentMethodType: 'STRIPE',
        description: `Subscription to ${tier.name}`,
        fees: 0,
        netAmount: tier.price
      }
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_CREATE',
      resource: 'subscription',
      resourceId: platformSubscription.id,
      metadata: {
        tierId,
        tierName: tier.name,
        price: tier.price,
        stripeSubscriptionId: subscription.id
      }
    });

    // Extract client secret safely
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const clientSecret = typeof latestInvoice.payment_intent === 'object' 
      ? latestInvoice.payment_intent?.client_secret 
      : null;

    res.json({
      success: true,
      message: 'Subscription created successfully',
      clientSecret,
      subscription: platformSubscription,
      transaction
    });
  } catch (error) {
    logger.error('Failed to create subscription:', error);
    throw new PaymentError('Failed to create subscription');
  }
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
router.post('/webhooks/stripe', asyncHandler(async (req: Request, res: Response) => {
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
router.get('/transactions', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
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
router.get('/methods', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
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

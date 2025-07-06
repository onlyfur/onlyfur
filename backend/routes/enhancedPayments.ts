import { Router } from 'express';
import { enhancedPaymentService } from '../services/enhancedPayments';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';
import { logger } from '../middleware/logger';
import { z } from 'zod';

const router = Router();

// Validation schemas
const addPaymentMethodSchema = z.object({
  type: z.enum(['card', 'bank_account', 'paypal', 'crypto', 'apple_pay', 'google_pay']),
  stripePaymentMethodId: z.string().optional(),
  isDefault: z.boolean().optional(),
  metadata: z.record(z.any()).optional()
});

const processPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  type: z.enum(['subscription', 'tip', 'content_purchase', 'commission', 'donation']),
  paymentMethodId: z.string().optional(),
  recipientId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  description: z.string().optional()
});

const createSubscriptionSchema = z.object({
  creatorId: z.string(),
  tierId: z.string(),
  paymentMethodId: z.string().optional(),
  trialDays: z.number().min(0).max(30).optional()
});

const processRefundSchema = z.object({
  amount: z.number().positive().optional(),
  reason: z.string().optional()
});

const schedulePayoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  scheduledAt: z.string().datetime().optional()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [card, bank_account, paypal, crypto, apple_pay, google_pay]
 *         provider:
 *           type: string
 *         isDefault:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         metadata:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *     PaymentIntent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         type:
 *           type: string
 *         status:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/payments/methods:
 *   get:
 *     summary: Get user payment methods
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 */
router.get('/methods', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const paymentMethods = await enhancedPaymentService.getUserPaymentMethods(userId);
    
    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    logger.error('Failed to get payment methods', { userId: req.user?.id, error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get payment methods'
    });
  }
});

/**
 * @swagger
 * /api/payments/methods:
 *   post:
 *     summary: Add payment method
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [card, bank_account, paypal, crypto, apple_pay, google_pay]
 *               stripePaymentMethodId:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Payment method added
 */
router.post('/methods', 
  authenticate, 
  rateLimiter('payment_method', { windowMs: 15 * 60 * 1000, max: 10 }), // 10 per 15 minutes
  validateRequest(addPaymentMethodSchema),
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const paymentMethod = await enhancedPaymentService.addPaymentMethod({
        userId,
        ...req.body
      });
      
      res.status(201).json({
        success: true,
        data: paymentMethod
      });
    } catch (error) {
      logger.error('Failed to add payment method', { userId: req.user?.id, error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to add payment method'
      });
    }
  }
);

/**
 * @swagger
 * /api/payments/methods/{id}:
 *   delete:
 *     summary: Remove payment method
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment method removed
 */
router.delete('/methods/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    await enhancedPaymentService.removePaymentMethod(id, userId);
    
    res.json({
      success: true,
      message: 'Payment method removed successfully'
    });
  } catch (error) {
    logger.error('Failed to remove payment method', { userId: req.user?.id, paymentMethodId: req.params.id, error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to remove payment method'
    });
  }
});

/**
 * @swagger
 * /api/payments/process:
 *   post:
 *     summary: Process payment
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, currency, type]
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *               currency:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *               type:
 *                 type: string
 *                 enum: [subscription, tip, content_purchase, commission, donation]
 *               paymentMethodId:
 *                 type: string
 *               recipientId:
 *                 type: string
 *               description:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Payment processed
 */
router.post('/process', 
  authenticate, 
  rateLimiter('payment_process', { windowMs: 60 * 1000, max: 5 }), // 5 per minute
  validateRequest(processPaymentSchema),
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const paymentIntent = await enhancedPaymentService.processPayment({
        userId,
        ...req.body
      });
      
      res.status(201).json({
        success: true,
        data: paymentIntent
      });
    } catch (error) {
      logger.error('Failed to process payment', { userId: req.user?.id, error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to process payment'
      });
    }
  }
);

/**
 * @swagger
 * /api/payments/subscriptions:
 *   post:
 *     summary: Create subscription
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [creatorId, tierId]
 *             properties:
 *               creatorId:
 *                 type: string
 *               tierId:
 *                 type: string
 *               paymentMethodId:
 *                 type: string
 *               trialDays:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 30
 *     responses:
 *       201:
 *         description: Subscription created
 */
router.post('/subscriptions', 
  authenticate, 
  rateLimiter('subscription_create', { windowMs: 60 * 1000, max: 3 }), // 3 per minute
  validateRequest(createSubscriptionSchema),
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const subscription = await enhancedPaymentService.createSubscription({
        userId,
        ...req.body
      });
      
      res.status(201).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Failed to create subscription', { userId: req.user?.id, error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to create subscription'
      });
    }
  }
);

/**
 * @swagger
 * /api/payments/subscriptions/{id}/cancel:
 *   post:
 *     summary: Cancel subscription
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancelAtPeriodEnd:
 *                 type: boolean
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscription cancelled
 */
router.post('/subscriptions/:id/cancel', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { cancelAtPeriodEnd = true, reason } = req.body;
    
    const subscription = await enhancedPaymentService.cancelSubscription(id, userId, {
      cancelAtPeriodEnd,
      reason
    });
    
    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    logger.error('Failed to cancel subscription', { userId: req.user?.id, subscriptionId: req.params.id, error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    });
  }
});

/**
 * @swagger
 * /api/payments/refunds/{paymentIntentId}:
 *   post:
 *     summary: Process refund
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentIntentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund processed
 */
router.post('/refunds/:paymentIntentId', 
  authenticate, 
  rateLimiter('refund_process', { windowMs: 60 * 1000, max: 2 }), // 2 per minute
  validateRequest(processRefundSchema),
  async (req, res) => {
    try {
      const adminUserId = req.user!.id;
      const { paymentIntentId } = req.params;
      
      const paymentIntent = await enhancedPaymentService.processRefund({
        paymentIntentId,
        adminUserId,
        ...req.body
      });
      
      res.json({
        success: true,
        data: paymentIntent
      });
    } catch (error) {
      logger.error('Failed to process refund', { 
        adminUserId: req.user?.id, 
        paymentIntentId: req.params.paymentIntentId, 
        error: error.message 
      });
      res.status(500).json({
        success: false,
        error: 'Failed to process refund'
      });
    }
  }
);

/**
 * @swagger
 * /api/payments/analytics:
 *   get:
 *     summary: Get payment analytics
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment analytics retrieved
 */
router.get('/analytics', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate, currency } = req.query;
    
    const analytics = await enhancedPaymentService.getPaymentAnalytics({
      userId,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      currency: currency as string
    });
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error('Failed to get payment analytics', { userId: req.user?.id, error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get payment analytics'
    });
  }
});

/**
 * @swagger
 * /api/payments/payouts:
 *   post:
 *     summary: Schedule payout
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, currency]
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *               currency:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Payout scheduled
 */
router.post('/payouts', 
  authenticate, 
  rateLimiter('payout_schedule', { windowMs: 15 * 60 * 1000, max: 5 }), // 5 per 15 minutes
  validateRequest(schedulePayoutSchema),
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const payout = await enhancedPaymentService.schedulePayout({
        userId,
        ...req.body,
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined
      });
      
      res.status(201).json({
        success: true,
        data: payout
      });
    } catch (error) {
      logger.error('Failed to schedule payout', { userId: req.user?.id, error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to schedule payout'
      });
    }
  }
);

/**
 * @swagger
 * /api/payments/payouts:
 *   get:
 *     summary: Get payouts
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, paid, failed]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Payouts retrieved
 */
router.get('/payouts', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { status, limit = 20, offset = 0 } = req.query;
    
    const payouts = await enhancedPaymentService.getUserPayouts(userId, {
      status: status as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
    
    res.json({
      success: true,
      data: payouts
    });
  } catch (error) {
    logger.error('Failed to get payouts', { userId: req.user?.id, error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get payouts'
    });
  }
});

/**
 * @swagger
 * /api/payments/disputes/{id}:
 *   get:
 *     summary: Get dispute details
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispute details retrieved
 */
router.get('/disputes/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const dispute = await enhancedPaymentService.getDispute(id, userId);
    
    res.json({
      success: true,
      data: dispute
    });
  } catch (error) {
    logger.error('Failed to get dispute', { userId: req.user?.id, disputeId: req.params.id, error: error.message });
    res.status(404).json({
      success: false,
      error: 'Dispute not found'
    });
  }
});

/**
 * @swagger
 * /api/payments/disputes/{id}/evidence:
 *   post:
 *     summary: Submit dispute evidence
 *     tags: [Enhanced Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [evidence]
 *             properties:
 *               evidence:
 *                 type: object
 *               additionalInfo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evidence submitted
 */
router.post('/disputes/:id/evidence', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { evidence, additionalInfo } = req.body;
    
    const dispute = await enhancedPaymentService.submitDisputeEvidence(id, userId, {
      evidence,
      additionalInfo
    });
    
    res.json({
      success: true,
      data: dispute
    });
  } catch (error) {
    logger.error('Failed to submit dispute evidence', { 
      userId: req.user?.id, 
      disputeId: req.params.id, 
      error: error.message 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to submit dispute evidence'
    });
  }
});

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Handle payment webhooks
 *     tags: [Enhanced Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const event = await enhancedPaymentService.handleWebhook(req.body, signature);
    
    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    logger.error('Failed to process payment webhook', { error: error.message });
    res.status(400).json({
      success: false,
      error: 'Webhook processing failed'
    });
  }
});

export default router;
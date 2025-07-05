import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { createRateLimit } from '../middleware/rateLimiter';
import { webhookService, WebhookEvents } from '../services/webhooks';
import { logger } from '../middleware/logger';

const router = express.Router();

// Rate limiting for webhook operations
const webhookRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50,
  message: 'Too many webhook requests, please try again later.'
});

// Validation schemas
const createWebhookSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  description: z.string().optional(),
  headers: z.record(z.string()).optional()
});

const updateWebhookSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.string()).min(1).optional(),
  description: z.string().optional(),
  headers: z.record(z.string()).optional(),
  isActive: z.boolean().optional()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     WebhookEndpoint:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *         events:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     
 *     WebhookDelivery:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         event:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, delivered, failed, retry]
 *         attemptCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         deliveredAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/webhooks:
 *   get:
 *     summary: Get user's webhook endpoints
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of webhook endpoints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 webhooks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WebhookEndpoint'
 */
router.get('/', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const webhooks = await webhookService.getUserWebhooks(userId);

    res.json({
      webhooks: webhooks.map(webhook => ({
        ...webhook,
        secret: undefined // Don't expose secret in list
      }))
    });

  } catch (error) {
    logger.error('Failed to get webhooks', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve webhooks',
      message: 'An error occurred while fetching your webhook endpoints'
    });
  }
});

/**
 * @swagger
 * /api/webhooks:
 *   post:
 *     summary: Create a new webhook endpoint
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - events
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *               events:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               headers:
 *                 type: object
 *     responses:
 *       201:
 *         description: Webhook endpoint created
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = createWebhookSchema.parse(req.body);

    // Validate events
    const validEvents = Object.values(WebhookEvents);
    const invalidEvents = validatedData.events.filter(event => !validEvents.includes(event as any));
    
    if (invalidEvents.length > 0) {
      return res.status(400).json({
        error: 'Invalid events',
        message: `Invalid events: ${invalidEvents.join(', ')}`,
        validEvents
      });
    }

    const webhook = await webhookService.createWebhookEndpoint({
      ...validatedData,
      userId
    });

    res.status(201).json({
      webhook,
      message: 'Webhook endpoint created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to create webhook', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to create webhook',
      message: 'An error occurred while creating the webhook endpoint'
    });
  }
});

/**
 * @swagger
 * /api/webhooks/{webhookId}:
 *   get:
 *     summary: Get a specific webhook endpoint
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook endpoint details
 *       404:
 *         description: Webhook not found
 */
router.get('/:webhookId', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { webhookId } = req.params;

    const webhooks = await webhookService.getUserWebhooks(userId);
    const webhook = webhooks.find(w => w.id === webhookId);

    if (!webhook) {
      return res.status(404).json({
        error: 'Webhook not found',
        message: 'The specified webhook endpoint was not found'
      });
    }

    res.json({ webhook });

  } catch (error) {
    logger.error('Failed to get webhook', {
      userId: (req as any).user?.id,
      webhookId: req.params.webhookId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve webhook',
      message: 'An error occurred while fetching the webhook endpoint'
    });
  }
});

/**
 * @swagger
 * /api/webhooks/{webhookId}:
 *   put:
 *     summary: Update a webhook endpoint
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
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
 *               url:
 *                 type: string
 *                 format: uri
 *               events:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               headers:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Webhook endpoint updated
 *       404:
 *         description: Webhook not found
 */
router.put('/:webhookId', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { webhookId } = req.params;
    const validatedData = updateWebhookSchema.parse(req.body);

    // Validate events if provided
    if (validatedData.events) {
      const validEvents = Object.values(WebhookEvents);
      const invalidEvents = validatedData.events.filter(event => !validEvents.includes(event as any));
      
      if (invalidEvents.length > 0) {
        return res.status(400).json({
          error: 'Invalid events',
          message: `Invalid events: ${invalidEvents.join(', ')}`,
          validEvents
        });
      }
    }

    const webhook = await webhookService.updateWebhookEndpoint(webhookId, userId, validatedData);

    if (!webhook) {
      return res.status(404).json({
        error: 'Webhook not found',
        message: 'The specified webhook endpoint was not found'
      });
    }

    res.json({
      webhook,
      message: 'Webhook endpoint updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to update webhook', {
      userId: (req as any).user?.id,
      webhookId: req.params.webhookId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to update webhook',
      message: 'An error occurred while updating the webhook endpoint'
    });
  }
});

/**
 * @swagger
 * /api/webhooks/{webhookId}:
 *   delete:
 *     summary: Delete a webhook endpoint
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook endpoint deleted
 *       404:
 *         description: Webhook not found
 */
router.delete('/:webhookId', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { webhookId } = req.params;

    const deleted = await webhookService.deleteWebhookEndpoint(webhookId, userId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Webhook not found',
        message: 'The specified webhook endpoint was not found'
      });
    }

    res.json({
      message: 'Webhook endpoint deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete webhook', {
      userId: (req as any).user?.id,
      webhookId: req.params.webhookId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to delete webhook',
      message: 'An error occurred while deleting the webhook endpoint'
    });
  }
});

/**
 * @swagger
 * /api/webhooks/{webhookId}/test:
 *   post:
 *     summary: Test a webhook endpoint
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test webhook sent
 *       404:
 *         description: Webhook not found
 */
router.post('/:webhookId/test', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { webhookId } = req.params;

    const success = await webhookService.testWebhook(webhookId, userId);

    if (!success) {
      return res.status(404).json({
        error: 'Webhook not found',
        message: 'The specified webhook endpoint was not found'
      });
    }

    res.json({
      message: 'Test webhook sent successfully',
      note: 'Check the deliveries tab to see the test result'
    });

  } catch (error) {
    logger.error('Failed to test webhook', {
      userId: (req as any).user?.id,
      webhookId: req.params.webhookId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to test webhook',
      message: 'An error occurred while testing the webhook endpoint'
    });
  }
});

/**
 * @swagger
 * /api/webhooks/{webhookId}/deliveries:
 *   get:
 *     summary: Get webhook deliveries
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of webhook deliveries
 *       404:
 *         description: Webhook not found
 */
router.get('/:webhookId/deliveries', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { webhookId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const deliveries = await webhookService.getWebhookDeliveries(webhookId, userId, limit);

    res.json({
      deliveries,
      pagination: {
        limit,
        total: deliveries.length
      }
    });

  } catch (error) {
    logger.error('Failed to get webhook deliveries', {
      userId: (req as any).user?.id,
      webhookId: req.params.webhookId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve deliveries',
      message: 'An error occurred while fetching webhook deliveries'
    });
  }
});

/**
 * @swagger
 * /api/webhooks/{webhookId}/stats:
 *   get:
 *     summary: Get webhook statistics
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook statistics
 *       404:
 *         description: Webhook not found
 */
router.get('/:webhookId/stats', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { webhookId } = req.params;

    // Verify webhook ownership
    const webhooks = await webhookService.getUserWebhooks(userId);
    const webhook = webhooks.find(w => w.id === webhookId);

    if (!webhook) {
      return res.status(404).json({
        error: 'Webhook not found',
        message: 'The specified webhook endpoint was not found'
      });
    }

    const stats = await webhookService.getWebhookStats(webhookId);

    res.json({ stats });

  } catch (error) {
    logger.error('Failed to get webhook stats', {
      userId: (req as any).user?.id,
      webhookId: req.params.webhookId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve statistics',
      message: 'An error occurred while fetching webhook statistics'
    });
  }
});

/**
 * @swagger
 * /api/webhooks/events:
 *   get:
 *     summary: Get available webhook events
 *     tags: [Webhooks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available webhook events
 */
router.get('/events/available', authenticateToken, webhookRateLimit, async (req, res) => {
  try {
    const events = Object.entries(WebhookEvents).map(([key, value]) => ({
      key,
      value,
      description: getEventDescription(value)
    }));

    res.json({
      events,
      categories: {
        user: events.filter(e => e.value.startsWith('user.')),
        content: events.filter(e => e.value.startsWith('content.')),
        subscription: events.filter(e => e.value.startsWith('subscription.')),
        payment: events.filter(e => e.value.startsWith('payment.')),
        message: events.filter(e => e.value.startsWith('message.')),
        system: events.filter(e => e.value.startsWith('system.'))
      }
    });

  } catch (error) {
    logger.error('Failed to get webhook events', {
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to retrieve events',
      message: 'An error occurred while fetching available webhook events'
    });
  }
});

// Helper function to get event descriptions
function getEventDescription(event: string): string {
  const descriptions: Record<string, string> = {
    'user.created': 'Triggered when a new user account is created',
    'user.updated': 'Triggered when user profile information is updated',
    'user.deleted': 'Triggered when a user account is deleted',
    'content.created': 'Triggered when new content is uploaded',
    'content.updated': 'Triggered when content is modified',
    'content.deleted': 'Triggered when content is removed',
    'content.published': 'Triggered when content is published',
    'subscription.created': 'Triggered when a new subscription is created',
    'subscription.updated': 'Triggered when subscription details are modified',
    'subscription.cancelled': 'Triggered when a subscription is cancelled',
    'subscription.renewed': 'Triggered when a subscription is renewed',
    'payment.succeeded': 'Triggered when a payment is successfully processed',
    'payment.failed': 'Triggered when a payment fails',
    'payout.created': 'Triggered when a payout is created',
    'message.sent': 'Triggered when a message is sent',
    'message.received': 'Triggered when a message is received',
    'content.reported': 'Triggered when content is reported',
    'content.moderated': 'Triggered when content moderation action is taken',
    'system.maintenance': 'Triggered during system maintenance',
    'system.update': 'Triggered when system updates are deployed'
  };

  return descriptions[event] || 'No description available';
}

export default router;

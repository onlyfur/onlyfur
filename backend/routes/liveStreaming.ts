import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { createRateLimit } from '../middleware/rateLimiter';
import { liveStreamingService } from '../services/liveStreaming';
import { logger } from '../middleware/logger';

const router = express.Router();

// Rate limiting for streaming
const streamingRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50,
  message: 'Too many streaming requests, please try again later.'
});

const chatRateLimit = createRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 30,
  message: 'Too many chat messages, please slow down.'
});

// Validation schemas
const createStreamSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().optional(),
  requiresSubscription: z.boolean().optional(),
  scheduledAt: z.string().datetime().optional(),
  settings: z.object({
    allowChat: z.boolean().optional(),
    allowDonations: z.boolean().optional(),
    allowRecording: z.boolean().optional(),
    chatModeration: z.enum(['none', 'basic', 'strict']).optional(),
    donationGoal: z.number().min(0).optional(),
    donationMinAmount: z.number().min(0).optional(),
    subscriberOnlyChat: z.boolean().optional(),
    slowMode: z.boolean().optional(),
    slowModeInterval: z.number().min(1).max(60).optional()
  }).optional()
});

const chatMessageSchema = z.object({
  message: z.string().min(1).max(500)
});

const donationSchema = z.object({
  amount: z.number().min(0.01).max(10000),
  currency: z.string().length(3),
  message: z.string().max(200).optional(),
  isAnonymous: z.boolean().optional()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     LiveStream:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         creatorId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         isPrivate:
 *           type: boolean
 *         requiresSubscription:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [scheduled, live, ended, cancelled]
 */

/**
 * @swagger
 * /api/streaming/create:
 *   post:
 *     summary: Create a new live stream
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isPrivate:
 *                 type: boolean
 *               requiresSubscription:
 *                 type: boolean
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               settings:
 *                 type: object
 *     responses:
 *       201:
 *         description: Live stream created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stream:
 *                   $ref: '#/components/schemas/LiveStream'
 */
router.post('/create', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = createStreamSchema.parse(req.body);

    const streamData = {
      ...validatedData,
      creatorId: userId,
      scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined
    };

    const stream = await liveStreamingService.createStream(streamData);

    res.status(201).json({
      stream,
      message: 'Live stream created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to create live stream', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to create live stream',
      message: 'An error occurred while creating your live stream'
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}/start:
 *   post:
 *     summary: Start a live stream
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live stream started successfully
 */
router.post('/:streamId/start', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { streamId } = req.params;

    const stream = await liveStreamingService.startStream(streamId, userId);

    res.json({
      stream,
      message: 'Live stream started successfully'
    });

  } catch (error) {
    logger.error('Failed to start live stream', {
      userId: (req as any).user?.id,
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(400).json({
      error: 'Failed to start live stream',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}/end:
 *   post:
 *     summary: End a live stream
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live stream ended successfully
 */
router.post('/:streamId/end', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { streamId } = req.params;

    const stream = await liveStreamingService.endStream(streamId, userId);

    res.json({
      stream,
      message: 'Live stream ended successfully'
    });

  } catch (error) {
    logger.error('Failed to end live stream', {
      userId: (req as any).user?.id,
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(400).json({
      error: 'Failed to end live stream',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}/join:
 *   post:
 *     summary: Join a live stream
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Joined live stream successfully
 */
router.post('/:streamId/join', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { streamId } = req.params;

    const result = await liveStreamingService.joinStream(streamId, userId);

    if (!result.canView) {
      return res.status(403).json({
        error: 'Access denied',
        message: result.reason || 'You cannot view this stream'
      });
    }

    res.json({
      stream: result.stream,
      viewer: result.viewer,
      message: 'Joined live stream successfully'
    });

  } catch (error) {
    logger.error('Failed to join live stream', {
      userId: (req as any).user?.id,
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to join live stream',
      message: 'An error occurred while joining the stream'
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}/leave:
 *   post:
 *     summary: Leave a live stream
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Left live stream successfully
 */
router.post('/:streamId/leave', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { streamId } = req.params;

    await liveStreamingService.leaveStream(streamId, userId);

    res.json({
      message: 'Left live stream successfully'
    });

  } catch (error) {
    logger.error('Failed to leave live stream', {
      userId: (req as any).user?.id,
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to leave live stream',
      message: 'An error occurred while leaving the stream'
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}/chat:
 *   post:
 *     summary: Send chat message
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat message sent successfully
 */
router.post('/:streamId/chat', authenticateToken, chatRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { streamId } = req.params;
    const validatedData = chatMessageSchema.parse(req.body);

    const chatMessage = await liveStreamingService.sendChatMessage({
      streamId,
      userId,
      message: validatedData.message
    });

    res.status(201).json({
      chatMessage,
      message: 'Chat message sent successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to send chat message', {
      userId: (req as any).user?.id,
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(400).json({
      error: 'Failed to send chat message',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}/chat:
 *   get:
 *     summary: Get chat messages
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
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
 *         description: Chat messages retrieved successfully
 */
router.get('/:streamId/chat', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const { streamId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const chatMessages = liveStreamingService.getChatMessages(streamId, limit);

    res.json({
      chatMessages,
      count: chatMessages.length,
      message: 'Chat messages retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get chat messages', {
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to get chat messages',
      message: 'An error occurred while retrieving chat messages'
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}/donate:
 *   post:
 *     summary: Send donation to stream
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               message:
 *                 type: string
 *               isAnonymous:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Donation sent successfully
 */
router.post('/:streamId/donate', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { streamId } = req.params;
    const validatedData = donationSchema.parse(req.body);

    const donation = await liveStreamingService.sendDonation({
      streamId,
      userId,
      ...validatedData
    });

    res.status(201).json({
      donation,
      message: 'Donation sent successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to send donation', {
      userId: (req as any).user?.id,
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(400).json({
      error: 'Failed to send donation',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}:
 *   get:
 *     summary: Get live stream details
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Live stream details retrieved successfully
 */
router.get('/:streamId', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const { streamId } = req.params;

    const stream = await liveStreamingService.getStream(streamId);

    if (!stream) {
      return res.status(404).json({
        error: 'Stream not found',
        message: 'The requested live stream was not found'
      });
    }

    res.json({
      stream,
      message: 'Live stream details retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get live stream', {
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to get live stream',
      message: 'An error occurred while retrieving the stream'
    });
  }
});

/**
 * @swagger
 * /api/streaming/{streamId}/viewers:
 *   get:
 *     summary: Get current viewers
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: streamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current viewers retrieved successfully
 */
router.get('/:streamId/viewers', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const { streamId } = req.params;

    const viewers = liveStreamingService.getStreamViewers(streamId);

    res.json({
      viewers,
      count: viewers.length,
      message: 'Current viewers retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get stream viewers', {
      streamId: req.params.streamId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to get stream viewers',
      message: 'An error occurred while retrieving viewers'
    });
  }
});

/**
 * @swagger
 * /api/streaming/my-streams:
 *   get:
 *     summary: Get user's streams
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, live, ended]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: User streams retrieved successfully
 */
router.get('/my-streams', authenticateToken, streamingRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const status = req.query.status as 'scheduled' | 'live' | 'ended' | undefined;
    const limit = parseInt(req.query.limit as string) || 20;

    const streams = await liveStreamingService.getUserStreams(userId, status, limit);

    res.json({
      streams,
      count: streams.length,
      message: 'User streams retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get user streams', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to get user streams',
      message: 'An error occurred while retrieving your streams'
    });
  }
});

export default router;
import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const streamCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
  isPrivate: z.boolean().default(false),
  scheduledAt: z.string().datetime().optional(),
  maxViewers: z.number().min(1).max(1000).optional(),
  requiresSubscription: z.boolean().default(false),
  minTierRequired: z.enum(['basic', 'pro', 'vip']).optional()
});

const streamUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
  isPrivate: z.boolean().optional(),
  status: z.enum(['scheduled', 'live', 'ended', 'cancelled']).optional()
});

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
 *     responses:
 *       201:
 *         description: Stream created successfully
 */
router.post('/create', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = streamCreateSchema.parse(req.body);

  // Verify user is a creator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || (user.role !== 'CREATOR' && user.role !== 'creator')) {
    throw new AuthorizationError('Only creators can create live streams');
  }

  // Check if user has an active stream
  const activeStream = await prisma.liveStream.findFirst({
    where: {
      creatorId: userId,
      status: { in: ['SCHEDULED', 'LIVE'] }
    }
  });

  if (activeStream) {
    throw new ValidationError('You already have an active or scheduled stream');
  }

  // Generate stream key and RTMP URL
  const streamKey = `stream_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const rtmpUrl = `rtmp://live.onlyfur.com/live/${streamKey}`;

  const stream = await prisma.liveStream.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      tags: validatedData.tags || [],
      isPrivate: validatedData.isPrivate,
      scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : new Date(),
      maxViewers: validatedData.maxViewers,
      requiresSubscription: validatedData.requiresSubscription,
      minTierRequired: validatedData.minTierRequired,
      streamKey,
      rtmpUrl,
      creatorId: userId,
      status: validatedData.scheduledAt ? 'SCHEDULED' : 'LIVE'
    }
  });

  res.status(201).json({
    success: true,
    stream: {
      id: stream.id,
      title: stream.title,
      description: stream.description,
      category: stream.category,
      tags: stream.tags,
      status: stream.status,
      streamKey: stream.streamKey,
      rtmpUrl: stream.rtmpUrl,
      playbackUrl: `https://live.onlyfur.com/hls/${streamKey}/index.m3u8`,
      scheduledAt: stream.scheduledAt,
      createdAt: stream.createdAt
    }
  });
}));

/**
 * @swagger
 * /api/streaming/streams:
 *   get:
 *     summary: Get live streams with filters
 *     tags: [Live Streaming]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [live, scheduled, ended]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
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
 *         description: List of live streams
 */
router.get('/streams', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const status = req.query.status as string;
  const category = req.query.category as string;
  const offset = (page - 1) * limit;

  const whereClause: any = {};
  
  if (status) {
    whereClause.status = status.toUpperCase();
  }
  
  if (category) {
    whereClause.category = category;
  }

  // Only show public streams or streams user has access to
  whereClause.isPrivate = false;

  const [streams, total] = await Promise.all([
    prisma.liveStream.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true
          }
        },
        _count: {
          select: {
            viewers: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // Live streams first
        { scheduledAt: 'desc' }
      ],
      skip: offset,
      take: limit
    }),
    prisma.liveStream.count({ where: whereClause })
  ]);

  const formattedStreams = streams.map(stream => ({
    id: stream.id,
    title: stream.title,
    description: stream.description,
    category: stream.category,
    tags: stream.tags,
    status: stream.status.toLowerCase(),
    thumbnail: stream.thumbnailUrl,
    viewerCount: stream._count.viewers,
    scheduledAt: stream.scheduledAt,
    startedAt: stream.startedAt,
    endedAt: stream.endedAt,
    creator: stream.creator,
    playbackUrl: stream.status === 'LIVE' ? `https://live.onlyfur.com/hls/${stream.streamKey}/index.m3u8` : null
  }));

  res.json({
    success: true,
    streams: formattedStreams,
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
 * /api/streaming/stream/{id}:
 *   get:
 *     summary: Get stream details
 *     tags: [Live Streaming]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stream details
 */
router.get('/stream/:id', asyncHandler(async (req, res) => {
  const streamId = req.params.id;

  const stream = await prisma.liveStream.findUnique({
    where: { id: streamId },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          isVerified: true,
          bio: true
        }
      },
      _count: {
        select: {
          viewers: true
        }
      }
    }
  });

  if (!stream) {
    throw new NotFoundError('Stream not found');
  }

  res.json({
    success: true,
    stream: {
      id: stream.id,
      title: stream.title,
      description: stream.description,
      category: stream.category,
      tags: stream.tags,
      status: stream.status.toLowerCase(),
      thumbnail: stream.thumbnailUrl,
      viewerCount: stream._count.viewers,
      scheduledAt: stream.scheduledAt,
      startedAt: stream.startedAt,
      endedAt: stream.endedAt,
      creator: stream.creator,
      playbackUrl: stream.status === 'LIVE' ? `https://live.onlyfur.com/hls/${stream.streamKey}/index.m3u8` : null,
      chatEnabled: true,
      requiresSubscription: stream.requiresSubscription,
      minTierRequired: stream.minTierRequired
    }
  });
}));

/**
 * @swagger
 * /api/streaming/stream/{id}/join:
 *   post:
 *     summary: Join a live stream as viewer
 *     tags: [Live Streaming]
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
 *         description: Successfully joined stream
 */
router.post('/stream/:id/join', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const streamId = req.params.id;

  const stream = await prisma.liveStream.findUnique({
    where: { id: streamId },
    include: {
      creator: {
        select: { id: true }
      }
    }
  });

  if (!stream) {
    throw new NotFoundError('Stream not found');
  }

  if (stream.status !== 'LIVE') {
    throw new ValidationError('Stream is not currently live');
  }

  // Check if user meets requirements
  if (stream.requiresSubscription) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        creatorId: stream.creator.id,
        status: 'ACTIVE'
      }
    });

    if (!subscription) {
      throw new AuthorizationError('Subscription required to view this stream');
    }

    // Check tier requirements
    if (stream.minTierRequired) {
      const tierHierarchy = { basic: 1, pro: 2, vip: 3 };
      const userTier = tierHierarchy[subscription.tier.toLowerCase() as keyof typeof tierHierarchy] || 0;
      const requiredTier = tierHierarchy[stream.minTierRequired as keyof typeof tierHierarchy] || 0;

      if (userTier < requiredTier) {
        throw new AuthorizationError(`${stream.minTierRequired} subscription tier required`);
      }
    }
  }

  // Add user as viewer (upsert to handle duplicate joins)
  await prisma.streamViewer.upsert({
    where: {
      streamId_userId: {
        streamId,
        userId
      }
    },
    update: {
      lastSeen: new Date()
    },
    create: {
      streamId,
      userId,
      joinedAt: new Date(),
      lastSeen: new Date()
    }
  });

  // Get updated viewer count
  const viewerCount = await prisma.streamViewer.count({
    where: { streamId }
  });

  res.json({
    success: true,
    message: 'Successfully joined stream',
    viewerCount,
    playbackUrl: `https://live.onlyfur.com/hls/${stream.streamKey}/index.m3u8`
  });
}));

/**
 * @swagger
 * /api/streaming/stream/{id}/leave:
 *   post:
 *     summary: Leave a live stream
 *     tags: [Live Streaming]
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
 *         description: Successfully left stream
 */
router.post('/stream/:id/leave', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const streamId = req.params.id;

  await prisma.streamViewer.deleteMany({
    where: {
      streamId,
      userId
    }
  });

  const viewerCount = await prisma.streamViewer.count({
    where: { streamId }
  });

  res.json({
    success: true,
    message: 'Successfully left stream',
    viewerCount
  });
}));

/**
 * @swagger
 * /api/streaming/my-streams:
 *   get:
 *     summary: Get creator's own streams
 *     tags: [Live Streaming]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Creator's streams
 */
router.get('/my-streams', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;

  const [streams, total] = await Promise.all([
    prisma.liveStream.findMany({
      where: { creatorId: userId },
      include: {
        _count: {
          select: {
            viewers: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.liveStream.count({ where: { creatorId: userId } })
  ]);

  const formattedStreams = streams.map(stream => ({
    id: stream.id,
    title: stream.title,
    description: stream.description,
    category: stream.category,
    tags: stream.tags,
    status: stream.status.toLowerCase(),
    thumbnail: stream.thumbnailUrl,
    viewerCount: stream._count.viewers,
    scheduledAt: stream.scheduledAt,
    startedAt: stream.startedAt,
    endedAt: stream.endedAt,
    createdAt: stream.createdAt,
    // Include streaming details for creator
    streamKey: stream.streamKey,
    rtmpUrl: stream.rtmpUrl,
    playbackUrl: `https://live.onlyfur.com/hls/${stream.streamKey}/index.m3u8`
  }));

  res.json({
    success: true,
    streams: formattedStreams,
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
 * /api/streaming/stream/{id}/end:
 *   post:
 *     summary: End a live stream
 *     tags: [Live Streaming]
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
 *         description: Stream ended successfully
 */
router.post('/stream/:id/end', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const streamId = req.params.id;

  const stream = await prisma.liveStream.findUnique({
    where: { id: streamId }
  });

  if (!stream) {
    throw new NotFoundError('Stream not found');
  }

  if (stream.creatorId !== userId) {
    throw new AuthorizationError('You can only end your own streams');
  }

  if (stream.status !== 'LIVE') {
    throw new ValidationError('Stream is not currently live');
  }

  // Update stream status and end time
  const updatedStream = await prisma.liveStream.update({
    where: { id: streamId },
    data: {
      status: 'ENDED',
      endedAt: new Date()
    }
  });

  // Calculate stream duration and final viewer count
  const duration = updatedStream.startedAt && updatedStream.endedAt 
    ? Math.floor((updatedStream.endedAt.getTime() - updatedStream.startedAt.getTime()) / 1000)
    : 0;

  const finalViewerCount = await prisma.streamViewer.count({
    where: { streamId }
  });

  res.json({
    success: true,
    message: 'Stream ended successfully',
    stream: {
      id: updatedStream.id,
      status: 'ended',
      endedAt: updatedStream.endedAt,
      duration,
      finalViewerCount
    }
  });
}));

export default router;

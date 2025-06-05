import express from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ValidationError, NotFoundError, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';

const router = express.Router();

// Validation schemas
const sendMessageSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  content: z.string().min(1, 'Message content is required').max(2000, 'Message too long'),
  messageType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO']).default('TEXT'),
  mediaUrl: z.string().url().optional()
});

const createConversationSchema = z.object({
  participantId: z.string().min(1, 'Participant ID is required')
});

/**
 * @swagger
 * /api/messaging/conversations:
 *   get:
 *     summary: Get user's conversations
 *     tags: [Messaging]
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
 *     responses:
 *       200:
 *         description: List of conversations
 */
router.get('/conversations', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const offset = (page - 1) * limit;

  // Get unique conversation IDs where user is participant
  const userMessages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { recipientId: userId }
      ]
    },
    select: {
      conversationId: true
    },
    distinct: ['conversationId'],
    orderBy: {
      createdAt: 'desc'
    },
    skip: offset,
    take: limit
  });

  const conversationIds = userMessages.map(m => m.conversationId);

  if (conversationIds.length === 0) {
    return res.json({
      success: true,
      conversations: [],
      pagination: { page, limit, total: 0, pages: 0 }
    });
  }

  // Get last message for each conversation with participant info
  const conversations = await Promise.all(
    conversationIds.map(async (conversationId) => {
      const lastMessage = await prisma.message.findFirst({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          },
          recipient: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          }
        }
      });

      if (!lastMessage) return null;

      // Determine the other participant
      const otherParticipant = lastMessage.senderId === userId 
        ? lastMessage.recipient 
        : lastMessage.sender;

      // Count unread messages
      const unreadCount = await prisma.message.count({
        where: {
          conversationId,
          recipientId: userId,
          isRead: false
        }
      });

      return {
        conversationId,
        participant: otherParticipant,
        lastMessage: {
          id: lastMessage.id,
          content: lastMessage.content,
          messageType: lastMessage.messageType,
          createdAt: lastMessage.createdAt,
          isRead: lastMessage.isRead,
          senderId: lastMessage.senderId
        },
        unreadCount
      };
    })
  );

  const validConversations = conversations.filter(Boolean);

  // Get total count
  const totalConversations = await prisma.message.groupBy({
    by: ['conversationId'],
    where: {
      OR: [
        { senderId: userId },
        { recipientId: userId }
      ]
    }
  });

  res.json({
    success: true,
    conversations: validConversations,
    pagination: {
      page,
      limit,
      total: totalConversations.length,
      pages: Math.ceil(totalConversations.length / limit)
    }
  });
}));

/**
 * @swagger
 * /api/messaging/conversations:
 *   post:
 *     summary: Create or get conversation with another user
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participantId:
 *                 type: string
 *                 description: Other user's ID
 *     responses:
 *       200:
 *         description: Conversation details
 */
router.post('/conversations', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = createConversationSchema.parse(req.body);
  const { participantId } = validatedData;
  const userId = req.user!.userId;

  if (participantId === userId) {
    throw new ValidationError('Cannot create conversation with yourself');
  }

  // Check if participant exists
  const participant = await prisma.user.findUnique({
    where: { id: participantId },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      role: true
    }
  });

  if (!participant) {
    throw new NotFoundError('User not found');
  }

  // Check if conversation already exists
  const existingMessage = await prisma.message.findFirst({
    where: {
      OR: [
        { senderId: userId, recipientId: participantId },
        { senderId: participantId, recipientId: userId }
      ]
    },
    select: { conversationId: true }
  });

  let conversationId: string;

  if (existingMessage) {
    conversationId = existingMessage.conversationId;
  } else {
    // Generate new conversation ID
    conversationId = uuidv4();
  }

  res.json({
    success: true,
    conversationId,
    participant
  });
}));

/**
 * @swagger
 * /api/messaging/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages in a conversation
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
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
 *           default: 50
 *     responses:
 *       200:
 *         description: Messages in conversation
 */
router.get('/conversations/:conversationId/messages', authenticateToken, asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
  const offset = (page - 1) * limit;

  // Verify user has access to this conversation
  const userMessage = await prisma.message.findFirst({
    where: {
      conversationId,
      OR: [
        { senderId: userId },
        { recipientId: userId }
      ]
    }
  });

  if (!userMessage) {
    throw new AuthorizationError('Access denied to this conversation');
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    }),
    prisma.message.count({
      where: { conversationId }
    })
  ]);

  // Mark messages as read if user is recipient
  await prisma.message.updateMany({
    where: {
      conversationId,
      recipientId: userId,
      isRead: false
    },
    data: {
      isRead: true,
      readAt: new Date()
    }
  });

  res.json({
    success: true,
    messages: messages.reverse(), // Reverse to show oldest first
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
 * /api/messaging/send:
 *   post:
 *     summary: Send a message
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *               content:
 *                 type: string
 *               messageType:
 *                 type: string
 *                 enum: [TEXT, IMAGE, VIDEO, AUDIO]
 *               mediaUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post('/send', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = sendMessageSchema.parse(req.body);
  const { recipientId, content, messageType, mediaUrl } = validatedData;
  const senderId = req.user!.userId;

  if (recipientId === senderId) {
    throw new ValidationError('Cannot send message to yourself');
  }

  // Check if recipient exists
  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: { id: true, username: true, role: true }
  });

  if (!recipient) {
    throw new NotFoundError('Recipient not found');
  }

  // Check messaging permissions based on subscription tiers
  const canMessage = await checkMessagingPermissions(senderId, recipientId);
  if (!canMessage) {
    throw new AuthorizationError('Messaging not allowed with your current subscription');
  }

  // Generate or find conversation ID
  const existingMessage = await prisma.message.findFirst({
    where: {
      OR: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId }
      ]
    },
    select: { conversationId: true }
  });

  const conversationId = existingMessage?.conversationId || uuidv4();

  // Create message
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      recipientId,
      content,
      messageType,
      mediaUrl
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true
        }
      },
      recipient: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true
        }
      }
    }
  });

  logger.info('Message sent', {
    messageId: message.id,
    senderId,
    recipientId,
    conversationId,
    messageType
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: {
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      messageType: message.messageType,
      mediaUrl: message.mediaUrl,
      createdAt: message.createdAt,
      sender: message.sender,
      recipient: message.recipient
    }
  });
}));

/**
 * @swagger
 * /api/messaging/messages/{messageId}/read:
 *   post:
 *     summary: Mark message as read
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message marked as read
 */
router.post('/messages/:messageId/read', authenticateToken, asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user!.userId;

  const message = await prisma.message.findUnique({
    where: { id: messageId }
  });

  if (!message) {
    throw new NotFoundError('Message not found');
  }

  if (message.recipientId !== userId) {
    throw new AuthorizationError('Can only mark own messages as read');
  }

  await prisma.message.update({
    where: { id: messageId },
    data: {
      isRead: true,
      readAt: new Date()
    }
  });

  res.json({
    success: true,
    message: 'Message marked as read'
  });
}));

// Helper function to check messaging permissions
async function checkMessagingPermissions(senderId: string, recipientId: string): Promise<boolean> {
  // Get sender's subscription tier
  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: {
      role: true,
      subscriptionTier: true,
      subscriptionStatus: true
    }
  });

  if (!sender) return false;

  // Admin can always message
  if (sender.role === 'ADMIN') return true;

  // Check if sender has an active subscription
  if (sender.subscriptionStatus !== 'ACTIVE' && sender.subscriptionStatus !== 'FREE') {
    return false;
  }

  // Get sender's tier capabilities
  if (sender.subscriptionTier) {
    const tier = await prisma.platformSubscriptionTier.findUnique({
      where: { id: sender.subscriptionTier }
    });

    if (tier?.messagingFeatures) {
      const messagingFeatures = tier.messagingFeatures as any;
      
      // Check if messaging is allowed
      if (!messagingFeatures.canMessageCreators) {
        return false;
      }

      // Check daily conversation limit
      if (messagingFeatures.maxConversationsPerDay > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const conversationsToday = await prisma.message.groupBy({
          by: ['conversationId'],
          where: {
            senderId,
            createdAt: {
              gte: today
            }
          }
        });

        if (conversationsToday.length >= messagingFeatures.maxConversationsPerDay) {
          return false;
        }
      }

      // TODO: Check if recipient's tier is in allowed tiers
      // This would require getting recipient's creator tier
    }
  }

  return true;
}

export default router;

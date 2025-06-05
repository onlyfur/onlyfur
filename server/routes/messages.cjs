const express = require('express');
const { prisma } = require('../app.cjs');

const router = express.Router();

// Import authentication middleware
const { authenticateToken } = require('./auth.cjs');

// Apply authentication to all message routes
router.use(authenticateToken);

// Utility function to check if user can message another user based on subscription tier
const canMessageUser = (senderTier, recipientRole, recipientTier) => {
  const tierHierarchy = { 'FREE': 0, 'BASIC': 1, 'PREMIUM': 2, 'VIP': 3 };
  const senderLevel = tierHierarchy[senderTier] || 0;
  
  // Free users can only message if recipient is also free user
  if (senderLevel === 0 && recipientRole === 'CREATOR') {
    return false;
  }
  
  // Basic and above can message creators
  return senderLevel >= 1 || recipientRole === 'USER';
};

// Get user's conversations
router.get('/conversations', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
            isRead: true,
            senderId: true
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: req.user.id }
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Format conversations to show the other participant
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.user1Id === req.user.id ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0] || null;
      
      return {
        id: conv.id,
        otherUser,
        lastMessage,
        unreadCount: conv._count.messages,
        updatedAt: conv.updatedAt
      };
    });

    res.json({
      success: true,
      conversations: formattedConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations'
    });
  }
});

// Get or create conversation with another user
router.post('/conversations', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { userId } = req.body;

    if (!userId || userId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Valid user ID is required'
      });
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        subscriptionTier: true,
        isActive: true
      }
    });

    if (!targetUser || !targetUser.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user can message the target user
    if (!canMessageUser(req.user.subscriptionTier, targetUser.role, targetUser.subscriptionTier)) {
      return res.status(403).json({
        success: false,
        error: 'Subscription upgrade required to message creators',
        requiredTier: 'BASIC'
      });
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: req.user.id, user2Id: userId },
          { user1Id: userId, user2Id: req.user.id }
        ]
      }
    });

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: req.user.id,
          user2Id: userId
        }
      });
    }

    res.json({
      success: true,
      conversation: {
        id: conversation.id,
        otherUser: {
          id: targetUser.id,
          username: targetUser.username,
          role: targetUser.role
        }
      }
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Check if user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this conversation'
      });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: req.user.id },
        isRead: false
      },
      data: { isRead: true }
    });

    const total = await prisma.message.count({
      where: { conversationId }
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
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messages'
    });
  }
});

// Send a message
router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { conversationId } = req.params;
    const { content, type = 'TEXT' } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Check if user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: {
          select: {
            id: true,
            subscriptionTier: true,
            role: true
          }
        },
        user2: {
          select: {
            id: true,
            subscriptionTier: true,
            role: true
          }
        }
      }
    });

    if (!conversation || (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this conversation'
      });
    }

    const otherUser = conversation.user1Id === req.user.id ? conversation.user2 : conversation.user1;
    
    // Check messaging permissions
    if (!canMessageUser(req.user.subscriptionTier, otherUser.role, otherUser.subscriptionTier)) {
      return res.status(403).json({
        success: false,
        error: 'Subscription upgrade required to send messages',
        requiredTier: 'BASIC'
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        type,
        senderId: req.user.id,
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    res.status(201).json({
      success: true,
      message
    });

    console.log(`✅ Message sent from ${req.user.username} in conversation ${conversationId}`);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// Delete a message
router.delete('/messages/:messageId', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    if (message.senderId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own messages'
      });
    }

    await prisma.message.delete({
      where: { id: messageId }
    });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
});

// Mark conversation as read
router.post('/conversations/:conversationId/read', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { conversationId } = req.params;

    // Check if user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this conversation'
      });
    }

    // Mark all messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: req.user.id },
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: 'Conversation marked as read'
    });
  } catch (error) {
    console.error('Mark conversation as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark conversation as read'
    });
  }
});

// Get unread message count
router.get('/unread-count', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const unreadCount = await prisma.message.count({
      where: {
        conversation: {
          OR: [
            { user1Id: req.user.id },
            { user2Id: req.user.id }
          ]
        },
        senderId: { not: req.user.id },
        isRead: false
      }
    });

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unread count'
    });
  }
});

// Search conversations
router.get('/search', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { isActive: true },
          { id: { not: req.user.id } },
          {
            OR: [
              { username: { contains: query.trim(), mode: 'insensitive' } },
              { email: { contains: query.trim(), mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        role: true,
        subscriptionTier: true
      },
      take: 20
    });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
});

module.exports = router;

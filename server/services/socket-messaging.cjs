const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { prisma } = require('../app.cjs');

let io;

// Initialize Socket.io
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'onlyfur-dev-secret');
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          role: true,
          subscriptionTier: true
        }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.userId})`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Handle joining conversation rooms
    socket.on('join_conversation', async (conversationId) => {
      try {
        // Verify user is part of this conversation
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId }
        });

        if (conversation && 
            (conversation.user1Id === socket.userId || conversation.user2Id === socket.userId)) {
          socket.join(`conversation_${conversationId}`);
          console.log(`User ${socket.user.username} joined conversation ${conversationId}`);
        }
      } catch (error) {
        console.error('Join conversation error:', error);
      }
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content, type = 'TEXT' } = data;

        // Verify user can send to this conversation
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: {
            user1: { select: { id: true, role: true, subscriptionTier: true } },
            user2: { select: { id: true, role: true, subscriptionTier: true } }
          }
        });

        if (!conversation || 
            (conversation.user1Id !== socket.userId && conversation.user2Id !== socket.userId)) {
          socket.emit('error', 'Access denied to conversation');
          return;
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            content: content.trim(),
            type,
            senderId: socket.userId,
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

        // Emit message to conversation room
        io.to(`conversation_${conversationId}`).emit('new_message', {
          id: message.id,
          content: message.content,
          type: message.type,
          senderId: message.senderId,
          sender: message.sender,
          conversationId: message.conversationId,
          createdAt: message.createdAt,
          isRead: false
        });

        // Send push notification to other user
        const otherUserId = conversation.user1Id === socket.userId ? 
          conversation.user2Id : conversation.user1Id;
        
        io.to(`user_${otherUserId}`).emit('notification', {
          type: 'new_message',
          from: socket.user.username,
          conversationId,
          preview: content.substring(0, 50)
        });

        console.log(`✅ Message sent from ${socket.user.username} in conversation ${conversationId}`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (conversationId) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    socket.on('typing_stop', (conversationId) => {
      socket.to(`conversation_${conversationId}`).emit('user_stopped_typing', {
        userId: socket.userId
      });
    });

    // Handle user presence
    socket.on('user_online', () => {
      socket.broadcast.emit('user_status', {
        userId: socket.userId,
        status: 'online'
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.username}`);
      socket.broadcast.emit('user_status', {
        userId: socket.userId,
        status: 'offline'
      });
    });

    // Handle marking messages as read
    socket.on('mark_read', async (conversationId) => {
      try {
        await prisma.message.updateMany({
          where: {
            conversationId,
            senderId: { not: socket.userId },
            isRead: false
          },
          data: { isRead: true }
        });

        socket.to(`conversation_${conversationId}`).emit('messages_read', {
          conversationId,
          readBy: socket.userId
        });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });
  });

  return io;
};

// Send notification to user
const sendNotification = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};

// Send system message
const sendSystemMessage = (conversationId, message) => {
  if (io) {
    io.to(`conversation_${conversationId}`).emit('system_message', message);
  }
};

module.exports = {
  initializeSocket,
  sendNotification,
  sendSystemMessage
};

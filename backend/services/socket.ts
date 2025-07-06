import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from './database';
import { logger, logSecurityEvent } from '../middleware/logger';
import { JWTPayload } from '../middleware/auth';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

interface OnlineUser {
  userId: string;
  socketId: string;
  email: string;
  role: string;
  lastSeen: Date;
}

// Store online users
const onlineUsers = new Map<string, OnlineUser>();
const userSockets = new Map<string, string>(); // userId -> socketId

// Initialize Socket.IO server
export function initializeSocketServer(io: SocketServer): void {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return next(new Error('JWT secret not configured'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true
        }
      });

      if (!user) {
        logSecurityEvent('Socket authentication failed - user not found', {
          userId: decoded.userId,
          socketId: socket.id
        });
        return next(new Error('User not found'));
      }

      // Attach user info to socket
      socket.userId = user.id;
      socket.userEmail = user.email;
      socket.userRole = user.role;

      next();
    } catch (error) {
      logSecurityEvent('Socket authentication failed', {
        error: error instanceof Error ? error.message : error,
        socketId: socket.id
      });
      next(new Error('Authentication failed'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.userId) return;

    logger.info('User connected via WebSocket', {
      userId: socket.userId,
      socketId: socket.id,
      email: socket.userEmail
    });

    // Add user to online users
    const onlineUser: OnlineUser = {
      userId: socket.userId,
      socketId: socket.id,
      email: socket.userEmail!,
      role: socket.userRole!,
      lastSeen: new Date()
    };

    onlineUsers.set(socket.id, onlineUser);
    userSockets.set(socket.userId, socket.id);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Broadcast user online status
    socket.broadcast.emit('user:online', {
      userId: socket.userId,
      email: socket.userEmail
    });

    // Handle joining conversation rooms
    socket.on('conversation:join', async (data: { conversationId: string }) => {
      try {
        const { conversationId } = data;

        // Verify user has access to this conversation
        const hasAccess = await verifyConversationAccess(socket.userId!, conversationId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to conversation' });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        socket.emit('conversation:joined', { conversationId });

        logger.debug('User joined conversation', {
          userId: socket.userId,
          conversationId
        });

      } catch (error) {
        logger.error('Error joining conversation:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Handle leaving conversation rooms
    socket.on('conversation:leave', (data: { conversationId: string }) => {
      const { conversationId } = data;
      socket.leave(`conversation:${conversationId}`);
      socket.emit('conversation:left', { conversationId });
    });

    // Handle sending messages
    socket.on('message:send', async (data: {
      conversationId: string;
      recipientId: string;
      content: string;
      messageType?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
      mediaUrl?: string;
    }) => {
      try {
        const {
          conversationId,
          recipientId,
          content,
          messageType = 'TEXT',
          mediaUrl
        } = data;

        // Verify conversation access
        const hasAccess = await verifyConversationAccess(socket.userId!, conversationId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to conversation' });
          return;
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: socket.userId!,
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
            }
          }
        });

        // Emit message to conversation room
        io.to(`conversation:${conversationId}`).emit('message:received', {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          recipientId: message.recipientId,
          content: message.content,
          messageType: message.messageType,
          mediaUrl: message.mediaUrl,
          createdAt: message.createdAt,
          sender: message.sender
        });

        // Send notification to recipient if they're online
        const recipientSocketId = userSockets.get(recipientId);
        if (recipientSocketId) {
          io.to(`user:${recipientId}`).emit('notification:message', {
            type: 'new_message',
            from: {
              id: socket.userId,
              username: message.sender.username,
              displayName: message.sender.displayName
            },
            preview: content.substring(0, 100)
          });
        }

        logger.debug('Message sent', {
          messageId: message.id,
          senderId: socket.userId,
          recipientId,
          conversationId
        });

      } catch (error) {
        logger.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message read status
    socket.on('message:read', async (data: { messageId: string }) => {
      try {
        const { messageId } = data;

        // Update message as read
        const message = await prisma.message.update({
          where: { id: messageId },
          data: {
            isRead: true,
            readAt: new Date()
          }
        });

        // Notify sender that message was read
        const senderSocketId = userSockets.get(message.senderId);
        if (senderSocketId) {
          io.to(`user:${message.senderId}`).emit('message:read', {
            messageId,
            readAt: message.readAt
          });
        }

      } catch (error) {
        logger.error('Error marking message as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { conversationId: string, recipientId: string }) => {
      const { conversationId, recipientId } = data;
      
      // Notify recipient that user is typing
      io.to(`user:${recipientId}`).emit('typing:start', {
        conversationId,
        userId: socket.userId,
        userEmail: socket.userEmail
      });
    });

    socket.on('typing:stop', (data: { conversationId: string, recipientId: string }) => {
      const { conversationId, recipientId } = data;
      
      // Notify recipient that user stopped typing
      io.to(`user:${recipientId}`).emit('typing:stop', {
        conversationId,
        userId: socket.userId
      });
    });

    // Handle user presence updates
    socket.on('presence:update', (data: { status: 'online' | 'away' | 'busy' }) => {
      const { status } = data;
      
      const user = onlineUsers.get(socket.id);
      if (user) {
        user.lastSeen = new Date();
        onlineUsers.set(socket.id, user);
      }

      // Broadcast presence update
      socket.broadcast.emit('presence:update', {
        userId: socket.userId,
        status,
        lastSeen: new Date()
      });
    });

    // Handle content updates (for creators)
    socket.on('content:update', (data: { type: 'new' | 'updated' | 'deleted', contentId: string }) => {
      if (socket.userRole === 'CREATOR') {
        // Broadcast to subscribers
        socket.broadcast.emit('content:update', {
          creatorId: socket.userId,
          ...data
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info('User disconnected from WebSocket', {
        userId: socket.userId,
        socketId: socket.id,
        reason
      });

      // Remove from online users
      onlineUsers.delete(socket.id);
      if (socket.userId) {
        userSockets.delete(socket.userId);
      }

      // Broadcast user offline status
      socket.broadcast.emit('user:offline', {
        userId: socket.userId,
        lastSeen: new Date()
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error('Socket error:', {
        userId: socket.userId,
        socketId: socket.id,
        error: error instanceof Error ? error.message : error
      });
    });
  });

  logger.info('Socket.IO server initialized with authentication');
}

// Verify conversation access
async function verifyConversationAccess(userId: string, conversationId: string): Promise<boolean> {
  try {
    // Check if user is part of this conversation
    const messageCount = await prisma.message.count({
      where: {
        conversationId,
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      }
    });

    return messageCount > 0;
  } catch (error) {
    logger.error('Error verifying conversation access:', error);
    return false;
  }
}

// Get online users
export function getOnlineUsers(): OnlineUser[] {
  return Array.from(onlineUsers.values());
}

// Get online users count
export function getOnlineUsersCount(): number {
  return onlineUsers.size;
}

// Check if user is online
export function isUserOnline(userId: string): boolean {
  return userSockets.has(userId);
}

// Send notification to specific user
export function sendNotificationToUser(
  io: SocketServer,
  userId: string,
  notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }
): boolean {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(`user:${userId}`).emit('notification', notification);
    return true;
  }
  return false;
}

// Broadcast notification to all online users
export function broadcastNotification(
  io: SocketServer,
  notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }
): void {
  io.emit('notification', notification);
}

// Send notification to users with specific role
export function sendNotificationToRole(
  io: SocketServer,
  role: string,
  notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }
): void {
  const users = Array.from(onlineUsers.values()).filter(user => user.role === role);
  users.forEach(user => {
    io.to(`user:${user.userId}`).emit('notification', notification);
  });
}

export default {
  initializeSocketServer,
  getOnlineUsers,
  getOnlineUsersCount,
  isUserOnline,
  sendNotificationToUser,
  broadcastNotification,
  sendNotificationToRole
};

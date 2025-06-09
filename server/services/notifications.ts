import { prisma } from './database';
import { logger } from '../middleware/logger';
import { io } from '../index';
import { NotificationType, NotificationPriority } from '@prisma/client';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  priority?: NotificationPriority;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  categories: {
    [key in NotificationType]?: boolean;
  };
}

/**
 * Create and send a notification
 */
export async function createNotification(notificationData: CreateNotificationData): Promise<void> {
  try {
    // Check user notification preferences
    const user = await prisma.user.findUnique({
      where: { id: notificationData.userId },
      select: {
        emailNotifications: true,
        pushNotifications: true,
        userPreferences: {
          where: {
            category: 'notifications',
            key: notificationData.type
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user wants this type of notification
    const typePreference = user.userPreferences.find(p => p.key === notificationData.type);
    const isEnabled = typePreference ? typePreference.value === 'true' : true;

    if (!isEnabled) {
      logger.debug('Notification skipped due to user preferences', {
        userId: notificationData.userId,
        type: notificationData.type
      });
      return;
    }

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data || {},
        priority: notificationData.priority || NotificationPriority.NORMAL,
        expiresAt: notificationData.expiresAt
      }
    });

    // Send real-time notification via Socket.IO
    io.to(`user_${notificationData.userId}`).emit('notification', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      priority: notification.priority,
      createdAt: notification.createdAt
    });

    // Send email notification if enabled
    if (user.emailNotifications && shouldSendEmail(notificationData.type, notificationData.priority)) {
      await sendEmailNotification(notificationData.userId, notification);
    }

    // Send push notification if enabled
    if (user.pushNotifications && shouldSendPush(notificationData.type, notificationData.priority)) {
      await sendPushNotification(notificationData.userId, notification);
    }

    logger.info('Notification created and sent', {
      notificationId: notification.id,
      userId: notificationData.userId,
      type: notificationData.type
    });

  } catch (error) {
    logger.error('Failed to create notification', {
      userId: notificationData.userId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
) {
  try {
    const skip = (page - 1) * limit;
    
    const where = {
      userId,
      ...(unreadOnly && { isRead: false }),
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ]);

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    };

  } catch (error) {
    logger.error('Failed to get user notifications', { userId, error: error.message });
    throw error;
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
  try {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: userId
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    logger.debug('Notification marked as read', { notificationId, userId });

  } catch (error) {
    logger.error('Failed to mark notification as read', {
      notificationId,
      userId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    logger.info('All notifications marked as read', { userId });

  } catch (error) {
    logger.error('Failed to mark all notifications as read', {
      userId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string, userId: string): Promise<void> {
  try {
    await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: userId
      }
    });

    logger.debug('Notification deleted', { notificationId, userId });

  } catch (error) {
    logger.error('Failed to delete notification', {
      notificationId,
      userId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });

    return count;

  } catch (error) {
    logger.error('Failed to get unread notification count', { userId, error: error.message });
    return 0;
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  try {
    const updates = [];

    // Update general notification settings
    if (preferences.emailNotifications !== undefined) {
      updates.push(
        prisma.user.update({
          where: { id: userId },
          data: { emailNotifications: preferences.emailNotifications }
        })
      );
    }

    if (preferences.pushNotifications !== undefined) {
      updates.push(
        prisma.user.update({
          where: { id: userId },
          data: { pushNotifications: preferences.pushNotifications }
        })
      );
    }

    // Update category-specific preferences
    if (preferences.categories) {
      for (const [category, enabled] of Object.entries(preferences.categories)) {
        updates.push(
          prisma.userPreference.upsert({
            where: {
              userId_category_key: {
                userId,
                category: 'notifications',
                key: category
              }
            },
            create: {
              userId,
              category: 'notifications',
              key: category,
              value: enabled.toString()
            },
            update: {
              value: enabled.toString()
            }
          })
        );
      }
    }

    await Promise.all(updates);

    logger.info('Notification preferences updated', { userId });

  } catch (error) {
    logger.error('Failed to update notification preferences', {
      userId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Clean up expired notifications
 */
export async function cleanupExpiredNotifications(): Promise<void> {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    logger.info('Expired notifications cleaned up', { deletedCount: result.count });

  } catch (error) {
    logger.error('Failed to cleanup expired notifications', { error: error.message });
  }
}

// Helper functions

function shouldSendEmail(type: NotificationType, priority: NotificationPriority): boolean {
  // Send email for high priority or specific types
  return priority === NotificationPriority.HIGH || 
         priority === NotificationPriority.URGENT ||
         type === NotificationType.SECURITY ||
         type === NotificationType.PAYMENT;
}

function shouldSendPush(type: NotificationType, priority: NotificationPriority): boolean {
  // Send push for urgent notifications or messages
  return priority === NotificationPriority.URGENT ||
         type === NotificationType.MESSAGE ||
         type === NotificationType.SECURITY;
}

async function sendEmailNotification(userId: string, notification: any): Promise<void> {
  // TODO: Implement email notification sending
  // This would integrate with the email service
  logger.debug('Email notification would be sent', { userId, notificationId: notification.id });
}

async function sendPushNotification(userId: string, notification: any): Promise<void> {
  // TODO: Implement push notification sending
  // This would integrate with a push notification service like FCM
  logger.debug('Push notification would be sent', { userId, notificationId: notification.id });
}

// Predefined notification templates
export const NotificationTemplates = {
  WELCOME: {
    type: NotificationType.SYSTEM,
    title: 'Welcome to OnlyFur!',
    message: 'Your account has been created successfully. Start exploring content from amazing creators!'
  },
  
  NEW_SUBSCRIBER: {
    type: NotificationType.SUBSCRIPTION,
    title: 'New Subscriber!',
    message: 'You have a new subscriber! 🎉'
  },
  
  SUBSCRIPTION_EXPIRING: {
    type: NotificationType.SUBSCRIPTION,
    title: 'Subscription Expiring Soon',
    message: 'Your subscription will expire in 3 days. Renew now to continue enjoying premium content.',
    priority: NotificationPriority.HIGH
  },
  
  PAYMENT_SUCCESSFUL: {
    type: NotificationType.PAYMENT,
    title: 'Payment Successful',
    message: 'Your payment has been processed successfully.'
  },
  
  PAYMENT_FAILED: {
    type: NotificationType.PAYMENT,
    title: 'Payment Failed',
    message: 'We could not process your payment. Please check your payment method.',
    priority: NotificationPriority.HIGH
  },
  
  NEW_MESSAGE: {
    type: NotificationType.MESSAGE,
    title: 'New Message',
    message: 'You have received a new message.',
    priority: NotificationPriority.NORMAL
  },
  
  CONTENT_APPROVED: {
    type: NotificationType.CONTENT,
    title: 'Content Approved',
    message: 'Your content has been approved and is now live!'
  },
  
  CONTENT_REJECTED: {
    type: NotificationType.CONTENT,
    title: 'Content Requires Review',
    message: 'Your content needs some adjustments before it can be published.',
    priority: NotificationPriority.HIGH
  },
  
  SECURITY_ALERT: {
    type: NotificationType.SECURITY,
    title: 'Security Alert',
    message: 'New login detected from an unrecognized device.',
    priority: NotificationPriority.URGENT
  }
};

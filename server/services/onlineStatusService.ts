import { PrismaClient, ActivityStatus } from '@prisma/client';
import { RedisClient } from 'redis';

const prisma = new PrismaClient();

interface OnlineUser {
  userId: string;
  lastActivity: Date;
  socketId?: string;
  activityStatus: ActivityStatus;
}

class OnlineStatusService {
  private onlineUsers = new Map<string, OnlineUser>();
  private redis?: RedisClient;
  private statusUpdateInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize Redis connection if available
    this.initializeRedis();
    
    // Start periodic status updates
    this.startPeriodicStatusUpdates();
  }

  private async initializeRedis() {
    try {
      // TODO: Initialize Redis connection for distributed online status
      // this.redis = new RedisClient(process.env.REDIS_URL);
      console.log('Online status service initialized (Redis disabled for now)');
    } catch (error) {
      console.warn('Redis not available, using in-memory online status tracking');
    }
  }

  /**
   * Mark user as online
   */
  async setUserOnline(userId: string, socketId?: string): Promise<void> {
    const now = new Date();
    
    // Update in-memory tracking
    this.onlineUsers.set(userId, {
      userId,
      lastActivity: now,
      socketId,
      activityStatus: ActivityStatus.ONLINE
    });

    // Update database
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: true,
          lastActivityAt: now,
          lastSeenAt: now,
          onlineStatusUpdatedAt: now,
          activityStatus: ActivityStatus.ONLINE
        }
      });

      // Update Redis if available
      if (this.redis) {
        await this.redis.setex(`user:${userId}:online`, 300, JSON.stringify({
          lastActivity: now.toISOString(),
          status: ActivityStatus.ONLINE
        }));
      }
    } catch (error) {
      console.error('Error updating user online status:', error);
    }
  }

  /**
   * Mark user as offline
   */
  async setUserOffline(userId: string): Promise<void> {
    const now = new Date();
    
    // Remove from in-memory tracking
    this.onlineUsers.delete(userId);

    // Update database
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: false,
          lastSeenAt: now,
          onlineStatusUpdatedAt: now,
          activityStatus: ActivityStatus.OFFLINE
        }
      });

      // Update Redis if available
      if (this.redis) {
        await this.redis.del(`user:${userId}:online`);
      }
    } catch (error) {
      console.error('Error updating user offline status:', error);
    }
  }

  /**
   * Update user activity (heartbeat)
   */
  async updateUserActivity(userId: string): Promise<void> {
    const now = new Date();
    
    // Update in-memory tracking
    const user = this.onlineUsers.get(userId);
    if (user) {
      user.lastActivity = now;
      this.onlineUsers.set(userId, user);
    }

    // Update database (less frequently to avoid too many writes)
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          lastActivityAt: now,
          onlineStatusUpdatedAt: now
        }
      });

      // Update Redis if available
      if (this.redis && user) {
        await this.redis.setex(`user:${userId}:online`, 300, JSON.stringify({
          lastActivity: now.toISOString(),
          status: user.activityStatus
        }));
      }
    } catch (error) {
      console.error('Error updating user activity:', error);
    }
  }

  /**
   * Set user activity status (online, away, busy)
   */
  async setUserActivityStatus(userId: string, status: ActivityStatus): Promise<void> {
    const now = new Date();
    
    // Update in-memory tracking
    const user = this.onlineUsers.get(userId);
    if (user) {
      user.activityStatus = status;
      user.lastActivity = now;
      this.onlineUsers.set(userId, user);
    }

    // Update database
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          activityStatus: status,
          lastActivityAt: now,
          onlineStatusUpdatedAt: now,
          isOnline: status !== ActivityStatus.OFFLINE
        }
      });

      // Update Redis if available
      if (this.redis) {
        if (status === ActivityStatus.OFFLINE) {
          await this.redis.del(`user:${userId}:online`);
        } else {
          await this.redis.setex(`user:${userId}:online`, 300, JSON.stringify({
            lastActivity: now.toISOString(),
            status
          }));
        }
      }
    } catch (error) {
      console.error('Error updating user activity status:', error);
    }
  }

  /**
   * Get user's current online status
   */
  async getUserOnlineStatus(userId: string): Promise<{
    isOnline: boolean;
    activityStatus: ActivityStatus;
    lastSeen?: Date;
    lastActivity?: Date;
  }> {
    try {
      // Check in-memory first
      const memoryUser = this.onlineUsers.get(userId);
      if (memoryUser) {
        return {
          isOnline: true,
          activityStatus: memoryUser.activityStatus,
          lastActivity: memoryUser.lastActivity
        };
      }

      // Check Redis if available
      if (this.redis) {
        const redisData = await this.redis.get(`user:${userId}:online`);
        if (redisData) {
          const parsed = JSON.parse(redisData);
          return {
            isOnline: true,
            activityStatus: parsed.status,
            lastActivity: new Date(parsed.lastActivity)
          };
        }
      }

      // Fall back to database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          isOnline: true,
          activityStatus: true,
          lastSeenAt: true,
          lastActivityAt: true,
          onlineStatusUpdatedAt: true
        }
      });

      if (!user) {
        return {
          isOnline: false,
          activityStatus: ActivityStatus.OFFLINE
        };
      }

      // Check if user should be considered offline based on last activity
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const isRecentlyActive = user.lastActivityAt && user.lastActivityAt > fiveMinutesAgo;

      return {
        isOnline: user.isOnline && isRecentlyActive,
        activityStatus: isRecentlyActive ? user.activityStatus : ActivityStatus.OFFLINE,
        lastSeen: user.lastSeenAt || undefined,
        lastActivity: user.lastActivityAt || undefined
      };
    } catch (error) {
      console.error('Error getting user online status:', error);
      return {
        isOnline: false,
        activityStatus: ActivityStatus.OFFLINE
      };
    }
  }

  /**
   * Get multiple users' online status
   */
  async getMultipleUsersOnlineStatus(userIds: string[]): Promise<Map<string, {
    isOnline: boolean;
    activityStatus: ActivityStatus;
    lastSeen?: Date;
  }>> {
    const results = new Map();

    try {
      // Get statuses for all users
      const users = await prisma.user.findMany({
        where: { 
          id: { in: userIds }
        },
        select: {
          id: true,
          isOnline: true,
          activityStatus: true,
          lastSeenAt: true,
          lastActivityAt: true
        }
      });

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      users.forEach(user => {
        // Check in-memory status first
        const memoryUser = this.onlineUsers.get(user.id);
        if (memoryUser) {
          results.set(user.id, {
            isOnline: true,
            activityStatus: memoryUser.activityStatus,
            lastSeen: memoryUser.lastActivity
          });
        } else {
          const isRecentlyActive = user.lastActivityAt && user.lastActivityAt > fiveMinutesAgo;
          results.set(user.id, {
            isOnline: user.isOnline && isRecentlyActive,
            activityStatus: isRecentlyActive ? user.activityStatus : ActivityStatus.OFFLINE,
            lastSeen: user.lastSeenAt || undefined
          });
        }
      });

      // Fill in missing users as offline
      userIds.forEach(userId => {
        if (!results.has(userId)) {
          results.set(userId, {
            isOnline: false,
            activityStatus: ActivityStatus.OFFLINE
          });
        }
      });

    } catch (error) {
      console.error('Error getting multiple users online status:', error);
      // Return all as offline on error
      userIds.forEach(userId => {
        results.set(userId, {
          isOnline: false,
          activityStatus: ActivityStatus.OFFLINE
        });
      });
    }

    return results;
  }

  /**
   * Get currently online users count
   */
  async getOnlineUsersCount(): Promise<number> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const onlineCount = await prisma.user.count({
        where: {
          isOnline: true,
          lastActivityAt: {
            gte: fiveMinutesAgo
          }
        }
      });

      return onlineCount;
    } catch (error) {
      console.error('Error getting online users count:', error);
      return 0;
    }
  }

  /**
   * Get list of online users (for admin/analytics)
   */
  async getOnlineUsers(limit: number = 100): Promise<Array<{
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    isOnline: boolean;
    activityStatus: ActivityStatus;
    lastActivityAt?: Date;
  }>> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const onlineUsers = await prisma.user.findMany({
        where: {
          isOnline: true,
          lastActivityAt: {
            gte: fiveMinutesAgo
          }
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          isOnline: true,
          activityStatus: true,
          lastActivityAt: true
        },
        take: limit,
        orderBy: {
          lastActivityAt: 'desc'
        }
      });

      return onlineUsers;
    } catch (error) {
      console.error('Error getting online users list:', error);
      return [];
    }
  }

  /**
   * Cleanup offline users periodically
   */
  private startPeriodicStatusUpdates(): void {
    // Run every 2 minutes
    this.statusUpdateInterval = setInterval(async () => {
      await this.cleanupOfflineUsers();
    }, 2 * 60 * 1000);
  }

  /**
   * Cleanup users who haven't been active recently
   */
  private async cleanupOfflineUsers(): Promise<void> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      // Update database to mark inactive users as offline
      await prisma.user.updateMany({
        where: {
          isOnline: true,
          lastActivityAt: {
            lt: fiveMinutesAgo
          }
        },
        data: {
          isOnline: false,
          activityStatus: ActivityStatus.OFFLINE,
          onlineStatusUpdatedAt: new Date()
        }
      });

      // Clean up in-memory tracking
      for (const [userId, user] of this.onlineUsers.entries()) {
        if (user.lastActivity < fiveMinutesAgo) {
          this.onlineUsers.delete(userId);
        }
      }

      console.log(`Cleaned up offline users at ${new Date().toISOString()}`);
    } catch (error) {
      console.error('Error cleaning up offline users:', error);
    }
  }

  /**
   * Stop the service and cleanup
   */
  async stop(): Promise<void> {
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
      this.statusUpdateInterval = null;
    }

    // Close Redis connection if available
    if (this.redis) {
      await this.redis.quit();
    }

    // Close Prisma connection
    await prisma.$disconnect();
  }
}

export const onlineStatusService = new OnlineStatusService();
export default onlineStatusService;

import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';
import { vercelBlobStorage } from './vercelBlobStorage';
import { User, UserRole, SubscriptionStatus, AuthProvider } from '@prisma/client';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  subscriptionStatus: SubscriptionStatus;
  authProvider: AuthProvider;
  socialLinks?: any;
  preferredLanguage?: string;
  timezone?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  stats?: {
    contentCount: number;
    totalViews: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  preferredLanguage: string;
  timezone: string;
  privacySettings?: any;
  contentSettings?: any;
  paymentSettings?: any;
}

export interface UserUpdateData {
  displayName?: string;
  bio?: string;
  socialLinks?: any;
  preferredLanguage?: string;
  timezone?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
  privacySettings?: any;
  contentSettings?: any;
}

/**
 * Comprehensive User Management Service with PostgreSQL and Blob Storage Integration
 */
export class UserManagementService {
  private static instance: UserManagementService;

  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  /**
   * Get user profile by ID with statistics
   */
  async getUserProfile(userId: string, requesterId?: string): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              content: { where: { status: 'PUBLISHED' } },
              subscribers: true,
              subscriptions: true
            }
          }
        }
      });

      if (!user) {
        return null;
      }

      // Check privacy settings for non-owner access
      if (requesterId !== userId && !user.isPublic) {
        // Return limited public profile
        return {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          bio: user.bio,
          avatar: user.avatar,
          coverImage: user.coverImage,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          subscriptionStatus: user.subscriptionStatus,
          authProvider: user.authProvider,
          emailNotifications: false,
          pushNotifications: false,
          marketingEmails: false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          email: '', // Hide email for privacy
          stats: {
            contentCount: user._count.content,
            totalViews: 0, // Will be calculated separately if needed
            followersCount: user._count.subscribers,
            followingCount: user._count.subscriptions
          }
        };\n      }

      // Get total views for user's content
      const totalViews = await prisma.content.aggregate({
        where: { creatorId: userId },
        _sum: { views: true }
      });

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        coverImage: user.coverImage,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        subscriptionStatus: user.subscriptionStatus,
        authProvider: user.authProvider,
        socialLinks: user.socialLinks,
        preferredLanguage: user.preferredLanguage,
        timezone: user.timezone,
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications,
        marketingEmails: user.marketingEmails,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        stats: {
          contentCount: user._count.content,
          totalViews: totalViews._sum.views || 0,
          followersCount: user._count.subscribers,
          followingCount: user._count.subscriptions
        }
      };

    } catch (error: any) {
      logger.error('Failed to get user profile', {
        userId,
        requesterId,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Update user profile with file uploads
   */
  async updateUserProfile(
    userId: string,
    updates: UserUpdateData,
    files?: {
      avatar?: Express.Multer.File;
      coverImage?: Express.Multer.File;
    }
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      let avatarUrl = user.avatar;
      let coverImageUrl = user.coverImage;

      // Upload avatar to Vercel Blob if provided
      if (files?.avatar) {
        const avatarUpload = await vercelBlobStorage.uploadFile(files.avatar, {
          userId,
          category: 'avatar',
          metadata: { type: 'user_avatar' }
        });
        avatarUrl = avatarUpload.blobUrl;

        // Delete old avatar if exists
        if (user.avatar) {
          try {
            const oldAvatarFile = await prisma.blobStorage.findFirst({
              where: {
                userId,
                blobUrl: user.avatar,
                category: 'avatar'
              }
            });
            if (oldAvatarFile) {
              await vercelBlobStorage.deleteFile(oldAvatarFile.id, userId);
            }
          } catch (error) {
            logger.warn('Failed to delete old avatar', { userId, error: error.message });
          }
        }
      }

      // Upload cover image to Vercel Blob if provided
      if (files?.coverImage) {
        const coverUpload = await vercelBlobStorage.uploadFile(files.coverImage, {
          userId,
          category: 'cover',
          metadata: { type: 'user_cover' }
        });
        coverImageUrl = coverUpload.blobUrl;

        // Delete old cover image if exists
        if (user.coverImage) {
          try {
            const oldCoverFile = await prisma.blobStorage.findFirst({
              where: {
                userId,
                blobUrl: user.coverImage,
                category: 'cover'
              }
            });
            if (oldCoverFile) {
              await vercelBlobStorage.deleteFile(oldCoverFile.id, userId);
            }
          } catch (error) {
            logger.warn('Failed to delete old cover image', { userId, error: error.message });
          }
        }
      }

      // Update user in PostgreSQL
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updates,
          avatar: avatarUrl,
          coverImage: coverImageUrl,
          updatedAt: new Date()
        }
      });

      // Create audit log
      await createAuditLog({
        userId,
        action: AuditActions.UPDATE,
        resource: 'user_profile',
        resourceId: userId,
        metadata: {
          updates: Object.keys(updates),
          hasNewAvatar: !!files?.avatar,
          hasNewCoverImage: !!files?.coverImage
        }
      });

      // Get updated profile
      const profile = await this.getUserProfile(userId, userId);

      logger.info('User profile updated', {
        userId,
        updates: Object.keys(updates),
        hasNewAvatar: !!files?.avatar,
        hasNewCoverImage: !!files?.coverImage
      });

      return {
        success: true,
        user: profile!
      };

    } catch (error: any) {
      logger.error('Profile update failed', {
        userId,
        error: error.message
      });

      return {
        success: false,
        error: 'Profile update failed. Please try again.'
      };
    }
  }

  /**
   * Update user settings
   */
  async updateUserSettings(
    userId: string,
    settings: Partial<UserSettings>
  ): Promise<{ success: boolean; settings?: UserSettings; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update user settings in PostgreSQL
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          emailNotifications: settings.emailNotifications ?? user.emailNotifications,
          pushNotifications: settings.pushNotifications ?? user.pushNotifications,
          marketingEmails: settings.marketingEmails ?? user.marketingEmails,
          preferredLanguage: settings.preferredLanguage ?? user.preferredLanguage,
          timezone: settings.timezone ?? user.timezone,
          privacySettings: settings.privacySettings ?? user.privacySettings,
          contentSettings: settings.contentSettings ?? user.contentSettings,
          paymentSettings: settings.paymentSettings ?? user.paymentSettings,
          updatedAt: new Date()
        }
      });

      // Create audit log
      await createAuditLog({
        userId,
        action: AuditActions.UPDATE,
        resource: 'user_settings',
        resourceId: userId,
        metadata: {
          updatedSettings: Object.keys(settings)
        }
      });

      const userSettings: UserSettings = {
        emailNotifications: updatedUser.emailNotifications,
        pushNotifications: updatedUser.pushNotifications,
        marketingEmails: updatedUser.marketingEmails,
        preferredLanguage: updatedUser.preferredLanguage || 'en',
        timezone: updatedUser.timezone || 'UTC',
        privacySettings: updatedUser.privacySettings,
        contentSettings: updatedUser.contentSettings,
        paymentSettings: updatedUser.paymentSettings
      };

      logger.info('User settings updated', {
        userId,
        updatedSettings: Object.keys(settings)
      });

      return {
        success: true,
        settings: userSettings
      };

    } catch (error: any) {
      logger.error('Settings update failed', {
        userId,
        error: error.message
      });

      return {
        success: false,
        error: 'Settings update failed. Please try again.'
      };
    }
  }

  /**
   * Get user settings
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          emailNotifications: true,
          pushNotifications: true,
          marketingEmails: true,
          preferredLanguage: true,
          timezone: true,
          privacySettings: true,
          contentSettings: true,
          paymentSettings: true
        }
      });

      if (!user) {
        return null;
      }

      return {
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications,
        marketingEmails: user.marketingEmails,
        preferredLanguage: user.preferredLanguage || 'en',
        timezone: user.timezone || 'UTC',
        privacySettings: user.privacySettings,
        contentSettings: user.contentSettings,
        paymentSettings: user.paymentSettings
      };

    } catch (error: any) {
      logger.error('Failed to get user settings', {
        userId,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Search users
   */
  async searchUsers(
    query: string,
    options: {
      limit?: number;
      offset?: number;
      role?: UserRole;
      isVerified?: boolean;
      sortBy?: 'username' | 'displayName' | 'createdAt' | 'followers';
    } = {}
  ): Promise<{ users: UserProfile[]; total: number }> {
    try {
      const where: any = {
        isActive: true,
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } }
        ]
      };

      if (options.role) where.role = options.role;
      if (options.isVerified !== undefined) where.isVerified = options.isVerified;

      let orderBy: any = { createdAt: 'desc' };
      if (options.sortBy === 'username') orderBy = { username: 'asc' };
      else if (options.sortBy === 'displayName') orderBy = { displayName: 'asc' };
      else if (options.sortBy === 'followers') {
        // For followers, we'll use a more complex query
        orderBy = { subscribers: { _count: 'desc' } };
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            avatar: true,
            coverImage: true,
            role: true,
            isVerified: true,
            isActive: true,
            isEmailVerified: true,
            subscriptionStatus: true,
            authProvider: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                content: { where: { status: 'PUBLISHED' } },
                subscribers: true,
                subscriptions: true
              }
            }
          },
          orderBy,
          skip: options.offset || 0,
          take: options.limit || 20
        }),
        prisma.user.count({ where })
      ]);

      const userProfiles: UserProfile[] = users.map(user => ({
        id: user.id,
        email: '', // Hide email in search results
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        coverImage: user.coverImage,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        subscriptionStatus: user.subscriptionStatus,
        authProvider: user.authProvider,
        emailNotifications: false,
        pushNotifications: false,
        marketingEmails: false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        stats: {
          contentCount: user._count.content,
          totalViews: 0, // Would need separate query for performance
          followersCount: user._count.subscribers,
          followingCount: user._count.subscriptions
        }
      }));

      return { users: userProfiles, total };

    } catch (error: any) {
      logger.error('User search failed', {
        query,
        options,
        error: error.message
      });
      return { users: [], total: 0 };
    }
  }

  /**
   * Get user followers/subscribers
   */
  async getUserFollowers(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ followers: UserProfile[]; total: number }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { followers: [], total: 0 };
      }

      const [followers, total] = await Promise.all([
        prisma.subscription.findMany({
          where: { creatorId: userId },
          include: {
            subscriber: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                role: true,
                isVerified: true,
                createdAt: true
              }
            }
          },
          skip: options.offset || 0,
          take: options.limit || 20,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.subscription.count({ where: { creatorId: userId } })
      ]);

      const followerProfiles: UserProfile[] = followers.map(sub => ({
        id: sub.subscriber.id,
        email: '',
        username: sub.subscriber.username,
        displayName: sub.subscriber.displayName,
        bio: undefined,
        avatar: sub.subscriber.avatar,
        coverImage: undefined,
        role: sub.subscriber.role,
        isVerified: sub.subscriber.isVerified,
        isActive: true,
        isEmailVerified: false,
        subscriptionStatus: 'FREE' as SubscriptionStatus,
        authProvider: 'EMAIL' as AuthProvider,
        emailNotifications: false,
        pushNotifications: false,
        marketingEmails: false,
        createdAt: sub.subscriber.createdAt,
        updatedAt: sub.subscriber.createdAt,
        stats: {
          contentCount: 0,
          totalViews: 0,
          followersCount: 0,
          followingCount: 0
        }
      }));

      return { followers: followerProfiles, total };

    } catch (error: any) {
      logger.error('Failed to get user followers', {
        userId,
        options,
        error: error.message
      });
      return { followers: [], total: 0 };
    }
  }

  /**
   * Get user following
   */
  async getUserFollowing(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ following: UserProfile[]; total: number }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { following: [], total: 0 };
      }

      const [following, total] = await Promise.all([
        prisma.subscription.findMany({
          where: { subscriberId: userId },
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                role: true,
                isVerified: true,
                createdAt: true
              }
            }
          },
          skip: options.offset || 0,
          take: options.limit || 20,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.subscription.count({ where: { subscriberId: userId } })
      ]);

      const followingProfiles: UserProfile[] = following.map(sub => ({
        id: sub.creator.id,
        email: '',
        username: sub.creator.username,
        displayName: sub.creator.displayName,
        bio: undefined,
        avatar: sub.creator.avatar,
        coverImage: undefined,
        role: sub.creator.role,
        isVerified: sub.creator.isVerified,
        isActive: true,
        isEmailVerified: false,
        subscriptionStatus: 'FREE' as SubscriptionStatus,
        authProvider: 'EMAIL' as AuthProvider,
        emailNotifications: false,
        pushNotifications: false,
        marketingEmails: false,
        createdAt: sub.creator.createdAt,
        updatedAt: sub.creator.createdAt,
        stats: {
          contentCount: 0,
          totalViews: 0,
          followersCount: 0,
          followingCount: 0
        }
      }));

      return { following: followingProfiles, total };

    } catch (error: any) {
      logger.error('Failed to get user following', {
        userId,
        options,
        error: error.message
      });
      return { following: [], total: 0 };
    }
  }

  /**
   * Follow/Subscribe to a user
   */
  async followUser(
    subscriberId: string,
    creatorId: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      if (subscriberId === creatorId) {
        return {
          success: false,
          error: 'Cannot follow yourself'
        };
      }

      // Check if both users exist
      const [subscriber, creator] = await Promise.all([
        prisma.user.findUnique({ where: { id: subscriberId } }),
        prisma.user.findUnique({ where: { id: creatorId } })
      ]);

      if (!subscriber || !creator) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if already following
      const existingSubscription = await prisma.subscription.findUnique({
        where: {
          subscriberId_creatorId: {
            subscriberId,
            creatorId
          }
        }
      });

      if (existingSubscription) {
        return {
          success: false,
          error: 'Already following this user'
        };
      }

      // Create subscription
      await prisma.subscription.create({
        data: {
          subscriberId,
          creatorId,
          tier: 'FREE',
          status: 'ACTIVE'
        }
      });

      // Create audit log
      await createAuditLog({
        userId: subscriberId,
        action: AuditActions.CREATE,
        resource: 'subscription',
        resourceId: creatorId,
        metadata: {
          action: 'follow_user',
          creatorUsername: creator.username
        }
      });

      logger.info('User followed successfully', {
        subscriberId,
        creatorId,
        creatorUsername: creator.username
      });

      return {
        success: true,
        message: 'User followed successfully'
      };

    } catch (error: any) {
      logger.error('Follow user failed', {
        subscriberId,
        creatorId,
        error: error.message
      });

      return {
        success: false,
        error: 'Failed to follow user. Please try again.'
      };
    }
  }

  /**
   * Unfollow/Unsubscribe from a user
   */
  async unfollowUser(
    subscriberId: string,
    creatorId: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Find and delete subscription
      const subscription = await prisma.subscription.findUnique({
        where: {
          subscriberId_creatorId: {
            subscriberId,
            creatorId
          }
        }
      });

      if (!subscription) {
        return {
          success: false,
          error: 'Not following this user'
        };
      }

      await prisma.subscription.delete({
        where: {
          subscriberId_creatorId: {
            subscriberId,
            creatorId
          }
        }
      });

      // Create audit log
      await createAuditLog({
        userId: subscriberId,
        action: AuditActions.DELETE,
        resource: 'subscription',
        resourceId: creatorId,
        metadata: {
          action: 'unfollow_user'
        }
      });

      logger.info('User unfollowed successfully', {
        subscriberId,
        creatorId
      });

      return {
        success: true,
        message: 'User unfollowed successfully'
      };

    } catch (error: any) {
      logger.error('Unfollow user failed', {
        subscriberId,
        creatorId,
        error: error.message
      });

      return {
        success: false,
        error: 'Failed to unfollow user. Please try again.'
      };
    }
  }
}

export const userManagementService = UserManagementService.getInstance();
export default userManagementService;

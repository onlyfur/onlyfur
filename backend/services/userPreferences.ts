import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';

export interface UserPreference {
  id: string;
  userId: string;
  category: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  subscriptionUpdates: boolean;
  newFollowers: boolean;
  contentLikes: boolean;
  contentComments: boolean;
  directMessages: boolean;
  paymentNotifications: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  monthlyReport: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'subscribers_only';
  showOnlineStatus: boolean;
  allowDirectMessages: 'everyone' | 'subscribers_only' | 'none';
  showLastSeen: boolean;
  dataAnalytics: boolean;
  personalizedAds: boolean;
  showInSearch: boolean;
  allowTagging: boolean;
}

export interface ContentPreferences {
  defaultContentVisibility: 'public' | 'subscribers_only' | 'private';
  allowComments: boolean;
  allowRatings: boolean;
  allowSharing: boolean;
  contentWarnings: boolean;
  ageRestriction: boolean;
  downloadProtection: boolean;
  watermarkContent: boolean;
}

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  contentPerPage: number;
  autoplayVideos: boolean;
  showNSFWContent: boolean;
  blurNSFWThumbnails: boolean;
  compactMode: boolean;
}

/**
 * User Preferences Service
 */
export class UserPreferencesService {
  private static instance: UserPreferencesService;

  static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  /**
   * Get user preference by category and key
   */
  async getPreference(userId: string, category: string, key: string): Promise<string | null> {
    try {
      const preference = await prisma.userPreference.findUnique({
        where: {
          userId_category_key: {
            userId,
            category,
            key
          }
        }
      });

      return preference?.value || null;
    } catch (error) {
      logger.error('Failed to get user preference', {
        userId,
        category,
        key,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Set user preference
   */
  async setPreference(
    userId: string, 
    category: string, 
    key: string, 
    value: string
  ): Promise<boolean> {
    try {
      const oldPreference = await this.getPreference(userId, category, key);

      await prisma.userPreference.upsert({
        where: {
          userId_category_key: {
            userId,
            category,
            key
          }
        },
        create: {
          userId,
          category,
          key,
          value
        },
        update: {
          value
        }
      });

      // Audit log
      await createAuditLog({
        userId,
        action: AuditActions.USER_UPDATE,
        resource: 'user_preference',
        resourceId: `${category}.${key}`,
        oldValues: { value: oldPreference },
        newValues: { value },
        metadata: { category, key }
      });

      logger.debug('User preference updated', {
        userId,
        category,
        key,
        oldValue: oldPreference,
        newValue: value
      });

      return true;
    } catch (error) {
      logger.error('Failed to set user preference', {
        userId,
        category,
        key,
        value,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get all preferences for a category
   */
  async getCategoryPreferences(userId: string, category: string): Promise<Record<string, string>> {
    try {
      const preferences = await prisma.userPreference.findMany({
        where: {
          userId,
          category
        }
      });

      return preferences.reduce((acc, pref) => {
        acc[pref.key] = pref.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      logger.error('Failed to get category preferences', {
        userId,
        category,
        error: error.message
      });
      return {};
    }
  }

  /**
   * Set multiple preferences for a category
   */
  async setCategoryPreferences(
    userId: string, 
    category: string, 
    preferences: Record<string, string>
  ): Promise<boolean> {
    try {
      const oldPreferences = await this.getCategoryPreferences(userId, category);

      // Use transaction for atomic updates
      await prisma.$transaction(
        Object.entries(preferences).map(([key, value]) =>
          prisma.userPreference.upsert({
            where: {
              userId_category_key: {
                userId,
                category,
                key
              }
            },
            create: {
              userId,
              category,
              key,
              value
            },
            update: {
              value
            }
          })
        )
      );

      // Audit log
      await createAuditLog({
        userId,
        action: AuditActions.USER_UPDATE,
        resource: 'user_preferences',
        resourceId: category,
        oldValues: oldPreferences,
        newValues: preferences,
        metadata: { category, count: Object.keys(preferences).length }
      });

      logger.info('Category preferences updated', {
        userId,
        category,
        count: Object.keys(preferences).length
      });

      return true;
    } catch (error) {
      logger.error('Failed to set category preferences', {
        userId,
        category,
        preferences,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get notification preferences with defaults
   */
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const preferences = await this.getCategoryPreferences(userId, 'notifications');
      
      return {
        emailNotifications: preferences.emailNotifications === 'true' ?? true,
        pushNotifications: preferences.pushNotifications === 'true' ?? true,
        smsNotifications: preferences.smsNotifications === 'true' ?? false,
        subscriptionUpdates: preferences.subscriptionUpdates === 'true' ?? true,
        newFollowers: preferences.newFollowers === 'true' ?? true,
        contentLikes: preferences.contentLikes === 'true' ?? true,
        contentComments: preferences.contentComments === 'true' ?? true,
        directMessages: preferences.directMessages === 'true' ?? true,
        paymentNotifications: preferences.paymentNotifications === 'true' ?? true,
        securityAlerts: preferences.securityAlerts === 'true' ?? true,
        marketingEmails: preferences.marketingEmails === 'true' ?? false,
        weeklyDigest: preferences.weeklyDigest === 'true' ?? true,
        monthlyReport: preferences.monthlyReport === 'true' ?? true
      };
    } catch (error) {
      logger.error('Failed to get notification preferences', {
        userId,
        error: error.message
      });
      
      // Return defaults on error
      return {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        subscriptionUpdates: true,
        newFollowers: true,
        contentLikes: true,
        contentComments: true,
        directMessages: true,
        paymentNotifications: true,
        securityAlerts: true,
        marketingEmails: false,
        weeklyDigest: true,
        monthlyReport: true
      };
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      const stringPreferences = Object.entries(preferences).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);

      return await this.setCategoryPreferences(userId, 'notifications', stringPreferences);
    } catch (error) {
      logger.error('Failed to update notification preferences', {
        userId,
        preferences,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get privacy preferences with defaults
   */
  async getPrivacyPreferences(userId: string): Promise<PrivacyPreferences> {
    try {
      const preferences = await this.getCategoryPreferences(userId, 'privacy');
      
      return {
        profileVisibility: (preferences.profileVisibility as any) || 'public',
        showOnlineStatus: preferences.showOnlineStatus === 'true' ?? true,
        allowDirectMessages: (preferences.allowDirectMessages as any) || 'everyone',
        showLastSeen: preferences.showLastSeen === 'true' ?? true,
        dataAnalytics: preferences.dataAnalytics === 'true' ?? true,
        personalizedAds: preferences.personalizedAds === 'true' ?? false,
        showInSearch: preferences.showInSearch === 'true' ?? true,
        allowTagging: preferences.allowTagging === 'true' ?? true
      };
    } catch (error) {
      logger.error('Failed to get privacy preferences', {
        userId,
        error: error.message
      });
      
      return {
        profileVisibility: 'public',
        showOnlineStatus: true,
        allowDirectMessages: 'everyone',
        showLastSeen: true,
        dataAnalytics: true,
        personalizedAds: false,
        showInSearch: true,
        allowTagging: true
      };
    }
  }

  /**
   * Update privacy preferences
   */
  async updatePrivacyPreferences(
    userId: string, 
    preferences: Partial<PrivacyPreferences>
  ): Promise<boolean> {
    try {
      const stringPreferences = Object.entries(preferences).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);

      return await this.setCategoryPreferences(userId, 'privacy', stringPreferences);
    } catch (error) {
      logger.error('Failed to update privacy preferences', {
        userId,
        preferences,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get content preferences with defaults
   */
  async getContentPreferences(userId: string): Promise<ContentPreferences> {
    try {
      const preferences = await this.getCategoryPreferences(userId, 'content');
      
      return {
        defaultContentVisibility: (preferences.defaultContentVisibility as any) || 'public',
        allowComments: preferences.allowComments === 'true' ?? true,
        allowRatings: preferences.allowRatings === 'true' ?? true,
        allowSharing: preferences.allowSharing === 'true' ?? true,
        contentWarnings: preferences.contentWarnings === 'true' ?? true,
        ageRestriction: preferences.ageRestriction === 'true' ?? false,
        downloadProtection: preferences.downloadProtection === 'true' ?? false,
        watermarkContent: preferences.watermarkContent === 'true' ?? false
      };
    } catch (error) {
      logger.error('Failed to get content preferences', {
        userId,
        error: error.message
      });
      
      return {
        defaultContentVisibility: 'public',
        allowComments: true,
        allowRatings: true,
        allowSharing: true,
        contentWarnings: true,
        ageRestriction: false,
        downloadProtection: false,
        watermarkContent: false
      };
    }
  }

  /**
   * Update content preferences
   */
  async updateContentPreferences(
    userId: string, 
    preferences: Partial<ContentPreferences>
  ): Promise<boolean> {
    try {
      const stringPreferences = Object.entries(preferences).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);

      return await this.setCategoryPreferences(userId, 'content', stringPreferences);
    } catch (error) {
      logger.error('Failed to update content preferences', {
        userId,
        preferences,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get display preferences with defaults
   */
  async getDisplayPreferences(userId: string): Promise<DisplayPreferences> {
    try {
      const preferences = await this.getCategoryPreferences(userId, 'display');
      
      return {
        theme: (preferences.theme as any) || 'auto',
        language: preferences.language || 'en',
        timezone: preferences.timezone || 'UTC',
        dateFormat: preferences.dateFormat || 'MM/DD/YYYY',
        currency: preferences.currency || 'USD',
        contentPerPage: parseInt(preferences.contentPerPage) || 20,
        autoplayVideos: preferences.autoplayVideos === 'true' ?? false,
        showNSFWContent: preferences.showNSFWContent === 'true' ?? false,
        blurNSFWThumbnails: preferences.blurNSFWThumbnails === 'true' ?? true,
        compactMode: preferences.compactMode === 'true' ?? false
      };
    } catch (error) {
      logger.error('Failed to get display preferences', {
        userId,
        error: error.message
      });
      
      return {
        theme: 'auto',
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        contentPerPage: 20,
        autoplayVideos: false,
        showNSFWContent: false,
        blurNSFWThumbnails: true,
        compactMode: false
      };
    }
  }

  /**
   * Update display preferences
   */
  async updateDisplayPreferences(
    userId: string, 
    preferences: Partial<DisplayPreferences>
  ): Promise<boolean> {
    try {
      const stringPreferences = Object.entries(preferences).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>);

      return await this.setCategoryPreferences(userId, 'display', stringPreferences);
    } catch (error) {
      logger.error('Failed to update display preferences', {
        userId,
        preferences,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Get all user preferences
   */
  async getAllPreferences(userId: string): Promise<{
    notifications: NotificationPreferences;
    privacy: PrivacyPreferences;
    content: ContentPreferences;
    display: DisplayPreferences;
  }> {
    try {
      const [notifications, privacy, content, display] = await Promise.all([
        this.getNotificationPreferences(userId),
        this.getPrivacyPreferences(userId),
        this.getContentPreferences(userId),
        this.getDisplayPreferences(userId)
      ]);

      return {
        notifications,
        privacy,
        content,
        display
      };
    } catch (error) {
      logger.error('Failed to get all preferences', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Reset preferences to defaults
   */
  async resetPreferences(userId: string, category?: string): Promise<boolean> {
    try {
      if (category) {
        await prisma.userPreference.deleteMany({
          where: {
            userId,
            category
          }
        });
      } else {
        await prisma.userPreference.deleteMany({
          where: { userId }
        });
      }

      // Audit log
      await createAuditLog({
        userId,
        action: AuditActions.USER_UPDATE,
        resource: 'user_preferences',
        resourceId: category || 'all',
        metadata: { action: 'reset', category }
      });

      logger.info('User preferences reset', {
        userId,
        category: category || 'all'
      });

      return true;
    } catch (error) {
      logger.error('Failed to reset preferences', {
        userId,
        category,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Delete user preferences (for account deletion)
   */
  async deleteUserPreferences(userId: string): Promise<boolean> {
    try {
      await prisma.userPreference.deleteMany({
        where: { userId }
      });

      logger.info('User preferences deleted', { userId });
      return true;
    } catch (error) {
      logger.error('Failed to delete user preferences', {
        userId,
        error: error.message
      });
      return false;
    }
  }
}

export const userPreferencesService = UserPreferencesService.getInstance();
export default userPreferencesService;

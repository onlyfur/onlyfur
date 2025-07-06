import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';
import { createNotification } from './notifications';
import { NotificationType, NotificationPriority } from '@prisma/client';

export interface MobileDevice {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: 'ios' | 'android';
  deviceModel?: string;
  osVersion?: string;
  appVersion: string;
  pushToken?: string;
  isActive: boolean;
  lastActiveAt: Date;
  settings: DeviceSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceSettings {
  pushNotifications: boolean;
  backgroundSync: boolean;
  dataUsage: 'low' | 'medium' | 'high';
  videoQuality: 'auto' | 'low' | 'medium' | 'high' | 'hd';
  autoDownload: boolean;
  offlineMode: boolean;
  darkMode: boolean;
  hapticFeedback: boolean;
}

export interface PushNotification {
  id: string;
  userId: string;
  deviceId?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
  sound?: string;
  category?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  delivered: boolean;
  opened: boolean;
  createdAt: Date;
}

export interface MobileSession {
  id: string;
  userId: string;
  deviceId: string;
  sessionToken: string;
  startedAt: Date;
  lastActiveAt: Date;
  endedAt?: Date;
  isActive: boolean;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  networkType?: string;
  batteryLevel?: number;
}

export interface AppUpdate {
  version: string;
  platform: 'ios' | 'android';
  isRequired: boolean;
  releaseNotes: string;
  downloadUrl: string;
  releaseDate: Date;
  minOsVersion: string;
  features: string[];
  bugFixes: string[];
}

/**
 * Mobile App Service - Handles mobile-specific functionality
 */
export class MobileAppService {
  private static instance: MobileAppService;

  static getInstance(): MobileAppService {
    if (!MobileAppService.instance) {
      MobileAppService.instance = new MobileAppService();
    }
    return MobileAppService.instance;
  }

  /**
   * Register a mobile device
   */
  async registerDevice(data: {
    userId: string;
    deviceId: string;
    deviceType: 'ios' | 'android';
    deviceModel?: string;
    osVersion?: string;
    appVersion: string;
    pushToken?: string;
  }): Promise<MobileDevice> {
    try {
      // Check if device already exists
      const existingDevice = await this.getDeviceByDeviceId(data.deviceId);
      
      if (existingDevice) {
        // Update existing device
        return await this.updateDevice(existingDevice.id, {
          userId: data.userId,
          deviceModel: data.deviceModel,
          osVersion: data.osVersion,
          appVersion: data.appVersion,
          pushToken: data.pushToken,
          isActive: true,
          lastActiveAt: new Date()
        });
      }

      const defaultSettings: DeviceSettings = {
        pushNotifications: true,
        backgroundSync: true,
        dataUsage: 'medium',
        videoQuality: 'auto',
        autoDownload: false,
        offlineMode: false,
        darkMode: false,
        hapticFeedback: true
      };

      const device: MobileDevice = {
        id: this.generateDeviceId(),
        userId: data.userId,
        deviceId: data.deviceId,
        deviceType: data.deviceType,
        deviceModel: data.deviceModel,
        osVersion: data.osVersion,
        appVersion: data.appVersion,
        pushToken: data.pushToken,
        isActive: true,
        lastActiveAt: new Date(),
        settings: defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await this.saveDeviceToDatabase(device);

      // Audit log
      await createAuditLog({
        userId: data.userId,
        action: AuditActions.CREATE,
        resource: 'mobile_device',
        resourceId: device.id,
        metadata: {
          deviceType: data.deviceType,
          deviceModel: data.deviceModel,
          appVersion: data.appVersion
        }
      });

      logger.info('Mobile device registered', {
        deviceId: device.id,
        userId: data.userId,
        deviceType: data.deviceType
      });

      return device;

    } catch (error) {
      logger.error('Failed to register mobile device', {
        userId: data.userId,
        deviceId: data.deviceId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Create mobile session
   */
  async createSession(data: {
    userId: string;
    deviceId: string;
    location?: {
      latitude: number;
      longitude: number;
      city?: string;
      country?: string;
    };
    networkType?: string;
    batteryLevel?: number;
  }): Promise<MobileSession> {
    try {
      // End any existing active sessions for this device
      await this.endActiveSessionsForDevice(data.deviceId);

      const session: MobileSession = {
        id: this.generateSessionId(),
        userId: data.userId,
        deviceId: data.deviceId,
        sessionToken: this.generateSessionToken(),
        startedAt: new Date(),
        lastActiveAt: new Date(),
        isActive: true,
        location: data.location,
        networkType: data.networkType,
        batteryLevel: data.batteryLevel
      };

      // Save to database
      await this.saveSessionToDatabase(session);

      // Update device last active
      await this.updateDeviceActivity(data.deviceId);

      logger.info('Mobile session created', {
        sessionId: session.id,
        userId: data.userId,
        deviceId: data.deviceId
      });

      return session;

    } catch (error) {
      logger.error('Failed to create mobile session', {
        userId: data.userId,
        deviceId: data.deviceId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification(data: {
    userId: string;
    deviceId?: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    badge?: number;
    sound?: string;
    category?: string;
    scheduledAt?: Date;
  }): Promise<PushNotification[]> {
    try {
      const notifications: PushNotification[] = [];
      
      // Get target devices
      const devices = data.deviceId 
        ? [await this.getDevice(data.deviceId)]
        : await this.getUserDevices(data.userId);

      for (const device of devices.filter(d => d && d.isActive && d.pushToken && d.settings.pushNotifications)) {
        const notification: PushNotification = {
          id: this.generateNotificationId(),
          userId: data.userId,
          deviceId: device.id,
          title: data.title,
          body: data.body,
          data: data.data,
          badge: data.badge,
          sound: data.sound,
          category: data.category,
          scheduledAt: data.scheduledAt,
          delivered: false,
          opened: false,
          createdAt: new Date()
        };

        // Save notification
        await this.saveNotificationToDatabase(notification);

        // Send push notification (mock implementation)
        const delivered = await this.sendPushToDevice(device, notification);
        
        if (delivered) {
          notification.delivered = true;
          notification.sentAt = new Date();
          await this.updateNotificationInDatabase(notification);
        }

        notifications.push(notification);
      }

      logger.info('Push notifications sent', {
        userId: data.userId,
        count: notifications.length,
        title: data.title
      });

      return notifications;

    } catch (error) {
      logger.error('Failed to send push notification', {
        userId: data.userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get mobile-optimized content
   */
  async getMobileContent(data: {
    userId: string;
    deviceId: string;
    contentType?: string;
    quality?: 'low' | 'medium' | 'high';
    limit?: number;
    offset?: number;
  }): Promise<{
    content: any[];
    hasMore: boolean;
    totalSize: number;
    optimizedUrls: Record<string, string>;
  }> {
    try {
      const device = await this.getDevice(data.deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      // Get content with mobile optimizations
      const content = await this.getOptimizedContent({
        userId: data.userId,
        contentType: data.contentType,
        quality: data.quality || device.settings.videoQuality,
        dataUsage: device.settings.dataUsage,
        limit: data.limit || 20,
        offset: data.offset || 0
      });

      // Generate optimized URLs based on device settings
      const optimizedUrls = await this.generateOptimizedUrls(content, device);

      // Calculate total size for data usage tracking
      const totalSize = await this.calculateContentSize(content, device.settings.dataUsage);

      logger.debug('Mobile content retrieved', {
        userId: data.userId,
        deviceId: data.deviceId,
        contentCount: content.length,
        totalSize
      });

      return {
        content,
        hasMore: content.length === (data.limit || 20),
        totalSize,
        optimizedUrls
      };

    } catch (error) {
      logger.error('Failed to get mobile content', {
        userId: data.userId,
        deviceId: data.deviceId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Update device settings
   */
  async updateDeviceSettings(
    deviceId: string,
    settings: Partial<DeviceSettings>
  ): Promise<MobileDevice> {
    try {
      const device = await this.getDevice(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      const updatedSettings = {
        ...device.settings,
        ...settings
      };

      const updatedDevice = await this.updateDevice(deviceId, {
        settings: updatedSettings,
        updatedAt: new Date()
      });

      // Audit log
      await createAuditLog({
        userId: device.userId,
        action: AuditActions.UPDATE,
        resource: 'mobile_device_settings',
        resourceId: deviceId,
        oldValues: { settings: device.settings },
        newValues: { settings: updatedSettings },
        metadata: { changedSettings: Object.keys(settings) }
      });

      logger.info('Device settings updated', {
        deviceId,
        userId: device.userId,
        changedSettings: Object.keys(settings)
      });

      return updatedDevice;

    } catch (error) {
      logger.error('Failed to update device settings', {
        deviceId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Check for app updates
   */
  async checkForUpdates(
    deviceId: string,
    currentVersion: string
  ): Promise<AppUpdate | null> {
    try {
      const device = await this.getDevice(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      const latestUpdate = await this.getLatestAppUpdate(device.deviceType);
      
      if (!latestUpdate) {
        return null;
      }

      // Compare versions
      if (this.compareVersions(currentVersion, latestUpdate.version) < 0) {
        // Check OS compatibility
        if (device.osVersion && this.compareVersions(device.osVersion, latestUpdate.minOsVersion) >= 0) {
          return latestUpdate;
        }
      }

      return null;

    } catch (error) {
      logger.error('Failed to check for app updates', {
        deviceId,
        currentVersion,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Get device analytics
   */
  async getDeviceAnalytics(deviceId: string, period: 'day' | 'week' | 'month' = 'week'): Promise<{
    sessionCount: number;
    totalSessionTime: number;
    averageSessionTime: number;
    contentViewed: number;
    dataUsage: number;
    batteryUsage: number[];
    activeHours: number[];
  }> {
    try {
      const device = await this.getDevice(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      const analytics = await this.calculateDeviceAnalytics(deviceId, period);

      return analytics;

    } catch (error) {
      logger.error('Failed to get device analytics', {
        deviceId,
        error: error.message
      });
      throw error;
    }
  }

  // Private helper methods

  private generateDeviceId(): string {
    return `mdev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `msess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateNotificationId(): string {
    return `mpush_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionToken(): string {
    return `mtoken_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  private async sendPushToDevice(device: MobileDevice, notification: PushNotification): Promise<boolean> {
    try {
      // Mock push notification sending
      // In production, this would use FCM for Android and APNS for iOS
      
      if (device.deviceType === 'ios') {
        // Send via APNS
        return await this.sendAPNSNotification(device.pushToken!, notification);
      } else {
        // Send via FCM
        return await this.sendFCMNotification(device.pushToken!, notification);
      }
    } catch (error) {
      logger.error('Failed to send push to device', {
        deviceId: device.id,
        error: error.message
      });
      return false;
    }
  }

  private async sendAPNSNotification(pushToken: string, notification: PushNotification): Promise<boolean> {
    // Mock APNS implementation
    logger.debug('Sending APNS notification', { pushToken, title: notification.title });
    return true;
  }

  private async sendFCMNotification(pushToken: string, notification: PushNotification): Promise<boolean> {
    // Mock FCM implementation
    logger.debug('Sending FCM notification', { pushToken, title: notification.title });
    return true;
  }

  private compareVersions(version1: string, version2: string): number {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
      const v1part = v1parts[i] || 0;
      const v2part = v2parts[i] || 0;
      
      if (v1part < v2part) return -1;
      if (v1part > v2part) return 1;
    }
    
    return 0;
  }

  // Database methods (simplified - would implement actual database operations)
  private async saveDeviceToDatabase(device: MobileDevice): Promise<void> {}
  private async saveSessionToDatabase(session: MobileSession): Promise<void> {}
  private async saveNotificationToDatabase(notification: PushNotification): Promise<void> {}
  private async updateNotificationInDatabase(notification: PushNotification): Promise<void> {}
  private async getDevice(deviceId: string): Promise<MobileDevice | null> { return null; }
  private async getDeviceByDeviceId(deviceId: string): Promise<MobileDevice | null> { return null; }
  private async getUserDevices(userId: string): Promise<MobileDevice[]> { return []; }
  private async updateDevice(deviceId: string, updates: Partial<MobileDevice>): Promise<MobileDevice> { return null as any; }
  private async updateDeviceActivity(deviceId: string): Promise<void> {}
  private async endActiveSessionsForDevice(deviceId: string): Promise<void> {}
  private async getOptimizedContent(params: any): Promise<any[]> { return []; }
  private async generateOptimizedUrls(content: any[], device: MobileDevice): Promise<Record<string, string>> { return {}; }
  private async calculateContentSize(content: any[], dataUsage: string): Promise<number> { return 0; }
  private async getLatestAppUpdate(platform: string): Promise<AppUpdate | null> { return null; }
  private async calculateDeviceAnalytics(deviceId: string, period: string): Promise<any> { return {}; }
}

export const mobileAppService = MobileAppService.getInstance();
export default mobileAppService;

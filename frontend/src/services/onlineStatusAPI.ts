// Main Online Status API - Refactored for better bundle splitting
import { 
  ActivityStatus, 
  UserOnlineStatus, 
  OnlineUser, 
  OnlineStatusConfig 
} from './types/onlineStatus.types';
import { OnlineStatusAPIClient } from './core/apiClient';
import { formatLastSeen, getStatusIndicator } from './utils/onlineStatus.utils';

// Lazy load heavy modules
const loadHeartbeatManager = () => import('./modules/heartbeatManager').then(m => m.HeartbeatManager);
const loadRateLimiter = () => import('./modules/rateLimiter').then(m => m.RateLimiter);

class OnlineStatusAPI {
  private apiClient = new OnlineStatusAPIClient();
  private heartbeatManager: any = null;
  private rateLimiter: any = null;
  private isActive = false;
  private isStarting = false;
  private trackingDisabled = false;
  
  private config: OnlineStatusConfig = {
    heartbeatFrequency: 5 * 60 * 1000, // 5 minutes
    maxHeartbeatFrequency: 15 * 60 * 1000, // 15 minutes
    maxRetries: 3,
    retryDelay: 1000,
    maxRequestsPerWindow: 5,
    windowDuration: 60000 // 1 minute
  };

  constructor() {
    // Initialize heavy components lazily
    this.initializeComponents();
    
    // Reset tracking disabled flag after 10 minutes
    setInterval(() => {
      if (this.trackingDisabled) {
        console.log('Attempting to re-enable online status tracking...');
        this.trackingDisabled = false;
        if (this.rateLimiter) {
          this.rateLimiter.reset();
        }
      }
    }, 10 * 60 * 1000);
  }

  private async initializeComponents(): Promise<void> {
    try {
      const [HeartbeatManager, RateLimiter] = await Promise.all([
        loadHeartbeatManager(),
        loadRateLimiter()
      ]);

      this.rateLimiter = new RateLimiter(
        this.config.maxRequestsPerWindow,
        this.config.windowDuration
      );

      this.heartbeatManager = new HeartbeatManager(
        this.config,
        this.apiClient,
        this.retryWithBackoff.bind(this)
      );
    } catch (error) {
      console.error('Failed to initialize components:', error);
    }
  }

  /**
   * Start online status tracking (call when user logs in)
   */
  async startTracking(socketId?: string): Promise<void> {
    if (this.trackingDisabled || this.isStarting || this.isActive) {
      return;
    }

    this.isStarting = true;

    try {
      await this.ensureComponentsLoaded();
      
      const result = await this.retryWithBackoff(async () => {
        return this.apiClient.makeRequest('/set-online', {
          method: 'POST',
          body: JSON.stringify({ socketId }),
        });
      }, 'Start tracking');
      
      if (!result.success) {
        if (result.error?.includes('Rate limit exceeded') || 
            result.error?.includes('Unable to connect')) {
          console.warn('Online status tracking disabled:', result.error);
          this.trackingDisabled = true;
          return;
        }
        throw new Error(result.error || 'Failed to start tracking');
      }
      
      this.heartbeatManager?.start();
      this.heartbeatManager?.setupVisibilityTracking(this.setActivityStatus.bind(this));
      this.isActive = true;

      console.log('Online status tracking started');
    } catch (error) {
      console.error('Failed to start online status tracking:', error);
      this.trackingDisabled = true;
    } finally {
      this.isStarting = false;
    }
  }

  /**
   * Stop online status tracking (call when user logs out)
   */
  async stopTracking(): Promise<void> {
    try {
      this.heartbeatManager?.stop();
      
      if (!this.trackingDisabled) {
        await this.apiClient.makeRequest('/set-offline', {
          method: 'POST',
        });
      }
      
      this.isActive = false;
      this.isStarting = false;
      console.log('Online status tracking stopped');
    } catch (error) {
      console.error('Failed to stop online status tracking:', error);
    }
  }

  /**
   * Manually re-enable tracking
   */
  enableTracking(): void {
    console.log('Manually re-enabling online status tracking');
    this.trackingDisabled = false;
    this.rateLimiter?.reset();
  }

  /**
   * Set user activity status
   */
  async setActivityStatus(status: ActivityStatus): Promise<void> {
    if (this.trackingDisabled || !this.isActive) {
      return;
    }

    try {
      const result = await this.apiClient.makeRequest('/set-status', {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      
      if (!result.success) {
        if (result.error?.includes('Rate limit exceeded') || 
            result.error?.includes('Unable to connect')) {
          console.warn('Activity status update disabled:', result.error);
          return;
        }
        throw new Error(result.error || 'Failed to set activity status');
      }
    } catch (error) {
      console.error('Failed to set activity status:', error);
    }
  }

  /**
   * Get user's online status
   */
  async getUserOnlineStatus(userId: string): Promise<UserOnlineStatus | null> {
    try {
      const response = await this.apiClient.makeRequest(`/status/${userId}`, {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return {
          ...response.data.status,
          lastSeen: response.data.status.lastSeen ? new Date(response.data.status.lastSeen) : undefined,
          lastActivity: response.data.status.lastActivity ? new Date(response.data.status.lastActivity) : undefined
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get user online status:', error);
      return null;
    }
  }

  /**
   * Get multiple users' online status
   */
  async getBulkOnlineStatus(userIds: string[]): Promise<Map<string, UserOnlineStatus>> {
    try {
      const response = await this.apiClient.makeRequest('/bulk-status', {
        method: 'POST',
        body: JSON.stringify({ userIds }),
      });
      
      if (response.success && response.data) {
        const statusMap = new Map<string, UserOnlineStatus>();
        
        for (const [userId, status] of Object.entries(response.data.statuses)) {
          statusMap.set(userId, {
            ...(status as any),
            lastSeen: (status as any).lastSeen ? new Date((status as any).lastSeen) : undefined,
            lastActivity: (status as any).lastActivity ? new Date((status as any).lastActivity) : undefined
          });
        }
        
        return statusMap;
      }
      return new Map();
    } catch (error) {
      console.error('Failed to get bulk online status:', error);
      return new Map();
    }
  }

  /**
   * Get current online users count
   */
  async getOnlineCount(): Promise<number> {
    try {
      const response = await this.apiClient.makeRequest('/online-count', {
        method: 'GET',
      });
      
      return response.success ? response.data.onlineCount : 0;
    } catch (error) {
      console.error('Failed to get online count:', error);
      return 0;
    }
  }

  /**
   * Get list of currently online users
   */
  async getOnlineUsers(limit: number = 50): Promise<OnlineUser[]> {
    try {
      const response = await this.apiClient.makeRequest(`/online-users?limit=${limit}`, {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data.users.map((user: any) => ({
          ...user,
          lastActivityAt: user.lastActivityAt ? new Date(user.lastActivityAt) : undefined
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get online users:', error);
      return [];
    }
  }

  // Utility methods - delegate to utils
  formatLastSeen = formatLastSeen;
  getStatusIndicator = getStatusIndicator;

  private async ensureComponentsLoaded(): Promise<void> {
    if (!this.heartbeatManager || !this.rateLimiter) {
      await this.initializeComponents();
    }
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<{ success: boolean; data?: T; error?: string }>,
    context: string
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    await this.ensureComponentsLoaded();
    
    if (this.rateLimiter) {
      return this.rateLimiter.retryWithBackoff(
        operation,
        context,
        this.trackingDisabled,
        this.config.maxRetries,
        this.config.retryDelay
      );
    }
    
    // Fallback if rateLimiter isn't loaded
    return operation();
  }
}

export const onlineStatusAPI = new OnlineStatusAPI();
export default onlineStatusAPI;

// Re-export types and enums for convenience
export { ActivityStatus } from './types/onlineStatus.types';
export type { UserOnlineStatus, OnlineUser } from './types/onlineStatus.types';

import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
                     (import.meta as any).env?.VITE_API_BASE_URL || 
                     'http://localhost:3001/api';

export enum ActivityStatus {
  ONLINE = 'ONLINE',
  AWAY = 'AWAY', 
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE'
}

export interface UserOnlineStatus {
  isOnline: boolean;
  activityStatus: ActivityStatus;
  lastSeen?: Date;
  lastActivity?: Date;
}

export interface OnlineUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  activityStatus: ActivityStatus;
  lastActivityAt?: Date;
}

class OnlineStatusAPI {
  private client = axios.create({
    baseURL: `${API_BASE_URL}/online-status`,
    timeout: 10000
  });

  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isActive = false;
  private retryAttempts = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // Start with 1 second
  private rateLimitWindowStart = 0;
  private requestCount = 0;
  private maxRequestsPerWindow = 10;
  private windowDuration = 60000; // 1 minute
  private heartbeatFrequency = 2 * 60 * 1000; // Default 2 minutes
  private maxHeartbeatFrequency = 10 * 60 * 1000; // Max 10 minutes

  constructor() {
    this.setupAuthInterceptor();
  }

  private setupAuthInterceptor() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Start online status tracking (call when user logs in)
   */
  async startTracking(socketId?: string): Promise<void> {
    try {
      // Use retry logic for setting user online
      await this.retryWithBackoff(async () => {
        return this.client.post('/set-online', { socketId });
      }, 'Start tracking');
      
      // Start heartbeat
      this.startHeartbeat();
      this.isActive = true;

      // Set up visibility change listeners
      this.setupVisibilityTracking();
      
      console.log('Online status tracking started');
    } catch (error) {
      console.error('Failed to start online status tracking:', error);
      
      // Don't throw error if it's just a tracking issue
      // Continue with the app functionality
      if (error instanceof Error && (
        error.message.includes('ERR_INSUFFICIENT_RESOURCES') ||
        error.message.includes('ERR_NETWORK') ||
        error.message.includes('Rate limit exceeded')
      )) {
        console.warn('Online status tracking disabled due to resource constraints');
        return;
      }
      
      throw error;
    }
  }

  /**
   * Stop online status tracking (call when user logs out)
   */
  async stopTracking(): Promise<void> {
    try {
      // Stop heartbeat
      this.stopHeartbeat();
      
      // Set user as offline
      await this.client.post('/set-offline');
      
      this.isActive = false;
      console.log('Online status tracking stopped');
    } catch (error) {
      console.error('Failed to stop online status tracking:', error);
    }
  }

  /**
   * Send heartbeat to maintain online status
   */
  async sendHeartbeat(): Promise<void> {
    try {
      await this.retryWithBackoff(async () => {
        return this.client.post('/heartbeat');
      }, 'Heartbeat');
    } catch (error) {
      console.error('Heartbeat failed:', error);
      
      // If heartbeat fails due to resource exhaustion, reduce frequency
      if (error instanceof Error && (
        error.message.includes('ERR_INSUFFICIENT_RESOURCES') ||
        error.message.includes('Rate limit exceeded')
      )) {
        console.warn('Reducing heartbeat frequency due to resource constraints');
        this.adjustHeartbeatFrequency();
      }
    }
  }

  /**
   * Set user activity status
   */
  async setActivityStatus(status: ActivityStatus): Promise<void> {
    try {
      await this.client.post('/set-status', { status });
    } catch (error) {
      console.error('Failed to set activity status:', error);
      throw error;
    }
  }

  /**
   * Get user's online status
   */
  async getUserOnlineStatus(userId: string): Promise<UserOnlineStatus | null> {
    try {
      const response = await this.client.get(`/status/${userId}`);
      const data = response.data;
      
      if (data.success) {
        return {
          ...data.status,
          lastSeen: data.status.lastSeen ? new Date(data.status.lastSeen) : undefined,
          lastActivity: data.status.lastActivity ? new Date(data.status.lastActivity) : undefined
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
      const response = await this.client.post('/bulk-status', { userIds });
      const data = response.data;
      
      if (data.success) {
        const statusMap = new Map<string, UserOnlineStatus>();
        
        for (const [userId, status] of Object.entries(data.statuses)) {
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
      const response = await this.client.get('/online-count');
      const data = response.data;
      
      return data.success ? data.onlineCount : 0;
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
      const response = await this.client.get('/online-users', {
        params: { limit }
      });
      const data = response.data;
      
      if (data.success) {
        return data.users.map((user: any) => ({
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

  /**
   * Start periodic heartbeat
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Send heartbeat based on current frequency
    this.heartbeatInterval = setInterval(() => {
      if (this.isActive) {
        this.sendHeartbeat();
      }
    }, this.heartbeatFrequency);
  }

  /**
   * Stop periodic heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Setup page visibility tracking to handle away status
   */
  private setupVisibilityTracking(): void {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, set as away
        this.setActivityStatus(ActivityStatus.AWAY).catch(console.error);
      } else {
        // Page is visible, set as online
        this.setActivityStatus(ActivityStatus.ONLINE).catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle window focus/blur
    window.addEventListener('focus', () => {
      if (this.isActive) {
        this.setActivityStatus(ActivityStatus.ONLINE).catch(console.error);
      }
    });

    window.addEventListener('blur-sm', () => {
      if (this.isActive) {
        this.setActivityStatus(ActivityStatus.AWAY).catch(console.error);
      }
    });

    // Handle beforeunload to set offline
    window.addEventListener('beforeunload', () => {
      if (this.isActive) {
        // Use sendBeacon for better reliability during page unload
        const data = JSON.stringify({});
        const token = localStorage.getItem('token');
        
        if (token && navigator.sendBeacon) {
          const blob = new Blob([data], { type: 'application/json' });
          navigator.sendBeacon(`${API_BASE_URL}/online-status/set-offline`, blob);
        }
      }
    });
  }

  /**
   * Format last seen time for display
   */
  formatLastSeen(lastSeen?: Date): string {
    if (!lastSeen) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return lastSeen.toLocaleDateString();
  }

  /**
   * Get status indicator info for UI
   */
  getStatusIndicator(status: ActivityStatus, isOnline: boolean): {
    color: string;
    text: string;
    icon: string;
  } {
    if (!isOnline || status === ActivityStatus.OFFLINE) {
      return {
        color: 'bg-gray-400',
        text: 'Offline',
        icon: '⚫'
      };
    }

    switch (status) {
      case ActivityStatus.ONLINE:
        return {
          color: 'bg-green-500',
          text: 'Online',
          icon: '🟢'
        };
      case ActivityStatus.AWAY:
        return {
          color: 'bg-yellow-500',
          text: 'Away',
          icon: '🟡'
        };
      case ActivityStatus.BUSY:
        return {
          color: 'bg-red-500',
          text: 'Busy',
          icon: '🔴'
        };
      default:
        return {
          color: 'bg-gray-400',
          text: 'Offline',
          icon: '⚫'
        };
    }
  }

  private isRateLimited(): boolean {
    const now = Date.now();
    
    // Reset window if it has passed
    if (now - this.rateLimitWindowStart > this.windowDuration) {
      this.rateLimitWindowStart = now;
      this.requestCount = 0;
    }
    
    return this.requestCount >= this.maxRequestsPerWindow;
  }

  private incrementRequestCount(): void {
    const now = Date.now();
    
    // Reset window if it has passed
    if (now - this.rateLimitWindowStart > this.windowDuration) {
      this.rateLimitWindowStart = now;
      this.requestCount = 0;
    }
    
    this.requestCount++;
  }

  private async retryWithBackoff<T>(operation: () => Promise<T>, context: string): Promise<T> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Check rate limit before making request
        if (this.isRateLimited()) {
          console.warn(`Rate limit reached for ${context}, skipping request`);
          throw new Error('Rate limit exceeded');
        }

        this.incrementRequestCount();
        const result = await operation();
        
        // Reset retry attempts on success
        this.retryAttempts = 0;
        return result;
      } catch (error: any) {
        const isLastAttempt = attempt === this.maxRetries;
        
        // Don't retry on certain error types
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          throw error;
        }
        
        // Don't retry on network exhaustion errors unless it's not the last attempt
        if (error?.code === 'ERR_NETWORK' || error?.code === 'ERR_INSUFFICIENT_RESOURCES') {
          if (isLastAttempt) {
            console.warn(`${context} failed after ${this.maxRetries} attempts:`, error.message);
            throw error;
          }
          
          // Wait longer for resource exhaustion errors
          const delay = this.retryDelay * Math.pow(2, attempt) * (error?.code === 'ERR_INSUFFICIENT_RESOURCES' ? 3 : 1);
          console.warn(`${context} failed (attempt ${attempt + 1}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (isLastAttempt) {
          throw error;
        }
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt);
        console.warn(`${context} failed (attempt ${attempt + 1}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error(`Failed after ${this.maxRetries} attempts`);
  }

  private adjustHeartbeatFrequency(): void {
    // Double the frequency up to maximum
    this.heartbeatFrequency = Math.min(this.heartbeatFrequency * 2, this.maxHeartbeatFrequency);
    
    // Restart heartbeat with new frequency
    if (this.isActive && this.heartbeatInterval) {
      this.stopHeartbeat();
      this.startHeartbeat();
    }
  }
}

export const onlineStatusAPI = new OnlineStatusAPI();
export default onlineStatusAPI;

// Use fetch instead of axios for better CORS compatibility
const API_BASE_URL = (() => {
  if ((import.meta as any).env?.VITE_API_BASE_URL) {
    return (import.meta as any).env.VITE_API_BASE_URL;
  } else if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    
    if (currentHost === 'onlyfur.net' || currentHost === 'www.onlyfur.net') {
      return '/api';
    } else if (currentHost === 'creatorplattform.vercel.app') {
      return '/api';
    } else if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:3001/api';
    } else {
      return '/api';
    }
  } else {
    return '/api';
  }
})();

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
  private baseURL = `${API_BASE_URL}/online-status`;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isActive = false;
  private isStarting = false; // Prevent multiple simultaneous starts
  private retryAttempts = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // Start with 1 second
  private rateLimitWindowStart = 0;
  private requestCount = 0;
  private maxRequestsPerWindow = 5; // Reduced from 10 to 5
  private windowDuration = 60000; // 1 minute
  private heartbeatFrequency = 5 * 60 * 1000; // Increased from 2 to 5 minutes
  private maxHeartbeatFrequency = 15 * 60 * 1000; // Increased from 10 to 15 minutes
  private trackingDisabled = false; // Flag to disable tracking completely

  constructor() {
    // No need for axios interceptors - we'll handle auth in each request
    
    // Reset tracking disabled flag after 10 minutes
    setInterval(() => {
      if (this.trackingDisabled) {
        console.log('Attempting to re-enable online status tracking...');
        this.trackingDisabled = false;
        // Reset rate limiting as well
        this.rateLimitWindowStart = 0;
        this.requestCount = 0;
      }
    }, 10 * 60 * 1000); // 10 minutes
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        credentials: 'include', // Important for CORS with cookies
      });

      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || data.message || `Request failed with status ${response.status}` 
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('Online status API request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Unable to connect to server. Please check your internet connection and try again.',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Start online status tracking (call when user logs in)
   */
  async startTracking(socketId?: string): Promise<void> {
    // Check if tracking is disabled
    if (this.trackingDisabled) {
      console.warn('Online status tracking is disabled due to previous errors');
      return;
    }

    // Prevent multiple simultaneous start attempts
    if (this.isStarting || this.isActive) {
      console.log('Online status tracking already starting or active');
      return;
    }

    this.isStarting = true;

    try {
      // Use retry logic for setting user online
      const result = await this.retryWithBackoff(async () => {
        return this.makeRequest('/set-online', {
          method: 'POST',
          body: JSON.stringify({ socketId }),
        });
      }, 'Start tracking');
      
      if (!result.success) {
        // Don't throw error for rate limiting or network issues
        if (result.error?.includes('Rate limit exceeded') || 
            result.error?.includes('Unable to connect')) {
          console.warn('Online status tracking disabled:', result.error);
          this.trackingDisabled = true;
          return;
        }
        throw new Error(result.error || 'Failed to start tracking');
      }
      
      // Start heartbeat only if we're not rate limited
      this.startHeartbeat();
      this.isActive = true;

      // Set up visibility change listeners
      this.setupVisibilityTracking();
      
      console.log('Online status tracking started');
    } catch (error) {
      console.error('Failed to start online status tracking:', error);
      
      // Disable tracking to prevent repeated attempts
      if (error instanceof Error && (
        error.message.includes('insufficient resources') ||
        error.message.includes('Unable to connect') ||
        error.message.includes('Rate limit exceeded')
      )) {
        console.warn('Online status tracking disabled due to resource constraints');
        this.trackingDisabled = true;
        return;
      }
      
      // For other errors, still disable to prevent loops
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
      // Stop heartbeat
      this.stopHeartbeat();
      
      // Only try to set offline if tracking is not disabled
      if (!this.trackingDisabled) {
        await this.makeRequest('/set-offline', {
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
   * Manually re-enable tracking (for debugging or user action)
   */
  enableTracking(): void {
    console.log('Manually re-enabling online status tracking');
    this.trackingDisabled = false;
    this.rateLimitWindowStart = 0;
    this.requestCount = 0;
    this.heartbeatFrequency = 5 * 60 * 1000; // Reset to 5 minutes
  }

  /**
   * Send heartbeat to maintain online status
   */
  async sendHeartbeat(): Promise<void> {
    // Skip if tracking is disabled
    if (this.trackingDisabled || !this.isActive) {
      return;
    }

    try {
      const result = await this.retryWithBackoff(async () => {
        return this.makeRequest('/heartbeat', {
          method: 'POST',
        });
      }, 'Heartbeat');
      
      if (!result.success) {
        // Don't throw for rate limiting or connection issues
        if (result.error?.includes('Rate limit exceeded') || 
            result.error?.includes('Unable to connect')) {
          console.warn('Heartbeat disabled:', result.error);
          this.adjustHeartbeatFrequency();
          return;
        }
        throw new Error(result.error || 'Heartbeat failed');
      }
    } catch (error) {
      console.error('Heartbeat failed:', error);
      
      // If heartbeat fails due to resource exhaustion, reduce frequency
      if (error instanceof Error && (
        error.message.includes('insufficient resources') ||
        error.message.includes('Rate limit exceeded') ||
        error.message.includes('Unable to connect')
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
    // Skip if tracking is disabled
    if (this.trackingDisabled || !this.isActive) {
      return;
    }

    try {
      const result = await this.makeRequest('/set-status', {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      
      if (!result.success) {
        // Don't throw for rate limiting or connection issues
        if (result.error?.includes('Rate limit exceeded') || 
            result.error?.includes('Unable to connect')) {
          console.warn('Activity status update disabled:', result.error);
          return;
        }
        throw new Error(result.error || 'Failed to set activity status');
      }
    } catch (error) {
      console.error('Failed to set activity status:', error);
      // Don't throw to prevent breaking the app
    }
  }

  /**
   * Get user's online status
   */
  async getUserOnlineStatus(userId: string): Promise<UserOnlineStatus | null> {
    try {
      const response = await this.makeRequest(`/status/${userId}`, {
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
      const response = await this.makeRequest('/bulk-status', {
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
      const response = await this.makeRequest('/online-count', {
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
      const response = await this.makeRequest(`/online-users?limit=${limit}`, {
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

    window.addEventListener('blur', () => {
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
          navigator.sendBeacon(`${this.baseURL}/set-offline`, blob);
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
    
    const isLimited = this.requestCount >= this.maxRequestsPerWindow;
    
    if (isLimited) {
      console.warn(`Rate limit exceeded: ${this.requestCount}/${this.maxRequestsPerWindow} requests in ${this.windowDuration}ms window`);
    }
    
    return isLimited;
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

  private async retryWithBackoff<T>(operation: () => Promise<{ success: boolean; data?: T; error?: string }>, context: string): Promise<{ success: boolean; data?: T; error?: string }> {
    // If tracking is disabled, don't even try
    if (this.trackingDisabled) {
      return { success: false, error: 'Tracking disabled' };
    }

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Check rate limit before making request
        if (this.isRateLimited()) {
          console.warn(`Rate limit reached for ${context}, skipping request`);
          return { success: false, error: 'Rate limit exceeded' };
        }

        this.incrementRequestCount();
        const result = await operation();
        
        // Reset retry attempts on success
        if (result.success) {
          this.retryAttempts = 0;
          return result;
        } else {
          // Don't retry on rate limit or certain errors
          if (result.error?.includes('Rate limit') || result.error?.includes('Unauthorized') || result.error?.includes('Forbidden')) {
            return result;
          }
          throw new Error(result.error || 'Request failed');
        }
      } catch (error: any) {
        const isLastAttempt = attempt === this.maxRetries;
        
        // Don't retry on certain error types
        if (error?.message?.includes('Unauthorized') || error?.message?.includes('Forbidden')) {
          return { success: false, error: error.message };
        }
        
        // Don't retry on network exhaustion errors unless it's not the last attempt
        if (error?.message?.includes('Unable to connect') || error?.message?.includes('insufficient resources')) {
          if (isLastAttempt) {
            console.warn(`${context} failed after ${this.maxRetries} attempts:`, error.message);
            return { success: false, error: error.message };
          }
          
          // Wait longer for resource exhaustion errors
          const delay = this.retryDelay * Math.pow(2, attempt) * 2; // Increased delay
          console.warn(`${context} failed (attempt ${attempt + 1}), retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (isLastAttempt) {
          return { success: false, error: error.message };
        }
        
        // Exponential backoff with longer delays
        const delay = this.retryDelay * Math.pow(2, attempt + 1);
        console.warn(`${context} failed (attempt ${attempt + 1}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return { success: false, error: `Failed after ${this.maxRetries} attempts` };
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

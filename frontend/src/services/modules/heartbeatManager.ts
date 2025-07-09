import { ActivityStatus, OnlineStatusConfig } from '../types/onlineStatus.types';
import { OnlineStatusAPIClient } from '../core/apiClient';

export class HeartbeatManager {
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatFrequency: number;
  private maxHeartbeatFrequency: number;
  private isActive = false;
  private apiClient: OnlineStatusAPIClient;
  private retryWithBackoff: (operation: () => Promise<any>, context: string) => Promise<any>;

  constructor(
    config: OnlineStatusConfig,
    apiClient: OnlineStatusAPIClient,
    retryWithBackoff: (operation: () => Promise<any>, context: string) => Promise<any>
  ) {
    this.heartbeatFrequency = config.heartbeatFrequency;
    this.maxHeartbeatFrequency = config.maxHeartbeatFrequency;
    this.apiClient = apiClient;
    this.retryWithBackoff = retryWithBackoff;
  }

  start(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.isActive = true;
    this.heartbeatInterval = setInterval(() => {
      if (this.isActive) {
        this.sendHeartbeat();
      }
    }, this.heartbeatFrequency);
  }

  stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.isActive = false;
  }

  private async sendHeartbeat(): Promise<void> {
    try {
      const result = await this.retryWithBackoff(async () => {
        return this.apiClient.makeRequest('/heartbeat', {
          method: 'POST',
        });
      }, 'Heartbeat');
      
      if (!result.success) {
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

  private adjustHeartbeatFrequency(): void {
    this.heartbeatFrequency = Math.min(this.heartbeatFrequency * 2, this.maxHeartbeatFrequency);
    
    if (this.isActive && this.heartbeatInterval) {
      this.stop();
      this.start();
    }
  }

  setupVisibilityTracking(setActivityStatus: (status: ActivityStatus) => Promise<void>): void {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setActivityStatus(ActivityStatus.AWAY).catch(console.error);
      } else {
        setActivityStatus(ActivityStatus.ONLINE).catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.addEventListener('focus', () => {
      if (this.isActive) {
        setActivityStatus(ActivityStatus.ONLINE).catch(console.error);
      }
    });

    window.addEventListener('blur', () => {
      if (this.isActive) {
        setActivityStatus(ActivityStatus.AWAY).catch(console.error);
      }
    });

    window.addEventListener('beforeunload', () => {
      if (this.isActive) {
        const data = JSON.stringify({});
        const token = localStorage.getItem('token');
        
        if (token && navigator.sendBeacon) {
          const blob = new Blob([data], { type: 'application/json' });
          navigator.sendBeacon(`${this.apiClient['baseURL']}/set-offline`, blob);
        }
      }
    });
  }
}

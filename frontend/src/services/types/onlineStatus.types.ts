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

export interface OnlineStatusConfig {
  heartbeatFrequency: number;
  maxHeartbeatFrequency: number;
  maxRetries: number;
  retryDelay: number;
  maxRequestsPerWindow: number;
  windowDuration: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

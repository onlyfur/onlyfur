// Main entry point for online status functionality
export { default as onlineStatusAPI } from './onlineStatusAPI';
export { ActivityStatus } from './types/onlineStatus.types';
export type { UserOnlineStatus, OnlineUser, OnlineStatusConfig } from './types/onlineStatus.types';
export { formatLastSeen, getStatusIndicator } from './utils/onlineStatus.utils';

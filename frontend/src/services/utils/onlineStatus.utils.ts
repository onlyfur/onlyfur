import { ActivityStatus } from '../types/onlineStatus.types';

/**
 * Format last seen time for display
 */
export function formatLastSeen(lastSeen?: Date): string {
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
export function getStatusIndicator(status: ActivityStatus, isOnline: boolean): {
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

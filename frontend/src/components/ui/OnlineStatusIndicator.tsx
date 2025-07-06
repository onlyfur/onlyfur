import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { onlineStatusAPI, ActivityStatus, UserOnlineStatus } from '@/services/onlineStatusAPI';

interface OnlineStatusIndicatorProps {
  userId: string;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | 'inline';
}

const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({
  userId,
  className = '',
  showText = false,
  size = 'md',
  position = 'bottom-right'
}) => {
  const [status, setStatus] = useState<UserOnlineStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const userStatus = await onlineStatusAPI.getUserOnlineStatus(userId);
        setStatus(userStatus);
      } catch (error) {
        console.error('Failed to fetch user status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30 * 1000);

    return () => clearInterval(interval);
  }, [userId]);

  if (loading || !status) {
    return null;
  }

  const indicator = onlineStatusAPI.getStatusIndicator(status.activityStatus, status.isOnline);
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const positionClasses = {
    'top-right': 'absolute -top-0.5 -right-0.5',
    'bottom-right': 'absolute -bottom-0.5 -right-0.5',
    'top-left': 'absolute -top-0.5 -left-0.5',
    'bottom-left': 'absolute -bottom-0.5 -left-0.5',
    'inline': 'inline-block'
  };

  const statusDot = (
    <div
      className={`
        ${sizeClasses[size]} 
        ${indicator.color} 
        rounded-full 
        border-2 
        border-white 
        ${positionClasses[position]}
        ${className}
      `}
      title={indicator.text}
    />
  );

  const lastSeenText = status.lastSeen ? onlineStatusAPI.formatLastSeen(status.lastSeen) : '';

  if (showText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <div className={`${sizeClasses[size]} ${indicator.color} rounded-full`} />
              <Badge variant={status.isOnline ? 'default' : 'secondary'} className="text-xs">
                {indicator.text}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">{indicator.text}</div>
              {lastSeenText && (
                <div className="text-muted-foreground">Last seen: {lastSeenText}</div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {statusDot}
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium">{indicator.text}</div>
            {lastSeenText && (
              <div className="text-muted-foreground">Last seen: {lastSeenText}</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OnlineStatusIndicator;

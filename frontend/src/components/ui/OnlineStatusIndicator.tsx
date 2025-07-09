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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let fetchInterval: NodeJS.Timeout | null = null;
    let errorCount = 0;
    const maxErrors = 3;

    const fetchStatus = async () => {
      // Skip fetch if component is unmounted or not visible
      if (!isMounted || !isVisible) return;
      
      // Skip if too many consecutive errors
      if (errorCount >= maxErrors) {
        console.warn('Too many errors fetching user status, stopping requests');
        return;
      }
      
      try {
        const userStatus = await onlineStatusAPI.getUserOnlineStatus(userId);
        if (isMounted) {
          setStatus(userStatus);
          errorCount = 0; // Reset error count on success
        }
      } catch (error) {
        errorCount++;
        
        // Only log errors in development to prevent console spam
        if ((import.meta as any).env?.DEV && errorCount <= 2) {
          console.error('Failed to fetch user status:', error);
        }
        
        // Set offline status on error to prevent continuous retries
        if (isMounted) {
          setStatus({
            isOnline: false,
            activityStatus: ActivityStatus.OFFLINE,
            lastSeen: new Date()
          });
        }
        
        // If too many errors, clear the interval
        if (errorCount >= maxErrors && fetchInterval) {
          clearInterval(fetchInterval);
          fetchInterval = null;
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Check page visibility to pause requests when tab is not active
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial fetch
    fetchStatus();

    // Only set up polling if in development or for own profile
    const isOwnProfile = userId === localStorage.getItem('onlyfur_user_id');
    if ((import.meta as any).env?.DEV || isOwnProfile) {
      // Refresh status every 60 seconds (reduced from 30 to limit API calls)
      fetchInterval = setInterval(fetchStatus, 60 * 1000);
    }

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, [userId, isVisible]);

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
        ${positionClasses[position]}
        ${className}
        border-2 border-white dark:border-gray-900
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
              <Badge variant={status.isOnline ? 'default' : 'secondary'} className={`text-xs ${className}`}>
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

  if (position === 'inline') {
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

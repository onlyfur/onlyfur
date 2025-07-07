import React, { useState, useEffect } from 'react';
import { Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { hasValidAuthSession, isSessionNearExpiration, getRememberMe } from '../../utils/cookieUtils';

interface SessionStatus {
  isValid: boolean;
  isNearExpiration: boolean;
  rememberMe: boolean;
  lastCheck: Date;
}

interface SessionMonitorProps {
  showIndicator?: boolean;
  className?: string;
}

const SessionMonitor: React.FC<SessionMonitorProps> = ({ 
  showIndicator = true, 
  className = '' 
}) => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    isValid: false,
    isNearExpiration: false,
    rememberMe: false,
    lastCheck: new Date()
  });

  const checkSessionStatus = () => {
    const isValid = hasValidAuthSession();
    const isNearExpiration = isSessionNearExpiration();
    const rememberMe = getRememberMe();

    setSessionStatus({
      isValid,
      isNearExpiration,
      rememberMe,
      lastCheck: new Date()
    });

    // Auto-refresh token if near expiration
    if (isValid && isNearExpiration) {
      authService.refreshAuthToken().catch(console.error);
    }
  };

  useEffect(() => {
    // Initial check
    checkSessionStatus();

    // Set up periodic checking
    const interval = setInterval(checkSessionStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (!showIndicator || !sessionStatus.isValid) {
    return null;
  }

  const getStatusIcon = () => {
    if (sessionStatus.isNearExpiration) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (sessionStatus.isNearExpiration) {
      return 'Session expiring soon';
    }
    return sessionStatus.rememberMe ? 'Session saved' : 'Session active';
  };

  const getStatusColor = () => {
    if (sessionStatus.isNearExpiration) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
    return 'bg-green-50 border-green-200 text-green-800';
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-md border text-sm ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {sessionStatus.rememberMe && (
        <Shield className="h-3 w-3" />
      )}
    </div>
  );
};

export default SessionMonitor;

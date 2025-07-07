import React, { useState, useEffect } from 'react';
import { Shield, Clock, Settings, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { authService } from '../../services/authService';
import { getRememberMe, hasValidAuthSession, getSessionTimestamp } from '../../utils/cookieUtils';

interface LoginPersistenceSettingsProps {
  className?: string;
}

const LoginPersistenceSettings: React.FC<LoginPersistenceSettingsProps> = ({ className = '' }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{
    isActive: boolean;
    timestamp: number | null;
    savedEmail: string | null;
  }>({
    isActive: false,
    timestamp: null,
    savedEmail: null
  });

  const updateSessionInfo = () => {
    const isActive = hasValidAuthSession();
    const timestamp = getSessionTimestamp();
    const savedEmail = authService.getSavedEmail();
    const remember = getRememberMe();

    setRememberMe(remember);
    setSessionInfo({
      isActive,
      timestamp,
      savedEmail
    });
  };

  useEffect(() => {
    updateSessionInfo();
    
    // Update every 30 seconds
    const interval = setInterval(updateSessionInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRememberMeChange = async (checked: boolean) => {
    if (sessionInfo.isActive) {
      // Update current session
      const token = authService.getSession();
      const user = authService.getStoredUser();
      const refreshToken = authService.getRefreshTokenValue();
      
      if (token && user) {
        authService.setSession(token, checked, refreshToken || undefined, user);
        setRememberMe(checked);
        updateSessionInfo();
      }
    }
  };

  const clearSavedData = () => {
    authService.clearSavedCredentials();
    updateSessionInfo();
  };

  const getSessionDuration = () => {
    if (!sessionInfo.timestamp) return 'Unknown';
    
    const now = Date.now();
    const elapsed = now - sessionInfo.timestamp;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Shield className="w-5 h-5 mr-2" />
          Login Persistence Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Session Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${sessionInfo.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {sessionInfo.isActive ? 'Session Active' : 'No Active Session'}
            </span>
          </div>
          {sessionInfo.isActive && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {getSessionDuration()}
            </Badge>
          )}
        </div>

        {/* Remember Me Setting */}
        {sessionInfo.isActive && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex flex-col">
              <span className="font-medium">Remember Me</span>
              <span className="text-sm text-gray-600">
                Keep me logged in for 30 days
              </span>
            </div>
            <Switch
              checked={rememberMe}
              onCheckedChange={handleRememberMeChange}
            />
          </div>
        )}

        {/* Saved Email */}
        {sessionInfo.savedEmail && (
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex flex-col">
              <span className="font-medium">Saved Email</span>
              <span className="text-sm text-gray-600">
                {sessionInfo.savedEmail}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearSavedData}
            >
              Clear
            </Button>
          </div>
        )}

        {/* Security Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Security Information</p>
              <ul className="space-y-1 text-xs">
                <li>• Login sessions are encrypted and stored securely</li>
                <li>• Passwords are never saved in browser storage</li>
                <li>• Sessions automatically expire for security</li>
                <li>• Tokens are refreshed automatically when needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Session Details */}
        {sessionInfo.isActive && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>Session Type: {rememberMe ? 'Persistent (30 days)' : 'Browser Session'}</p>
            <p>Storage: Secure HTTP Cookies with fallback</p>
            <p>Auto-refresh: Enabled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginPersistenceSettings;

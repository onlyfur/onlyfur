import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { User, Shield, Clock, Key, RefreshCw, AlertTriangle } from 'lucide-react';
import { authService } from '../../services/authService';
import { hasValidAuthSession, isSessionNearExpiration, getRememberMe, getSessionTimestamp } from '../../utils/cookieUtils';
import SessionMonitor from './SessionMonitor';

const AuthStatus: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sessionInfo, setSessionInfo] = useState({
    hasValidSession: false,
    isNearExpiration: false,
    rememberMe: false,
    timestamp: null as number | null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const sessionToken = authService.getSession();
  const savedEmail = authService.getSavedEmail();

  const updateSessionInfo = () => {
    setSessionInfo({
      hasValidSession: hasValidAuthSession(),
      isNearExpiration: isSessionNearExpiration(),
      rememberMe: getRememberMe(),
      timestamp: getSessionTimestamp()
    });
  };

  useEffect(() => {
    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      await authService.refreshAuthToken();
      updateSessionInfo();
    } catch (error) {
      console.error('Token refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
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

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-500" />
            Not Authenticated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">You are not currently logged in.</p>
          {savedEmail && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-xs font-medium mb-1">Saved Email Found:</p>
              <p className="text-xs text-muted-foreground">{savedEmail}</p>
              <p className="text-xs text-muted-foreground mt-1">
                (Password not saved for security)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-green-500" />
            Authentication Status
          </div>
          <SessionMonitor showIndicator={true} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">User Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{user?.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Username:</span>
              <span>@{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span>Role:</span>
              <Badge variant={user?.role === 'creator' ? 'default' : 'secondary'}>
                {user?.role}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Auth Provider:</span>
              <Badge variant="secondary">
                {user?.authProvider || 'email'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Session Information */}
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            Session Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={sessionInfo.hasValidSession ? 'success' : 'destructive'}>
                {sessionInfo.hasValidSession ? 'Active' : 'Invalid'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span>{sessionInfo.rememberMe ? 'Persistent' : 'Session'}</span>
            </div>
            <div className="flex justify-between">
              <span>Started:</span>
              <span>{getSessionDuration()}</span>
            </div>
            {sessionInfo.isNearExpiration && (
              <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-yellow-800 text-xs">Session expiring soon</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRefreshToken}
                  disabled={isRefreshing}
                  className="text-xs"
                >
                  {isRefreshing ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Token Information */}
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <Key className="w-4 h-4 mr-1" />
            Security Status
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Token:</span>
              <Badge variant={sessionToken ? 'success' : 'destructive'}>
                {sessionToken ? 'Present' : 'Missing'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Storage:</span>
              <span>Secure Cookies</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-refresh:</span>
              <Badge variant="success">Enabled</Badge>
            </div>
          </div>
        </div>

        {/* Saved Preferences */}
        {savedEmail && (
          <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
            <h4 className="font-medium mb-2 text-sm">Saved Preferences</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="text-xs font-medium mb-1">Email: {savedEmail}</p>
              <p>Password: Not saved (secure)</p>
              <p>Remember: {sessionInfo.rememberMe ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => logout()} 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            Logout
          </Button>
          {sessionInfo.hasValidSession && (
            <Button
              onClick={handleRefreshToken}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthStatus;

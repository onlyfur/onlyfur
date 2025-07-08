import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { authService } from '../../services/authService';
import { hasValidAuthSession, getSessionTimestamp } from '../../utils/cookieUtils';

const AuthDebugger: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  const refreshDebugInfo = () => {
    const token = authService.getSession();
    const storedUser = authService.getStoredUser();
    const sessionValid = hasValidAuthSession();
    const sessionTimestamp = getSessionTimestamp();
    const shouldAutoLogin = authService.shouldAttemptAutoLogin();

    setDebugInfo({
      token: token ? 'Present' : 'Missing',
      tokenLength: token?.length || 0,
      storedUser: storedUser ? 'Present' : 'Missing',
      sessionValid,
      sessionTimestamp: sessionTimestamp ? new Date(sessionTimestamp).toLocaleString() : 'None',
      shouldAutoLogin,
      userFromContext: user ? 'Present' : 'Missing',
      isAuthenticated,
      isLoading,
      localStorage: {
        hasToken: !!localStorage.getItem('onlyfur_auth_token'),
        hasUser: !!localStorage.getItem('onlyfur_user_data'),
        hasRememberMe: !!localStorage.getItem('onlyfur_remember_me'),
      }
    });
  };

  useEffect(() => {
    refreshDebugInfo();
    const interval = setInterval(refreshDebugInfo, 2000);
    return () => clearInterval(interval);
  }, [user, isAuthenticated, isLoading]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Authentication Debug Info
          <Button onClick={refreshDebugInfo} size="sm">Refresh</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Auth Context</h4>
            <div className="space-y-1 text-sm">
              <div>
                isAuthenticated: <Badge variant={isAuthenticated ? "default" : "destructive"}>
                  {isAuthenticated.toString()}
                </Badge>
              </div>
              <div>
                isLoading: <Badge variant={isLoading ? "secondary" : "default"}>
                  {isLoading.toString()}
                </Badge>
              </div>
              <div>
                User: <Badge variant={user ? "default" : "destructive"}>
                  {user ? user.email : 'None'}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Session Storage</h4>
            <div className="space-y-1 text-sm">
              <div>
                Token: <Badge variant={debugInfo.token === 'Present' ? "default" : "destructive"}>
                  {debugInfo.token} ({debugInfo.tokenLength} chars)
                </Badge>
              </div>
              <div>
                Stored User: <Badge variant={debugInfo.storedUser === 'Present' ? "default" : "destructive"}>
                  {debugInfo.storedUser}
                </Badge>
              </div>
              <div>
                Session Valid: <Badge variant={debugInfo.sessionValid ? "default" : "destructive"}>
                  {debugInfo.sessionValid?.toString()}
                </Badge>
              </div>
              <div>
                Should Auto Login: <Badge variant={debugInfo.shouldAutoLogin ? "default" : "secondary"}>
                  {debugInfo.shouldAutoLogin?.toString()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">LocalStorage</h4>
          <div className="text-sm space-y-1">
            <div>
              Token: <Badge variant={debugInfo.localStorage?.hasToken ? "default" : "destructive"}>
                {debugInfo.localStorage?.hasToken ? 'Present' : 'Missing'}
              </Badge>
            </div>
            <div>
              User: <Badge variant={debugInfo.localStorage?.hasUser ? "default" : "destructive"}>
                {debugInfo.localStorage?.hasUser ? 'Present' : 'Missing'}
              </Badge>
            </div>
            <div>
              Remember Me: <Badge variant={debugInfo.localStorage?.hasRememberMe ? "default" : "secondary"}>
                {debugInfo.localStorage?.hasRememberMe ? 'True' : 'False'}
              </Badge>
            </div>
          </div>
        </div>

        {debugInfo.sessionTimestamp && (
          <div>
            <h4 className="font-semibold mb-2">Session Info</h4>
            <div className="text-sm">
              Last Session: {debugInfo.sessionTimestamp}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebugger;

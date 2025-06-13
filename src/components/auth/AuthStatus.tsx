import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Shield, Clock, Key } from 'lucide-react';
import { authService } from '@/services/authService';

const AuthStatus: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const sessionToken = authService.getSession();
  const savedCredentials = authService.getSavedCredentials();

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
          {savedCredentials && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-xs font-medium mb-1">Saved Credentials Found:</p>
              <p className="text-xs text-muted-foreground">{savedCredentials.email}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2 text-green-500" />
          Authentication Status
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
              <Badge variant="outline-solid">
                {user?.authProvider}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Verified:</span>
              <Badge variant={user?.isVerified ? 'default' : 'destructive'}>
                {user?.isVerified ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <Key className="w-4 h-4 mr-2" />
            Session Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Token Status:</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span>Session ID:</span>
              <span className="text-xs font-mono">{sessionToken?.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {savedCredentials && (
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Saved Credentials
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-xs font-medium mb-1">Email: {savedCredentials.email}</p>
              <p className="text-xs text-muted-foreground">Password: •••••••••</p>
            </div>
          </div>
        )}

        <Button 
          onClick={logout} 
          variant="destructive" 
          size="sm" 
          className="w-full"
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthStatus;

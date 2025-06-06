import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Key, Clock } from 'lucide-react';

interface AutoLoginPromptProps {
  onAutoLogin?: () => void;
  redirectPath?: string;
}

const AutoLoginPrompt: React.FC<AutoLoginPromptProps> = ({
  onAutoLogin,
  redirectPath = '/dashboard'
}) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [savedCredentials, setSavedCredentials] = useState<{ email: string; password: string; lastUsed?: string } | null>(null);
  const [isAutoLogging, setIsAutoLogging] = useState(false);

  useEffect(() => {
    // Check for saved credentials
    const credentials = authService.getSavedCredentials();
    if (credentials) {
      setSavedCredentials(credentials);
    }
  }, []);

  const handleAutoLogin = async () => {
    if (!savedCredentials) return;

    setIsAutoLogging(true);
    try {
      await login(savedCredentials.email, savedCredentials.password, true);
      
      toast({
        title: "Welcome back!",
        description: "You've been automatically signed in with your saved credentials.",
      });

      // Automatic redirect
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1000);

      if (onAutoLogin) {
        onAutoLogin();
      }
      
    } catch (error) {
      console.error('Auto-login failed:', error);
      toast({
        title: "Auto-login failed",
        description: "Please sign in manually.",
        variant: "destructive",
      });
    } finally {
      setIsAutoLogging(false);
    }
  };

  const handleDismiss = () => {
    setSavedCredentials(null);
  };

  if (!savedCredentials) return null;

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Key className="w-4 h-4 mr-2 text-blue-600" />
          Quick Sign In Available
        </CardTitle>
        <CardDescription className="text-xs">
          We found saved credentials for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert className="border-blue-300 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30">
          <User className="w-4 h-4" />
          <AlertDescription className="text-sm">
            <strong>{savedCredentials.email}</strong>
            {savedCredentials.lastUsed && (
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                Last used: {new Date(savedCredentials.lastUsed).toLocaleDateString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAutoLogin} 
            disabled={isAutoLogging}
            size="sm"
            className="flex-1"
          >
            {isAutoLogging ? 'Signing in...' : 'Sign in automatically'}
          </Button>
          <Button 
            onClick={handleDismiss} 
            variant="outline" 
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoLoginPrompt;

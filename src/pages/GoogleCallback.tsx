import React, { useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(true);
  const [redirectPath, setRedirectPath] = React.useState('/dashboard');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Google OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        // Parse state parameter to determine user type and redirect path
        let userType: 'creator' | 'subscriber' = 'subscriber';
        let targetPath = '/dashboard';
        
        if (state) {
          try {
            const stateData = JSON.parse(decodeURIComponent(state));
            userType = stateData.userType || 'subscriber';
            targetPath = stateData.redirectPath || '/dashboard';
          } catch (e) {
            console.warn('Failed to parse state parameter:', e);
          }
        }

        // Exchange code for user credentials
        await loginWithGoogle(code, userType); // removed third argument
        
        setRedirectPath(targetPath);
        
        toast({
          title: "Login Successful",
          description: `Welcome back! You've been logged in as a ${userType}.`,
        });
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        toast({
          title: "Authentication Failed",
          description: error instanceof Error ? error.message : "Failed to complete Google authentication",
          variant: "destructive",
        });
        setRedirectPath('/login?error=oauth_failed');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, loginWithGoogle, toast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Completing Google Authentication...</h2>
          <p className="text-muted-foreground">Please wait while we log you in.</p>
        </div>
      </div>
    );
  }

  return <Navigate to={redirectPath} replace />;
};

export default GoogleCallback;

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { parseJWT } from '@/lib/googleAuth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL params
        const error = searchParams.get('error');
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        // Check for credential in URL params (for popup flow)
        const credential = searchParams.get('credential');
        if (credential) {
          await processGoogleCredential(credential);
          return;
        }

        // Check for authorization code (for redirect flow)
        const code = searchParams.get('code');
        if (code) {
          await processAuthCode(code);
          return;
        }

        // Check if this is a popup callback
        if (window.opener) {
          // This is a popup, send message to parent
          const urlParams = new URLSearchParams(window.location.search);
          const credential = urlParams.get('credential');
          
          if (credential) {
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_SUCCESS',
              credential: credential
            }, window.location.origin);
          } else {
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_ERROR',
              error: 'No credential received'
            }, window.location.origin);
          }
          
          window.close();
          return;
        }

        // No valid parameters found
        setStatus('error');
        setMessage('No authentication data received');
        
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams]);

  const processGoogleCredential = async (credential: string) => {
    try {
      setMessage('Processing Google authentication...');
      
      // Parse the JWT to get user info
      const userInfo = parseJWT(credential);
      if (!userInfo) {
        throw new Error('Invalid credential format');
      }

      // Determine user type (could be from state parameter or default to subscriber)
      const userType = searchParams.get('userType') as 'creator' | 'subscriber' || 'subscriber';
      
      // Use the auth context to login with Google
      await loginWithGoogle(credential, userType);
      
      setStatus('success');
      setMessage('Authentication successful! Redirecting...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error('Google credential processing error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to process Google authentication');
    }
  };

  const processAuthCode = async (code: string) => {
    try {
      setMessage('Exchanging authorization code...');
      
      // In a real implementation, you would exchange the code for tokens on your backend
      // For now, we'll just show an error as this flow isn't fully implemented
      throw new Error('Authorization code flow not implemented yet. Please use the direct credential flow.');
      
    } catch (error) {
      console.error('Auth code processing error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to process authorization code');
    }
  };

  const handleRetry = () => {
    navigate('/login', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-gray-800 shadow-lg">
            {getStatusIcon()}
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>
          
          <p className={`mt-2 text-sm ${getStatusColor()}`}>
            {message}
          </p>
        </div>

        {status === 'error' && (
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            
            <button
              onClick={handleGoHome}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Home
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Please wait while we verify your credentials...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You will be redirected to your dashboard shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

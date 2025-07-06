import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OAuthDebugger: React.FC = () => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  // Get current environment info
  const currentDomain = window.location.origin;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const expectedRedirectUri = `${currentDomain}/auth/callback/google`;

  // Environment checks
  const checks = [
    {
      name: 'Google Client ID',
      status: clientId && clientId !== 'your_actual_google_client_id_here' ? 'success' : 'error',
      value: clientId || 'Not set',
      description: clientId ? 'Client ID is configured' : 'Missing VITE_GOOGLE_CLIENT_ID environment variable'
    },
    {
      name: 'Current Domain',
      status: 'info',
      value: currentDomain,
      description: 'This is your current domain that should be in Google Console'
    },
    {
      name: 'Expected Redirect URI',
      status: 'info',
      value: expectedRedirectUri,
      description: 'This exact URI must be in your Google Console Authorized Redirect URIs'
    },
    {
      name: 'OAuth Route',
      status: 'success',
      value: '/auth/callback/google',
      description: 'OAuth callback route is properly configured in the app'
    }
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    });
  };

  const testOAuthFlow = () => {
    setIsChecking(true);
    
    if (!clientId || clientId === 'your_actual_google_client_id_here') {
      toast({
        title: 'Cannot Test',
        description: 'Google Client ID is not configured',
        variant: 'destructive'
      });
      setIsChecking(false);
      return;
    }

    // Simulate OAuth test
    setTimeout(() => {
      const state = encodeURIComponent(JSON.stringify({
        userType: 'subscriber',
        redirectPath: '/dashboard',
        mode: 'login',
        test: true
      }));

      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      googleAuthUrl.searchParams.append('client_id', clientId);
      googleAuthUrl.searchParams.append('redirect_uri', expectedRedirectUri);
      googleAuthUrl.searchParams.append('response_type', 'code');
      googleAuthUrl.searchParams.append('scope', 'openid email profile');
      googleAuthUrl.searchParams.append('state', state);
      googleAuthUrl.searchParams.append('access_type', 'offline');
      googleAuthUrl.searchParams.append('prompt', 'consent');

      window.open(googleAuthUrl.toString(), '_blank');
      setIsChecking(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Google OAuth Configuration Debugger
          </CardTitle>
          <CardDescription>
            Use this tool to diagnose and fix Google OAuth issues like "redirect_uri_mismatch"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Configuration Status</h3>
            <div className="space-y-3">
              {checks.map((check) => (
                <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="font-medium">{check.name}</div>
                      <div className="text-sm text-muted-foreground">{check.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono max-w-xs truncate">
                      {check.value}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(check.value, check.name)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Console Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Required Google Console Configuration</h3>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Add these EXACT values to your Google Cloud Console OAuth 2.0 Client ID configuration:
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Authorized JavaScript Origins:</label>
                <div className="mt-1 p-3 bg-muted rounded-lg font-mono text-sm">
                  {currentDomain}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => copyToClipboard(currentDomain, 'JavaScript Origin')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Authorized Redirect URIs:</label>
                <div className="mt-1 p-3 bg-muted rounded-lg font-mono text-sm">
                  {expectedRedirectUri}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => copyToClipboard(expectedRedirectUri, 'Redirect URI')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={testOAuthFlow} disabled={isChecking}>
              <ExternalLink className="h-4 w-4 mr-2" />
              {isChecking ? 'Testing...' : 'Test OAuth Flow'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Google Console
            </Button>
            
            <Button
              variant="outline"
              onClick={() => copyToClipboard(`
Authorized JavaScript Origins:
${currentDomain}

Authorized Redirect URIs:
${expectedRedirectUri}

Environment Variables:
VITE_GOOGLE_CLIENT_ID=${clientId}
              `, 'Complete Configuration')}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All Config
            </Button>
          </div>

          {/* Common Errors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Common Error Solutions</h3>
            <div className="space-y-2">
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>redirect_uri_mismatch:</strong> The redirect URI in your Google Console doesn't match exactly. 
                  Copy the exact URI above: <code>{expectedRedirectUri}</code>
                </AlertDescription>
              </Alert>
              
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>invalid_client:</strong> Your Google Client ID is incorrect or not set. 
                  Check your environment variables.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>access_denied:</strong> Your app might be in testing mode. 
                  Either publish your app or add test users in Google Console.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthDebugger;

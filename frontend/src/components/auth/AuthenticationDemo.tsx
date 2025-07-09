import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import SessionMonitor from './SessionMonitor';
import AuthStatus from './AuthStatus';
import LoginPersistenceSettings from './LoginPersistenceSettings';
import AuthenticationSummary from './AuthenticationSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Shield, Settings, Info, TestTube } from 'lucide-react';

/**
 * Enhanced Authentication Demo Page
 * 
 * This component demonstrates all the new authentication features
 * and can be used as a testing/admin interface for the auth system.
 */
const AuthenticationDemo: React.FC = () => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  const handleTestLogin = async () => {
    if (!isAuthenticated) {
      try {
        await login('test@example.com', 'any-password', true);
      } catch (error) {
        console.error('Test login failed:', error);
      }
    }
  };

  const handleTestLogout = async () => {
    if (isAuthenticated) {
      logout();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading authentication system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Session Monitor */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authentication System</h1>
          <p className="text-gray-600">Enhanced login persistence and security features</p>
        </div>
        <SessionMonitor showIndicator={true} />
      </div>

      {/* Quick Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Quick Test Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          {!isAuthenticated ? (
            <Button onClick={handleTestLogin} className="bg-green-600 hover:bg-green-700">
              Test Login (Mock User)
            </Button>
          ) : (
            <Button onClick={handleTestLogout} variant="outline">
              Test Logout
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).testAuthSystem) {
                (window as any).testAuthSystem();
              } else {
                console.log('Run the browser-auth-test.js script first');
              }
            }}
          >
            Run Browser Tests
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status" className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Status
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <AuthStatus />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <LoginPersistenceSettings />
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <AuthenticationSummary />
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <h3>Using the Enhanced Authentication System</h3>
                
                <h4>1. Basic Authentication Check</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm">
{`import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <div>Welcome, {user.displayName}!</div>;
}`}
                </pre>

                <h4>2. Session Monitoring</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm">
{`import SessionMonitor from '../components/auth/SessionMonitor';

function Header() {
  return (
    <header>
      <SessionMonitor showIndicator={true} />
    </header>
  );
}`}
                </pre>

                <h4>3. Authentication Status Display</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm">
{`import AuthStatus from '../components/auth/AuthStatus';

function ProfilePage() {
  return (
    <div>
      <AuthStatus />
      {/* Other profile content */}
    </div>
  );
}`}
                </pre>

                <h4>4. Login Persistence Settings</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm">
{`import LoginPersistenceSettings from '../components/auth/LoginPersistenceSettings';

function SettingsPage() {
  return (
    <div>
      <LoginPersistenceSettings />
    </div>
  );
}`}
                </pre>

                <h4>5. Testing</h4>
                <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                  <p><strong>Browser Console Testing:</strong></p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open browser developer tools</li>
                    <li>Copy and paste the content of <code>browser-auth-test.js</code></li>
                    <li>Run <code>testAuthSystem()</code> for comprehensive tests</li>
                    <li>Run <code>testMockLogin()</code> for login flow testing</li>
                  </ol>
                </div>

                <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                  <p><strong>PowerShell Testing:</strong></p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open PowerShell in project directory</li>
                    <li>Run <code>.\test-auth-enhanced.ps1 -Verbose</code></li>
                    <li>Check test results and summary</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">🎉 Enhanced Authentication System Active</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium">Security Features:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>No password storage</li>
                  <li>Secure session management</li>
                  <li>Automatic token refresh</li>
                  <li>Session validation</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Reliability Features:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Storage fallbacks</li>
                  <li>Offline support</li>
                  <li>Background refresh</li>
                  <li>Error recovery</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">User Experience:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Seamless persistence</li>
                  <li>Visual feedback</li>
                  <li>Remember me option</li>
                  <li>Status transparency</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthenticationDemo;

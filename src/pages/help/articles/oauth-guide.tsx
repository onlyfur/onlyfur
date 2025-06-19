import React from 'react';
import { ArrowLeft, Shield, Key, Chrome, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const OAuthGuide: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Google OAuth Guide</h1>
            <p className="text-muted-foreground">Use Google Sign-In for convenient and secure access to OnlyFur</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Authentication</Badge>
          <Badge variant="secondary">Security</Badge>
          <Badge variant="secondary">Google</Badge>
        </div>
      </div>

      {/* What is OAuth */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            What is Google OAuth?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Google OAuth is a secure authentication system that allows you to sign into OnlyFur using your existing Google account. 
            This means you don't need to create a separate password for OnlyFur - you can use your Google credentials.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">Benefits:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>No need to remember another password</li>
                <li>Enhanced security through Google's protection</li>
                <li>Faster login process</li>
                <li>Two-factor authentication support</li>
                <li>Account recovery through Google</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">How it works:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Click "Sign in with Google"</li>
                <li>Redirected to Google's secure login</li>
                <li>Grant permission to OnlyFur</li>
                <li>Automatically signed into your account</li>
                <li>Your Google password stays private</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Process */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Setting Up Google OAuth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">For New Users</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Visit OnlyFur Registration</p>
                  <p className="text-sm text-muted-foreground">Go to the OnlyFur sign-up page</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Click "Sign up with Google"</p>
                  <p className="text-sm text-muted-foreground">Look for the Google sign-in button</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Choose Your Google Account</p>
                  <p className="text-sm text-muted-foreground">Select the Google account you want to use</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Grant Permissions</p>
                  <p className="text-sm text-muted-foreground">Allow OnlyFur to access your basic profile information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <p className="font-medium">Complete Your Profile</p>
                  <p className="text-sm text-muted-foreground">Add any additional information required for OnlyFur</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">For Existing Users</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Go to Account Settings</p>
                  <p className="text-sm text-muted-foreground">Navigate to your account security settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Link Google Account</p>
                  <p className="text-sm text-muted-foreground">Click "Connect Google Account" in the login methods section</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Authenticate with Google</p>
                  <p className="text-sm text-muted-foreground">Complete the Google authentication process</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Verify Connection</p>
                  <p className="text-sm text-muted-foreground">Confirm that your Google account is now linked</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What Information Does OnlyFur Access?</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              OnlyFur only requests the minimum necessary information and never accesses your Google password or private data.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-3">Information We Access:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Email address (for account identification)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Name (for profile display)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Profile picture (optional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Google account ID (for authentication)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-600 mb-3">What We DON'T Access:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Your Google password</span>
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Gmail messages or content</span>
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Google Drive files</span>
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Other Google services data</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Troubleshooting OAuth Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Common Issues and Solutions:</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">OAuth Popup Blocked</h4>
                <p className="text-sm text-muted-foreground">Enable popups for OnlyFur in your browser settings</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Account Already Exists</h4>
                <p className="text-sm text-muted-foreground">If you already have an OnlyFur account with the same email, you'll need to link it in account settings</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Permission Denied</h4>
                <p className="text-sm text-muted-foreground">Make sure you click "Allow" when Google asks for permission to share your information</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Multiple Google Accounts</h4>
                <p className="text-sm text-muted-foreground">If you have multiple Google accounts, make sure you select the correct one during authentication</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Security Considerations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Best Practices:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Keep your Google account secure with a strong password</li>
              <li>Enable two-factor authentication on your Google account</li>
              <li>Regularly review connected applications in your Google account settings</li>
              <li>Log out of OnlyFur when using shared computers</li>
              <li>Monitor your account for any suspicious activity</li>
            </ul>
          </div>

          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              You can manage or revoke OnlyFur's access to your Google account at any time through your 
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                Google Account Settings
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Related Help Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/help/articles/account-security" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Account Security</h4>
              <p className="text-sm text-muted-foreground">Best practices for account protection</p>
            </Link>
            <Link to="/help/articles/login-troubleshooting" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Login Troubleshooting</h4>
              <p className="text-sm text-muted-foreground">Resolve common login issues</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthGuide;

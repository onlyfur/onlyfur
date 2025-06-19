import React from 'react';
import { ArrowLeft, Shield, Smartphone, Key, Lock, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const TwoFactorAuthentication: React.FC = () => {
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
            <h1 className="text-3xl font-bold">Two-Factor Authentication</h1>
            <p className="text-muted-foreground">Set up 2FA for enhanced account protection and security</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Security</Badge>
          <Badge variant="secondary">Authentication</Badge>
          <Badge variant="secondary">Account Protection</Badge>
        </div>
      </div>

      {/* Why Use 2FA */}
      <Alert className="mb-8 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Highly Recommended:</strong> Two-factor authentication significantly increases your account security by requiring a second verification step beyond your password.
        </AlertDescription>
      </Alert>

      {/* What is 2FA */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            What is Two-Factor Authentication?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Two-Factor Authentication (2FA) adds an extra layer of security to your OnlyFur account. Even if someone gets your password, 
            they still can't access your account without the second authentication factor.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-3">How it protects you:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Prevents unauthorized access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Protects against password theft</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Secures your earnings and content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Alerts you to login attempts</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-3">Types available:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Authenticator app (recommended)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">SMS text messages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Backup codes</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Setting Up Authenticator App (Recommended)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              <strong>Step 0:</strong> Download an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator on your smartphone.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium">Go to Account Security Settings</p>
                <p className="text-sm text-muted-foreground">Navigate to Settings &gt; Security &gt; Two-Factor Authentication</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium">Choose "Authenticator App"</p>
                <p className="text-sm text-muted-foreground">Select the authenticator app option from the available methods</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium">Scan the QR Code</p>
                <p className="text-sm text-muted-foreground">Use your authenticator app to scan the QR code displayed on screen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <p className="font-medium">Enter Verification Code</p>
                <p className="text-sm text-muted-foreground">Type the 6-digit code from your authenticator app to verify setup</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
              <div>
                <p className="font-medium">Save Backup Codes</p>
                <p className="text-sm text-muted-foreground">Download and securely store your backup recovery codes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Setup */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Setting Up SMS Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Note:</strong> SMS 2FA is less secure than authenticator apps and requires cell service. Use authenticator apps when possible.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium">Go to Security Settings</p>
                <p className="text-sm text-muted-foreground">Navigate to your account security section</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium">Choose "SMS/Text Message"</p>
                <p className="text-sm text-muted-foreground">Select SMS as your 2FA method</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium">Enter Phone Number</p>
                <p className="text-sm text-muted-foreground">Provide a valid mobile phone number</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <p className="font-medium">Verify with Test Code</p>
                <p className="text-sm text-muted-foreground">Enter the verification code sent to your phone</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Using 2FA */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Using Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Daily Login Process</h3>
            <p className="text-muted-foreground mb-4">
              Once 2FA is enabled, you'll need to complete these steps every time you log in:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Enter your username and password</p>
                  <p className="text-sm text-muted-foreground">Complete the normal login process</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Get your verification code</p>
                  <p className="text-sm text-muted-foreground">Open your authenticator app or check your SMS</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Enter the 6-digit code</p>
                  <p className="text-sm text-muted-foreground">Type the current code from your 2FA method</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Codes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Backup Recovery Codes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Important:</strong> Save your backup codes in a secure location. They're your only way to access your account if you lose your authenticator device.
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="font-semibold mb-3">What are backup codes?</h3>
            <p className="text-muted-foreground mb-4">
              Backup codes are one-time use codes that can replace your authenticator app if you lose access to your device.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Best practices:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Store in a password manager</li>
                  <li>Keep a printed copy in a safe place</li>
                  <li>Don't store on the same device</li>
                  <li>Generate new codes if compromised</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">When to use:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Lost or broken phone</li>
                  <li>Authenticator app deleted</li>
                  <li>No cell service for SMS</li>
                  <li>Emergency account access</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Troubleshooting 2FA Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Authenticator Code Not Working</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Check that your device's time is correct</li>
                <li>• Make sure you're using the latest code</li>
                <li>• Try refreshing the authenticator app</li>
                <li>• Use a backup code if available</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Not Receiving SMS Codes</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Check your phone signal strength</li>
                <li>• Verify your phone number is correct</li>
                <li>• Check if SMS is blocked from OnlyFur</li>
                <li>• Try switching to authenticator app</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Lost Access to All 2FA Methods</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Use your saved backup codes</li>
                <li>• Contact OnlyFur support with proof of identity</li>
                <li>• Provide account verification information</li>
                <li>• Be prepared for additional security checks</li>
              </ul>
            </div>
          </div>
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
            <Link to="/help/articles/password-reset" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Password Reset Guide</h4>
              <p className="text-sm text-muted-foreground">Learn how to reset your password</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuthentication;

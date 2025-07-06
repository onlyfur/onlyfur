import React from 'react';
import { ArrowLeft, Mail, CheckCircle, Clock, AlertTriangle, Smartphone, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const EmailVerification: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Email Verification</h1>
            <p className="text-muted-foreground">Verify your email address for account security and full platform access</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Account Setup</Badge>
          <Badge variant="secondary">Security</Badge>
          <Badge variant="secondary">Verification</Badge>
        </div>
      </div>

      {/* Why Verify */}
      <Alert className="mb-8 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Important:</strong> Email verification is required for account security, password recovery, and receiving important notifications.
        </AlertDescription>
      </Alert>

      {/* Benefits */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Why Verify Your Email?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Email verification is a crucial security step that protects your OnlyFur account and enables important features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-3">Security Benefits:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Secure password reset capability</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Account recovery protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Login attempt notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Prevents unauthorized access</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-3">Feature Access:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Full messaging capabilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Creator monetization features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Payment processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Account verification badges</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Process */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Verification Process
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Automatic Verification Email</h3>
            <p className="text-muted-foreground mb-4">
              When you create your OnlyFur account, we automatically send a verification email to your registered address.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Check Your Email</p>
                  <p className="text-sm text-muted-foreground">Look for an email from OnlyFur in your inbox</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Click Verification Link</p>
                  <p className="text-sm text-muted-foreground">Click the "Verify Email Address" button in the email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Confirmation</p>
                  <p className="text-sm text-muted-foreground">You'll be redirected to a confirmation page</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Email Verified</p>
                  <p className="text-sm text-muted-foreground">Your account is now fully verified and active</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Manual Verification Request</h3>
            <p className="text-muted-foreground mb-4">
              If you didn't receive the automatic email, you can request a new verification email.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Go to Account Settings</p>
                  <p className="text-sm text-muted-foreground">Navigate to your profile settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Find Email Settings</p>
                  <p className="text-sm text-muted-foreground">Look for the "Email Verification" section</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Click "Resend Verification"</p>
                  <p className="text-sm text-muted-foreground">Request a new verification email</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Troubleshooting Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Didn't Receive Verification Email</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Verify the email address is spelled correctly</li>
                <li>• Wait up to 15 minutes for delivery</li>
                <li>• Request a new verification email</li>
                <li>• Check if your email provider blocks automated emails</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Verification Link Expired</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Verification links expire after 24 hours</li>
                <li>• Request a new verification email</li>
                <li>• Complete verification promptly after receiving</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Wrong Email Address</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Contact OnlyFur support to update your email</li>
                <li>• Provide proof of account ownership</li>
                <li>• Create a new account with the correct email if needed</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Already Verified but System Shows Unverified</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Log out and log back in</li>
                <li>• Clear your browser cache</li>
                <li>• Check if you have multiple accounts</li>
                <li>• Contact support if the issue persists</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changing Email */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Changing Your Email Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important:</strong> Changing your email address will require re-verification and may temporarily limit some account features.
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-semibold mb-3">Steps to Change Email</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Go to Account Settings</p>
                  <p className="text-sm text-muted-foreground">Access your account settings page</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Update Email Address</p>
                  <p className="text-sm text-muted-foreground">Enter your new email address</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Verify Current Password</p>
                  <p className="text-sm text-muted-foreground">Confirm the change with your current password</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Verify New Email</p>
                  <p className="text-sm text-muted-foreground">Check your new email for verification instructions</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile App */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Email Verification on Mobile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The email verification process works the same way on mobile devices, but here are some mobile-specific tips:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Tips for Mobile:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Check both your main inbox and spam folder</li>
                <li>Ensure you have a stable internet connection</li>
                <li>Use your default browser to open verification links</li>
                <li>Allow the OnlyFur app to send notifications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Common Mobile Issues:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Email app not syncing new messages</li>
                <li>Verification link opening in wrong browser</li>
                <li>App cache preventing status updates</li>
                <li>Multiple email accounts causing confusion</li>
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
              <p className="text-sm text-muted-foreground">Reset your password securely</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;

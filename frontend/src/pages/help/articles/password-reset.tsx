import React from 'react';
import { ArrowLeft, Key, Shield, Mail, Clock, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const PasswordReset: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Key className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Password Reset Guide</h1>
            <p className="text-muted-foreground">Learn how to securely reset your OnlyFur account password</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Account Security</Badge>
          <Badge variant="secondary">Password</Badge>
          <Badge variant="secondary">Recovery</Badge>
        </div>
      </div>

      {/* Quick Reset */}
      <Alert className="mb-8">
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <strong>Need to reset your password quickly?</strong> Click the "Forgot Password" link on the login page and follow the email instructions.
        </AlertDescription>
      </Alert>

      {/* Step by Step Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Step-by-Step Password Reset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Method 1: From Login Page</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Go to OnlyFur Login Page</p>
                  <p className="text-sm text-muted-foreground">Visit the OnlyFur login page in your browser</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Click "Forgot Password?"</p>
                  <p className="text-sm text-muted-foreground">Look for the "Forgot Password?" link below the login form</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Enter Your Email Address</p>
                  <p className="text-sm text-muted-foreground">Type the email address associated with your OnlyFur account</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Click "Send Reset Link"</p>
                  <p className="text-sm text-muted-foreground">Submit the form to receive your password reset email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <p className="font-medium">Check Your Email</p>
                  <p className="text-sm text-muted-foreground">Look for a password reset email from OnlyFur (check spam folder too)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</div>
                <div>
                  <p className="font-medium">Click the Reset Link</p>
                  <p className="text-sm text-muted-foreground">Click the secure link in the email to open the password reset page</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">7</div>
                <div>
                  <p className="font-medium">Set Your New Password</p>
                  <p className="text-sm text-muted-foreground">Enter a strong new password and confirm it</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Method 2: From Account Settings</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Log Into Your Account</p>
                  <p className="text-sm text-muted-foreground">Sign in to OnlyFur with your current password</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Go to Account Settings</p>
                  <p className="text-sm text-muted-foreground">Navigate to your profile settings or account security section</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Find "Change Password"</p>
                  <p className="text-sm text-muted-foreground">Look for the password or security settings section</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Enter Current Password</p>
                  <p className="text-sm text-muted-foreground">Verify your identity with your current password</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <p className="font-medium">Set New Password</p>
                  <p className="text-sm text-muted-foreground">Enter and confirm your new password</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Requirements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your new OnlyFur password must meet the following security requirements:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-3">Required:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">At least 8 characters long</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">At least one uppercase letter (A-Z)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">At least one lowercase letter (a-z)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">At least one number (0-9)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">At least one special character (!@#$%^&*)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-3">Recommended:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>12+ characters for enhanced security</li>
                <li>Unique password not used elsewhere</li>
                <li>Mix of words, numbers, and symbols</li>
                <li>Avoid personal information</li>
                <li>Use a password manager</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Troubleshooting Password Reset Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Common Issues and Solutions:</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Didn't Receive Reset Email</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Check your spam/junk folder</li>
                  <li>• Verify you entered the correct email address</li>
                  <li>• Wait up to 10 minutes for delivery</li>
                  <li>• Try requesting another reset email</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Reset Link Expired</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Reset links expire after 1 hour for security</li>
                  <li>• Request a new password reset email</li>
                  <li>• Complete the reset process quickly</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Can't Remember Email Address</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Try all email addresses you commonly use</li>
                  <li>• Check saved passwords in your browser</li>
                  <li>• Contact OnlyFur support for assistance</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Password Not Working After Reset</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Try logging in from a different browser</li>
                  <li>• Make sure Caps Lock is off</li>
                  <li>• Verify you're on the correct OnlyFur login page</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert className="mb-8 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Security Notice:</strong> If you didn't request a password reset, someone may be trying to access your account. 
          Change your password immediately and enable two-factor authentication.
        </AlertDescription>
      </Alert>

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
              <p className="text-sm text-muted-foreground">Solve common login problems</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;

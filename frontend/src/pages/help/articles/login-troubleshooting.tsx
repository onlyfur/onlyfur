import React from 'react';
import { ArrowLeft, AlertTriangle, Key, Mail, RefreshCw, Shield, Clock, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const LoginTroubleshooting: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold">Login Troubleshooting</h1>
            <p className="text-muted-foreground">Common issues and solutions for login problems on OnlyFur</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Troubleshooting</Badge>
          <Badge variant="secondary">Login Issues</Badge>
          <Badge variant="secondary">Account Access</Badge>
        </div>
      </div>

      {/* Quick Fix Alert */}
      <Alert className="mb-8 border-orange-200 bg-orange-50">
        <RefreshCw className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Quick Fix:</strong> Most login issues can be resolved by clearing your browser cache, checking for typos, or using the password reset feature.
        </AlertDescription>
      </Alert>

      {/* Common Issues */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Most Common Login Issues
          </CardTitle>
          <CardDescription>
            Identify and resolve the most frequent login problems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-600 mb-2">Incorrect Credentials</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Most common reason for login failures</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Double-check email address for typos</li>
                  <li>• Verify password case sensitivity</li>
                  <li>• Ensure no extra spaces before/after credentials</li>
                  <li>• Try typing instead of copy-pasting</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-orange-600 mb-2">Unverified Account</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email verification required for account access</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your email inbox for verification link</li>
                  <li>• Look in spam/junk folders</li>
                  <li>• Request a new verification email if needed</li>
                  <li>• Contact support if verification fails</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-600 mb-2">Browser Issues</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Browser-related login problems</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Clear browser cache and cookies</li>
                  <li>• Disable browser extensions temporarily</li>
                  <li>• Try incognito/private browsing mode</li>
                  <li>• Update your browser to latest version</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-600 mb-2">Account Locked</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Temporary lockout due to security measures</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Wait 15 minutes for automatic unlock</li>
                  <li>• Avoid repeated failed login attempts</li>
                  <li>• Use password reset if you're unsure</li>
                  <li>• Contact support for persistent locks</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Solutions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Step-by-Step Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Verify Your Information</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Ensure you're using the correct email address and password combination.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800"><strong>Tip:</strong> Check if Caps Lock is on and verify you're using the right email account.</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Clear Browser Data</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Clear your browser's cache, cookies, and stored data for OnlyFur.com
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm"><strong>How to:</strong> Browser Settings → Privacy/Security → Clear Browsing Data → Select Cookies and Cache</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Try Password Reset</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Use the "Forgot Password" link to reset your password if you're uncertain.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/help/articles/password-reset">Password Reset Guide</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Check Email Verification</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Ensure your email address has been verified by checking for confirmation emails.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/help/articles/email-verification">Email Verification Guide</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Considerations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Lockouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-600 mb-1">Temporary Lockout</h4>
                  <p className="text-sm text-yellow-700">
                    After 5 failed login attempts, your account is temporarily locked for 15 minutes. 
                    This is a security measure to protect your account from unauthorized access.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-600 mb-1">Account Suspension</h4>
                  <p className="text-sm text-red-700">
                    Repeated security violations or suspicious activity may result in account suspension. 
                    Contact support immediately if you believe this is an error.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Still Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you've tried all the above solutions and still can't access your account, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/support/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@onlyfur.com">support@onlyfur.com</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginTroubleshooting;

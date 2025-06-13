import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, CheckCircle, AlertTriangle, Clock, RefreshCw, Shield, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/help">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Center
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Account Setup</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Email verification guide</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to verify your email address and troubleshoot common verification issues.
        </p>
      </div>

      {/* Verification Overview */}
      <Card className="mb-8 bg-linear-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Why Email Verification Matters</h3>
          <p className="text-muted-foreground mb-4">
            Email verification is a crucial security step that protects your account, ensures you receive important notifications, and gives you full access to all OnlyFur features.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Account Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Full Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Account Recovery</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Verification Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              The Verification Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Standard Verification Steps:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Create Your Account</p>
                    <p className="text-muted-foreground">Sign up with your email address at OnlyFur.com</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Check Your Inbox</p>
                    <p className="text-muted-foreground">A verification email is automatically sent to your address</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Click the Verification Link</p>
                    <p className="text-muted-foreground">Open the email and click the "Verify Email" button or link</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Confirmation Page</p>
                    <p className="text-muted-foreground">You'll be redirected to a confirmation page showing successful verification</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                  <div>
                    <p className="font-medium">Access Full Features</p>
                    <p className="text-muted-foreground">Your account is now verified and has full access to all features</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Time Frame:</strong> Verification emails are typically sent immediately, but may take up to 15 minutes to arrive. If you don't see it, check your spam folder before requesting a new verification email.</p>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Troubleshooting Verification Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Issues and Solutions:</h4>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Email Not Received</h5>
                  <div className="space-y-2">
                    <p className="text-sm">If you haven't received your verification email:</p>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Check your spam/junk folder</li>
                      <li>Verify you entered your email address correctly</li>
                      <li>Add noreply@onlyfur.com to your contacts</li>
                      <li>Check for email filters that might block verification emails</li>
                      <li>Wait 15 minutes as email delivery can sometimes be delayed</li>
                    </ul>
                    <div className="mt-3">
                      <p className="text-sm font-medium">How to request a new verification email:</p>
                      <ol className="text-sm space-y-1 pl-5 list-decimal">
                        <li>Log in to your OnlyFur account</li>
                        <li>Go to Account Settings → Email</li>
                        <li>Click "Resend Verification Email"</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Verification Link Not Working</h5>
                  <div className="space-y-2">
                    <p className="text-sm">If the verification link doesn't work:</p>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>Ensure you're clicking the most recent verification email</li>
                      <li>Verification links expire after 24 hours</li>
                      <li>Copy and paste the full link into your browser if clicking doesn't work</li>
                      <li>Try using a different browser or device</li>
                      <li>Clear your browser cache and cookies</li>
                    </ul>
                    <div className="mt-3 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                      <p className="text-sm"><strong>Note:</strong> If your link has expired, simply request a new verification email from your account settings.</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Email Address Issues</h5>
                  <div className="space-y-2">
                    <p className="text-sm">If you need to change or correct your email address:</p>
                    <ol className="text-sm space-y-1 pl-5 list-decimal">
                      <li>Log in to your OnlyFur account</li>
                      <li>Go to Account Settings → Email</li>
                      <li>Click "Change Email Address"</li>
                      <li>Enter your new email address</li>
                      <li>Verify the new email address</li>
                    </ol>
                    <div className="mt-3 bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                      <p className="text-sm"><strong>Important:</strong> If you can't access your account at all due to email issues, contact support with proof of account ownership.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Providers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-500" />
              Email Provider Specific Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Tips for Common Email Providers:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Gmail</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Check the "Promotions" or "Updates" tabs</li>
                    <li>• Search for "OnlyFur" or "verification"</li>
                    <li>• Check Spam folder and mark as "Not Spam"</li>
                    <li>• Add noreply@onlyfur.com to contacts</li>
                    <li>• Check for filters that might archive emails</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Outlook/Hotmail</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Check "Junk Email" folder</li>
                    <li>• Check "Other" or "Focused" tabs</li>
                    <li>• Add OnlyFur to safe senders list</li>
                    <li>• Disable "Focused Inbox" temporarily</li>
                    <li>• Check for rules that might move emails</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Yahoo Mail</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Check "Spam" folder</li>
                    <li>• Look in "Bulk Mail" folder</li>
                    <li>• Add OnlyFur to contacts</li>
                    <li>• Create a filter to allow OnlyFur emails</li>
                    <li>• Disable overly aggressive spam filters</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Apple Mail/iCloud</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Check "Junk" folder</li>
                    <li>• Disable "Hide My Email" for OnlyFur</li>
                    <li>• Add OnlyFur to VIP list</li>
                    <li>• Check Mail settings for filtering rules</li>
                    <li>• Ensure iCloud Mail & Messages is enabled</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Provider Tip:</strong> Some email providers (especially free ones) have aggressive spam filtering that may block verification emails. Consider using a different email provider if you consistently have issues.</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Limitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-red-500" />
              Unverified Account Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What You Can't Do Without Verification:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Subscribe to Creators</p>
                  <p className="text-xs text-muted-foreground">You cannot purchase subscriptions until your email is verified</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Publish Content</p>
                  <p className="text-xs text-muted-foreground">Creators cannot publish content without email verification</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Send Messages</p>
                  <p className="text-xs text-muted-foreground">Messaging functionality is limited until verification</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Receive Payments</p>
                  <p className="text-xs text-muted-foreground">Creators cannot receive earnings without verification</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Change Account Settings</p>
                  <p className="text-xs text-muted-foreground">Many account settings are locked until verification</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What You Can Still Do:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Browse Public Content</p>
                  <p className="text-xs text-muted-foreground">You can still view public posts and profiles</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Complete Your Profile</p>
                  <p className="text-xs text-muted-foreground">Set up your profile while waiting for verification</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Follow Creators</p>
                  <p className="text-xs text-muted-foreground">You can follow creators for free</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Request New Verification Email</p>
                  <p className="text-xs text-muted-foreground">You can request a new verification email at any time</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Important:</strong> Unverified accounts may be automatically deleted after 30 days of inactivity. Be sure to complete verification to preserve your account.</p>
            </div>
          </CardContent>
        </Card>

        {/* Security Considerations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              Security Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Protecting Your Account:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Use a Secure Email</h5>
                    <p className="text-xs text-muted-foreground">Use an email with strong security features and two-factor authentication</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Verify Promptly</h5>
                    <p className="text-xs text-muted-foreground">Complete verification as soon as possible to secure your account</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Check Email Links</h5>
                    <p className="text-xs text-muted-foreground">Ensure verification emails are from OnlyFur.com before clicking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">4</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Enable Two-Factor Authentication</h5>
                    <p className="text-xs text-muted-foreground">After verification, set up 2FA for additional security</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Security Note:</strong> OnlyFur will never ask for your password in verification emails. If you receive an email requesting your password, it's a phishing attempt.</p>
            </div>
          </CardContent>
        </Card>

        {/* Still Need Help */}
        <Card className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Having Verification Issues?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              If you've tried all the troubleshooting steps and still can't verify your email, our support team is here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-blue-600 hover:text-blue-700" asChild>
                <Link to="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/help">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  More Help Articles
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-center">Related Help Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Account Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Learn how to secure your account with two-factor authentication.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/account-security">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <User className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Account Creation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Step-by-step guide to creating your OnlyFur account.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/how-to-create-account">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Settings className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Profile Setup</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Complete your profile to attract followers and subscribers.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/profile-setup">Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
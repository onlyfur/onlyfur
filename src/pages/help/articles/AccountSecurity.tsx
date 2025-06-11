import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle, Smartphone, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccountSecurity: React.FC = () => {
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
          <Shield className="w-6 h-6 text-green-500" />
          <Badge variant="secondary">Safety & Privacy</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Account security best practices</h1>
        <p className="text-xl text-muted-foreground">
          Protect your OnlyFur account, personal information, and financial data with these essential security measures.
        </p>
      </div>

      {/* Security Overview */}
      <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Security Fundamentals</h3>
          <p className="text-muted-foreground mb-4">
            Your account security is crucial for protecting your privacy, content, and financial information. Follow these best practices to stay safe on OnlyFur.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Strong Passwords</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Two-Factor Auth</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Privacy Settings</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Threat Awareness</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Password Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-green-500" />
              Password Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Creating a Strong Password:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Password Requirements</h5>
                  <ul className="text-sm space-y-1">
                    <li>• At least 12 characters long</li>
                    <li>• Mix of uppercase and lowercase letters</li>
                    <li>• Include numbers and special symbols</li>
                    <li>• Unique to OnlyFur (not reused elsewhere)</li>
                    <li>• Avoid personal information</li>
                    <li>• Use random words or phrases</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-600 mb-2">❌ Avoid These Patterns</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Common words or phrases</li>
                    <li>• Predictable number sequences</li>
                    <li>• Personal information (birthdate, name)</li>
                    <li>• Dictionary words</li>
                    <li>• Previously compromised passwords</li>
                    <li>• Passwords used on other sites</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Password Examples:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm text-red-600">❌ Weak Passwords</p>
                  <p className="text-xs text-muted-foreground font-mono">password123, furry2024, MyBirthday1990</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm text-green-600">✅ Strong Passwords</p>
                  <p className="text-xs text-muted-foreground font-mono">Rainbow$Dragon9Lightning!, Pancake#Moon47$Shield</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Password Management:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Password Managers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Use 1Password, Bitwarden, or LastPass</li>
                    <li>• Generate unique passwords automatically</li>
                    <li>• Store passwords securely encrypted</li>
                    <li>• Auto-fill login forms safely</li>
                    <li>• Sync across all your devices</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Regular Updates</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Change passwords every 6-12 months</li>
                    <li>• Update immediately if compromised</li>
                    <li>• Change after any security alerts</li>
                    <li>• Don't reuse old passwords</li>
                    <li>• Monitor for data breaches</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-blue-500" />
              Two-Factor Authentication (2FA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Why 2FA is Essential:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Extra Security Layer</p>
                  <p className="text-xs text-muted-foreground">Even if someone gets your password, they can't access your account without your phone</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Prevents 99.9% of Attacks</p>
                  <p className="text-xs text-muted-foreground">Two-factor authentication blocks almost all automated account takeover attempts</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Easy to Set Up</p>
                  <p className="text-xs text-muted-foreground">Takes just a few minutes to configure and provides massive security improvement</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">How to Enable 2FA:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Go to Security Settings</p>
                    <p className="text-muted-foreground">Account Settings → Security → Two-Factor Authentication</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Choose Your Method</p>
                    <p className="text-muted-foreground">Authenticator app (recommended) or SMS text messages</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Scan QR Code</p>
                    <p className="text-muted-foreground">Use Google Authenticator, Authy, or similar app to scan the code</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Enter Verification Code</p>
                    <p className="text-muted-foreground">Type the 6-digit code from your app to confirm setup</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                  <div>
                    <p className="font-medium">Save Backup Codes</p>
                    <p className="text-muted-foreground">Store recovery codes safely in case you lose your phone</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2FA Method Comparison:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Authenticator Apps (Recommended)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Apps:</strong> Google Authenticator, Authy, 1Password</li>
                    <li>• Works offline without internet</li>
                    <li>• More secure than SMS</li>
                    <li>• Can't be intercepted</li>
                    <li>• Free to use</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">SMS Text Messages</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Method:</strong> Codes sent to your phone</li>
                    <li>• Easy to set up</li>
                    <li>• Works on any phone</li>
                    <li>• Can be intercepted (less secure)</li>
                    <li>• Requires cell service</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Important:</strong> Keep your backup codes in a safe place! If you lose your phone and don't have backup codes, you could be locked out of your account.</p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-purple-500" />
              Privacy & Visibility Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Profile Privacy Controls:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Who Can See Your Profile</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Public:</strong> Anyone can view your profile</li>
                    <li>• <strong>Subscribers Only:</strong> Only your subscribers</li>
                    <li>• <strong>Private:</strong> Hidden from discovery</li>
                    <li>• Customize profile visibility</li>
                    <li>• Control search appearance</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Contact Permissions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Messages:</strong> Who can send you messages</li>
                    <li>• <strong>Comments:</strong> Who can comment on posts</li>
                    <li>• <strong>Mentions:</strong> Who can tag you</li>
                    <li>• Block unwanted contact</li>
                    <li>• Filter message requests</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Content Privacy Options:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Content Sharing Controls</p>
                  <p className="text-xs text-muted-foreground">Control whether subscribers can share or download your content</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Geographic Restrictions</p>
                  <p className="text-xs text-muted-foreground">Block access from specific countries or regions if needed</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Activity Visibility</p>
                  <p className="text-xs text-muted-foreground">Choose what activities appear in your public activity feed</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recommended Privacy Settings:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">For New Creators</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Public profile for discoverability</li>
                    <li>• Subscribers can message you</li>
                    <li>• Limited content sharing allowed</li>
                    <li>• Activity feed partially visible</li>
                    <li>• Comments from subscribers only</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">For Established Creators</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Public profile with contact limits</li>
                    <li>• VIP subscribers get priority messaging</li>
                    <li>• Strict content sharing controls</li>
                    <li>• Private activity feed</li>
                    <li>• Moderated comment sections</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2 text-orange-500" />
              Account Monitoring & Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Monitoring Your Account:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Login Activity</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Check recent login locations</li>
                    <li>• Review login times and dates</li>
                    <li>• Monitor device types used</li>
                    <li>• Look for suspicious activity</li>
                    <li>• Log out unknown devices</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Security Alerts</h5>
                  <ul className="text-sm space-y-1">
                    <li>• New device login notifications</li>
                    <li>• Password change confirmations</li>
                    <li>• Unusual activity warnings</li>
                    <li>• Failed login attempt alerts</li>
                    <li>• Account setting changes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What to Look For:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm text-red-600">🚨 Immediate Concerns</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Logins from unknown locations</li>
                    <li>• Multiple failed login attempts</li>
                    <li>• Settings changed without your knowledge</li>
                    <li>• Unexpected password reset emails</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm text-yellow-600">⚠️ Worth Investigating</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Logins at unusual times</li>
                    <li>• New devices you don't recognize</li>
                    <li>• Emails you didn't request</li>
                    <li>• Unexpected subscription changes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Regular Security Checks:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">M</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Monthly Reviews</h5>
                    <p className="text-xs text-muted-foreground">Check login activity, review privacy settings, update payment info if needed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">Q</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Quarterly Audits</h5>
                    <p className="text-xs text-muted-foreground">Review all account settings, update contact info, check connected apps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">Y</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Annual Password Updates</h5>
                    <p className="text-xs text-muted-foreground">Change your password, review security questions, update backup contacts</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Threats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Common Security Threats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Phishing Attacks:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Fake OnlyFur Emails</p>
                  <p className="text-xs text-muted-foreground">Emails claiming to be from OnlyFur asking for login credentials or payment info</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Fake Support Messages</p>
                  <p className="text-xs text-muted-foreground">Messages claiming account issues requiring immediate password changes</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Social Engineering</p>
                  <p className="text-xs text-muted-foreground">Someone pretending to be OnlyFur staff requesting account information</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">How to Identify Scams:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-red-600 mb-2">🚩 Red Flags</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Urgent language ("act now or lose account")</li>
                    <li>• Requests for passwords or 2FA codes</li>
                    <li>• Links to suspicious websites</li>
                    <li>• Poor grammar or spelling</li>
                    <li>• Threats of account suspension</li>
                    <li>• Requests for payment outside OnlyFur</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Legitimate Signs</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Emails from @onlyfur.com domain</li>
                    <li>• Professional formatting and language</li>
                    <li>• Links to official OnlyFur URLs</li>
                    <li>• No requests for sensitive information</li>
                    <li>• Consistent with OnlyFur branding</li>
                    <li>• Verifiable through your account dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What to Do if Targeted:</h4>
              <ol className="space-y-2 text-sm">
                <li>1. <strong>Don't click any links</strong> or download attachments</li>
                <li>2. <strong>Don't provide any information</strong> even if it seems urgent</li>
                <li>3. <strong>Report the attempt</strong> to OnlyFur support immediately</li>
                <li>4. <strong>Check your account</strong> directly by logging in normally</li>
                <li>5. <strong>Change your password</strong> if you suspect compromise</li>
                <li>6. <strong>Warn others</strong> about the scam attempt</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Incident Response */}
        <Card>
          <CardHeader>
            <CardTitle>If Your Account is Compromised</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Immediate Actions:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Change Your Password</h5>
                    <p className="text-xs text-muted-foreground">Immediately create a new, strong password different from your old one</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Enable 2FA</h5>
                    <p className="text-xs text-muted-foreground">Set up two-factor authentication if you haven't already</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Log Out All Devices</h5>
                    <p className="text-xs text-muted-foreground">Use the "log out all devices" option in security settings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600">4</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Contact Support</h5>
                    <p className="text-xs text-muted-foreground">Report the incident to OnlyFur support immediately</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recovery Process:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Account Recovery</p>
                  <p className="text-xs text-muted-foreground">OnlyFur support will help verify your identity and restore account access safely</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Security Review</p>
                  <p className="text-xs text-muted-foreground">Review all account settings, connected devices, and recent activity for unauthorized changes</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Prevention Setup</p>
                  <p className="text-xs text-muted-foreground">Implement additional security measures to prevent future compromises</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Emergency Support:</strong> If you can't access your account at all, contact OnlyFur support immediately with your registered email and as much account information as possible.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Articles */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/help/articles/password-reset" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Password Reset Guide</h4>
              <p className="text-sm text-muted-foreground mt-1">How to securely reset your password</p>
            </Link>
            <Link to="/help/articles/login-troubleshooting" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Login Troubleshooting</h4>
              <p className="text-sm text-muted-foreground mt-1">Resolve common login issues</p>
            </Link>
            <Link to="/help/articles/session-management" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Session Management</h4>
              <p className="text-sm text-muted-foreground mt-1">Control active login sessions</p>
            </Link>
            <Link to="/help/articles/oauth-guide" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Google Sign-In Guide</h4>
              <p className="text-sm text-muted-foreground mt-1">Use Google for secure login</p>
            </Link>
            <Link to="/help/articles/content-privacy-levels" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Content Privacy Settings</h4>
              <p className="text-sm text-muted-foreground mt-1">Control who sees your content</p>
            </Link>
            <Link to="/help/articles/report-user-content" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Report Security Issues</h4>
              <p className="text-sm text-muted-foreground mt-1">Report threats and violations</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Security Concerns?</h3>
          <p className="mb-4 opacity-90">Our security team is available 24/7 to help with account protection and incident response.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Security Team</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecurity;
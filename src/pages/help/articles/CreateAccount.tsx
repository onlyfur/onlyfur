import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Lock, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateAccount: React.FC = () => {
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
          <User className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Getting Started</Badge>
          <Badge className="bg-yellow-500">Popular</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">How to create your OnlyFur account</h1>
        <p className="text-xl text-muted-foreground">
          Step-by-step guide to joining our furry creator community and setting up your new account.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Quick Overview */}
        <Card className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Account Creation Overview</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-sm">Sign up with email</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm">Verify your email</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-sm">Complete your profile</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Creating Your Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Step 1: Account Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Getting Started</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Visit OnlyFur.com</p>
                    <p className="text-muted-foreground">Click the "Sign Up" button in the top right corner</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Choose Account Type</p>
                    <p className="text-muted-foreground">Select "Creator" if you plan to publish content, or "Subscriber" to support creators</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Enter Your Information</p>
                    <p className="text-muted-foreground">Fill in the required fields (see details below)</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-semibold mb-2">Required Information:</h5>
              <ul className="text-sm space-y-1">
                <li>• <strong>Email Address:</strong> Must be valid and accessible</li>
                <li>• <strong>Username:</strong> 3-30 characters, letters, numbers, and underscores only</li>
                <li>• <strong>Password:</strong> Minimum 8 characters with mix of letters, numbers, and symbols</li>
                <li>• <strong>Display Name:</strong> How your name appears to other users</li>
                <li>• <strong>Date of Birth:</strong> Must be 18+ to join OnlyFur</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Username Tips:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Choose something memorable and professional</li>
                <li>• Your username cannot be changed later</li>
                <li>• Consider using your character name or brand</li>
                <li>• Check availability on other social platforms for consistency</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Email Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Step 2: Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Verifying Your Email</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Check Your Email</p>
                    <p className="text-muted-foreground">Look for an email from "noreply@onlyfur.com" in your inbox</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Click Verification Link</p>
                    <p className="text-muted-foreground">Click the "Verify Email" button in the email</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Confirmation</p>
                    <p className="text-muted-foreground">You'll be redirected to OnlyFur with a confirmation message</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Didn't receive the email?</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• Wait 5 minutes and check again</li>
                <li>• Click "Resend Verification Email" on the login page</li>
                <li>• Contact support if problems persist</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Security Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Step 3: Security Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Two-Factor Authentication (Recommended)</h4>
              <p className="text-muted-foreground mb-3">
                Add an extra layer of security to protect your account and earnings.
              </p>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Go to Security Settings</p>
                    <p className="text-muted-foreground">Navigate to Profile → Settings → Security</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-muted-foreground">Choose SMS or authenticator app (recommended)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Save Backup Codes</p>
                    <p className="text-muted-foreground">Store backup codes in a safe place</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Recommended Security Apps:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Google Authenticator (Free)</li>
                <li>• Authy (Free, syncs across devices)</li>
                <li>• 1Password (Paid, full password manager)</li>
                <li>• Microsoft Authenticator (Free)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Profile Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Step 4: Complete Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Basic Profile Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Essential Fields:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Profile picture</li>
                    <li>• Bio/description</li>
                    <li>• Location (optional)</li>
                    <li>• Interests and categories</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Creator-Specific:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Banner image</li>
                    <li>• Content categories</li>
                    <li>• Subscription pricing</li>
                    <li>• Payment information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Profile Tips:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Use a clear, high-quality profile picture</li>
                <li>• Write a friendly, engaging bio</li>
                <li>• Add keywords related to your content</li>
                <li>• Keep information up-to-date</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Account Types */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding Account Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Subscriber Account</h4>
                <ul className="text-sm space-y-1">
                  <li>• Follow and subscribe to creators</li>
                  <li>• Access premium content</li>
                  <li>• Send messages and tips</li>
                  <li>• Participate in community</li>
                  <li>• No content creation tools</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Perfect for fans who want to support creators</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-purple-600 mb-2">Creator Account</h4>
                <ul className="text-sm space-y-1">
                  <li>• Upload and sell content</li>
                  <li>• Set subscription tiers</li>
                  <li>• Receive payments</li>
                  <li>• Analytics and insights</li>
                  <li>• All subscriber features included</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">For artists, writers, and content creators</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Can I switch account types?</strong> Yes! You can upgrade from Subscriber to Creator anytime in your account settings. Downgrading requires contacting support.</p>
            </div>
          </CardContent>
        </Card>

        {/* Age Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Age Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Why Age Verification is Required</h4>
              <p className="text-muted-foreground mb-3">
                OnlyFur hosts adult content and requires all users to be 18 or older. Age verification helps us:
              </p>
              <ul className="text-sm space-y-1 list-disc ml-4">
                <li>Comply with legal requirements</li>
                <li>Protect minors from adult content</li>
                <li>Ensure creators can earn from adult content safely</li>
                <li>Maintain platform integrity</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Verification Process</h4>
              <p className="text-muted-foreground mb-3">
                Age verification is done automatically during signup, but additional verification may be required for:
              </p>
              <ul className="text-sm space-y-1 list-disc ml-4">
                <li>Creator accounts earning money</li>
                <li>Accessing certain premium content</li>
                <li>If your account is flagged for review</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Required Documents (if requested):</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Government-issued photo ID</li>
                <li>• Driver's license or passport</li>
                <li>• Clear, unedited photos</li>
                <li>• Documents must be current and valid</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Common Issues and Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Account Creation Problems</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Username already taken</p>
                  <p className="text-xs text-muted-foreground">Try adding numbers or underscores, or choose a different username</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Email already registered</p>
                  <p className="text-xs text-muted-foreground">Use the "Forgot Password" link to recover your existing account</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Password requirements not met</p>
                  <p className="text-xs text-muted-foreground">Use at least 8 characters with letters, numbers, and symbols</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Age verification failed</p>
                  <p className="text-xs text-muted-foreground">Double-check your birth date - you must be 18+ to join</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="mt-8 bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200">
        <CardHeader>
          <CardTitle>🎉 Welcome to OnlyFur!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Congratulations on creating your account! Here's what to do next:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">For Subscribers:</h4>
              <ul className="text-sm space-y-1">
                <li>• <Link to="/help/articles/finding-creators" className="text-primary hover:underline">Find creators to follow</Link></li>
                <li>• <Link to="/help/articles/subscription-tiers" className="text-primary hover:underline">Learn about subscription tiers</Link></li>
                <li>• <Link to="/help/articles/payment-methods" className="text-primary hover:underline">Set up payment methods</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Creators:</h4>
              <ul className="text-sm space-y-1">
                <li>• <Link to="/help/articles/setting-up-creator-profile" className="text-primary hover:underline">Complete your creator profile</Link></li>
                <li>• <Link to="/help/articles/upload-organize-content" className="text-primary hover:underline">Upload your first content</Link></li>
                <li>• <Link to="/help/articles/pricing-strategies" className="text-primary hover:underline">Set your pricing strategy</Link></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/setting-up-creator-profile" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Setting up your creator profile</h4>
              <p className="text-sm text-muted-foreground mt-1">Complete your profile to attract subscribers</p>
            </Link>
            <Link to="/help/articles/subscription-tiers" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding subscription tiers</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn about Basic, Pro, and VIP levels</p>
            </Link>
            <Link to="/help/articles/community-guidelines" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Community guidelines overview</h4>
              <p className="text-sm text-muted-foreground mt-1">Understanding our community standards</p>
            </Link>
            <Link to="/help/articles/privacy-settings" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Privacy settings and controls</h4>
              <p className="text-sm text-muted-foreground mt-1">Manage your privacy preferences</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help Getting Started?</h3>
          <p className="mb-4 opacity-90">Our support team is here to help you create your account successfully.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAccount;

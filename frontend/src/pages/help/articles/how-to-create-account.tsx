import React from 'react';
import { ArrowLeft, UserPlus, Mail, Lock, Check, ChevronRight, Shield, Eye, Star, AlertTriangle, Smartphone, Globe, CreditCard, HelpCircle, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const HowToCreateAccount: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">How to Create an Account</h1>
            <p className="text-muted-foreground">Complete guide to creating and setting up your OnlyFur account for success</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Getting Started</Badge>
          <Badge variant="secondary">Account Setup</Badge>
          <Badge variant="secondary">Registration</Badge>
          <Badge variant="secondary">Security</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <UserPlus className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Welcome to OnlyFur!</strong> This comprehensive guide will walk you through creating your account, setting up security features, and optimizing your profile for the best experience on our platform.
        </AlertDescription>
      </Alert>

      {/* Pre-Registration Checklist */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Before You Start: Preparation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Required Information</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Valid email address you have access to</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Strong, unique password (or password manager)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Date of birth (must be 18+ to join)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Username ideas (3-5 backup options)</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Recommended to Have Ready</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Profile picture (high quality, 1:1 ratio)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Banner/header image (for creators)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Brief bio or description</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Payment method (for creators earning money)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Types */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Choose Your Account Type</CardTitle>
          <CardDescription>
            Understanding the differences between account types to make the right choice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Creator Account</h4>
                </div>
                <p className="text-sm text-purple-700 mb-3">Perfect for artists, writers, and content creators who want to monetize their work.</p>
                <div className="space-y-2">
                  <h5 className="font-medium text-purple-800">Features:</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Upload and sell content</li>
                    <li>• Set subscription tiers and pricing</li>
                    <li>• Receive payments and tips</li>
                    <li>• Access creator analytics</li>
                    <li>• Custom commission management</li>
                    <li>• Live streaming capabilities</li>
                  </ul>
                </div>
                <div className="mt-3 p-2 bg-purple-100 rounded text-xs text-purple-800">
                  <strong>Best for:</strong> Artists, writers, photographers, animators, and other content creators
                </div>
              </div>
              
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">Subscriber Account</h4>
                </div>
                <p className="text-sm text-green-700 mb-3">Ideal for fans who want to discover and support amazing furry creators.</p>
                <div className="space-y-2">
                  <h5 className="font-medium text-green-800">Features:</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Browse and discover creators</li>
                    <li>• Subscribe to favorite artists</li>
                    <li>• Access exclusive content</li>
                    <li>• Send tips and comments</li>
                    <li>• Private messaging with creators</li>
                    <li>• Custom collections and favorites</li>
                  </ul>
                </div>
                <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
                  <strong>Best for:</strong> Fans, collectors, and supporters of furry art and content
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h4 className="font-semibold mb-2">Can I Change My Account Type Later?</h4>
              <p className="text-sm text-gray-600 mb-2">
                Yes! You can upgrade from Subscriber to Creator at any time through your account settings. 
                However, downgrading from Creator to Subscriber requires contacting support to ensure proper 
                handling of any existing content and subscriptions.
              </p>
              <p className="text-xs text-gray-500">
                <strong>Note:</strong> Hybrid accounts (both creating and subscribing) are supported - you can be a creator while also subscribing to other creators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>      {/* Step-by-Step Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Detailed Registration Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Navigate to Sign-Up Page</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Visit OnlyFur.com and locate the registration options.
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">Multiple Access Points:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Click "Sign Up" button in the top navigation</li>
                      <li>• Use "Create Account" link on the login page</li>
                      <li>• Access via "Get Started" button on the homepage</li>
                      <li>• Direct URL: onlyfur.com/register</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Browser Tip:</strong> Use a modern browser (Chrome, Firefox, Safari, Edge) for the best experience. Clear your cache if you encounter any issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Select Account Type & Registration Method</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose your account type and preferred registration method.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Google OAuth (Recommended)
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Fastest registration (30 seconds)</li>
                      <li>• Enhanced security</li>
                      <li>• Automatic email verification</li>
                      <li>• Easy password recovery</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Registration
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Full control over credentials</li>
                      <li>• Works with any email provider</li>
                      <li>• Custom password creation</li>
                      <li>• Independent from third-party services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Complete Registration Form</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Fill out the registration form with accurate information.
                </p>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium">Required Fields:</h5>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span>Email address</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-blue-600" />
                          <span>Password (8+ characters)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-blue-600" />
                          <span>Username (3-20 characters)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-blue-600" />
                          <span>Date of birth (18+ required)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Password Requirements:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Minimum 8 characters</li>
                        <li>• At least one uppercase letter</li>
                        <li>• At least one lowercase letter</li>
                        <li>• At least one number</li>
                        <li>• Special character recommended</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium mb-1">Username Guidelines:</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Your username will be your public identity on OnlyFur. Choose wisely as changes are limited.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Must be unique across the platform</li>
                      <li>• Can contain letters, numbers, underscores, and hyphens</li>
                      <li>• Cannot contain offensive language or impersonate others</li>
                      <li>• Case-insensitive (UserName = username)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Age Verification & Terms Acceptance</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Confirm your eligibility and accept our terms of service.
                </p>
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-2">Age Requirement - 18+ Only</h5>
                    <p className="text-sm text-red-700 mb-2">
                      OnlyFur is an adult platform. All users must be 18 years or older. We may require additional age verification for certain features.
                    </p>
                    <ul className="text-xs text-red-600 space-y-1">
                      <li>• Government-issued ID may be required for creators</li>
                      <li>• False information will result in account termination</li>
                      <li>• Age verification is required for payment processing</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-1">Terms & Policies to Review:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Terms of Service</li>
                      <li>• Privacy Policy</li>
                      <li>• Community Guidelines</li>
                      <li>• Creator Agreement (for creator accounts)</li>
                      <li>• Cookie Policy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-orange-600">5</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Email Verification Process</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Verify your email address to activate your account.
                </p>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium">What to Expect:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Email arrives within 2-5 minutes</li>
                        <li>• Check spam/junk folders</li>
                        <li>• Link expires in 24 hours</li>
                        <li>• Can request new verification email</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Verification Benefits:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Full platform access</li>
                        <li>• Password recovery options</li>
                        <li>• Email notifications</li>
                        <li>• Enhanced security features</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-1">Troubleshooting Email Issues:</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Check all email folders (spam, promotions, updates)</li>
                      <li>• Add noreply@onlyfur.com to your contacts</li>
                      <li>• Try a different email provider if problems persist</li>
                      <li>• Contact support if no email after 15 minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-green-600">6</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Initial Profile Setup</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete your profile to start engaging with the community.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium">Essential Profile Elements:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Profile picture (avatar)</li>
                      <li>• Display name</li>
                      <li>• Bio/description</li>
                      <li>• Location (optional)</li>
                      <li>• Social media links</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">Creator-Specific Setup:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Banner/header image</li>
                      <li>• Content categories</li>
                      <li>• Subscription pricing</li>
                      <li>• Payment information</li>
                      <li>• Welcome message</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>      {/* Security Setup */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Essential Security Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <h4 className="font-semibold text-red-800 mb-2">Security is Critical</h4>
            <p className="text-sm text-red-700">
              As an adult platform handling sensitive content and payments, securing your account should be your top priority. Follow these essential security steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Two-Factor Authentication (2FA)
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Add an extra layer of security to your account with 2FA.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• SMS-based verification</li>
                  <li>• Authenticator app support</li>
                  <li>• Backup recovery codes</li>
                  <li>• Required for creators earning $500+</li>
                </ul>
                <Button size="sm" className="mt-2">
                  Setup 2FA
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  Password Security
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Ensure your password meets the highest security standards.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Use a password manager</li>
                  <li>• 12+ character minimum recommended</li>
                  <li>• Unique password (not used elsewhere)</li>
                  <li>• Regular password updates</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Email Security
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Protect the email account linked to your OnlyFur profile.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Use a secure email provider</li>
                  <li>• Enable 2FA on your email account</li>
                  <li>• Keep email address private</li>
                  <li>• Monitor for suspicious activity</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-600" />
                  Privacy Settings
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Configure privacy settings to control your visibility.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Profile visibility options</li>
                  <li>• Search indexing preferences</li>
                  <li>• Contact information privacy</li>
                  <li>• Content sharing restrictions</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Methods Comparison */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Registration Methods Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Google OAuth Registration</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-1">Advantages:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Lightning-fast signup (under 30 seconds)</li>
                      <li>• No password to remember or lose</li>
                      <li>• Automatic email verification</li>
                      <li>• Enhanced security through Google</li>
                      <li>• Easy account recovery</li>
                      <li>• Mobile-friendly authentication</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-blue-800 mb-1">Considerations:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Requires Google account</li>
                      <li>• Shares some data with Google</li>
                      <li>• Account tied to Google services</li>
                    </ul>
                  </div>
                  
                  <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                    <strong>Best for:</strong> Users who prioritize speed and convenience
                  </div>
                </div>
              </div>
              
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">Email Registration</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-green-800 mb-1">Advantages:</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Complete control over credentials</li>
                      <li>• No third-party dependencies</li>
                      <li>• Works with any email provider</li>
                      <li>• Custom password creation</li>
                      <li>• Independent account management</li>
                      <li>• Privacy-focused option</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-green-800 mb-1">Requirements:</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Strong password creation</li>
                      <li>• Email verification step</li>
                      <li>• Manual security setup</li>
                    </ul>
                  </div>
                  
                  <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
                    <strong>Best for:</strong> Users who prefer maximum control and privacy
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h4 className="font-semibold mb-2">Which Method Should You Choose?</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-1">Choose Google OAuth if:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• You want the fastest setup</li>
                    <li>• You already use Google services</li>
                    <li>• You prioritize convenience</li>
                    <li>• You're comfortable with OAuth</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Choose Email if:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• You prefer maximum privacy</li>
                    <li>• You don't have a Google account</li>
                    <li>• You want independent credentials</li>
                    <li>• You use a password manager</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Either works well for:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Both creator and subscriber accounts</li>
                    <li>• All platform features</li>
                    <li>• Security and privacy</li>
                    <li>• Professional use</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues & Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Common Registration Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Username Already Taken</h4>
              <p className="text-sm text-gray-600 mb-2">
                Your desired username is already in use by another user.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <h5 className="font-medium mb-1">Solutions:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Try variations with numbers (Artist2024)</li>
                    <li>• Add underscores (My_Art_Name)</li>
                    <li>• Use your real name or initials</li>
                    <li>• Consider a completely different name</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Tips:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Keep it memorable and brandable</li>
                    <li>• Avoid too many special characters</li>
                    <li>• Think about long-term branding</li>
                    <li>• Make it professional if you're a creator</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Email Verification Issues</h4>
              <p className="text-sm text-gray-600 mb-2">
                You're not receiving the verification email or it's not working.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium">Step-by-step troubleshooting:</h5>
                <ol className="text-sm space-y-1 ml-4">
                  <li>1. Check all email folders (inbox, spam, promotions, updates)</li>
                  <li>2. Wait 5-10 minutes (emails can be delayed)</li>
                  <li>3. Add noreply@onlyfur.com to your safe senders list</li>
                  <li>4. Try requesting a new verification email</li>
                  <li>5. Check if your email provider blocks adult content</li>
                  <li>6. Try a different email address (Gmail, Yahoo, etc.)</li>
                  <li>7. Contact support if still not working</li>
                </ol>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Password Too Weak Error</h4>
              <p className="text-sm text-gray-600 mb-2">
                Your password doesn't meet our security requirements.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <h5 className="font-medium mb-1">Requirements Checklist:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• One uppercase letter (A-Z)</li>
                    <li>• One lowercase letter (a-z)</li>
                    <li>• At least one number (0-9)</li>
                    <li>• Special character recommended (!@#$%)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Good Password Examples:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• MyArt2024!</li>
                    <li>• FurryCreator#23</li>
                    <li>• ArtLover$99</li>
                    <li>• Create_Art2024</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Age Verification Problems</h4>
              <p className="text-sm text-gray-600 mb-2">
                Issues with confirming you're 18 or older.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium">Common issues and solutions:</h5>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Date format confusion:</strong> Use MM/DD/YYYY format</li>
                  <li>• <strong>Under 18:</strong> OnlyFur is strictly 18+ only</li>
                  <li>• <strong>Birthday today:</strong> Wait 24 hours after your 18th birthday</li>
                  <li>• <strong>System error:</strong> Try again later or contact support</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Google OAuth Failures</h4>
              <p className="text-sm text-gray-600 mb-2">
                Problems signing up with your Google account.
              </p>
              <div className="space-y-2">
                <h5 className="font-medium">Troubleshooting steps:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Ensure you're logged into the correct Google account</li>
                  <li>• Check if your browser blocks pop-ups</li>
                  <li>• Try incognito/private browsing mode</li>
                  <li>• Clear browser cache and cookies</li>
                  <li>• Disable browser extensions temporarily</li>
                  <li>• Switch to email registration as alternative</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post-Registration Setup */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Essential Post-Registration Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Immediate Actions (First 24 Hours)</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Verify Your Email</h5>
                    <p className="text-sm text-gray-600">Essential for full platform access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Enable Two-Factor Authentication</h5>
                    <p className="text-sm text-gray-600">Critical security enhancement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <UserPlus className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Complete Profile Basics</h5>
                    <p className="text-sm text-gray-600">Profile picture, bio, display name</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Eye className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Configure Privacy Settings</h5>
                    <p className="text-sm text-gray-600">Control who can find and contact you</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Creator-Specific Setup</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Payment Information</h5>
                    <p className="text-sm text-gray-600">Set up how you'll receive earnings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Subscription Tiers</h5>
                    <p className="text-sm text-gray-600">Create pricing for your content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Settings className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Content Categories</h5>
                    <p className="text-sm text-gray-600">Tag your content for discoverability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Welcome Message</h5>
                    <p className="text-sm text-gray-600">Greet new subscribers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>      {/* Platform Features Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What You Can Do After Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-600">As a Creator</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-300 pl-3">
                  <h5 className="font-medium">Content Management</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Upload photos, videos, stories, and audio</li>
                    <li>• Set privacy levels and access controls</li>
                    <li>• Schedule content for automatic posting</li>
                    <li>• Organize content into collections</li>
                  </ul>
                </div>
                <div className="border-l-4 border-purple-300 pl-3">
                  <h5 className="font-medium">Monetization</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create multiple subscription tiers</li>
                    <li>• Offer custom commissions</li>
                    <li>• Receive tips and donations</li>
                    <li>• Sell individual content pieces</li>
                  </ul>
                </div>
                <div className="border-l-4 border-purple-300 pl-3">
                  <h5 className="font-medium">Community Building</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Direct messaging with subscribers</li>
                    <li>• Live streaming and events</li>
                    <li>• Community posts and updates</li>
                    <li>• Subscriber-only polls and Q&A</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">As a Subscriber</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-300 pl-3">
                  <h5 className="font-medium">Discovery</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Browse creators by category and style</li>
                    <li>• Use advanced search and filters</li>
                    <li>• Follow creators for free updates</li>
                    <li>• Get personalized recommendations</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-300 pl-3">
                  <h5 className="font-medium">Content Access</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Subscribe to unlimited creators</li>
                    <li>• Access exclusive content libraries</li>
                    <li>• Stream content online</li>
                    <li>• Create personal collections</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-300 pl-3">
                  <h5 className="font-medium">Interaction</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Comment and like content</li>
                    <li>• Send private messages</li>
                    <li>• Request custom commissions</li>
                    <li>• Participate in live streams</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Verification & Trust */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Account Verification & Building Trust
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Why Verification Matters</h4>
            <p className="text-sm text-blue-700">
              Verified accounts receive higher visibility, increased trust from users, and access to premium features. 
              For creators, verification can significantly boost subscriber confidence and earnings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-1">Email Verified</h4>
              <p className="text-sm text-gray-600">Basic verification - required for all accounts</p>
              <Badge variant="secondary" className="mt-2">Automatic</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-1">Phone Verified</h4>
              <p className="text-sm text-gray-600">Enhanced security and trust indicator</p>
              <Badge variant="secondary" className="mt-2">Optional</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-1">ID Verified</h4>
              <p className="text-sm text-gray-600">Premium verification for creators earning money</p>
              <Badge variant="secondary" className="mt-2">Creator</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal and Compliance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Legal Requirements & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Legal Information</h4>
            <p className="text-sm text-yellow-700">
              OnlyFur operates under strict legal guidelines. Understanding these requirements helps ensure your account remains in good standing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Age and Identity Requirements</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>18+ Only:</strong> All users must be at least 18 years old</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>ID Verification:</strong> Required for creators earning over $600/year</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Real Identity:</strong> False information will result in account termination</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>One Account:</strong> Multiple accounts per person are prohibited</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Content and Conduct</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Original Content:</strong> You must own rights to all uploaded content</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Community Guidelines:</strong> Respectful behavior is required</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Legal Content:</strong> All content must comply with applicable laws in your jurisdiction</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Tax Compliance:</strong> Creators responsible for tax obligations</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Help */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Getting Help During Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-1">Help Center</h4>
              <p className="text-sm text-gray-600 mb-3">
                Comprehensive guides and tutorials for all platform features.
              </p>
              <Button size="sm" variant="outline">
                Browse Help Articles
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-1">Support Tickets</h4>
              <p className="text-sm text-gray-600 mb-3">
                Direct support for technical issues and account problems.
              </p>
              <Button size="sm" variant="outline">
                Contact Support
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-1">Community Forums</h4>
              <p className="text-sm text-gray-600 mb-3">
                Connect with other users and get peer-to-peer help.
              </p>
              <Button size="sm" variant="outline">
                Join Community
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next? Your OnlyFur Journey Begins</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Congratulations on creating your OnlyFur account! Here are the recommended next steps to get the most out of the platform:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-600">For New Creators</h4>
              <div className="space-y-2">
                <Button asChild className="w-full justify-start">
                  <Link to="/help/articles/setting-up-creator-profile">
                    <Star className="h-4 w-4 mr-2" />
                    Set Up Your Creator Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/help/articles/pricing-strategies">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Learn Pricing Strategies
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/help/articles/content-protection">
                    <Shield className="h-4 w-4 mr-2" />
                    Protect Your Content
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">For New Subscribers</h4>
              <div className="space-y-2">
                <Button asChild className="w-full justify-start">
                  <Link to="/help/articles/finding-creators">
                    <Eye className="h-4 w-4 mr-2" />
                    Discover Amazing Creators
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/help/articles/first-subscription">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Your First Subscription
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/help/articles/messaging-tips">
                    <Mail className="h-4 w-4 mr-2" />
                    Messaging Best Practices
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Welcome to the Community!</h4>
            <p className="text-sm text-blue-700">
              You're now part of the largest and most supportive furry creator community. Take your time exploring, 
              and don't hesitate to reach out if you need help. Welcome to OnlyFur!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowToCreateAccount;

import React from 'react';
import { ArrowLeft, User, Upload, Mail, Settings, CheckCircle, Star, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const ProfileSetup: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <User className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Profile Setup</h1>
            <p className="text-muted-foreground">Complete your OnlyFur profile to attract subscribers and build your community</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Getting Started</Badge>
          <Badge variant="secondary">Profile</Badge>
          <Badge variant="secondary">Setup</Badge>
        </div>
      </div>

      {/* Quick Tips */}
      <Alert className="mb-8">
        <Star className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> A complete profile with high-quality images and detailed bio gets 3x more subscribers than incomplete profiles.
        </AlertDescription>
      </Alert>

      {/* Profile Basics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Essential Information</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Display Name</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  This is how you'll appear to subscribers and in search results.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Use your artist name or brand</li>
                  <li>Keep it memorable and easy to search</li>
                  <li>Can be different from your username</li>
                  <li>Change anytime in settings</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Username</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Your unique identifier and URL (onlyfur.com/your-username).
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Must be unique across the platform</li>
                  <li>3-30 characters, letters, numbers, underscores</li>
                  <li>Choose carefully - difficult to change later</li>
                  <li>Consider your brand and discoverability</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Bio &amp; Description</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Tell potential subscribers what you create and what makes you unique.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Describe your content style and themes</li>
                  <li>Mention posting schedule and frequency</li>
                  <li>Include what subscribers can expect</li>
                  <li>Keep it engaging but professional</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Images */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Pictures &amp; Banner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Profile Picture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Technical Requirements:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Minimum 200x200 pixels</li>
                  <li>Recommended 400x400 pixels</li>
                  <li>JPG, PNG, or WebP format</li>
                  <li>Maximum 5MB file size</li>
                  <li>Square aspect ratio works best</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Best Practices:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Use a clear, high-quality image</li>
                  <li>Show your face or art style</li>
                  <li>Avoid busy backgrounds</li>
                  <li>Ensure it looks good small</li>
                  <li>Keep it brand-consistent</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cover Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Technical Requirements:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Recommended 1920x480 pixels</li>
                  <li>Minimum 1200x300 pixels</li>
                  <li>JPG, PNG, or WebP format</li>
                  <li>Maximum 10MB file size</li>
                  <li>Landscape aspect ratio (4:1)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Design Tips:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Showcase your best work</li>
                  <li>Include your brand colors</li>
                  <li>Avoid text that might be cut off</li>
                  <li>Consider mobile viewing</li>
                  <li>Update seasonally or for promotions</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Preferences */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Content &amp; Creator Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Content Categories</h3>
            <p className="text-muted-foreground mb-4">
              Select categories that best describe your content to help users discover you.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm">Digital Art</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm">Photography</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm">Traditional Art</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm">3D Models</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm">Animation</p>
              </div>
              <div className="p-3 border rounded-lg text-center">
                <p className="text-sm">Stories &amp; Writing</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Subscription Tiers</h3>
            <p className="text-muted-foreground mb-4">
              Set up your subscription pricing and benefits for different supporter levels.
            </p>
            <div className="space-y-3">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">Free Tier</h4>
                <p className="text-sm text-muted-foreground">Public previews and teasers to attract subscribers</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">Basic Tier ($5-15/month)</h4>
                <p className="text-sm text-muted-foreground">Access to regular content and basic interactions</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">VIP Tier ($20+/month)</h4>
                <p className="text-sm text-muted-foreground">Exclusive content, early access, and special perks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Account Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Email Verification</h3>
            <p className="text-muted-foreground mb-4">
              Verify your email address to enable all platform features and improve security.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Why verify your email?</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Required for receiving payments</li>
                <li>Enables password reset functionality</li>
                <li>Improves account security</li>
                <li>Unlocks messaging features</li>
                <li>Required for creator verification</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Age Verification</h3>
            <p className="text-muted-foreground mb-4">
              Complete age verification to access and create adult content.
            </p>
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Age verification is required for all creators and is mandatory for accessing adult content on OnlyFur.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Profile Optimization */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Increase Your Discoverability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Content Strategy:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Post consistently and regularly</li>
                  <li>Use relevant tags and descriptions</li>
                  <li>Engage with your community</li>
                  <li>Collaborate with other creators</li>
                  <li>Share previews of upcoming content</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Profile SEO:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Include keywords in your bio</li>
                  <li>Use descriptive content titles</li>
                  <li>Tag your content appropriately</li>
                  <li>Update your profile regularly</li>
                  <li>Cross-promote on social media</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Complete Profile Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Choose a memorable username and display name</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Upload high-quality profile picture and banner</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Write an engaging bio describing your content</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Select appropriate content categories</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Set up subscription tiers and pricing</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Verify your email address</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Complete age verification process</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Configure privacy and security settings</span>
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
            <Link to="/help/articles/setting-up-creator-profile" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Setting Up Creator Profile</h4>
              <p className="text-sm text-muted-foreground">Advanced creator profile optimization</p>
            </Link>
            <Link to="/help/articles/subscription-tiers-overview" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Subscription Tiers</h4>
              <p className="text-sm text-muted-foreground">Learn about subscription levels</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;

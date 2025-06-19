import React from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Users, Settings, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const PrivacySettings: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">Privacy Settings</h1>
            <p className="text-muted-foreground">Manage your privacy preferences and control who can see your information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Privacy</Badge>
          <Badge variant="secondary">Security</Badge>
          <Badge variant="secondary">Account Settings</Badge>
        </div>
      </div>

      {/* Quick Access */}
      <Alert className="mb-8">
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>Quick Access:</strong> You can access all privacy settings from your Account Settings &gt; Privacy &amp; Security section.
        </AlertDescription>
      </Alert>

      {/* Profile Privacy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profile Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Profile Visibility</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Public Profile</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Control what information is visible on your public profile page.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Display name and username</li>
                  <li>Profile picture and banner</li>
                  <li>Bio and description</li>
                  <li>Subscriber count (can be hidden)</li>
                  <li>Content preview thumbnails</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Discovery Settings</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose how others can find your profile.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Appear in search results</li>
                  <li>Show in recommended creators</li>
                  <li>Allow tagging by other users</li>
                  <li>Display in category browsing</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Online Status</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Control when others can see that you're online.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Show online status to subscribers</li>
                  <li>Display last seen information</li>
                  <li>Active now indicator</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Privacy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Content Privacy Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Content Visibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Free Content</h4>
                <ul className="text-sm space-y-1">
                  <li>• Visible to all visitors</li>
                  <li>• Used for profile preview</li>
                  <li>• Helps attract subscribers</li>
                  <li>• Can be disabled entirely</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Subscriber Content</h4>
                <ul className="text-sm space-y-1">
                  <li>• Visible to paid subscribers only</li>
                  <li>• Different tiers have different access</li>
                  <li>• Can set specific privacy levels</li>
                  <li>• Watermarking available</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Download Protection</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Right-click protection</p>
                  <p className="text-sm text-muted-foreground">Disable right-click saving on images and videos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Watermarking</p>
                  <p className="text-sm text-muted-foreground">Add your username watermark to all content</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Screen capture detection</p>
                  <p className="text-sm text-muted-foreground">Get notified when users try to screenshot content</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Privacy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Communication & Interaction Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Messaging Settings</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Who can message you</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Everyone (requires tip)</li>
                  <li>Subscribers only</li>
                  <li>VIP subscribers only</li>
                  <li>Nobody (disable messages)</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Message filters</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Auto-filter inappropriate content</li>
                  <li>Require keywords for initial messages</li>
                  <li>Block users with new accounts</li>
                  <li>Minimum tip requirements</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Comments & Interactions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Comments on posts:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>All subscribers can comment</li>
                  <li>VIP subscribers only</li>
                  <li>Comments disabled</li>
                  <li>Pre-moderation required</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Reactions & likes:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Show like counts publicly</li>
                  <li>Hide reaction counts</li>
                  <li>Disable reactions entirely</li>
                  <li>Subscriber-only reactions</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Privacy & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Analytics Sharing</h3>
            <p className="text-muted-foreground mb-4">
              Control what data is shared and how your analytics are used.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Share engagement statistics</p>
                  <p className="text-sm text-muted-foreground">Allow OnlyFur to use your data for platform improvements</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Marketing communications</p>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and platform updates</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Third-party integrations</p>
                  <p className="text-sm text-muted-foreground">Allow approved third-party tools to access your data</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Change Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Change Your Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium">Go to Account Settings</p>
                <p className="text-sm text-muted-foreground">Click your profile picture &gt; Settings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium">Navigate to Privacy & Security</p>
                <p className="text-sm text-muted-foreground">Find the privacy section in the left sidebar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium">Adjust Your Preferences</p>
                <p className="text-sm text-muted-foreground">Toggle settings and save your changes</p>
              </div>
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
            <Link to="/help/articles/content-protection" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Content Protection</h4>
              <p className="text-sm text-muted-foreground">Protect your creative content</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;

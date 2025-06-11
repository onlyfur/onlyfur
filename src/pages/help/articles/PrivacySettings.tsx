import React from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, Users, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PrivacySettings: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link to="/help">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6 text-primary" />
            Privacy Settings and Content Visibility
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn how to control who can see your content and profile information on OnlyFur.
          </p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your privacy is important to us. Take time to review and set up your privacy settings to ensure your content is only visible to your intended audience.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Content Visibility Levels</h2>
            <p className="mb-6">
              OnlyFur offers multiple visibility options for your content, giving you precise control over who can see what you share.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Public</h3>
                  <p className="text-muted-foreground mb-2">
                    Content is visible to everyone, including non-registered users and search engines.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Best for:</span> Promotional content, free samples, and content meant to attract new subscribers.
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Registered Users Only</h3>
                  <p className="text-muted-foreground mb-2">
                    Content is visible to anyone with an OnlyFur account, but not to unregistered visitors.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Best for:</span> Content that's free but you want some level of community protection.
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Subscribers Only</h3>
                  <p className="text-muted-foreground mb-2">
                    Content is only visible to users who have an active subscription to your content.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Best for:</span> Your premium content that forms the core of your subscription offering.
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Tier-Specific</h3>
                  <p className="text-muted-foreground mb-2">
                    Content is only visible to subscribers of specific tier levels (Basic, Pro, VIP, etc.).
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Best for:</span> Creating exclusive content for higher-tier subscribers.
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <EyeOff className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Private</h3>
                  <p className="text-muted-foreground mb-2">
                    Content is only visible to you and any specific users you manually grant access to.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Best for:</span> Custom commissions, work-in-progress content, or content for specific patrons.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Setting Content Privacy</h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">When Uploading New Content</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>Start the content upload process</li>
                  <li>Fill in your content details (title, description, etc.)</li>
                  <li>In the "Visibility" section, select your desired privacy level</li>
                  <li>If choosing "Tier-Specific," select which subscription tiers can access the content</li>
                  <li>Complete the upload process</li>
                </ol>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Changing Privacy for Existing Content</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>Go to your Content Management dashboard</li>
                  <li>Find and select the content you want to modify</li>
                  <li>Click "Edit" or the settings icon</li>
                  <li>Change the "Visibility" setting</li>
                  <li>Save your changes</li>
                </ol>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Batch Privacy Changes</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>Go to your Content Management dashboard</li>
                  <li>Use the checkboxes to select multiple content items</li>
                  <li>Click the "Bulk Actions" dropdown</li>
                  <li>Select "Change Visibility"</li>
                  <li>Choose the new visibility setting for all selected items</li>
                  <li>Confirm the changes</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Privacy Settings</h2>
            
            <div className="space-y-6">
              <p className="text-muted-foreground">
                In addition to content privacy, you can control various aspects of your profile's visibility.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Profile Visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Control whether your profile appears in search results and creator directories.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Activity Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose whether others can see when you're online or when you were last active.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Subscriber Count</h3>
                  <p className="text-sm text-muted-foreground">
                    Decide if your subscriber count is visible to others or kept private.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Messaging Permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Set who can send you direct messages (everyone, subscribers only, or no one).
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">How to Access Profile Privacy Settings</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Click on your profile picture in the top-right corner</li>
                  <li>Select "Settings" from the dropdown menu</li>
                  <li>Navigate to the "Privacy" tab</li>
                  <li>Adjust your settings as desired</li>
                  <li>Save your changes</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Content Protection Features</h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                OnlyFur provides several features to help protect your content from unauthorized sharing.
              </p>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Watermarking</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically add watermarks to your images and videos with your username or custom text. Configure this in Settings → Content → Watermarking.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Download Restrictions</h3>
                <p className="text-sm text-muted-foreground">
                  Control whether subscribers can download your content or only view it in the browser. Set this per content item or as a default in your settings.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Screenshot Prevention</h3>
                <p className="text-sm text-muted-foreground">
                  Enable screenshot detection and prevention for your premium content. This feature works on most modern browsers and mobile apps.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">DMCA Protection</h3>
                <p className="text-sm text-muted-foreground">
                  OnlyFur actively monitors for unauthorized sharing of your content and provides tools to report copyright infringement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Privacy Best Practices</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Regular Privacy Audits</h3>
                <p className="text-sm text-muted-foreground">
                  Periodically review your content and privacy settings to ensure everything is set up as intended.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Test Your Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Use an alternate account or ask a trusted friend to verify your privacy settings are working as expected.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Be Cautious with Public Content</h3>
                <p className="text-sm text-muted-foreground">
                  Remember that public content can be viewed by anyone and may appear in search engines. Use this visibility level carefully.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Use Watermarks Consistently</h3>
                <p className="text-sm text-muted-foreground">
                  Apply watermarks to all premium content to discourage unauthorized sharing and help identify your work.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link to="/help">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Help Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
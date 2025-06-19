import React from 'react';
import { ArrowLeft, User, Camera, Star, Settings, CheckCircle, Image, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const SettingUpCreatorProfile: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <User className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">Setting Up Your Creator Profile</h1>
            <p className="text-muted-foreground">Build an attractive and effective creator profile to attract subscribers</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Creator Setup</Badge>
          <Badge variant="secondary">Profile</Badge>
          <Badge variant="secondary">Getting Started</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-purple-200 bg-purple-50">
        <Star className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <strong>First Impressions Matter:</strong> Your creator profile is your digital storefront. A well-crafted profile can significantly increase your subscriber conversion rate and long-term success.
        </AlertDescription>
      </Alert>

      {/* Setup Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile Setup Steps
          </CardTitle>
          <CardDescription>
            Complete guide to creating your creator profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Profile Settings</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Navigate to your account dashboard and click <strong>Edit Profile</strong> to begin customizing your creator presence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Upload Profile & Cover Images</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Add high-quality images that represent your brand, art style, or furry persona. These are the first things visitors see.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded">
                    <Camera className="h-4 w-4 text-blue-600" />
                    <span>Profile: 400x400px recommended</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded">
                    <Image className="h-4 w-4 text-green-600" />
                    <span>Cover: 1920x480px recommended</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Write Your Bio</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Create a compelling bio that describes your content, artistic style, posting schedule, and what subscribers can expect.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/help/articles/profile-setup">Bio Writing Tips</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Set Subscription Tiers & Pricing</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Configure your subscription levels with clear benefits and competitive pricing to attract different types of supporters.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/help/articles/pricing-strategies">Pricing Strategies</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">5</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Add Social Links & Tags</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Connect your social media accounts and add relevant tags to help people discover your content.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-green-600">6</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preview & Publish</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Review your complete profile, make any final adjustments, then save and publish your creator page.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Optimization Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Profile Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Best Practices</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use high-resolution, professional-looking images</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Write an authentic, engaging bio that shows personality</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Clearly communicate what subscribers get</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Update profile regularly with fresh content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use relevant tags for better discoverability</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Common Mistakes</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Using low-quality or inappropriate images</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Writing vague or overly long bios</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Pricing tiers without clear value differences</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Forgetting to add contact/social information</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Never updating or maintaining the profile</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ready to Start Creating?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Once your profile is set up, you're ready to start uploading content and building your subscriber base!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/help/articles/upload-organize-content">Upload Your First Content</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help/articles/creator-earnings">Creator Earnings Guide</Link>
            </Button>
          </div>
        </CardContent>      </Card>
    </div>
  );
};

export default SettingUpCreatorProfile;

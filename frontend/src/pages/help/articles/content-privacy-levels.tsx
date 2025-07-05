import React from 'react';
import { Lock, Users, Globe, Shield, Eye, Settings, Star, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';

const ContentPrivacyLevels: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Lock className="h-8 w-8 text-purple-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Privacy Levels
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Master content privacy settings to control who can access your content and maximize your earning potential.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Privacy</Badge>
            <Badge variant="secondary">Access Control</Badge>
            <Badge variant="secondary">Monetization</Badge>
            <Badge variant="secondary">Settings</Badge>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Tip:</strong> Strategic use of privacy levels can significantly increase subscriber engagement and revenue. Choose the right level for each piece of content.
        </AlertDescription>
      </Alert>

      {/* Privacy Levels Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Available Privacy Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {/* Public Content */}
            <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Public Content</h3>
                <Badge variant="secondary" className="text-green-700 border-green-300">Free</Badge>
              </div>
              <p className="text-green-700 mb-3">
                Visible to everyone, including non-registered users. Perfect for attracting new followers.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Best for:</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Promotional content</li>
                    <li>• Teasers and previews</li>
                    <li>• Behind-the-scenes content</li>
                    <li>• Building your brand</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Benefits:</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Maximum visibility</li>
                    <li>• SEO benefits</li>
                    <li>• Social media sharing</li>
                    <li>• Attracts new subscribers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Subscriber Only */}
            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Subscribers Only</h3>
                <Badge variant="secondary" className="text-blue-700 border-blue-300">Paid</Badge>
              </div>
              <p className="text-blue-700 mb-3">
                Accessible only to your paying subscribers. Your main revenue-generating content.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Best for:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Exclusive content</li>
                    <li>• Premium photos/videos</li>
                    <li>• Regular updates</li>
                    <li>• Main content library</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Benefits:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Guaranteed revenue</li>
                    <li>• Subscriber retention</li>
                    <li>• Content protection</li>
                    <li>• Value proposition</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Premium Tiers */}
            <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <div className="flex items-center gap-3 mb-3">
                <Star className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">Premium Tiers</h3>
                <Badge variant="secondary" className="text-purple-700 border-purple-300">VIP</Badge>
              </div>
              <p className="text-purple-700 mb-3">
                Content for higher-tier subscribers who pay more for exclusive access.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className="font-medium text-purple-800 mb-1">Best for:</h4>
                  <ul className="text-purple-700 space-y-1">
                    <li>• Ultra-exclusive content</li>
                    <li>• Limited edition releases</li>
                    <li>• Personal interactions</li>
                    <li>• Special requests</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-800 mb-1">Benefits:</h4>
                  <ul className="text-purple-700 space-y-1">
                    <li>• Higher revenue per user</li>
                    <li>• VIP subscriber retention</li>
                    <li>• Exclusive community</li>
                    <li>• Premium positioning</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Custom Groups */}
            <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Custom Groups</h3>
                <Badge variant="secondary" className="text-orange-700 border-orange-300">Selective</Badge>
              </div>
              <p className="text-orange-700 mb-3">
                Share content with specific individuals or custom groups you create.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className="font-medium text-orange-800 mb-1">Best for:</h4>
                  <ul className="text-orange-700 space-y-1">
                    <li>• Trusted subscribers</li>
                    <li>• Close supporters</li>
                    <li>• Special occasions</li>
                    <li>• Testing new content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-orange-800 mb-1">Benefits:</h4>
                  <ul className="text-orange-700 space-y-1">
                    <li>• Builds loyalty</li>
                    <li>• Personal connections</li>
                    <li>• Content testing</li>
                    <li>• Risk management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Set Privacy Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Setting Privacy Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">During Upload</h4>
                <p className="text-sm text-gray-600">Choose the privacy level when creating new content using the dropdown menu in the upload form.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Bulk Settings</h4>
                <p className="text-sm text-gray-600">Use the content management dashboard to update privacy levels for multiple posts at once.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Default Settings</h4>
                <p className="text-sm text-gray-600">Set your preferred default privacy level in account settings to streamline the upload process.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Quick Actions:</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <h5 className="font-medium mb-1">Individual Posts:</h5>
                <p className="text-gray-600">Click the settings icon on any post to change its privacy level instantly.</p>
              </div>
              <div>
                <h5 className="font-medium mb-1">Scheduled Content:</h5>
                <p className="text-gray-600">Set privacy levels for scheduled posts to automatically publish with the right access level.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Strategic Privacy Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Content Strategy</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use public content as a "funnel" to attract new subscribers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Reserve your best content for paying subscribers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Create urgency with limited-time exclusive content</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Reward loyal subscribers with premium tier access</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Revenue Optimization</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use tiered pricing with different content access levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Offer previews to encourage subscriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Create exclusive content for long-term subscribers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use custom groups for premium experiences</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-1">Review Regularly</h4>
              <p className="text-sm text-gray-600">Audit your content privacy settings monthly to ensure they align with your strategy.</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-1">Know Your Audience</h4>
              <p className="text-sm text-gray-600">Understand what your different subscriber tiers want and adjust content accordingly.</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-1">Test and Adapt</h4>
              <p className="text-sm text-gray-600">Experiment with different privacy strategies and measure subscriber engagement.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Common Privacy Mistakes to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-1">Making Everything Public</h4>
              <p className="text-sm text-red-700">This eliminates incentive to subscribe and reduces revenue potential.</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-1">No Public Content</h4>
              <p className="text-sm text-red-700">Without public content, new users can't discover you or see what you offer.</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-1">Inconsistent Strategy</h4>
              <p className="text-sm text-red-700">Randomly changing privacy levels confuses subscribers and affects retention.</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-1">Ignoring Analytics</h4>
              <p className="text-sm text-red-700">Not tracking which privacy levels perform best limits optimization opportunities.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help with Privacy Settings?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Content Strategy Guide</h4>
              <p className="text-sm text-blue-700 mb-3">
                Learn advanced content strategies to maximize your earnings with privacy levels.
              </p>
              <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Read Strategy Guide
              </button>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Get Support</h4>
              <p className="text-sm text-green-700 mb-3">
                Questions about privacy settings? Our team can help optimize your strategy.
              </p>
              <button className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Contact Support
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentPrivacyLevels;

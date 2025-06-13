import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Eye, Lock, Globe, Users, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentPrivacyLevels: React.FC = () => {
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
          <Shield className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Creator Tools</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Setting content privacy levels</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to control who can see your content with OnlyFur's flexible privacy system.
        </p>
      </div>

      {/* Privacy Overview */}
      <Card className="mb-8 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Privacy Control System</h3>
          <p className="text-muted-foreground mb-4">
            OnlyFur gives you complete control over who can access your content. Set different privacy levels for different types of posts to maximize both reach and revenue.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Public</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Subscribers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Premium</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Private</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Public Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-green-500" />
              Public Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Who Can See Public Content:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>• Anyone browsing OnlyFur (even without an account)</li>
                <li>• Search engines can index public posts</li>
                <li>• Appears in discovery feeds and recommendations</li>
                <li>• Shareable outside the platform</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Best Uses for Public Content:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-green-600 mb-2">Portfolio Pieces</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Showcase your best work</li>
                    <li>• Demonstrate your art style</li>
                    <li>• Attract new followers</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-green-600 mb-2">Teasers & Previews</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Crop or low-res versions</li>
                    <li>• Behind-the-scenes glimpses</li>
                    <li>• Work-in-progress shots</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-green-600 mb-2">Announcements</h5>
                  <ul className="text-xs space-y-1">
                    <li>• New content notifications</li>
                    <li>• Schedule updates</li>
                    <li>• Community events</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-green-600 mb-2">Community Posts</h5>
                  <ul className="text-xs space-y-1">
                    <li>• General updates</li>
                    <li>• Thank you messages</li>
                    <li>• Question prompts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Strategy Tip:</strong> Use public content to build your audience and give potential subscribers a taste of your work. Think of it as your storefront window!</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscriber Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Subscriber-Only Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Who Can See Subscriber Content:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>• Any active subscriber (all tiers)</li>
                <li>• Hidden from non-subscribers and public feeds</li>
                <li>• Not searchable by non-subscribers</li>
                <li>• Protected from external sharing</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Ideal for Subscriber Content:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-blue-600 mb-2">Full Artwork</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Complete illustrations</li>
                    <li>• High-resolution images</li>
                    <li>• Multiple angles/versions</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-blue-600 mb-2">Extended Content</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Full photo sets</li>
                    <li>• Complete video content</li>
                    <li>• Unedited versions</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-blue-600 mb-2">Personal Updates</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Life updates</li>
                    <li>• Creative process insights</li>
                    <li>• Personal stories</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-blue-600 mb-2">Exclusive Series</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Ongoing art series</li>
                    <li>• Character development</li>
                    <li>• Tutorial series</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Strategy Tip:</strong> This is your main content delivery method. Regular, high-quality subscriber posts keep your audience engaged and justify their subscription cost.</p>
            </div>
          </CardContent>
        </Card>

        {/* Premium Tier Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2 text-purple-500" />
              Premium Tier Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Who Can See Premium Content:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>• Only Premium and VIP tier subscribers</li>
                <li>• Higher-paying supporters get exclusive access</li>
                <li>• Creates incentive for tier upgrades</li>
                <li>• Most exclusive shareable content</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Premium Content Ideas:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-purple-600 mb-2">Exclusive Artwork</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Premium character designs</li>
                    <li>• Alternative versions</li>
                    <li>• Higher detail/resolution</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-purple-600 mb-2">Early Access</h5>
                  <ul className="text-xs space-y-1">
                    <li>• New content 1-3 days early</li>
                    <li>• Preview of upcoming projects</li>
                    <li>• First look at commissions</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-purple-600 mb-2">Process Content</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Step-by-step creation process</li>
                    <li>• Time-lapse videos</li>
                    <li>• Detailed tutorials</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-purple-600 mb-2">Interactive Content</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Q&A sessions</li>
                    <li>• Polls for next projects</li>
                    <li>• Live drawing sessions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Strategy Tip:</strong> Premium content should feel significantly more valuable than regular subscriber content. This justifies the higher price point and encourages upgrades.</p>
            </div>
          </CardContent>
        </Card>

        {/* Private Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-red-500" />
              Private Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Who Can See Private Content:</h4>
              <ul className="text-sm space-y-1 mb-4">
                <li>• Only you (the creator) can see private content</li>
                <li>• Not visible to any subscribers or followers</li>
                <li>• Perfect for drafts and personal organization</li>
                <li>• Can be changed to public later</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Uses for Private Content:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-red-600 mb-2">Draft Management</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Work-in-progress uploads</li>
                    <li>• Content waiting for editing</li>
                    <li>• Scheduled posts in development</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-red-600 mb-2">Personal Archive</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Personal reference materials</li>
                    <li>• Backup copies of work</li>
                    <li>• Notes and planning documents</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-red-600 mb-2">Content Testing</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Test different versions</li>
                    <li>• Preview how content looks</li>
                    <li>• Check formatting and quality</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-red-600 mb-2">Sensitive Content</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Content under review</li>
                    <li>• Personal/family photos</li>
                    <li>• Content for specific audiences</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Strategy Tip:</strong> Use private content as a staging area. Upload everything as private first, then decide the appropriate privacy level before making it visible.</p>
            </div>
          </CardContent>
        </Card>

        {/* Setting Privacy Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              How to Set Privacy Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">When Uploading New Content:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Upload Your Content</p>
                    <p className="text-muted-foreground">Choose files and add title/description</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Select Privacy Level</p>
                    <p className="text-muted-foreground">Choose from Public, Subscribers, Premium, or Private</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Set Additional Options</p>
                    <p className="text-muted-foreground">Enable/disable downloads, comments, and other features</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Review and Post</p>
                    <p className="text-muted-foreground">Double-check settings before publishing</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Changing Privacy After Posting:</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <ul className="text-sm space-y-1">
                  <li>• Edit any post to change its privacy level</li>
                  <li>• Can move content between public and subscriber levels</li>
                  <li>• Premium content can be made more or less exclusive</li>
                  <li>• Changes take effect immediately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Strategy */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Level Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Recommended Content Distribution:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium">For New Creators:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Public Content:</span>
                      <span className="font-medium">40-50%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscriber Content:</span>
                      <span className="font-medium">40-50%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Content:</span>
                      <span className="font-medium">10-20%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="font-medium">For Established Creators:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Public Content:</span>
                      <span className="font-medium">20-30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscriber Content:</span>
                      <span className="font-medium">50-60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Content:</span>
                      <span className="font-medium">20-30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Privacy Best Practices:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Do:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Start with private, then decide privacy level</li>
                    <li>• Use public content to attract new followers</li>
                    <li>• Make premium content significantly more valuable</li>
                    <li>• Be consistent with your privacy strategy</li>
                    <li>• Listen to subscriber feedback about content mix</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-600 mb-2">❌ Don't:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Make all content premium (limits growth)</li>
                    <li>• Give away your best work for free</li>
                    <li>• Change privacy levels too frequently</li>
                    <li>• Forget to set privacy before posting</li>
                    <li>• Ignore which content performs best where</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Success Tip:</strong> Use analytics to track which privacy levels generate the most engagement, subscriptions, and revenue. Adjust your strategy based on real data!</p>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Privacy Features */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Privacy Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Additional Privacy Controls:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Download Permissions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Allow/disallow content downloads</li>
                    <li>• Set different rules per privacy level</li>
                    <li>• High-resolution vs. preview only</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Comment Controls</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Enable/disable comments per post</li>
                    <li>• Subscriber-only commenting</li>
                    <li>• Moderate comments before posting</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Sharing Controls</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Prevent sharing of subscriber content</li>
                    <li>• Watermark protection</li>
                    <li>• Link sharing restrictions</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Geographic Restrictions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Block content in specific regions</li>
                    <li>• Age verification requirements</li>
                    <li>• Compliance with local laws</li>
                  </ul>
                </div>
              </div>
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
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/upload-organize-content" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Uploading and organizing your content</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn the basics of content upload</p>
            </Link>
            <Link to="/help/articles/pricing-strategies" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Pricing strategies for creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Set the right prices for your tiers</p>
            </Link>
            <Link to="/help/articles/understanding-analytics" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding creator analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">Track your content performance</p>
            </Link>
            <Link to="/help/articles/community-guidelines" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Community guidelines overview</h4>
              <p className="text-sm text-muted-foreground mt-1">Understand content policies</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Privacy Settings?</h3>
          <p className="mb-4 opacity-90">Our support team can help you optimize your content privacy strategy for maximum growth and revenue.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Get Privacy Help</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentPrivacyLevels;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Heart, Users, Filter, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const FindingCreators: React.FC = () => {
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
          <Search className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Getting Started</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Finding and following creators</h1>
        <p className="text-xl text-muted-foreground">
          Discover amazing furry content creators and build your personalized feed on OnlyFur.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Discovery Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              How to Discover Creators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-purple-600 mb-2">Explore Page</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Browse trending creators and content categories
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Featured creators spotlight</li>
                  <li>• Popular content categories</li>
                  <li>• Trending tags and topics</li>
                  <li>• Recently active creators</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Search Function</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Use keywords to find specific creators or content
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Search by username or display name</li>
                  <li>• Find creators by content type</li>
                  <li>• Filter by subscription tier pricing</li>
                  <li>• Location-based discovery</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-green-600 mb-2">Categories</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Browse by specific content categories
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Digital Art & Illustrations</li>
                  <li>• Fursuit Photography</li>
                  <li>• Stories & Writing</li>
                  <li>• Videos & Animations</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-orange-600 mb-2">Recommendations</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Personalized suggestions based on your interests
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Similar creator suggestions</li>
                  <li>• Based on your subscriptions</li>
                  <li>• Content you've liked</li>
                  <li>• Popular in your region</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Search Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Search Techniques</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Username Search</p>
                  <p className="text-xs text-muted-foreground">Use @ symbol to search for exact usernames: @artistname</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Content Type Search</p>
                  <p className="text-xs text-muted-foreground">Search by content type: "digital art", "fursuit photos", "stories"</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Tag Search</p>
                  <p className="text-xs text-muted-foreground">Use # symbol for tags: #furry #art #commission</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Price Range Filter</p>
                  <p className="text-xs text-muted-foreground">Filter by subscription price range using the price slider</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Search Filters</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">Content Type</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Digital Art</li>
                    <li>• Photography</li>
                    <li>• Videos</li>
                    <li>• Written Content</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Pricing</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Free content only</li>
                    <li>• Under $10/month</li>
                    <li>• $10-25/month</li>
                    <li>• Premium ($25+)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Activity</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Recently active</li>
                    <li>• New creators</li>
                    <li>• Verified creators</li>
                    <li>• Most popular</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Following Creators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Following vs. Subscribing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Following (Free)</h4>
                <ul className="text-sm space-y-1">
                  <li>• See public posts in your feed</li>
                  <li>• Get notifications for new content</li>
                  <li>• Access to free content only</li>
                  <li>• Can comment on public posts</li>
                  <li>• View creator's public profile</li>
                </ul>
                <Button className="w-full mt-3" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Follow
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-purple-600 mb-2">Subscribing (Paid)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Access to all subscriber content</li>
                  <li>• Exclusive posts and early access</li>
                  <li>• Direct messaging capabilities</li>
                  <li>• Higher resolution downloads</li>
                  <li>• Support the creator financially</li>
                </ul>
                <Button className="w-full mt-3">
                  <Users className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pro Tip:</strong> Follow creators first to see their public content, then subscribe to those you want to support with premium access!</p>
            </div>
          </CardContent>
        </Card>

        {/* Creator Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Creator Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Art & Visual Content</h4>
                <ul className="text-sm space-y-1">
                  <li>• <span className="font-medium">Digital Artists:</span> Character illustrations, commissions</li>
                  <li>• <span className="font-medium">Traditional Artists:</span> Paintings, sketches, crafts</li>
                  <li>• <span className="font-medium">3D Artists:</span> Models, animations, renders</li>
                  <li>• <span className="font-medium">Photographers:</span> Fursuit photos, nature shots</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Performance & Media</h4>
                <ul className="text-sm space-y-1">
                  <li>• <span className="font-medium">Fursuiters:</span> Costume performances, photos</li>
                  <li>• <span className="font-medium">Streamers:</span> Live gaming, art streams</li>
                  <li>• <span className="font-medium">Voice Artists:</span> Audio content, readings</li>
                  <li>• <span className="font-medium">Musicians:</span> Original songs, covers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Writing & Stories</h4>
                <ul className="text-sm space-y-1">
                  <li>• <span className="font-medium">Fiction Writers:</span> Short stories, novels</li>
                  <li>• <span className="font-medium">Poets:</span> Original poetry, spoken word</li>
                  <li>• <span className="font-medium">Bloggers:</span> Lifestyle, tutorials, reviews</li>
                  <li>• <span className="font-medium">Comic Artists:</span> Webcomics, graphic novels</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lifestyle & Community</h4>
                <ul className="text-sm space-y-1">
                  <li>• <span className="font-medium">Lifestyle Creators:</span> Daily life, vlogs</li>
                  <li>• <span className="font-medium">Educators:</span> Tutorials, how-to guides</li>
                  <li>• <span className="font-medium">Community Leaders:</span> Event organizers</li>
                  <li>• <span className="font-medium">Reviewers:</span> Product reviews, recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Your Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Building Your Perfect Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Feed Customization Tips</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Start with Interests</p>
                    <p className="text-muted-foreground">Follow creators in categories you enjoy most</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Diversify Content Types</p>
                    <p className="text-muted-foreground">Mix art, stories, photos, and videos for variety</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Support Different Sizes</p>
                    <p className="text-muted-foreground">Follow both large and small creators for unique content</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Engage Actively</p>
                    <p className="text-muted-foreground">Like, comment, and share to improve recommendations</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h5 className="font-semibold mb-2">Feed Organization Tips:</h5>
              <ul className="text-sm space-y-1">
                <li>• Use Lists to organize creators by category</li>
                <li>• Turn on notifications for your favorite creators</li>
                <li>• Regularly review and unfollow inactive accounts</li>
                <li>• Discover new creators through your feed's suggestions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Etiquette and Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Community Etiquette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Following Etiquette</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Do:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Engage genuinely with content you enjoy</li>
                    <li>• Leave thoughtful comments</li>
                    <li>• Share creators you love with friends</li>
                    <li>• Respect creators' boundaries and rules</li>
                    <li>• Support creators financially when possible</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-600 mb-2">❌ Don't:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Spam comments or self-promote</li>
                    <li>• Demand free content or special treatment</li>
                    <li>• Repost creators' work without permission</li>
                    <li>• Harass creators for not responding immediately</li>
                    <li>• Share subscription content publicly</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Remember:</strong> Creators are real people running businesses. Treat them with respect and kindness, and you'll build better relationships in the community!</p>
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
            <Link to="/help/articles/first-subscription" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Your first subscription - what to expect</h4>
              <p className="text-sm text-muted-foreground mt-1">Guide for new subscribers</p>
            </Link>
            <Link to="/help/articles/subscription-tiers" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding subscription tiers</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn about Basic, Pro, and VIP levels</p>
            </Link>
            <Link to="/help/articles/messaging-creators" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How to message creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Start conversations with your favorite creators</p>
            </Link>
            <Link to="/help/articles/community-guidelines" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Community guidelines overview</h4>
              <p className="text-sm text-muted-foreground mt-1">Understanding our community standards</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help Finding Creators?</h3>
          <p className="mb-4 opacity-90">Our community team can help you discover creators that match your interests.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Get Discovery Help</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FindingCreators;

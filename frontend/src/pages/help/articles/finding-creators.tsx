import React from 'react';
import { ArrowLeft, Search, Users, Heart, Filter, Star, Compass, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const FindingCreators: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Compass className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">Finding Creators</h1>
            <p className="text-muted-foreground">Discover amazing furry creators and build connections in the community</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Discovery</Badge>
          <Badge variant="secondary">Community</Badge>
          <Badge variant="secondary">Search</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-purple-200 bg-purple-50">
        <Heart className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <strong>Explore & Connect:</strong> OnlyFur has thousands of talented creators waiting to share their amazing content with you. Use our powerful discovery tools to find your new favorites!
        </AlertDescription>
      </Alert>

      {/* Search Methods */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Ways to Discover Creators
          </CardTitle>
          <CardDescription>
            Multiple methods to find creators that match your interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600 mb-2">Search Bar</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Search by creator username or display name</li>
                  <li>• Look for specific content tags or keywords</li>
                  <li>• Find creators by art style or niche</li>
                  <li>• Use quotation marks for exact phrases</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Featured Sections</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Homepage featured creators spotlight</li>
                  <li>• New creator recommendations</li>
                  <li>• Staff picks and curated collections</li>
                  <li>• Rising stars and trending creators</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-600 mb-2">Browse Categories</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Art styles (digital, traditional, 3D)</li>
                  <li>• Content types (comics, stories, animations)</li>
                  <li>• Species preferences and fursonas</li>
                  <li>• Special interests and fetishes</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-600 mb-2">Community Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Creator recommendations from friends</li>
                  <li>• Similar creators suggestions</li>
                  <li>• Community forums and discussions</li>
                  <li>• Social media integrations</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Search Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Search Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-3">Search Filters</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Content Type:</strong> Art, stories, videos, streams</li>
                  <li>• <strong>Subscription Price:</strong> Free to premium ranges</li>
                  <li>• <strong>Activity Level:</strong> Recently active creators</li>
                  <li>• <strong>Verification Status:</strong> Verified creators only</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-3">Smart Recommendations</h4>
                <ul className="text-sm space-y-2">
                  <li>• Based on your subscription history</li>
                  <li>• Similar to creators you follow</li>
                  <li>• Matching your interaction patterns</li>
                  <li>• Personalized discovery algorithm</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connecting with Creators */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Connecting with Creators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Once you've found creators you like, there are several ways to connect and support them:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Follow & Subscribe</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Follow creators for free to get updates, or subscribe to access their exclusive content and support their work directly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Search className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Engage with Content</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Like, comment, and share their posts. Most creators love feedback and building relationships with their audience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Commission Custom Work</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Many creators offer custom commissions. Check their profile for commission information and pricing details.
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/help/articles/custom-commissions">Commission Guide</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Send Tips & Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Show appreciation with tips or one-time payments. It's a great way to support creators without ongoing subscriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discovery Best Practices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Making the Most of Your Discovery Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Do's</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Take time to read creator profiles and descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Check out preview content before subscribing</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Respect creators' boundaries and content preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use wishlist/favorites to keep track of interesting creators</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Don'ts</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Don't request content outside creator's stated boundaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Avoid pressuring creators for free content or discounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Don't share or redistribute creators' exclusive content</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Don't spam creators with excessive messages or requests</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Start Exploring?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Now that you know how to find creators, start exploring and building your community of favorite artists!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/help/articles/first-subscription">Your First Subscription</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help/articles/messaging-creators">Messaging Creators</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FindingCreators;

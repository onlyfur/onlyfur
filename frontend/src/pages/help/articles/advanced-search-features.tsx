import React from 'react';
import { ArrowLeft, Search, Filter, Tag, Star, Clock, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdvancedSearchFeatures: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Advanced Search Features</h1>
            <p className="text-muted-foreground">Master OnlyFur's powerful search tools to find exactly what you need</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Search</Badge>
          <Badge variant="secondary">Discovery</Badge>
          <Badge variant="secondary">Filters</Badge>
        </div>
      </div>

      {/* Quick Start */}
      <Alert className="mb-8">
        <Target className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> Use multiple filters together to narrow down results and find exactly the content or creators you're looking for.
        </AlertDescription>
      </Alert>

      {/* Search Types */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Types of Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Search</h3>
            <p className="text-muted-foreground mb-3">
              Simply type keywords into the search bar to find creators, content, or topics.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Creator names and usernames</li>
              <li>Content titles and descriptions</li>
              <li>Tags and categories</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Neural Search</h3>
            <p className="text-muted-foreground mb-3">
              Our AI-powered search understands context and intent to provide more relevant results.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Natural language queries</li>
              <li>Semantic understanding</li>
              <li>Content recommendations</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Tag-Based Search</h3>
            <p className="text-muted-foreground mb-3">
              Use hashtags and tags to find specific types of content and creators.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Click on any tag to see related content</li>
              <li>Combine multiple tags for precise results</li>
              <li>Discover trending tags</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Content Type Filters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Media Types:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Photos</li>
                  <li>Videos</li>
                  <li>Audio</li>
                  <li>Live streams</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Content Categories:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Art & illustrations</li>
                  <li>Photography</li>
                  <li>Stories & writing</li>
                  <li>Educational content</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Creator Filters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Subscription Tiers:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Free content</li>
                  <li>Basic tier ($5-15)</li>
                  <li>Pro tier ($16-30)</li>
                  <li>VIP tier ($31+)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Creator Stats:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Subscriber count</li>
                  <li>Content frequency</li>
                  <li>Rating/reviews</li>
                  <li>Verification status</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Time & Date Filters</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Content posted in the last day, week, month, or year</li>
              <li>Specific date ranges</li>
              <li>Recently updated creator profiles</li>
              <li>Upcoming live streams and events</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Search Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Pro Search Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Operators & Syntax</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div><code>"exact phrase"</code> - Search for exact phrases in quotes</div>
              <div><code>tag:furry</code> - Search specifically within tags</div>
              <div><code>creator:username</code> - Find content from specific creators</div>
              <div><code>type:video</code> - Filter by content type</div>
              <div><code>tier:pro</code> - Filter by subscription tier</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Sorting Options</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Relevance:</strong> Best match for your search terms</li>
              <li><strong>Newest:</strong> Most recently posted content</li>
              <li><strong>Popular:</strong> Highest engagement and views</li>
              <li><strong>Rating:</strong> Highest-rated content and creators</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Saved Searches</h3>
            <p className="text-muted-foreground">
              Save your favorite search combinations and get notified when new content matches your criteria.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search Shortcuts */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Search Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Keyboard Shortcuts:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><code>Ctrl + K</code> - Open search</li>
                <li><code>Tab</code> - Navigate search suggestions</li>
                <li><code>Enter</code> - Execute search</li>
                <li><code>Esc</code> - Clear search</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Popular Searches:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>New creators this week</li>
                <li>Top-rated content</li>
                <li>Free content</li>
                <li>Live streams today</li>
              </ul>
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
            <Link to="/help/articles/neural-search" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Neural Search Guide</h4>
              <p className="text-sm text-muted-foreground">Learn about our AI-powered search</p>
            </Link>
            <Link to="/help/articles/finding-creators" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Finding Creators</h4>
              <p className="text-sm text-muted-foreground">Tips for discovering new creators</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearchFeatures;

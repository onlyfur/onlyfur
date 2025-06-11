import React from 'react';
import { ArrowLeft, Search, Filter, SortAsc, Image, Calendar, Tag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AdvancedSearchFeatures: React.FC = () => {
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
            <Filter className="h-6 w-6 text-primary" />
            Advanced Search Features
          </h1>
          <p className="text-muted-foreground text-lg">
            Master OnlyFur's powerful search tools to find exactly what you're looking for with precision and ease.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Search Filters</h2>
            <p className="mb-6">
              OnlyFur offers a comprehensive set of filters to narrow down your search results and find exactly what you're looking for.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Content Type Filters</h3>
                  <p className="text-muted-foreground mb-2">
                    Filter results by specific content types:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Images (Artwork, Photos, Sketches)</li>
                    <li>Videos (Animations, Tutorials, Timelapses)</li>
                    <li>Written Content (Stories, Guides)</li>
                    <li>Creators (Profiles matching your search)</li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Date Range Filters</h3>
                  <p className="text-muted-foreground mb-2">
                    Find content based on when it was published:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Today</li>
                    <li>This Week</li>
                    <li>This Month</li>
                    <li>This Year</li>
                    <li>Custom Date Range</li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <SortAsc className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Sort Options</h3>
                  <p className="text-muted-foreground mb-2">
                    Arrange search results by:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Relevance (Default for Neural Search)</li>
                    <li>Newest First</li>
                    <li>Oldest First</li>
                    <li>Most Popular</li>
                    <li>Most Liked</li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Creator Type Filters</h3>
                  <p className="text-muted-foreground mb-2">
                    Find specific types of creators:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Digital Artists</li>
                    <li>Traditional Artists</li>
                    <li>Animators</li>
                    <li>Writers</li>
                    <li>Costume Makers</li>
                    <li>Verified Creators</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Visual Search</h2>
            <p className="mb-4">
              Visual Search allows you to upload an image and find similar content or creators with matching styles.
            </p>
            
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">How to Use Visual Search</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>Click the search icon or press <kbd className="px-2 py-1 bg-background rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-background rounded text-xs">K</kbd></li>
                  <li>Switch to "Visual" search mode</li>
                  <li>Click "Upload Image" or drag and drop an image</li>
                  <li>Adjust filters if needed</li>
                  <li>Browse results that match your image's style, content, or theme</li>
                </ol>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Best Uses for Visual Search</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>Find creators with a specific art style you like</li>
                  <li>Discover content similar to an image you already enjoy</li>
                  <li>Search for characters with similar designs or features</li>
                  <li>Find variations of a particular theme or concept</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Search Operators and Techniques</h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Exact Phrase Matching</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Use quotation marks to search for an exact phrase:
                </p>
                <div className="bg-muted p-2 rounded text-sm font-mono">
                  "character design tutorial"
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Exclusion</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Use the minus sign to exclude terms from your search:
                </p>
                <div className="bg-muted p-2 rounded text-sm font-mono">
                  fox -realistic
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This will find fox content but exclude realistic styles.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Tag Searching</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Search for specific tags using the hashtag symbol:
                </p>
                <div className="bg-muted p-2 rounded text-sm font-mono">
                  #digitalart #commission
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Creator-Specific Search</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Search within a specific creator's content:
                </p>
                <div className="bg-muted p-2 rounded text-sm font-mono">
                  @username dragon
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This will find dragon-related content from that specific creator.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Search History and Saved Searches</h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                OnlyFur keeps track of your recent searches to help you quickly return to previous queries.
              </p>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Accessing Search History</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Open the search modal</li>
                  <li>Click on the "Recent" tab</li>
                  <li>View and click on any previous search to run it again</li>
                </ol>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Saving Favorite Searches</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Perform a search with your desired query and filters</li>
                  <li>Click the "Save" icon next to the search bar</li>
                  <li>Give your saved search a name</li>
                  <li>Access saved searches from the "Saved" tab in the search modal</li>
                </ol>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Clearing Search History</h3>
                <p className="text-sm text-muted-foreground">
                  To clear your search history, go to the "Recent" tab in the search modal and click "Clear History" at the bottom.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Search Settings and Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Default Search Mode</h3>
                  <p className="text-muted-foreground">
                    You can set your preferred default search mode (Neural, Traditional, or Visual) in your account settings under "Search Preferences."
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Default Filters</h3>
                  <p className="text-muted-foreground">
                    You can save your preferred default filters for searches, such as always showing only certain content types or creator categories.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Content Preferences</h3>
                  <p className="text-muted-foreground">
                    Set your content preferences to automatically filter search results based on your interests and content maturity settings.
                  </p>
                </div>
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

export default AdvancedSearchFeatures;
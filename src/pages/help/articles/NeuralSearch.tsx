import React from 'react';
import { ArrowLeft, Search, Brain, Sparkles, Filter, Image, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const NeuralSearch: React.FC = () => {
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
            <Brain className="h-6 w-6 text-primary" />
            Neural Search: Finding What You Really Want
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover how OnlyFur's advanced Neural Search helps you find exactly what you're looking for with AI-powered understanding.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">What is Neural Search?</h2>
            <p className="mb-4">
              Neural Search is OnlyFur's AI-powered search technology that understands the meaning behind your search queries, not just the keywords. 
              Unlike traditional search that matches exact words, Neural Search understands concepts, context, and intent to deliver more relevant results.
            </p>
            
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-6">
              <Sparkles className="h-10 w-10 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-medium">How It's Different</h3>
                <p className="text-sm text-muted-foreground">
                  Traditional search only finds exact word matches. Neural Search understands meaning, so searching for "colorful character art" 
                  might also find "vibrant furry illustrations" even if those exact words weren't used.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Semantic Understanding</h3>
                  <p className="text-muted-foreground">
                    Understands the meaning behind your search, not just keywords. This means you can search in natural language and still get relevant results.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Personalized Results</h3>
                  <p className="text-muted-foreground">
                    Neural Search learns from your preferences and past interactions to deliver more personalized results over time.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Visual Search</h3>
                  <p className="text-muted-foreground">
                    Upload an image to find similar content or creators who make similar art styles.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Advanced Filtering</h3>
                  <p className="text-muted-foreground">
                    Combine Neural Search with powerful filters for content type, creator categories, and more to refine your results.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">How to Use Neural Search</h2>
            
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-[2rem]">
                  <span className="font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Access the Search Modal</h3>
                  <p className="text-muted-foreground mb-2">
                    Click the search icon in the navigation bar or press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd> on your keyboard.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-[2rem]">
                  <span className="font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Choose Search Mode</h3>
                  <p className="text-muted-foreground mb-2">
                    Make sure "Neural" is selected as your search mode (it's the default).
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-[2rem]">
                  <span className="font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Enter Your Query</h3>
                  <p className="text-muted-foreground mb-2">
                    Type what you're looking for in natural language. For example: "colorful digital art of anthro characters" or "tutorials for drawing expressions".
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-[2rem]">
                  <span className="font-medium">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Refine with Filters (Optional)</h3>
                  <p className="text-muted-foreground mb-2">
                    Use the filter button to narrow down results by content type, creator category, date range, and more.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-[2rem]">
                  <span className="font-medium">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Explore Results</h3>
                  <p className="text-muted-foreground mb-2">
                    Browse through the semantically relevant results. You can toggle "Neural Insights" to see why certain results were matched.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Tips for Better Results</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-1">Be Specific But Natural</h3>
                <p className="text-sm text-muted-foreground">
                  Instead of just "fox art", try "digital paintings of foxes in fantasy settings" for more targeted results.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-1">Use Visual Search for Style Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a sample image to find creators with similar art styles or content with similar themes.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-1">Combine with Filters</h3>
                <p className="text-sm text-muted-foreground">
                  For the most precise results, use Neural Search with content type and creator filters.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-1">Adjust Neural Boost</h3>
                <p className="text-sm text-muted-foreground">
                  In the advanced settings, you can adjust the Neural Boost slider to control how much the AI influences your search results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Is Neural Search always on?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Yes, by default. However, you can switch to "Traditional" search mode if you prefer exact keyword matching.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Does Neural Search use my personal data?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Neural Search uses your search history and interactions to improve results, but this data is anonymized and never shared. You can disable personalization in settings.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Why are my results different from someone else's for the same search?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Neural Search personalizes results based on your preferences and past interactions. Two users searching for the same term may see different results based on their interests.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Can I search for specific file types?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can use the content type filters to search for specific media types like images, videos, or written content.
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

export default NeuralSearch;
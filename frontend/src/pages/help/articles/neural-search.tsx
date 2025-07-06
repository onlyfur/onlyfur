import React from 'react';
import { ArrowLeft, Search, Brain, Target, Filter, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NeuralSearchCapabilities: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link to="/help">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Neural Search Capabilities
          </h1>
          <p className="text-muted-foreground">AI-powered content discovery</p>
        </div>
      </div>

      {/* Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            What is Neural Search?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Neural Search is OnlyFur's AI-powered search system that understands the meaning 
            and context behind your queries, not just keywords. It uses advanced machine learning 
            to deliver more relevant, personalized results.
          </p>
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Neural Search learns from your preferences and interactions to improve results over time.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Semantic Understanding</Badge>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Searches understand concepts and context, not just exact words
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Content Recognition</Badge>
                </h4>
                <p className="text-sm text-muted-foreground">
                  AI analyzes images, videos, and text to understand content themes
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Personalized Results</Badge>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Results adapt to your preferences and viewing history
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">Natural Language</Badge>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Ask questions in plain English: "Show me cozy winter art from last month"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-500" />
              How to Use Neural Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Natural Language Queries</h4>
                <p className="text-sm text-muted-foreground">
                  Type what you're looking for naturally: "cute fox art with winter themes"
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">2. Use Descriptive Terms</h4>
                <p className="text-sm text-muted-foreground">
                  Include mood, style, or emotions: "wholesome dragon content" or "detailed digital paintings"
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">3. Combine with Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Use traditional filters alongside neural search for precise results
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">4. Refine Results</h4>
                <p className="text-sm text-muted-foreground">
                  Like or skip results to help the AI learn your preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-orange-500" />
              Search Tips & Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Effective Search Examples:</h4>
                <div className="grid gap-2">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-mono">"Cozy autumn wolf art with warm colors"</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-mono">"Action scenes with dragons and magic"</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-mono">"Cute couple art featuring cats"</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-mono">"Dark fantasy artwork with detailed backgrounds"</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Pro Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Be specific about style, mood, or themes you want</li>
                  <li>Use emotional descriptors like "heartwarming" or "intense"</li>
                  <li>Mention art styles: "realistic", "cartoon", "pixel art"</li>
                  <li>Include character types or species for better results</li>
                  <li>Combine multiple concepts: "cyberpunk wolf with neon lighting"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Link to="/help/articles/advanced-search-features" className="block p-3 rounded-md hover:bg-muted transition-colors">
              <h4 className="font-medium">Advanced Search Features</h4>
              <p className="text-sm text-muted-foreground">Use powerful search tools and filters</p>
            </Link>
            <Link to="/help/articles/finding-creators" className="block p-3 rounded-md hover:bg-muted transition-colors">
              <h4 className="font-medium">Finding and Following Creators</h4>
              <p className="text-sm text-muted-foreground">Discover amazing furry content creators</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NeuralSearchCapabilities;

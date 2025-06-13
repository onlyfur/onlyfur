import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Brain, 
  Filter, 
  Image, 
  Sparkles, 
  SortAsc,
  Tag,
  Clock,
  Zap,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchFeatures: React.FC = () => {
  const searchTypes = [
    {
      icon: Brain,
      title: 'Neural Search',
      description: 'AI-powered semantic search',
      details: 'Our advanced neural search understands the meaning behind your queries, not just keywords, delivering more relevant results based on context and intent.'
    },
    {
      icon: Image,
      title: 'Visual Search',
      description: 'Find content using images',
      details: 'Upload an image to find similar content or creators with matching styles, perfect for discovering art in specific styles or themes.'
    },
    {
      icon: Filter,
      title: 'Advanced Filters',
      description: 'Refine results with precision',
      details: 'Use our comprehensive filtering system to narrow down results by content type, creator category, date range, and more.'
    },
    {
      icon: Sparkles,
      title: 'Personalized Results',
      description: 'Results tailored to your interests',
      details: 'Our search engine learns from your interactions to deliver more personalized results over time, helping you discover content you\'ll love.'
    }
  ];

  const searchTips = [
    {
      tip: 'Use natural language queries',
      description: 'With Neural Search, you can type questions or descriptions rather than just keywords.',
      example: '"Colorful digital paintings of anthro characters in fantasy settings"'
    },
    {
      tip: 'Combine search modes',
      description: 'Start with Visual Search to find a style, then refine with text filters.',
      example: 'Upload a reference image, then add filters for "animation" or "tutorial"'
    },
    {
      tip: 'Use quotes for exact phrases',
      description: 'Put phrases in quotes to search for that exact sequence of words.',
      example: '"character design" tutorial'
    },
    {
      tip: 'Exclude terms with minus sign',
      description: 'Use the minus sign to exclude specific terms from your search.',
      example: 'fox -realistic (finds fox content but excludes realistic styles)'
    }
  ];

  const searchFeatures = [
    {
      feature: 'Search History',
      description: 'Access your recent searches to quickly return to previous queries.',
      icon: Clock
    },
    {
      feature: 'Saved Searches',
      description: 'Save your favorite search queries and filters for future use.',
      icon: Sparkles
    },
    {
      feature: 'Neural Boost',
      description: 'Adjust how much the AI influences your search results.',
      icon: Zap
    },
    {
      feature: 'Content Preferences',
      description: 'Set default content preferences to automatically filter results.',
      icon: Eye
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Search Features</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how to use OnlyFur's powerful search tools to find exactly what you're looking for.
        </p>
      </div>

      {/* Search Types */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Search Types</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {searchTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <type.icon className="w-5 h-5 mr-2 text-primary" />
                  {type.title}
                </CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{type.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search Tips */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-6 h-6 mr-3 text-primary" />
            Search Tips & Techniques
          </CardTitle>
          <CardDescription>
            Get better results with these search strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {searchTips.map((tip, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{tip.tip}</h3>
                <p className="text-sm text-muted-foreground mb-3">{tip.description}</p>
                <div className="bg-muted p-2 rounded text-sm font-mono">
                  {tip.example}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-6 h-6 mr-3 text-primary" />
            Advanced Features
          </CardTitle>
          <CardDescription>
            Additional tools to enhance your search experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {searchFeatures.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="grow">
                  <h3 className="font-semibold mb-2">{feature.feature}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Help Articles</CardTitle>
          <CardDescription>
            In-depth guides for search features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/NeuralSearch">
              <Button variant="outline" className="w-full justify-start">
                <Brain className="w-4 h-4 mr-2" />
                Neural Search Guide
              </Button>
            </Link>
            <Link to="/help/articles/AdvancedSearchFeatures">
              <Button variant="outline" className="w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Search Features
              </Button>
            </Link>
            <Link to="/help/articles/FindingCreators">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Finding Creators
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                All Help Articles
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFeatures;
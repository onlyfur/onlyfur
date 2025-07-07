import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Video, 
  BarChart3, 
  DollarSign, 
  Camera,
  Users,
  MessageCircle,
  ExternalLink,
  Star,
  Crown,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CreatorResources: React.FC = () => {
  const helpArticles = [
    {
      title: 'Profile Optimization Tips',
      description: 'Learn how to create an attractive and professional creator profile',
      link: '/help/articles/setting-up-creator-profile',
      category: 'Getting Started',
      icon: Users
    },
    {
      title: 'Content Upload & Organization',
      description: 'Best practices for uploading and organizing your content',
      link: '/help/articles/upload-organize-content',
      category: 'Content Creation',
      icon: Camera
    },
    {
      title: 'Pricing Strategies',
      description: 'How to price your subscriptions and custom content effectively',
      link: '/help/articles/pricing-strategies',
      category: 'Monetization',
      icon: DollarSign
    },
    {
      title: 'Engagement Best Practices',
      description: 'Tips for engaging with your subscribers and building community',
      link: '/help/articles/engagement-best-practices',
      category: 'Community',
      icon: MessageCircle
    },
    {
      title: 'Cross-Platform Promotion',
      description: 'Strategies for promoting your OnlyFur content across social media',
      link: '/help/articles/cross-platform-promotion',
      category: 'Growth',
      icon: BarChart3
    }
  ];

  const tools = [
    {
      name: 'Creator Analytics Dashboard',
      description: 'Track your performance with detailed insights',
      icon: BarChart3,
      status: 'Available',
      link: '/dashboard'
    },
    {
      name: 'Content Scheduler',
      description: 'Plan and schedule your posts in advance',
      icon: Calendar,
      status: 'Available',
      link: '/content/schedule'
    },
    {
      name: 'Bulk Message Tool',
      description: 'Send messages to multiple subscribers',
      icon: MessageCircle,
      status: 'Pro+',
      link: '/messages/bulk'
    },
    {
      name: 'Revenue Reports',
      description: 'Detailed breakdown of your earnings',
      icon: DollarSign,
      status: 'Available',
      link: '/earnings'
    }
  ];

  const resourceCategories = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      color: 'text-blue-500',
      resources: [
        { title: 'Profile Optimization Tips', type: 'Guide', description: 'Make your profile stand out', link: '/help/articles/setting-up-creator-profile' },
        { title: 'First Post Best Practices', type: 'Guide', description: 'Tips for your first upload', link: '/help/articles/upload-organize-content' },
        { title: 'Content Strategy Basics', type: 'Guide', description: 'Plan your content effectively', link: '/help/articles/pricing-strategies' }
      ]
    },
    {
      title: 'Content Creation',
      icon: Camera,
      color: 'text-purple-500',
      resources: [
        { title: 'Photography Tips', type: 'Guide', description: 'Improve your photo quality', link: '/help/articles/upload-organize-content' },
        { title: 'Content Organization', type: 'Guide', description: 'Organize your content library', link: '/help/articles/upload-organize-content' },
        { title: 'Quality Guidelines', type: 'Guide', description: 'Meet platform quality standards', link: '/help/guidelines' }
      ]
    },
    {
      title: 'Analytics & Growth', 
      icon: BarChart3,
      color: 'text-green-500',
      resources: [
        { title: 'Understanding Analytics', type: 'Guide', description: 'Make sense of your performance data', link: '/dashboard/analytics' },
        { title: 'Growth Strategies', type: 'Guide', description: 'Proven methods to grow your audience', link: '/help/articles/engagement-best-practices' },
        { title: 'Engagement Best Practices', type: 'Guide', description: 'Build stronger fan relationships', link: '/help/articles/engagement-best-practices' },
        { title: 'Cross-Platform Promotion', type: 'Guide', description: 'Leverage social media effectively', link: '/help/articles/cross-platform-promotion' }
      ]
    },
    {
      title: 'Monetization',
      icon: DollarSign,
      color: 'text-yellow-500',
      resources: [
        { title: 'Revenue Optimization', type: 'Guide', description: 'Maximize your earning potential', link: '/help/articles/pricing-strategies' },
        { title: 'Custom Content Pricing', type: 'Guide', description: 'Price custom requests fairly', link: '/help/articles/pricing-strategies' },
        { title: 'Subscription Strategy', type: 'Guide', description: 'Structure your subscription offerings', link: '/help/articles/pricing-strategies' }
      ]
    }
  ];

  const tutorials = [
    {
      title: 'Setting Up Your Creator Profile',
      duration: '8 min',
      level: 'Beginner',
      thumbnail: '🎨',
      description: 'Learn how to create an engaging profile that attracts subscribers',
      link: '/help/articles/setting-up-creator-profile'
    },
    {
      title: 'Photography Tips for Fursuit Content',
      duration: '15 min',
      level: 'Intermediate',
      thumbnail: '📸',
      description: 'Professional photography techniques for amazing fursuit photos',
      link: '/help/articles/upload-organize-content'
    },
    {
      title: 'Building Your Community',
      duration: '12 min',
      level: 'Intermediate',
      thumbnail: '👥',
      description: 'Strategies for growing and engaging your subscriber base',
      link: '/help/articles/engagement-best-practices'
    },
    {
      title: 'Advanced Pricing Strategies',
      duration: '20 min',
      level: 'Advanced',
      thumbnail: '💰',
      description: 'Optimize your pricing to maximize revenue and subscriber satisfaction',
      link: '/help/articles/pricing-strategies'
    }
  ];
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-2 rounded-full mb-6">
          <Crown className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Creator Resources</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Everything You Need to Succeed
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Access guides, tutorials, and tools designed to help furry creators 
          build successful businesses and engaged communities.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-4 gap-4 mb-16">
        <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
          <Link to="/help/articles/engagement-best-practices">
            <Star className="w-6 h-6" />
            <span>Best Practices</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
          <Link to="/dashboard/analytics">
            <BarChart3 className="w-6 h-6" />
            <span>Analytics Guide</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
          <Link to="/help/articles/tax-information">
            <DollarSign className="w-6 h-6" />
            <span>Tax Information</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
          <Link to="/contact">
            <MessageCircle className="w-6 h-6" />
            <span>Creator Support</span>
          </Link>
        </Button>
      </div>

      {/* Resource Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Browse Resources</h2>
        <div className="space-y-8">
          {resourceCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <category.icon className={`w-6 h-6 mr-3 ${category.color}`} />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.resources.map((resource, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{resource.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link to={resource.link}>
                          <ExternalLink className="w-3 h-3 mr-2" />
                          View Guide
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Video Tutorials</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{tutorial.thumbnail}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{tutorial.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {tutorial.level}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{tutorial.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                      <Button size="sm" asChild>
                        <Link to={tutorial.link}>
                          <Video className="w-3 h-3 mr-2" />
                          View Guide
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Creator Tools */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Creator Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <tool.icon className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{tool.name}</h3>
                      <p className="text-muted-foreground text-sm">{tool.description}</p>
                    </div>
                  </div>
                  <Badge variant={tool.status === 'Available' ? 'default' : 'secondary'}>
                    {tool.status}
                  </Badge>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link to={tool.link}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Access Tool
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Support CTA */}
      <Card className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-8">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Need Personal Help?</h2>
          <p className="text-lg mb-6 opacity-90">
            Our creator success team is here to help you grow your OnlyFur presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Creator Support
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
              <Link to="/help/articles/engagement-best-practices">
                <BookOpen className="w-4 h-4 mr-2" />
                Best Practices Guide
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorResources;

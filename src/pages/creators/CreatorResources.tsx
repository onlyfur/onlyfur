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
  Palette,
  Users,
  MessageCircle,
  Download,
  ExternalLink,
  Star,
  Crown,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CreatorResources: React.FC = () => {
  const getResourceLink = (resource: any) => {
    const resourceLinks: { [key: string]: string } = {
      'Creator Onboarding Guide': '/resources/pdfs/creator-onboarding-guide.md',
      'Pricing Strategy Guide': '/resources/pdfs/pricing-strategy-guide.md',
      'Photography Lighting Guide': '/resources/pdfs/photography-lighting-guide.md',
      'Content Planning Template': '/resources/templates/content-planning-template.md',
      'Welcome Message Template': '/resources/templates/welcome-message-template.md',
      'Commission Price Sheet': '/resources/templates/commission-price-sheet.md',
      'Content Calendar': '/resources/templates/content-calendar.md',
      'Fan Survey Template': '/resources/templates/fan-survey-template.md',
      'Profile Optimization Tips': '/help/articles/setting-up-creator-profile',
      'Art Scanning & Upload Tips': '/help/articles/upload-organize-content',
      'Growth Strategies Guide': '/resources/pdfs/growth-strategies-guide.md',
      'Revenue Optimization Guide': '/resources/pdfs/revenue-optimization-guide.md',
      'Tax Guide for Creators': '/resources/pdfs/tax-guide-creators.md',
      'Custom Content Pricing': '/help/articles/pricing-strategies',
      'Engagement Best Practices': '/help/articles/engagement-best-practices',
      'Cross-Platform Promotion': '/help/articles/cross-platform-promotion'
    };
    
    return resourceLinks[resource.title] || '#';
  };

  const getVideoLink = (tutorial: any) => {
    const videoLinks: { [key: string]: string } = {
      'Setting Up Your Creator Profile': '/resources/videos/creator-profile-setup.mp4',
      'Photography Tips for Fursuit Content': '/resources/videos/fursuit-photography-tips.mp4',
      'Building Your Community': '/resources/videos/building-community.mp4',
      'Advanced Pricing Strategies': '/resources/videos/pricing-strategies.mp4'
    };
    
    return videoLinks[tutorial.title] || '#';
  };

  const getTemplateLink = (template: any) => {
    const templateLinks: { [key: string]: string } = {
      'Welcome Message Template': '/resources/templates/welcome-message-template.md',
      'Commission Price Sheet': '/resources/templates/commission-price-sheet.md',
      'Content Calendar': '/resources/templates/content-calendar.md',
      'Fan Survey Template': '/resources/templates/fan-survey-template.md'
    };
    
    return templateLinks[template.name] || '#';
  };
  const resourceCategories = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      color: 'text-blue-500',
      resources: [
        { title: 'Creator Onboarding Guide', type: 'PDF', description: 'Complete setup guide for new creators' },
        { title: 'Profile Optimization Tips', type: 'Article', description: 'Make your profile stand out' },
        { title: 'First Post Best Practices', type: 'Video', description: '10-minute tutorial on your first upload' },
        { title: 'Pricing Strategy Guide', type: 'PDF', description: 'How to price your content effectively' }
      ]
    },
    {
      title: 'Content Creation',
      icon: Camera,
      color: 'text-purple-500',
      resources: [
        { title: 'Photography Lighting Guide', type: 'PDF', description: 'Professional lighting on any budget' },
        { title: 'Video Creation Workshop', type: 'Video', description: 'Creating engaging video content' },
        { title: 'Art Scanning & Upload Tips', type: 'Article', description: 'Best practices for digital artwork' },
        { title: 'Content Planning Template', type: 'Template', description: 'Plan your content calendar' }
      ]
    },
    {
      title: 'Analytics & Growth',
      icon: BarChart3,
      color: 'text-green-500',
      resources: [
        { title: 'Understanding Your Analytics', type: 'Video', description: 'Make sense of your performance data' },
        { title: 'Growth Strategies Guide', type: 'PDF', description: 'Proven methods to grow your audience' },
        { title: 'Engagement Best Practices', type: 'Article', description: 'Build stronger fan relationships' },
        { title: 'Cross-Platform Promotion', type: 'Guide', description: 'Leverage social media effectively' }
      ]
    },
    {
      title: 'Monetization',
      icon: DollarSign,
      color: 'text-yellow-500',
      resources: [
        { title: 'Revenue Optimization Guide', type: 'PDF', description: 'Maximize your earning potential' },
        { title: 'Custom Content Pricing', type: 'Article', description: 'Price custom requests fairly' },
        { title: 'Tax Guide for Creators', type: 'PDF', description: 'Understanding taxes on creator income' },
        { title: 'Subscription Tier Strategy', type: 'Video', description: 'Structure your subscription offerings' }
      ]
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

  const tutorials = [
    {
      title: 'Setting Up Your Creator Profile',
      duration: '8 min',
      level: 'Beginner',
      thumbnail: '🎨',
      description: 'Learn how to create an engaging profile that attracts subscribers'
    },
    {
      title: 'Photography Tips for Fursuit Content',
      duration: '15 min',
      level: 'Intermediate',
      thumbnail: '📸',
      description: 'Professional photography techniques for amazing fursuit photos'
    },
    {
      title: 'Building Your Community',
      duration: '12 min',
      level: 'Intermediate',
      thumbnail: '👥',
      description: 'Strategies for growing and engaging your subscriber base'
    },
    {
      title: 'Advanced Pricing Strategies',
      duration: '20 min',
      level: 'Advanced',
      thumbnail: '💰',
      description: 'Optimize your pricing to maximize revenue and subscriber satisfaction'
    }
  ];

  const templates = [
    {
      name: 'Welcome Message Template',
      description: 'Greet new subscribers professionally',
      category: 'Messaging'
    },
    {
      name: 'Commission Price Sheet',
      description: 'Professional pricing template',
      category: 'Business'
    },
    {
      name: 'Content Calendar',
      description: 'Plan your posts effectively',
      category: 'Planning'
    },
    {
      name: 'Fan Survey Template',
      description: 'Gather feedback from subscribers',
      category: 'Engagement'
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
          Access guides, tutorials, templates, and tools designed to help furry creators 
          build successful businesses and engaged communities.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-4 gap-4 mb-16">
        <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
          <Link to="/best-practices">
            <Star className="w-6 h-6" />
            <span>Best Practices</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
          <Link to="/analytics-guide">
            <BarChart3 className="w-6 h-6" />
            <span>Analytics Guide</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col space-y-2" asChild>
          <Link to="/tax-info">
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
                        <a href={getResourceLink(resource)} download target="_blank" rel="noopener noreferrer">
                          <Download className="w-3 h-3 mr-2" />
                          Access Resource
                        </a>
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
                        <a href={getVideoLink(tutorial)} target="_blank" rel="noopener noreferrer">
                          <Video className="w-3 h-3 mr-2" />
                          Watch
                        </a>
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

      {/* Templates */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Templates & Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <h3 className="font-medium mb-2">{template.name}</h3>
                <p className="text-muted-foreground text-xs mb-3">{template.description}</p>
                <Badge variant="outline" className="mb-3 text-xs">
                  {template.category}
                </Badge>
                <Button size="sm" className="w-full" asChild>
                  <a href={getTemplateLink(template)} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </a>
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
              <Link to="/best-practices">
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

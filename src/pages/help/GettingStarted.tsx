import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Camera, 
  CreditCard, 
  Heart, 
  MessageCircle, 
  Settings,
  CheckCircle,
  ArrowRight,
  Book
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GettingStarted: React.FC = () => {
  const steps = [
    {
      icon: User,
      title: 'Create Your Account',
      description: 'Sign up with email or Google to get started',
      content: [
        'Choose whether you want to be a Creator or Subscriber',
        'Verify your email address',
        'Complete your profile with bio and profile picture',
        'Set your preferences and interests'
      ]
    },
    {
      icon: Camera,
      title: 'Explore Content',
      description: 'Discover amazing furry content from creators',
      content: [
        'Browse the Explore page to find creators',
        'Use tags and filters to find content you love',
        'Follow creators to stay updated',
        'Like and comment on posts'
      ]
    },
    {
      icon: CreditCard,
      title: 'Subscribe to Creators',
      description: 'Support your favorite creators with subscriptions',
      content: [
        'Choose from different subscription tiers',
        'Access exclusive content based on your tier',
        'Manage subscriptions in your billing settings',
        'Cancel or modify subscriptions anytime'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Connect & Communicate',
      description: 'Interact with creators and community',
      content: [
        'Send direct messages to creators',
        'Join tier-based messaging groups',
        'Comment on posts and engage',
        'Respect community guidelines'
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Browse Creators',
      description: 'Find amazing furry content creators',
      link: '/explore',
      icon: Camera,
      color: 'bg-blue-500'
    },
    {
      title: 'Complete Profile',
      description: 'Set up your profile and preferences',
      link: '/profile',
      icon: User,
      color: 'bg-green-500'
    },
    {
      title: 'Creator Program',
      description: 'Learn about becoming a creator',
      link: '/creator-program',
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      title: 'Help Center',
      description: 'Find answers to common questions',
      link: '/help',
      icon: Book,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Getting Started with OnlyFur</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome to the premier platform for furry content creators and fans! 
          Here's everything you need to know to get started.
        </p>
      </div>

      {/* Quick Start Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Follow these steps to get the most out of OnlyFur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="grow">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  <ul className="space-y-1">
                    {step.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="grow">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
          <CardDescription>
            Discover what makes OnlyFur special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">For Subscribers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  Access exclusive furry content
                </li>
                <li className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                  Direct messaging with creators
                </li>
                <li className="flex items-center">
                  <Camera className="w-4 h-4 mr-2 text-green-500" />
                  High-quality artwork and photos
                </li>
                <li className="flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-purple-500" />
                  Customizable subscription tiers
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">For Creators</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-green-500" />
                  Monetize your furry content
                </li>
                <li className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Build a loyal fanbase
                </li>
                <li className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-purple-500" />
                  Engage with your audience
                </li>
                <li className="flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-orange-500" />
                  Analytics and insights
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Guidelines Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Community Guidelines</CardTitle>
          <CardDescription>
            Essential rules for a safe and welcoming community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline-solid" className="bg-green-50 border-green-200">
                ✓ Respectful
              </Badge>
              <span className="text-sm">Treat all community members with respect</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline-solid" className="bg-blue-50 border-blue-200">
                ✓ Age-Appropriate
              </Badge>
              <span className="text-sm">All users must be 18+ and verify their age</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline-solid" className="bg-purple-50 border-purple-200">
                ✓ Original Content
              </Badge>
              <span className="text-sm">Share only original content you have rights to</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline-solid" className="bg-orange-50 border-orange-200">
                ✓ Safe Space
              </Badge>
              <span className="text-sm">Help maintain a safe, inclusive environment</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/guidelines">
              <Button variant="outline" size="sm">
                Read Full Guidelines
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Continue your OnlyFur journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link to="/explore">
              <Button className="w-full justify-between">
                Start Exploring Content
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/creator-program">
              <Button variant="outline" className="w-full justify-between">
                Learn About Creating
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" className="w-full justify-between">
                Browse Help Articles
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GettingStarted;

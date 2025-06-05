import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Camera,
  Palette,
  Video,
  MessageCircle,
  BarChart3,
  Upload,
  Calendar,
  Gift,
  Target,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CreatorProgram: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Multiple Revenue Streams',
      description: 'Earn through subscriptions, tips, custom content, and pay-per-view messages.',
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Growth Tools',
      description: 'Advanced analytics, promotion tools, and audience insights to grow your fanbase.',
      color: 'text-blue-500'
    },
    {
      icon: Shield,
      title: 'Content Protection',
      description: 'Secure platform with content protection and copyright enforcement.',
      color: 'text-purple-500'
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Direct messaging, fan clubs, and community features to engage your audience.',
      color: 'text-pink-500'
    },
    {
      icon: Star,
      title: 'Creator Support',
      description: 'Dedicated creator support team and resources to help you succeed.',
      color: 'text-yellow-500'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Schedule posts, plan content releases, and maintain consistent engagement.',
      color: 'text-indigo-500'
    }
  ];

  const contentTypes = [
    {
      icon: Camera,
      title: 'Photography',
      description: 'Fursuit photos, artistic shots, lifestyle content',
      examples: ['Convention photos', 'Outdoor shoots', 'Studio portraits', 'Behind-the-scenes']
    },
    {
      icon: Palette,
      title: 'Digital Art',
      description: 'Original artwork, commissions, tutorials',
      examples: ['Character designs', 'Commissions', 'WIP content', 'Art tutorials']
    },
    {
      icon: Video,
      title: 'Video Content',
      description: 'Performances, vlogs, tutorials, live streams',
      examples: ['Fursuit dancing', 'Art process', 'Convention vlogs', 'Character acting']
    },
    {
      icon: MessageCircle,
      title: 'Interactive',
      description: 'Live streams, Q&As, custom content',
      examples: ['Live art streams', 'Q&A sessions', 'Custom videos', 'Voice messages']
    }
  ];

  const creatorTiers = [
    {
      name: 'Basic Creator',
      price: 'Free',
      features: [
        'Upload up to 100MB files',
        'Basic analytics',
        '720p video quality',
        'Standard support',
        '5% platform fee'
      ],
      color: 'border-gray-200 bg-gray-50 dark:bg-gray-900/10',
      buttonText: 'Start Free',
      popular: false
    },
    {
      name: 'Pro Creator',
      price: '$19.99/mo',
      features: [
        'Upload up to 500MB files',
        'Advanced analytics',
        '1080p video quality',
        'Priority support',
        '3% platform fee',
        'Bulk messaging (100/day)',
        'Custom pricing options'
      ],
      color: 'border-purple-200 bg-purple-50 dark:bg-purple-900/10',
      buttonText: 'Go Pro',
      popular: true
    },
    {
      name: 'Premium Creator',
      price: '$49.99/mo',
      features: [
        'Upload up to 2GB files',
        'Pro analytics & insights',
        '4K video quality',
        'Premium support',
        '1% platform fee',
        'Bulk messaging (500/day)',
        'Advanced scheduling',
        'Custom branding'
      ],
      color: 'border-pink-200 bg-pink-50 dark:bg-pink-900/10',
      buttonText: 'Go Premium',
      popular: false
    }
  ];

  const earnings = [
    {
      title: 'Subscription Revenue',
      description: 'Monthly recurring income from your subscribers',
      example: '$1,200/month from 120 subscribers at $10/month'
    },
    {
      title: 'Tips & Donations',
      description: 'One-time payments from appreciative fans',
      example: '$300/month average from fan tips'
    },
    {
      title: 'Custom Content',
      description: 'Commissioned work and personalized requests',
      example: '$500/month from 10 custom commissions'
    },
    {
      title: 'Pay-Per-View',
      description: 'Premium content with individual pricing',
      example: '$200/month from exclusive content sales'
    }
  ];

  const successSteps = [
    {
      step: 1,
      title: 'Create Compelling Content',
      description: 'Focus on quality and consistency. Share content that showcases your unique style and personality.',
      tips: ['Post regularly', 'Engage with comments', 'Show behind-the-scenes']
    },
    {
      step: 2,
      title: 'Build Your Community',
      description: 'Interact with your audience, respond to messages, and create a welcoming environment.',
      tips: ['Reply to messages', 'Ask for feedback', 'Share your story']
    },
    {
      step: 3,
      title: 'Optimize & Grow',
      description: 'Use analytics to understand what works, experiment with pricing, and expand your reach.',
      tips: ['Analyze performance', 'Adjust pricing', 'Cross-promote']
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-2 rounded-full mb-6">
          <Crown className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">OnlyFur Creator Program</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Turn Your Passion Into Profit
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Join our creator program and start earning money from your furry content. 
          Share your art, photography, and creativity with fans who appreciate your work.
        </p>

        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" asChild>
          <Link to="/register">
            <Zap className="w-4 h-4 mr-2" />
            Start Creating Today
          </Link>
        </Button>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose OnlyFur?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${benefit.color}`}>
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">What Content Can You Share?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {contentTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                    <p className="text-muted-foreground mb-3">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Creator Tiers */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Creator Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {creatorTiers.map((tier, index) => (
            <Card key={index} className={`${tier.color} hover:shadow-lg transition-shadow relative`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  {tier.price}
                  {tier.price !== 'Free' && <span className="text-sm text-muted-foreground">/month</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                  {tier.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Earnings Potential */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Earnings Potential</h2>
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Average Creator Earnings</CardTitle>
            <CardDescription>
              Multiple revenue streams mean more earning opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {earnings.map((earning, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                    {earning.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">{earning.description}</p>
                  <p className="text-sm font-medium text-green-600">{earning.example}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2">Total Potential: $2,200+/month</h3>
            <p className="text-muted-foreground">
              This example shows the earning potential for an active creator with a growing fanbase. 
              Your actual earnings will depend on your content, audience size, and engagement.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Success Steps */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Path to Success</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {successSteps.map((step, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-4">Step {step.step}</Badge>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <div className="space-y-2">
                  {step.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Creator Resources Preview */}
      <Card className="mb-16 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary" />
            Creator Resources
          </CardTitle>
          <CardDescription>
            We provide comprehensive guides and tools to help you succeed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium mb-1">Analytics Guide</h4>
              <p className="text-xs text-muted-foreground">Understand your audience</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Camera className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h4 className="font-medium mb-1">Content Tips</h4>
              <p className="text-xs text-muted-foreground">Create engaging content</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <h4 className="font-medium mb-1">Community Building</h4>
              <p className="text-xs text-muted-foreground">Grow your fanbase</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Gift className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-medium mb-1">Monetization</h4>
              <p className="text-xs text-muted-foreground">Maximize earnings</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/creator-resources">
                View All Resources
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Creator Journey?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join hundreds of furry creators already earning money doing what they love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                <Crown className="w-4 h-4 mr-2" />
                Become a Creator
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
              <Link to="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorProgram;

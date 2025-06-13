import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Search, 
  Heart, 
  Crown, 
  Upload, 
  DollarSign,
  MessageCircle,
  Star,
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  Camera,
  Palette,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const forFansSteps = [
    {
      step: 1,
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up for free and join the furry community. Choose your interests and set up your profile.',
      color: 'bg-blue-500'
    },
    {
      step: 2,
      icon: Search,
      title: 'Discover Creators',
      description: 'Browse amazing furry content and find creators who match your interests. Preview their work for free.',
      color: 'bg-purple-500'
    },
    {
      step: 3,
      icon: Heart,
      title: 'Subscribe & Support',
      description: 'Subscribe to your favorite creators to unlock exclusive content and show your support.',
      color: 'bg-pink-500'
    },
    {
      step: 4,
      icon: MessageCircle,
      title: 'Connect & Engage',
      description: 'Chat with creators, leave comments, and become part of their community.',
      color: 'bg-green-500'
    }
  ];

  const forCreatorsSteps = [
    {
      step: 1,
      icon: UserPlus,
      title: 'Join as Creator',
      description: 'Create your creator account and set up your profile with your furry persona and bio.',
      color: 'bg-orange-500'
    },
    {
      step: 2,
      icon: Upload,
      title: 'Share Content',
      description: 'Upload your art, photos, videos, or other content. Set privacy levels and pricing.',
      color: 'bg-red-500'
    },
    {
      step: 3,
      icon: Users,
      title: 'Build Your Pack',
      description: 'Promote your content and grow your subscriber base. Engage with your community.',
      color: 'bg-indigo-500'
    },
    {
      step: 4,
      icon: DollarSign,
      title: 'Earn Money',
      description: 'Get paid through subscriptions, tips, and custom content requests. Track your earnings.',
      color: 'bg-emerald-500'
    }
  ];

  const contentTypes = [
    {
      icon: Camera,
      title: 'Fursuit Photography',
      description: 'Professional and amateur fursuit photos, from convention shots to artistic portraits.',
      examples: ['Convention photos', 'Outdoor shoots', 'Studio portraits', 'Action shots']
    },
    {
      icon: Palette,
      title: 'Digital & Traditional Art',
      description: 'Original furry artwork including commissions, character designs, and fan art.',
      examples: ['Character commissions', 'Reference sheets', 'Digital paintings', 'Sketches']
    },
    {
      icon: Star,
      title: 'Video Content',
      description: 'Fursuit performances, tutorials, vlogs, and other video content.',
      examples: ['Fursuit dancing', 'Art tutorials', 'Convention vlogs', 'Character acting']
    },
    {
      icon: MessageCircle,
      title: 'Interactive Content',
      description: 'Live streams, Q&As, and other interactive experiences with your audience.',
      examples: ['Art streams', 'Q&A sessions', 'Gaming streams', 'Virtual meet & greets']
    }
  ];

  const subscriptionTiers = [
    {
      name: 'Basic Subscriber',
      price: '$9.99',
      features: [
        'Access to subscriber-only content',
        'Direct messaging with creators',
        'Community discussions',
        'Early access to new posts'
      ],
      color: 'border-blue-200 bg-blue-50 dark:bg-blue-900/10'
    },
    {
      name: 'Pro Subscriber',
      price: '$19.99',
      features: [
        'Everything in Basic',
        'Premium HD content access',
        'Download content offline',
        'Priority customer support',
        'Advanced messaging features'
      ],
      color: 'border-purple-200 bg-purple-50 dark:bg-purple-900/10'
    },
    {
      name: 'VIP Subscriber',
      price: '$39.99',
      features: [
        'Everything in Pro',
        'VIP exclusive content',
        'Unlimited messaging',
        'Ultra HD streaming',
        'VIP events and perks'
      ],
      color: 'border-pink-200 bg-pink-50 dark:bg-pink-900/10'
    }
  ];

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Content Moderation',
      description: 'All content is reviewed to ensure community guidelines compliance.'
    },
    {
      icon: CheckCircle,
      title: 'Verified Creators',
      description: 'Creator verification helps ensure authentic profiles and quality content.'
    },
    {
      icon: Star,
      title: 'Community Reporting',
      description: 'Easy reporting tools help maintain a safe and positive environment.'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-6">
          <Zap className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">How OnlyFur Works</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Your Guide to OnlyFur
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Learn how to get the most out of OnlyFur, whether you're discovering amazing furry content 
          or creating your own. Join our growing community today!
        </p>
      </div>

      {/* For Fans Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">For Furry Fans</h2>
          <p className="text-lg text-muted-foreground">
            Discover and support your favorite furry creators in just a few simple steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {forFansSteps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white mb-4`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="mb-3">Step {step.step}</Badge>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
              {index < forFansSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* For Creators Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">For Creators</h2>
          <p className="text-lg text-muted-foreground">
            Turn your furry passion into income and build a community around your creativity.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {forCreatorsSteps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white mb-4`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="mb-3">Step {step.step}</Badge>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
              {index < forCreatorsSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Content Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">What Kind of Content Can You Find?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {contentTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
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

      {/* Subscription Tiers */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Subscription Options</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {subscriptionTiers.map((tier, index) => (
            <Card key={index} className={`${tier.color} hover:shadow-lg transition-shadow`}>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">{tier.price}<span className="text-sm text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety & Trust */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Safety & Trust</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {safetyFeatures.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="text-center bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join the OnlyFur community today and start discovering amazing furry content or sharing your own creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                <Heart className="w-4 h-4 mr-2" />
                Join as Fan
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/creator-program">
                <Crown className="w-4 h-4 mr-2" />
                Become a Creator
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HowItWorks;

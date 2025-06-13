import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Crown, Heart, CreditCard, Users, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HowItWorks: React.FC = () => {
  const subscriberSteps = [
    {
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up as a subscriber and explore the furry creator community',
      details: 'Choose your subscription tier and set up your profile'
    },
    {
      icon: Heart,
      title: 'Discover Creators',
      description: 'Browse and find furry creators whose content you love',
      details: 'Use our explore page to find artists, photographers, and content creators'
    },
    {
      icon: CreditCard,
      title: 'Subscribe & Support',
      description: 'Subscribe to your favorite creators to unlock exclusive content',
      details: 'Choose from different subscription tiers based on your interests'
    },
    {
      icon: Star,
      title: 'Enjoy Exclusive Content',
      description: 'Access premium furry content and connect with creators',
      details: 'Message creators, access exclusive posts, and join the community'
    }
  ];

  const creatorSteps = [
    {
      icon: UserPlus,
      title: 'Sign Up as Creator',
      description: 'Create your creator account and set up your furry persona',
      details: 'Choose your creator tier and customize your profile'
    },
    {
      icon: Crown,
      title: 'Upload Content',
      description: 'Share your furry art, photos, videos, and other creative content',
      details: 'Set access levels and pricing for different subscription tiers'
    },
    {
      icon: Users,
      title: 'Build Your Audience',
      description: 'Grow your subscriber base and engage with your fans',
      details: 'Use our tools to promote your content and connect with followers'
    },
    {
      icon: CreditCard,
      title: 'Earn Revenue',
      description: 'Get paid for your content through subscriptions and tips',
      details: 'Track earnings and withdraw funds with our transparent system'
    }
  ];

  const subscriptionTiers = [
    {
      name: 'Basic Subscriber',
      price: '$9.99/month',
      features: [
        'Access to basic creator content',
        '5 creator messages per day',
        'Standard quality media',
        'Community forum access'
      ]
    },
    {
      name: 'Pro Subscriber',
      price: '$19.99/month',
      popular: true,
      features: [
        'Access to premium content',
        '15 creator messages per day',
        'HD quality media',
        'Exclusive live streams',
        'Early content access'
      ]
    },
    {
      name: 'VIP Subscriber',
      price: '$39.99/month',
      features: [
        'Access to all content tiers',
        'Unlimited creator messages',
        'UHD quality media',
        'Exclusive VIP content',
        'Direct creator access',
        'Custom content requests'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
          How OnlyFur Works
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Whether you're a fan looking to support creators or an artist wanting to monetize your furry content, 
          OnlyFur makes it simple to connect and create sustainable relationships.
        </p>
      </div>

      {/* For Subscribers */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">For Furry Fans</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">How to Support Creators</h2>
          <p className="text-xl text-muted-foreground">
            Start supporting your favorite furry creators in just a few steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {subscriberSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                {index < subscriberSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-8 h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-2">{step.description}</p>
              <p className="text-sm text-muted-foreground">{step.details}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/register">
              <Heart className="mr-2 h-5 w-5" />
              Start as Subscriber
            </Link>
          </Button>
        </div>
      </div>

      {/* For Creators */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">For Creators</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">How to Start Earning</h2>
          <p className="text-xl text-muted-foreground">
            Turn your furry passion into a sustainable income stream
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {creatorSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="bg-linear-to-r from-orange-500 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                {index < creatorSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-8 h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-2">{step.description}</p>
              <p className="text-sm text-muted-foreground">{step.details}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/creator-program">
              <Crown className="mr-2 h-5 w-5" />
              Become a Creator
            </Link>
          </Button>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Subscription Options</h2>
          <p className="text-xl text-muted-foreground">
            Choose the subscription tier that best fits your interests and budget
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {subscriptionTiers.map((tier, index) => (
            <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}>
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium rounded-t-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={tier.popular ? 'pt-12' : ''}>
                <CardTitle className="text-2xl text-center">{tier.name}</CardTitle>
                <div className="text-center">
                  <div className="text-3xl font-bold">{tier.price}</div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant={tier.popular ? 'default' : 'outline-solid'}>
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Is OnlyFur safe for the furry community?</h3>
              <p className="text-muted-foreground">
                Yes! OnlyFur is designed specifically for the furry community with strict safety guidelines, content moderation, and community standards.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How do creators get paid?</h3>
              <p className="text-muted-foreground">
                Creators receive payments through secure methods with transparent fee structures. Higher creator tiers keep more of their earnings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change my subscription tier?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your subscription tier at any time. Changes take effect at the next billing cycle.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What type of content is allowed?</h3>
              <p className="text-muted-foreground">
                We welcome all furry-related content including art, photography, tutorials, and stories, as long as it follows our community guidelines.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I find creators to follow?</h3>
              <p className="text-muted-foreground">
                Use our explore page to discover creators by category, popularity, or search for specific interests and fursonas.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is my personal information secure?</h3>
              <p className="text-muted-foreground">
                We use industry-standard security measures to protect your data and never share personal information without consent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Card className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-none max-w-4xl mx-auto">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-purple-100">
              Join the OnlyFur community today and start your journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link to="/register">
                  Join as Subscriber
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600" asChild>
                <Link to="/creator-program">
                  Become a Creator
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorks;

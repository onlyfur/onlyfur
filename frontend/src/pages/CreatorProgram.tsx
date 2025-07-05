import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, DollarSign, TrendingUp, Users, Star, BarChart3, Zap, Heart, CheckCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CreatorProgram: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Fair Revenue Sharing',
      description: 'Keep 80-90% of your earnings with our transparent fee structure',
      highlight: 'Up to 90%'
    },
    {
      icon: Users,
      title: 'Built-in Audience',
      description: 'Connect with furry fans who are actively looking for quality content',
      highlight: 'Targeted Audience'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track your performance with detailed insights and earnings reports',
      highlight: 'Pro Analytics'
    },
    {
      icon: Shield,
      title: 'Content Protection',
      description: 'Your content is protected with watermarks and download restrictions',
      highlight: 'Secure Platform'
    },
    {
      icon: Zap,
      title: 'Creator Tools',
      description: 'Access powerful tools for content management, scheduling, and fan engagement',
      highlight: 'Pro Tools'
    },
    {
      icon: Heart,
      title: 'Community Support',
      description: 'Join a supportive community of fellow furry creators and receive dedicated support',
      highlight: '24/7 Support'
    }
  ];

  const creatorTiers = [
    {
      name: 'Basic Creator',
      price: 'Free',
      fee: '20% platform fee',
      color: 'from-gray-500 to-gray-600',
      popular: false,
      features: [
        'Upload up to 10 posts per day',
        '10GB content storage',
        'Basic analytics dashboard',
        'Standard creator tools',
        'Community support forum',
        'Email support'
      ]
    },
    {
      name: 'Pro Creator',
      price: '$29.99/month',
      fee: '15% platform fee',
      color: 'from-blue-500 to-purple-500',
      popular: true,
      features: [
        'Upload up to 50 posts per day',
        '100GB content storage',
        'Advanced analytics & insights',
        'Live streaming capabilities',
        'Bulk messaging tools',
        'Priority support',
        'Custom branding options',
        'Early access to new features'
      ]
    },
    {
      name: 'Premium Creator',
      price: '$99.99/month',
      fee: '10% platform fee',
      color: 'from-purple-500 to-pink-500',
      popular: false,
      features: [
        'Unlimited posts and uploads',
        'Unlimited content storage',
        'Premium analytics suite',
        'Advanced live streaming',
        'Custom subscriber tiers',
        'Dedicated account manager',
        'White-label options',
        'Revenue optimization tools',
        'Custom integrations'
      ]
    }
  ];

  const successStories = [
    {
      name: 'Luna the Arctic Fox',
      avatar: '🦊',
      earnings: '$3,200/month',
      specialty: 'Fursuit Photography',
      quote: 'OnlyFur helped me turn my fursuit photography passion into a sustainable income!'
    },
    {
      name: 'Rex the Dragon',
      avatar: '🐲',
      specialty: 'Digital Art',
      earnings: '$1,800/month',
      quote: 'The furry community here is amazing. My art has never been more appreciated!'
    },
    {
      name: 'Sage the Wolf',
      avatar: '🐺',
      specialty: 'Tutorials & Education',
      earnings: '$2,400/month',
      quote: 'Teaching fursuit making has become my full-time career thanks to this platform.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up as a creator and set up your profile with your furry persona and content style.'
    },
    {
      number: '02',
      title: 'Upload Your Content',
      description: 'Start sharing your furry art, photos, videos, or other creative content with the community.'
    },
    {
      number: '03',
      title: 'Set Your Prices',
      description: 'Choose your subscription tiers and pricing that reflects the value of your content.'
    },
    {
      number: '04',
      title: 'Grow Your Audience',
      description: 'Engage with fans, respond to messages, and build a loyal subscriber base.'
    },
    {
      number: '05',
      title: 'Earn & Grow',
      description: 'Track your earnings, optimize your content strategy, and scale your creator business.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
          <Crown className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">OnlyFur Creator Program</span>
          <Crown className="h-4 w-4 text-primary" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
          Turn Your Furry Passion Into Income
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Join thousands of furry creators who are building sustainable businesses with their art, photography, 
          tutorials, and content. Fair revenue sharing, powerful tools, and a supportive community await you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/register">
              <Crown className="mr-2 h-5 w-5" />
              Start Creating Today
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            Learn More
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose OnlyFur?</h2>
          <p className="text-xl text-muted-foreground">
            Built specifically for the furry community with creators in mind
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{benefit.highlight}</Badge>
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Creator Tiers */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Creator Subscription Tiers</h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that best fits your creative goals and audience size
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {creatorTiers.map((tier, index) => (
            <Card key={index} className={`relative overflow-hidden ${tier.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}>
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={tier.popular ? 'pt-12' : ''}>
                <div className={`inline-flex p-4 rounded-full bg-linear-to-r ${tier.color} text-white mb-4 mx-auto w-fit`}>
                  <Crown className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl text-center">{tier.name}</CardTitle>
                <div className="text-center">
                  <div className="text-3xl font-bold">{tier.price}</div>
                  <div className="text-sm text-muted-foreground">{tier.fee}</div>
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
                <Button className="w-full mt-6" variant={tier.popular ? 'default' : 'outline'}>
                  {tier.price === 'Free' ? 'Get Started' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            Get started as a creator in just 5 simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Creator Success Stories</h2>
          <p className="text-xl text-muted-foreground">
            Real creators building successful businesses on OnlyFur
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl mx-auto mb-4">
                  {story.avatar}
                </div>
                <CardTitle className="text-xl">{story.name}</CardTitle>
                <div className="space-y-1">
                  <Badge variant="outline-solid">{story.specialty}</Badge>
                  <div className="text-2xl font-bold text-green-500">{story.earnings}</div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base italic leading-relaxed">
                  "{story.quote}"
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Card className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-none max-w-4xl mx-auto">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Creator Journey?</h2>
            <p className="text-xl mb-8 text-purple-100">
              Join the OnlyFur creator community and start monetizing your furry content today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link to="/register">
                  <Crown className="mr-2 h-5 w-5" />
                  Become a Creator
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600">
                Contact Creator Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorProgram;

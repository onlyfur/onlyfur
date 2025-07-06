import React from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Star,
  Users,
  Shield,
  Zap,
  Heart,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Lock,
  PlayCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PricingModal from '@/components/subscription/PricingModal';

const Landing: React.FC = () => {
  const [showPricingModal, setShowPricingModal] = React.useState(false);
  const [selectedPricingTab, setSelectedPricingTab] = React.useState<'subscriber' | 'creator'>('subscriber');

  const subscriberFeatures = [
    {
      icon: Heart,
      title: 'Exclusive Furry Content',
      description: 'Access premium fursuit photos, art, and videos from top creators.',
      gradient: 'from-pink-400 to-rose-500',
    },
    {
      icon: MessageCircle,
      title: 'Connect with Creators',
      description: 'Chat directly with your favorite furry artists and performers.',
      gradient: 'from-purple-400 to-indigo-500',
    },
    {
      icon: Shield,
      title: 'Safe Community',
      description: 'Join a judgment-free space designed for the furry fandom.',
      gradient: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Star,
      title: 'Early Access',
      description: 'Get first looks at new content and exclusive community events.',
      gradient: 'from-orange-400 to-yellow-500',
    },
  ];

  const creatorFeatures = [
    {
      icon: DollarSign,
      title: 'Monetize Your Art',
      description: 'Turn your furry passion into income with subscriptions and tips.',
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Pack',
      description: 'Build a loyal fanbase with powerful creator tools and analytics.',
      gradient: 'from-red-400 to-pink-500',
    },
  ];

  const testimonials = [
    {
      name: 'Fennec Fox',
      role: 'Fursuit Creator',
      avatar: '🦊',
      content: 'OnlyFur helped me turn my fursuit passion into a thriving business! My pack loves the exclusive content.',
      earning: '$15K/month',
    },
    {
      name: 'Silver Wolf',
      role: 'Murrsuit Content Creator',
      avatar: '🐺',
      content: 'Perfect platform for adult furry content. Safe, secure, and furry-friendly community.',
      earning: '$8K/month',
    },
    {
      name: 'Luna Dragon',
      role: 'Furry Artist & Performer',
      avatar: '🐲',
      content: 'Finally a platform that understands the furry community and provides fair creator compensation.',
      earning: '$12K/month',
    },
  ];

  const pricingTiers = [
    {
      name: 'Creator',
      price: 'Free',
      description: 'Start your creator journey',
      features: [
        'Upload unlimited content',
        'Basic analytics',
        'Standard support',
        '20% platform fee',
      ],
      popular: false,
    },
    {
      name: 'Pro Creator',
      price: '$29/month',
      description: 'For serious creators',
      features: [
        'Everything in Creator',
        'Advanced analytics',
        'Priority support',
        '10% platform fee',
        'Custom branding',
      ],
      popular: true,
    },
    {
      name: 'Creator Plus',
      price: '$99/month',
      description: 'For top creators',
      features: [
        'Everything in Pro',
        'Dedicated manager',
        '5% platform fee',
        'Early feature access',
        'Marketing support',
      ],
      popular: false,
    },
  ];

  // Features for the features section
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Tools',
      description: 'Automate content creation, moderation, and analytics with advanced AI.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Upload,
      title: 'Unlimited Uploads',
      description: 'Share photos, videos, and art with no storage limits.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Privacy Controls',
      description: 'Set custom privacy levels and control who sees your content.',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-orange-50 via-amber-50 to-purple-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative container mx-auto px-4 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome to the Furry Creator Economy
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-linear-to-r from-orange-600 via-amber-600 to-purple-600 bg-clip-text text-transparent">
              Turn Your Furry Passion Into
              <br />
              <span className="text-5xl sm:text-7xl">Profit</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of furry creators earning sustainable income by sharing exclusive fursuit content, 
              art, and experiences with their dedicated pack. Start monetizing your fursona today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/register">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link to="/explore">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Explore Creators
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>50K+ Creators</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                <span>1M+ Subscribers</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>$10M+ Paid Out</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features designed to help creators build their business 
              and connect with their audience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-linear-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              See how creators are building thriving businesses on our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-pink-500 to-purple-500 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Earning {testimonial.earning}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your creator journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-linear-to-r from-pink-500 to-purple-500">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="text-4xl font-bold mt-4">
                    {tier.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant={tier.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to="/register">
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-pink-600 via-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Creator Journey?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already building their dream business. 
            It's free to start, and you can begin earning immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link to="/register">
                <Crown className="mr-2 h-5 w-5" />
                Start Creating Free
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600" 
              asChild
            >
              <Link to="/how-it-works">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

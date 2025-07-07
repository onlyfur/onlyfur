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

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section - Subscriber Focused */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/branding/fox-mascot.webp')] bg-cover bg-center opacity-5"></div>
          <div className="relative container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              {/* Subscriber Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full mb-8 shadow-lg backdrop-blur-sm">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-medium">Join Our Growing Pack</span>
                <Heart className="h-4 w-4 text-pink-500" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
                Discover Amazing OnlyFur Content
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Access exclusive fursuit photos and videos from your favorite creators. 
                Connect with the furry community in a safe, welcoming space designed just for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
                  onClick={() => {
                    setSelectedPricingTab('subscriber');
                    setShowPricingModal(true);
                  }}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  View Subscriber Plans
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-transparent shadow-lg" asChild>
                  <Link to="/register">
                    Join for Free
                  </Link>
                </Button>
              </div>

              {/* Subscriber Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Active Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">1K+</div>
                  <div className="text-muted-foreground">Posts & Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscriber Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Furry Fans Love OnlyFur
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover exclusive content, connect with creators, and be part of the most welcoming furry community online.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {subscriberFeatures.map((feature, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 text-center">
                  <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <CardHeader className="relative pb-4">
                    <div className={`inline-flex p-4 rounded-full bg-linear-to-br ${feature.gradient} text-white mb-4 mx-auto w-fit`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
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

        {/* Subscriber Testimonials Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                What Our Community Says
              </h2>
              <p className="text-xl text-muted-foreground">
                Join our growing community of furry fans discovering amazing content daily
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Alex Wolf',
                  role: 'Furry Fan & Collector',
                  avatar: '🐺',
                  content: 'Finally found a safe space to connect with my favorite furry artists. The content quality is amazing!',
                },
                {
                  name: 'Sam Fox',
                  role: 'Convention Attendee',
                  avatar: '🦊',
                  content: 'Love being able to support creators directly and get exclusive content. Worth every penny!',
                },
                {
                  name: 'Riley Dragon',
                  role: 'Art Enthusiast',
                  avatar: '🐲',
                  content: 'The community here is so welcoming. I\'ve made so many furry friends through this platform.',
                },
              ].map((testimonial, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>



        {/* Creator Section - Bottom */}
        <section className="py-20 bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-red-900/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-500">For Creators</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Are You a Creator?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Turn your passion into profit. Join hundreds of successful furry creators already earning money from their art, photography, and content.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {creatorFeatures.map((feature, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <CardHeader className="relative">
                    <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${feature.gradient} text-white mb-4 w-fit`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
                  onClick={() => {
                    setSelectedPricingTab('creator');
                    setShowPricingModal(true);
                  }}
                >
                  <Crown className="mr-2 h-5 w-5" />
                  View Creator Plans
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-transparent shadow-lg" asChild>
                  <Link to="/register">
                    Start Creating for Free
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Free to start • No upfront costs • Keep 80-90% of earnings
              </p>
            </div>
          </div>
        </section>
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        initialTab={selectedPricingTab}
      />
    </>
  );
};

export default Landing;

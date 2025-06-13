import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Users, 
  Heart,
  Crown,
  Camera,
  Palette,
  Zap,
  DollarSign,
  MessageCircle,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessStories: React.FC = () => {
  const creatorStories = [
    {
      name: 'Luna the Wolf',
      role: 'Fursuit Photographer',
      avatar: '🐺',
      months: 8,
      subscribers: 145,
      earnings: '$1,850',
      story: 'Started with convention photography and now runs a full-time fursuit photography business through OnlyFur.',
      achievement: 'Quit day job to pursue photography',
      beforeAfter: {
        before: 'Weekend hobby photographer',
        after: 'Full-time creator with growing business'
      },
      quote: "OnlyFur gave me the platform to turn my passion for fursuit photography into a sustainable career. The community support has been incredible!"
    },
    {
      name: 'Sketch the Fox',
      role: 'Digital Artist',
      avatar: '🦊',
      months: 6,
      subscribers: 89,
      earnings: '$1,200',
      story: 'Young artist who started sharing digital furry art and commissions, building a loyal following.',
      achievement: 'Paid for art school with earnings',
      beforeAfter: {
        before: 'Art student struggling financially',
        after: 'Successful artist funding education'
      },
      quote: "The commission system on OnlyFur helped me connect with clients who appreciate my art style. I can focus on creating without worrying about finances."
    },
    {
      name: 'Cosmo Bear',
      role: 'Fursuit Performer',
      avatar: '🐻',
      months: 12,
      subscribers: 203,
      earnings: '$2,400',
      story: 'Convention performer who expanded online with dance videos and interactive content.',
      achievement: 'Performed at 6 major conventions this year',
      beforeAfter: {
        before: 'Convention performer only',
        after: 'Year-round content creator and performer'
      },
      quote: "OnlyFur let me stay connected with fans between conventions. Now I have a steady income and can plan bigger performances!"
    },
    {
      name: 'Riley Raccoon',
      role: 'Tutorial Creator',
      avatar: '🦝',
      months: 10,
      subscribers: 167,
      earnings: '$1,650',
      story: 'Experienced furry who shares crafting tutorials, mask-making guides, and behind-the-scenes content.',
      achievement: 'Launched successful mask-making course',
      beforeAfter: {
        before: 'Shared tips for free on forums',
        after: 'Monetized expertise helping others'
      },
      quote: "Teaching others while earning income has been amazing. My subscribers appreciate the detailed tutorials I can now afford to create."
    }
  ];

  const subscriberStories = [
    {
      name: 'Alex Timber',
      role: 'Long-time Furry Fan',
      avatar: '🐕',
      subscription: 'Pro Subscriber',
      duration: '9 months',
      story: 'Found a community of creators who share similar interests and artistic styles.',
      highlight: 'Discovered 15+ new favorite artists',
      quote: "OnlyFur helped me discover amazing artists I never would have found otherwise. The quality of content is fantastic!"
    },
    {
      name: 'Sam Whiskers',
      role: 'Convention Photographer',
      avatar: '🐱',
      subscription: 'VIP Subscriber',
      duration: '1 year',
      story: 'Professional photographer who uses OnlyFur to stay inspired and connected with the community.',
      highlight: 'Collaborated with 3 creators on projects',
      quote: "The platform introduced me to creators I now work with regularly. It's become an essential part of my creative network."
    },
    {
      name: 'Charlie Stripes',
      role: 'New to Furry Fandom',
      avatar: '🐅',
      subscription: 'Basic Subscriber',
      duration: '4 months',
      story: 'Newcomer to the furry community who found welcoming creators and educational content.',
      highlight: 'Made friends and learned about furry culture',
      quote: "As someone new to the fandom, OnlyFur helped me find my place in the community. Everyone has been so welcoming!"
    }
  ];

  const communityMetrics = [
    {
      icon: Users,
      label: 'Active Creators',
      value: '450+',
      description: 'Creators earning money monthly'
    },
    {
      icon: Heart,
      label: 'Happy Subscribers',
      value: '2,800+',
      description: 'Satisfied community members'
    },
    {
      icon: DollarSign,
      label: 'Creator Earnings',
      value: '$125K+',
      description: 'Total paid to creators this year'
    },
    {
      icon: Star,
      label: 'Content Rating',
      value: '4.8/5',
      description: 'Average subscriber satisfaction'
    }
  ];

  const achievementCategories = [
    {
      title: 'Financial Success',
      icon: TrendingUp,
      achievements: [
        'First creator to reach $3,000/month',
        '50+ creators earning over $1,000/month',
        'Average creator earnings up 200% this year',
        '95% of active creators report income growth'
      ]
    },
    {
      title: 'Community Growth',
      icon: Users,
      achievements: [
        'Welcomed 1,200+ new members this year',
        'Created 50+ local community meetups',
        'Hosted 12 virtual creator workshops',
        'Featured at 8 major furry conventions'
      ]
    },
    {
      title: 'Creative Milestones',
      icon: Award,
      achievements: [
        '10,000+ pieces of original art shared',
        '500+ successful commission projects',
        '200+ tutorial videos created',
        'First community art book published'
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full mb-6">
          <Star className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Success Stories</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">
          Real Stories, Real Success
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Meet the creators and community members who have found success, creativity, 
          and connection through OnlyFur. These are their stories.
        </p>
      </div>

      {/* Community Metrics */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Community Impact</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {communityMetrics.map((metric, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <metric.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                <h3 className="font-semibold mb-2">{metric.label}</h3>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Creator Success Stories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Creator Success Stories</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {creatorStories.map((creator, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{creator.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-lg">{creator.name}</CardTitle>
                      <Badge variant="secondary">{creator.role}</Badge>
                    </div>
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <span>{creator.months} months on platform</span>
                      <span>{creator.subscribers} subscribers</span>
                      <span className="text-green-600 font-medium">{creator.earnings}/month</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{creator.story}</p>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      Key Achievement
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">{creator.achievement}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Before:</span>
                        <p className="text-muted-foreground">{creator.beforeAfter.before}</p>
                      </div>
                      <div>
                        <span className="font-medium">After:</span>
                        <p className="text-muted-foreground">{creator.beforeAfter.after}</p>
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    <Quote className="w-4 h-4 inline mr-2" />
                    {creator.quote}
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscriber Stories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Subscriber Experiences</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {subscriberStories.map((subscriber, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{subscriber.avatar}</div>
                  <h3 className="font-semibold">{subscriber.name}</h3>
                  <Badge variant="outline" className="mt-1">{subscriber.subscription}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">{subscriber.duration} member</p>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">{subscriber.story}</p>
                
                <div className="bg-primary/5 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-sm mb-1 flex items-center">
                    <Heart className="w-3 h-3 mr-1 text-red-500" />
                    Highlight
                  </h4>
                  <p className="text-xs text-muted-foreground">{subscriber.highlight}</p>
                </div>
                
                <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
                  "{subscriber.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Achievements */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Community Achievements</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {achievementCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <category.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Creator Spotlight */}
      <Card className="mb-16 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <Crown className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Creator of the Month</h3>
            <p className="text-muted-foreground">Celebrating outstanding community members</p>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-4xl mb-4">🦊</div>
            <h4 className="text-xl font-bold mb-2">Aria Silverpaw</h4>
            <Badge className="mb-4">Digital Artist & Fursuit Designer</Badge>
            <p className="text-muted-foreground mb-6">
              Aria has created over 200 original pieces this year, mentored 15 new artists, 
              and raised $2,500 for furry charities through special art auctions. Their positive 
              impact on the community extends far beyond their beautiful artwork.
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">189</div>
                <div className="text-sm text-muted-foreground">Subscribers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Artworks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">$2.1K</div>
                <div className="text-sm text-muted-foreground">Monthly</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-linear-to-r from-yellow-500 to-orange-500 text-white border-0">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Write Your Own Success Story?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join our growing community of creators and fans. Your journey starts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/creator-program">
                <Crown className="w-4 h-4 mr-2" />
                Start Creating
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600" asChild>
              <Link to="/register">
                <Heart className="w-4 h-4 mr-2" />
                Join Community
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessStories;

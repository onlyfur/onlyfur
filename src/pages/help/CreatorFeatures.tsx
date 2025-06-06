import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Users, 
  DollarSign, 
  BarChart3, 
  MessageCircle, 
  Calendar,
  Upload,
  Settings,
  Crown,
  Star,
  Heart,
  TrendingUp,
  Lock,
  Eye,
  Download,
  Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CreatorFeatures: React.FC = () => {
  const contentTypes = [
    {
      icon: Camera,
      title: 'Photos & Artwork',
      description: 'Share high-quality images and digital art',
      formats: ['JPEG', 'PNG', 'WebP', 'GIF'],
      maxSize: '10MB per image'
    },
    {
      icon: Download,
      title: 'Videos',
      description: 'Upload video content for your subscribers',
      formats: ['MP4', 'MOV', 'WebM'],
      maxSize: '500MB per video'
    },
    {
      icon: Palette,
      title: 'Digital Art',
      description: 'Showcase your furry artwork and commissions',
      formats: ['High-res images', 'Time-lapse videos', 'Process shots'],
      maxSize: 'Up to 4K resolution'
    }
  ];

  const monetizationFeatures = [
    {
      icon: Crown,
      title: 'Subscription Tiers',
      description: 'Create multiple subscription levels with different perks',
      features: [
        'Set custom pricing for each tier',
        'Offer exclusive content per tier',
        'Limited edition tiers for special content',
        'Automatic tier benefits management'
      ]
    },
    {
      icon: DollarSign,
      title: 'Direct Tips',
      description: 'Receive one-time payments from appreciative fans',
      features: [
        'Custom tip amounts',
        'Tip messages from fans',
        'Thank you notes automation',
        'Tip milestone celebrations'
      ]
    },
    {
      icon: Lock,
      title: 'Pay-Per-View Content',
      description: 'Sell individual pieces of premium content',
      features: [
        'Set custom prices for special content',
        'Limited-time exclusive releases',
        'Bundle multiple items together',
        'Automatic access management'
      ]
    }
  ];

  const engagementTools = [
    {
      icon: MessageCircle,
      title: 'Direct Messaging',
      description: 'Connect with your subscribers personally',
      details: 'Send private messages, share exclusive previews, and build stronger relationships with your audience.'
    },
    {
      icon: Users,
      title: 'Subscriber Management',
      description: 'Track and manage your growing fanbase',
      details: 'View subscriber analytics, send broadcasts, and reward your most loyal supporters.'
    },
    {
      icon: Calendar,
      title: 'Content Scheduling',
      description: 'Plan and schedule your content releases',
      details: 'Schedule posts in advance, maintain consistent posting, and optimize for your audience\'s active hours.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your performance and growth',
      details: 'Monitor earnings, subscriber growth, content performance, and engagement metrics.'
    }
  ];

  const creatorTiers = [
    {
      name: 'Basic Creator',
      price: 'Free',
      features: [
        'Upload up to 720p videos',
        'Basic analytics',
        'Standard support',
        'Community features'
      ],
      limits: {
        storage: '5GB',
        uploads: '50/month',
        tiers: '3 subscription tiers'
      }
    },
    {
      name: 'Pro Creator',
      price: '$29.99/month',
      features: [
        'Upload up to 1080p videos',
        'Advanced analytics',
        'Priority support',
        'Custom branding options',
        'Advanced scheduling tools'
      ],
      limits: {
        storage: '100GB',
        uploads: 'Unlimited',
        tiers: '10 subscription tiers'
      }
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Creator Features & Tools</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover all the tools and features available to help you succeed as a content creator on OnlyFur
        </p>
      </div>

      {/* Content Creation */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Content Creation</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {contentTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <type.icon className="w-5 h-5 mr-2 text-primary" />
                  {type.title}
                </CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Supported Formats:</p>
                    <div className="flex flex-wrap gap-1">
                      {type.formats.map((format, formatIndex) => (
                        <Badge key={formatIndex} variant="secondary" className="text-xs">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Max Size: <span className="font-normal text-muted-foreground">{type.maxSize}</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monetization */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Monetization Options</h2>
        <div className="space-y-6">
          {monetizationFeatures.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <feature.icon className="w-6 h-6 mr-3 text-primary" />
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Engagement Tools */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-6 h-6 mr-3 text-primary" />
            Audience Engagement Tools
          </CardTitle>
          <CardDescription>
            Build stronger connections with your subscribers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {engagementTools.map((tool, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3">
                  <tool.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{tool.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{tool.details}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Creator Tiers */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Creator Subscription Plans</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {creatorTiers.map((tier, index) => (
            <Card key={index} className={index === 1 ? 'border-primary relative' : ''}>
              {index === 1 && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                  Recommended
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="text-2xl font-bold text-primary">
                  {tier.price}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <Star className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Limits:</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Storage:</span> {tier.limits.storage}</p>
                      <p><span className="font-medium">Monthly Uploads:</span> {tier.limits.uploads}</p>
                      <p><span className="font-medium">Subscription Tiers:</span> {tier.limits.tiers}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-6 h-6 mr-3 text-primary" />
            Getting Started as a Creator
          </CardTitle>
          <CardDescription>
            Quick steps to begin your creator journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/register">
                <Button className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Create Creator Account
                </Button>
              </Link>
              <Link to="/creator-program">
                <Button variant="outline" className="w-full justify-start">
                  <Crown className="w-4 h-4 mr-2" />
                  Learn About Creator Program
                </Button>
              </Link>
              <Link to="/best-practices">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Best Practices Guide
                </Button>
              </Link>
              <Link to="/analytics-guide">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Guide
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Alert>
        <MessageCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Need help getting started?</strong> Our creator support team is here to help you succeed. 
          <Link to="/contact" className="underline ml-1">Contact us</Link> for personalized assistance.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CreatorFeatures;

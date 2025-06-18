import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Star, 
  Zap, 
  Heart,
  DollarSign,
  Users,
  MessageCircle,
  Eye,
  Download,
  Calendar,
  CheckCircle,
  Info,
  CreditCard,
  Gift,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionTiers: React.FC = () => {
  const subscriberTiers = [
    {
      name: "Basic Subscriber",
      price: "$9.99/month",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      features: [
        "Access to basic creator content",
        "Like and comment on posts",
        "Follow up to 10 creators",
        "Basic messaging (5 messages/day)",
        "Standard video quality",
        "Community forum access"
      ],
      limitations: [
        "Limited to 10 followed creators",
        "No HD video access",
        "Cannot download content",
        "Limited messaging quota"
      ]
    },
    {
      name: "Pro Subscriber", 
      price: "$19.99/month",
      icon: <Star className="h-6 w-6" />,
      color: "bg-purple-500",
      popular: true,
      features: [
        "Access to premium creator content",
        "HD video streaming",
        "Follow unlimited creators",
        "Unlimited messaging",
        "Early access to new content",
        "Exclusive subscriber events",
        "Priority customer support",
        "Content download for offline viewing"
      ],
      limitations: [
        "No exclusive VIP content access",
        "Cannot request custom content"
      ]
    },
    {
      name: "VIP Subscriber",
      price: "$39.99/month", 
      icon: <Crown className="h-6 w-6" />,
      color: "bg-linear-to-r from-amber-500 to-orange-500",
      features: [
        "All Pro Subscriber benefits",
        "Exclusive VIP-only content",
        "Direct creator messaging privileges",
        "Custom content requests",
        "VIP badge and profile highlight",
        "Exclusive live streams and events",
        "Advanced content filters",
        "Priority in creator queues",
        "Special VIP community access"
      ],
      limitations: []
    }
  ];

  const creatorTiers = [
    {
      name: "Basic Creator",
      price: "Free",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-green-500",
      features: [
        "Upload up to 50 posts/month",
        "Basic analytics dashboard",
        "Accept tips and donations",
        "Basic subscriber management",
        "Standard content tools",
        "Community support access"
      ],
      limitations: [
        "Limited to 500 subscribers",
        "No advanced analytics",
        "Basic customization options",
        "Standard support priority"
      ]
    },
    {
      name: "Pro Creator",
      price: "$29.99/month",
      icon: <Zap className="h-6 w-6" />,
      color: "bg-indigo-500", 
      popular: true,
      features: [
        "Unlimited content uploads",
        "Advanced analytics & insights",
        "Custom subscription pricing",
        "Live streaming capabilities",
        "Advanced content scheduling",
        "Subscriber segmentation tools",
        "Priority customer support",
        "Revenue optimization tools"
      ],
      limitations: [
        "No white-label options",
        "Standard commission rates"
      ]
    },
    {
      name: "Premium Creator",
      price: "$49.99/month",
      icon: <Crown className="h-6 w-6" />,
      color: "bg-linear-to-r from-pink-500 to-red-500",
      features: [
        "All Pro Creator benefits", 
        "Reduced platform commission (5% vs 10%)",
        "Custom branding options",
        "Advanced fan interaction tools",
        "Exclusive creator resources",
        "Dedicated account manager",
        "Early access to new features",
        "Premium content protection",
        "Advanced monetization options"
      ],
      limitations: []
    }
  ];

  const comparisonFeatures = [
    {
      category: "Content Access",
      features: [
        { name: "Basic Creator Content", basic: true, pro: true, vip: true },
        { name: "HD Video Quality", basic: false, pro: true, vip: true },
        { name: "Exclusive VIP Content", basic: false, pro: false, vip: true },
        { name: "Custom Content Requests", basic: false, pro: false, vip: true }
      ]
    },
    {
      category: "Communication",
      features: [
        { name: "Basic Messaging", basic: "5/day", pro: "Unlimited", vip: "Priority" },
        { name: "Creator Direct Messages", basic: false, pro: "Limited", vip: "Unlimited" },
        { name: "Live Stream Access", basic: "Public only", pro: "All streams", vip: "VIP exclusive" }
      ]
    },
    {
      category: "Community Features",
      features: [
        { name: "Follow Creators", basic: "10 max", pro: "Unlimited", vip: "Unlimited" },
        { name: "Community Forums", basic: true, pro: true, vip: true },
        { name: "Exclusive Events", basic: false, pro: "Some", vip: "All" },
        { name: "VIP Badge", basic: false, pro: false, vip: true }
      ]
    }
  ];

  const getFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? <CheckCircle className="h-4 w-4 text-green-500" /> : <span className="text-gray-400">-</span>;
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/help">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Center
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Crown className="w-6 h-6 text-purple-500" />
          <Badge variant="secondary">Billing & Subscriptions</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Subscription tiers overview</h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect subscription tier for your needs. Whether you're a creator looking to monetize 
          or a subscriber wanting to support your favorite artists.
        </p>
      </div>

      {/* Quick Comparison Alert */}
      <Alert className="mb-8 border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
        <Info className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800 dark:text-purple-200">
          <strong>Quick Tip:</strong> You can upgrade or downgrade your subscription at any time. 
          Changes take effect at your next billing cycle.
        </AlertDescription>
      </Alert>

      {/* Subscriber Tiers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-3 h-6 w-6 text-blue-500" />
            Subscriber Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Support your favorite creators and unlock exclusive content with our subscriber plans.
          </p>
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {subscriberTiers.map((tier, index) => (
                <div key={tier.name} className={`border rounded-lg overflow-hidden ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}>
                  {tier.popular && (
                    <div className="bg-purple-500 text-white text-center py-1 text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-full text-white mr-3 ${tier.color}`}>
                        {tier.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{tier.name}</h3>
                        <div className="text-lg font-bold text-primary">{tier.price}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">Included Features:</h4>
                        <ul className="space-y-1">
                          {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {tier.limitations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Limitations:</h4>
                          <ul className="space-y-1">
                            {tier.limitations.map((limitation, idx) => (
                              <li key={idx} className="flex items-start text-sm text-muted-foreground">
                                <span className="mr-2 mt-0.5">•</span>
                                <span className="text-sm">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <Button className="w-full mt-4" size="sm" variant={tier.popular ? "default" : "outline"}>
                      Choose {tier.name}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
      </Card>

      {/* Creator Tiers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="mr-3 h-6 w-6 text-purple-500" />
            Creator Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Unlock advanced tools and features to grow your creator business and maximize earnings.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {creatorTiers.map((tier, index) => (
                <div key={tier.name} className={`border rounded-lg overflow-hidden ${tier.popular ? 'ring-2 ring-indigo-500' : ''}`}>
                  {tier.popular && (
                    <div className="bg-indigo-500 text-white text-center py-1 text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-full text-white mr-3 ${tier.color}`}>
                        {tier.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{tier.name}</h3>
                        <div className="text-lg font-bold text-primary">{tier.price}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">Creator Tools:</h4>
                        <ul className="space-y-1">
                          {tier.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {tier.limitations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Limitations:</h4>
                          <ul className="space-y-1">
                            {tier.limitations.map((limitation, idx) => (
                              <li key={idx} className="flex items-start text-sm text-muted-foreground">
                                <span className="mr-2 mt-0.5">•</span>
                                <span className="text-sm">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <Button className="w-full mt-4" size="sm" variant={tier.popular ? "default" : "outline"}>
                      Choose {tier.name}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-3 h-6 w-6 text-green-500" />
            Detailed Feature Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Features</th>
                    <th className="text-center p-3 text-sm font-medium">Basic ($9.99)</th>
                    <th className="text-center p-3 text-sm font-medium">Pro ($19.99)</th>
                    <th className="text-center p-3 text-sm font-medium">VIP ($39.99)</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <React.Fragment key={category.category}>
                      <tr className="bg-muted/30">
                        <td colSpan={4} className="p-3 text-sm font-medium text-primary">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-b">
                          <td className="p-3 text-sm">{feature.name}</td>
                          <td className="p-3 text-center">{getFeatureValue(feature.basic)}</td>
                          <td className="p-3 text-center">{getFeatureValue(feature.pro)}</td>
                          <td className="p-3 text-center">{getFeatureValue(feature.vip)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-3 h-6 w-6 text-amber-500" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h4 className="font-medium text-sm mb-1">Can I change my subscription tier?</h4>
                <p className="text-sm text-muted-foreground">Yes! You can upgrade or downgrade at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle.</p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium text-sm mb-1">What happens if I cancel my subscription?</h4>
                <p className="text-sm text-muted-foreground">You'll retain access to your current tier benefits until the end of your billing period. After that, you'll be moved to the Basic tier with limited features.</p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium text-sm mb-1">Are there any hidden fees?</h4>
                <p className="text-sm text-muted-foreground">No hidden fees! The listed price is what you pay. Creators pay a small platform commission on earnings (5-10% depending on tier).</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Can I get a refund?</h4>
                <p className="text-sm text-muted-foreground">We offer a 7-day money-back guarantee for new subscribers. Refunds are processed within 3-5 business days.</p>
              </div>
            </div>
          </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">Ready to Choose Your Tier?</h3>
                <p className="text-muted-foreground">
                  Join thousands of creators and subscribers who are already part of the OnlyFur community.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="default" size="sm" asChild>
                  <Link to="/subscribe">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View All Plans
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/help/billing-and-payments">
                    <Gift className="mr-2 h-4 w-4" />
                    Billing Help
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
      </Card>

      {/* Related Articles */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Related Help Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-xs transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <CreditCard className="h-4 w-4 text-primary mr-2" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">Learn about accepted payment methods and billing.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/payment-methods">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xs transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Users className="h-4 w-4 text-primary mr-2" />
                  Creator Onboarding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">Get started as a creator and set up monetization.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/creator-onboarding">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xs transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Download className="h-4 w-4 text-primary mr-2" />
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3 text-sm">Manage your subscription and account settings.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/account-management">Read More</Link>
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTiers;

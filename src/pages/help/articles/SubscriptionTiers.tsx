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
  Gift
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
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
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
      price: "$59.99/month",
      icon: <Crown className="h-6 w-6" />,
      color: "bg-gradient-to-r from-pink-500 to-red-500",
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
      return value ? <CheckCircle className="h-4 w-4 text-green-500" /> : <span className="text-gray-400">—</span>;
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-6">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Subscription Guide</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
            Understanding Subscription Tiers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the perfect subscription tier for your needs. Whether you're a creator looking to monetize 
            or a subscriber wanting to support your favorite artists, we have options for everyone.
          </p>
        </div>

        {/* Quick Comparison Alert */}
        <Alert className="mb-12 border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
          <Info className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800 dark:text-purple-200">
            <strong>Quick Tip:</strong> You can upgrade or downgrade your subscription at any time. 
            Changes take effect at your next billing cycle.
          </AlertDescription>
        </Alert>

        {/* Subscriber Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Subscriber Tiers</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Support your favorite creators and unlock exclusive content with our subscriber plans.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {subscriberTiers.map((tier, index) => (
              <Card key={tier.name} className={`relative overflow-hidden ${tier.popular ? 'ring-2 ring-purple-500 shadow-lg scale-105' : ''}`}>
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={`text-center ${tier.popular ? 'pt-8' : ''}`}>
                  <div className={`mx-auto p-4 rounded-full text-white w-fit mb-4 ${tier.color}`}>
                    {tier.icon}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tier.price}</div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">✅ Included Features:</h4>
                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {tier.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-600 dark:text-gray-400">⚠️ Limitations:</h4>
                        <ul className="space-y-2">
                          {tier.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start text-sm text-muted-foreground">
                              <span className="mr-2 mt-0.5">•</span>
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full mt-6" variant={tier.popular ? "default" : "outline"}>
                    Choose {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Creator Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Creator Tiers</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unlock advanced tools and features to grow your creator business and maximize earnings.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {creatorTiers.map((tier, index) => (
              <Card key={tier.name} className={`relative overflow-hidden ${tier.popular ? 'ring-2 ring-indigo-500 shadow-lg scale-105' : ''}`}>
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={`text-center ${tier.popular ? 'pt-8' : ''}`}>
                  <div className={`mx-auto p-4 rounded-full text-white w-fit mb-4 ${tier.color}`}>
                    {tier.icon}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tier.price}</div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">✅ Creator Tools:</h4>
                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {tier.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-600 dark:text-gray-400">⚠️ Limitations:</h4>
                        <ul className="space-y-2">
                          {tier.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start text-sm text-muted-foreground">
                              <span className="mr-2 mt-0.5">•</span>
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full mt-6" variant={tier.popular ? "default" : "outline"}>
                    Choose {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Detailed Feature Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Features</th>
                      <th className="text-center p-4 font-semibold">Basic ($9.99)</th>
                      <th className="text-center p-4 font-semibold">Pro ($19.99)</th>
                      <th className="text-center p-4 font-semibold">VIP ($39.99)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((category, categoryIndex) => (
                      <React.Fragment key={category.category}>
                        <tr className="bg-muted/30">
                          <td colSpan={4} className="p-4 font-semibold text-primary">
                            {category.category}
                          </td>
                        </tr>
                        {category.features.map((feature, featureIndex) => (
                          <tr key={featureIndex} className="border-b">
                            <td className="p-4">{feature.name}</td>
                            <td className="p-4 text-center">{getFeatureValue(feature.basic)}</td>
                            <td className="p-4 text-center">{getFeatureValue(feature.pro)}</td>
                            <td className="p-4 text-center">{getFeatureValue(feature.vip)}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Can I change my subscription tier?</h4>
                <p className="text-muted-foreground">Yes! You can upgrade or downgrade at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">What happens if I cancel my subscription?</h4>
                <p className="text-muted-foreground">You'll retain access to your current tier benefits until the end of your billing period. After that, you'll be moved to the Basic tier with limited features.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Are there any hidden fees?</h4>
                <p className="text-muted-foreground">No hidden fees! The listed price is what you pay. Creators pay a small platform commission on earnings (5-10% depending on tier).</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Can I get a refund?</h4>
                <p className="text-muted-foreground">We offer a 7-day money-back guarantee for new subscribers. Refunds are processed within 3-5 business days.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Choose Your Tier?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creators and subscribers who are already part of the OnlyFur community. 
              Start your journey today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-purple-600 hover:text-purple-700" asChild>
                <Link to="/subscribe">
                  <CreditCard className="mr-2 h-5 w-5" />
                  View All Plans
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
                <Link to="/help/billing-and-payments">
                  <Gift className="mr-2 h-5 w-5" />
                  Billing Help
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6 text-center">Related Help Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <CreditCard className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Learn about accepted payment methods and billing.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/payment-methods">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Creator Onboarding</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Get started as a creator and set up monetization.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/creator-onboarding">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Download className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Account Management</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Manage your subscription and account settings.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/account-management">Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTiers;

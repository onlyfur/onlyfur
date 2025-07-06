import React from 'react';
import { ArrowLeft, CreditCard, Heart, Users, Gift, Star, Settings, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const FirstSubscription: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-pink-600" />
          <div>
            <h1 className="text-3xl font-bold">Your First Subscription</h1>
            <p className="text-muted-foreground">Step-by-step guide to subscribing and supporting your favorite creators</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Getting Started</Badge>
          <Badge variant="secondary">Subscriptions</Badge>
          <Badge variant="secondary">Support Creators</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-pink-200 bg-pink-50">
        <Gift className="h-4 w-4 text-pink-600" />
        <AlertDescription className="text-pink-800">
          <strong>Support Amazing Creators:</strong> Subscribing to creators is the best way to support their work while gaining access to exclusive content and building meaningful connections.
        </AlertDescription>
      </Alert>

      {/* Understanding Subscriptions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            What is a Subscription?
          </CardTitle>
          <CardDescription>
            Learn about how subscriptions work on OnlyFur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600 mb-2">What You Get</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Access to exclusive creator content</li>
                  <li>• Early access to new posts and updates</li>
                  <li>• Direct messaging with creators (tier dependent)</li>
                  <li>• Community features and interactions</li>
                  <li>• Special perks and bonuses</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Subscription Tiers</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Basic: Essential content access</li>
                  <li>• Premium: Enhanced benefits and exclusive content</li>
                  <li>• VIP: Maximum perks and personalized attention</li>
                  <li>• Custom: Creator-specific tier names and benefits</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-600 mb-2">How Billing Works</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monthly recurring payments</li>
                  <li>• Secure payment processing</li>
                  <li>• Cancel anytime without penalty</li>
                  <li>• Prorated billing for mid-month changes</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-600 mb-2">Creator Support</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Creators receive majority of subscription fee</li>
                  <li>• Direct financial support for their work</li>
                  <li>• Helps creators create more content</li>
                  <li>• Builds sustainable creator economy</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Subscribe */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            How to Subscribe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Find a Creator</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Use the search function or browse categories to find creators whose content interests you.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/help/articles/finding-creators">How to Find Creators</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Review Their Profile</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Check out their profile, sample content, subscription tiers, and pricing to make sure it's a good fit.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg mt-2">
                  <p className="text-sm text-blue-800"><strong>Tip:</strong> Look for preview content and creator descriptions to understand what you'll get.</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Choose Your Tier</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Select the subscription tier that fits your budget and desired level of access. You can always upgrade later.
                </p>
                <div className="grid sm:grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Star className="h-4 w-4 mx-auto text-yellow-600 mb-1" />
                    <p className="text-xs font-medium">Basic Tier</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <Star className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <p className="text-xs font-medium">Premium Tier</p>
                  </div>
                  <div className="text-center p-2 bg-gold-50 rounded" style={{backgroundColor: '#fef7cd'}}>
                    <Star className="h-4 w-4 mx-auto text-yellow-600 mb-1" />
                    <p className="text-xs font-medium">VIP Tier</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Add Payment Method</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Enter your payment information securely. We support credit cards, PayPal, and other payment methods.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/help/articles/payment-methods">Payment Methods Guide</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-green-600">5</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Complete & Enjoy!</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Confirm your subscription and immediately gain access to the creator's content. Welcome to the community!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Managing Your Subscription */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Managing Your Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Once subscribed, you have full control over your subscription through your account dashboard.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-3">What You Can Do</h4>
                <ul className="text-sm space-y-2">
                  <li>• View all active subscriptions</li>
                  <li>• Upgrade or downgrade tiers</li>
                  <li>• Update payment methods</li>
                  <li>• Track subscription history</li>
                  <li>• Manage renewal settings</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-3">Subscription Features</h4>
                <ul className="text-sm space-y-2">
                  <li>• Pause subscriptions temporarily</li>
                  <li>• Cancel anytime without fees</li>
                  <li>• Gift subscriptions to friends</li>
                  <li>• Set spending limits and budgets</li>
                  <li>• Receive renewal notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Etiquette */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Subscriber Etiquette & Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Good Subscriber Practices</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Engage respectfully with creator content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Respect creators' boundaries and content rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Provide constructive feedback when appropriate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Support creators beyond just subscribing</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-600 mb-3">What to Avoid</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Don't share or redistribute exclusive content</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Avoid demanding content outside creator's scope</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Don't attempt chargebacks for valid subscriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Avoid harassment or inappropriate behavior</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Questions?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have any questions about subscriptions or need help managing your account, we're here to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/help/articles/subscription-management">Subscription Management</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/support/contact">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstSubscription;

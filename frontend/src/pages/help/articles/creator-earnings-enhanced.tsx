import React from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, CreditCard, Gift, Users, BarChart3, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const CreatorEarnings: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Creator Earnings</h1>
            <p className="text-muted-foreground">Comprehensive guide to earning money as a creator on OnlyFur</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Creator Resources</Badge>
          <Badge variant="secondary">Monetization</Badge>
          <Badge variant="secondary">Payments</Badge>
        </div>
      </div>

      {/* Overview */}
      <Alert className="mb-8 border-green-200 bg-green-50">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Multiple revenue streams:</strong> OnlyFur creators can earn through subscriptions, tips, custom content, and exclusive offerings. Our transparent system ensures you keep more of what you earn.
        </AlertDescription>
      </Alert>

      {/* Revenue Streams */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue Streams for Creators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Subscription Revenue</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Monthly recurring income from subscribers. Set your own pricing tiers and offer different access levels.
                </p>
                <p className="text-xs text-blue-600 mt-2">Primary income source for most creators</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Tips & Donations</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Direct support from fans who want to show extra appreciation for your content and engagement.
                </p>
                <p className="text-xs text-green-600 mt-2">Boost engagement and show fan appreciation</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">Custom Commissions</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Personalized content requests from subscribers willing to pay premium prices for exclusive material.
                </p>
                <p className="text-xs text-purple-600 mt-2">High-value, personalized offerings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold">Pay-Per-View Content</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Premium posts that require additional payment to unlock, perfect for special or exclusive content.
                </p>
                <p className="text-xs text-orange-600 mt-2">Monetize premium content directly</p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-semibold">Live Stream Revenue</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Earn from live interactions, virtual gifts, and real-time engagement with your audience.
                </p>
                <p className="text-xs text-pink-600 mt-2">Interactive earning opportunities</p>
              </div>

              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-semibold">Merchandise & Products</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Sell physical or digital products directly to your subscribers through integrated marketplace features.
                </p>
                <p className="text-xs text-indigo-600 mt-2">Expand beyond digital content</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creator Tiers & Revenue Sharing */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Creator Tiers & Revenue Sharing
          </CardTitle>
          <CardDescription>
            Your creator tier determines your revenue share percentage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <h4 className="font-semibold mb-2">Basic Creator</h4>
              <div className="text-2xl font-bold text-gray-600 mb-2">80%</div>
              <p className="text-sm text-muted-foreground">Revenue share for new creators</p>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>• Standard analytics</li>
                <li>• Basic support</li>
                <li>• Standard features</li>
              </ul>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Pro Creator</h4>
              <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
              <p className="text-sm text-muted-foreground">For established creators</p>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>• Advanced analytics</li>
                <li>• Priority support</li>
                <li>• Enhanced features</li>
              </ul>
            </div>

            <div className="text-center p-6 bg-gold-50 rounded-lg border-2 border-yellow-200">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">Elite Creator</h4>
              <div className="text-2xl font-bold text-yellow-600 mb-2">90%</div>
              <p className="text-sm text-muted-foreground">Top-tier creators</p>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>• Premium analytics</li>
                <li>• Dedicated support</li>
                <li>• All features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Process */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Process & Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">1</div>
              <div>
                <h4 className="font-semibold mb-2">Set Up Payment Method</h4>
                <p className="text-muted-foreground mb-2">Configure your preferred payment method in account settings:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Bank transfer (ACH/Wire)</li>
                  <li>• PayPal</li>
                  <li>• Digital wallets</li>
                  <li>• Cryptocurrency (where available)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">2</div>
              <div>
                <h4 className="font-semibold mb-2">Monthly Processing</h4>
                <p className="text-muted-foreground mb-2">Earnings are calculated and processed monthly:</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><strong>Payment Schedule:</strong></p>
                  <ul className="mt-1 space-y-1">
                    <li>• Earnings period: 1st to last day of month</li>
                    <li>• Processing: 1st-5th of following month</li>
                    <li>• Payment delivery: 5th-10th of month</li>
                    <li>• Minimum payout: $50</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">3</div>
              <div>
                <h4 className="font-semibold mb-2">Tax Reporting</h4>
                <p className="text-muted-foreground">Detailed earnings statements and tax documents provided annually for easy filing.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maximizing Earnings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Strategies to Maximize Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-600 mb-3">Content Strategy</h4>
              <ul className="space-y-2 text-sm">
                <li>• Post consistently to maintain engagement</li>
                <li>• Offer diverse content types and formats</li>
                <li>• Create exclusive content for higher tiers</li>
                <li>• Use polls and feedback to understand audience</li>
                <li>• Collaborate with other creators</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Engagement & Growth</h4>
              <ul className="space-y-2 text-sm">
                <li>• Respond to messages and comments promptly</li>
                <li>• Host live streams and interactive events</li>
                <li>• Promote your profile on social media</li>
                <li>• Offer limited-time promotions and discounts</li>
                <li>• Build a community around your brand</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Tracking */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Earnings Analytics & Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Monitor your performance with comprehensive analytics:</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-600">Daily Revenue</h4>
              <p className="text-sm text-muted-foreground">Track daily earning trends</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-600">Subscriber Growth</h4>
              <p className="text-sm text-muted-foreground">Monitor audience expansion</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-600">Content Performance</h4>
              <p className="text-sm text-muted-foreground">See what content earns most</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-600">Payout History</h4>
              <p className="text-sm text-muted-foreground">Complete payment records</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Questions About Earnings?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our creator success team is here to help you maximize your earning potential and resolve any payment issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/support/contact">Contact Creator Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:earnings@onlyfur.net">earnings@onlyfur.net</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorEarnings;

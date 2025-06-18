import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Star, Gem, DollarSign, Users, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionTiersGuide: React.FC = () => {
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
          <Badge variant="secondary">Getting Started</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Understanding subscription tiers</h1>
        <p className="text-xl text-muted-foreground">
          Learn about Basic, Premium, and VIP subscriber levels and choose the right tier for your needs.
        </p>
      </div>

      {/* Tier Overview */}
      <Card className="mb-8 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Subscription Tier System</h3>
          <p className="text-muted-foreground mb-4">
            OnlyFur uses a three-tier subscription system that allows creators to offer different levels of access and benefits. Each tier provides increasing value and exclusivity.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-blue-500" />
              <span className="font-medium">Basic Tier</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-purple-500" />
              <span className="font-medium">Premium Tier</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gem className="w-6 h-6 text-yellow-500" />
              <span className="font-medium">VIP Tier</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Basic Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-blue-500" />
              Basic Tier ($9.99 - $19.99/month)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What's Included:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Content Access</h5>
                  <ul className="text-sm space-y-1">
                    <li>• General content posts (3-5 per week)</li>
                    <li>• Standard quality images and videos</li>
                    <li>• Basic behind-the-scenes content</li>
                    <li>• Community posts and updates</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Community Features</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Comment on all posts</li>
                    <li>• Like and react to content</li>
                    <li>• Basic message responses</li>
                    <li>• Access to subscriber-only posts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-semibold mb-2">Perfect For:</h5>
              <ul className="text-sm space-y-1">
                <li>• New subscribers testing a creator's content</li>
                <li>• Budget-conscious fans who want regular content</li>
                <li>• Casual followers who enjoy the creator's work</li>
                <li>• Those wanting to support creators affordably</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Typical Pricing Range:</h4>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 rounded-full">$9.99/month</span>
                <span className="px-3 py-1 bg-blue-100 rounded-full">$14.99/month</span>
                <span className="px-3 py-1 bg-blue-100 rounded-full">$19.99/month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2 text-purple-500" />
              Premium Tier ($19.99 - $49.99/month)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Everything in Basic, Plus:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-purple-600 mb-2">Exclusive Content</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Premium exclusive posts (2-3 per week)</li>
                    <li>• Higher resolution downloads</li>
                    <li>• Early access to new content</li>
                    <li>• Extended behind-the-scenes material</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-600 mb-2">Enhanced Interaction</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Priority message responses</li>
                    <li>• Monthly live Q&A sessions</li>
                    <li>• Exclusive polls and voting</li>
                    <li>• Premium Discord access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h5 className="font-semibold mb-2">Perfect For:</h5>
              <ul className="text-sm space-y-1">
                <li>• Dedicated fans who want more exclusive content</li>
                <li>• Subscribers who enjoy direct creator interaction</li>
                <li>• Those who want higher quality downloads</li>
                <li>• Fans who like early access to new content</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Typical Pricing Range:</h4>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 bg-purple-100 rounded-full">$19.99/month</span>
                <span className="px-3 py-1 bg-purple-100 rounded-full">$29.99/month</span>
                <span className="px-3 py-1 bg-purple-100 rounded-full">$49.99/month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VIP Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gem className="w-5 h-5 mr-2 text-yellow-500" />
              VIP Tier ($39.99 - $99.99/month)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Everything in Premium, Plus:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-yellow-600 mb-2">VIP Exclusive Access</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Personal interaction and messages</li>
                    <li>• Custom content requests</li>
                    <li>• Commission discounts (10-25%)</li>
                    <li>• Exclusive VIP-only content</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-yellow-600 mb-2">Premium Perks</h5>
                  <ul className="text-sm space-y-1">
                    <li>• One-on-one video calls (monthly)</li>
                    <li>• Physical merchandise included</li>
                    <li>• Name in creator credits</li>
                    <li>• Exclusive VIP Discord channel</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h5 className="font-semibold mb-2">Perfect For:</h5>
              <ul className="text-sm space-y-1">
                <li>• Super fans who want personal interaction</li>
                <li>• Collectors who want exclusive merchandise</li>
                <li>• Business collaborators and partners</li>
                <li>• Those who want to significantly support creators</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Typical Pricing Range:</h4>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 bg-yellow-100 rounded-full">$39.99/month</span>
                <span className="px-3 py-1 bg-yellow-100 rounded-full">$59.99/month</span>
                <span className="px-3 py-1 bg-yellow-100 rounded-full">$99.99/month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Feature</th>
                    <th className="text-center p-2">
                      <Star className="w-4 h-4 inline text-blue-500" />
                      <br />Basic
                    </th>
                    <th className="text-center p-2">
                      <Crown className="w-4 h-4 inline text-purple-500" />
                      <br />Premium
                    </th>
                    <th className="text-center p-2">
                      <Gem className="w-4 h-4 inline text-yellow-500" />
                      <br />VIP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">General content posts</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Commenting and likes</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Basic messaging</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Exclusive premium content</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Early access to content</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Priority message responses</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Higher resolution downloads</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Custom content requests</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Personal interaction</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Commission discounts</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">❌</td>
                    <td className="text-center p-2">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Choosing the Right Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Choosing the Right Tier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Consider These Factors:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Budget Considerations</h5>
                  <ul className="text-sm space-y-1">
                    <li>• How much can you comfortably spend monthly?</li>
                    <li>• Do you want to support multiple creators?</li>
                    <li>• Are you looking for the best value per dollar?</li>
                    <li>• Can you commit to recurring payments?</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Content Preferences</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Do you want exclusive, premium content?</li>
                    <li>• How important is high-quality downloads?</li>
                    <li>• Do you enjoy direct creator interaction?</li>
                    <li>• Are you interested in custom content?</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tier Recommendations:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Start with Basic if you're:</p>
                  <p className="text-xs text-muted-foreground">New to the creator, on a budget, or want to test the content quality first</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Choose Premium if you're:</p>
                  <p className="text-xs text-muted-foreground">A dedicated fan who wants more exclusive content and better interaction</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Go VIP if you're:</p>
                  <p className="text-xs text-muted-foreground">A super fan who wants personal interaction and custom content</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pro Tip:</strong> You can always upgrade or downgrade your subscription tier. Many subscribers start with Basic and upgrade as they become more invested in a creator's content!</p>
            </div>
          </CardContent>
        </Card>

        {/* Managing Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Managing Multiple Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Subscription Strategy Tips:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-purple-600 mb-2">Budget Management</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Set a monthly subscription budget</li>
                    <li>• Mix different tier levels across creators</li>
                    <li>• Consider annual payments for discounts</li>
                    <li>• Review subscriptions monthly</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Portfolio Diversification</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Support creators of different sizes</li>
                    <li>• Subscribe to various content types</li>
                    <li>• Balance established and new creators</li>
                    <li>• Consider geographic diversity</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Subscription Portfolios:</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Budget Conscious ($30/month)</h5>
                  <p className="text-xs text-muted-foreground">3 Basic subscriptions @ $10 each</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Balanced Supporter ($75/month)</h5>
                  <p className="text-xs text-muted-foreground">2 Basic ($20) + 2 Premium ($40) + 1 Basic ($15)</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Premium Supporter ($150/month)</h5>
                  <p className="text-xs text-muted-foreground">1 VIP ($60) + 3 Premium ($90)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Articles */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/first-subscription" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Your first subscription - what to expect</h4>
              <p className="text-sm text-muted-foreground mt-1">Guide for new subscribers</p>
            </Link>
            <Link to="/help/articles/subscription-management" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Subscription renewal and cancellation</h4>
              <p className="text-sm text-muted-foreground mt-1">Manage your subscription settings</p>
            </Link>
            <Link to="/help/articles/payment-methods" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Updating your payment method</h4>
              <p className="text-sm text-muted-foreground mt-1">Change credit cards and payment details</p>
            </Link>
            <Link to="/help/articles/messaging-creators" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How to message creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Start conversations with your favorite creators</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help Choosing a Tier?</h3>
          <p className="mb-4 opacity-90">Our support team can help you find the right subscription level for your budget and interests.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Get Subscription Advice</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionTiersGuide;

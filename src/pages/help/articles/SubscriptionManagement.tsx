import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, CreditCard, Calendar, XCircle, ArrowUpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionManagement: React.FC = () => {
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
          <RefreshCw className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Payments & Billing</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Subscription renewal and cancellation</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to manage your subscriptions, change tiers, update payment methods, and cancel when needed.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 bg-linear-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Quick Subscription Actions</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <ArrowUpCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Upgrade/Downgrade</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Update Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Change Renewal</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Cancel Subscription</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Managing Active Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-blue-500" />
              Managing Your Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Accessing Subscription Management:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Go to Account Settings</p>
                    <p className="text-muted-foreground">Click your profile picture → Account Settings</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Select Subscriptions Tab</p>
                    <p className="text-muted-foreground">Find "My Subscriptions" in the sidebar menu</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">View All Subscriptions</p>
                    <p className="text-muted-foreground">See status, renewal dates, and management options</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Subscription Dashboard Overview:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Active Subscriptions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Current subscription tier</li>
                    <li>• Monthly or annual billing</li>
                    <li>• Next renewal date</li>
                    <li>• Subscription cost</li>
                    <li>• Creator name and profile link</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Billing Information</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Payment method on file</li>
                    <li>• Billing history</li>
                    <li>• Download receipts</li>
                    <li>• Tax information</li>
                    <li>• Next payment amount</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changing Subscription Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowUpCircle className="w-5 h-5 mr-2 text-purple-500" />
              Changing Subscription Tiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Upgrading Your Subscription:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Immediate Upgrade</p>
                  <p className="text-xs text-muted-foreground">Upgrade takes effect immediately. You'll be charged the prorated difference for the current billing period.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">New Features Access</p>
                  <p className="text-xs text-muted-foreground">Get instant access to higher-tier benefits like priority messaging, exclusive content, and better perks.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Billing Adjustment</p>
                  <p className="text-xs text-muted-foreground">Next renewal will be at the new tier price. No need to wait until the next billing cycle.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Downgrading Your Subscription:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">End of Current Period</p>
                  <p className="text-xs text-muted-foreground">Downgrades take effect at the end of your current billing period. Keep current benefits until then.</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">No Refunds</p>
                  <p className="text-xs text-muted-foreground">No partial refunds for downgrades, but you keep access until the next billing cycle.</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Feature Loss</p>
                  <p className="text-xs text-muted-foreground">You'll lose access to higher-tier features like premium content, priority support, and exclusive perks.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">How to Change Tiers:</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <ol className="text-sm space-y-1">
                  <li>1. Go to your subscription management page</li>
                  <li>2. Find the creator whose tier you want to change</li>
                  <li>3. Click "Change Tier" or "Manage Subscription"</li>
                  <li>4. Select your new desired tier</li>
                  <li>5. Review billing changes and confirm</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-green-500" />
              Updating Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">When to Update Payment Info:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Common Scenarios</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Credit card expiring soon</li>
                    <li>• Card was lost or stolen</li>
                    <li>• Bank account changes</li>
                    <li>• Want to use different payment method</li>
                    <li>• Failed payment notifications</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Proactive Updates</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Update before expiration date</li>
                    <li>• Set up backup payment methods</li>
                    <li>• Monitor payment notifications</li>
                    <li>• Keep contact info current</li>
                    <li>• Enable automatic updates (where available)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Payment Update Process:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Access Payment Settings</h5>
                    <p className="text-xs text-muted-foreground">Go to Account Settings → Payment Methods</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Add New Payment Method</h5>
                    <p className="text-xs text-muted-foreground">Click "Add New" and enter payment details securely</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Set as Primary</h5>
                    <p className="text-xs text-muted-foreground">Make new method primary for future renewals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">4</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Remove Old Methods</h5>
                    <p className="text-xs text-muted-foreground">Delete expired or unused payment methods</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Security Note:</strong> OnlyFur uses bank-level encryption to protect your payment information. We never store full card details on our servers.</p>
            </div>
          </CardContent>
        </Card>

        {/* Billing Cycles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-500" />
              Understanding Billing Cycles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Billing Frequency Options:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Monthly Billing</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Charged on the same date each month</li>
                    <li>• Lower commitment, higher flexibility</li>
                    <li>• Can cancel anytime with one month notice</li>
                    <li>• Full price per month</li>
                    <li>• Most popular option</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Annual Billing</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Charged once per year</li>
                    <li>• Usually 10-20% discount vs monthly</li>
                    <li>• Longer commitment required</li>
                    <li>• Charged upfront for full year</li>
                    <li>• Better value for long-term fans</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Billing Date Examples:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Monthly Subscription Started Jan 15th</p>
                  <p className="text-xs text-muted-foreground">Renewal dates: Feb 15th, Mar 15th, Apr 15th, etc. (or end of month if date doesn't exist)</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Annual Subscription Started Jan 15th</p>
                  <p className="text-xs text-muted-foreground">Next renewal: Jan 15th of the following year</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Changing Billing Frequency:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Monthly to Annual</p>
                  <p className="text-xs text-muted-foreground">Switch at next renewal date to get annual discount. No mid-cycle changes.</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Annual to Monthly</p>
                  <p className="text-xs text-muted-foreground">Takes effect after current annual period ends. No partial refunds available.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <XCircle className="w-5 h-5 mr-2 text-red-500" />
              Cancelling Your Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How Cancellation Works:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Immediate vs. End of Period</p>
                  <p className="text-xs text-muted-foreground">Cancellation stops future billing but maintains access until the end of your current paid period.</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">No Refunds Policy</p>
                  <p className="text-xs text-muted-foreground">Cancellations don't include refunds for the current period, but you keep access until it expires.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Resubscription Available</p>
                  <p className="text-xs text-muted-foreground">You can resubscribe anytime, even to the same creator, without penalty.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Step-by-Step Cancellation:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Go to Subscription Management</p>
                    <p className="text-muted-foreground">Account Settings → My Subscriptions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Find the Subscription</p>
                    <p className="text-muted-foreground">Locate the creator's subscription you want to cancel</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Click Cancel Subscription</p>
                    <p className="text-muted-foreground">Select "Cancel" or "Manage" → "Cancel Subscription"</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Confirm Cancellation</p>
                    <p className="text-muted-foreground">Review terms and confirm your cancellation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                  <div>
                    <p className="font-medium">Receive Confirmation</p>
                    <p className="text-muted-foreground">Get email confirmation with access end date</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Alternative to Cancellation:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Pause Subscription</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Temporary break instead of cancelling</li>
                    <li>• Available for up to 3 months</li>
                    <li>• Resume anytime during pause period</li>
                    <li>• Keep your subscription history</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Downgrade Instead</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Switch to lower tier if budget is tight</li>
                    <li>• Keep some access to creator content</li>
                    <li>• Easier to upgrade again later</li>
                    <li>• Maintain relationship with creator</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Important:</strong> Cancelling a subscription means you'll lose access to all subscriber-only content when your current period ends. Downloaded content may also become inaccessible.</p>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Management Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Issues & Solutions:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Can't Cancel Subscription</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Possible causes: Active payment processing, browser issues, account restrictions</p>
                    <p><strong>Solution:</strong> Wait 24 hours, try different browser, contact support</p>
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Payment Failed but Still Subscribed</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Grace period allows access while payment issue is resolved</p>
                    <p><strong>Solution:</strong> Update payment method within 7 days to avoid cancellation</p>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Tier Change Not Reflected</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Downgrades take effect at next billing cycle</p>
                    <p><strong>Solution:</strong> Check subscription status for effective date</p>
                  </div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Want to Resubscribe</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Easy to restart subscription to same or different creator</p>
                    <p><strong>Solution:</strong> Visit creator's profile and subscribe again</p>
                  </div>
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
            <Link to="/help/articles/payment-system" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How payments work on OnlyFur</h4>
              <p className="text-sm text-muted-foreground mt-1">Understanding payment processing</p>
            </Link>
            <Link to="/help/articles/subscription-tiers" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding subscription tiers</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn about tier differences</p>
            </Link>
            <Link to="/help/articles/first-subscription" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Your first subscription - what to expect</h4>
              <p className="text-sm text-muted-foreground mt-1">Guide for new subscribers</p>
            </Link>
            <Link to="/help/articles/account-security" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Account security best practices</h4>
              <p className="text-sm text-muted-foreground mt-1">Protect your account and billing info</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-blue-500 to-green-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help Managing Subscriptions?</h3>
          <p className="mb-4 opacity-90">Our billing support team can help with subscription changes, payment issues, and cancellations.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Billing Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
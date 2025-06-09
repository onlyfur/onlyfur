import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Calendar, CreditCard, PieChart, BarChart } from 'lucide-react';

const CreatorEarnings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Creator Earnings and Payouts</h1>
        <p className="text-muted-foreground">
          Everything you need to know about earning money on OnlyFur and receiving your payments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            How Creator Earnings Work
          </CardTitle>
          <CardDescription>
            OnlyFur creators earn money through multiple revenue streams, all managed through your creator dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Revenue Sources</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Subscriptions</span>
                  <Badge variant="outline">85% to creator</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Direct Tips</span>
                  <Badge variant="outline">90% to creator</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Content Sales</span>
                  <Badge variant="outline">85% to creator</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Custom Commissions</span>
                  <Badge variant="outline">90% to creator</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Platform Fees</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>OnlyFur takes a small percentage to maintain the platform and provide services:</p>
                <ul className="space-y-1">
                  <li>• Payment processing (covered by platform)</li>
                  <li>• Hosting and bandwidth</li>
                  <li>• Customer support</li>
                  <li>• Platform development</li>
                  <li>• Security and moderation</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Earnings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Subscription Revenue */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Subscription Revenue</h4>
              <div className="space-y-2">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                  <div className="text-sm font-medium mb-1">Example Calculation</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Subscriber pays:</span>
                      <span>$9.99</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform fee (15%):</span>
                      <span>-$1.50</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>You earn:</span>
                      <span className="text-green-600">$8.49</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recurring monthly income from all active subscribers
                </p>
              </div>
            </div>

            {/* Tips Revenue */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Tips & Direct Support</h4>
              <div className="space-y-2">
                <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded">
                  <div className="text-sm font-medium mb-1">Example Calculation</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Fan tips:</span>
                      <span>$25.00</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform fee (10%):</span>
                      <span>-$2.50</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>You earn:</span>
                      <span className="text-green-600">$22.50</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Direct appreciation from your biggest supporters
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Payout Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Weekly Payouts</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payout Day:</span>
                  <Badge>Every Tuesday</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Earnings Period:</span>
                  <span className="text-sm text-muted-foreground">Monday to Sunday</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Processing Time:</span>
                  <span className="text-sm text-muted-foreground">1-3 business days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Minimum Payout:</span>
                  <Badge variant="outline">$20.00</Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Payout Timeline Example</h5>
              <div className="space-y-1 text-sm">
                <div>📅 <strong>Monday-Sunday:</strong> Earn from subscriptions and tips</div>
                <div>🔄 <strong>Monday:</strong> Earnings calculated and reviewed</div>
                <div>💰 <strong>Tuesday:</strong> Payout initiated to your account</div>
                <div>🏦 <strong>Wednesday-Friday:</strong> Money arrives in your bank account</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Bank Transfer (ACH)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="text-muted-foreground">1-3 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Fees:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum:</span>
                  <span className="text-muted-foreground">$20</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Direct deposit to your US bank account (recommended)
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">PayPal</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="text-muted-foreground">Same day</span>
                </div>
                <div className="flex justify-between">
                  <span>Fees:</span>
                  <span className="text-orange-600">2.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum:</span>
                  <span className="text-muted-foreground">$5</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Fast payouts to your PayPal account worldwide
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Maximizing Your Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">💡 Pro Tips for Higher Earnings</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Post consistently to keep subscribers engaged</li>
                <li>• Interact with fans through messages and comments</li>
                <li>• Offer multiple subscription tiers to capture different price points</li>
                <li>• Create exclusive content for higher-tier subscribers</li>
                <li>• Promote your OnlyFur page on social media</li>
                <li>• Respond promptly to messages and comments</li>
                <li>• Consider offering custom commissions for premium prices</li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">📈 Growth Strategies</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Collaborate with other creators in your niche</li>
                <li>• Share behind-the-scenes content and personal stories</li>
                <li>• Host live streams or Q&A sessions</li>
                <li>• Create themed content series or challenges</li>
                <li>• Engage with your community authentically</li>
                <li>• Use analytics to understand what content performs best</li>
                <li>• Offer limited-time promotions or discounts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">🧾 Tax Responsibilities</h4>
            <div className="space-y-2 text-sm">
              <p>As a creator, you're responsible for reporting your OnlyFur earnings:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• OnlyFur will provide 1099 forms for US creators earning $600+</li>
                <li>• Keep detailed records of all your earnings and expenses</li>
                <li>• Consider quarterly estimated tax payments</li>
                <li>• Consult with a tax professional for personalized advice</li>
                <li>• Business expenses may be deductible (equipment, props, etc.)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">What if I don't reach the minimum payout?</h4>
              <p className="text-sm text-muted-foreground">
                Earnings below $20 will roll over to the next week until you reach the minimum threshold.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">Can I change my payout method?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can update your payout method in your creator dashboard settings at any time. Changes take effect for the next payout cycle.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">Are there limits on how much I can earn?</h4>
              <p className="text-sm text-muted-foreground">
                There are no limits on creator earnings. Your income depends on your subscriber count, content quality, and engagement levels.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">What happens if a subscriber cancels?</h4>
              <p className="text-sm text-muted-foreground">
                You keep the earnings from their subscription period. They maintain access until their billing cycle ends.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help with Payouts?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Having trouble with earnings or payouts? Our creator support team is here to help you maximize your success.
          </p>
          <Button>Contact Creator Support</Button>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline">earnings</Badge>
            <Badge variant="outline">payouts</Badge>
            <Badge variant="outline">creator-support</Badge>
            <Badge variant="outline">taxes</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorEarnings;

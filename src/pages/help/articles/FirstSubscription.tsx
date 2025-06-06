import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Gift, Bell, MessageCircle, Download, CreditCard, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const FirstSubscription: React.FC = () => {
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
          <Gift className="w-6 h-6 text-pink-500" />
          <Badge variant="secondary">Getting Started</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Your first subscription - what to expect</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about subscribing to creators and making the most of your subscription.
        </p>
      </div>

      {/* Quick Start Guide */}
      <Card className="mb-8 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Welcome to Your First Subscription! 🎉</h3>
          <p className="text-muted-foreground mb-4">
            Congratulations on supporting a creator! Here's what happens next and how to get the most out of your subscription.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Payment Processed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Access Granted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Notifications On</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-medium">Can Message</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* What Happens Immediately */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="w-5 h-5 mr-2" />
              What Happens Immediately After Subscribing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-0.5">1</span>
                <div>
                  <h4 className="font-semibold">Payment Confirmation</h4>
                  <p className="text-sm text-muted-foreground">You'll receive an email confirmation of your subscription payment</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-0.5">2</span>
                <div>
                  <h4 className="font-semibold">Instant Access</h4>
                  <p className="text-sm text-muted-foreground">Immediate access to all current subscriber-only content</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-0.5">3</span>
                <div>
                  <h4 className="font-semibold">Welcome Message</h4>
                  <p className="text-sm text-muted-foreground">Many creators send a personal welcome message to new subscribers</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-0.5">4</span>
                <div>
                  <h4 className="font-semibold">Notification Setup</h4>
                  <p className="text-sm text-muted-foreground">You'll start receiving notifications for new posts from this creator</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* What You Get Access To */}
        <Card>
          <CardHeader>
            <CardTitle>What You Get Access To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Content Library</h4>
                <ul className="text-sm space-y-1">
                  <li>• All current subscriber-only posts</li>
                  <li>• Full resolution images and videos</li>
                  <li>• Behind-the-scenes content</li>
                  <li>• Exclusive photo sets and galleries</li>
                  <li>• Archive of past subscriber content</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-purple-600 mb-2">Interactive Features</h4>
                <ul className="text-sm space-y-1">
                  <li>• Direct messaging with creator</li>
                  <li>• Comment on subscriber posts</li>
                  <li>• Like and react to content</li>
                  <li>• Participate in polls and Q&As</li>
                  <li>• Access to subscriber Discord/communities</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-green-600 mb-2">Special Perks</h4>
                <ul className="text-sm space-y-1">
                  <li>• Early access to new content</li>
                  <li>• Discounts on custom commissions</li>
                  <li>• Priority in message responses</li>
                  <li>• Exclusive livestreams or events</li>
                  <li>• Download permissions (if enabled)</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-orange-600 mb-2">Community Access</h4>
                <ul className="text-sm space-y-1">
                  <li>• Subscriber-only community groups</li>
                  <li>• Special Discord channels</li>
                  <li>• Monthly subscriber meetups</li>
                  <li>• Exclusive creator updates</li>
                  <li>• Fellow subscriber networking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First 24 Hours Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Your First 24 Hours as a Subscriber
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Recommended Actions:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                  <div>
                    <p className="font-medium text-sm">Browse the Content Library</p>
                    <p className="text-xs text-muted-foreground">Check out all the subscriber content you now have access to</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                  <div>
                    <p className="font-medium text-sm">Introduce Yourself</p>
                    <p className="text-xs text-muted-foreground">Send a friendly message to the creator if you feel comfortable</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                  <div>
                    <p className="font-medium text-sm">Set Notification Preferences</p>
                    <p className="text-xs text-muted-foreground">Customize how you want to be notified about new content</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                  <div>
                    <p className="font-medium text-sm">Join Community Spaces</p>
                    <p className="text-xs text-muted-foreground">Access Discord servers or community groups if available</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">5</div>
                  <div>
                    <p className="font-medium text-sm">Engage with Content</p>
                    <p className="text-xs text-muted-foreground">Like, comment, and interact with posts to show support</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messaging Etiquette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Messaging Your Creator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Best Practices for First Messages:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Do:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Introduce yourself briefly</li>
                    <li>• Mention what drew you to their content</li>
                    <li>• Be respectful and friendly</li>
                    <li>• Ask genuine questions about their work</li>
                    <li>• Respect their response time</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-600 mb-2">❌ Don't:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Demand immediate responses</li>
                    <li>• Ask for free custom content</li>
                    <li>• Share personal/inappropriate details</li>
                    <li>• Spam with multiple messages</li>
                    <li>• Be pushy about meeting in person</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-semibold mb-2">Example Welcome Message:</h5>
              <p className="text-sm italic text-muted-foreground">
                "Hi [Creator Name]! I just subscribed and wanted to say how much I love your art style. 
                I'm especially drawn to your character designs. Looking forward to following your creative journey!"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Managing Expectations */}
        <Card>
          <CardHeader>
            <CardTitle>Managing Your Expectations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What to Expect:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Content Frequency</p>
                  <p className="text-xs text-muted-foreground">Most creators post 2-5 times per week, but this varies by creator and tier</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Response Times</p>
                  <p className="text-xs text-muted-foreground">Message responses can take 24-48 hours, especially for popular creators</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Content Quality</p>
                  <p className="text-xs text-muted-foreground">Subscriber content is typically higher quality and more exclusive than public posts</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Community Interaction</p>
                  <p className="text-xs text-muted-foreground">Larger creators may have less personal interaction but more content variety</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Remember:</strong> Every creator has different styles, posting schedules, and interaction levels. Give yourself time to learn their patterns and enjoy the content!</p>
            </div>
          </CardContent>
        </Card>

        {/* Downloads and Saving Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Downloading and Saving Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Download Permissions:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">When Downloads Are Allowed</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Creator has enabled download permissions</li>
                    <li>• You're subscribed to the appropriate tier</li>
                    <li>• Content is marked as downloadable</li>
                    <li>• Your subscription is current/active</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Download Restrictions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Cannot redistribute or resell content</li>
                    <li>• No sharing on other platforms</li>
                    <li>• Personal use only</li>
                    <li>• Access removed if subscription ends</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Important:</strong> Downloaded content is for your personal enjoyment only. Sharing, redistributing, or posting creator content elsewhere is against our terms of service and may result in account termination.</p>
            </div>
          </CardContent>
        </Card>

        {/* Billing and Renewal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Billing and Automatic Renewal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How Billing Works:</h4>
              <ol className="space-y-2 text-sm">
                <li>1. <strong>Initial Payment:</strong> Charged immediately upon subscribing</li>
                <li>2. <strong>Renewal Date:</strong> Same date each month (e.g., 15th of every month)</li>
                <li>3. <strong>Automatic Renewal:</strong> Your card is charged automatically unless cancelled</li>
                <li>4. <strong>Renewal Notifications:</strong> Email reminder sent 3 days before renewal</li>
                <li>5. <strong>Failed Payments:</strong> Access suspended if payment fails, grace period provided</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Managing Your Subscription:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">Cancel Anytime</h5>
                  <p className="text-xs text-muted-foreground">No cancellation fees</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">Change Tiers</h5>
                  <p className="text-xs text-muted-foreground">Upgrade or downgrade easily</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <h5 className="font-medium text-sm">Update Payment</h5>
                  <p className="text-xs text-muted-foreground">Change cards anytime</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pro Tip:</strong> You can cancel your subscription anytime and still access content until your current billing period ends. This means you can cancel early in the month and still enjoy access for the full month you've paid for!</p>
            </div>
          </CardContent>
        </Card>

        {/* Common Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Common First Subscriber Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-sm">Q: Can I see content from before I subscribed?</h5>
                <p className="text-xs text-muted-foreground">A: Yes! You get access to all past subscriber content, not just new posts.</p>
              </div>
              <div>
                <h5 className="font-medium text-sm">Q: How often do creators post new content?</h5>
                <p className="text-xs text-muted-foreground">A: This varies by creator. Check their profile for typical posting schedules, usually 2-5 times per week.</p>
              </div>
              <div>
                <h5 className="font-medium text-sm">Q: Can I request specific content?</h5>
                <p className="text-xs text-muted-foreground">A: Many creators accept custom requests, especially for higher tier subscribers. Ask politely and be prepared to pay additional fees for custom work.</p>
              </div>
              <div>
                <h5 className="font-medium text-sm">Q: What if I'm not satisfied with the content?</h5>
                <p className="text-xs text-muted-foreground">A: You can cancel anytime. We recommend trying a subscription for at least a full month to get a good sense of the creator's content style.</p>
              </div>
              <div>
                <h5 className="font-medium text-sm">Q: Can I interact with other subscribers?</h5>
                <p className="text-xs text-muted-foreground">A: Yes! Many creators have Discord servers or community spaces where subscribers can interact with each other.</p>
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
            <Link to="/help/articles/subscription-tiers" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding subscription tiers</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn about Basic, Premium, and VIP levels</p>
            </Link>
            <Link to="/help/articles/messaging-creators" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How to message creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Best practices for creator communication</p>
            </Link>
            <Link to="/help/articles/subscription-management" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Subscription renewal and cancellation</h4>
              <p className="text-sm text-muted-foreground mt-1">Manage your subscription settings</p>
            </Link>
            <Link to="/help/articles/community-guidelines" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Community guidelines overview</h4>
              <p className="text-sm text-muted-foreground mt-1">Understanding our community standards</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Questions About Your Subscription?</h3>
          <p className="mb-4 opacity-90">Our support team is here to help you make the most of your OnlyFur experience.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstSubscription;
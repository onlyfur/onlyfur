import React from 'react';
import { ArrowLeft, MessageSquare, Clock, Shield, AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const MessageLimits: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold">Message Limits & Restrictions</h1>
            <p className="text-muted-foreground">Understanding messaging limits and how they help maintain a healthy community</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Messaging</Badge>
          <Badge variant="secondary">Limits</Badge>
          <Badge variant="secondary">Anti-Spam</Badge>
        </div>
      </div>

      {/* Why Limits Exist */}
      <Alert className="mb-8 border-orange-200 bg-orange-50">
        <Shield className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Community Protection:</strong> Message limits help prevent spam, harassment, and abuse while ensuring all users can enjoy meaningful conversations on OnlyFur.
        </AlertDescription>
      </Alert>

      {/* What Are Message Limits */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            What Are Message Limits?
          </CardTitle>
          <CardDescription>
            Understanding the different types of messaging restrictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Message limits are protective measures that control how many messages users can send within specific time periods. 
              These limits help maintain a respectful environment for all community members.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600 mb-2">Daily Limits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Maximum messages per 24-hour period</li>
                  <li>• Resets at midnight UTC</li>
                  <li>• Varies by account type and tier</li>
                  <li>• Includes both new and reply messages</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Hourly Limits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Maximum messages per hour</li>
                  <li>• Prevents rapid-fire messaging</li>
                  <li>• Rolling 60-minute window</li>
                  <li>• Lower than daily limits</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-600 mb-2">Per-Creator Limits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Messages to individual creators</li>
                  <li>• Prevents single-creator spam</li>
                  <li>• Separate from overall limits</li>
                  <li>• Protects creator boundaries</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-600 mb-2">New Account Limits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stricter limits for new users</li>
                  <li>• Gradually increase with good behavior</li>
                  <li>• Account verification requirements</li>
                  <li>• Prevents abuse from fake accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limit Tiers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Message Limits by Account Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Different account types have different messaging allowances based on their role and subscription level:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-600 mb-3">Free Users</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Daily:</strong> 20 messages</li>
                  <li>• <strong>Hourly:</strong> 5 messages</li>
                  <li>• <strong>Per Creator:</strong> 3 messages/day</li>
                  <li>• <strong>Features:</strong> Basic messaging only</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold text-blue-600 mb-3">Subscribers</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Daily:</strong> 100 messages</li>
                  <li>• <strong>Hourly:</strong> 15 messages</li>
                  <li>• <strong>Per Creator:</strong> 10 messages/day</li>
                  <li>• <strong>Features:</strong> Media sharing, priority</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-3">Creators</h4>
                <ul className="text-sm space-y-2">
                  <li>• <strong>Daily:</strong> 500 messages</li>
                  <li>• <strong>Hourly:</strong> 50 messages</li>
                  <li>• <strong>Per User:</strong> Unlimited replies</li>
                  <li>• <strong>Features:</strong> Bulk messaging, templates</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How Limits Work */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            How Message Limits Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-3">What Counts Toward Limits</h4>
                <ul className="text-sm space-y-2">
                  <li>• New messages to creators or users</li>
                  <li>• Replies to existing conversations</li>
                  <li>• Media messages (photos, videos)</li>
                  <li>• Bulk messages and announcements</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-3">What Doesn't Count</h4>
                <ul className="text-sm space-y-2">
                  <li>• System notifications</li>
                  <li>• Automated payment confirmations</li>
                  <li>• Platform announcements</li>
                  <li>• Support ticket communications</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-1">Reset Schedule</h4>
                    <p className="text-sm text-yellow-700">
                      Daily limits reset at midnight UTC. Hourly limits use a rolling window, 
                      so you regain message allowance as each hour passes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* When Limits Are Exceeded */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            When You Exceed Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              If you reach your message limits, here's what happens and how to handle it:
            </p>

            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-600 mb-2">Immediate Effects</h4>
                <ul className="text-sm space-y-1">
                  <li>• New messages will be temporarily blocked</li>
                  <li>• You'll receive a notification about the limit</li>
                  <li>• Existing conversations remain accessible</li>
                  <li>• You can still receive messages from others</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">What You Can Do</h4>
                <ul className="text-sm space-y-1">
                  <li>• Wait for the limit period to reset</li>
                  <li>• Focus on quality responses to existing messages</li>
                  <li>• Consider upgrading your account for higher limits</li>
                  <li>• Contact support if you believe there's an error</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Increasing Your Limits */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Increase Your Message Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-600 mb-2">Upgrade Your Account</h4>
                  <p className="text-sm text-purple-700 mb-2">
                    Subscribe to creators or become a creator yourself to unlock higher message limits and additional features.
                  </p>
                  <Button size="sm" asChild>
                    <Link to="/help/articles/subscription-tiers-overview">View Subscription Tiers</Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Build Trust Score</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Maintain positive interactions and follow community guidelines to gradually earn higher limits over time.
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/help/articles/community-guidelines">Community Guidelines</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card>
        <CardHeader>
          <CardTitle>Questions About Message Limits?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have questions about your specific limits or believe there's an error with your account restrictions, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/support/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help/articles/messaging-tips">Messaging Best Practices</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageLimits;

import React from 'react';
import { ArrowLeft, MessageSquare, Users, Clock, Send, AlertTriangle, CheckCircle, Settings, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const BulkMessaging: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Bulk Messaging</h1>
            <p className="text-muted-foreground">Efficiently communicate with multiple subscribers at once</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Creator Tools</Badge>
          <Badge variant="secondary">Communication</Badge>
          <Badge variant="secondary">Automation</Badge>
        </div>
      </div>

      {/* Overview */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <MessageSquare className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Bulk messaging</strong> allows creators to send updates, promotions, and important information to multiple subscribers simultaneously, saving time and improving engagement.
        </AlertDescription>
      </Alert>

      {/* What is Bulk Messaging */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            What is Bulk Messaging?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Bulk messaging is a powerful communication tool that enables creators to send personalized messages to multiple subscribers at once. This feature helps you:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Efficiency Benefits</h4>
              <ul className="space-y-2 text-sm">
                <li>• Save time with mass communication</li>
                <li>• Reach your entire audience instantly</li>
                <li>• Maintain consistent messaging</li>
                <li>• Schedule messages for optimal timing</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Engagement Features</h4>
              <ul className="space-y-2 text-sm">
                <li>• Personalize messages with subscriber names</li>
                <li>• Include media attachments</li>
                <li>• Target specific subscriber groups</li>
                <li>• Track message performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Use Bulk Messaging */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            How to Send Bulk Messages
          </CardTitle>
          <CardDescription>
            Step-by-step guide to creating and sending bulk messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">1</div>
              <div>
                <h4 className="font-semibold mb-2">Access Bulk Messaging</h4>
                <p className="text-muted-foreground mb-2">Navigate to your creator dashboard and find the messaging section.</p>
                <p className="text-sm text-blue-600">Creator Dashboard → Messages → Bulk Message</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">2</div>
              <div>
                <h4 className="font-semibold mb-2">Select Your Audience</h4>
                <p className="text-muted-foreground mb-2">Choose who will receive your message:</p>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">Audience Options:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• All subscribers</li>
                      <li>• Active subscribers only</li>
                      <li>• Specific subscription tiers</li>
                      <li>• Custom subscriber groups</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">Filtering Options:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• By subscription date</li>
                      <li>• By engagement level</li>
                      <li>• By location (if enabled)</li>
                      <li>• By custom tags</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">3</div>
              <div>
                <h4 className="font-semibold mb-2">Compose Your Message</h4>
                <p className="text-muted-foreground mb-2">Create engaging content that resonates with your audience:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Write a compelling subject line</li>
                  <li>• Use personalization tokens ({`{{name}}, {{tier}}`})</li>
                  <li>• Add media attachments (images, videos, GIFs)</li>
                  <li>• Include clear calls-to-action</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">4</div>
              <div>
                <h4 className="font-semibold mb-2">Preview and Schedule</h4>
                <p className="text-muted-foreground mb-2">Review your message and choose when to send:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Preview how your message will appear</li>
                  <li>• Send immediately or schedule for later</li>
                  <li>• Consider time zones for global audiences</li>
                  <li>• Test with a small group first</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">5</div>
              <div>
                <h4 className="font-semibold mb-2">Send and Monitor</h4>
                <p className="text-muted-foreground">Launch your campaign and track its performance through analytics.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Best Practices for Bulk Messaging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Do's</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Personalize messages with subscriber names</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Send relevant, valuable content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use engaging subject lines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Respect subscriber preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Test messages before sending</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Don'ts</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't spam or send too frequently</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Avoid misleading subject lines</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't send generic, impersonal messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Avoid sending at inappropriate times</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't ignore message performance data</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Types */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Types of Bulk Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Welcome Messages</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Greet new subscribers and introduce them to your content. Set expectations and provide exclusive welcome content.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">Content Updates</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Notify subscribers about new posts, upcoming content, or special releases. Include teasers and previews.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold">Promotional Messages</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Announce special offers, discounts, or limited-time content. Create urgency with time-sensitive deals.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold">Engagement Campaigns</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Encourage interaction through polls, Q&As, or feedback requests. Build community and gather insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics and Tracking */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Message Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Track the performance of your bulk messages to improve future campaigns:</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-600">Delivery Rate</h4>
              <p className="text-sm text-muted-foreground">Messages successfully delivered</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-600">Open Rate</h4>
              <p className="text-sm text-muted-foreground">Subscribers who opened your message</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-600">Response Rate</h4>
              <p className="text-sm text-muted-foreground">Subscribers who replied or engaged</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-600">Conversion</h4>
              <p className="text-sm text-muted-foreground">Actions taken after reading</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Messages Not Sending</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Check your account status, message limits, and ensure recipients haven't blocked you.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Low Engagement Rates</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Review your subject lines, sending times, and message content. Consider A/B testing different approaches.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Personalization Not Working</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Verify your personalization tokens are correctly formatted and that subscriber data is complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you're having trouble with bulk messaging or need advanced features, our support team can help you optimize your communication strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/support/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:creators@onlyfur.com">creators@onlyfur.com</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkMessaging;

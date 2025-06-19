import React from 'react';
import { ArrowLeft, MessageSquare, Heart, CheckCircle, AlertTriangle, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const MessagingTips: React.FC = () => {
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
            <h1 className="text-3xl font-bold">Messaging Tips & Best Practices</h1>
            <p className="text-muted-foreground">Build meaningful connections through respectful and effective communication</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Communication</Badge>
          <Badge variant="secondary">Best Practices</Badge>
          <Badge variant="secondary">Community</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <Heart className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Communication is Key:</strong> Great messaging helps build lasting relationships between creators and supporters. Follow these tips to make your interactions positive and meaningful.
        </AlertDescription>
      </Alert>

      {/* General Best Practices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            General Messaging Best Practices
          </CardTitle>
          <CardDescription>
            Essential guidelines for all messaging interactions on OnlyFur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Be Respectful & Professional</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use polite language and proper greetings</li>
                  <li>• Respect personal boundaries and preferences</li>
                  <li>• Be patient when waiting for responses</li>
                  <li>• Maintain professional tone even in casual chats</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600 mb-2">Clear Communication</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Write clearly and avoid excessive slang</li>
                  <li>• Be specific about requests or questions</li>
                  <li>• Use proper grammar and spelling</li>
                  <li>• Break up long messages into paragraphs</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-600 mb-2">Respect Privacy</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Don't share private conversations</li>
                  <li>• Respect creators' personal time</li>
                  <li>• Keep personal information confidential</li>
                  <li>• Honor content sharing restrictions</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-600 mb-2">Quality over Quantity</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Send meaningful messages, not spam</li>
                  <li>• Quality interactions build better relationships</li>
                  <li>• Allow time between messages</li>
                  <li>• Make each message count</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* For Subscribers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tips for Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-3">Do's</h4>
                <ul className="text-sm space-y-2">
                  <li>• Start with genuine compliments or feedback</li>
                  <li>• Ask thoughtful questions about their work</li>
                  <li>• Respect their content creation schedule</li>
                  <li>• Show appreciation for their responses</li>
                  <li>• Be understanding of response times</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-600 mb-3">Don'ts</h4>
                <ul className="text-sm space-y-2">
                  <li>• Don't demand immediate responses</li>
                  <li>• Avoid sending repetitive messages</li>
                  <li>• Don't request free content or discounts</li>
                  <li>• Avoid overly personal or inappropriate questions</li>
                  <li>• Don't share content without permission</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* For Creators */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Tips for Creators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-3">Building Relationships</h4>
                <ul className="text-sm space-y-2">
                  <li>• Respond warmly to genuine messages</li>
                  <li>• Share behind-the-scenes insights</li>
                  <li>• Ask subscribers about their interests</li>
                  <li>• Remember regular supporters' preferences</li>
                  <li>• Express gratitude for their support</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-3">Managing Volume</h4>
                <ul className="text-sm space-y-2">
                  <li>• Set clear response time expectations</li>
                  <li>• Use templates for common questions</li>
                  <li>• Prioritize longer-term supporters</li>
                  <li>• Create FAQ content to reduce repetitive questions</li>
                  <li>• Set boundaries on message frequency</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Etiquette */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Message Timing & Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-600 mb-1">Response Time Expectations</h4>
                  <p className="text-sm text-yellow-700">
                    Creators typically respond within 24-48 hours. During busy periods or content creation time, 
                    responses may take longer. Be patient and avoid sending follow-up messages too quickly.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">Good Timing</h4>
                <ul className="text-sm space-y-1">
                  <li>• After new content is posted</li>
                  <li>• During creator's active hours</li>
                  <li>• When you have genuine questions</li>
                  <li>• To provide constructive feedback</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 mb-2">Consider Avoiding</h4>
                <ul className="text-sm space-y-1">
                  <li>• Very late night/early morning</li>
                  <li>• Right after sending previous message</li>
                  <li>• During announced breaks or busy periods</li>
                  <li>• When emotions are running high</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Signs */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Avoiding Problematic Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Certain types of messages can damage relationships or violate platform policies:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-600 mb-2">Never Send</h4>
                <ul className="text-sm space-y-1">
                  <li>• Harassment or abusive language</li>
                  <li>• Unsolicited explicit content</li>
                  <li>• Personal information requests</li>
                  <li>• Threats or intimidation</li>
                  <li>• Spam or promotional content</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-600 mb-2">Use Caution With</h4>
                <ul className="text-sm space-y-1">
                  <li>• Requests for personal meetings</li>
                  <li>• Financial discussions outside platform</li>
                  <li>• Criticism without constructive purpose</li>
                  <li>• Messages when frustrated or upset</li>
                  <li>• Overly familiar language too early</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card>
        <CardHeader>
          <CardTitle>Need Messaging Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have questions about messaging features or need help with communication issues, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/help/articles/messaging-creators">Messaging Creators Guide</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help/articles/message-limits">Message Limits</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingTips;

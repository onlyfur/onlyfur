import React from 'react';
import { ArrowLeft, MessageSquare, Users, Star, CheckCircle, Heart, Clock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const MessagingCreators: React.FC = () => {
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
            <h1 className="text-3xl font-bold">Messaging Creators</h1>
            <p className="text-muted-foreground">Connect and communicate effectively with your favorite creators</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Communication</Badge>
          <Badge variant="secondary">Creator Interaction</Badge>
          <Badge variant="secondary">Messaging</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <Heart className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Build Connections:</strong> Messaging creators is a great way to show appreciation, ask questions, and build meaningful relationships within the OnlyFur community.
        </AlertDescription>
      </Alert>

      {/* How to Message */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            How to Send Messages
          </CardTitle>
          <CardDescription>
            Step-by-step guide to messaging creators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Find the Creator</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Navigate to the creator's profile page through search, discovery, or your subscriptions list.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Click the Message Button</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Look for the <strong>Message</strong> button on their profile (availability may depend on subscription status).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Compose Your Message</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Write your message in the text box. You can also attach images, videos, or other media files if supported.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg mt-2">
                  <p className="text-sm text-blue-800"><strong>Tip:</strong> Take time to craft a thoughtful message - creators appreciate quality over quantity.</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-green-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Send & Be Patient</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Click <strong>Send</strong> to deliver your message, then be patient while waiting for a response.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help? */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Message Features & Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Learn about OnlyFur's messaging features and any applicable limits to ensure the best communication experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/help/articles/messaging-tips">Messaging Best Practices</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help/articles/message-limits">Message Limits Guide</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingCreators;

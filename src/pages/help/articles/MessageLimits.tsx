import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Crown, Star, Heart, Lock, Unlock } from 'lucide-react';

const MessageLimits: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Message Limits by Subscription Tier</h1>
        <p className="text-muted-foreground">
          Understanding messaging restrictions and how subscription tiers affect your ability to communicate with creators.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            How Messaging Works on OnlyFur
          </CardTitle>
          <CardDescription>
            Messaging limits ensure quality interactions and help creators manage their communication effectively.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Tier-Based Messaging System</h3>
              <p className="text-sm text-muted-foreground">
                OnlyFur uses a subscription-based messaging system that allows creators to set who can message them 
                based on subscription tiers. This helps creators prioritize their most dedicated supporters while 
                maintaining manageable communication levels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Tier Messaging Privileges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            {/* Basic Subscriber */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-500" />
                <Badge className="bg-blue-500 text-white">Basic Subscriber</Badge>
                <span className="text-sm text-muted-foreground">$4.99/month</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Messaging Access:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Can message Basic-tier creators (open messaging policy)</li>
                  <li>• Cannot message Pro or Premium creators</li>
                  <li>• 5 messages per day to each creator</li>
                  <li>• Text messages only</li>
                  <li>• No priority support</li>
                </ul>
              </div>
            </div>

            {/* Pro Subscriber */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                <Badge className="bg-purple-500 text-white">Pro Subscriber</Badge>
                <span className="text-sm text-muted-foreground">$9.99/month</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Messaging Access:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Can message Basic and Pro-tier creators</li>
                  <li>• Cannot message Premium creators</li>
                  <li>• 15 messages per day to each creator</li>
                  <li>• Text messages and image sharing</li>
                  <li>• Priority message delivery</li>
                  <li>• Read receipts enabled</li>
                </ul>
              </div>
            </div>

            {/* VIP Subscriber */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">VIP Subscriber</Badge>
                <span className="text-sm text-muted-foreground">$19.99/month</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Messaging Access:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Can message creators of ALL tiers</li>
                  <li>• Unlimited messages to all creators</li>
                  <li>• Text, images, and file sharing</li>
                  <li>• Highest priority message delivery</li>
                  <li>• Advanced read receipts and typing indicators</li>
                  <li>• Direct video message support</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creator Messaging Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Unlock className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Open Messaging (Basic Creators)</h4>
                <p className="text-sm text-muted-foreground">
                  All subscribers can message these creators, regardless of tier. Great for new creators building their audience.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Tier-Restricted Messaging (Pro/Premium Creators)</h4>
                <p className="text-sm text-muted-foreground">
                  Only subscribers of certain tiers can message these creators. Helps manage communication volume and prioritize dedicated supporters.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Messaging Guidelines & Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">✅ Best Practices</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Be respectful and considerate in all messages</li>
                <li>• Keep messages relevant to the creator's content</li>
                <li>• Use appropriate language and tone</li>
                <li>• Respect creators' response times and boundaries</li>
                <li>• Consider upgrading your tier to support your favorite creators</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">❌ What Not to Do</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Don't spam or send excessive messages</li>
                <li>• Don't share inappropriate or offensive content</li>
                <li>• Don't request personal information or meetings</li>
                <li>• Don't use messages for commercial promotion</li>
                <li>• Don't harass creators if they don't respond immediately</li>
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
              <h4 className="font-medium">Why can't I message a specific creator?</h4>
              <p className="text-sm text-muted-foreground">
                The creator has set messaging restrictions based on subscription tiers. You'll need to upgrade your subscription to the required tier to message them.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">Do my message limits reset daily?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, daily message limits reset at midnight UTC. VIP subscribers have unlimited messaging.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">Can creators see my subscription tier?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, creators can see your subscription tier to understand your level of support and prioritize responses accordingly.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">What happens if I downgrade my subscription?</h4>
              <p className="text-sm text-muted-foreground">
                If you downgrade to a tier that doesn't allow messaging a particular creator, you'll lose the ability to send new messages, but existing conversations remain visible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you're having trouble with messaging or subscription tiers, our support team is here to help.
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">messaging</Badge>
            <Badge variant="outline">subscriptions</Badge>
            <Badge variant="outline">tiers</Badge>
            <Badge variant="outline">communication</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageLimits;

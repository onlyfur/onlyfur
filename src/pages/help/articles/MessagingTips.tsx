import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Heart, DollarSign, Gift, MessageCircle, Star, TrendingUp, Sparkles } from 'lucide-react';

const MessagingTips: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sending Tips Through Messages</h1>
        <p className="text-muted-foreground">
          Learn how to support your favorite creators by sending tips directly through the messaging system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            What Are Message Tips?
          </CardTitle>
          <CardDescription>
            Tips are a way to show extra appreciation for creators beyond your subscription fee.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">How Message Tips Work</h3>
              <p className="text-sm text-muted-foreground">
                Message tips allow you to send monetary appreciation directly to creators while chatting with them. 
                Tips can be sent as part of any message and are a great way to show support for specific content, 
                conversations, or just to brighten a creator's day.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Pro Tip</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Tips are separate from subscription fees and go directly to the creator (minus platform processing fees). 
                They're a powerful way to build stronger relationships with your favorite creators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Send Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Step-by-Step Guide</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">1</div>
                  <div>
                    <p className="font-medium">Open a conversation with a creator</p>
                    <p className="text-sm text-muted-foreground">Navigate to the messaging section and select your creator</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">2</div>
                  <div>
                    <p className="font-medium">Click the tip button ($) in the message box</p>
                    <p className="text-sm text-muted-foreground">Look for the dollar sign icon next to the send button</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">3</div>
                  <div>
                    <p className="font-medium">Choose your tip amount</p>
                    <p className="text-sm text-muted-foreground">Select from preset amounts or enter a custom amount</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">4</div>
                  <div>
                    <p className="font-medium">Add an optional message</p>
                    <p className="text-sm text-muted-foreground">Include a note about what you're appreciating</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">5</div>
                  <div>
                    <p className="font-medium">Confirm and send</p>
                    <p className="text-sm text-muted-foreground">Review the tip amount and send your appreciation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tip Amount Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <h4 className="font-medium">Preset Amounts</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Small Appreciation</span>
                  <Badge variant="outline-solid">$2 - $5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Standard Tip</span>
                  <Badge variant="outline-solid">$5 - $15</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Generous Tip</span>
                  <Badge variant="outline-solid">$15 - $50</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Super Supporter</span>
                  <Badge variant="outline-solid">$50+</Badge>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h4 className="font-medium">Custom Amounts</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You can send any amount between $1 and $500 per tip. For larger amounts, consider reaching out to support.
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Minimum tip: $1.00</p>
                  <p>• Maximum tip: $500.00</p>
                  <p>• Processing fee: 3.5% + $0.30</p>
                  <p>• Creator receives: Tip minus fees</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>When to Send Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">For Great Content</h4>
                <p className="text-sm text-muted-foreground">
                  Show appreciation when a creator shares something you particularly enjoyed
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">During Conversations</h4>
                <p className="text-sm text-muted-foreground">
                  Send a tip during a great conversation to show you value their time and engagement
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">To Support Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Help creators reach their goals or fund special projects they've mentioned
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Special Occasions</h4>
                <p className="text-sm text-muted-foreground">
                  Celebrate birthdays, milestones, or achievements with a thoughtful tip
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tip Etiquette & Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">✅ Good Tipping Practices</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Include a personal message explaining what you're appreciating</li>
                <li>• Be genuine and specific about what you enjoyed</li>
                <li>• Tip amounts that feel comfortable for your budget</li>
                <li>• Be consistent if you want to build a relationship</li>
                <li>• Respect creators' content policies and boundaries</li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">❌ Avoid These Mistakes</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Don't expect special treatment or exclusive content for tips</li>
                <li>• Don't use tips as a way to make inappropriate requests</li>
                <li>• Don't tip more than you can afford</li>
                <li>• Don't send tips without messages repeatedly (may seem impersonal)</li>
                <li>• Don't expect immediate responses or acknowledgments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Tip Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Processing Fees</h4>
            <p className="text-sm text-muted-foreground mb-3">
              All tips are processed through secure payment systems. Here's how the fees work:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Your tip amount:</span>
                <span className="font-medium">$10.00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Processing fee (3.5% + $0.30):</span>
                <span>-$0.65</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform fee (5%):</span>
                <span>-$0.50</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Creator receives:</span>
                <span className="text-green-600">$8.85</span>
              </div>
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
              <h4 className="font-medium">Can I get a refund on tips?</h4>
              <p className="text-sm text-muted-foreground">
                Tips are generally non-refundable as they're considered donations. However, if there was a technical error, contact support within 24 hours.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">Do creators know who sent tips?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, creators can see who sent tips along with any messages you include. Tips are not anonymous.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">Are there limits on how much I can tip?</h4>
              <p className="text-sm text-muted-foreground">
                Individual tips can be between $1-$500. For larger amounts or if you hit daily limits, contact our support team.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium">Do tips count toward subscription benefits?</h4>
              <p className="text-sm text-muted-foreground">
                No, tips are separate from subscriptions. Your subscription tier determines your platform benefits, while tips are direct support to creators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Having trouble with tips or payment processing? Our support team can help resolve any issues.
          </p>
          <Button>Contact Support</Button>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline-solid">tips</Badge>
            <Badge variant="outline-solid">payments</Badge>
            <Badge variant="outline-solid">messaging</Badge>
            <Badge variant="outline-solid">support</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingTips;

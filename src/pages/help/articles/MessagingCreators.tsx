import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Heart, Users, Clock, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const MessagingCreators: React.FC = () => {
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
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Messaging & Communication</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">How to message creators</h1>
        <p className="text-xl text-muted-foreground">
          Learn the best practices for communicating with creators, building relationships, and getting responses.
        </p>
      </div>

      {/* Overview */}
      <Card className="mb-8 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Communication Guidelines</h3>
          <p className="text-muted-foreground mb-4">
            OnlyFur's messaging system allows direct communication between creators and subscribers. Building respectful relationships enhances your experience and supports creators.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Be Respectful</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Be Patient</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Be Supportive</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Be Safe</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
              Getting Started with Messaging
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How to Send Your First Message:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Subscribe First</p>
                    <p className="text-muted-foreground">You need an active subscription to message most creators</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Find the Message Button</p>
                    <p className="text-muted-foreground">Located on creator's profile page or individual posts</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Write a Thoughtful Message</p>
                    <p className="text-muted-foreground">Be genuine, specific, and respectful in your communication</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Send and Be Patient</p>
                    <p className="text-muted-foreground">Creators may take 24-48 hours to respond, especially popular ones</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Message Access by Subscription Tier:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Basic Tier</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Can send messages</li>
                    <li>• Standard response time</li>
                    <li>• Basic message features</li>
                    <li>• Limited daily messages</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Premium Tier</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Priority message responses</li>
                    <li>• Image/file sharing enabled</li>
                    <li>• More daily messages allowed</li>
                    <li>• Read receipts visible</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">VIP Tier</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Direct line to creator</li>
                    <li>• Fastest response times</li>
                    <li>• Unlimited messaging</li>
                    <li>• Video messages (if supported)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Etiquette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Messaging Etiquette & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Do's and Don'ts:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Do:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Be polite and respectful always</li>
                    <li>• Introduce yourself in first messages</li>
                    <li>• Reference specific content you enjoyed</li>
                    <li>• Ask genuine questions about their work</li>
                    <li>• Respect their response time</li>
                    <li>• Thank them for their content</li>
                    <li>• Keep conversations appropriate</li>
                    <li>• Use proper spelling and grammar</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-600 mb-2">❌ Don't:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Send multiple messages in a row</li>
                    <li>• Demand immediate responses</li>
                    <li>• Ask for free content or special treatment</li>
                    <li>• Share personal contact information</li>
                    <li>• Send inappropriate or explicit messages</li>
                    <li>• Harass or pressure creators</li>
                    <li>• Complain about pricing or content</li>
                    <li>• Share their personal information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Great First Message Examples:</h4>
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">General Appreciation</p>
                  <p className="text-xs text-muted-foreground italic">
                    "Hi [Name]! I just wanted to say how much I love your art style. Your character designs are so unique and expressive. Looking forward to seeing more of your work!"
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Specific Content Praise</p>
                  <p className="text-xs text-muted-foreground italic">
                    "That dragon illustration you posted yesterday was incredible! The way you handled the lighting and shadows really made it come alive. How long did that piece take you?"
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Introduction + Question</p>
                  <p className="text-xs text-muted-foreground italic">
                    "Hey! I'm [Name], a fellow artist/furry fan. I've been following your work for a while and finally subscribed. What got you into creating furry art originally?"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Expectations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-500" />
              Response Times & Expectations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Typical Response Times:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Small Creators (Under 1K Subs)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Basic subscribers:</strong> 12-24 hours</li>
                    <li>• <strong>Premium subscribers:</strong> 6-12 hours</li>
                    <li>• <strong>VIP subscribers:</strong> 2-6 hours</li>
                    <li>• More personal interaction possible</li>
                    <li>• Often respond to most messages</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Large Creators (Over 5K Subs)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Basic subscribers:</strong> 2-7 days</li>
                    <li>• <strong>Premium subscribers:</strong> 1-3 days</li>
                    <li>• <strong>VIP subscribers:</strong> 12-24 hours</li>
                    <li>• May use auto-responses</li>
                    <li>• Selective in message responses</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Factors Affecting Response Time:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Creator Schedule</p>
                  <p className="text-xs text-muted-foreground">Many creators work other jobs or have irregular schedules affecting response times</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Message Volume</p>
                  <p className="text-xs text-muted-foreground">Popular creators may receive 50-200+ messages daily, requiring prioritization</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Content Quality</p>
                  <p className="text-xs text-muted-foreground">Thoughtful, specific messages are more likely to receive detailed responses</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Subscription Tier</p>
                  <p className="text-xs text-muted-foreground">Higher tier subscribers typically receive priority and faster responses</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Patience Tip:</strong> Remember that creators are real people with lives outside OnlyFur. A delayed response doesn't mean they don't appreciate your support!</p>
            </div>
          </CardContent>
        </Card>

        {/* Types of Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              Types of Messages & Purposes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Message Categories:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Appreciation Messages</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Complimenting specific artwork</li>
                    <li>• Thanking for consistent content</li>
                    <li>• Celebrating milestones</li>
                    <li>• General encouragement</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Response rate: High (80-90%)</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Questions About Work</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Art process and techniques</li>
                    <li>• Inspiration and influences</li>
                    <li>• Software and tools used</li>
                    <li>• Career advice</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Response rate: Moderate (60-80%)</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Commission Inquiries</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Availability and pricing</li>
                    <li>• Custom work requests</li>
                    <li>• Terms of service questions</li>
                    <li>• Portfolio discussions</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Response rate: High (90-95%)</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Personal Conversation</h5>
                  <ul className="text-sm space-y-1">
                    <li>• General life updates</li>
                    <li>• Shared interests discussion</li>
                    <li>• Convention meetups</li>
                    <li>• Friendship building</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">Response rate: Variable (20-70%)</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Message Types to Avoid:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Demanding Free Content</p>
                  <p className="text-xs text-muted-foreground">"Can you draw my character for free?" or "When are you posting more free content?"</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Inappropriate Requests</p>
                  <p className="text-xs text-muted-foreground">Sexual content requests without prior discussion of boundaries and commission terms</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Criticism Without Context</p>
                  <p className="text-xs text-muted-foreground">Negative feedback without constructive suggestions or appropriate relationship</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Relationships */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Building Long-Term Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Relationship Building Strategies:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">Consistency</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Regular, supportive comments on posts</li>
                    <li>• Consistent subscription maintenance</li>
                    <li>• Remembering previous conversations</li>
                    <li>• Showing genuine interest over time</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Value Addition</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Sharing their work (with permission)</li>
                    <li>• Providing helpful feedback when asked</li>
                    <li>• Referring other potential subscribers</li>
                    <li>• Supporting through difficult times</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Respect Boundaries</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Understanding their comfort levels</li>
                    <li>• Not pushing for personal information</li>
                    <li>• Accepting "no" gracefully</li>
                    <li>• Recognizing professional vs. personal</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Financial Support</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Regular subscription payments</li>
                    <li>• Occasional tips and donations</li>
                    <li>• Commission purchases</li>
                    <li>• Merchandise support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Signs of a Good Creator Relationship:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Mutual Recognition</p>
                  <p className="text-xs text-muted-foreground">Creator remembers your name and previous conversations</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Faster Response Times</p>
                  <p className="text-xs text-muted-foreground">Your messages receive quicker, more detailed responses</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Special Considerations</p>
                  <p className="text-xs text-muted-foreground">Occasional free extras, early access, or personal updates</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Genuine Friendship</p>
                  <p className="text-xs text-muted-foreground">Conversations extend beyond work to shared interests and experiences</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety and Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Safety & Privacy in Messaging
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Protecting Your Privacy:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-red-600 mb-2">Never Share:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Real full name or address</li>
                    <li>• Personal phone number</li>
                    <li>• Work or school information</li>
                    <li>• Financial information</li>
                    <li>• Other social media accounts (unless you want to)</li>
                    <li>• Family member information</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Safe to Share:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• First name or username</li>
                    <li>• General location (city/state)</li>
                    <li>• Shared interests and hobbies</li>
                    <li>• Art preferences and feedback</li>
                    <li>• Convention attendance plans</li>
                    <li>• General life updates</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Reporting and Safety Features:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Report Inappropriate Messages</p>
                  <p className="text-xs text-muted-foreground">Use the report function for harassment, spam, or inappropriate content</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Block Users</p>
                  <p className="text-xs text-muted-foreground">Block users who make you uncomfortable - no explanation needed</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Message Filtering</p>
                  <p className="text-xs text-muted-foreground">Set filters to automatically handle certain types of messages</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Red Flags:</strong> If someone asks you to move conversation off-platform immediately, requests money/gifts, or makes you uncomfortable in any way, trust your instincts and disengage.</p>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Messaging Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Issues & Solutions:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Can't Send Messages</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Check: Active subscription, creator accepts messages, not blocked</p>
                    <p><strong>Solution:</strong> Verify subscription status, check creator settings</p>
                  </div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Messages Not Delivered</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Network issues, server problems, or message filtered</p>
                    <p><strong>Solution:</strong> Check internet connection, try again later</p>
                  </div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">No Response to Messages</p>
                  <div className="text-xs text-muted-foreground">
                    <p>High message volume, creator busy, message filtered</p>
                    <p><strong>Solution:</strong> Be patient, check message quality, try again later</p>
                  </div>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Inappropriate Messages Received</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Harassment, spam, or unwanted content</p>
                    <p><strong>Solution:</strong> Block user, report to OnlyFur support</p>
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
            <Link to="/help/articles/subscription-tiers" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding subscription tiers</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn about messaging privileges by tier</p>
            </Link>
            <Link to="/help/articles/custom-commissions" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Custom content and commissions</h4>
              <p className="text-sm text-muted-foreground mt-1">Communicate about custom work</p>
            </Link>
            <Link to="/help/articles/community-guidelines" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Community guidelines overview</h4>
              <p className="text-sm text-muted-foreground mt-1">Understand communication standards</p>
            </Link>
            <Link to="/help/articles/account-security" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Account security best practices</h4>
              <p className="text-sm text-muted-foreground mt-1">Stay safe while messaging</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Messaging?</h3>
          <p className="mb-4 opacity-90">Our community team can help with messaging issues, safety concerns, or communication guidance.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingCreators;
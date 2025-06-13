import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Calendar, Zap, BarChart3, Bell, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchedulingFeatures: React.FC = () => {
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
          <Clock className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Creator Tools</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Using scheduling features</h1>
        <p className="text-xl text-muted-foreground">
          Master OnlyFur's scheduling tools to maintain consistent posting and maximize audience engagement.
        </p>
      </div>

      {/* Scheduling Overview */}
      <Card className="mb-8 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Scheduling System Benefits</h3>
          <p className="text-muted-foreground mb-4">
            Consistent posting is key to creator success. OnlyFur's scheduling features help you maintain regular content delivery, even when you're busy or offline.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Content Calendar</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Auto-Publishing</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Optimal Timing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Repeat className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Batch Scheduling</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Getting Started with Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Getting Started with Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How to Schedule Your First Post:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Create Your Content</p>
                    <p className="text-muted-foreground">Upload your images/videos and add title, description, and tags as usual</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Select 'Schedule for Later'</p>
                    <p className="text-muted-foreground">Instead of 'Post Now', choose the scheduling option</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Choose Date and Time</p>
                    <p className="text-muted-foreground">Pick when you want the post to go live (up to 6 months in advance)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Confirm and Save</p>
                    <p className="text-muted-foreground">Review all settings and confirm your scheduled post</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pro Tip:</strong> Always schedule in your local timezone. OnlyFur will automatically convert to your subscribers' timezones for notifications.</p>
            </div>
          </CardContent>
        </Card>

        {/* Optimal Posting Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
              Optimal Posting Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Best Times to Post (General Guidelines):</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Weekday Schedule</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Morning:</strong> 8-10 AM (commute time)</li>
                    <li>• <strong>Lunch:</strong> 12-1 PM (lunch break)</li>
                    <li>• <strong>Evening:</strong> 6-8 PM (after work)</li>
                    <li>• <strong>Night:</strong> 9-11 PM (relaxation time)</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Weekend Schedule</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Late Morning:</strong> 10 AM-12 PM</li>
                    <li>• <strong>Afternoon:</strong> 2-4 PM</li>
                    <li>• <strong>Evening:</strong> 7-9 PM</li>
                    <li>• <strong>Sunday Night:</strong> 8-10 PM</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Furry Community Specific Timing:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Convention Seasons</p>
                  <p className="text-xs text-muted-foreground">Increase posting frequency before and during major furry conventions (Anthrocon, MFF, etc.)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Art Community Hours</p>
                  <p className="text-xs text-muted-foreground">Many furry artists are most active 7-11 PM EST when sharing daily art</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Global Audience</p>
                  <p className="text-xs text-muted-foreground">Consider posting at different times to reach international subscribers</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Friday Features</p>
                  <p className="text-xs text-muted-foreground">Friday evenings are great for premium content as people relax for the weekend</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Analytics Tip:</strong> Use OnlyFur's analytics to identify when YOUR specific audience is most active. These general guidelines are a starting point!</p>
            </div>
          </CardContent>
        </Card>

        {/* Content Calendar Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-500" />
              Content Calendar Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Weekly Content Schedule Examples:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Beginner Schedule (3-4 posts/week)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Monday:</strong> Weekly update/behind-scenes</li>
                    <li>• <strong>Wednesday:</strong> Main artwork/content</li>
                    <li>• <strong>Friday:</strong> Community interaction/Q&A</li>
                    <li>• <strong>Sunday:</strong> Preview of upcoming week</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Advanced Schedule (5-7 posts/week)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Monday:</strong> New artwork reveal</li>
                    <li>• <strong>Tuesday:</strong> Work-in-progress updates</li>
                    <li>• <strong>Wednesday:</strong> Premium content drop</li>
                    <li>• <strong>Thursday:</strong> Community polls/interaction</li>
                    <li>• <strong>Friday:</strong> Featured commission/custom work</li>
                    <li>• <strong>Saturday:</strong> Personal updates/lifestyle</li>
                    <li>• <strong>Sunday:</strong> Weekly roundup/preview</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Monthly Planning Themes:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Theme Ideas:</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Character spotlight months</li>
                    <li>• Seasonal art series</li>
                    <li>• Tutorial/educational weeks</li>
                    <li>• Fan art appreciation</li>
                    <li>• Convention preparation content</li>
                    <li>• Collaboration months</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Special Events:</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Account anniversary celebrations</li>
                    <li>• Subscriber milestone rewards</li>
                    <li>• Holiday-themed content</li>
                    <li>• Art challenges and prompts</li>
                    <li>• Charity drives and awareness</li>
                    <li>• Community appreciation events</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Repeat className="w-5 h-5 mr-2 text-orange-500" />
              Batch Scheduling Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Batch Creation Workflow:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Content Creation Sessions</p>
                    <p className="text-muted-foreground">Dedicate 1-2 days per week to creating multiple pieces of content</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Batch Upload Session</p>
                    <p className="text-muted-foreground">Upload all content at once, setting each piece to 'Private' initially</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Scheduling Planning</p>
                    <p className="text-muted-foreground">Plan out your posting schedule for the next 1-2 weeks</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Batch Scheduling</p>
                    <p className="text-muted-foreground">Edit each private post to schedule it for the appropriate time</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Batch Scheduling Benefits:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Time Efficiency</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Fewer daily tasks to manage</li>
                    <li>• Consistent creative mindset</li>
                    <li>• Better focus during creation</li>
                    <li>• More time for subscriber interaction</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Content Quality</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Better planning and curation</li>
                    <li>• Consistent quality standards</li>
                    <li>• Themed content series possible</li>
                    <li>• Time for second-look editing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Batch Tip:</strong> Create a content buffer of 5-10 posts ahead of schedule. This gives you flexibility for busy periods or unexpected events.</p>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Scheduling Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Advanced Scheduling Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Recurring Post Templates:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">Weekly Recurring Posts</h5>
                  <ul className="text-sm space-y-1">
                    <li>• "Monday Motivation" posts</li>
                    <li>• "WIP Wednesday" updates</li>
                    <li>• "Featured Friday" showcases</li>
                    <li>• "Sunday Summary" roundups</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Monthly Templates</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Monthly subscriber appreciation</li>
                    <li>• Goal progress updates</li>
                    <li>• Community polls and surveys</li>
                    <li>• Behind-the-scenes tours</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Timezone Optimization:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Multiple Timezone Strategy</p>
                  <p className="text-xs text-muted-foreground">Schedule the same content to post at optimal times for different regions (12 hours apart for global reach)</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Primary Audience Focus</p>
                  <p className="text-xs text-muted-foreground">Identify your main subscriber timezone through analytics and optimize for that time zone first</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Seasonal Scheduling:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">Convention Seasons</h5>
                  <p className="text-xs text-muted-foreground">Increase frequency 2-3 weeks before major conventions</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Holiday Periods</h5>
                  <p className="text-xs text-muted-foreground">Schedule holiday-themed content 1-2 weeks in advance</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">School Seasons</h5>
                  <p className="text-xs text-muted-foreground">Adjust timing for back-to-school and summer break periods</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Scheduled Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-red-500" />
              Managing Scheduled Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Scheduled Content Dashboard:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">View Scheduled Posts</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Access via Creator Dashboard → Scheduled</li>
                    <li>• See all upcoming posts in chronological order</li>
                    <li>• Preview how posts will appear</li>
                    <li>• Check posting times and dates</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Edit Scheduled Posts</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Modify content, titles, descriptions</li>
                    <li>• Change posting date and time</li>
                    <li>• Adjust privacy levels</li>
                    <li>• Cancel or delete scheduled posts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Scheduling Notifications:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Post Confirmation</p>
                  <p className="text-xs text-muted-foreground">Get notified when your scheduled posts go live</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Schedule Reminders</p>
                  <p className="text-xs text-muted-foreground">Warnings if you have gaps in your posting schedule</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Error Alerts</p>
                  <p className="text-xs text-muted-foreground">Notifications if a scheduled post fails to publish</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Important:</strong> Always double-check your scheduled posts 24 hours before they're set to publish. This gives you time to make any necessary adjustments.</p>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduling Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Content Scheduling Strategy:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Do:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Maintain consistent posting schedule</li>
                    <li>• Create content buffer for emergencies</li>
                    <li>• Test different posting times</li>
                    <li>• Use analytics to optimize timing</li>
                    <li>• Schedule during your optimal creative periods</li>
                    <li>• Plan themed content series in advance</li>
                    <li>• Leave room for spontaneous posts</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-600 mb-2">❌ Don't:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Schedule too far in advance (max 1 month)</li>
                    <li>• Post multiple items at the same time</li>
                    <li>• Ignore subscriber feedback about timing</li>
                    <li>• Schedule during known platform downtimes</li>
                    <li>• Forget to check scheduled content regularly</li>
                    <li>• Over-schedule during busy personal periods</li>
                    <li>• Neglect real-time engagement</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Emergency Schedule Management:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Emergency Content</p>
                  <p className="text-xs text-muted-foreground">Always have 3-5 "emergency" posts ready that you can quickly schedule if you get sick or have personal issues</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Schedule Gaps</p>
                  <p className="text-xs text-muted-foreground">If you notice gaps in your schedule, fill them with community interaction posts, polls, or behind-the-scenes content</p>
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
            <Link to="/help/articles/upload-organize-content" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Uploading and organizing your content</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn the basics of content creation</p>
            </Link>
            <Link to="/help/articles/understanding-analytics" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding creator analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">Track your posting performance</p>
            </Link>
            <Link to="/help/articles/content-privacy-levels" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Setting content privacy levels</h4>
              <p className="text-sm text-muted-foreground mt-1">Control who sees your scheduled content</p>
            </Link>
            <Link to="/help/articles/pricing-strategies" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Pricing strategies for creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Optimize your tier pricing</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Scheduling?</h3>
          <p className="mb-4 opacity-90">Our creator success team can help you develop an optimal posting schedule for your audience.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Get Scheduling Help</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingFeatures;
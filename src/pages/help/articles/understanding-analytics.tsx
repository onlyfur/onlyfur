import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, DollarSign, Calendar } from 'lucide-react';

export default function UnderstandingAnalytics() {
  const metrics = [
    {
      name: 'Views',
      icon: Eye,
      description: 'Total number of times your content has been viewed',
      importance: 'High',
      color: 'text-blue-500'
    },
    {
      name: 'Subscribers',
      icon: Users,
      description: 'Number of active subscribers to your profile',
      importance: 'Critical',
      color: 'text-green-500'
    },
    {
      name: 'Engagement Rate',
      icon: Heart,
      description: 'Percentage of viewers who interact with your content',
      importance: 'High',
      color: 'text-red-500'
    },
    {
      name: 'Revenue',
      icon: DollarSign,
      description: 'Total earnings from subscriptions, tips, and commissions',
      importance: 'Critical',
      color: 'text-purple-500'
    },
    {
      name: 'Comments',
      icon: MessageCircle,
      description: 'Number of comments and interactions on your posts',
      importance: 'Medium',
      color: 'text-orange-500'
    },
    {
      name: 'Growth Rate',
      icon: TrendingUp,
      description: 'Rate of subscriber and revenue growth over time',
      importance: 'High',
      color: 'text-indigo-500'
    }
  ];

  const timeframes = [
    { name: 'Daily', description: 'Track day-to-day performance and identify peak hours' },
    { name: 'Weekly', description: 'Monitor weekly trends and posting schedule effectiveness' },
    { name: 'Monthly', description: 'Analyze monthly growth and seasonal patterns' },
    { name: 'Yearly', description: 'Review long-term growth and overall business performance' }
  ];

  const tips = [
    {
      category: 'Content Optimization',
      items: [
        'Post during your audience\'s most active hours',
        'Create content types that generate the highest engagement',
        'Use analytics to identify your best-performing content themes',
        'Monitor which content formats (images, videos, text) work best'
      ]
    },
    {
      category: 'Audience Growth',
      items: [
        'Track which promotion strategies bring in new subscribers',
        'Monitor subscriber retention rates',
        'Identify content that converts viewers to subscribers',
        'Analyze subscriber demographics and preferences'
      ]
    },
    {
      category: 'Revenue Optimization',
      items: [
        'Track which content generates the most tips',
        'Monitor subscription tier preferences',
        'Analyze commission request patterns',
        'Identify seasonal revenue trends'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Understanding Analytics
          </CardTitle>
          <p className="text-muted-foreground">
            Learn how to interpret and use creator analytics to grow your audience, optimize your content, and maximize your earnings on OnlyFur.
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics Explained</CardTitle>
          <p className="text-muted-foreground">
            Understanding what each metric means and how to use it to improve your performance.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => {
              const IconComponent = metric.icon;
              return (
                <div key={metric.name} className="flex items-start gap-4 p-4 border rounded-lg">
                  <IconComponent className={`w-6 h-6 ${metric.color} mt-1`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{metric.name}</h4>
                      <Badge 
                        variant={
                          metric.importance === 'Critical' ? 'destructive' : 
                          metric.importance === 'High' ? 'default' : 'secondary'
                        }
                      >
                        {metric.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Time Frames & Analysis Periods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {timeframes.map((timeframe) => (
              <div key={timeframe.name} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{timeframe.name} Analytics</h4>
                <p className="text-sm text-muted-foreground">{timeframe.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Access Your Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Dashboard Overview</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. Navigate to your creator dashboard</li>
                <li>2. Click on the "Analytics" tab in the main menu</li>
                <li>3. Select your desired time frame (daily, weekly, monthly, yearly)</li>
                <li>4. Use filters to analyze specific content types or periods</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Individual Content Analytics</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. Go to your content library</li>
                <li>2. Click on any piece of content</li>
                <li>3. Select "View Analytics" from the options menu</li>
                <li>4. Review performance metrics for that specific content</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Export Data</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. In the analytics dashboard, click "Export Data"</li>
                <li>2. Choose your preferred format (CSV, PDF)</li>
                <li>3. Select the date range and metrics to include</li>
                <li>4. Download your analytics report</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics-Driven Growth Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tips.map((section) => (
              <div key={section.category} className="space-y-3">
                <h4 className="font-medium">{section.category}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understanding Trends and Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Identifying Peak Performance Times</h4>
              <p className="text-sm text-muted-foreground">
                Look for patterns in your engagement data to identify when your audience is most active. 
                This helps you optimize your posting schedule for maximum visibility.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Content Performance Patterns</h4>
              <p className="text-sm text-muted-foreground">
                Track which types of content consistently perform well. Notice themes, formats, 
                or styles that resonate with your audience and create more similar content.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Seasonal Trends</h4>
              <p className="text-sm text-muted-foreground">
                Monitor how your metrics change throughout the year. Some creators see increased 
                activity during holidays or specific seasons, which can inform your content calendar.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Subscriber Journey Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Track how viewers become subscribers and what content converts best. This helps 
                you create more effective conversion strategies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setting Goals and Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">SMART Goals Framework</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Specific:</strong> Define clear, specific targets (e.g., "Gain 100 new subscribers")</li>
                <li>• <strong>Measurable:</strong> Use metrics you can track in your analytics</li>
                <li>• <strong>Achievable:</strong> Set realistic goals based on your current performance</li>
                <li>• <strong>Relevant:</strong> Focus on metrics that align with your business objectives</li>
                <li>• <strong>Time-bound:</strong> Set deadlines for achieving your goals</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Example Goals by Creator Level</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm mb-2">New Creator (0-3 months)</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 50+ subscribers</li>
                    <li>• 10% engagement rate</li>
                    <li>• $500 monthly revenue</li>
                  </ul>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Established Creator (3-12 months)</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 500+ subscribers</li>
                    <li>• 15% engagement rate</li>
                    <li>• $2,000 monthly revenue</li>
                  </ul>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Professional Creator (12+ months)</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 2,000+ subscribers</li>
                    <li>• 20% engagement rate</li>
                    <li>• $5,000+ monthly revenue</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Common Analytics Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Data appears delayed or missing</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Analytics data updates every 24 hours</li>
                <li>• Recent activity may take up to 48 hours to appear</li>
                <li>• Check your time zone settings in your profile</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Metrics seem inconsistent</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Ensure you're comparing the same time periods</li>
                <li>• Check if filters are applied that might affect the data</li>
                <li>• Consider external factors (holidays, platform changes)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Need more detailed insights</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Export your data for deeper analysis in external tools</li>
                <li>• Use the advanced filters to segment your data</li>
                <li>• Contact support for access to additional analytics features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

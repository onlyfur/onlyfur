import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, TrendingUp, Users, Eye, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnderstandingAnalytics: React.FC = () => {
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
          <BarChart3 className="w-6 h-6 text-green-500" />
          <Badge variant="secondary">Creator Tools</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Understanding creator analytics</h1>
        <p className="text-xl text-muted-foreground">
          Master your OnlyFur analytics dashboard to track performance, understand your audience, and grow your creator business.
        </p>
      </div>

      {/* Analytics Overview */}
      <Card className="mb-8 bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Why Analytics Matter</h3>
          <p className="text-muted-foreground mb-4">
            Data-driven decisions lead to better content, happier subscribers, and higher revenue. OnlyFur's analytics help you understand what works and what doesn't.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Audience Insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Content Performance</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Revenue Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Growth Trends</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Accessing Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Accessing Your Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How to Access Analytics:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Go to Creator Dashboard</p>
                    <p className="text-muted-foreground">Click your profile picture → Creator Dashboard</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Select Analytics Tab</p>
                    <p className="text-muted-foreground">Find "Analytics" in the left sidebar menu</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Choose Time Period</p>
                    <p className="text-muted-foreground">Select from 7 days, 30 days, 90 days, or custom range</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Analytics Sections Available:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-blue-600 mb-2">Overview Dashboard</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Total subscribers and revenue</li>
                    <li>• Recent performance summaries</li>
                    <li>• Quick growth indicators</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-purple-600 mb-2">Subscriber Analytics</h5>
                  <ul className="text-sm space-y-1">
                    <li>• New vs. returning subscribers</li>
                    <li>• Subscription tier distribution</li>
                    <li>• Churn and retention rates</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-green-600 mb-2">Content Performance</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Post views and engagement rates</li>
                    <li>• Most popular content types</li>
                    <li>• Optimal posting times</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-orange-600 mb-2">Revenue Analytics</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Monthly revenue trends</li>
                    <li>• Income by subscription tier</li>
                    <li>• Custom content earnings</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Explained */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Key Metrics Explained
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Subscriber Metrics:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Total Subscribers</p>
                  <p className="text-xs text-muted-foreground">Current number of active paying subscribers across all tiers</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">New Subscribers</p>
                  <p className="text-xs text-muted-foreground">Number of new subscribers gained in the selected time period</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Churn Rate</p>
                  <p className="text-xs text-muted-foreground">Percentage of subscribers who cancelled in the selected period (lower is better)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Net Subscriber Growth</p>
                  <p className="text-xs text-muted-foreground">New subscribers minus cancelled subscribers (your actual growth)</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Content Performance Metrics:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Engagement Metrics</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Views:</strong> How many times your content was viewed</li>
                    <li>• <strong>Likes:</strong> Number of likes per post</li>
                    <li>• <strong>Comments:</strong> Comment count and engagement rate</li>
                    <li>• <strong>Shares:</strong> How often content is shared</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Performance Indicators</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Engagement Rate:</strong> (Likes + Comments) ÷ Views</li>
                    <li>• <strong>View Duration:</strong> How long people view your content</li>
                    <li>• <strong>Click-through Rate:</strong> Clicks to your profile from posts</li>
                    <li>• <strong>Conversion Rate:</strong> Views to subscription rate</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Benchmark Goals:</strong> Aim for 15%+ engagement rate, under 5% monthly churn, and 2%+ conversion rate from profile views to subscriptions.</p>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-purple-500" />
              Revenue Analytics Deep Dive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Revenue Tracking Metrics:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Monthly Recurring Revenue (MRR)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Predictable monthly income from subscriptions</li>
                    <li>• Broken down by tier (Basic, Premium, VIP)</li>
                    <li>• Trends show growth or decline patterns</li>
                    <li>• Excludes one-time payments</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Average Revenue Per User (ARPU)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Total revenue ÷ number of subscribers</li>
                    <li>• Indicates pricing effectiveness</li>
                    <li>• Track changes over time</li>
                    <li>• Compare to industry benchmarks</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Customer Lifetime Value (CLV)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Total value of a subscriber over time</li>
                    <li>• ARPU × average subscription length</li>
                    <li>• Helps determine marketing spend</li>
                    <li>• Key profitability indicator</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Revenue by Source</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Subscription revenue vs. custom content</li>
                    <li>• Tips and one-time payments</li>
                    <li>• Commission income tracking</li>
                    <li>• Merchandise sales (if applicable)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Revenue Optimization Insights:</h4>
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Tier Performance Analysis</p>
                  <p className="text-xs text-muted-foreground">Track which subscription tiers generate the most revenue and adjust pricing or benefits accordingly</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Seasonal Revenue Patterns</p>
                  <p className="text-xs text-muted-foreground">Identify months with higher/lower revenue to plan content and marketing strategies</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Custom Content ROI</p>
                  <p className="text-xs text-muted-foreground">Track time spent on custom work vs. revenue to optimize your commission pricing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-orange-500" />
              Audience Demographics & Behavior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Demographic Insights:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Geographic Data</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Top countries and regions</li>
                    <li>• Timezone distribution</li>
                    <li>• Language preferences</li>
                    <li>• Cultural considerations</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Behavioral Patterns</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Most active times and days</li>
                    <li>• Content type preferences</li>
                    <li>• Average session duration</li>
                    <li>• Platform usage patterns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Audience Behavior Analysis:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Peak Activity Times</p>
                  <p className="text-xs text-muted-foreground">When your audience is most active - use this to optimize posting schedules</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Content Preferences</p>
                  <p className="text-xs text-muted-foreground">Which types of content get the most engagement from your specific audience</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Subscriber Journey</p>
                  <p className="text-xs text-muted-foreground">How people discover your content and what leads them to subscribe</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Retention Patterns</p>
                  <p className="text-xs text-muted-foreground">How long subscribers typically stay and what causes them to leave</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Benchmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Performance Benchmarks & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Industry Benchmarks for Furry Creators:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium">New Creators (0-6 months):</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Engagement Rate:</span>
                      <span className="font-medium">8-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Churn:</span>
                      <span className="font-medium">10-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ARPU:</span>
                      <span className="font-medium">$12-20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-medium">1-3%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="font-medium">Established Creators (1+ years):</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Engagement Rate:</span>
                      <span className="font-medium">15-25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Churn:</span>
                      <span className="font-medium">3-8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ARPU:</span>
                      <span className="font-medium">$25-45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-medium">3-6%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Setting Performance Goals:</h4>
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">SMART Goals Framework</p>
                  <p className="text-xs text-muted-foreground">Specific, Measurable, Achievable, Relevant, Time-bound goals for sustainable growth</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Example Monthly Goals</p>
                  <p className="text-xs text-muted-foreground">Increase engagement rate by 2%, reduce churn by 1%, gain 50 new subscribers</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Quarterly Revenue Targets</p>
                  <p className="text-xs text-muted-foreground">Set realistic revenue growth targets based on your current performance and market position</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Using Analytics for Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Using Analytics for Strategic Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Data-Driven Content Strategy:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Content Optimization</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Identify your highest-performing content types</li>
                    <li>• Analyze which tags and themes work best</li>
                    <li>• Optimize posting times based on audience activity</li>
                    <li>• A/B test different content formats</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Audience Growth</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Focus on content that drives new subscribers</li>
                    <li>• Identify and replicate viral content patterns</li>
                    <li>• Understand what makes people unsubscribe</li>
                    <li>• Optimize conversion funnel from views to subs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Revenue Optimization Strategies:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Tier Optimization</p>
                  <p className="text-xs text-muted-foreground">Use data to adjust pricing and benefits for maximum revenue per subscriber</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Retention Improvement</p>
                  <p className="text-xs text-muted-foreground">Identify patterns in subscriber churn and create content to improve retention</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Upselling Opportunities</p>
                  <p className="text-xs text-muted-foreground">Find the right time and content to encourage tier upgrades</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Regular Analytics Review Schedule:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">Daily (5 minutes)</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Check yesterday's post performance</li>
                    <li>• Review new subscriber count</li>
                    <li>• Monitor any unusual activity</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Weekly (30 minutes)</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Analyze week's content performance</li>
                    <li>• Review engagement trends</li>
                    <li>• Plan next week's content based on data</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Monthly (1-2 hours)</h5>
                  <ul className="text-xs space-y-1">
                    <li>• Comprehensive performance review</li>
                    <li>• Set goals for following month</li>
                    <li>• Adjust strategy based on trends</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tools and Exports */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analytics Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Data Export Options:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">CSV Exports</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Download subscriber data</li>
                    <li>• Export revenue reports</li>
                    <li>• Content performance data</li>
                    <li>• Custom date range reports</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Integration Options</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Connect with Google Analytics</li>
                    <li>• Social media cross-platform tracking</li>
                    <li>• Third-party business tools</li>
                    <li>• Automated reporting setup</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Custom Analytics Dashboard:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Personalized Widgets</p>
                  <p className="text-xs text-muted-foreground">Customize your dashboard to show the metrics most important to your business goals</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Goal Tracking</p>
                  <p className="text-xs text-muted-foreground">Set and track progress toward specific targets with visual progress indicators</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Automated Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when key metrics hit certain thresholds or show unusual patterns</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Analytics Mistakes */}
        <Card>
          <CardHeader>
            <CardTitle>Common Analytics Mistakes to Avoid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-red-600 mb-2">❌ Mistakes to Avoid:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Focusing only on vanity metrics (likes, follows)</li>
                  <li>• Not checking analytics regularly</li>
                  <li>• Making decisions based on too little data</li>
                  <li>• Ignoring trends and patterns</li>
                  <li>• Not setting measurable goals</li>
                  <li>• Comparing yourself to very different creators</li>
                  <li>• Overreacting to short-term fluctuations</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-600 mb-2">✅ Best Practices:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Focus on revenue and retention metrics</li>
                  <li>• Establish regular review schedules</li>
                  <li>• Wait for statistically significant data</li>
                  <li>• Look for actionable insights</li>
                  <li>• Set SMART goals and track progress</li>
                  <li>• Benchmark against similar creators</li>
                  <li>• Make gradual, data-driven changes</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Remember:</strong> Analytics are a tool to guide decisions, not dictate them. Combine data insights with your creative instincts and audience feedback for the best results.</p>
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
            <Link to="/help/articles/pricing-strategies" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Pricing strategies for creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Use analytics to optimize your pricing</p>
            </Link>
            <Link to="/help/articles/scheduling-features" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Using scheduling features</h4>
              <p className="text-sm text-muted-foreground mt-1">Schedule content at optimal times</p>
            </Link>
            <Link to="/help/articles/content-privacy-levels" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Setting content privacy levels</h4>
              <p className="text-sm text-muted-foreground mt-1">Track performance by privacy level</p>
            </Link>
            <Link to="/help/articles/custom-commissions" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Custom content and commissions</h4>
              <p className="text-sm text-muted-foreground mt-1">Track commission performance</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-green-500 to-blue-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help Understanding Your Analytics?</h3>
          <p className="mb-4 opacity-90">Our data analysts can help you interpret your analytics and develop growth strategies.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Get Analytics Help</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnderstandingAnalytics;
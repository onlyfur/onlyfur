import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, Heart, DollarSign, Calendar, Target, Activity } from 'lucide-react';

export default function AnalyticsGuide() {
  const metrics = [
    {
      name: 'Views',
      icon: Eye,
      description: 'Total number of times your content has been viewed',
      tips: [
        'Track daily and weekly trends to identify peak viewing times',
        'Compare performance across different content types',
        'Look for seasonal patterns in your viewership'
      ]
    },
    {
      name: 'Engagement Rate',
      icon: Heart,
      description: 'Percentage of viewers who liked, commented, or shared your content',
      tips: [
        'Aim for an engagement rate above 3% for good performance',
        'Monitor which content types generate the most engagement',
        'Respond to comments to boost engagement scores'
      ]
    },
    {
      name: 'Subscriber Growth',
      icon: Users,
      description: 'Rate at which you gain new subscribers over time',
      tips: [
        'Track conversion rates from free to paid subscribers',
        'Identify content that drives the most subscriptions',
        'Monitor churn rate to understand retention'
      ]
    },
    {
      name: 'Revenue Analytics',
      icon: DollarSign,
      description: 'Breakdown of your earnings from different sources',
      tips: [
        'Monitor average revenue per user (ARPU)',
        'Track seasonal revenue patterns',
        'Analyze which content types generate the most income'
      ]
    }
  ];

  const kpis = [
    { name: 'Monthly Active Viewers', description: 'Unique users who viewed your content in the last 30 days' },
    { name: 'Average Session Duration', description: 'How long viewers spend consuming your content' },
    { name: 'Content Completion Rate', description: 'Percentage of content viewers consume fully' },
    { name: 'Conversion Rate', description: 'Percentage of viewers who become subscribers' },
    { name: 'Lifetime Value (LTV)', description: 'Average revenue generated per subscriber over time' },
    { name: 'Churn Rate', description: 'Percentage of subscribers who cancel in a given period' }
  ];

  const sections = [
    {
      title: 'Getting Started with Analytics',
      content: [
        'Access your analytics dashboard from your creator profile',
        'Set up custom date ranges to analyze specific periods',
        'Export data for deeper analysis in external tools',
        'Set up automated reports to track progress over time'
      ]
    },
    {
      title: 'Reading Your Dashboard',
      content: [
        'Overview tab shows your most important metrics at a glance',
        'Content tab breaks down performance by individual posts',
        'Audience tab reveals demographics and behavior patterns',
        'Revenue tab tracks earnings across all monetization methods'
      ]
    },
    {
      title: 'Taking Action on Data',
      content: [
        'Post at times when your audience is most active',
        'Create more content similar to your top performers',
        'Adjust pricing based on conversion and churn data',
        'Engage with content that shows high comment-to-view ratios'
      ]
    }
  ];

  const benchmarks = [
    { metric: 'Engagement Rate', good: '2-4%', great: '4-6%', excellent: '6%+' },
    { metric: 'Subscriber Conversion', good: '1-3%', great: '3-5%', excellent: '5%+' },
    { metric: 'Monthly Churn Rate', good: '15-20%', great: '10-15%', excellent: '<10%' },
    { metric: 'Average Session Duration', good: '2-5 min', great: '5-10 min', excellent: '10+ min' }
  ];

  const bestPractices = {
    dos: [
      'Check your analytics at least weekly',
      'Focus on trends rather than daily fluctuations',
      'Set specific, measurable goals',
      'Test different content strategies',
      'Use data to inform content decisions'
    ],
    donts: [
      'Don\'t obsess over vanity metrics',
      'Don\'t make drastic changes based on one bad day',
      'Don\'t ignore audience feedback in favor of numbers',
      'Don\'t compare your early metrics to established creators',
      'Don\'t neglect qualitative feedback'
    ]
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-2 rounded-full mb-6">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Analytics Center</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Analytics Guide
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Learn how to understand and leverage your platform analytics to grow your audience, 
          increase engagement, and maximize your revenue potential.
        </p>
      </div>

      {/* Essential Metrics */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Essential Metrics to Track</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <metric.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{metric.name}</h3>
                    <p className="text-muted-foreground mb-3 text-sm">{metric.description}</p>
                    <ul className="space-y-2">
                      {metric.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Key Performance Indicators (KPIs)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">{kpi.name}</h4>
                <p className="text-sm text-muted-foreground">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How-to Sections */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How to Use Analytics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Analytics Best Practices */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Analytics Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-green-600">
                <TrendingUp className="w-5 h-5 mr-3" />
                Do's
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {bestPractices.dos.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-red-600">
                <Target className="w-5 h-5 mr-3" />
                Don'ts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {bestPractices.donts.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Benchmarks */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Performance Benchmarks</h2>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Metric</th>
                    <th className="text-left py-3 font-semibold">Good</th>
                    <th className="text-left py-3 font-semibold">Great</th>
                    <th className="text-left py-3 font-semibold">Excellent</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarks.map((benchmark, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-medium">{benchmark.metric}</td>
                      <td className="py-3 text-muted-foreground">{benchmark.good}</td>
                      <td className="py-3 text-muted-foreground">{benchmark.great}</td>
                      <td className="py-3 text-muted-foreground">{benchmark.excellent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

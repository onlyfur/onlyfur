import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, Heart, DollarSign, Calendar, Target } from 'lucide-react';

export default function AnalyticsGuide() {
  const metrics = [
    {
      name: 'Views',
      icon: <Eye className="w-5 h-5" />,
      description: 'Total number of times your content has been viewed',
      tips: [
        'Track daily and weekly trends to identify peak viewing times',
        'Compare performance across different content types',
        'Look for seasonal patterns in your viewership'
      ]
    },
    {
      name: 'Engagement Rate',
      icon: <Heart className="w-5 h-5" />,
      description: 'Percentage of viewers who liked, commented, or shared your content',
      tips: [
        'Aim for an engagement rate above 3% for good performance',
        'Monitor which content types generate the most engagement',
        'Respond to comments to boost engagement scores'
      ]
    },
    {
      name: 'Subscriber Growth',
      icon: <Users className="w-5 h-5" />,
      description: 'Rate at which you gain new subscribers over time',
      tips: [
        'Track conversion rates from free to paid subscribers',
        'Identify content that drives the most subscriptions',
        'Monitor churn rate to understand retention'
      ]
    },
    {
      name: 'Revenue Analytics',
      icon: <DollarSign className="w-5 h-5" />,
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Guide</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how to understand and leverage your platform analytics to grow your audience and increase revenue
          </p>
        </div>

        {/* Key Metrics Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Essential Metrics to Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {metric.icon}
                    <h3 className="font-semibold text-lg">{metric.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{metric.description}</p>
                  <div className="space-y-1">
                    {metric.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Key Performance Indicators (KPIs)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kpis.map((kpi, index) => (
                <div key={index} className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">{kpi.name}</h4>
                  <p className="text-sm text-gray-600">{kpi.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How-to Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Best Practices */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analytics Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Do's</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Check your analytics at least weekly</li>
                  <li>• Focus on trends rather than daily fluctuations</li>
                  <li>• Set specific, measurable goals</li>
                  <li>• Test different content strategies</li>
                  <li>• Use data to inform content decisions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Don'ts</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Don't obsess over vanity metrics</li>
                  <li>• Don't make drastic changes based on one bad day</li>
                  <li>• Don't ignore audience feedback in favor of numbers</li>
                  <li>• Don't compare your early metrics to established creators</li>
                  <li>• Don't neglect qualitative feedback</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Benchmarks */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Performance Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Metric</th>
                    <th className="text-left py-2">Good</th>
                    <th className="text-left py-2">Great</th>
                    <th className="text-left py-2">Excellent</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Engagement Rate</td>
                    <td className="py-2">2-4%</td>
                    <td className="py-2">4-6%</td>
                    <td className="py-2">6%+</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Subscriber Conversion</td>
                    <td className="py-2">1-3%</td>
                    <td className="py-2">3-5%</td>
                    <td className="py-2">5%+</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Monthly Churn Rate</td>
                    <td className="py-2">15-20%</td>
                    <td className="py-2">10-15%</td>
                    <td className="py-2">&lt;10%</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Average Session Duration</td>
                    <td className="py-2">2-5 min</td>
                    <td className="py-2">5-10 min</td>
                    <td className="py-2">10+ min</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

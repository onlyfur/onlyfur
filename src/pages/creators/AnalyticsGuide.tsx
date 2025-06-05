import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const AnalyticsGuide: React.FC = () => {
  const metrics = [
    {
      name: 'Subscriber Growth',
      icon: Users,
      description: 'Track how your subscriber count changes over time',
      tips: ['Monitor daily/weekly growth rates', 'Identify content that drives subscriptions', 'Track conversion from free to paid subscribers']
    },
    {
      name: 'Content Performance',
      icon: Eye,
      description: 'See which content resonates with your audience',
      tips: ['Track views, likes, and comments', 'Identify your most popular content types', 'Optimize posting times based on engagement']
    },
    {
      name: 'Revenue Analytics',
      icon: DollarSign,
      description: 'Understand your income streams and trends',
      tips: ['Monitor subscription vs. tip revenue', 'Track average revenue per subscriber', 'Identify seasonal trends in earnings']
    },
    {
      name: 'Engagement Metrics',
      icon: TrendingUp,
      description: 'Measure how actively your audience interacts',
      tips: ['Calculate engagement rate per post', 'Track message response rates', 'Monitor retention and churn rates']
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Analytics Guide</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to use analytics to grow your creator business
        </p>
      </div>

      <div className="grid gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <metric.icon className="w-6 h-6 mr-3 text-primary" />
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{metric.description}</p>
              <h4 className="font-semibold mb-2">Key Tips:</h4>
              <ul className="space-y-2">
                {metric.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsGuide;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Camera, MessageCircle, DollarSign, Users, Heart, Clock, TrendingUp } from 'lucide-react';

const BestPractices: React.FC = () => {
  const practices = [
    {
      category: 'Content Creation',
      icon: Camera,
      color: 'text-purple-500',
      tips: [
        'Post consistently - aim for 3-5 posts per week',
        'Use high-quality images and videos',
        'Write engaging captions that tell a story',
        'Tag your content appropriately for discovery',
        'Share behind-the-scenes content to build connection'
      ]
    },
    {
      category: 'Community Engagement',
      icon: Users,
      color: 'text-blue-500',
      tips: [
        'Respond to comments and messages promptly',
        'Ask questions to encourage interaction',
        'Show appreciation for your supporters',
        'Create polls and interactive content',
        'Remember subscriber preferences and interests'
      ]
    },
    {
      category: 'Monetization',
      icon: DollarSign,
      color: 'text-green-500',
      tips: [
        'Price your content fairly and competitively',
        'Offer multiple subscription tiers',
        'Create exclusive content for paying subscribers',
        'Use limited-time offers to drive subscriptions',
        'Consider custom content and commissions'
      ]
    },
    {
      category: 'Growth Strategies',
      icon: TrendingUp,
      color: 'text-orange-500',
      tips: [
        'Cross-promote on social media platforms',
        'Collaborate with other creators',
        'Participate in community events and conventions',
        'Use analytics to understand your audience',
        'Experiment with different content types'
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Creator Best Practices</h1>
        <p className="text-lg text-muted-foreground">
          Proven strategies to help you succeed as a furry content creator
        </p>
      </div>

      <div className="space-y-8">
        {practices.map((practice, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <practice.icon className={`w-6 h-6 mr-3 ${practice.color}`} />
                {practice.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {practice.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
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

export default BestPractices;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Users, TrendingUp, Heart, Star, Calendar } from 'lucide-react';

export default function BestPractices() {
  const practices = [
    {
      category: 'Content Creation',
      icon: <Star className="w-5 h-5" />,
      tips: [
        'Create a consistent posting schedule to keep your audience engaged',
        'Use high-quality visuals and clear audio in your content',
        'Write compelling titles and descriptions that accurately represent your content',
        'Engage with your audience through comments and direct messages',
        'Collaborate with other creators to expand your reach'
      ]
    },
    {
      category: 'Audience Building',
      icon: <Users className="w-5 h-5" />,
      tips: [
        'Know your target audience and create content that resonates with them',
        'Use relevant hashtags and keywords to improve discoverability',
        'Cross-promote your content on social media platforms',
        'Offer exclusive content to subscribers to increase loyalty',
        'Host live streams to interact with your audience in real-time'
      ]
    },
    {
      category: 'Monetization',
      icon: <TrendingUp className="w-5 h-5" />,
      tips: [
        'Diversify your income streams (subscriptions, tips, merchandise)',
        'Set competitive pricing for your subscription tiers',
        'Offer different content levels for various price points',
        'Promote your premium content without overwhelming free users',
        'Track your analytics to understand what content performs best'
      ]
    },
    {
      category: 'Community Management',
      icon: <Heart className="w-5 h-5" />,
      tips: [
        'Respond to comments and messages in a timely manner',
        'Set clear community guidelines and enforce them consistently',
        'Recognize and reward your most engaged supporters',
        'Create a welcoming environment for new followers',
        'Address conflicts quickly and professionally'
      ]
    }
  ];

  const quickTips = [
    'Post consistently to maintain audience engagement',
    'Use analytics to understand your audience preferences',
    'Invest in good lighting and audio equipment',
    'Network with other creators in your niche',
    'Always maintain professionalism in public interactions'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Creator Best Practices</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Proven strategies and tips to help you succeed as a content creator on our platform
          </p>
        </div>

        {/* Quick Tips Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Quick Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Practices */}
        <div className="space-y-6">
          {practices.map((practice, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {practice.icon}
                  {practice.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {practice.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Getting Started Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Week 1: Foundation</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Set up your profile completely</li>
                    <li>• Define your content niche</li>
                    <li>• Create your first 3-5 posts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Week 2: Engagement</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Interact with other creators</li>
                    <li>• Respond to all comments</li>
                    <li>• Join relevant communities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Week 3: Growth</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Analyze your performance</li>
                    <li>• Adjust content strategy</li>
                    <li>• Plan collaborations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Week 4: Monetization</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Set up subscription tiers</li>
                    <li>• Create exclusive content</li>
                    <li>• Promote your offerings</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Metrics to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">Engagement</div>
                <p className="text-sm text-gray-600">Likes, comments, shares per post</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">Growth</div>
                <p className="text-sm text-gray-600">New followers and subscribers</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">Revenue</div>
                <p className="text-sm text-gray-600">Monthly recurring revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

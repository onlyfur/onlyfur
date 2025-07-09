import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Users, TrendingUp, Heart, Star, Calendar, Target, Lightbulb } from 'lucide-react';

export default function BestPractices() {
  const practices = [
    {
      category: 'Content Creation',
      icon: Star,
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
      icon: Users,
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
      icon: TrendingUp,
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
      icon: Heart,
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

  const gettingStarted = [
    {
      week: 'Week 1: Foundation',
      tasks: [
        'Set up your profile completely',
        'Define your content niche',
        'Create your first 3-5 posts'
      ]
    },
    {
      week: 'Week 2: Engagement',
      tasks: [
        'Interact with other creators',
        'Respond to all comments',
        'Join relevant communities'
      ]
    },
    {
      week: 'Week 3: Growth',
      tasks: [
        'Analyze your performance',
        'Adjust content strategy',
        'Plan collaborations'
      ]
    },
    {
      week: 'Week 4: Monetization',
      tasks: [
        'Set up subscription tiers',
        'Create exclusive content',
        'Promote your offerings'
      ]
    }
  ];

  const metrics = [
    { name: 'Engagement', description: 'Likes, comments, shares per post', color: 'blue' },
    { name: 'Growth', description: 'New followers and subscribers', color: 'green' },
    { name: 'Revenue', description: 'Monthly recurring revenue', color: 'purple' }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-6">
          <Lightbulb className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Creator Resources</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Creator Best Practices
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Proven strategies and tips to help you succeed as a content creator on our platform. 
          Learn from experienced creators and implement best practices for sustainable growth.
        </p>
      </div>

      {/* Quick Tips Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Quick Tips for Success</h2>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Practices */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Best Practices by Category</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {practices.map((practice, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <practice.icon className="w-5 h-5 mr-3 text-primary" />
                  {practice.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {practice.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started Checklist */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Getting Started Checklist</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {gettingStarted.map((phase, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-3 text-center">{phase.week}</h3>
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Key Metrics to Track</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full bg-${metric.color}-100 dark:bg-${metric.color}-900/20 flex items-center justify-center mx-auto mb-4`}>
                  <Target className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{metric.name}</h3>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

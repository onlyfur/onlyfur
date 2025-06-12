import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Target,
  Zap,
  BarChart3,
  Settings,
  Lightbulb,
  Shield,
  Activity,
  Clock,
  Star,
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  Calendar,
  DollarSign,
  Award,
  Camera,
  Mic,
  Video,
  Image,
  FileText
} from 'lucide-react';
import AnimatedLoader from '../components/ui/AnimatedLoader';

interface AIInsight {
  category: 'performance' | 'optimization' | 'community' | 'trends' | 'monetization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
  value?: number;
  change?: number;
}

interface ContentSuggestion {
  type: 'image' | 'video' | 'audio' | 'text' | 'live';
  title: string;
  description: string;
  trending_score: number;
  engagement_potential: number;
  tags: string[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

export default function AIDashboardV3() {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading data
    const loadDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI insights
      const mockInsights: AIInsight[] = [
        {
          category: 'performance',
          title: 'Content Engagement Surge',
          description: 'Your character art posts are performing 45% better than average this week.',
          impact: 'high',
          actionable: true,
          action: 'Create more character art content',
          value: 45,
          change: 12
        },
        {
          category: 'optimization',
          title: 'Peak Posting Time Identified',
          description: 'AI analysis shows 8:30 PM EST generates maximum engagement for your audience.',
          impact: 'medium',
          actionable: true,
          action: 'Schedule more posts at optimal times',
          value: 830,
          change: 0
        },
        {
          category: 'community',
          title: 'Growing Audience Segment',
          description: 'Digital artists aged 20-30 are increasingly engaging with your content.',
          impact: 'medium',
          actionable: true,
          action: 'Target content to this demographic',
          value: 73,
          change: 8
        },
        {
          category: 'trends',
          title: 'Trending Topic Opportunity',
          description: '#CharacterDesignChallenge is trending with 89% growth this week.',
          impact: 'high',
          actionable: true,
          action: 'Participate in the trending challenge',
          value: 89,
          change: 23
        },
        {
          category: 'monetization',
          title: 'Commission Price Optimization',
          description: 'Analysis suggests you could increase commission prices by 15-20%.',
          impact: 'high',
          actionable: true,
          action: 'Review and adjust pricing strategy',
          value: 18,
          change: 0
        }
      ];

      // Mock content suggestions
      const mockSuggestions: ContentSuggestion[] = [
        {
          type: 'video',
          title: 'Character Design Speedpaint',
          description: 'Create a timelapse of your character design process',
          trending_score: 94,
          engagement_potential: 87,
          tags: ['#speedpaint', '#characterdesign', '#digitalart', '#process']
        },
        {
          type: 'image',
          title: 'Fantasy Creature Commission',
          description: 'Showcase a detailed fantasy creature artwork',
          trending_score: 89,
          engagement_potential: 92,
          tags: ['#fantasy', '#creature', '#commission', '#detailed']
        },
        {
          type: 'live',
          title: 'Live Art Stream Q&A',
          description: 'Interactive stream answering follower questions while drawing',
          trending_score: 91,
          engagement_potential: 95,
          tags: ['#livestream', '#interactive', '#qa', '#community']
        },
        {
          type: 'text',
          title: 'Character Backstory Series',
          description: 'Share detailed backstories of your original characters',
          trending_score: 76,
          engagement_potential: 83,
          tags: ['#character', '#story', '#lore', '#worldbuilding']
        }
      ];

      // Mock quick actions
      const mockActions: QuickAction[] = [
        {
          id: '1',
          title: 'Optimize Latest Post',
          description: 'Use AI to improve your most recent content',
          icon: Sparkles,
          route: '/ai-optimizer',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Schedule Optimal Posts',
          description: 'Set up posts for peak engagement times',
          icon: Calendar,
          route: '/content-scheduler',
          priority: 'high'
        },
        {
          id: '3',
          title: 'Check Community Health',
          description: 'Review community engagement metrics',
          icon: Users,
          route: '/community-manager',
          priority: 'medium'
        },
        {
          id: '4',
          title: 'Analyze Performance',
          description: 'Deep dive into your content analytics',
          icon: BarChart3,
          route: '/analytics',
          priority: 'medium'
        },
        {
          id: '5',
          title: 'Start Live Stream',
          description: 'Go live with AI-powered streaming tools',
          icon: Camera,
          route: '/live-studio',
          priority: 'low'
        },
        {
          id: '6',
          title: 'AI Content Assistant',
          description: 'Get help with content creation ideas',
          icon: Brain,
          route: '/ai-assistant',
          priority: 'medium'
        }
      ];

      setInsights(mockInsights);
      setContentSuggestions(mockSuggestions);
      setQuickActions(mockActions);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Mic;
      case 'text': return FileText;
      case 'live': return Camera;
      default: return FileText;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <AnimatedLoader type="ai" size="lg" message="AI is preparing your personalized dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI-Powered Creator Dashboard
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personalized AI assistant for content optimization, community management, and creative growth
          </p>
        </motion.div>

        {/* AI Health Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-800">AI Systems Online</span>
                  <Badge className="bg-green-100 text-green-800">All services operational</Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-green-700">
                  <span>Content Optimizer: Active</span>
                  <span>Community Manager: Active</span>
                  <span>Analytics Engine: Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>AI Insights</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Content Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Quick Actions</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <Badge className="bg-green-100 text-green-800">+15%</Badge>
                    </div>
                    <div className="text-2xl font-bold">94</div>
                    <div className="text-sm text-gray-600">AI Optimization Score</div>
                    <Progress value={94} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <Badge className="bg-blue-100 text-blue-800">+23%</Badge>
                    </div>
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-gray-600">Active Followers</div>
                    <Progress value={78} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Heart className="w-5 h-5 text-red-600" />
                      <Badge className="bg-red-100 text-red-800">+8%</Badge>
                    </div>
                    <div className="text-2xl font-bold">89%</div>
                    <div className="text-sm text-gray-600">Engagement Rate</div>
                    <Progress value={89} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                      <Badge className="bg-yellow-100 text-yellow-800">+31%</Badge>
                    </div>
                    <div className="text-2xl font-bold">$2,340</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                    <Progress value={67} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Recent AI Actions</span>
                  </CardTitle>
                  <CardDescription>AI-powered optimizations and suggestions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: 'Optimized post title', time: '2 mins ago', impact: 'high' },
                    { action: 'Suggested trending tags', time: '15 mins ago', impact: 'medium' },
                    { action: 'Analyzed audience behavior', time: '1 hour ago', impact: 'high' },
                    { action: 'Generated content ideas', time: '2 hours ago', impact: 'medium' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${item.impact === 'high' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                          <Brain className={`w-4 h-4 ${item.impact === 'high' ? 'text-red-600' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{item.action}</div>
                          <div className="text-xs text-gray-500">{item.time}</div>
                        </div>
                      </div>
                      <Badge className={getImpactColor(item.impact)}>
                        {item.impact}
                      </Badge>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>AI Achievements</span>
                  </CardTitle>
                  <CardDescription>Your AI-powered milestones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Content Optimization Master', description: '100+ posts optimized', completed: true },
                    { title: 'Community Engagement Pro', description: '90%+ engagement rate', completed: true },
                    { title: 'Trend Forecaster', description: 'Spotted 5 trending topics', completed: true },
                    { title: 'Revenue Optimizer', description: '25%+ revenue increase', completed: false }
                  ].map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
                    >
                      <div className={`p-1 rounded-full ${achievement.completed ? 'bg-green-500' : 'bg-gray-400'}`}>
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-500">{achievement.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-l-4 ${getPriorityColor(insight.impact)}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getImpactColor(insight.impact)}`}>
                            <Brain className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{insight.title}</h3>
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact} impact
                            </Badge>
                          </div>
                        </div>
                        {insight.value && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {insight.change && insight.change > 0 ? '+' : ''}{insight.value}
                              {insight.category === 'performance' || insight.category === 'trends' ? '%' : ''}
                            </div>
                            {insight.change && (
                              <div className="text-sm text-gray-500">
                                {insight.change > 0 ? '+' : ''}{insight.change}% vs last week
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-4">{insight.description}</p>
                      
                      {insight.actionable && insight.action && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-purple-700">
                            Recommended Action: {insight.action}
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Take Action
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Content Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentSuggestions.map((suggestion, index) => {
                const IconComponent = getContentTypeIcon(suggestion.type);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <IconComponent className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{suggestion.title}</h3>
                              <Badge variant="outline">{suggestion.type.toUpperCase()}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {suggestion.trending_score}% trending
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{suggestion.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Engagement Potential</span>
                              <span>{suggestion.engagement_potential}%</span>
                            </div>
                            <Progress value={suggestion.engagement_potential} className="h-2" />
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {suggestion.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button className="w-full">
                            Create This Content
                            <ArrowUpRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Quick Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 ${getPriorityColor(action.priority)} hover:shadow-lg transition-shadow cursor-pointer`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            action.priority === 'high' ? 'bg-red-100' :
                            action.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              action.priority === 'high' ? 'text-red-600' :
                              action.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{action.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge className={getImpactColor(action.priority)}>
                                {action.priority} priority
                              </Badge>
                              <Link to={action.route}>
                                <Button size="sm">
                                  Start
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Supercharge Your Creative Journey</h2>
              <p className="text-lg mb-6 text-purple-100">
                Let AI handle the optimization while you focus on creating amazing content
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button size="lg" variant="secondary">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explore AI Features
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Settings className="w-5 h-5 mr-2" />
                  Customize Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  Eye, 
  Heart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Upload,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Brain,
  Sparkles,
  Award,
  Clock,
  Star,
  MessageCircle,
  Gift,
  Crown,
  Settings,
  Plus,
  Filter,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  Camera,
  Mic,
  Video,
  Image as ImageIcon,
  FileText,
  MoreVertical,
  Bell,
  Search,
  ArrowUp,
  ArrowDown,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfWeek, endOfWeek, subDays, subWeeks, subMonths } from 'date-fns';
import AIAnalyticsDashboard from '@/components/ai/AIAnalyticsDashboard';
import AIContentModerator from '@/components/ai/AIContentModerator';
import { FullScreenLoader } from '@/components/ui/AnimatedLoader';

interface DashboardStats {
  revenue: {
    total: number;
    thisMonth: number;
    growth: number;
    pending: number;
  };
  subscribers: {
    total: number;
    new: number;
    growth: number;
    byTier: {
      basic: number;
      pro: number;
      vip: number;
    };
  };
  content: {
    total: number;
    published: number;
    drafts: number;
    scheduled: number;
    views: number;
    likes: number;
    comments: number;
  };
  engagement: {
    rate: number;
    growth: number;
    topContent: Array<{
      id: string;
      title: string;
      views: number;
      engagement: number;
    }>;
  };
  aiInsights: {
    contentScore: number;
    optimizationSuggestions: string[];
    trendingTopics: string[];
    bestPostingTimes: string[];
    audienceGrowthPrediction: number;
  };
}

interface StreamingSession {
  id: string;
  title: string;
  status: 'live' | 'scheduled' | 'ended';
  viewers: number;
  duration: number;
  revenue: number;
  startTime: Date;
  thumbnail: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'text';
  status: 'published' | 'draft' | 'scheduled' | 'processing';
  views: number;
  likes: number;
  comments: number;
  revenue: number;
  createdAt: Date;
  scheduledAt?: Date;
  thumbnail: string;
  tier: 'free' | 'basic' | 'pro' | 'vip';
  aiScore?: number;
}

const CreatorDashboardV3: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [streamingSessions, setStreamingSessions] = useState<StreamingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await Promise.all([
        loadStats(),
        loadRecentContent(),
        loadStreamingSessions(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/creator/stats?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        setStats(generateMockStats());
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(generateMockStats());
    }
  };

  const loadRecentContent = async () => {
    try {
      const response = await fetch('/api/content-v3/creator/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setRecentContent(data.content);
      } else {
        setRecentContent(generateMockContent());
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setRecentContent(generateMockContent());
    }
  };

  const loadStreamingSessions = async () => {
    try {
      const response = await fetch('/api/streaming/sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setStreamingSessions(data.sessions);
      } else {
        setStreamingSessions(generateMockSessions());
      }
    } catch (error) {
      console.error('Error loading streaming sessions:', error);
      setStreamingSessions(generateMockSessions());
    }
  };

  const generateMockStats = (): DashboardStats => ({
    revenue: {
      total: 15420.50,
      thisMonth: 3420.50,
      growth: 18.5,
      pending: 892.30,
    },
    subscribers: {
      total: 8934,
      new: 234,
      growth: 12.3,
      byTier: {
        basic: 6234,
        pro: 2100,
        vip: 600,
      },
    },
    content: {
      total: 189,
      published: 167,
      drafts: 12,
      scheduled: 10,
      views: 1234567,
      likes: 89341,
      comments: 12456,
    },
    engagement: {
      rate: 78.5,
      growth: 5.2,
      topContent: [
        { id: '1', title: 'Digital Art Tutorial Series', views: 45234, engagement: 89 },
        { id: '2', title: 'Character Design Workshop', views: 32456, engagement: 85 },
        { id: '3', title: 'Speed Paint Session', views: 28934, engagement: 82 },
      ],
    },
    aiInsights: {
      contentScore: 94,
      optimizationSuggestions: [
        'Post content between 7-9 PM for optimal engagement',
        'Include more tutorial content - 67% higher engagement',
        'Use trending hashtags: #DigitalArt #Tutorial #CharacterDesign',
      ],
      trendingTopics: ['Digital Art', 'Character Design', 'Speed Painting', 'Tutorials'],
      bestPostingTimes: ['19:00', '20:00', '21:00'],
      audienceGrowthPrediction: 23.5,
    },
  });

  const generateMockContent = (): ContentItem[] => [
    {
      id: '1',
      title: 'Digital Art Fundamentals - Part 3',
      type: 'video',
      status: 'published',
      views: 5234,
      likes: 892,
      comments: 156,
      revenue: 234.50,
      createdAt: new Date('2024-01-15'),
      thumbnail: '/api/placeholder/300/200',
      tier: 'basic',
      aiScore: 96,
    },
    {
      id: '2',
      title: 'Character Design Sketches',
      type: 'image',
      status: 'published',
      views: 3456,
      likes: 672,
      comments: 89,
      revenue: 156.75,
      createdAt: new Date('2024-01-14'),
      thumbnail: '/api/placeholder/300/200',
      tier: 'pro',
      aiScore: 94,
    },
    {
      id: '3',
      title: 'Upcoming Tutorial Series',
      type: 'text',
      status: 'scheduled',
      views: 0,
      likes: 0,
      comments: 0,
      revenue: 0,
      createdAt: new Date('2024-01-16'),
      scheduledAt: new Date('2024-01-20'),
      thumbnail: '/api/placeholder/300/200',
      tier: 'free',
    },
  ];

  const generateMockSessions = (): StreamingSession[] => [
    {
      id: '1',
      title: 'Live Digital Art Tutorial',
      status: 'live',
      viewers: 234,
      duration: 3600,
      revenue: 156.50,
      startTime: new Date(),
      thumbnail: '/api/placeholder/300/200',
    },
    {
      id: '2',
      title: 'Character Design Workshop',
      status: 'ended',
      viewers: 456,
      duration: 7200,
      revenue: 289.75,
      startTime: subDays(new Date(), 1),
      thumbnail: '/api/placeholder/300/200',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'scheduled': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    growth?: number;
    icon: React.ReactNode;
    color: string;
    index: number;
    subtitle?: string;
  }> = ({ title, value, growth, icon, color, index, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
              {icon}
            </div>
            {growth !== undefined && (
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {growth >= 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span>{Math.abs(growth)}%</span>
              </div>
            )}
          </div>
          
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          >
            <p className="text-2xl font-bold mb-1">
              {typeof value === 'number' && title.toLowerCase().includes('revenue') 
                ? formatCurrency(value) 
                : typeof value === 'number' 
                ? formatNumber(value) 
                : value}
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ContentCard: React.FC<{ content: ContentItem; index: number }> = ({ content, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={content.thumbnail}
                alt={content.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              {content.aiScore && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1"
                >
                  <Brain className="w-3 h-3" />
                  <span>{content.aiScore}</span>
                </motion.div>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm group-hover:text-purple-600 transition-colors">
                  {content.title}
                </h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(content.status)}
                  <Badge 
                    variant={content.tier === 'free' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {content.tier.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatNumber(content.views)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{formatNumber(content.likes)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{formatNumber(content.comments)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{formatCurrency(content.revenue)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {content.status === 'scheduled' ? 'Scheduled for' : 'Created'} {format(content.scheduledAt || content.createdAt, 'MMM d, yyyy')}
                </span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return <FullScreenLoader message="Loading creator dashboard..." subMessage="Preparing your analytics and insights" />;
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.displayName}! Here's how you're performing.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 rounded-lg p-1 border">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              className={`${isLiveStreaming ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
            >
              {isLiveStreaming ? (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                  Live
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Go Live
                </>
              )}
            </Button>
            
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </div>
        </motion.div>

        {/* AI Insights Quick Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>AI Performance Insights</span>
                </CardTitle>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Score: {stats.aiInsights.contentScore}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span>Optimization Tips</span>
                  </h4>
                  <ul className="space-y-2">
                    {stats.aiInsights.optimizationSuggestions.slice(0, 2).map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="text-sm text-muted-foreground flex items-start space-x-2"
                      >
                        <Zap className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span>Trending Topics</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {stats.aiInsights.trendingTopics.slice(0, 4).map((topic, index) => (
                      <motion.div
                        key={topic}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        <Badge variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Best Posting Times</span>
                  </h4>
                  <div className="flex space-x-2">
                    {stats.aiInsights.bestPostingTimes.map((time, index) => (
                      <motion.div
                        key={time}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        {time}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={stats.revenue.total}
            growth={stats.revenue.growth}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            color="bg-green-500"
            index={0}
            subtitle={`${formatCurrency(stats.revenue.thisMonth)} this month`}
          />
          <StatCard
            title="Subscribers"
            value={stats.subscribers.total}
            growth={stats.subscribers.growth}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-blue-500"
            index={1}
            subtitle={`${stats.subscribers.new} new this month`}
          />
          <StatCard
            title="Total Views"
            value={stats.content.views}
            icon={<Eye className="w-6 h-6 text-white" />}
            color="bg-purple-500"
            index={2}
            subtitle={`${formatNumber(stats.content.likes)} likes`}
          />
          <StatCard
            title="Engagement Rate"
            value={`${stats.engagement.rate}%`}
            growth={stats.engagement.growth}
            icon={<Heart className="w-6 h-6 text-white" />}
            color="bg-red-500"
            index={3}
            subtitle="Above average"
          />
        </div>

        {/* Subscriber Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span>Subscriber Breakdown</span>
              </CardTitle>
              <CardDescription>
                Your subscribers by tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(stats.subscribers.byTier).map(([tier, count], index) => (
                  <motion.div
                    key={tier}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    className="text-center space-y-3"
                  >
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      tier === 'basic' ? 'bg-blue-100 text-blue-600' :
                      tier === 'pro' ? 'bg-purple-100 text-purple-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      <Crown className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(count)}</p>
                      <p className="text-sm font-medium capitalize">{tier} Tier</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((count / stats.subscribers.total) * 100)}% of total
                      </p>
                    </div>
                    <Progress 
                      value={(count / stats.subscribers.total) * 100} 
                      className="h-2"
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
              <TabsTrigger value="streaming">Streaming</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Recent Content */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Content</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New
                    </Button>
                  </div>
                  <CardDescription>
                    Your latest content and their performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentContent.map((content, index) => (
                      <ContentCard key={content.id} content={content} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Top Performing Content</span>
                  </CardTitle>
                  <CardDescription>
                    Your best content this {timeRange}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.engagement.topContent.map((content, index) => (
                      <motion.div
                        key={content.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatNumber(content.views)} views • {content.engagement}% engagement
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Content Management</h3>
                  <p className="text-muted-foreground">Manage your content library</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {recentContent.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="relative">
                          <img
                            src={content.thumbnail}
                            alt={content.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {content.aiScore && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                              <Brain className="w-3 h-3" />
                              <span>{content.aiScore}</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex items-center space-x-2">
                            {getStatusIcon(content.status)}
                            <Badge className="text-xs">
                              {content.tier.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{content.title}</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{formatNumber(content.views)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{formatNumber(content.likes)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{formatNumber(content.comments)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatCurrency(content.revenue)}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {format(content.createdAt, 'MMM d, yyyy')}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AIAnalyticsDashboard 
                userId={user?.id}
                timeRange={timeRange}
              />
            </TabsContent>

            <TabsContent value="streaming" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Live Streaming</h3>
                  <p className="text-muted-foreground">Manage your streaming sessions</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Stream Settings
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Video className="w-4 h-4 mr-2" />
                    Start Stream
                  </Button>
                </div>
              </div>

              {/* Streaming Sessions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {streamingSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={session.thumbnail}
                          alt={session.title}
                          className="w-full h-32 object-cover"
                        />
                        {session.status === 'live' && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span>LIVE</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          {Math.floor(session.duration / 3600)}h {Math.floor((session.duration % 3600) / 60)}m
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{session.title}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{formatNumber(session.viewers)} viewers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatCurrency(session.revenue)}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {format(session.startTime, 'MMM d, yyyy HH:mm')}
                          </span>
                          <div className="flex items-center space-x-2">
                            {session.status === 'live' ? (
                              <Button size="sm" variant="destructive">
                                <Pause className="w-4 h-4 mr-2" />
                                End Stream
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                <Play className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <AIContentModerator
                mode="dashboard"
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatorDashboardV3;
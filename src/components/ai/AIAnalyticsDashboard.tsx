import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  Eye, 
  DollarSign,
  Target,
  Brain,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Clock,
  Zap,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, AreaChart, Area } from 'recharts';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalLikes: number;
    totalSubscribers: number;
    totalRevenue: number;
    viewsGrowth: number;
    likesGrowth: number;
    subscribersGrowth: number;
    revenueGrowth: number;
  };
  predictions: {
    nextWeekViews: number;
    nextMonthRevenue: number;
    subscriberGrowth: number;
    contentPerformance: number;
    confidence: number;
  };
  insights: Array<{
    id: string;
    type: 'positive' | 'warning' | 'info';
    title: string;
    description: string;
    impact: number;
    actionable: boolean;
  }>;
  contentAnalysis: {
    topPerforming: Array<{
      id: string;
      title: string;
      views: number;
      engagement: number;
      revenue: number;
    }>;
    categoryPerformance: Array<{
      category: string;
      views: number;
      engagement: number;
      color: string;
    }>;
  };
  audienceInsights: {
    demographics: Array<{
      age: string;
      percentage: number;
      color: string;
    }>;
    devices: Array<{
      device: string;
      percentage: number;
      color: string;
    }>;
    locations: Array<{
      country: string;
      percentage: number;
      flag: string;
    }>;
    engagement: Array<{
      time: string;
      engagement: number;
      views: number;
    }>;
  };
  timeSeriesData: Array<{
    date: string;
    views: number;
    likes: number;
    revenue: number;
    subscribers: number;
  }>;
}

interface AIAnalyticsDashboardProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
  className?: string;
}

const AIAnalyticsDashboard: React.FC<AIAnalyticsDashboardProps> = ({
  userId,
  timeRange = '30d',
  className = ''
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, userId]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch(`/api/ai/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.analytics);
      } else {
        // Mock data for demo
        setAnalyticsData(generateMockData());
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalyticsData(generateMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (): AnalyticsData => ({
    overview: {
      totalViews: 234567,
      totalLikes: 45234,
      totalSubscribers: 8934,
      totalRevenue: 12450,
      viewsGrowth: 12.5,
      likesGrowth: 8.3,
      subscribersGrowth: 15.7,
      revenueGrowth: 23.1
    },
    predictions: {
      nextWeekViews: 56789,
      nextMonthRevenue: 15200,
      subscriberGrowth: 18.5,
      contentPerformance: 87,
      confidence: 94
    },
    insights: [
      {
        id: '1',
        type: 'positive',
        title: 'Peak Engagement Time Detected',
        description: 'Your content performs 45% better when posted between 7-9 PM EST',
        impact: 45,
        actionable: true
      },
      {
        id: '2',
        type: 'warning',
        title: 'Subscriber Growth Slowing',
        description: 'New subscriber rate has decreased by 12% compared to last month',
        impact: -12,
        actionable: true
      },
      {
        id: '3',
        type: 'info',
        title: 'Content Category Opportunity',
        description: 'Art tutorials show 67% higher engagement than your average content',
        impact: 67,
        actionable: true
      }
    ],
    contentAnalysis: {
      topPerforming: [
        { id: '1', title: 'Digital Art Tutorial', views: 12456, engagement: 89, revenue: 342 },
        { id: '2', title: 'Character Design Process', views: 9876, engagement: 76, revenue: 287 },
        { id: '3', title: 'Speed Paint Session', views: 8234, engagement: 82, revenue: 198 }
      ],
      categoryPerformance: [
        { category: 'Tutorials', views: 45000, engagement: 78, color: '#8b5cf6' },
        { category: 'Artwork', views: 38000, engagement: 65, color: '#06b6d4' },
        { category: 'Streams', views: 32000, engagement: 71, color: '#10b981' },
        { category: 'Updates', views: 15000, engagement: 52, color: '#f59e0b' }
      ]
    },
    audienceInsights: {
      demographics: [
        { age: '18-24', percentage: 35, color: '#8b5cf6' },
        { age: '25-34', percentage: 42, color: '#06b6d4' },
        { age: '35-44', percentage: 18, color: '#10b981' },
        { age: '45+', percentage: 5, color: '#f59e0b' }
      ],
      devices: [
        { device: 'Mobile', percentage: 65, color: '#8b5cf6' },
        { device: 'Desktop', percentage: 28, color: '#06b6d4' },
        { device: 'Tablet', percentage: 7, color: '#10b981' }
      ],
      locations: [
        { country: 'United States', percentage: 45, flag: '🇺🇸' },
        { country: 'Canada', percentage: 18, flag: '🇨🇦' },
        { country: 'United Kingdom', percentage: 15, flag: '🇬🇧' },
        { country: 'Germany', percentage: 12, flag: '🇩🇪' },
        { country: 'Others', percentage: 10, flag: '🌍' }
      ],
      engagement: [
        { time: '00:00', engagement: 15, views: 1200 },
        { time: '04:00', engagement: 8, views: 800 },
        { time: '08:00', engagement: 25, views: 2100 },
        { time: '12:00', engagement: 35, views: 3200 },
        { time: '16:00', engagement: 42, views: 3800 },
        { time: '20:00', engagement: 78, views: 6500 },
        { time: '23:00', engagement: 45, views: 4200 }
      ]
    },
    timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      views: Math.floor(Math.random() * 5000) + 1000,
      likes: Math.floor(Math.random() * 500) + 100,
      revenue: Math.floor(Math.random() * 800) + 200,
      subscribers: Math.floor(Math.random() * 100) + 20
    }))
  });

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    growth: number;
    icon: React.ReactNode;
    color: string;
    index: number;
  }> = ({ title, value, growth, icon, color, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <motion.p 
                className="text-3xl font-bold"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </motion.p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
              {icon}
            </div>
          </div>
          <motion.div 
            className="flex items-center mt-4 space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            {growth >= 0 ? (
              <ArrowUp className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(growth)}%
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const InsightCard: React.FC<{
    insight: AnalyticsData['insights'][0];
    index: number;
  }> = ({ insight, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              insight.type === 'positive' 
                ? 'bg-green-100 text-green-600 dark:bg-green-950' 
                : insight.type === 'warning' 
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950' 
                : 'bg-blue-100 text-blue-600 dark:bg-blue-950'
            }`}>
              {insight.type === 'positive' ? (
                <CheckCircle className="w-4 h-4" />
              ) : insight.type === 'warning' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Target className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{insight.title}</h4>
                <Badge variant={
                  insight.type === 'positive' ? 'default' : 
                  insight.type === 'warning' ? 'destructive' : 'secondary'
                }>
                  {insight.impact > 0 ? '+' : ''}{insight.impact}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              {insight.actionable && (
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 p-0 h-auto">
                  <Zap className="w-3 h-3 mr-1" />
                  View Recommendations
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-6 h-6 text-purple-600" />
            </motion.div>
            <h2 className="text-2xl font-bold">AI Analytics Dashboard</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span>AI Processing Data...</span>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-6 h-6 text-purple-600" />
          </motion.div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Analytics Dashboard
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Insights Active
          </Badge>
          <Button variant="outline" size="sm" onClick={loadAnalyticsData} disabled={isRefreshing}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Predictions Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>AI Predictions</span>
              <Badge variant="outline" className="ml-auto">
                {analyticsData.predictions.confidence}% confident
              </Badge>
            </CardTitle>
            <CardDescription>
              Machine learning predictions based on your content patterns and audience behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Next Week Views', value: analyticsData.predictions.nextWeekViews, icon: <Eye className="w-4 h-4" /> },
                { label: 'Next Month Revenue', value: `$${analyticsData.predictions.nextMonthRevenue}`, icon: <DollarSign className="w-4 h-4" /> },
                { label: 'Subscriber Growth', value: `+${analyticsData.predictions.subscriberGrowth}%`, icon: <Users className="w-4 h-4" /> },
                { label: 'Content Performance', value: `${analyticsData.predictions.contentPerformance}%`, icon: <BarChart3 className="w-4 h-4" /> }
              ].map((prediction, index) => (
                <motion.div
                  key={prediction.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-center space-y-2"
                >
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-lg mx-auto w-fit">
                    {prediction.icon}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-purple-600">{prediction.value}</p>
                    <p className="text-sm text-muted-foreground">{prediction.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value={analyticsData.overview.totalViews}
          growth={analyticsData.overview.viewsGrowth}
          icon={<Eye className="w-5 h-5 text-white" />}
          color="bg-blue-500"
          index={0}
        />
        <MetricCard
          title="Total Likes"
          value={analyticsData.overview.totalLikes}
          growth={analyticsData.overview.likesGrowth}
          icon={<Heart className="w-5 h-5 text-white" />}
          color="bg-red-500"
          index={1}
        />
        <MetricCard
          title="Subscribers"
          value={analyticsData.overview.totalSubscribers}
          growth={analyticsData.overview.subscribersGrowth}
          icon={<Users className="w-5 h-5 text-white" />}
          color="bg-green-500"
          index={2}
        />
        <MetricCard
          title="Revenue"
          value={`$${analyticsData.overview.totalRevenue}`}
          growth={analyticsData.overview.revenueGrowth}
          icon={<DollarSign className="w-5 h-5 text-white" />}
          color="bg-purple-500"
          index={3}
        />
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>AI-Generated Insights</span>
        </h3>
        <div className="space-y-3">
          {analyticsData.insights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Detailed Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your content performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stackId="1" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="likes" 
                      stackId="2" 
                      stroke="#06b6d4" 
                      fill="#06b6d4" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Your most successful posts this period</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData.contentAnalysis.topPerforming.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{content.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {content.views.toLocaleString()} views • {content.engagement}% engagement
                        </p>
                      </div>
                      <Badge variant="outline">${content.revenue}</Badge>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>How different content types perform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.contentAnalysis.categoryPerformance}
                        dataKey="views"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {analyticsData.contentAnalysis.categoryPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analyticsData.audienceInsights.demographics.map((demo, index) => (
                    <motion.div
                      key={demo.age}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span>{demo.age}</span>
                        <span>{demo.percentage}%</span>
                      </div>
                      <Progress value={demo.percentage} className="h-2" />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analyticsData.audienceInsights.devices.map((device, index) => (
                    <motion.div
                      key={device.device}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        {device.device === 'Mobile' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : device.device === 'Desktop' ? (
                          <Monitor className="w-4 h-4" />
                        ) : (
                          <Globe className="w-4 h-4" />
                        )}
                        <span className="text-sm">{device.device}</span>
                      </div>
                      <span className="font-medium">{device.percentage}%</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analyticsData.audienceInsights.locations.map((location, index) => (
                    <motion.div
                      key={location.country}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{location.flag}</span>
                        <span className="text-sm">{location.country}</span>
                      </div>
                      <span className="font-medium">{location.percentage}%</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement by Time</CardTitle>
                <CardDescription>When your audience is most active</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={analyticsData.audienceInsights.engagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8b5cf6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AIAnalyticsDashboard;
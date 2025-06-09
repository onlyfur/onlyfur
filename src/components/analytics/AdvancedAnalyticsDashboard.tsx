import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Download,
  Users,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  content: {
    total: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
  };
  subscribers: {
    total: number;
  };
  revenue: {
    total: number;
    net: number;
  };
  messages: {
    received: number;
  };
  topContent: Array<{
    id: string;
    title: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    type: string;
  }>;
}

interface TrendData {
  date: string;
  views: number;
  uniqueViews: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [metric, setMetric] = useState('views');

  useEffect(() => {
    fetchAnalyticsData();
    fetchTrendData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/advanced-analytics/creator/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  const fetchTrendData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/advanced-analytics/creator/performance-trends?days=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTrendData(data.trends || []);
      }
    } catch (error) {
      console.error('Failed to fetch trend data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const MetricCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    growth?: number;
    format?: 'number' | 'currency' | 'time';
  }> = ({ title, value, icon, growth, format = 'number' }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `$${val.toFixed(2)}`;
        case 'time':
          return `${Math.floor(val / 60)}m ${Math.floor(val % 60)}s`;
        default:
          return formatNumber(val);
      }
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(value)}</div>
          {growth !== undefined && (
            <div className="flex items-center pt-1">
              {growth > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : growth < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <span className={`text-xs ${
                growth > 0 ? 'text-green-500' : 
                growth < 0 ? 'text-red-500' : 
                'text-muted-foreground'
              }`}>
                {growth > 0 ? '+' : ''}{growth.toFixed(1)}% from last period
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (isLoading && !analyticsData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Detailed insights into your content performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      {analyticsData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Views"
            value={analyticsData.content.totalViews}
            icon={<Eye className="w-4 h-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Total Likes"
            value={analyticsData.content.totalLikes}
            icon={<Heart className="w-4 h-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Subscribers"
            value={analyticsData.subscribers.total}
            icon={<Users className="w-4 h-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Revenue"
            value={analyticsData.revenue.total}
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            format="currency"
          />
        </div>
      )}

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="content">Top Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Track your content performance over time
                </CardDescription>
              </div>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                  <SelectItem value="comments">Comments</SelectItem>
                  <SelectItem value="shares">Shares</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={metric}
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>
                Your most popular content by views
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData?.topContent && analyticsData.topContent.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.topContent.slice(0, 10).map((content, index) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <h4 className="font-medium">{content.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {formatNumber(content.viewsCount)}
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {formatNumber(content.likesCount)}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {formatNumber(content.commentsCount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{content.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No content data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Overview</CardTitle>
                <CardDescription>
                  Breakdown of engagement types
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData && (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Views', value: analyticsData.content.totalViews },
                          { name: 'Likes', value: analyticsData.content.totalLikes },
                          { name: 'Comments', value: analyticsData.content.totalComments },
                          { name: 'Shares', value: analyticsData.content.totalShares }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {[].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Engagement</CardTitle>
                <CardDescription>
                  Engagement trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="likes" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="comments" 
                      stackId="1" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="shares" 
                      stackId="1" 
                      stroke="#ffc658" 
                      fill="#ffc658" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>
                Track your earnings and financial performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${analyticsData.revenue.total.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${analyticsData.revenue.net.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">Net Revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ${((analyticsData.revenue.total - analyticsData.revenue.net)).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">Platform Fees</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;

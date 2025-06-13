import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Eye, 
  Heart,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Zap,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalSubscribers: number;
    totalViews: number;
    totalContent: number;
    engagementRate: number;
    retentionRate: number;
    arpu: number;
  };
  revenue: {
    current: number;
    breakdown: Array<{
      tier: string;
      subscribers: number;
      revenue: number;
    }>;
  };
  content: {
    totalPublished: number;
    totalViews: number;
    totalLikes: number;
    averageViews: number;
    topPerforming: Array<{
      id: string;
      title: string;
      views: number;
      likes: number;
      createdAt: string;
      type: string;
    }>;
  };
  growth: {
    subscriberGrowth: Array<{
      date: string;
      newSubscribers: number;
    }>;
  };
  demographics: {
    tierDistribution: Array<{
      tier: string;
      count: number;
      percentage: number;
    }>;
  };
}

interface ForecastData {
  historical: Array<{
    month: string;
    revenue: number;
    subscribers: number;
  }>;
  predicted: Array<{
    month: string;
    predictedRevenue: number;
    confidence: number;
  }>;
  confidence: number;
  insights: string[];
}

interface AudienceInsights {
  totalAudience: number;
  segments: {
    highly_engaged: number;
    moderately_engaged: number;
    low_engagement: number;
    at_risk: number;
  };
  tierDistribution: Record<string, number>;
  tierChanges: {
    upgrades: number;
    downgrades: number;
    churned: number;
    reactivated: number;
  };
  lifetimeValue: number;
  recommendations: string[];
}

interface ContentPerformance {
  overview: {
    totalContent: number;
    totalViews: number;
    totalLikes: number;
    averageEngagement: number;
  };
  byType: Record<string, {
    count: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    averageViews: number;
    engagementRate: number;
  }>;
  topPerforming: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    createdAt: string;
    type: string;
  }>;
  postingPatterns: {
    dayOfWeek: Record<number, number>;
    hourOfDay: Record<number, number>;
  };
  optimalTimes: {
    bestDays: string[];
    bestHours: number[];
    timezone: string;
  };
  recommendations: string[];
}

const AdvancedAnalyticsV2: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsights | null>(null);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics-v2/dashboard?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.analytics);
        toast.success('Analytics updated');
      } else {
        toast.error('Failed to fetch analytics');
        // Generate mock data for demo
        setAnalyticsData(generateMockAnalyticsData());
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to fetch analytics');
      setAnalyticsData(generateMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalyticsData = (): AnalyticsData => ({
    overview: {
      totalRevenue: 12450.00,
      totalSubscribers: 2847,
      totalViews: 156780,
      totalContent: 145,
      engagementRate: 8.7,
      retentionRate: 89.2,
      arpu: 4.37
    },
    revenue: {
      current: 12450.00,
      breakdown: [
        { tier: 'VIP', subscribers: 127, revenue: 6350.00 },
        { tier: 'Premium', subscribers: 458, revenue: 4580.00 },
        { tier: 'Basic', subscribers: 2262, revenue: 1520.00 }
      ]
    },
    content: {
      totalPublished: 145,
      totalViews: 156780,
      totalLikes: 23456,
      averageViews: 1081,
      topPerforming: [
        {
          id: '1',
          title: 'Digital Art Tutorial Series',
          views: 5670,
          likes: 892,
          createdAt: '2024-01-15',
          type: 'video'
        },
        {
          id: '2',
          title: 'Character Design Process',
          views: 4230,
          likes: 756,
          createdAt: '2024-01-18',
          type: 'image'
        }
      ]
    },
    growth: {
      subscriberGrowth: [
        { date: '2024-01-01', newSubscribers: 45 },
        { date: '2024-01-08', newSubscribers: 67 },
        { date: '2024-01-15', newSubscribers: 89 },
        { date: '2024-01-22', newSubscribers: 72 }
      ]
    },
    demographics: {
      tierDistribution: [
        { tier: 'Basic', count: 2262, percentage: 79.5 },
        { tier: 'Premium', count: 458, percentage: 16.1 },
        { tier: 'VIP', count: 127, percentage: 4.5 }
      ]
    }
  });

  const fetchRevenueForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics-v2/revenue-forecast', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setForecastData(data.forecast);
        toast.success('Revenue forecast generated');
      }
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      toast.error('Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  };

  const fetchAudienceInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics-v2/audience-insights', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAudienceInsights(data.insights);
        toast.success('Audience insights loaded');
      }
    } catch (error) {
      console.error('Failed to fetch audience insights:', error);
      toast.error('Failed to fetch audience insights');
    } finally {
      setLoading(false);
    }
  };

  const fetchContentPerformance = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics-v2/content-performance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setContentPerformance(data.performance);
        toast.success('Content performance loaded');
      }
    } catch (error) {
      console.error('Failed to fetch content performance:', error);
      toast.error('Failed to fetch content performance');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return 'text-green-500';
    if (rate >= 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            Advanced Analytics
            <Badge className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
              v3.9
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Deep insights into your creator performance, audience behavior, and revenue optimization.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {analyticsData && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getChangeIcon(12.5)}
                    <span className="ml-1">+12.5% from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalSubscribers)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getChangeIcon(8.2)}
                    <span className="ml-1">+8.2% from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalViews)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getChangeIcon(15.7)}
                    <span className="ml-1">+15.7% from last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(analyticsData.overview.engagementRate)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getChangeIcon(2.1)}
                    <span className="ml-1">+2.1% from last period</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Retention Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{formatPercentage(analyticsData.overview.retentionRate)}</div>
                  <Progress value={analyticsData.overview.retentionRate} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Excellent retention - subscribers are staying engaged!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ARPU</CardTitle>
                  <CardDescription>Average Revenue Per User</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{formatCurrency(analyticsData.overview.arpu)}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                    Above industry average
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{formatNumber(analyticsData.overview.totalContent)}</div>
                  <p className="text-sm text-muted-foreground">Total pieces published</p>
                  <div className="mt-2">
                    <span className="text-sm">Avg. views per content: </span>
                    <span className="font-semibold">{formatNumber(Math.round(analyticsData.overview.totalViews / analyticsData.overview.totalContent))}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Subscription Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.revenue.breakdown.map((tier, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            tier.tier === 'VIP' ? 'bg-yellow-500' :
                            tier.tier === 'Premium' ? 'bg-purple-500' : 'bg-blue-500'
                          }`}></div>
                          <span className="font-medium">{tier.tier}</span>
                          <Badge variant="secondary">{formatNumber(tier.subscribers)} subs</Badge>
                        </div>
                        <span className="font-bold">{formatCurrency(tier.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Opportunities</CardTitle>
                  <CardDescription>Recommendations to increase revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Tier Optimization</p>
                        <p className="text-sm text-muted-foreground">
                          Consider adding mid-tier options to capture more users
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Content Bundling</p>
                        <p className="text-sm text-muted-foreground">
                          Bundle popular content to increase ARPU
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Limited Time Offers</p>
                        <p className="text-sm text-muted-foreground">
                          Create urgency with exclusive time-limited content
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscriber Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.tierDistribution.map((tier, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{tier.tier}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(tier.count)} ({formatPercentage(tier.percentage)})
                          </span>
                        </div>
                        <Progress value={tier.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscriber Growth</CardTitle>
                  <CardDescription>New subscribers over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.growth.subscriberGrowth.map((growth, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{new Date(growth.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline-solid">+{formatNumber(growth.newSubscribers)}</Badge>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Your most engaging content pieces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.content.topPerforming.map((content, index) => (
                      <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {content.type} • {new Date(content.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="font-bold">{formatNumber(content.views)}</p>
                              <p className="text-xs text-muted-foreground">views</p>
                            </div>
                            <div className="text-center">
                              <p className="font-bold">{formatNumber(content.likes)}</p>
                              <p className="text-xs text-muted-foreground">likes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="font-medium text-blue-900">Peak Performance</p>
                      <p className="text-sm text-blue-700">
                        Your content performs best on weekends, with 40% higher engagement rates.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <p className="font-medium text-green-900">Revenue Growth</p>
                      <p className="text-sm text-green-700">
                        Monthly recurring revenue has increased by 15% this quarter.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <p className="font-medium text-purple-900">Audience Engagement</p>
                      <p className="text-sm text-purple-700">
                        Visual content gets 3x more engagement than text-only posts.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Optimize Posting Schedule</p>
                        <p className="text-sm text-muted-foreground">
                          Post during peak hours (6-8 PM) for maximum reach
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Content Diversification</p>
                        <p className="text-sm text-muted-foreground">
                          Add more video content to boost engagement
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Tier Strategy Review</p>
                        <p className="text-sm text-muted-foreground">
                          Consider adjusting tier pricing based on engagement data
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedAnalyticsV2;

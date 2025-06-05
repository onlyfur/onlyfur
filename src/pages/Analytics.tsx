import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserAnalytics } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Eye, Heart, Users, DollarSign, 
  Calendar, Target, Star, Download, MessageSquare, Share
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalLikes: number;
    subscriberCount: number;
    revenue: number;
    contentCount: number;
    growth: {
      views: number;
      likes: number;
      subscribers: number;
      revenue: number;
    };
  };
  content: {
    topPerforming: Array<{
      id: string;
      title: string;
      type: string;
      views: number;
      likes: number;
      revenue: number;
    }>;
    byCategory: Record<string, number>;
  };
  audience: {
    demographics: {
      species: Record<string, number>;
      locations: Record<string, number>;
      ages: Record<string, number>;
    };
    engagement: {
      avgTimeSpent: number;
      returnRate: number;
      conversionRate: number;
    };
  };
  revenue: {
    monthly: Array<{
      month: string;
      amount: number;
      subscribers: number;
    }>;
    sources: {
      subscriptions: number;
      tips: number;
      merchandise: number;
      custom: number;
    };
  };
}

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Generate mock analytics data
    const generateMockAnalytics = (): AnalyticsData => {
      const baseViews = 15000;
      const baseLikes = 1200;
      const baseSubscribers = 450;
      const baseRevenue = 5600;
      const baseContent = 89;

      return {
        overview: {
          totalViews: baseViews + Math.floor(Math.random() * 5000),
          totalLikes: baseLikes + Math.floor(Math.random() * 300),
          subscriberCount: baseSubscribers + Math.floor(Math.random() * 50),
          revenue: baseRevenue + Math.floor(Math.random() * 1000),
          contentCount: baseContent + Math.floor(Math.random() * 20),
          growth: {
            views: Math.floor(Math.random() * 30) - 10,
            likes: Math.floor(Math.random() * 25) - 8,
            subscribers: Math.floor(Math.random() * 20) - 5,
            revenue: Math.floor(Math.random() * 35) - 10,
          }
        },
        content: {
          topPerforming: [
            {
              id: '1',
              title: 'Fox Fursuit Photoshoot',
              type: 'Photo',
              views: 2456,
              likes: 189,
              revenue: 145
            },
            {
              id: '2',
              title: 'Dragon Character Art Commission',
              type: 'Art',
              views: 1892,
              likes: 156,
              revenue: 89
            },
            {
              id: '3',
              title: 'Wolf Transformation Video',
              type: 'Video',
              views: 1654,
              likes: 134,
              revenue: 234
            },
            {
              id: '4',
              title: 'Partial Fursuit Tutorial',
              type: 'Video',
              views: 1423,
              likes: 98,
              revenue: 67
            },
            {
              id: '5',
              title: 'Fursona Reference Sheet',
              type: 'Art',
              views: 1289,
              likes: 87,
              revenue: 123
            }
          ],
          byCategory: {
            'Fursuit Photos': 35,
            'Character Art': 28,
            'Videos': 15,
            'Tutorials': 12,
            'Other': 10
          }
        },
        audience: {
          demographics: {
            species: {
              'Fox': 32,
              'Wolf': 24,
              'Cat': 18,
              'Dragon': 15,
              'Other': 11
            },
            locations: {
              'United States': 45,
              'Canada': 18,
              'United Kingdom': 12,
              'Germany': 8,
              'Australia': 7,
              'Other': 10
            },
            ages: {
              '18-24': 28,
              '25-34': 42,
              '35-44': 20,
              '45+': 10
            }
          },
          engagement: {
            avgTimeSpent: 12.5,
            returnRate: 68,
            conversionRate: 8.2
          }
        },
        revenue: {
          monthly: [
            { month: 'Jan', amount: 4200, subscribers: 380 },
            { month: 'Feb', amount: 4600, subscribers: 405 },
            { month: 'Mar', amount: 5100, subscribers: 425 },
            { month: 'Apr', amount: 5400, subscribers: 440 },
            { month: 'May', amount: 5800, subscribers: 465 },
            { month: 'Jun', amount: 6200, subscribers: 485 }
          ],
          sources: {
            subscriptions: 78,
            tips: 12,
            merchandise: 6,
            custom: 4
          }
        }
      };
    };

    setAnalytics(generateMockAnalytics());
    setIsLoading(false);
  }, [user, timeRange]);

  const formatGrowth = (value: number) => {
    const isPositive = value >= 0;
    return {
      value: Math.abs(value),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      className: isPositive ? 'text-green-600' : 'text-red-600'
    };
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please log in to view analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== 'creator' && user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Analytics are only available for creators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your performance and grow your audience</p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold">{analytics.overview.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2">
                  {(() => {
                    const growth = formatGrowth(analytics.overview.growth.views);
                    const GrowthIcon = growth.icon;
                    return (
                      <>
                        <GrowthIcon className={`h-4 w-4 mr-1 ${growth.className}`} />
                        <span className={`text-sm ${growth.className}`}>
                          {growth.value}% vs last period
                        </span>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Likes</p>
                    <p className="text-2xl font-bold">{analytics.overview.totalLikes.toLocaleString()}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <div className="flex items-center mt-2">
                  {(() => {
                    const growth = formatGrowth(analytics.overview.growth.likes);
                    const GrowthIcon = growth.icon;
                    return (
                      <>
                        <GrowthIcon className={`h-4 w-4 mr-1 ${growth.className}`} />
                        <span className={`text-sm ${growth.className}`}>
                          {growth.value}% vs last period
                        </span>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subscribers</p>
                    <p className="text-2xl font-bold">{analytics.overview.subscriberCount.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2">
                  {(() => {
                    const growth = formatGrowth(analytics.overview.growth.subscribers);
                    const GrowthIcon = growth.icon;
                    return (
                      <>
                        <GrowthIcon className={`h-4 w-4 mr-1 ${growth.className}`} />
                        <span className={`text-sm ${growth.className}`}>
                          {growth.value}% vs last period
                        </span>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold">${analytics.overview.revenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2">
                  {(() => {
                    const growth = formatGrowth(analytics.overview.growth.revenue);
                    const GrowthIcon = growth.icon;
                    return (
                      <>
                        <GrowthIcon className={`h-4 w-4 mr-1 ${growth.className}`} />
                        <span className={`text-sm ${growth.className}`}>
                          {growth.value}% vs last period
                        </span>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Content</p>
                    <p className="text-2xl font-bold">{analytics.overview.contentCount}</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                  <span className="text-sm text-green-600">
                    +5 this month
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Likes</span>
                      <span>8.2%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Comments</span>
                      <span>2.1%</span>
                    </div>
                    <Progress value={21} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Shares</span>
                      <span>1.3%</span>
                    </div>
                    <Progress value={13} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audience Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analytics.audience.engagement.returnRate}%
                  </div>
                  <p className="text-sm text-gray-600">
                    Average return rate
                  </p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily Active</span>
                      <span>24%</span>
                    </div>
                    <Progress value={24} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm mb-1">
                      <span>Weekly Active</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.audience.engagement.conversionRate}%
                    </div>
                    <p className="text-sm text-gray-600">Visitor to subscriber</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Free to paid</span>
                      <Badge variant="secondary">12.4%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tip conversion</span>
                      <Badge variant="secondary">5.8%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Content */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.content.topPerforming.map((content, index) => (
                    <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{content.title}</p>
                          <p className="text-xs text-gray-600">{content.type}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{content.views} views</p>
                        <p className="text-gray-600">{content.likes} likes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Content by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.content.byCategory).map(([category, count]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{category}</span>
                        <span>{count} posts</span>
                      </div>
                      <Progress value={(count / 100) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Species Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Audience by Species</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.audience.demographics.species).map(([species, percentage]) => (
                    <div key={species}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{species}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.audience.demographics.locations).map(([location, percentage]) => (
                    <div key={location}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{location}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Age Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.audience.demographics.ages).map(([age, percentage]) => (
                    <div key={age}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{age}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.revenue.sources).map(([source, percentage]) => (
                    <div key={source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{source}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.revenue.monthly.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{month.month}</span>
                      <div className="text-right">
                        <p className="font-bold">${month.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{month.subscribers} subscribers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

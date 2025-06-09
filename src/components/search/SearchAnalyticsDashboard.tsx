import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Search, BarChart3, Users, 
  Clock, Target, Sparkles, Activity, Eye, MousePointer,
  Calendar, Hash, Filter, Zap
} from 'lucide-react';
import { searchAnalytics, SearchAnalytics, PopularSearch } from '@/services/searchAnalytics';

interface SearchMetric {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
}

const SearchAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<SearchAnalytics[]>([]);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [trends, setTrends] = useState<{ [category: string]: number }>({});
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = () => {
    const allAnalytics = searchAnalytics.getAnalytics();
    const popular = searchAnalytics.getPopularSearches();
    const searchTrends = searchAnalytics.getSearchTrends();
    
    // Filter analytics by time range
    const now = Date.now();
    const timeRangeMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    };
    
    const filteredAnalytics = allAnalytics.filter(
      a => now - a.timestamp <= timeRangeMs[timeRange]
    );
    
    setAnalytics(filteredAnalytics);
    setPopularSearches(popular);
    setTrends(searchTrends);
  };

  const calculateMetrics = (): SearchMetric[] => {
    const totalSearches = analytics.length;
    const totalResults = analytics.reduce((sum, a) => sum + a.results, 0);
    const avgResults = totalSearches > 0 ? Math.round(totalResults / totalSearches) : 0;
    const clickedSearches = analytics.filter(a => a.clicked).length;
    const clickRate = totalSearches > 0 ? Math.round((clickedSearches / totalSearches) * 100) : 0;
    const voiceSearches = analytics.filter(a => a.source === 'voice').length;
    const voiceRate = totalSearches > 0 ? Math.round((voiceSearches / totalSearches) * 100) : 0;

    return [
      {
        label: 'Total Searches',
        value: totalSearches.toString(),
        change: '+12%',
        changeType: 'up',
        icon: Search
      },
      {
        label: 'Avg Results',
        value: avgResults.toString(),
        change: '+5%',
        changeType: 'up',
        icon: Target
      },
      {
        label: 'Click Rate',
        value: `${clickRate}%`,
        change: '+8%',
        changeType: 'up',
        icon: MousePointer
      },
      {
        label: 'Voice Usage',
        value: `${voiceRate}%`,
        change: '+15%',
        changeType: 'up',
        icon: Sparkles
      }
    ];
  };

  const getTopCategories = () => {
    return Object.entries(trends)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count,
        percentage: Math.round((count / analytics.length) * 100) || 0
      }));
  };

  const getSearchSourceBreakdown = () => {
    const sources = analytics.reduce((acc, search) => {
      acc[search.source] = (acc[search.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { source: 'Text', count: sources.text || 0, color: 'bg-blue-500' },
      { source: 'Voice', count: sources.voice || 0, color: 'bg-green-500' },
      { source: 'Suggestion', count: sources.suggestion || 0, color: 'bg-purple-500' }
    ];
  };

  const getRecentSearches = () => {
    return analytics
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(search => ({
        ...search,
        timeAgo: getTimeAgo(search.timestamp)
      }));
  };

  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const metrics = calculateMetrics();
  const topCategories = getTopCategories();
  const sourceBreakdown = getSearchSourceBreakdown();
  const recentSearches = getRecentSearches();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Search Analytics
          </h2>
          <p className="text-muted-foreground">
            Insights into search behavior and AI-powered features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <div className="flex rounded-lg border">
            {(['day', 'week', 'month'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="rounded-none first:rounded-l-lg last:rounded-r-lg"
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.changeType === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                ) : metric.changeType === 'down' ? (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                ) : (
                  <Activity className="w-3 h-3 mr-1 text-gray-500" />
                )}
                {metric.change} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Search Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  Top Categories
                </CardTitle>
                <CardDescription>
                  Most searched content categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.category}</span>
                      <span>{category.count} searches ({category.percentage}%)</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Search Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Search Sources
                </CardTitle>
                <CardDescription>
                  How users initiate searches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sourceBreakdown.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${source.color} mr-2`} />
                      <span className="text-sm">{source.source}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{source.count}</span>
                      <Badge variant="outline" className="text-xs">
                        {analytics.length > 0 ? Math.round((source.count / analytics.length) * 100) : 0}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Popular Searches
              </CardTitle>
              <CardDescription>
                Most frequently searched terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularSearches.slice(0, 10).map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{search.query}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {search.category} • {search.count} searches
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {search.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : search.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <Activity className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Volume Trends</CardTitle>
                <CardDescription>
                  Search activity over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Chart visualization coming soon</p>
                  <p className="text-sm">Will show search volume trends over time</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Feature Usage</CardTitle>
                <CardDescription>
                  AI-powered search feature adoption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Voice Search</span>
                      <span>{sourceBreakdown.find(s => s.source === 'Voice')?.count || 0} uses</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Suggestions</span>
                      <span>{sourceBreakdown.find(s => s.source === 'Suggestion')?.count || 0} uses</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Smart Filters</span>
                      <span>24 uses</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Search Activity
              </CardTitle>
              <CardDescription>
                Latest search queries and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        {search.source === 'voice' && <Sparkles className="w-3 h-3 text-purple-500 mr-1" />}
                        {search.source === 'suggestion' && <Target className="w-3 h-3 text-blue-500 mr-1" />}
                        <span className="text-sm font-medium">{search.query}</span>
                      </div>
                      {search.clicked && (
                        <Badge variant="secondary" className="text-xs">
                          Clicked
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{search.results} results</span>
                      <span>•</span>
                      <span>{search.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchAnalyticsDashboard;

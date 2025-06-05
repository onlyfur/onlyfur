import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Shield,
  MessageSquare,
  Eye,
  ChevronRight,
  RefreshCw,
  Download,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    platformAnalytics,
    systemHealth,
    supportTickets,
    pendingContent,
    flaggedContent,
    verificationRequests,
    refreshAnalytics,
    isLoading,
  } = useAdmin();

  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600';
      case 'critical':
      case 'offline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  const getPercentageColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-600';
    if (percentage < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const urgentTickets = supportTickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length;
  const pendingReviews = pendingContent.length + flaggedContent.length + verificationRequests.length;

  // Mock chart data
  const revenueData = platformAnalytics.financial?.revenue?.byPeriod?.slice(-7) || [];
  const userGrowthData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
    users: Math.floor(Math.random() * 100) + 50,
    creators: Math.floor(Math.random() * 30) + 10,
  }));

  const categoryData = platformAnalytics.content?.topCategories?.slice(0, 5).map(cat => ({
    name: cat.category,
    value: cat.count,
    revenue: cat.revenue,
  })) || [];

  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and key metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={refreshAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      {systemHealth.status !== 'healthy' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  System Status: {systemHealth.status?.toUpperCase()}
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Some services are experiencing issues. Check system monitoring for details.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/system')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {(urgentTickets > 0 || pendingReviews > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {urgentTickets > 0 && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-red-800 dark:text-red-200">
                        {urgentTickets} Urgent Support Ticket{urgentTickets !== 1 ? 's' : ''}
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Require immediate attention
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/admin/support')}
                  >
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {pendingReviews > 0 && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-200">
                        {pendingReviews} Pending Review{pendingReviews !== 1 ? 's' : ''}
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Content and user verifications
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/admin/content')}
                  >
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{formatNumber(platformAnalytics.overview?.totalUsers || 0)}</p>
                <div className="flex items-center mt-1">
                  {platformAnalytics.growth?.newUsers?.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${getPercentageColor(platformAnalytics.growth?.newUsers?.percentageChange || 0)}`}>
                    {Math.abs(platformAnalytics.growth?.newUsers?.percentageChange || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(platformAnalytics.overview?.totalRevenue || 0)}</p>
                <div className="flex items-center mt-1">
                  {platformAnalytics.growth?.revenue?.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${getPercentageColor(platformAnalytics.growth?.revenue?.percentageChange || 0)}`}>
                    {Math.abs(platformAnalytics.growth?.revenue?.percentageChange || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{formatNumber(platformAnalytics.overview?.activeSessions || 0)}</p>
                <div className="flex items-center mt-1">
                  <Activity className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">
                    {formatNumber(platformAnalytics.engagement?.dailyActiveUsers || 0)} DAU
                  </span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">{formatNumber(platformAnalytics.overview?.totalContent || 0)}</p>
                <div className="flex items-center mt-1">
                  {platformAnalytics.growth?.content?.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${getPercentageColor(platformAnalytics.growth?.content?.percentageChange || 0)}`}>
                    {Math.abs(platformAnalytics.growth?.content?.percentageChange || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 7 days revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users and creators over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" name="Users" />
                <Bar dataKey="creators" fill="#8B5CF6" name="Creators" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Content by Category</CardTitle>
            <CardDescription>Distribution of content across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current status of platform services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.services?.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'online' ? 'bg-green-500' :
                      service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      service.status === 'online' ? 'default' :
                      service.status === 'degraded' ? 'secondary' : 'destructive'
                    }>
                      {service.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {service.responseTime}ms
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {systemHealth.metrics && (
              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Server Load</span>
                    <span>{systemHealth.metrics.serverLoad}%</span>
                  </div>
                  <Progress value={systemHealth.metrics.serverLoad} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>{systemHealth.metrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemHealth.metrics.memoryUsage} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Disk Usage</span>
                    <span>{systemHealth.metrics.diskUsage}%</span>
                  </div>
                  <Progress value={systemHealth.metrics.diskUsage} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/admin/users')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  {verificationRequests.length} pending verifications
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/admin/content')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Content Moderation</h3>
                <p className="text-sm text-muted-foreground">
                  {pendingContent.length + flaggedContent.length} items to review
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/admin/support')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Support Tickets</h3>
                <p className="text-sm text-muted-foreground">
                  {supportTickets.filter(t => t.status === 'open').length} open tickets
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
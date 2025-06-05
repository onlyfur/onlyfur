import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MessageCircle, 
  Bell,
  Upload,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Earnings',
      value: '$2,840',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Subscribers',
      value: '1,234',
      change: '+8.2%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Content Views',
      value: '45.2K',
      change: '+23.1%',
      icon: Eye,
      color: 'text-purple-600',
    },
    {
      title: 'Messages',
      value: '89',
      change: '+5.4%',
      icon: MessageCircle,
      color: 'text-pink-600',
    },
  ];

  const recentActivity = [
    {
      type: 'subscription',
      user: 'Sarah Johnson',
      action: 'subscribed to your premium tier',
      time: '2 minutes ago',
      icon: Crown,
    },
    {
      type: 'like',
      user: 'Mike Chen',
      action: 'liked your recent post',
      time: '5 minutes ago',
      icon: Heart,
    },
    {
      type: 'message',
      user: 'Emma Davis',
      action: 'sent you a message',
      time: '10 minutes ago',
      icon: MessageCircle,
    },
    {
      type: 'share',
      user: 'Alex Thompson',
      action: 'shared your content',
      time: '15 minutes ago',
      icon: Share2,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.displayName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your {user?.role} account today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="capitalize">
            {user?.role}
          </Badge>
          {user?.role === 'creator' && (
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Content
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest interactions with your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-sm">Upload Content</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <MessageCircle className="w-6 h-6 mb-2" />
                <span className="text-sm">Messages</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="text-sm">Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Users className="w-6 h-6 mb-2" />
                <span className="text-sm">Subscribers</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Your content performance over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Analytics chart will be implemented in the next phase</p>
            <p className="text-sm">This will show detailed performance metrics and trends</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import {
  Bell,
  BellOff,
  Brain,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  MessageSquare,
  Heart,
  Share,
  Eye,
  Settings,
  X,
  Lightbulb,
  Target,
  Award,
  Calendar
} from 'lucide-react';

interface AINotification {
  id: string;
  type: 'insight' | 'opportunity' | 'alert' | 'achievement' | 'recommendation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  actionable: boolean;
  action?: {
    label: string;
    url?: string;
    handler?: () => void;
  };
  metadata?: {
    metric?: string;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    confidence?: number;
  };
  dismissed?: boolean;
  read?: boolean;
}

interface NotificationSettings {
  insights: boolean;
  opportunities: boolean;
  alerts: boolean;
  achievements: boolean;
  recommendations: boolean;
  realTime: boolean;
  email: boolean;
  push: boolean;
}

export default function AINotificationCenter() {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    insights: true,
    opportunities: true,
    alerts: true,
    achievements: true,
    recommendations: true,
    realTime: true,
    email: false,
    push: true
  });
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const generateAINotifications = useCallback((): AINotification[] => {
    return [
      {
        id: '1',
        type: 'insight',
        priority: 'high',
        title: 'Engagement Peak Detected',
        message: 'Your content performs 78% better when posted between 7-9 PM on weekdays.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        actionable: true,
        action: {
          label: 'Schedule Content',
          url: '/creator-dashboard-v3?tab=scheduler'
        },
        metadata: {
          metric: 'engagement_rate',
          change: 78,
          trend: 'up',
          confidence: 94
        }
      },
      {
        id: '2',
        type: 'opportunity',
        priority: 'medium',
        title: 'Revenue Opportunity Identified',
        message: 'Subscribers are requesting more behind-the-scenes content. This could increase revenue by ~$350/month.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actionable: true,
        action: {
          label: 'Create BTS Content',
          url: '/content-upload?type=bts'
        },
        metadata: {
          metric: 'potential_revenue',
          change: 350,
          trend: 'up',
          confidence: 87
        }
      },
      {
        id: '3',
        type: 'alert',
        priority: 'urgent',
        title: 'Unusual Activity Detected',
        message: 'Multiple failed login attempts detected. Your account security may be at risk.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        actionable: true,
        action: {
          label: 'Review Security',
          url: '/security-settings'
        },
        metadata: {
          confidence: 96
        }
      },
      {
        id: '4',
        type: 'achievement',
        priority: 'medium',
        title: 'Milestone Reached!',
        message: 'Congratulations! You\'ve reached 1,000 followers. Your engagement rate is 23% above average.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        actionable: true,
        action: {
          label: 'Celebrate with Post',
          url: '/content-upload?template=milestone'
        },
        metadata: {
          metric: 'followers',
          change: 1000,
          trend: 'up',
          confidence: 100
        }
      },
      {
        id: '5',
        type: 'recommendation',
        priority: 'low',
        title: 'Content Suggestion',
        message: 'Based on your audience preferences, fursuit photography content could boost engagement by 45%.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        actionable: true,
        action: {
          label: 'Generate Ideas',
          url: '/ai-studio?type=photography'
        },
        metadata: {
          metric: 'engagement_boost',
          change: 45,
          trend: 'up',
          confidence: 82
        }
      },
      {
        id: '6',
        type: 'insight',
        priority: 'medium',
        title: 'Audience Analysis Update',
        message: 'Your core audience age shifted: 67% are now 22-28 years old. Consider adjusting content tone.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        actionable: true,
        action: {
          label: 'View Analytics',
          url: '/analytics?section=demographics'
        },
        metadata: {
          confidence: 91
        }
      }
    ];
  }, []);

  useEffect(() => {
    // Simulate loading AI notifications
    setTimeout(() => {
      setNotifications(generateAINotifications());
      setIsLoading(false);
    }, 1000);
  }, [generateAINotifications]);

  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case 'insight': return Brain;
      case 'opportunity': return TrendingUp;
      case 'alert': return AlertTriangle;
      case 'achievement': return Award;
      case 'recommendation': return Lightbulb;
      default: return Bell;
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-300 bg-white';
    }
  }, []);

  const getPriorityBadgeColor = useCallback((priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const formatTimeAgo = useCallback((timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, dismissed: true } : notif
    ));
  }, []);

  const filterNotifications = useCallback((filter: string) => {
    if (filter === 'all') return notifications.filter(n => !n.dismissed);
    return notifications.filter(n => n.type === filter && !n.dismissed);
  }, [notifications]);

  const handleActionClick = useCallback((notification: AINotification) => {
    if (notification.action?.handler) {
      notification.action.handler();
    } else if (notification.action?.url) {
      console.log('Navigate to:', notification.action.url);
    }
    markAsRead(notification.id);
  }, [markAsRead]);

  const handleSettingChange = useCallback((key: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }));
  }, []);

  const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.dismissed).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-8 h-8 text-purple-600" />
        </motion.div>
        <span className="ml-2 text-gray-600">AI is analyzing your data...</span>
      </div>
    );
  }

  const tabOptions = [
    { value: 'all', label: 'All', icon: Bell },
    { value: 'insight', label: 'Insights', icon: Brain },
    { value: 'opportunity', label: 'Opportunities', icon: TrendingUp },
    { value: 'alert', label: 'Alerts', icon: AlertTriangle },
    { value: 'achievement', label: 'Achievements', icon: Award },
    { value: 'recommendation', label: 'Tips', icon: Lightbulb }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold">AI Notification Center</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} new
              </Badge>
            )}
            {urgentCount > 0 && (
              <Badge className="bg-red-600 text-white animate-pulse">
                {urgentCount} urgent
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            AI-powered insights and recommendations for your content strategy
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabOptions.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={activeTab === value ? 'default' : 'outline-solid'}
            onClick={() => setActiveTab(value)}
            className="flex items-center space-x-2"
            size="sm"
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filterNotifications(activeTab).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                Your AI assistant will notify you of important insights and opportunities.
              </p>
            </motion.div>
          ) : (
            filterNotifications(activeTab).map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                >
                  <Card className="border-l-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${notification.priority === 'urgent' ? 'bg-red-100' : 'bg-purple-100'}`}>
                            <IconComponent className={`w-5 h-5 ${notification.priority === 'urgent' ? 'text-red-600' : 'text-purple-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <CardTitle className="text-lg">{notification.title}</CardTitle>
                              <Badge className={getPriorityBadgeColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {notification.metadata?.confidence && (
                                <Badge variant="secondary" className="text-xs">
                                  {notification.metadata.confidence}% confidence
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                              <span>•</span>
                              <span className="capitalize">{notification.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dismissNotification(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 mb-4">{notification.message}</p>
                      
                      {/* Metadata */}
                      {notification.metadata && (
                        <div className="flex items-center space-x-4 mb-4 text-sm">
                          {notification.metadata.change && (
                            <div className="flex items-center space-x-1">
                              {notification.metadata.trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              ) : (
                                <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                              )}
                              <span className={notification.metadata.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                                {notification.metadata.change > 0 ? '+' : ''}{notification.metadata.change}
                                {notification.metadata.metric?.includes('revenue') ? '$' : '%'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Action Button */}
                      {notification.actionable && notification.action && (
                        <Button 
                          className="w-full sm:w-auto"
                          onClick={() => handleActionClick(notification)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          {notification.action.label}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            Control what AI insights and alerts you receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleSettingChange(key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

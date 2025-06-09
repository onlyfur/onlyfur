import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Shield,
  Users,
  MessageSquare,
  Flag,
  Zap,
  Brain,
  TrendingUp,
  BarChart3,
  Eye,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Sparkles,
  UserPlus,
  UserMinus,
  Settings,
  Filter,
  Search,
  MoreHorizontal,
  Ban,
  Archive,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  RefreshCw,
  Download,
  Upload,
  Calendar,
  Megaphone,
  Activity
} from 'lucide-react';
import { AnimatedLoader } from '../ui/AnimatedLoader';

interface CommunityMember {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  joinDate: Date;
  lastActivity: Date;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  role: 'member' | 'contributor' | 'moderator' | 'admin';
  stats: {
    posts: number;
    comments: number;
    likes_received: number;
    likes_given: number;
    reports: number;
    warnings: number;
  };
  ai_insights: {
    engagement_score: number;
    toxicity_risk: number;
    contribution_quality: number;
    community_fit: number;
  };
  tier: 'free' | 'premium' | 'vip';
  badges: string[];
}

interface ContentReport {
  id: string;
  type: 'harassment' | 'spam' | 'inappropriate' | 'copyright' | 'other';
  content_id: string;
  content_type: 'post' | 'comment' | 'message';
  content_preview: string;
  reported_by: string;
  reported_at: Date;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ai_analysis: {
    confidence: number;
    category: string;
    risk_level: number;
    auto_action: string;
  };
  moderator_notes?: string;
}

interface CommunityInsight {
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  recommendation?: string;
}

interface ModerationAction {
  id: string;
  type: 'warning' | 'timeout' | 'ban' | 'content_removal' | 'account_suspension';
  target_user: string;
  target_content?: string;
  reason: string;
  duration?: string;
  executed_by: string;
  executed_at: Date;
  ai_suggested: boolean;
}

export default function AICommunityManager() {
  const [activeTab, setActiveTab] = useState('overview');
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [insights, setInsights] = useState<CommunityInsight[]>([]);
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [aiModerationEnabled, setAiModerationEnabled] = useState(true);
  const [autoActionsEnabled, setAutoActionsEnabled] = useState(false);

  // Generate mock data
  useEffect(() => {
    const generateMockData = () => {
      // Mock members
      const mockMembers: CommunityMember[] = Array.from({ length: 15 }, (_, i) => ({
        id: `member-${i + 1}`,
        username: `user${i + 1}`,
        displayName: `Community Member ${i + 1}`,
        avatar: `/api/placeholder/40/40`,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)] as any,
        role: ['member', 'contributor', 'moderator'][Math.floor(Math.random() * 3)] as any,
        stats: {
          posts: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 500),
          likes_received: Math.floor(Math.random() * 1000),
          likes_given: Math.floor(Math.random() * 300),
          reports: Math.floor(Math.random() * 5),
          warnings: Math.floor(Math.random() * 3)
        },
        ai_insights: {
          engagement_score: Math.floor(Math.random() * 40) + 60,
          toxicity_risk: Math.floor(Math.random() * 30),
          contribution_quality: Math.floor(Math.random() * 40) + 60,
          community_fit: Math.floor(Math.random() * 40) + 60
        },
        tier: ['free', 'premium', 'vip'][Math.floor(Math.random() * 3)] as any,
        badges: ['active', 'helpful', 'creator'].filter(() => Math.random() > 0.5)
      }));

      // Mock reports
      const mockReports: ContentReport[] = Array.from({ length: 8 }, (_, i) => ({
        id: `report-${i + 1}`,
        type: ['harassment', 'spam', 'inappropriate', 'copyright'][Math.floor(Math.random() * 4)] as any,
        content_id: `content-${i + 1}`,
        content_type: ['post', 'comment', 'message'][Math.floor(Math.random() * 3)] as any,
        content_preview: `This is inappropriate content that has been reported by the community...`,
        reported_by: `user${Math.floor(Math.random() * 10) + 1}`,
        reported_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        status: ['pending', 'reviewing', 'resolved', 'dismissed'][Math.floor(Math.random() * 4)] as any,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        ai_analysis: {
          confidence: Math.floor(Math.random() * 30) + 70,
          category: 'Potentially harmful content',
          risk_level: Math.floor(Math.random() * 40) + 30,
          auto_action: 'Flag for review'
        },
        moderator_notes: i % 3 === 0 ? 'Reviewed and found to be valid concern' : undefined
      }));

      // Mock insights
      const mockInsights: CommunityInsight[] = [
        {
          metric: 'Active Members',
          value: 1245,
          change: 12,
          trend: 'up',
          description: 'Members active in the last 7 days',
          recommendation: 'Engagement is strong, consider hosting community events'
        },
        {
          metric: 'New Members',
          value: 89,
          change: -5,
          trend: 'down',
          description: 'New members this week',
          recommendation: 'Focus on onboarding improvements'
        },
        {
          metric: 'Content Reports',
          value: 23,
          change: 8,
          trend: 'up',
          description: 'Reports filed in the last 24 hours',
          recommendation: 'Monitor for emerging issues'
        },
        {
          metric: 'Community Health',
          value: 87,
          change: 3,
          trend: 'up',
          description: 'Overall community health score',
          recommendation: 'Community is thriving, maintain current strategies'
        }
      ];

      // Mock recent actions
      const mockActions: ModerationAction[] = Array.from({ length: 6 }, (_, i) => ({
        id: `action-${i + 1}`,
        type: ['warning', 'timeout', 'content_removal'][Math.floor(Math.random() * 3)] as any,
        target_user: `user${Math.floor(Math.random() * 10) + 1}`,
        target_content: i % 2 === 0 ? `content-${i + 1}` : undefined,
        reason: 'Violation of community guidelines',
        duration: i % 3 === 0 ? '24 hours' : undefined,
        executed_by: 'AI Moderator',
        executed_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        ai_suggested: Math.random() > 0.3
      }));

      setMembers(mockMembers);
      setReports(mockReports);
      setInsights(mockInsights);
      setActions(mockActions);
      setIsLoading(false);
    };

    setTimeout(generateMockData, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      case 'banned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <AnimatedLoader type="community" size="lg" message="Loading community data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Community Manager
            </h1>
            <p className="text-gray-600">Intelligent community moderation and insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">AI Moderation</span>
            <Switch
              checked={aiModerationEnabled}
              onCheckedChange={setAiModerationEnabled}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Actions</span>
            <Switch
              checked={autoActionsEnabled}
              onCheckedChange={setAutoActionsEnabled}
            />
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Members</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <Flag className="w-4 h-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Moderation</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-600">{insight.metric}</div>
                      {getTrendIcon(insight.trend)}
                    </div>
                    <div className="text-2xl font-bold mb-1">{insight.value}</div>
                    <div className={`text-sm flex items-center space-x-1 ${
                      insight.change > 0 ? 'text-green-600' : insight.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      <span>{insight.change > 0 ? '+' : ''}{insight.change}</span>
                      <span>vs last week</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{insight.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Moderation Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {actions.slice(0, 5).map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${action.ai_suggested ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        {action.ai_suggested ? <Brain className="w-4 h-4 text-purple-600" /> : <Shield className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{action.type.replace('_', ' ').toUpperCase()}</div>
                        <div className="text-xs text-gray-500">User: {action.target_user}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{formatTimeAgo(action.executed_at)}</div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Megaphone className="w-5 h-5" />
                  <span>Community Announcements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-sm text-blue-800">New Community Guidelines</div>
                    <div className="text-xs text-blue-600 mt-1">Updated guidelines for content posting</div>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-sm text-green-800">Community Event</div>
                    <div className="text-xs text-green-600 mt-1">Weekly art showcase starts tomorrow</div>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="contributor">Contributor</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="secondary">{filteredMembers.length} members</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <div className="space-y-4">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="font-semibold">{member.displayName}</div>
                            <Badge className={getStatusColor(member.status)}>
                              {member.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                            {member.tier === 'vip' && <Star className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <div className="text-sm text-gray-600">@{member.username}</div>
                          <div className="text-xs text-gray-500">
                            Joined {formatTimeAgo(member.joinDate)} • Last active {formatTimeAgo(member.lastActivity)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        {/* Stats */}
                        <div className="text-center">
                          <div className="text-sm font-medium">{member.stats.posts}</div>
                          <div className="text-xs text-gray-500">Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{member.stats.likes_received}</div>
                          <div className="text-xs text-gray-500">Likes</div>
                        </div>
                        
                        {/* AI Insights */}
                        <div className="text-center">
                          <div className={`text-sm font-medium ${
                            member.ai_insights.engagement_score >= 80 ? 'text-green-600' :
                            member.ai_insights.engagement_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {member.ai_insights.engagement_score}%
                          </div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(report.severity)}`}>
                          <Flag className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{report.type.toUpperCase()}</span>
                            <Badge className={getSeverityColor(report.severity)}>
                              {report.severity}
                            </Badge>
                            <Badge variant="outline">{report.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Reported by @{report.reported_by} • {formatTimeAgo(report.reported_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Review</Button>
                        <Button variant="outline" size="sm">Dismiss</Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="text-sm text-gray-700">{report.content_preview}</div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-800">AI Analysis</span>
                        <Badge className="bg-purple-100 text-purple-800">
                          {report.ai_analysis.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="text-sm text-purple-700 mb-2">{report.ai_analysis.category}</div>
                      <div className="text-sm text-purple-600">
                        Recommended action: {report.ai_analysis.auto_action}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Moderation Tab */}
        <TabsContent value="moderation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Moderation Actions</CardTitle>
                <CardDescription>Common moderation tools and actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Ban className="w-4 h-4 mr-2" />
                  Temporary Suspension
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  Remove Content
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Issue Warning
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Moderation Settings</CardTitle>
                <CardDescription>Configure automated moderation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-flag inappropriate content</div>
                    <div className="text-sm text-gray-600">Automatically flag potentially harmful content</div>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Smart spam detection</div>
                    <div className="text-sm text-gray-600">Use AI to identify and remove spam</div>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Toxicity monitoring</div>
                    <div className="text-sm text-gray-600">Monitor for toxic behavior patterns</div>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Moderation Log</CardTitle>
              <CardDescription>All moderation actions taken in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${action.ai_suggested ? 'bg-purple-100' : 'bg-gray-100'}`}>
                        {action.ai_suggested ? <Brain className="w-4 h-4 text-purple-600" /> : <Shield className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div>
                        <div className="font-medium">{action.type.replace('_', ' ').toUpperCase()}</div>
                        <div className="text-sm text-gray-600">
                          Target: {action.target_user} | Reason: {action.reason}
                        </div>
                        {action.duration && (
                          <div className="text-xs text-gray-500">Duration: {action.duration}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{action.executed_by}</div>
                      <div className="text-xs text-gray-500">{formatTimeAgo(action.executed_at)}</div>
                      {action.ai_suggested && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">AI Suggested</Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>Community Health Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
                  <div className="text-lg font-semibold mb-4">Overall Health Score</div>
                  <Progress value={87} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">
                    Your community is thriving with high engagement and low toxicity.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>What your community is talking about</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['#furryart', '#characterdesign', '#commission', '#fursuit', '#digitalart'].map((topic, index) => (
                    <div key={topic} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{topic}</Badge>
                        <span className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 500) + 100} mentions
                        </span>
                      </div>
                      <div className="text-green-600 text-sm">
                        +{Math.floor(Math.random() * 50) + 10}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <span>AI Recommendations</span>
              </CardTitle>
              <CardDescription>Suggestions to improve community engagement and health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.filter(insight => insight.recommendation).map((insight, index) => (
                  <motion.div
                    key={insight.metric}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-800 mb-1">{insight.metric}</div>
                        <div className="text-sm text-yellow-700">{insight.recommendation}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
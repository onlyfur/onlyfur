import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { creatorDashboardAPI, type ContentItem, type Subscriber, type DashboardStats } from '@/services/creatorDashboardAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  Eye,
  EyeOff,
  Users,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Settings,
  Crown,
  Star,
  Heart,
  Image as ImageIcon,
  Video,
  FileText,
  Calendar,
  BarChart3,
  Edit,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';

// Interfaces imported from creatorDashboardAPI

// Extend ContentItem to add privacyLevel and requiredTiers for dashboard UI
interface DashboardContentItem extends ContentItem {
  privacyLevel: string;
  requiredTiers: string[];
}

// Extend Subscriber to add subscriptionDate for dashboard UI
interface DashboardSubscriber extends Subscriber {
  subscriptionDate: Date;
}

const CreatorDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [content, setContent] = useState<DashboardContentItem[]>([]);
  const [subscribers, setSubscribers] = useState<DashboardSubscriber[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Creator-only access
  if (!isAuthenticated || (user?.role !== 'creator' && user?.role !== 'CREATOR')) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadCreatorData();
  }, []);

  // Patch: Map API content to DashboardContentItem with default privacyLevel/requiredTiers
  const loadCreatorData = async () => {
    try {
      setIsLoading(true);

      // Load dashboard stats
      const dashboardStats = await creatorDashboardAPI.getDashboardStats();
      setStats(dashboardStats);

      // Load creator content
      const contentResult = await creatorDashboardAPI.getCreatorContent(1, 20);
      setContent(contentResult.content.map(item => ({
        ...item,
        privacyLevel: 'public', // fallback default
        requiredTiers: []
      })));

      // Load subscribers
      const subscribersResult = await creatorDashboardAPI.getSubscribers(1, 20);
      setSubscribers(subscribersResult.subscribers.map(sub => ({
        ...sub,
        subscriptionDate: sub.subscribedAt
      })));

    } catch (error) {
      console.error('Error loading creator data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const getTierIcon = (tier: string) => {
    if (tier.includes('vip') || tier.includes('premium')) return <Crown className="w-4 h-4" />;
    if (tier.includes('pro')) return <Star className="w-4 h-4" />;
    return <Heart className="w-4 h-4" />;
  };

  const getTierColor = (tier: string) => {
    if (tier.includes('vip') || tier.includes('premium')) return 'bg-linear-to-r from-yellow-400 to-orange-500';
    if (tier.includes('pro')) return 'bg-purple-500';
    return 'bg-blue-500';
  };

  const getPrivacyIcon = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'public': return <Unlock className="w-4 h-4 text-green-500" />;
      case 'subscribers': return <Users className="w-4 h-4 text-blue-500" />;
      case 'premium': return <Star className="w-4 h-4 text-purple-500" />;
      case 'private': return <Lock className="w-4 h-4 text-red-500" />;
      default: return <Unlock className="w-4 h-4" />;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const totalEarnings = content.reduce((sum, item) => sum + item.stats.earnings, 0);
  const totalViews = content.reduce((sum, item) => sum + item.stats.views, 0);
  const totalSubscribers = subscribers.filter(s => s.isActive).length;

  const ContentUploadModal: React.FC = () => {
    const [newContent, setNewContent] = useState<DashboardContentItem>({
      id: '',
      title: '',
      description: '',
      type: 'photo',
      url: '',
      thumbnailUrl: '',
      tier: '',
      price: 0,
      status: 'published',
      createdAt: new Date(),
      stats: { views: 0, likes: 0, comments: 0, earnings: 0 },
      privacyLevel: 'public',
      requiredTiers: []
    });

    const handleUpload = () => {
      const contentItem: DashboardContentItem = {
        id: `content-${Date.now()}`,
        title: newContent.title,
        description: newContent.description,
        type: newContent.type,
        url: '',
        thumbnailUrl: '',
        tier: '',
        price: 0,
        status: 'published',
        createdAt: new Date(),
        stats: { views: 0, likes: 0, comments: 0, earnings: 0 },
        privacyLevel: newContent.privacyLevel,
        requiredTiers: newContent.requiredTiers
      };

      setContent(prev => [contentItem, ...prev]);
      setIsCreatingContent(false);
      
      toast({
        title: "Content Uploaded",
        description: "Your content has been published successfully!"
      });
    };

    const updateRequiredTiers = (privacyLevel: string) => {
      let tiers: string[] = [];
      switch (privacyLevel) {
        case 'subscribers':
          tiers = ['basic-subscriber', 'pro-subscriber', 'vip-subscriber'];
          break;
        case 'premium':
          tiers = ['pro-subscriber', 'vip-subscriber'];
          break;
        case 'private':
          tiers = ['vip-subscriber'];
          break;
        default:
          tiers = [];
      }
      setNewContent(prev => ({ ...prev, privacyLevel: privacyLevel as any, requiredTiers: tiers }));
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Content title..."
                value={newContent.title}
                onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="type">Content Type</Label>
              <Select value={newContent.type} onValueChange={(value) => setNewContent(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Text Post</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your content..."
              value={newContent.description}
              onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="privacy">Privacy Level & Subscriber Access</Label>
            <Select value={newContent.privacyLevel} onValueChange={updateRequiredTiers}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-green-500" />
                    Public - Free for everyone
                  </div>
                </SelectItem>
                <SelectItem value="subscribers">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    Subscribers - All subscription tiers
                  </div>
                </SelectItem>
                <SelectItem value="premium">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-500" />
                    Premium - Pro & VIP subscribers only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    VIP Exclusive - VIP subscribers only
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {newContent.requiredTiers.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Accessible to:</span>
                {newContent.requiredTiers.map(tier => (
                  <Badge key={tier} className={`text-xs text-white ${getTierColor(tier)}`}>
                    {tier.replace('-', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleUpload} disabled={!newContent.title || !newContent.description}>
              <Upload className="w-4 h-4 mr-2" />
              Publish Content
            </Button>
            <Button variant="outline" onClick={() => setIsCreatingContent(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your content, subscribers, and earnings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSubscribers}</div>
                <p className="text-xs text-muted-foreground">
                  +3 new this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{content.length}</div>
                <p className="text-xs text-muted-foreground">
                  {content.filter(c => c.status === 'published').length} published
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getContentTypeIcon(item.type)}
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getPrivacyIcon(item.privacyLevel)}
                          <span className="capitalize">{item.privacyLevel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.stats.views} views</div>
                      <div className="text-sm text-muted-foreground">
                        ${item.stats.earnings.toFixed(2)} earned
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {!isCreatingContent ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content Management</CardTitle>
                  <Button onClick={() => setIsCreatingContent(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Content
                  </Button>
                </div>
                <CardDescription>
                  Manage your posts and set subscriber access levels
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <ContentUploadModal />
          )}

          <div className="grid gap-4">
            {content.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {item.thumbnailUrl && (
                      <img 
                        src={item.thumbnailUrl} 
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {getContentTypeIcon(item.type)}
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getPrivacyIcon(item.privacyLevel)}
                          <Badge variant="outline-solid" className="capitalize">
                            {item.privacyLevel}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>{item.stats.views} views</span>
                        <span>{item.stats.likes} likes</span>
                        <span>{item.stats.comments} comments</span>
                        <span>${item.stats.earnings.toFixed(2)} earned</span>
                      </div>

                      {item.requiredTiers.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-3">
                          <span className="text-sm text-muted-foreground">Accessible to:</span>
                          {item.requiredTiers.map(tier => (
                            <Badge key={tier} className={`text-xs text-white ${getTierColor(tier)}`}>
                              <div className="flex items-center gap-1">
                                {getTierIcon(tier)}
                                {tier.replace('-', ' ').toUpperCase()}
                              </div>
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Management</CardTitle>
              <CardDescription>
                View and manage your subscribers by tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={subscriber.avatar} />
                        <AvatarFallback>
                          {subscriber.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h4 className="font-medium">{subscriber.displayName}</h4>
                        <p className="text-sm text-muted-foreground">@{subscriber.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className={`text-white ${getTierColor(subscriber.tier)}`}>
                        <div className="flex items-center gap-1">
                          {getTierIcon(subscriber.tier)}
                          {subscriber.tier.replace('-', ' ').toUpperCase()}
                        </div>
                      </Badge>
                      
                      <div className="text-right">
                        <div className="font-medium">${subscriber.totalSpent.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          Since {subscriber.subscriptionDate.toLocaleDateString()}
                        </div>
                      </div>

                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>
                Track your content performance and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and reporting coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creator Settings</CardTitle>
              <CardDescription>
                Configure your creator preferences and messaging restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Messaging Permissions</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose which subscriber tiers can send you messages
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="text-white bg-blue-500">
                        <Heart className="w-3 h-3 mr-1" />
                        BASIC
                      </Badge>
                      <span>Basic Subscribers</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="text-white bg-purple-500">
                        <Star className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                      <span>Pro Subscribers</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="text-white bg-linear-to-r from-yellow-400 to-orange-500">
                        <Crown className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                      <span>VIP Subscribers</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Content Defaults</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Set default privacy levels for new uploads
                </p>
                
                <Select defaultValue="subscribers">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Free for everyone</SelectItem>
                    <SelectItem value="subscribers">Subscribers - All tiers</SelectItem>
                    <SelectItem value="premium">Premium - Pro & VIP only</SelectItem>
                    <SelectItem value="private">VIP Exclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;

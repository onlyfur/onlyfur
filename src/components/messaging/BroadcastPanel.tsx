import React, { useState } from 'react';
import {
  Send,
  Users,
  Calendar,
  Image,
  File,
  BarChart3,
  Eye,
  MessageSquare,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { BroadcastMessage, MessageAttachment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const BroadcastPanel: React.FC = () => {
  const { user } = useAuth();
  const { broadcasts, createBroadcast, scheduleBroadcast } = useMessaging();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(['all']);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  // Mock recipient groups
  const recipientGroups = [
    { id: 'all', name: 'All Subscribers', count: 1247, tier: 'all' },
    { id: 'basic', name: 'Basic Tier', count: 456, tier: 'basic' },
    { id: 'premium', name: 'Premium Tier', count: 389, tier: 'premium' },
    { id: 'vip', name: 'VIP Tier', count: 102, tier: 'vip' },
    { id: 'active', name: 'Active This Week', count: 823, tier: 'all' },
    { id: 'new', name: 'New Subscribers', count: 67, tier: 'all' },
  ];

  const handleSendBroadcast = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide both title and content for your broadcast.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const recipients = selectedRecipients.includes('all') 
        ? ['all-subscribers'] 
        : selectedRecipients;

      const broadcast = await createBroadcast(title, content, recipients, attachments);

      if (scheduledDate && scheduledTime) {
        const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
        await scheduleBroadcast(broadcast.id, scheduledFor);
        
        toast({
          title: 'Broadcast scheduled',
          description: `Your broadcast will be sent on ${scheduledFor.toLocaleDateString()} at ${scheduledFor.toLocaleTimeString()}.`,
        });
      } else {
        toast({
          title: 'Broadcast sent',
          description: 'Your message has been sent to all selected recipients.',
        });
      }

      // Reset form
      setTitle('');
      setContent('');
      setAttachments([]);
      setSelectedRecipients(['all']);
      setScheduledDate('');
      setScheduledTime('');
      setShowComposer(false);
    } catch (error) {
      toast({
        title: 'Failed to send broadcast',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalRecipients = () => {
    if (selectedRecipients.includes('all')) {
      return recipientGroups.find(g => g.id === 'all')?.count || 0;
    }
    return selectedRecipients.reduce((total, id) => {
      const group = recipientGroups.find(g => g.id === id);
      return total + (group?.count || 0);
    }, 0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'sending':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'draft': 'secondary',
      'scheduled': 'outline',
      'sending': 'default',
      'sent': 'default',
      'failed': 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Broadcast Messages</h1>
          <p className="text-muted-foreground">
            Send messages to your subscribers and track engagement
          </p>
        </div>
        <Dialog open={showComposer} onOpenChange={setShowComposer}>
          <DialogTrigger asChild>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              New Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Broadcast Message</DialogTitle>
              <DialogDescription>
                Send a message to your subscribers with optional scheduling
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Exclusive Behind the Scenes Update"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  placeholder="Write your broadcast message..."
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Recipients */}
              <div className="space-y-3">
                <Label>Recipients ({getTotalRecipients()} subscribers)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {recipientGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={group.id}
                        checked={selectedRecipients.includes(group.id)}
                        onCheckedChange={(checked) => {
                          if (group.id === 'all') {
                            setSelectedRecipients(checked ? ['all'] : []);
                          } else {
                            setSelectedRecipients(prev => {
                              const filtered = prev.filter(id => id !== 'all' && id !== group.id);
                              return checked ? [...filtered, group.id] : filtered;
                            });
                          }
                        }}
                        disabled={group.id !== 'all' && selectedRecipients.includes('all')}
                      />
                      <Label htmlFor={group.id} className="text-sm cursor-pointer">
                        {group.name} ({group.count})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-3">
                <Label>Schedule (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowComposer(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendBroadcast}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Sending...'
                  ) : scheduledDate && scheduledTime ? (
                    'Schedule Broadcast'
                  ) : (
                    'Send Now'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="broadcasts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="broadcasts">Recent Broadcasts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Broadcasts List */}
        <TabsContent value="broadcasts">
          {broadcasts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Broadcasts Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start engaging with your subscribers by sending your first broadcast message.
                </p>
                <Button onClick={() => setShowComposer(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  Create First Broadcast
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {broadcasts.map((broadcast) => (
                <Card key={broadcast.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(broadcast.status)}
                          <h3 className="font-medium">{broadcast.title}</h3>
                          {getStatusBadge(broadcast.status)}
                        </div>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {broadcast.content}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{broadcast.analytics.totalRecipients} recipients</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{broadcast.analytics.read} read</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{broadcast.analytics.engagement.replies} replies</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{broadcast.analytics.engagement.reactions} reactions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(broadcast.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        {broadcast.status === 'sent' && (
                          <div className="text-sm">
                            <div className="text-green-600 font-medium">
                              {((broadcast.analytics.read / broadcast.analytics.totalRecipients) * 100).toFixed(1)}% read rate
                            </div>
                            <Progress 
                              value={(broadcast.analytics.read / broadcast.analytics.totalRecipients) * 100} 
                              className="w-24 mt-1"
                            />
                          </div>
                        )}
                        
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Broadcasts</p>
                    <p className="text-2xl font-bold">{broadcasts.length}</p>
                  </div>
                  <Send className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Read Rate</p>
                    <p className="text-2xl font-bold">68.4%</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                    <p className="text-2xl font-bold">12.4K</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
              <CardDescription>
                Performance metrics for your broadcast messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">2.1K</p>
                    <p className="text-sm text-muted-foreground">Messages Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">1.4K</p>
                    <p className="text-sm text-muted-foreground">Messages Read</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">342</p>
                    <p className="text-sm text-muted-foreground">Replies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">567</p>
                    <p className="text-sm text-muted-foreground">Reactions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'New Content Alert',
                description: 'Notify subscribers about new content uploads',
                template: 'Hey {name}! I just uploaded new exclusive content that I think you\'ll love. Check it out now! 🎉',
              },
              {
                title: 'Thank You Message',
                description: 'Express gratitude to your supporters',
                template: 'Thank you so much for your continued support, {name}! Your subscription means the world to me. ❤️',
              },
              {
                title: 'Live Stream Announcement',
                description: 'Announce upcoming live streams',
                template: 'Going live in 30 minutes! Join me for an exclusive Q&A session. Don\'t miss it! 🔴',
              },
              {
                title: 'Special Offer',
                description: 'Promote special deals or offers',
                template: 'Limited time offer! Upgrade to VIP tier and get 20% off this month. Use code VIP20 📢',
              },
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="bg-muted p-3 rounded text-sm italic mb-3">
                    {template.template}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BroadcastPanel;
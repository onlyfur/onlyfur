import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  MessageCircle, 
  Settings, 
  Monitor,
  Copy,
  Eye,
  Heart,
  Calendar,
  Crown,
  Star,
  Zap,
  BarChart3,
  StreamingIcon,
  Play,
  Square,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StreamData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: 'scheduled' | 'live' | 'ended';
  viewerCount: number;
  streamKey: string;
  rtmpUrl: string;
  playbackUrl: string;
  scheduledAt?: string;
  startedAt?: string;
  isPrivate: boolean;
  requiresSubscription: boolean;
  minTierRequired?: 'basic' | 'pro' | 'vip';
}

const LiveStreamingStudio: React.FC = () => {
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [currentStream, setCurrentStream] = useState<StreamData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamHealth, setStreamHealth] = useState<'good' | 'warning' | 'poor'>('good');

  // Stream creation form state
  const [newStream, setNewStream] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    isPrivate: false,
    requiresSubscription: false,
    minTierRequired: 'basic' as 'basic' | 'pro' | 'vip',
    scheduledAt: ''
  });

  // Chat and viewer management
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [viewers, setViewers] = useState<any[]>([]);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await fetch('/api/streaming-v2/my-streams', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStreams(data.streams);
        const activeStream = data.streams.find((s: StreamData) => s.status === 'live');
        if (activeStream) {
          setCurrentStream(activeStream);
          setIsLive(true);
          setViewerCount(activeStream.viewerCount);
        }
      }
    } catch (error) {
      console.error('Failed to fetch streams:', error);
      toast.error('Failed to load streams');
    }
  };

  const createStream = async () => {
    if (!newStream.title || !newStream.category) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/streaming-v2/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newStream)
      });

      const data = await response.json();
      if (data.success) {
        setCurrentStream(data.stream);
        setStreams(prev => [data.stream, ...prev]);
        toast.success('Stream created successfully!');
        // Reset form
        setNewStream({
          title: '',
          description: '',
          category: '',
          tags: [],
          isPrivate: false,
          requiresSubscription: false,
          minTierRequired: 'basic',
          scheduledAt: ''
        });
      } else {
        toast.error(data.message || 'Failed to create stream');
      }
    } catch (error) {
      console.error('Failed to create stream:', error);
      toast.error('Failed to create stream');
    } finally {
      setIsCreating(false);
    }
  };

  const startStream = async () => {
    if (!currentStream) return;

    setIsLive(true);
    toast.success('Stream started! You are now live!');
    
    // In a real implementation, this would start the actual streaming process
    // For now, we'll simulate it
    setViewerCount(1);
  };

  const endStream = async () => {
    if (!currentStream) return;

    try {
      const response = await fetch(`/api/streaming-v2/stream/${currentStream.id}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setIsLive(false);
        setCurrentStream(null);
        setViewerCount(0);
        toast.success('Stream ended successfully');
        fetchStreams();
      }
    } catch (error) {
      console.error('Failed to end stream:', error);
      toast.error('Failed to end stream');
    }
  };

  const copyStreamKey = () => {
    if (currentStream?.streamKey) {
      navigator.clipboard.writeText(currentStream.streamKey);
      toast.success('Stream key copied to clipboard');
    }
  };

  const copyRtmpUrl = () => {
    if (currentStream?.rtmpUrl) {
      navigator.clipboard.writeText(currentStream.rtmpUrl);
      toast.success('RTMP URL copied to clipboard');
    }
  };

  const addTag = (tag: string) => {
    if (tag && !newStream.tags.includes(tag) && newStream.tags.length < 10) {
      setNewStream(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewStream(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className=\"max-w-7xl mx-auto p-6 space-y-6\">\n      <div className=\"space-y-2\">\n        <h1 className=\"text-3xl font-bold flex items-center gap-2\">\n          <Video className=\"w-8 h-8\" />\n          Live Streaming Studio\n        </h1>\n        <p className=\"text-muted-foreground\">\n          Create and manage your live streams with advanced features and analytics.\n        </p>\n      </div>\n\n      <Tabs defaultValue=\"studio\" className=\"space-y-6\">\n        <TabsList className=\"grid w-full grid-cols-4\">\n          <TabsTrigger value=\"studio\">Studio</TabsTrigger>\n          <TabsTrigger value=\"streams\">My Streams</TabsTrigger>\n          <TabsTrigger value=\"analytics\">Analytics</TabsTrigger>\n          <TabsTrigger value=\"settings\">Settings</TabsTrigger>\n        </TabsList>\n\n        <TabsContent value=\"studio\" className=\"space-y-6\">\n          {currentStream ? (\n            <div className=\"grid gap-6 lg:grid-cols-3\">\n              {/* Main Stream Control */}\n              <div className=\"lg:col-span-2 space-y-6\">\n                <Card>\n                  <CardHeader>\n                    <div className=\"flex items-center justify-between\">\n                      <div>\n                        <CardTitle className=\"flex items-center gap-2\">\n                          {isLive ? (\n                            <Badge className=\"bg-red-500 text-white animate-pulse\">🔴 LIVE</Badge>\n                          ) : (\n                            <Badge variant=\"outline\">Offline</Badge>\n                          )}\n                          {currentStream.title}\n                        </CardTitle>\n                        <CardDescription>\n                          {currentStream.description}\n                        </CardDescription>\n                      </div>\n                      <div className=\"flex items-center gap-2\">\n                        <Eye className=\"w-4 h-4\" />\n                        <span className=\"font-medium\">{viewerCount}</span>\n                      </div>\n                    </div>\n                  </CardHeader>\n                  <CardContent className=\"space-y-4\">\n                    {/* Stream Preview */}\n                    <div className=\"aspect-video bg-black rounded-lg flex items-center justify-center relative\">\n                      {isLive ? (\n                        <div className=\"text-white text-center\">\n                          <Video className=\"w-16 h-16 mx-auto mb-4\" />\n                          <p className=\"text-lg font-medium\">Live Stream Active</p>\n                          <p className=\"text-sm opacity-75\">Broadcasting to {viewerCount} viewers</p>\n                        </div>\n                      ) : (\n                        <div className=\"text-gray-400 text-center\">\n                          <VideoOff className=\"w-16 h-16 mx-auto mb-4\" />\n                          <p className=\"text-lg font-medium\">Stream Offline</p>\n                          <p className=\"text-sm opacity-75\">Click Start Stream to go live</p>\n                        </div>\n                      )}\n                      \n                      {/* Stream Health Indicator */}\n                      <div className=\"absolute top-4 right-4\">\n                        <Badge \n                          className={cn(\n                            \"text-white\",\n                            streamHealth === 'good' && \"bg-green-500\",\n                            streamHealth === 'warning' && \"bg-yellow-500\",\n                            streamHealth === 'poor' && \"bg-red-500\"\n                          )}\n                        >\n                          {streamHealth === 'good' && <CheckCircle className=\"w-3 h-3 mr-1\" />}\n                          {streamHealth === 'warning' && <AlertCircle className=\"w-3 h-3 mr-1\" />}\n                          {streamHealth === 'poor' && <AlertCircle className=\"w-3 h-3 mr-1\" />}\n                          {streamHealth.charAt(0).toUpperCase() + streamHealth.slice(1)}\n                        </Badge>\n                      </div>\n                    </div>\n\n                    {/* Stream Controls */}\n                    <div className=\"flex items-center justify-center gap-4\">\n                      {!isLive ? (\n                        <Button onClick={startStream} size=\"lg\" className=\"bg-red-500 hover:bg-red-600\">\n                          <Play className=\"w-4 h-4 mr-2\" />\n                          Start Stream\n                        </Button>\n                      ) : (\n                        <AlertDialog>\n                          <AlertDialogTrigger asChild>\n                            <Button variant=\"destructive\" size=\"lg\">\n                              <Square className=\"w-4 h-4 mr-2\" />\n                              End Stream\n                            </Button>\n                          </AlertDialogTrigger>\n                          <AlertDialogContent>\n                            <AlertDialogHeader>\n                              <AlertDialogTitle>End Live Stream?</AlertDialogTitle>\n                              <AlertDialogDescription>\n                                This will end your live stream and disconnect all viewers. This action cannot be undone.\n                              </AlertDialogDescription>\n                            </AlertDialogHeader>\n                            <AlertDialogFooter>\n                              <AlertDialogCancel>Cancel</AlertDialogCancel>\n                              <AlertDialogAction onClick={endStream} className=\"bg-red-500 hover:bg-red-600\">\n                                End Stream\n                              </AlertDialogAction>\n                            </AlertDialogFooter>\n                          </AlertDialogContent>\n                        </AlertDialog>\n                      )}\n                    </div>\n\n                    {/* Stream Information */}\n                    <div className=\"grid gap-4 md:grid-cols-2\">\n                      <div className=\"space-y-2\">\n                        <Label>Stream Key</Label>\n                        <div className=\"flex gap-2\">\n                          <Input \n                            value={currentStream.streamKey.substring(0, 20) + '...'} \n                            readOnly \n                            className=\"font-mono text-xs\"\n                          />\n                          <Button variant=\"outline\" size=\"sm\" onClick={copyStreamKey}>\n                            <Copy className=\"w-4 h-4\" />\n                          </Button>\n                        </div>\n                      </div>\n                      <div className=\"space-y-2\">\n                        <Label>RTMP URL</Label>\n                        <div className=\"flex gap-2\">\n                          <Input \n                            value={currentStream.rtmpUrl} \n                            readOnly \n                            className=\"font-mono text-xs\"\n                          />\n                          <Button variant=\"outline\" size=\"sm\" onClick={copyRtmpUrl}>\n                            <Copy className=\"w-4 h-4\" />\n                          </Button>\n                        </div>\n                      </div>\n                    </div>\n                  </CardContent>\n                </Card>\n              </div>\n\n              {/* Chat and Viewers Sidebar */}\n              <div className=\"space-y-6\">\n                <Card>\n                  <CardHeader>\n                    <CardTitle className=\"flex items-center gap-2\">\n                      <MessageCircle className=\"w-5 h-5\" />\n                      Live Chat\n                    </CardTitle>\n                  </CardHeader>\n                  <CardContent>\n                    <div className=\"h-64 border rounded p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900\">\n                      {chatMessages.length === 0 ? (\n                        <p className=\"text-center text-muted-foreground text-sm mt-20\">\n                          No messages yet. Start your stream to see live chat!\n                        </p>\n                      ) : (\n                        <div className=\"space-y-2\">\n                          {chatMessages.map((message, index) => (\n                            <div key={index} className=\"text-sm\">\n                              <span className=\"font-medium text-blue-600\">{message.username}:</span>\n                              <span className=\"ml-1\">{message.content}</span>\n                            </div>\n                          ))}\n                        </div>\n                      )}\n                    </div>\n                  </CardContent>\n                </Card>\n\n                <Card>\n                  <CardHeader>\n                    <CardTitle className=\"flex items-center gap-2\">\n                      <Users className=\"w-5 h-5\" />\n                      Viewers ({viewerCount})\n                    </CardTitle>\n                  </CardHeader>\n                  <CardContent>\n                    <div className=\"space-y-2\">\n                      {viewers.length === 0 ? (\n                        <p className=\"text-center text-muted-foreground text-sm\">\n                          No viewers yet\n                        </p>\n                      ) : (\n                        viewers.map((viewer, index) => (\n                          <div key={index} className=\"flex items-center justify-between text-sm\">\n                            <span>{viewer.username}</span>\n                            <Badge variant=\"outline\" className=\"text-xs\">\n                              {viewer.tier}\n                            </Badge>\n                          </div>\n                        ))\n                      )}\n                    </div>\n                  </CardContent>\n                </Card>\n              </div>\n            </div>\n          ) : (\n            // Stream Creation Form\n            <Card>\n              <CardHeader>\n                <CardTitle>Create New Stream</CardTitle>\n                <CardDescription>\n                  Set up your live stream with custom settings and audience targeting.\n                </CardDescription>\n              </CardHeader>\n              <CardContent className=\"space-y-6\">\n                <div className=\"grid gap-4 md:grid-cols-2\">\n                  <div className=\"space-y-2\">\n                    <Label htmlFor=\"title\">Stream Title *</Label>\n                    <Input\n                      id=\"title\"\n                      value={newStream.title}\n                      onChange={(e) => setNewStream(prev => ({ ...prev, title: e.target.value }))}\n                      placeholder=\"Enter stream title\"\n                    />\n                  </div>\n                  <div className=\"space-y-2\">\n                    <Label htmlFor=\"category\">Category *</Label>\n                    <Select value={newStream.category} onValueChange={(value) => setNewStream(prev => ({ ...prev, category: value }))}>\n                      <SelectTrigger>\n                        <SelectValue placeholder=\"Select category\" />\n                      </SelectTrigger>\n                      <SelectContent>\n                        <SelectItem value=\"art\">Art & Design</SelectItem>\n                        <SelectItem value=\"gaming\">Gaming</SelectItem>\n                        <SelectItem value=\"music\">Music</SelectItem>\n                        <SelectItem value=\"tutorial\">Tutorial</SelectItem>\n                        <SelectItem value=\"chat\">Just Chatting</SelectItem>\n                        <SelectItem value=\"other\">Other</SelectItem>\n                      </SelectContent>\n                    </Select>\n                  </div>\n                </div>\n\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"description\">Description</Label>\n                  <Textarea\n                    id=\"description\"\n                    value={newStream.description}\n                    onChange={(e) => setNewStream(prev => ({ ...prev, description: e.target.value }))}\n                    placeholder=\"Describe what your stream will be about\"\n                    rows={3}\n                  />\n                </div>\n\n                <div className=\"space-y-3\">\n                  <Label>Tags</Label>\n                  <div className=\"flex flex-wrap gap-2 mb-2\">\n                    {newStream.tags.map((tag, index) => (\n                      <Badge key={index} variant=\"secondary\" className=\"cursor-pointer\" onClick={() => removeTag(tag)}>\n                        {tag} ×\n                      </Badge>\n                    ))}\n                  </div>\n                  <Input\n                    placeholder=\"Add tags (press Enter)\"\n                    onKeyPress={(e) => {\n                      if (e.key === 'Enter') {\n                        addTag(e.currentTarget.value.trim());\n                        e.currentTarget.value = '';\n                      }\n                    }}\n                  />\n                </div>\n\n                <div className=\"grid gap-4 md:grid-cols-2\">\n                  <div className=\"space-y-4\">\n                    <div className=\"flex items-center justify-between\">\n                      <div className=\"space-y-0.5\">\n                        <Label>Private Stream</Label>\n                        <p className=\"text-xs text-muted-foreground\">Only invited users can view</p>\n                      </div>\n                      <Switch \n                        checked={newStream.isPrivate}\n                        onCheckedChange={(checked) => setNewStream(prev => ({ ...prev, isPrivate: checked }))}\n                      />\n                    </div>\n                    \n                    <div className=\"flex items-center justify-between\">\n                      <div className=\"space-y-0.5\">\n                        <Label>Require Subscription</Label>\n                        <p className=\"text-xs text-muted-foreground\">Only subscribers can view</p>\n                      </div>\n                      <Switch \n                        checked={newStream.requiresSubscription}\n                        onCheckedChange={(checked) => setNewStream(prev => ({ ...prev, requiresSubscription: checked }))}\n                      />\n                    </div>\n                  </div>\n\n                  {newStream.requiresSubscription && (\n                    <div className=\"space-y-2\">\n                      <Label>Minimum Tier Required</Label>\n                      <Select value={newStream.minTierRequired} onValueChange={(value: 'basic' | 'pro' | 'vip') => setNewStream(prev => ({ ...prev, minTierRequired: value }))}>\n                        <SelectTrigger>\n                          <SelectValue />\n                        </SelectTrigger>\n                        <SelectContent>\n                          <SelectItem value=\"basic\">\n                            <div className=\"flex items-center gap-2\">\n                              <Heart className=\"w-4 h-4 text-blue-500\" />\n                              Basic ($4.99)\n                            </div>\n                          </SelectItem>\n                          <SelectItem value=\"pro\">\n                            <div className=\"flex items-center gap-2\">\n                              <Star className=\"w-4 h-4 text-purple-500\" />\n                              Pro ($9.99)\n                            </div>\n                          </SelectItem>\n                          <SelectItem value=\"vip\">\n                            <div className=\"flex items-center gap-2\">\n                              <Crown className=\"w-4 h-4 text-yellow-500\" />\n                              VIP ($19.99)\n                            </div>\n                          </SelectItem>\n                        </SelectContent>\n                      </Select>\n                    </div>\n                  )}\n                </div>\n\n                <div className=\"space-y-2\">\n                  <Label htmlFor=\"scheduledAt\">Schedule Stream (Optional)</Label>\n                  <Input\n                    id=\"scheduledAt\"\n                    type=\"datetime-local\"\n                    value={newStream.scheduledAt}\n                    onChange={(e) => setNewStream(prev => ({ ...prev, scheduledAt: e.target.value }))}\n                  />\n                </div>\n\n                <Button onClick={createStream} disabled={isCreating} className=\"w-full\">\n                  {isCreating ? 'Creating Stream...' : 'Create Stream'}\n                </Button>\n              </CardContent>\n            </Card>\n          )}\n        </TabsContent>\n\n        <TabsContent value=\"streams\" className=\"space-y-6\">\n          <Card>\n            <CardHeader>\n              <CardTitle>Stream History</CardTitle>\n              <CardDescription>\n                View and manage all your past and scheduled streams.\n              </CardDescription>\n            </CardHeader>\n            <CardContent>\n              <div className=\"space-y-4\">\n                {streams.length === 0 ? (\n                  <div className=\"text-center py-8\">\n                    <Video className=\"w-12 h-12 mx-auto mb-4 text-muted-foreground\" />\n                    <h3 className=\"text-lg font-medium mb-2\">No streams yet</h3>\n                    <p className=\"text-muted-foreground mb-4\">Create your first stream to get started!</p>\n                    <Button>Create New Stream</Button>\n                  </div>\n                ) : (\n                  streams.map((stream) => (\n                    <div key={stream.id} className=\"border rounded-lg p-4\">\n                      <div className=\"flex items-center justify-between\">\n                        <div>\n                          <div className=\"flex items-center gap-2 mb-2\">\n                            <h3 className=\"font-medium\">{stream.title}</h3>\n                            <Badge \n                              className={cn(\n                                stream.status === 'live' && \"bg-red-500 text-white animate-pulse\",\n                                stream.status === 'scheduled' && \"bg-blue-500 text-white\",\n                                stream.status === 'ended' && \"bg-gray-500 text-white\"\n                              )}\n                            >\n                              {stream.status === 'live' && '🔴 LIVE'}\n                              {stream.status === 'scheduled' && '📅 Scheduled'}\n                              {stream.status === 'ended' && '✅ Ended'}\n                            </Badge>\n                          </div>\n                          <p className=\"text-sm text-muted-foreground mb-2\">{stream.description}</p>\n                          <div className=\"flex items-center gap-4 text-xs text-muted-foreground\">\n                            <span className=\"flex items-center gap-1\">\n                              <Eye className=\"w-3 h-3\" /> {stream.viewerCount} viewers\n                            </span>\n                            <span>Category: {stream.category}</span>\n                            {stream.scheduledAt && (\n                              <span className=\"flex items-center gap-1\">\n                                <Calendar className=\"w-3 h-3\" /> \n                                {new Date(stream.scheduledAt).toLocaleDateString()}\n                              </span>\n                            )}\n                          </div>\n                        </div>\n                        <div className=\"flex items-center gap-2\">\n                          {stream.status === 'live' && (\n                            <Button \n                              variant=\"outline\" \n                              size=\"sm\"\n                              onClick={() => setCurrentStream(stream)}\n                            >\n                              <Monitor className=\"w-4 h-4 mr-2\" />\n                              Monitor\n                            </Button>\n                          )}\n                          <Button variant=\"outline\" size=\"sm\">\n                            <BarChart3 className=\"w-4 h-4 mr-2\" />\n                            Analytics\n                          </Button>\n                        </div>\n                      </div>\n                    </div>\n                  ))\n                )}\n              </div>\n            </CardContent>\n          </Card>\n        </TabsContent>\n\n        <TabsContent value=\"analytics\" className=\"space-y-6\">\n          <div className=\"grid gap-6 md:grid-cols-2 lg:grid-cols-4\">\n            <Card>\n              <CardContent className=\"p-6\">\n                <div className=\"flex items-center justify-between\">\n                  <div>\n                    <p className=\"text-sm font-medium text-muted-foreground\">Total Streams</p>\n                    <p className=\"text-2xl font-bold\">{streams.length}</p>\n                  </div>\n                  <Video className=\"w-8 h-8 text-muted-foreground\" />\n                </div>\n              </CardContent>\n            </Card>\n            \n            <Card>\n              <CardContent className=\"p-6\">\n                <div className=\"flex items-center justify-between\">\n                  <div>\n                    <p className=\"text-sm font-medium text-muted-foreground\">Total Views</p>\n                    <p className=\"text-2xl font-bold\">{streams.reduce((sum, s) => sum + s.viewerCount, 0)}</p>\n                  </div>\n                  <Eye className=\"w-8 h-8 text-muted-foreground\" />\n                </div>\n              </CardContent>\n            </Card>\n            \n            <Card>\n              <CardContent className=\"p-6\">\n                <div className=\"flex items-center justify-between\">\n                  <div>\n                    <p className=\"text-sm font-medium text-muted-foreground\">Avg. Viewers</p>\n                    <p className=\"text-2xl font-bold\">\n                      {streams.length > 0 ? Math.round(streams.reduce((sum, s) => sum + s.viewerCount, 0) / streams.length) : 0}\n                    </p>\n                  </div>\n                  <Users className=\"w-8 h-8 text-muted-foreground\" />\n                </div>\n              </CardContent>\n            </Card>\n            \n            <Card>\n              <CardContent className=\"p-6\">\n                <div className=\"flex items-center justify-between\">\n                  <div>\n                    <p className=\"text-sm font-medium text-muted-foreground\">Live Streams</p>\n                    <p className=\"text-2xl font-bold\">{streams.filter(s => s.status === 'live').length}</p>\n                  </div>\n                  <Zap className=\"w-8 h-8 text-red-500\" />\n                </div>\n              </CardContent>\n            </Card>\n          </div>\n\n          <Card>\n            <CardHeader>\n              <CardTitle>Stream Performance</CardTitle>\n              <CardDescription>Detailed analytics for your streaming activity</CardDescription>\n            </CardHeader>\n            <CardContent>\n              <div className=\"text-center py-8 text-muted-foreground\">\n                <BarChart3 className=\"w-16 h-16 mx-auto mb-4\" />\n                <p>Detailed analytics coming soon!</p>\n                <p className=\"text-sm\">Track viewer engagement, peak times, and revenue metrics.</p>\n              </div>\n            </CardContent>\n          </Card>\n        </TabsContent>\n\n        <TabsContent value=\"settings\" className=\"space-y-6\">\n          <Card>\n            <CardHeader>\n              <CardTitle>Stream Settings</CardTitle>\n              <CardDescription>Configure your streaming preferences and default settings</CardDescription>\n            </CardHeader>\n            <CardContent className=\"space-y-6\">\n              <div className=\"space-y-4\">\n                <div className=\"flex items-center justify-between\">\n                  <div className=\"space-y-0.5\">\n                    <Label>Auto-save stream recordings</Label>\n                    <p className=\"text-xs text-muted-foreground\">Automatically save recordings for later viewing</p>\n                  </div>\n                  <Switch />\n                </div>\n                \n                <div className=\"flex items-center justify-between\">\n                  <div className=\"space-y-0.5\">\n                    <Label>Enable chat moderation</Label>\n                    <p className=\"text-xs text-muted-foreground\">Automatically moderate inappropriate messages</p>\n                  </div>\n                  <Switch defaultChecked />\n                </div>\n                \n                <div className=\"flex items-center justify-between\">\n                  <div className=\"space-y-0.5\">\n                    <Label>Send notifications for new followers</Label>\n                    <p className=\"text-xs text-muted-foreground\">Show alerts when someone follows during stream</p>\n                  </div>\n                  <Switch defaultChecked />\n                </div>\n                \n                <div className=\"flex items-center justify-between\">\n                  <div className=\"space-y-0.5\">\n                    <Label>Allow viewer tips during stream</Label>\n                    <p className=\"text-xs text-muted-foreground\">Enable tip notifications and alerts</p>\n                  </div>\n                  <Switch defaultChecked />\n                </div>\n              </div>\n            </CardContent>\n          </Card>\n        </TabsContent>\n      </Tabs>\n    </div>\n  );\n};\n\nexport default LiveStreamingStudio;\n"

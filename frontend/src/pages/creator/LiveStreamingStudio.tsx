import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Video, 
  VideoOff,
  Play,
  Square,
  Pause,
  Settings,
  Users,
  MessageCircle,
  Eye,
  Heart,
  Share2,
  Copy,
  CheckCircle,
  AlertCircle,
  Signal,
  Wifi,
  Monitor,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Maximize,
  MoreHorizontal,
  Clock,
  Calendar,
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Stream {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  status: 'offline' | 'live' | 'scheduled';
  streamKey: string;
  rtmpUrl: string;
  createdAt: Date;
  scheduledAt?: Date;
  tags: string[];
  isPrivate: boolean;
  allowChat: boolean;
  allowDonations: boolean;
  maxViewers?: number;
}

interface ChatMessage {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  isHighlighted?: boolean;
  donation?: {
    amount: number;
    currency: string;
  };
}

interface StreamAnalytics {
  currentViewers: number;
  peakViewers: number;
  totalViews: number;
  averageWatchTime: number;
  chatMessages: number;
  likes: number;
  donations: number;
  revenue: number;
}

const LiveStreamingStudio: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [streamHealth, setStreamHealth] = useState<'good' | 'warning' | 'poor'>('good');
  const [analytics, setAnalytics] = useState<StreamAnalytics | null>(null);
  
  // Stream Creation Form
  const [streamForm, setStreamForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    isPrivate: false,
    allowChat: true,
    allowDonations: true,
    scheduledAt: ''
  });

  // Device Settings
  const [deviceSettings, setDeviceSettings] = useState({
    camera: true,
    microphone: true,
    cameraDevice: 'default',
    microphoneDevice: 'default',
    resolution: '1080p',
    framerate: '60fps',
    bitrate: 'auto'
  });

  useEffect(() => {
    fetchStreams();
    initializeWebRTC();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        setViewerCount(prev => Math.max(0, prev + Math.floor(Math.random() * 10) - 4));
        simulateChatMessage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const fetchStreams = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/streaming/streams', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStreams(data.streams);
        if (data.streams.length > 0) {
          setCurrentStream(data.streams[0]);
        }
      } else {
        // Generate mock data for demo
        generateMockStreams();
      }
    } catch (error) {
      console.error('Failed to fetch streams:', error);
      generateMockStreams();
    } finally {
      setLoading(false);
    }
  };

  const generateMockStreams = () => {
    const mockStreams: Stream[] = [
      {
        id: '1',
        title: 'Digital Art Creation Session',
        description: 'Creating a new fantasy character design live!',
        category: 'Art & Design',
        thumbnail: '/api/placeholder/300/200',
        status: 'offline',
        streamKey: 'sk_live_1234567890abcdef',
        rtmpUrl: 'rtmp://live.onlyfur.net/live',
        createdAt: new Date(),
        tags: ['digital art', 'character design', 'tutorial'],
        isPrivate: false,
        allowChat: true,
        allowDonations: true
      }
    ];
    setStreams(mockStreams);
    setCurrentStream(mockStreams[0]);
  };

  const initializeWebRTC = async () => {
    try {
      // Initialize WebRTC for streaming
      // This would typically set up camera and microphone access
      console.log('WebRTC initialized');
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      toast.error('Failed to access camera/microphone');
    }
  };

  const createStream = async () => {
    if (!streamForm.title.trim()) {
      toast.error('Please enter a stream title');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/streaming/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(streamForm)
      });

      const data = await response.json();
      if (data.success) {
        setStreams(prev => [data.stream, ...prev]);
        setCurrentStream(data.stream);
        setStreamForm({
          title: '',
          description: '',
          category: '',
          tags: '',
          isPrivate: false,
          allowChat: true,
          allowDonations: true,
          scheduledAt: ''
        });
        toast.success('Stream created successfully!');
      }
    } catch (error) {
      console.error('Failed to create stream:', error);
      toast.error('Failed to create stream');
    } finally {
      setLoading(false);
    }
  };

  const startStream = async () => {
    if (!currentStream) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/streaming/${currentStream.id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setIsLive(true);
        setViewerCount(1);
        setStreamHealth('good');
        generateMockAnalytics();
        toast.success('Stream started successfully!');
      }
    } catch (error) {
      console.error('Failed to start stream:', error);
      // Simulate start for demo
      setIsLive(true);
      setViewerCount(1);
      setStreamHealth('good');
      generateMockAnalytics();
      toast.success('Stream started! (Demo mode)');
    } finally {
      setLoading(false);
    }
  };

  const endStream = async () => {
    if (!currentStream) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/streaming/${currentStream.id}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success || true) { // Allow demo mode
        setIsLive(false);
        setViewerCount(0);
        setChatMessages([]);
        toast.success('Stream ended successfully!');
      }
    } catch (error) {
      console.error('Failed to end stream:', error);
      setIsLive(false);
      setViewerCount(0);
      setChatMessages([]);
      toast.success('Stream ended!');
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    setAnalytics({
      currentViewers: 1,
      peakViewers: 47,
      totalViews: 156,
      averageWatchTime: 8.5,
      chatMessages: 23,
      likes: 15,
      donations: 3,
      revenue: 25.50
    });
  };

  const simulateChatMessage = () => {
    const mockMessages = [
      "Amazing artwork! 🎨",
      "Love your style!",
      "Can you show the brushes you're using?",
      "This is so cool! Keep it up!",
      "Tutorial please! 🙏",
      "Your technique is incredible",
      "New subscriber here! 👋"
    ];

    const usernames = ['ArtFan123', 'DigitalDreamer', 'CreativeViewer', 'ArtLover99', 'SketchMaster'];
    
    if (Math.random() > 0.7) { // 30% chance to add message
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: usernames[Math.floor(Math.random() * usernames.length)],
        content: mockMessages[Math.floor(Math.random() * mockMessages.length)],
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev.slice(-9), newMessage]); // Keep last 10 messages
    }
  };

  const copyStreamKey = () => {
    if (currentStream) {
      navigator.clipboard.writeText(currentStream.streamKey);
      toast.success('Stream key copied to clipboard!');
    }
  };

  const copyRtmpUrl = () => {
    if (currentStream) {
      navigator.clipboard.writeText(currentStream.rtmpUrl);
      toast.success('RTMP URL copied to clipboard!');
    }
  };

  if (!currentStream) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">No Streams Available</h2>
            <p className="text-muted-foreground mb-4">Create your first stream to get started!</p>
            <Button onClick={() => setStreamForm({ ...streamForm, title: 'My First Stream' })}>
              Create Stream
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Video className="w-8 h-8" />
          Live Streaming Studio
        </h1>
        <p className="text-muted-foreground">
          Create and manage your live streams with advanced features and analytics.
        </p>
      </div>

      <Tabs defaultValue="studio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="studio">Studio</TabsTrigger>
          <TabsTrigger value="streams">My Streams</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="studio" className="space-y-6">
          {currentStream ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Stream Control */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {isLive ? (
                            <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE</Badge>
                          ) : (
                            <Badge variant="outline-solid">Offline</Badge>
                          )}
                          {currentStream.title}
                        </CardTitle>
                        <CardDescription>
                          {currentStream.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{viewerCount}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stream Preview */}
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative">
                      {isLive ? (
                        <div className="text-white text-center">
                          <Video className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg font-medium">Live Stream Active</p>
                          <p className="text-sm opacity-75">Broadcasting to {viewerCount} viewers</p>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center">
                          <VideoOff className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg font-medium">Stream Offline</p>
                          <p className="text-sm opacity-75">Click Start Stream to go live</p>
                        </div>
                      )}
                      
                      {/* Stream Health Indicator */}
                      <div className="absolute top-4 right-4">
                        <Badge 
                          className={cn(
                            "text-white",
                            streamHealth === 'good' && "bg-green-500",
                            streamHealth === 'warning' && "bg-yellow-500",
                            streamHealth === 'poor' && "bg-red-500"
                          )}
                        >
                          {streamHealth === 'good' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {streamHealth === 'warning' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {streamHealth === 'poor' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {streamHealth.charAt(0).toUpperCase() + streamHealth.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Stream Controls */}
                    <div className="flex items-center justify-center gap-4">
                      {!isLive ? (
                        <Button onClick={startStream} size="lg" className="bg-red-500 hover:bg-red-600">
                          <Play className="w-4 h-4 mr-2" />
                          Start Stream
                        </Button>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="lg">
                              <Square className="w-4 h-4 mr-2" />
                              End Stream
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>End Live Stream?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will end your live stream and disconnect all viewers. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={endStream} className="bg-red-500 hover:bg-red-600">
                                End Stream
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>

                    {/* Stream Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Stream Key</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={currentStream.streamKey.substring(0, 20) + '...'} 
                            readOnly 
                            className="font-mono text-xs"
                          />
                          <Button variant="outline" size="sm" onClick={copyStreamKey}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>RTMP URL</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={currentStream.rtmpUrl} 
                            readOnly 
                            className="font-mono text-xs"
                          />
                          <Button variant="outline" size="sm" onClick={copyRtmpUrl}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat and Viewers Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Live Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 border rounded p-3 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                      {chatMessages.length === 0 ? (
                        <p className="text-center text-muted-foreground text-sm mt-20">
                          No messages yet. Start your stream to see live chat!
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {chatMessages.map((message, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium text-blue-600">{message.username}:</span>
                              <span className="ml-1">{message.content}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {analytics && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Live Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{analytics.currentViewers}</p>
                          <p className="text-xs text-muted-foreground">Current Viewers</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{analytics.peakViewers}</p>
                          <p className="text-xs text-muted-foreground">Peak Viewers</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{analytics.likes}</p>
                          <p className="text-xs text-muted-foreground">Likes</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">${analytics.revenue}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Create New Stream</CardTitle>
                <CardDescription>Set up a new live stream</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Stream Title</Label>
                    <Input
                      placeholder="Enter stream title..."
                      value={streamForm.title}
                      onChange={(e) => setStreamForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={streamForm.category} onValueChange={(value) => setStreamForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="art">Art & Design</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="chat">Just Chatting</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your stream..."
                    value={streamForm.description}
                    onChange={(e) => setStreamForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Allow Chat</Label>
                    <Switch
                      checked={streamForm.allowChat}
                      onCheckedChange={(checked) => setStreamForm(prev => ({ ...prev, allowChat: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Allow Donations</Label>
                    <Switch
                      checked={streamForm.allowDonations}
                      onCheckedChange={(checked) => setStreamForm(prev => ({ ...prev, allowDonations: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Private Stream</Label>
                    <Switch
                      checked={streamForm.isPrivate}
                      onCheckedChange={(checked) => setStreamForm(prev => ({ ...prev, isPrivate: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={createStream} disabled={loading || !streamForm.title.trim()} className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Create Stream
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="streams" className="space-y-6">
          <div className="grid gap-4">
            {streams.map((stream) => (
              <Card key={stream.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{stream.title}</h3>
                        <Badge className={
                          stream.status === 'live' ? 'bg-red-500 text-white' :
                          stream.status === 'scheduled' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }>
                          {stream.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{stream.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Category: {stream.category}</span>
                        <span>Created: {format(stream.createdAt, 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentStream(stream)}>
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalViews}</div>
                  <p className="text-xs text-muted-foreground">+12% from last stream</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Peak Viewers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.peakViewers}</div>
                  <p className="text-xs text-muted-foreground">+8% from last stream</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Watch Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averageWatchTime}m</div>
                  <p className="text-xs text-muted-foreground">+15% from last stream</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.revenue}</div>
                  <p className="text-xs text-muted-foreground">+22% from last stream</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-semibold mb-2">No Analytics Available</h2>
                <p className="text-muted-foreground">Start a live stream to see analytics data!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stream Settings</CardTitle>
              <CardDescription>Configure your streaming preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Camera Device</Label>
                  <Select value={deviceSettings.cameraDevice} onValueChange={(value) => setDeviceSettings(prev => ({ ...prev, cameraDevice: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Camera</SelectItem>
                      <SelectItem value="webcam">USB Webcam</SelectItem>
                      <SelectItem value="dslr">DSLR Camera</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Microphone Device</Label>
                  <Select value={deviceSettings.microphoneDevice} onValueChange={(value) => setDeviceSettings(prev => ({ ...prev, microphoneDevice: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Microphone</SelectItem>
                      <SelectItem value="headset">Gaming Headset</SelectItem>
                      <SelectItem value="studio">Studio Microphone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Resolution</Label>
                  <Select value={deviceSettings.resolution} onValueChange={(value) => setDeviceSettings(prev => ({ ...prev, resolution: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p (HD)</SelectItem>
                      <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      <SelectItem value="1440p">1440p (2K)</SelectItem>
                      <SelectItem value="2160p">2160p (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Frame Rate</Label>
                  <Select value={deviceSettings.framerate} onValueChange={(value) => setDeviceSettings(prev => ({ ...prev, framerate: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30fps">30 FPS</SelectItem>
                      <SelectItem value="60fps">60 FPS</SelectItem>
                      <SelectItem value="120fps">120 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Camera</Label>
                    <p className="text-sm text-muted-foreground">Show video in your stream</p>
                  </div>
                  <Switch
                    checked={deviceSettings.camera}
                    onCheckedChange={(checked) => setDeviceSettings(prev => ({ ...prev, camera: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Microphone</Label>
                    <p className="text-sm text-muted-foreground">Include audio in your stream</p>
                  </div>
                  <Switch
                    checked={deviceSettings.microphone}
                    onCheckedChange={(checked) => setDeviceSettings(prev => ({ ...prev, microphone: checked }))}
                  />
                </div>
              </div>

              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveStreamingStudio;

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Heart,
  MessageCircle,
  Share2,
  Users,
  DollarSign,
  Send,
  Settings,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface LiveStream {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  isPrivate: boolean;
  requiresSubscription: boolean;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  playbackUrl?: string;
  thumbnailUrl?: string;
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  viewerCount: number;
  maxViewers: number;
  settings: {
    allowChat: boolean;
    allowDonations: boolean;
    allowRecording: boolean;
    chatModeration: 'none' | 'basic' | 'strict';
    donationGoal?: number;
    donationMinAmount?: number;
    subscriberOnlyChat: boolean;
    slowMode: boolean;
    slowModeInterval: number;
  };
  analytics: {
    totalViews: number;
    uniqueViewers: number;
    averageViewTime: number;
    chatMessages: number;
    donations: number;
    donationAmount: number;
    subscribers: number;
    peakViewers: number;
    engagementRate: number;
  };
}

interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isDeleted: boolean;
  isModerator: boolean;
  isCreator: boolean;
}

interface StreamViewer {
  userId: string;
  username: string;
  avatar?: string;
  joinedAt: Date;
  isSubscriber: boolean;
  isModerator: boolean;
  isCreator: boolean;
}

interface LiveStreamPlayerProps {
  streamId: string;
  autoplay?: boolean;
  onStreamEnd?: () => void;
}

export default function LiveStreamPlayer({
  streamId,
  autoplay = false,
  onStreamEnd
}: LiveStreamPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // Stream state
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Viewer state
  const [viewers, setViewers] = useState<string[]>([]);
  const [currentViewer, setCurrentViewer] = useState<StreamViewer | null>(null);
  
  // Donation state
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSendingDonation, setIsSendingDonation] = useState(false);

  // Load stream data
  useEffect(() => {
    loadStreamData();
  }, [streamId]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const loadStreamData = async () => {
    try {
      setIsLoading(true);
      
      // Load stream details
      const streamResponse = await api.get(`/streaming/${streamId}`);
      const streamData = streamResponse.data.stream;
      setStream(streamData);
      
      if (streamData.status === 'live') {
        // Join stream
        await joinStream();
        
        // Load chat messages
        await loadChatMessages();
        
        // Setup real-time updates
        setupRealtimeUpdates();
      }
      
    } catch (error) {
      console.error('Failed to load stream:', error);
      toast.error('Failed to load stream');
    } finally {
      setIsLoading(false);
    }
  };

  const joinStream = async () => {
    try {
      const response = await api.post(`/streaming/${streamId}/join`);
      const { stream: updatedStream, viewer } = response.data;
      
      setStream(updatedStream);
      setCurrentViewer(viewer);
      setIsJoined(true);
      
      // Load viewers
      await loadViewers();
      
    } catch (error) {
      console.error('Failed to join stream:', error);
      toast.error('Failed to join stream');
    }
  };

  const leaveStream = async () => {
    try {
      await api.post(`/streaming/${streamId}/leave`);
      setIsJoined(false);
    } catch (error) {
      console.error('Failed to leave stream:', error);
    }
  };

  const loadChatMessages = async () => {
    try {
      const response = await api.get(`/streaming/${streamId}/chat?limit=50`);
      setChatMessages(response.data.chatMessages);
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
  };

  const loadViewers = async () => {
    try {
      const response = await api.get(`/streaming/${streamId}/viewers`);
      setViewers(response.data.viewers);
    } catch (error) {
      console.error('Failed to load viewers:', error);
    }
  };

  const setupRealtimeUpdates = () => {
    // In a real implementation, this would setup WebSocket connections
    // for real-time chat messages, viewer updates, etc.
    
    // Mock real-time updates
    const interval = setInterval(() => {
      if (stream?.status === 'live') {
        loadViewers();
        loadChatMessages();
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim() || isSendingMessage) return;
    
    try {
      setIsSendingMessage(true);
      
      const response = await api.post(`/streaming/${streamId}/chat`, {
        message: newMessage
      });
      
      const chatMessage = response.data.chatMessage;
      setChatMessages(prev => [...prev, chatMessage]);
      setNewMessage('');
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const sendDonation = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0 || isSendingDonation) return;
    
    try {
      setIsSendingDonation(true);
      
      await api.post(`/streaming/${streamId}/donate`, {
        amount: parseFloat(donationAmount),
        currency: 'USD',
        message: donationMessage,
        isAnonymous: false
      });
      
      toast.success('Donation sent successfully!');
      setDonationAmount('');
      setDonationMessage('');
      setShowDonationForm(false);
      
    } catch (error) {
      console.error('Failed to send donation:', error);
      toast.error('Failed to send donation');
    } finally {
      setIsSendingDonation(false);
    }
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Stream not found</h3>
          <p className="text-muted-foreground">The requested live stream could not be found.</p>
        </div>
      </div>
    );
  }

  if (stream.status !== 'live') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            {stream.status === 'ended' ? 'Stream has ended' : 
             stream.status === 'scheduled' ? 'Stream is scheduled' : 
             'Stream is not available'}
          </h3>
          <p className="text-muted-foreground mb-4">{stream.title}</p>
          {stream.status === 'scheduled' && stream.scheduledAt && (
            <p className="text-sm text-muted-foreground">
              Scheduled for: {new Date(stream.scheduledAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Video Player */}
      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardContent className="p-0">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full"
                src={stream.playbackUrl}
                poster={stream.thumbnailUrl}
                autoPlay={autoplay}
                muted={isMuted}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.volume = volume;
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive" className="bg-red-600">
                        LIVE
                      </Badge>
                      <span className="text-sm">
                        {formatViewerCount(stream.viewerCount)} viewers
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Live indicator */}
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="bg-red-600 animate-pulse">
                  ● LIVE
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stream Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{stream.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{formatViewerCount(stream.viewerCount)} watching</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Started {stream.startedAt ? new Date(stream.startedAt).toLocaleTimeString() : 'recently'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stream.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Heart className="h-4 w-4 mr-1" />
                  Like
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {stream.description && (
            <CardContent>
              <p className="text-muted-foreground">{stream.description}</p>
            </CardContent>
          )}
        </Card>
      </div>
      
      {/* Sidebar */}
      <div className="space-y-4">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            {/* Chat Messages */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Live Chat</span>
                  <span className="text-xs text-muted-foreground">
                    {chatMessages.length} messages
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  <div className="px-4" ref={chatScrollRef}>
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {message.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-primary">
                              {message.username}
                              {message.isCreator && (
                                <Badge variant="secondary" className="ml-1 text-xs">
                                  Creator
                                </Badge>
                              )}
                              {message.isModerator && (
                                <Badge variant="outline" className="ml-1 text-xs">
                                  Mod
                                </Badge>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm break-words">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </ScrollArea>
                
                {/* Chat Input */}
                {stream.settings.allowChat && isJoined && (
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                        disabled={isSendingMessage}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={sendChatMessage}
                        disabled={!newMessage.trim() || isSendingMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    {stream.settings.subscriberOnlyChat && !currentViewer?.isSubscriber && !currentViewer?.isCreator && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Subscribe to participate in chat
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Donation */}
            {stream.settings.allowDonations && isJoined && (
              <Card>
                <CardContent className="p-4">
                  {!showDonationForm ? (
                    <Button
                      onClick={() => setShowDonationForm(true)}
                      className="w-full"
                      size="sm"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Send Donation
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          min={stream.settings.donationMinAmount || 1}
                          step="0.01"
                        />
                        <span className="flex items-center text-sm text-muted-foreground px-2">
                          USD
                        </span>
                      </div>
                      <Input
                        placeholder="Message (optional)"
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                        maxLength={200}
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setShowDonationForm(false)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={sendDonation}
                          size="sm"
                          className="flex-1"
                          disabled={!donationAmount || isSendingDonation}
                        >
                          {isSendingDonation ? 'Sending...' : 'Donate'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4">
            {/* Stream Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Stream Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Viewers</span>
                  <span className="font-medium">{formatViewerCount(stream.viewerCount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Peak Viewers</span>
                  <span className="font-medium">{formatViewerCount(stream.maxViewers)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Views</span>
                  <span className="font-medium">{formatViewerCount(stream.analytics.totalViews)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Chat Messages</span>
                  <span className="font-medium">{stream.analytics.chatMessages}</span>
                </div>
                {stream.settings.allowDonations && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Donations</span>
                    <span className="font-medium">${stream.analytics.donationAmount.toFixed(2)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

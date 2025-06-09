import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Search, 
  MoreHorizontal, 
  Paperclip, 
  Image as ImageIcon,
  Smile,
  Phone,
  Video,
  Archive,
  Pin,
  Star,
  Circle,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Heart,
  Plus,
  Mic,
  Camera,
  File,
  X,
  Brain,
  Sparkles,
  MessageSquare,
  Users,
  Settings,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, isToday, isYesterday } from 'date-fns';
import AnimatedLoader from '@/components/ui/AnimatedLoader';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isRead: boolean;
  reactions?: Array<{
    emoji: string;
    userId: string;
    userName: string;
  }>;
  replyTo?: string;
  attachments?: Array<{
    type: 'image' | 'file' | 'voice';
    url: string;
    name: string;
    size?: number;
  }>;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: 'creator' | 'subscriber' | 'moderator';
  isOnline: boolean;
  lastSeen: Date;
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  canMessage: boolean;
  subscriptionTier: 'free' | 'premium' | 'vip';
  isVerified: boolean;
}

interface AIAssistant {
  suggestions: string[];
  isActive: boolean;
  typing: boolean;
  currentSuggestion?: string;
}

const MessagingV3: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiAssistant, setAiAssistant] = useState<AIAssistant>({
    suggestions: [],
    isActive: false,
    typing: false
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'creators' | 'subscribers' | 'archived'>('all');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConversations();
    initializeAIAssistant();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
        if (data.conversations.length > 0) {
          setActiveConversation(data.conversations[0]);
        }
      } else {
        // Mock data for demo
        setConversations(generateMockConversations());
        setActiveConversation(generateMockConversations()[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations(generateMockConversations());
      setActiveConversation(generateMockConversations()[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        setMessages(generateMockMessages());
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages(generateMockMessages());
    }
  };

  const initializeAIAssistant = async () => {
    try {
      const response = await fetch('/api/ai/messaging/assistant', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAiAssistant({
          suggestions: data.suggestions,
          isActive: true,
          typing: false
        });
      }
    } catch (error) {
      console.error('Error initializing AI assistant:', error);
      setAiAssistant({
        suggestions: [
          "Thanks for your amazing content!",
          "I love your art style, keep it up!",
          "Could you do a tutorial on this?",
          "This is incredible work!",
          "Would love to see more like this"
        ],
        isActive: true,
        typing: false
      });
    }
  };

  const generateMockConversations = (): Conversation[] => [
    {
      id: '1',
      participantId: 'creator1',
      participantName: 'ArtisticFox',
      participantAvatar: '/api/placeholder/40/40',
      participantRole: 'creator',
      isOnline: true,
      lastSeen: new Date(),
      lastMessage: {
        id: 'msg1',
        senderId: 'creator1',
        senderName: 'ArtisticFox',
        senderAvatar: '/api/placeholder/40/40',
        content: 'Thanks for the support! New artwork coming soon! 🎨',
        type: 'text',
        timestamp: new Date(Date.now() - 300000),
        status: 'read',
        isRead: false
      },
      unreadCount: 1,
      isPinned: true,
      isArchived: false,
      canMessage: true,
      subscriptionTier: 'vip',
      isVerified: true
    },
    {
      id: '2',
      participantId: 'creator2',
      participantName: 'DigitalDragon',
      participantAvatar: '/api/placeholder/40/40',
      participantRole: 'creator',
      isOnline: false,
      lastSeen: new Date(Date.now() - 3600000),
      lastMessage: {
        id: 'msg2',
        senderId: 'user',
        senderName: 'You',
        senderAvatar: user?.avatar || '/api/placeholder/40/40',
        content: 'Love your latest commission!',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        status: 'delivered',
        isRead: true
      },
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      canMessage: true,
      subscriptionTier: 'premium',
      isVerified: true
    }
  ];

  const generateMockMessages = (): Message[] => [
    {
      id: '1',
      senderId: 'creator1',
      senderName: 'ArtisticFox',
      senderAvatar: '/api/placeholder/40/40',
      content: 'Hey! Thanks for subscribing to my VIP tier! 🎉',
      type: 'text',
      timestamp: new Date(Date.now() - 86400000),
      status: 'read',
      isRead: true
    },
    {
      id: '2',
      senderId: user?.id || 'user',
      senderName: 'You',
      senderAvatar: user?.avatar || '/api/placeholder/40/40',
      content: 'Your art is absolutely amazing! Keep up the great work!',
      type: 'text',
      timestamp: new Date(Date.now() - 82800000),
      status: 'read',
      isRead: true
    },
    {
      id: '3',
      senderId: 'creator1',
      senderName: 'ArtisticFox',
      senderAvatar: '/api/placeholder/40/40',
      content: 'Thanks for the support! New artwork coming soon! 🎨',
      type: 'text',
      timestamp: new Date(Date.now() - 300000),
      status: 'delivered',
      isRead: false,
      reactions: [
        { emoji: '❤️', userId: 'user', userName: 'You' },
        { emoji: '🔥', userId: 'user2', userName: 'Fan2' }
      ]
    }
  ];

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'user',
      senderName: user?.displayName || 'You',
      senderAvatar: user?.avatar || '/api/placeholder/40/40',
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      status: 'sending',
      isRead: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: newMessage,
          type: 'text'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent', id: data.messageId } : msg
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Simulate successful send for demo
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
    }
  };

  const getAISuggestions = async (context: string) => {
    setAiAssistant(prev => ({ ...prev, typing: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing
      
      const suggestions = [
        "That sounds really interesting!",
        "I'd love to see more of your work",
        "Thanks for sharing this with me",
        "Keep up the amazing creativity!",
        "Looking forward to your next piece"
      ];
      
      setAiAssistant(prev => ({
        ...prev,
        suggestions,
        typing: false
      }));
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setAiAssistant(prev => ({ ...prev, typing: false }));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (type: 'image' | 'file') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      selectedFilter === 'all' || 
      (selectedFilter === 'creators' && conv.participantRole === 'creator') ||
      (selectedFilter === 'subscribers' && conv.participantRole === 'subscriber') ||
      (selectedFilter === 'archived' && conv.isArchived);
    
    return matchesSearch && matchesFilter && !conv.isArchived;
  });

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM dd');
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <AnimatedLoader type="messaging" size="lg" message="Loading your conversations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 h-screen">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Messages</h1>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <Tabs value={selectedFilter} onValueChange={(value: any) => setSelectedFilter(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="creators" className="text-xs">Creators</TabsTrigger>
                  <TabsTrigger value="subscribers" className="text-xs">Fans</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeConversation?.id === conversation.id ? 'bg-purple-50 border-r-2 border-r-purple-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.participantAvatar} />
                          <AvatarFallback>{conversation.participantName[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold text-sm truncate">{conversation.participantName}</span>
                            {conversation.isVerified && (
                              <Star className="w-3 h-3 text-blue-500" />
                            )}
                            {conversation.isPinned && (
                              <Pin className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate pr-2">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col bg-white">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={activeConversation.participantAvatar} />
                          <AvatarFallback>{activeConversation.participantName[0]}</AvatarFallback>
                        </Avatar>
                        {activeConversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="font-semibold">{activeConversation.participantName}</h2>
                          {activeConversation.isVerified && (
                            <Star className="w-4 h-4 text-blue-500" />
                          )}
                          <Badge className={`text-xs ${
                            activeConversation.subscriptionTier === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                            activeConversation.subscriptionTier === 'premium' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activeConversation.subscriptionTier.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {activeConversation.isOnline ? 'Online' : `Last seen ${formatMessageTime(activeConversation.lastSeen)}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAIAssistant(!showAIAssistant)}
                        className={showAIAssistant ? 'bg-purple-100 text-purple-700' : ''}
                      >
                        <Brain className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === user?.id || message.senderId === 'user';
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                            {!isOwn && (
                              <div className="flex items-center space-x-2 mb-1">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={message.senderAvatar} />
                                  <AvatarFallback className="text-xs">{message.senderName[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-500">{message.senderName}</span>
                              </div>
                            )}
                            
                            <div className={`p-3 rounded-lg ${
                              isOwn 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              
                              {message.reactions && message.reactions.length > 0 && (
                                <div className="flex space-x-1 mt-2">
                                  {message.reactions.map((reaction, idx) => (
                                    <span key={idx} className="text-xs bg-white/20 px-1 rounded">
                                      {reaction.emoji}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${
                              isOwn ? 'justify-end' : 'justify-start'
                            }`}>
                              <span>{formatMessageTime(message.timestamp)}</span>
                              {isOwn && getMessageStatusIcon(message.status)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {typingUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">{typingUsers[0]} is typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* AI Assistant Panel */}
                <AnimatePresence>
                  {showAIAssistant && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 bg-purple-50 p-4"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-800">AI Assistant</span>
                        {aiAssistant.typing && (
                          <AnimatedLoader type="ai" size="sm" />
                        )}
                      </div>
                      
                      {aiAssistant.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-purple-700">Suggested responses:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {aiAssistant.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => setNewMessage(suggestion)}
                                className="text-left justify-start bg-white border-purple-200 hover:bg-purple-100"
                              >
                                <Sparkles className="w-3 h-3 mr-2 text-purple-500" />
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          if (e.target.value && aiAssistant.isActive) {
                            getAISuggestions(e.target.value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        className="min-h-[44px] max-h-32 resize-none"
                        rows={1}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMediaPicker(!showMediaPicker)}
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Media Picker */}
                  <AnimatePresence>
                    {showMediaPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-3 flex items-center space-x-2"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileUpload('image')}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Image
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileUpload('file')}
                        >
                          <File className="w-4 h-4 mr-2" />
                          File
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Voice
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default MessagingV3;
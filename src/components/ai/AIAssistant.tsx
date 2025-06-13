import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Brain,
  Sparkles,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Image,
  Video,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Minimize2,
  Maximize2,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AnimatedLoader from '@/components/ui/AnimatedLoader';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  metadata?: {
    confidence?: number;
    category?: string;
    actionable?: boolean;
    sources?: string[];
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'content' | 'analytics' | 'marketing' | 'general';
  prompt: string;
}

interface AIPersonality {
  name: string;
  description: string;
  avatar: string;
  specialties: string[];
  tone: 'professional' | 'casual' | 'friendly' | 'enthusiastic';
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedPersonality, setSelectedPersonality] = useState('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const personalities: { [key: string]: AIPersonality } = {
    default: {
      name: 'Furry Assistant',
      description: 'Your general-purpose AI companion for the furry community',
      avatar: '/api/placeholder/40/40',
      specialties: ['General Help', 'Community Guidelines', 'Platform Navigation'],
      tone: 'friendly'
    },
    creator: {
      name: 'Creator Coach',
      description: 'Specialized assistant for content creators and artists',
      avatar: '/api/placeholder/40/40',
      specialties: ['Content Strategy', 'Audience Growth', 'Monetization'],
      tone: 'professional'
    },
    technical: {
      name: 'Tech Helper',
      description: 'Technical support and platform troubleshooting',
      avatar: '/api/placeholder/40/40',
      specialties: ['Technical Issues', 'Account Settings', 'API Help'],
      tone: 'professional'
    },
    creative: {
      name: 'Creative Spark',
      description: 'Inspiration and creative guidance for artists',
      avatar: '/api/placeholder/40/40',
      specialties: ['Art Inspiration', 'Character Development', 'Creative Blocks'],
      tone: 'enthusiastic'
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Content Ideas',
      description: 'Get AI-generated content suggestions',
      icon: Lightbulb,
      category: 'content',
      prompt: 'Give me 5 creative content ideas based on current trends in the furry community'
    },
    {
      id: '2',
      title: 'Analyze Performance',
      description: 'Review your recent content performance',
      icon: BarChart3,
      category: 'analytics',
      prompt: 'Analyze my recent content performance and suggest improvements'
    },
    {
      id: '3',
      title: 'Audience Growth',
      description: 'Tips for growing your audience',
      icon: Users,
      category: 'marketing',
      prompt: 'What are the best strategies to grow my audience in the furry community?'
    },
    {
      id: '4',
      title: 'Character Development',
      description: 'Help developing your characters',
      icon: Star,
      category: 'content',
      prompt: 'Help me develop a compelling backstory for my furry character'
    },
    {
      id: '5',
      title: 'Posting Schedule',
      description: 'Optimize your posting times',
      icon: Calendar,
      category: 'marketing',
      prompt: 'When are the best times for me to post content for maximum engagement?'
    },
    {
      id: '6',
      title: 'Platform Help',
      description: 'Get help with platform features',
      icon: HelpCircle,
      category: 'general',
      prompt: 'I need help understanding how to use the platform features effectively'
    }
  ];

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const personality = personalities[selectedPersonality];
    let response = '';
    let suggestions: string[] = [];
    let metadata = {
      confidence: Math.floor(Math.random() * 20) + 80,
      category: 'general' as string,
      actionable: false,
      sources: [] as string[]
    };

    // Generate contextual responses based on keywords
    if (userMessage.toLowerCase().includes('content') && userMessage.toLowerCase().includes('idea')) {
      response = `Here are some trending content ideas for the furry community:\n\n1. **Fursuit Friday Feature** - Weekly showcase of community fursuits with photography tips\n2. **Character Backstory Series** - Deep dive into your character's world and history\n3. **Art Process Videos** - Time-lapse or tutorial content showing your creative process\n4. **Community Challenges** - Interactive content that encourages audience participation\n5. **Behind-the-Scenes Content** - Show your workspace, tools, and daily creative routine\n\nThese ideas are trending 45% higher in engagement this week!`;
      suggestions = ['Create a content calendar', 'Analyze trending hashtags', 'Plan a series'];
      metadata.category = 'content';
      metadata.actionable = true;
    }
    else if (userMessage.toLowerCase().includes('performance') || userMessage.toLowerCase().includes('analytics')) {
      response = `Based on your recent activity, here's what I found:\n\n📊 **Performance Summary:**\n• Average engagement rate: 7.8% (above platform average!)\n• Best performing content type: Character art tutorials\n• Peak engagement times: 7-9 PM weekdays\n• Top hashtags: #furryart #characterdesign #tutorial\n\n🎯 **Recommendations:**\n• Post more tutorial content (92% engagement boost)\n• Use trending audio in videos\n• Engage with comments within 2 hours for 35% more reach`;
      suggestions = ['Schedule posts for peak times', 'Create more tutorials', 'Analyze competitor content'];
      metadata.category = 'analytics';
      metadata.actionable = true;
    }
    else if (userMessage.toLowerCase().includes('audience') || userMessage.toLowerCase().includes('grow')) {
      response = `Here are proven strategies to grow your furry community audience:\n\n🌱 **Growth Tactics:**\n• **Collaborate** with other creators (average 40% follower increase)\n• **Use trending hashtags** strategically (research shows 3-5 optimal)\n• **Post consistently** at your peak times (7-9 PM for your audience)\n• **Engage authentically** - respond to comments and DMs personally\n• **Cross-promote** on other platforms where furry communities are active\n\n💡 **Pro Tip:** Users who post behind-the-scenes content see 67% more engagement!`;
      suggestions = ['Find collaboration partners', 'Research trending hashtags', 'Create engagement strategy'];
      metadata.category = 'marketing';
      metadata.actionable = true;
    }
    else if (userMessage.toLowerCase().includes('character')) {
      response = `Let's develop an amazing character! Here's a creative framework:\n\n🎭 **Character Development Framework:**\n• **Species & Appearance:** What makes them visually unique?\n• **Personality Traits:** 3 core traits that drive their actions\n• **Background:** Where did they come from? What shaped them?\n• **Goals & Motivations:** What do they want most?\n• **Quirks & Flaws:** What makes them relatable and interesting?\n• **Relationships:** How do they interact with others?\n\n✨ **Creative Prompt:** What if your character had to overcome their biggest fear tomorrow?`;
      suggestions = ['Design character sheet', 'Write character bio', 'Create character interactions'];
      metadata.category = 'content';
      metadata.actionable = true;
    }
    else if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('how')) {
      response = `I'm here to help! I can assist you with:\n\n🎯 **Content Creation:**\n• Brainstorming ideas and concepts\n• Planning content calendars\n• Character development and storytelling\n\n📊 **Analytics & Growth:**\n• Performance analysis and insights\n• Audience growth strategies\n• Optimal posting strategies\n\n🛠️ **Platform Features:**\n• Account settings and customization\n• Using creator tools effectively\n• Monetization options\n\nWhat specific area would you like help with?`;
      suggestions = ['Show me platform features', 'Help with account setup', 'Explain monetization'];
      metadata.category = 'general';
      metadata.actionable = true;
    }
    else {
      // Default friendly response
      response = `Thanks for your message! I understand you're asking about "${userMessage}". \n\nAs your AI assistant specialized in the furry community, I can help with:\n• Content creation and strategy\n• Character development\n• Community engagement\n• Platform features and tools\n• Performance analytics\n\nCould you tell me more specifically what you'd like help with? I'm here to make your creative journey amazing! 🦊✨`;
      suggestions = ['Get content ideas', 'Analyze my performance', 'Help with character development'];
    }

    return {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions,
      metadata
    };
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt);
    setActiveTab('chat');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could show a toast notification here
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}
    >
      <Card className="h-full flex flex-col shadow-2xl">
        {/* Header */}
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={personalities[selectedPersonality].avatar} />
                  <AvatarFallback>
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <CardTitle className="text-sm">{personalities[selectedPersonality].name}</CardTitle>
                <CardDescription className="text-xs">
                  {personalities[selectedPersonality].description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Actions
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8"
                      >
                        <Bot className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Hi! I'm your AI assistant
                        </h3>
                        <p className="text-sm text-gray-500">
                          I can help with content ideas, analytics, character development, and more!
                        </p>
                      </motion.div>
                    )}
                    
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                            {message.metadata && (
                              <div className="mt-2 flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {message.metadata.confidence}% confident
                                </Badge>
                                {message.metadata.actionable && (
                                  <Badge className="text-xs bg-green-100 text-green-800">
                                    Actionable
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {message.type === 'assistant' && message.suggestions && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs w-full justify-start"
                                  onClick={() => sendMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            {message.type === 'assistant' && (
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(message.content)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <AnimatedLoader type="ai" size="sm" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                      placeholder="Ask me anything..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={() => sendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Quick Actions Tab */}
              <TabsContent value="actions" className="flex-1">
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {quickActions.map((action) => {
                      const IconComponent = action.icon;
                      return (
                        <motion.button
                          key={action.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => handleQuickAction(action)}
                          className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <IconComponent className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{action.title}</h4>
                              <p className="text-xs text-gray-600">{action.description}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="flex-1">
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-3">AI Personality</h3>
                    <div className="space-y-2">
                      {Object.entries(personalities).map(([key, personality]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedPersonality(key)}
                          className={`w-full p-2 text-left rounded-lg transition-colors ${
                            selectedPersonality === key 
                              ? 'bg-purple-100 border border-purple-300' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium text-sm">{personality.name}</div>
                          <div className="text-xs text-gray-600">{personality.description}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {personality.specialties.map(specialty => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessages([])}
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Chat History
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </Card>
    </motion.div>
  );
}

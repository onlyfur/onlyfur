import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Image, 
  Paperclip, 
  MoreVertical, 
  Crown, 
  Star, 
  Heart,
  Shield,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'media';
  timestamp: Date;
  isRead: boolean;
  senderInfo: {
    username: string;
    displayName: string;
    avatar?: string;
    tier: string;
    isVerified: boolean;
  };
}

interface Conversation {
  id: string;
  participantId: string;
  participantInfo: {
    username: string;
    displayName: string;
    avatar?: string;
    tier: string;
    isVerified: boolean;
    role: 'creator' | 'subscriber';
  };
  lastMessage?: Message;
  unreadCount: number;
  canSendMessages: boolean;
  restrictions?: {
    reason: string;
    upgradeRequired?: string;
  };
}

const MessageInterface: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with sample conversations and messaging restrictions
  useEffect(() => {
    initializeSampleConversations();
  }, [user]);

  const initializeSampleConversations = () => {
    if (!user) return;

    const sampleConversations: Conversation[] = [
      {
        id: 'conv-1',
        participantId: 'creator-1',
        participantInfo: {
          username: 'demofox',
          displayName: 'Demo Fox',
          avatar: '/images/branding/fox-mascot.webp',
          tier: 'pro-creator',
          isVerified: true,
          role: 'creator'
        },
        lastMessage: {
          id: 'msg-1',
          senderId: 'creator-1',
          receiverId: user.id,
          content: 'Thanks for subscribing! Feel free to message me anytime.',
          type: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: true,
          senderInfo: {
            username: 'demofox',
            displayName: 'Demo Fox',
            avatar: '/images/branding/fox-mascot.webp',
            tier: 'pro-creator',
            isVerified: true
          }
        },
        unreadCount: 0,
        canSendMessages: canUserMessageCreator(user.subscriptionTier, 'pro-creator'),
        restrictions: !canUserMessageCreator(user.subscriptionTier, 'pro-creator') ? {
          reason: 'Creator only accepts messages from Pro Subscribers and above',
          upgradeRequired: 'pro-subscriber'
        } : undefined
      },
      {
        id: 'conv-2',
        participantId: 'creator-2',
        participantInfo: {
          username: 'artdragon',
          displayName: 'Art Dragon',
          avatar: '/images/branding/fursuit-icon.jpg',
          tier: 'premium-creator',
          isVerified: true,
          role: 'creator'
        },
        lastMessage: {
          id: 'msg-2',
          senderId: 'creator-2',
          receiverId: user.id,
          content: 'Check out my latest commission!',
          type: 'text',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: false,
          senderInfo: {
            username: 'artdragon',
            displayName: 'Art Dragon',
            avatar: '/images/branding/fursuit-icon.jpg',
            tier: 'premium-creator',
            isVerified: true
          }
        },
        unreadCount: 1,
        canSendMessages: canUserMessageCreator(user.subscriptionTier, 'premium-creator'),
        restrictions: !canUserMessageCreator(user.subscriptionTier, 'premium-creator') ? {
          reason: 'Creator only accepts messages from VIP Subscribers',
          upgradeRequired: 'vip-subscriber'
        } : undefined
      }
    ];

    setConversations(sampleConversations);
  };

  const canUserMessageCreator = (userTier: string | undefined, creatorTier: string): boolean => {
    if (!userTier) return false;

    // Basic creator accepts messages from any subscriber
    if (creatorTier === 'basic-creator') {
      return ['basic-subscriber', 'pro-subscriber', 'vip-subscriber'].includes(userTier);
    }

    // Pro creator accepts messages from Pro and VIP subscribers
    if (creatorTier === 'pro-creator') {
      return ['pro-subscriber', 'vip-subscriber'].includes(userTier);
    }

    // Premium creator accepts messages only from VIP subscribers
    if (creatorTier === 'premium-creator') {
      return userTier === 'vip-subscriber';
    }

    return false;
  };

  const getTierIcon = (tier: string) => {
    if (tier.includes('vip') || tier.includes('premium')) return <Crown className="w-4 h-4" />;
    if (tier.includes('pro')) return <Star className="w-4 h-4" />;
    return <Heart className="w-4 h-4" />;
  };

  const getTierColor = (tier: string) => {
    if (tier.includes('vip') || tier.includes('premium')) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (tier.includes('pro')) return 'bg-purple-500';
    return 'bg-blue-500';
  };

  const loadMessages = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    // Sample messages for demonstration
    const sampleMessages: Message[] = [
      {
        id: 'msg-1',
        senderId: conversation.participantId,
        receiverId: user?.id || '',
        content: 'Hey there! Welcome to my content page! 🦊',
        type: 'text',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        senderInfo: conversation.participantInfo
      },
      {
        id: 'msg-2',
        senderId: user?.id || '',
        receiverId: conversation.participantId,
        content: 'Thank you! I love your fursuit designs!',
        type: 'text',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isRead: true,
        senderInfo: {
          username: user?.username || '',
          displayName: user?.displayName || '',
          avatar: user?.avatar,
          tier: user?.subscriptionTier || 'basic-subscriber',
          isVerified: user?.isVerified || false
        }
      },
      {
        id: 'msg-3',
        senderId: conversation.participantId,
        receiverId: user?.id || '',
        content: 'Thanks for subscribing! Feel free to message me anytime.',
        type: 'text',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: true,
        senderInfo: conversation.participantInfo
      }
    ];

    setMessages(sampleMessages);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation?.canSendMessages) {
      toast({
        title: "Cannot Send Message",
        description: conversation?.restrictions?.reason || "You don't have permission to message this creator.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        receiverId: conversation.participantId,
        content: newMessage,
        type: 'text',
        timestamp: new Date(),
        isRead: false,
        senderInfo: {
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          tier: user.subscriptionTier || 'basic-subscriber',
          isVerified: user.isVerified || false
        }
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      scrollToBottom();

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="h-screen flex bg-background">
      {/* Conversations List - Mobile Responsive */}
      <div className={`
        w-80 border-r border-border
        md:block
        ${selectedConversation ? 'hidden md:block' : 'block'}
        ${selectedConversation ? 'md:w-80' : 'w-full md:w-80'}
      `}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Chat with your favorite creators
          </p>
        </CardHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="space-y-2 p-4 pt-0">
            {conversations.map((conversation) => (
              <Card 
                key={conversation.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedConversation === conversation.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  setSelectedConversation(conversation.id);
                  loadMessages(conversation.id);
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.participantInfo.avatar} />
                        <AvatarFallback>
                          {conversation.participantInfo.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participantInfo.isVerified && (
                        <Shield className="absolute -top-1 -right-1 w-4 h-4 text-blue-500 bg-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {conversation.participantInfo.displayName}
                        </span>
                        <Badge 
                          className={`text-xs text-white ${getTierColor(conversation.participantInfo.tier)}`}
                          variant="secondary"
                        >
                          <div className="flex items-center gap-1">
                            {getTierIcon(conversation.participantInfo.tier)}
                            {conversation.participantInfo.tier.split('-')[0].toUpperCase()}
                          </div>
                        </Badge>
                      </div>
                      
                      {conversation.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage.content}
                        </p>
                      )}
                      
                      {!conversation.canSendMessages && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          Restricted
                        </Badge>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.lastMessage && formatMessageTime(conversation.lastMessage.timestamp)}
                      </p>
                    </div>
                    
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Interface - Mobile Responsive */}
      <div className={`
        flex-1 flex flex-col
        ${selectedConversation ? 'block' : 'hidden md:block'}
      `}>
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    ←
                  </Button>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConv.participantInfo.avatar} />
                    <AvatarFallback>
                      {selectedConv.participantInfo.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{selectedConv.participantInfo.displayName}</h3>
                      {selectedConv.participantInfo.isVerified && (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}
                      <Badge 
                        className={`text-xs text-white ${getTierColor(selectedConv.participantInfo.tier)}`}
                        variant="secondary"
                      >
                        <div className="flex items-center gap-1">
                          {getTierIcon(selectedConv.participantInfo.tier)}
                          {selectedConv.participantInfo.tier.split('-')[0].toUpperCase()}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      @{selectedConv.participantInfo.username}
                    </p>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              
              {!selectedConv.canSendMessages && selectedConv.restrictions && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-3">
                  <p className="text-sm text-destructive font-medium mb-1">
                    Messaging Restricted
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConv.restrictions.reason}
                  </p>
                  {selectedConv.restrictions.upgradeRequired && (
                    <Button size="sm" className="mt-2">
                      Upgrade to {selectedConv.restrictions.upgradeRequired.replace('-', ' ').toUpperCase()}
                    </Button>
                  )}
                </div>
              )}
            </CardHeader>

            {/* Messages - Mobile Optimized */}
            <ScrollArea className="flex-1 p-4 mobile-chat mobile-optimized">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex gap-3 ${
                      message.senderId === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.senderId !== user?.id && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.senderInfo.avatar} />
                        <AvatarFallback>
                          {message.senderInfo.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      message.senderId === user?.id ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block px-4 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                    
                    {message.senderId === user?.id && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                          {user?.displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input - Mobile Optimized */}
            <div className="border-t border-border p-4 mobile-chat-input safe-bottom">
              {selectedConv.canSendMessages ? (
                <div className="flex gap-2 md:gap-3">
                  <Button variant="ghost" size="sm" disabled>
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  
                  <Button 
                    onClick={sendMessage} 
                    disabled={!newMessage.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    You need a higher subscription tier to message this creator
                  </p>
                  <Button size="sm">
                    Upgrade Subscription
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a creator from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInterface;

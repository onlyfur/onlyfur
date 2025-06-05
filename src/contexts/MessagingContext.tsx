import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Conversation,
  Message,
  MessageAttachment,
  UserPresence,
  BroadcastMessage,
  MessageNotification,
  NotificationSettings,
  MessageDraft,
  ChatTheme,
  MessagingContextType,
  ConversationParticipant,
  BroadcastRecipient,
} from '@/types';
import { useAuth } from './AuthContext';

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

interface MessagingProviderProps {
  children: React.ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [userPresence, setUserPresence] = useState<Record<string, UserPresence>>({});
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [drafts, setDrafts] = useState<Record<string, MessageDraft>>({});
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    soundEnabled: true,
    desktopNotifications: true,
    doNotDisturb: {
      enabled: false,
    },
    messagePreview: true,
    vibration: true,
    notificationSound: 'default',
  });
  const [chatTheme, setChatTheme] = useState<ChatTheme>({
    id: 'default',
    name: 'Default',
    bubbleColors: {
      sent: '#3B82F6',
      received: '#F3F4F6',
    },
    textColors: {
      sent: '#FFFFFF',
      received: '#1F2937',
    },
    backgroundColor: '#FFFFFF',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
      initializeMockData();
      simulateWebSocketConnection();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      const storedConversations = localStorage.getItem(`conversations-${user?.id}`);
      const storedMessages = localStorage.getItem(`messages-${user?.id}`);
      const storedDrafts = localStorage.getItem(`drafts-${user?.id}`);
      const storedSettings = localStorage.getItem(`notification-settings-${user?.id}`);
      
      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
      }
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
      if (storedDrafts) {
        setDrafts(JSON.parse(storedDrafts));
      }
      if (storedSettings) {
        setNotificationSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load messaging data:', error);
    }
  };

  const initializeMockData = () => {
    // Mock conversations
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        type: 'direct',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        participants: [
          {
            userId: user?.id || '1',
            role: 'member',
            joinedAt: new Date(),
            lastReadAt: new Date(),
            isActive: true,
            permissions: {
              canSendMessages: true,
              canSendMedia: true,
              canAddParticipants: false,
              canRemoveParticipants: false,
              canEditConversation: false,
              canDeleteMessages: false,
            },
          },
          {
            userId: 'sarah-johnson',
            role: 'member',
            joinedAt: new Date(),
            lastReadAt: new Date(Date.now() - 300000), // 5 minutes ago
            isActive: true,
            permissions: {
              canSendMessages: true,
              canSendMedia: true,
              canAddParticipants: false,
              canRemoveParticipants: false,
              canEditConversation: false,
              canDeleteMessages: false,
            },
          },
        ],
        lastMessageAt: new Date(),
        unreadCount: 2,
        isArchived: false,
        isMuted: false,
        isPinned: true,
        settings: {
          isEncrypted: true,
          allowFileSharing: true,
          allowVoiceMessages: true,
          moderationEnabled: false,
          wordFilter: [],
        },
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(),
      },
      {
        id: 'conv-2',
        type: 'group',
        name: 'Premium Subscribers',
        description: 'Exclusive chat for premium subscribers',
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
        creatorId: user?.id,
        participants: [
          {
            userId: user?.id || '1',
            role: 'owner',
            joinedAt: new Date(Date.now() - 86400000),
            lastReadAt: new Date(),
            isActive: true,
            permissions: {
              canSendMessages: true,
              canSendMedia: true,
              canAddParticipants: true,
              canRemoveParticipants: true,
              canEditConversation: true,
              canDeleteMessages: true,
            },
          },
        ],
        lastMessageAt: new Date(Date.now() - 3600000), // 1 hour ago
        unreadCount: 0,
        isArchived: false,
        isMuted: false,
        isPinned: false,
        settings: {
          isEncrypted: true,
          allowFileSharing: true,
          allowVoiceMessages: true,
          maxParticipants: 50,
          moderationEnabled: true,
          wordFilter: ['spam', 'inappropriate'],
        },
        createdAt: new Date(Date.now() - 604800000), // 1 week ago
        updatedAt: new Date(),
      },
      {
        id: 'conv-3',
        type: 'support',
        name: 'Customer Support',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        participants: [
          {
            userId: user?.id || '1',
            role: 'member',
            joinedAt: new Date(),
            lastReadAt: new Date(),
            isActive: true,
            permissions: {
              canSendMessages: true,
              canSendMedia: true,
              canAddParticipants: false,
              canRemoveParticipants: false,
              canEditConversation: false,
              canDeleteMessages: false,
            },
          },
          {
            userId: 'support-agent',
            role: 'admin',
            joinedAt: new Date(),
            lastReadAt: new Date(),
            isActive: true,
            permissions: {
              canSendMessages: true,
              canSendMedia: true,
              canAddParticipants: true,
              canRemoveParticipants: true,
              canEditConversation: true,
              canDeleteMessages: true,
            },
          },
        ],
        lastMessageAt: new Date(Date.now() - 7200000), // 2 hours ago
        unreadCount: 1,
        isArchived: false,
        isMuted: false,
        isPinned: false,
        settings: {
          isEncrypted: true,
          allowFileSharing: true,
          allowVoiceMessages: false,
          moderationEnabled: false,
          wordFilter: [],
        },
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date(),
      },
    ];

    // Mock messages
    const mockMessages: Record<string, Message[]> = {
      'conv-1': [
        {
          id: 'msg-1',
          conversationId: 'conv-1',
          senderId: 'sarah-johnson',
          content: "Hey! Thanks for the amazing content you've been sharing. I really love your photography tutorials! 📸",
          type: 'text',
          status: 'read',
          isEncrypted: true,
          reactions: [
            {
              id: 'reaction-1',
              userId: user?.id || '1',
              emoji: '❤️',
              createdAt: new Date(Date.now() - 300000),
            },
          ],
          createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
          updatedAt: new Date(Date.now() - 1800000),
        },
        {
          id: 'msg-2',
          conversationId: 'conv-1',
          senderId: user?.id || '1',
          content: "Thank you so much! I'm glad you find them helpful. I have a new advanced photography course coming next week. 🎉",
          type: 'text',
          status: 'read',
          isEncrypted: true,
          createdAt: new Date(Date.now() - 900000), // 15 minutes ago
          updatedAt: new Date(Date.now() - 900000),
        },
        {
          id: 'msg-3',
          conversationId: 'conv-1',
          senderId: 'sarah-johnson',
          content: "That sounds amazing! Will it cover landscape photography techniques?",
          type: 'text',
          status: 'delivered',
          isEncrypted: true,
          createdAt: new Date(Date.now() - 300000), // 5 minutes ago
          updatedAt: new Date(Date.now() - 300000),
        },
        {
          id: 'msg-4',
          conversationId: 'conv-1',
          senderId: 'sarah-johnson',
          content: "I've been trying to improve my landscape shots lately 🌄",
          type: 'text',
          status: 'sent',
          isEncrypted: true,
          createdAt: new Date(Date.now() - 120000), // 2 minutes ago
          updatedAt: new Date(Date.now() - 120000),
        },
      ],
      'conv-2': [
        {
          id: 'msg-group-1',
          conversationId: 'conv-2',
          senderId: user?.id || '1',
          content: "Welcome to the Premium Subscribers chat! This is an exclusive space for our premium community. Feel free to share your thoughts and connect with fellow supporters! 🎉",
          type: 'text',
          status: 'read',
          isEncrypted: true,
          reactions: [
            {
              id: 'reaction-group-1',
              userId: 'member-1',
              emoji: '🔥',
              createdAt: new Date(Date.now() - 3600000),
            },
            {
              id: 'reaction-group-2',
              userId: 'member-2',
              emoji: '👏',
              createdAt: new Date(Date.now() - 3500000),
            },
          ],
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          updatedAt: new Date(Date.now() - 3600000),
        },
      ],
      'conv-3': [
        {
          id: 'msg-support-1',
          conversationId: 'conv-3',
          senderId: 'support-agent',
          content: "Hello! How can I help you today? 😊",
          type: 'text',
          status: 'read',
          isEncrypted: true,
          createdAt: new Date(Date.now() - 7200000), // 2 hours ago
          updatedAt: new Date(Date.now() - 7200000),
        },
      ],
    };

    // Mock user presence
    const mockPresence: Record<string, UserPresence> = {
      'sarah-johnson': {
        userId: 'sarah-johnson',
        status: 'online',
        lastSeen: new Date(),
        isTyping: {
          conversationId: 'conv-1',
          timestamp: new Date(),
        },
      },
      'support-agent': {
        userId: 'support-agent',
        status: 'online',
        lastSeen: new Date(),
      },
    };

    // Mock notifications
    const mockNotifications: MessageNotification[] = [
      {
        id: 'notif-1',
        userId: user?.id || '1',
        conversationId: 'conv-1',
        messageId: 'msg-4',
        type: 'message',
        title: 'Sarah Johnson',
        body: "I've been trying to improve my landscape shots lately 🌄",
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        isRead: false,
        createdAt: new Date(Date.now() - 120000),
      },
      {
        id: 'notif-2',
        userId: user?.id || '1',
        conversationId: 'conv-3',
        messageId: 'msg-support-1',
        type: 'message',
        title: 'Customer Support',
        body: 'Hello! How can I help you today? 😊',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000),
      },
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);
    setUserPresence(mockPresence);
    setNotifications(mockNotifications);

    // Save to localStorage
    localStorage.setItem(`conversations-${user?.id}`, JSON.stringify(mockConversations));
    localStorage.setItem(`messages-${user?.id}`, JSON.stringify(mockMessages));
  };

  const simulateWebSocketConnection = () => {
    // Simulate WebSocket connection
    setIsConnected(true);
    
    // Simulate typing indicators
    const typingInterval = setInterval(() => {
      setUserPresence(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(userId => {
          if (updated[userId].isTyping && 
              Date.now() - updated[userId].isTyping!.timestamp.getTime() > 3000) {
            delete updated[userId].isTyping;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(typingInterval);
  };

  // Conversation methods
  const createConversation = async (type: string, participants: string[], name?: string): Promise<Conversation> => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      type: type as any,
      name,
      participants: participants.map(userId => ({
        userId,
        role: userId === user?.id ? 'owner' : 'member',
        joinedAt: new Date(),
        isActive: true,
        permissions: {
          canSendMessages: true,
          canSendMedia: true,
          canAddParticipants: userId === user?.id,
          canRemoveParticipants: userId === user?.id,
          canEditConversation: userId === user?.id,
          canDeleteMessages: userId === user?.id,
        },
      })),
      unreadCount: 0,
      isArchived: false,
      isMuted: false,
      isPinned: false,
      settings: {
        isEncrypted: true,
        allowFileSharing: true,
        allowVoiceMessages: true,
        moderationEnabled: false,
        wordFilter: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    localStorage.setItem(`conversations-${user?.id}`, JSON.stringify(updatedConversations));
    
    return newConversation;
  };

  const updateConversation = async (conversationId: string, updates: Partial<Conversation>): Promise<void> => {
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId
        ? { ...conv, ...updates, updatedAt: new Date() }
        : conv
    );
    
    setConversations(updatedConversations);
    localStorage.setItem(`conversations-${user?.id}`, JSON.stringify(updatedConversations));
  };

  const deleteConversation = async (conversationId: string): Promise<void> => {
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    setConversations(updatedConversations);
    
    const updatedMessages = { ...messages };
    delete updatedMessages[conversationId];
    setMessages(updatedMessages);
    
    localStorage.setItem(`conversations-${user?.id}`, JSON.stringify(updatedConversations));
    localStorage.setItem(`messages-${user?.id}`, JSON.stringify(updatedMessages));
  };

  const archiveConversation = async (conversationId: string): Promise<void> => {
    await updateConversation(conversationId, { isArchived: true });
  };

  // Message methods
  const sendMessage = async (
    conversationId: string,
    content: string,
    type: string = 'text',
    attachments?: MessageAttachment[]
  ): Promise<Message> => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user?.id || '1',
      content,
      type: type as any,
      status: 'sending',
      attachments,
      isEncrypted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update messages
    const conversationMessages = messages[conversationId] || [];
    const updatedMessages = {
      ...messages,
      [conversationId]: [...conversationMessages, newMessage],
    };
    setMessages(updatedMessages);

    // Simulate message delivery
    setTimeout(() => {
      const deliveredMessage = { ...newMessage, status: 'delivered' as const };
      const finalMessages = {
        ...updatedMessages,
        [conversationId]: updatedMessages[conversationId].map(msg =>
          msg.id === newMessage.id ? deliveredMessage : msg
        ),
      };
      setMessages(finalMessages);
      localStorage.setItem(`messages-${user?.id}`, JSON.stringify(finalMessages));
    }, 1000);

    // Update conversation last message
    await updateConversation(conversationId, {
      lastMessage: newMessage,
      lastMessageAt: new Date(),
    });

    // Clear draft
    clearDraft(conversationId);

    return newMessage;
  };

  const editMessage = async (messageId: string, content: string): Promise<void> => {
    const updatedMessages = { ...messages };
    Object.keys(updatedMessages).forEach(convId => {
      updatedMessages[convId] = updatedMessages[convId].map(msg =>
        msg.id === messageId
          ? { ...msg, content, editedAt: new Date() }
          : msg
      );
    });
    
    setMessages(updatedMessages);
    localStorage.setItem(`messages-${user?.id}`, JSON.stringify(updatedMessages));
  };

  const deleteMessage = async (messageId: string): Promise<void> => {
    const updatedMessages = { ...messages };
    Object.keys(updatedMessages).forEach(convId => {
      updatedMessages[convId] = updatedMessages[convId].map(msg =>
        msg.id === messageId
          ? { ...msg, deletedAt: new Date(), content: 'This message was deleted' }
          : msg
      );
    });
    
    setMessages(updatedMessages);
    localStorage.setItem(`messages-${user?.id}`, JSON.stringify(updatedMessages));
  };

  const markAsRead = async (conversationId: string, messageId?: string): Promise<void> => {
    // Update message status
    if (messageId) {
      const updatedMessages = {
        ...messages,
        [conversationId]: messages[conversationId]?.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' as const } : msg
        ) || [],
      };
      setMessages(updatedMessages);
      localStorage.setItem(`messages-${user?.id}`, JSON.stringify(updatedMessages));
    }

    // Update conversation unread count
    await updateConversation(conversationId, { unreadCount: 0 });
  };

  const addReaction = async (messageId: string, emoji: string): Promise<void> => {
    const updatedMessages = { ...messages };
    Object.keys(updatedMessages).forEach(convId => {
      updatedMessages[convId] = updatedMessages[convId].map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.userId === user?.id && r.emoji === emoji);
          
          if (existingReaction) {
            return msg; // Already reacted with this emoji
          }
          
          return {
            ...msg,
            reactions: [
              ...reactions,
              {
                id: `reaction-${Date.now()}`,
                userId: user?.id || '1',
                emoji,
                createdAt: new Date(),
              },
            ],
          };
        }
        return msg;
      });
    });
    
    setMessages(updatedMessages);
    localStorage.setItem(`messages-${user?.id}`, JSON.stringify(updatedMessages));
  };

  const removeReaction = async (messageId: string, emoji: string): Promise<void> => {
    const updatedMessages = { ...messages };
    Object.keys(updatedMessages).forEach(convId => {
      updatedMessages[convId] = updatedMessages[convId].map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          return {
            ...msg,
            reactions: reactions.filter(r => !(r.userId === user?.id && r.emoji === emoji)),
          };
        }
        return msg;
      });
    });
    
    setMessages(updatedMessages);
    localStorage.setItem(`messages-${user?.id}`, JSON.stringify(updatedMessages));
  };

  // Media methods
  const uploadAttachment = async (file: File, type: string): Promise<MessageAttachment> => {
    // Simulate file upload
    return new Promise((resolve) => {
      setTimeout(() => {
        const attachment: MessageAttachment = {
          id: `attachment-${Date.now()}`,
          type: type as any,
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
          thumbnail: type === 'image' ? URL.createObjectURL(file) : undefined,
        };
        resolve(attachment);
      }, 1000);
    });
  };

  const recordVoiceMessage = async (): Promise<MessageAttachment> => {
    // Simulate voice recording
    return new Promise((resolve) => {
      setTimeout(() => {
        const attachment: MessageAttachment = {
          id: `voice-${Date.now()}`,
          type: 'voice',
          name: 'Voice Message',
          url: '/mock-voice-message.mp3',
          size: 50000,
          mimeType: 'audio/mp3',
          duration: 15,
        };
        resolve(attachment);
      }, 2000);
    });
  };

  // Presence methods
  const setTyping = useCallback((conversationId: string, isTyping: boolean): void => {
    if (isTyping) {
      setUserPresence(prev => ({
        ...prev,
        [user?.id || '1']: {
          ...prev[user?.id || '1'],
          userId: user?.id || '1',
          status: 'online',
          lastSeen: new Date(),
          isTyping: {
            conversationId,
            timestamp: new Date(),
          },
        },
      }));
    } else {
      setUserPresence(prev => {
        const updated = { ...prev };
        if (updated[user?.id || '1']) {
          delete updated[user?.id || '1'].isTyping;
        }
        return updated;
      });
    }
  }, [user?.id]);

  const updateStatus = async (status: string, customMessage?: string): Promise<void> => {
    setUserPresence(prev => ({
      ...prev,
      [user?.id || '1']: {
        ...prev[user?.id || '1'],
        userId: user?.id || '1',
        status: status as any,
        lastSeen: new Date(),
        customStatus: customMessage,
      },
    }));
  };

  // Broadcast methods
  const createBroadcast = async (
    title: string,
    content: string,
    recipients: string[],
    attachments?: MessageAttachment[]
  ): Promise<BroadcastMessage> => {
    const newBroadcast: BroadcastMessage = {
      id: `broadcast-${Date.now()}`,
      senderId: user?.id || '1',
      title,
      content,
      recipients: recipients.map(userId => ({
        userId,
        status: 'pending',
      })),
      attachments,
      status: 'sending',
      analytics: {
        totalRecipients: recipients.length,
        delivered: 0,
        read: 0,
        failed: 0,
        engagement: {
          replies: 0,
          reactions: 0,
          clicks: 0,
        },
      },
      createdAt: new Date(),
    };

    const updatedBroadcasts = [...broadcasts, newBroadcast];
    setBroadcasts(updatedBroadcasts);
    
    return newBroadcast;
  };

  const scheduleBroadcast = async (broadcastId: string, scheduledFor: Date): Promise<void> => {
    const updatedBroadcasts = broadcasts.map(broadcast =>
      broadcast.id === broadcastId
        ? { ...broadcast, scheduledFor, status: 'scheduled' as const }
        : broadcast
    );
    
    setBroadcasts(updatedBroadcasts);
  };

  // Notification methods
  const updateNotificationSettings = async (settings: Partial<NotificationSettings>): Promise<void> => {
    const updatedSettings = { ...notificationSettings, ...settings };
    setNotificationSettings(updatedSettings);
    localStorage.setItem(`notification-settings-${user?.id}`, JSON.stringify(updatedSettings));
  };

  const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
  };

  // Search methods
  const searchMessages = async (query: string, conversationId?: string): Promise<Message[]> => {
    const searchIn = conversationId ? [conversationId] : Object.keys(messages);
    const results: Message[] = [];
    
    searchIn.forEach(convId => {
      const convMessages = messages[convId] || [];
      const filtered = convMessages.filter(msg =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
      results.push(...filtered);
    });
    
    return results;
  };

  const searchConversations = async (query: string): Promise<Conversation[]> => {
    return conversations.filter(conv =>
      conv.name?.toLowerCase().includes(query.toLowerCase()) ||
      conv.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Draft methods
  const saveDraft = (conversationId: string, content: string, attachments: MessageAttachment[]): void => {
    const draft: MessageDraft = {
      conversationId,
      content,
      attachments,
      lastModified: new Date(),
    };
    
    const updatedDrafts = { ...drafts, [conversationId]: draft };
    setDrafts(updatedDrafts);
    localStorage.setItem(`drafts-${user?.id}`, JSON.stringify(updatedDrafts));
  };

  const loadDraft = (conversationId: string): MessageDraft | null => {
    return drafts[conversationId] || null;
  };

  const clearDraft = (conversationId: string): void => {
    const updatedDrafts = { ...drafts };
    delete updatedDrafts[conversationId];
    setDrafts(updatedDrafts);
    localStorage.setItem(`drafts-${user?.id}`, JSON.stringify(updatedDrafts));
  };

  const value: MessagingContextType = {
    // Conversations
    conversations,
    activeConversation,
    setActiveConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    archiveConversation,
    
    // Messages
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    addReaction,
    removeReaction,
    
    // Media & Files
    uploadAttachment,
    recordVoiceMessage,
    
    // Presence & Typing
    userPresence,
    setTyping,
    updateStatus,
    
    // Broadcasts
    broadcasts,
    createBroadcast,
    scheduleBroadcast,
    
    // Notifications
    notifications,
    notificationSettings,
    updateNotificationSettings,
    markNotificationAsRead,
    
    // Search & Filters
    searchMessages,
    searchConversations,
    
    // Drafts
    drafts,
    saveDraft,
    loadDraft,
    clearDraft,
    
    // Settings
    chatTheme,
    setChatTheme,
    
    // State
    isLoading,
    isConnected,
    error,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

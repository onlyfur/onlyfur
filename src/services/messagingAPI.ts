import { apiService } from './api';

export interface Message {
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

export interface Conversation {
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

export interface ConversationCreate {
  participantId: string;
  initialMessage?: string;
}

export interface MessageCreate {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'media';
}

class MessagingAPIService {
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await apiService.get('/api/messages/conversations');
      return response.data.conversations || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId: string, page: number = 1, limit: number = 50): Promise<{
    messages: Message[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const response = await apiService.get(`/api/messages/conversations/${conversationId}/messages`, {
        params: { page, limit }
      });
      
      return {
        messages: response.data.messages || [],
        hasMore: response.data.hasMore || false,
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { messages: [], hasMore: false, total: 0 };
    }
  }

  /**
   * Send a new message
   */
  async sendMessage(messageData: MessageCreate): Promise<Message | null> {
    try {
      const response = await apiService.post('/api/messages/send', messageData);
      return response.data.message || null;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(conversationData: ConversationCreate): Promise<Conversation | null> {
    try {
      const response = await apiService.post('/api/messages/conversations', conversationData);
      return response.data.conversation || null;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string, messageIds?: string[]): Promise<boolean> {
    try {
      await apiService.put(`/api/messages/conversations/${conversationId}/read`, {
        messageIds
      });
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiService.get('/api/messages/unread-count');
      return response.data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      await apiService.delete(`/api/messages/conversations/${conversationId}`);
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      await apiService.delete(`/api/messages/${messageId}`);
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  /**
   * Check if user can message another user based on subscription tiers
   */
  async canMessageUser(userId: string): Promise<{
    canMessage: boolean;
    reason?: string;
    upgradeRequired?: string;
  }> {
    try {
      const response = await apiService.get(`/api/messages/can-message/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking message permissions:', error);
      return { canMessage: false, reason: 'Unable to verify permissions' };
    }
  }

  /**
   * Upload media for messages
   */
  async uploadMedia(file: File): Promise<{
    url: string;
    type: 'image' | 'media';
  } | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiService.post('/api/messages/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      return null;
    }
  }

  /**
   * Search conversations and messages
   */
  async search(query: string, type: 'all' | 'conversations' | 'messages' = 'all'): Promise<{
    conversations: Conversation[];
    messages: Message[];
  }> {
    try {
      const response = await apiService.get('/api/messages/search', {
        params: { query, type }
      });
      
      return {
        conversations: response.data.conversations || [],
        messages: response.data.messages || []
      };
    } catch (error) {
      console.error('Error searching messages:', error);
      return { conversations: [], messages: [] };
    }
  }

  /**
   * Report a message or conversation
   */
  async reportContent(type: 'message' | 'conversation', id: string, reason: string): Promise<boolean> {
    try {
      await apiService.post('/api/messages/report', {
        type,
        id,
        reason
      });
      return true;
    } catch (error) {
      console.error('Error reporting content:', error);
      return false;
    }
  }

  /**
   * Block/unblock a user
   */
  async blockUser(userId: string, blocked: boolean = true): Promise<boolean> {
    try {
      await apiService.post('/api/messages/block', {
        userId,
        blocked
      });
      return true;
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      return false;
    }
  }
}

export const messagingAPI = new MessagingAPIService();

import { apiService } from './api';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'audio' | 'text' | 'stream';
  url?: string;
  thumbnailUrl?: string;
  tier: string;
  price: number;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  createdAt: Date;
  stats: {
    views: number;
    likes: number;
    comments: number;
    earnings: number;
  };
}

export interface Subscriber {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  tier: string;
  subscribedAt: Date;
  lastActiveAt: Date;
  totalSpent: number;
  isActive: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalSubscribers: number;
  activeSubscribers: number;
  totalContent: number;
  publishedContent: number;
  totalViews: number;
  totalLikes: number;
  conversionRate: number;
  retentionRate: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  subscribers: number;
}

export interface TopContent {
  id: string;
  title: string;
  views: number;
  revenue: number;
  thumbnail?: string;
}

class CreatorDashboardAPIService {
  /**
   * Get creator dashboard overview stats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get('/api/creator/dashboard/stats');
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get creator's content
   */
  async getCreatorContent(page: number = 1, limit: number = 20, status?: string): Promise<{
    content: ContentItem[];
    total: number;
    pages: number;
  }> {
    try {
      const response = await apiService.get('/api/creator/content', {
        params: { page, limit, status }
      });
      
      return {
        content: response.data.content || [],
        total: response.data.total || 0,
        pages: response.data.pages || 0
      };
    } catch (error) {
      console.error('Error fetching creator content:', error);
      return { content: [], total: 0, pages: 0 };
    }
  }

  /**
   * Get creator's subscribers
   */
  async getSubscribers(page: number = 1, limit: number = 20, tier?: string): Promise<{
    subscribers: Subscriber[];
    total: number;
    pages: number;
  }> {
    try {
      const response = await apiService.get('/api/creator/subscribers', {
        params: { page, limit, tier }
      });
      
      return {
        subscribers: response.data.subscribers || [],
        total: response.data.total || 0,
        pages: response.data.pages || 0
      };
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return { subscribers: [], total: 0, pages: 0 };
    }
  }

  /**
   * Get revenue data for charts
   */
  async getRevenueData(period: 'week' | 'month' | 'year' = 'month'): Promise<RevenueData[]> {
    try {
      const response = await apiService.get('/api/creator/revenue', {
        params: { period }
      });
      return response.data.revenue || [];
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      return [];
    }
  }

  /**
   * Get top performing content
   */
  async getTopContent(limit: number = 10, period: 'week' | 'month' | 'all' = 'month'): Promise<TopContent[]> {
    try {
      const response = await apiService.get('/api/creator/top-content', {
        params: { limit, period }
      });
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching top content:', error);
      return [];
    }
  }

  /**
   * Create new content
   */
  async createContent(contentData: {
    title: string;
    description: string;
    type: string;
    tier: string;
    price: number;
    file?: File;
  }): Promise<ContentItem | null> {
    try {
      const formData = new FormData();
      formData.append('title', contentData.title);
      formData.append('description', contentData.description);
      formData.append('type', contentData.type);
      formData.append('tier', contentData.tier);
      formData.append('price', contentData.price.toString());
      
      if (contentData.file) {
        formData.append('file', contentData.file);
      }

      const response = await apiService.post('/api/creator/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.content || null;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  /**
   * Update content
   */
  async updateContent(contentId: string, updates: Partial<ContentItem>): Promise<ContentItem | null> {
    try {
      const response = await apiService.put(`/api/creator/content/${contentId}`, updates);
      return response.data.content || null;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }

  /**
   * Delete content
   */
  async deleteContent(contentId: string): Promise<boolean> {
    try {
      await apiService.delete(`/api/creator/content/${contentId}`);
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      return false;
    }
  }

  /**
   * Get earnings breakdown
   */
  async getEarningsBreakdown(period: 'week' | 'month' | 'year' = 'month'): Promise<{
    subscriptions: number;
    tips: number;
    contentSales: number;
    commissions: number;
    total: number;
  }> {
    try {
      const response = await apiService.get('/api/creator/earnings', {
        params: { period }
      });
      return response.data.earnings;
    } catch (error) {
      console.error('Error fetching earnings breakdown:', error);
      return {
        subscriptions: 0,
        tips: 0,
        contentSales: 0,
        commissions: 0,
        total: 0
      };
    }
  }

  /**
   * Update subscription tier settings
   */
  async updateTierSettings(tier: string, settings: {
    price: number;
    benefits: string[];
    description: string;
  }): Promise<boolean> {
    try {
      await apiService.put(`/api/creator/tiers/${tier}`, settings);
      return true;
    } catch (error) {
      console.error('Error updating tier settings:', error);
      return false;
    }
  }

  /**
   * Send message to subscribers
   */
  async broadcastMessage(message: {
    title: string;
    content: string;
    tiers: string[];
    scheduled?: Date;
  }): Promise<boolean> {
    try {
      await apiService.post('/api/creator/broadcast', message);
      return true;
    } catch (error) {
      console.error('Error sending broadcast message:', error);
      return false;
    }
  }

  /**
   * Get creator analytics
   */
  async getAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<{
    profileViews: number;
    contentViews: number;
    newSubscribers: number;
    churnRate: number;
    engagementRate: number;
    conversionRate: number;
  }> {
    try {
      const response = await apiService.get('/api/creator/analytics', {
        params: { period }
      });
      return response.data.analytics;
    } catch (error) {
      console.error('Error fetching creator analytics:', error);
      return {
        profileViews: 0,
        contentViews: 0,
        newSubscribers: 0,
        churnRate: 0,
        engagementRate: 0,
        conversionRate: 0
      };
    }
  }
}

export const creatorDashboardAPI = new CreatorDashboardAPIService();

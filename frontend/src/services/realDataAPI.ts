import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class RealDataAPI {
  private client = axios.create({
    baseURL: `${API_BASE_URL}/real-data`,
    timeout: 10000
  });

  // Cache for hasRealData to prevent repeated API calls
  private hasRealDataCache: { result: boolean | null; timestamp: number } = {
    result: null,
    timestamp: 0
  };
  private readonly CACHE_DURATION = 5000; // 5 seconds cache

  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    try {
      const response = await this.client.get('/platform-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        success: false,
        stats: {
          totalUsers: 0,
          totalCreators: 0,
          totalContent: 0,
          totalSubscriptions: 0,
          totalRevenue: 0
        }
      };
    }
  }

  /**
   * Get real creators from database
   */
  async getRealCreators(limit: number = 12, offset: number = 0) {
    try {
      const response = await this.client.get('/creators', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching real creators:', error);
      return {
        success: false,
        creators: [],
        total: 0
      };
    }
  }

  /**
   * Get featured creators
   */
  async getFeaturedCreators(limit: number = 6) {
    try {
      const response = await this.client.get('/featured-creators', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured creators:', error);
      return {
        success: false,
        creators: []
      };
    }
  }

  /**
   * Get real content from database
   */
  async getRealContent(limit: number = 20, offset: number = 0, includePrivate: boolean = false) {
    try {
      const response = await this.client.get('/content', {
        params: { limit, offset, includePrivate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching real content:', error);
      return {
        success: false,
        content: [],
        total: 0
      };
    }
  }

  /**
   * Get trending content
   */
  async getTrendingContent(limit: number = 10) {
    try {
      const response = await this.client.get('/trending', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      return {
        success: false,
        content: []
      };
    }
  }

  /**
   * Search real users
   */
  async searchUsers(query: string, limit: number = 10) {
    try {
      if (!query || query.trim().length === 0) {
        return { success: true, users: [] };
      }

      const response = await this.client.get('/search/users', {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        users: []
      };
    }
  }

  /**
   * Get user by ID with full details
   */
  async getUserById(userId: string) {
    try {
      const response = await this.client.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return {
        success: false,
        user: null
      };
    }
  }

  /**
   * Get recent platform activity
   */
  async getRecentActivity(limit: number = 20) {
    try {
      const response = await this.client.get('/recent-activity', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return {
        success: false,
        activity: []
      };
    }
  }

  /**
   * Helper method to check if there are any real users in the database
   */
  async hasRealData() {
    try {
      const now = Date.now();
      
      // Check cache first
      if (this.hasRealDataCache.result !== null && 
          (now - this.hasRealDataCache.timestamp) < this.CACHE_DURATION) {
        return this.hasRealDataCache.result;
      }
      
      const stats = await this.getPlatformStats();
      const result = stats.success && (stats.stats.totalUsers > 0 || stats.stats.totalCreators > 0);
      
      // Cache the result
      this.hasRealDataCache = {
        result,
        timestamp: now
      };
      
      return result;
    } catch (error) {
      console.error('❌ hasRealData error:', error);
      return false;
    }
  }

  /**
   * Get combined content with creators (replacement for mock data)
   */
  async getContentWithCreators(limit: number = 20, offset: number = 0) {
    try {
      const contentResponse = await this.getRealContent(limit, offset);
      
      if (!contentResponse.success || !contentResponse.content) {
        return {
          success: false,
          contentWithCreators: []
        };
      }

      // Content already includes creator info from the database query
      const contentWithCreators = contentResponse.content.map((content: any) => ({
        content: {
          id: content.id,
          creatorId: content.creatorId,
          title: content.title,
          description: content.description,
          type: content.type,
          mediaUrl: content.mediaUrl,
          thumbnailUrl: content.thumbnailUrl,
          isPublic: content.isPublic,
          requiresSubscription: content.requiresSubscription,
          privacyLevel: content.privacyLevel,
          status: content.status,
          tags: content.tags,
          category: content.category,
          likesCount: content.likesCount,
          commentsCount: content.commentsCount,
          viewsCount: content.viewsCount,
          sharesCount: content.sharesCount,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt)
        },
        creator: content.creator
      }));

      return {
        success: true,
        contentWithCreators
      };
    } catch (error) {
      console.error('Error fetching content with creators:', error);
      return {
        success: false,
        contentWithCreators: []
      };
    }
  }

  /**
   * Get sorted content (replacement for mock data sorting)
   */
  async getSortedContent(limit: number = 20, offset: number = 0) {
    try {
      const response = await this.getContentWithCreators(limit, offset);
      
      if (!response.success) {
        return {
          success: false,
          sortedContent: []
        };
      }

      // Sort by: public content first, then by creation date (newest first)
      const sortedContent = response.contentWithCreators.sort((a: any, b: any) => {
        // First, prioritize public content
        if (a.content.privacyLevel === 'public' && b.content.privacyLevel !== 'public') {
          return -1;
        }
        if (a.content.privacyLevel !== 'public' && b.content.privacyLevel === 'public') {
          return 1;
        }
        
        // Then sort by date (newest first)
        return b.content.createdAt.getTime() - a.content.createdAt.getTime();
      });

      return {
        success: true,
        sortedContent
      };
    } catch (error) {
      console.error('Error getting sorted content:', error);
      return {
        success: false,
        sortedContent: []
      };
    }
  }
}

export const realDataAPI = new RealDataAPI();
export default realDataAPI;

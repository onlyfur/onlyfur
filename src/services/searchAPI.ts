interface APISearchRequest {
  query: string;
  filters?: {
    content_type?: string[];
    creator_type?: string[];
    date_range?: string;
    quality_threshold?: number;
    tags?: string[];
  };
  options?: {
    limit?: number;
    offset?: number;
    sort_by?: 'relevance' | 'date' | 'popularity' | 'quality';
    include_analytics?: boolean;
    include_suggestions?: boolean;
    search_mode?: 'neural' | 'traditional' | 'visual';
  };
  personalization?: {
    user_preferences?: any;
    search_history?: string[];
    enable_personalization?: boolean;
  };
}

interface APISearchResponse {
  success: boolean;
  data: {
    results: APISearchResult[];
    total_count: number;
    query_analytics: {
      processed_query: string;
      intent_detected: string;
      confidence_score: number;
      processing_time_ms: number;
    };
    suggestions?: {
      related_queries: string[];
      spelling_corrections: string[];
      auto_complete: string[];
    };
    pagination: {
      current_page: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
  meta: {
    api_version: string;
    request_id: string;
    timestamp: string;
    rate_limit: {
      remaining: number;
      reset_time: string;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface APISearchResult {
  id: string;
  type: 'creator' | 'content' | 'tag' | 'general';
  title: string;
  description: string;
  url: string;
  thumbnail_url?: string;
  creator: {
    id: string;
    name: string;
    verified: boolean;
    avatar_url?: string;
  };
  metadata: {
    tags: string[];
    category: string;
    quality_score: number;
    created_at: string;
    updated_at: string;
  };
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagement_rate: number;
  };
  relevance: {
    score: number;
    factors: string[];
    explanation: string;
  };
  personalization?: {
    recommendation_score: number;
    reasons: string[];
    similar_content: string[];
  };
}

interface APIKey {
  id: string;
  key: string;
  name: string;
  permissions: string[];
  rate_limit: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
  };
  usage: {
    current_minute: number;
    current_hour: number;
    current_day: number;
    last_reset: string;
  };
  created_at: string;
  last_used: string;
  is_active: boolean;
}

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  retry_config: {
    max_attempts: number;
    backoff_strategy: 'linear' | 'exponential';
  };
}

class SearchAPIService {
  private apiKeys: Map<string, APIKey> = new Map();
  private rateLimitCache: Map<string, any> = new Map();
  private webhooks: Map<string, WebhookConfig> = new Map();
  private requestLogs: any[] = [];

  constructor() {
    this.initializeDemoAPIKeys();
  }

  private initializeDemoAPIKeys(): void {
    const demoKey: APIKey = {
      id: 'demo-api-key-001',
      key: 'ofp_demo_12345abcdef67890',
      name: 'Demo API Key',
      permissions: ['search:read', 'analytics:read', 'suggestions:read'],
      rate_limit: {
        requests_per_minute: 60,
        requests_per_hour: 1000,
        requests_per_day: 10000
      },
      usage: {
        current_minute: 0,
        current_hour: 0,
        current_day: 0,
        last_reset: new Date().toISOString()
      },
      created_at: '2024-12-01T00:00:00Z',
      last_used: new Date().toISOString(),
      is_active: true
    };

    this.apiKeys.set(demoKey.key, demoKey);
  }

  // Authenticate API request
  private authenticateRequest(apiKey: string): { success: boolean; key?: APIKey; error?: string } {
    const key = this.apiKeys.get(apiKey);
    
    if (!key) {
      return { success: false, error: 'Invalid API key' };
    }
    
    if (!key.is_active) {
      return { success: false, error: 'API key is inactive' };
    }

    // Update last used
    key.last_used = new Date().toISOString();
    
    return { success: true, key };
  }

  // Check rate limits
  private checkRateLimit(apiKey: APIKey): { allowed: boolean; reset_time?: string } {
    const now = new Date();
    const currentMinute = Math.floor(now.getTime() / (60 * 1000));
    const currentHour = Math.floor(now.getTime() / (60 * 60 * 1000));
    const currentDay = Math.floor(now.getTime() / (24 * 60 * 60 * 1000));

    // Reset counters if needed
    const lastReset = new Date(apiKey.usage.last_reset);
    const lastResetMinute = Math.floor(lastReset.getTime() / (60 * 1000));
    const lastResetHour = Math.floor(lastReset.getTime() / (60 * 60 * 1000));
    const lastResetDay = Math.floor(lastReset.getTime() / (24 * 60 * 60 * 1000));

    if (currentMinute > lastResetMinute) {
      apiKey.usage.current_minute = 0;
    }
    if (currentHour > lastResetHour) {
      apiKey.usage.current_hour = 0;
    }
    if (currentDay > lastResetDay) {
      apiKey.usage.current_day = 0;
    }

    // Check limits
    if (apiKey.usage.current_minute >= apiKey.rate_limit.requests_per_minute) {
      const resetTime = new Date((currentMinute + 1) * 60 * 1000).toISOString();
      return { allowed: false, reset_time: resetTime };
    }
    
    if (apiKey.usage.current_hour >= apiKey.rate_limit.requests_per_hour) {
      const resetTime = new Date((currentHour + 1) * 60 * 60 * 1000).toISOString();
      return { allowed: false, reset_time: resetTime };
    }
    
    if (apiKey.usage.current_day >= apiKey.rate_limit.requests_per_day) {
      const resetTime = new Date((currentDay + 1) * 24 * 60 * 60 * 1000).toISOString();
      return { allowed: false, reset_time: resetTime };
    }

    // Increment counters
    apiKey.usage.current_minute++;
    apiKey.usage.current_hour++;
    apiKey.usage.current_day++;
    apiKey.usage.last_reset = now.toISOString();

    return { allowed: true };
  }

  // Main search API endpoint
  async search(request: APISearchRequest, apiKeyString: string): Promise<APISearchResponse> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Authenticate
      const auth = this.authenticateRequest(apiKeyString);
      if (!auth.success || !auth.key) {
        return this.createErrorResponse(requestId, 'AUTH_ERROR', auth.error || 'Authentication failed');
      }

      // Check rate limits
      const rateLimit = this.checkRateLimit(auth.key);
      if (!rateLimit.allowed) {
        return this.createErrorResponse(requestId, 'RATE_LIMIT_EXCEEDED', 'Rate limit exceeded', {
          reset_time: rateLimit.reset_time
        });
      }

      // Validate request
      const validation = this.validateSearchRequest(request);
      if (!validation.valid) {
        return this.createErrorResponse(requestId, 'INVALID_REQUEST', validation.error);
      }

      // Process search
      const searchResults = await this.processSearch(request);
      
      // Generate response
      const response = this.createSuccessResponse(
        requestId, 
        searchResults, 
        request, 
        Date.now() - startTime,
        auth.key
      );

      // Log request
      this.logRequest(requestId, apiKeyString, request, response, Date.now() - startTime);

      // Trigger webhooks if configured
      await this.triggerWebhooks('search.completed', { request, response });

      return response;

    } catch (error) {
      return this.createErrorResponse(requestId, 'INTERNAL_ERROR', 'Internal server error', error);
    }
  }

  private validateSearchRequest(request: APISearchRequest): { valid: boolean; error?: string } {
    if (!request.query || request.query.trim().length === 0) {
      return { valid: false, error: 'Query parameter is required' };
    }

    if (request.query.length > 500) {
      return { valid: false, error: 'Query too long (max 500 characters)' };
    }

    if (request.options?.limit && (request.options.limit < 1 || request.options.limit > 100)) {
      return { valid: false, error: 'Limit must be between 1 and 100' };
    }

    if (request.options?.offset && request.options.offset < 0) {
      return { valid: false, error: 'Offset must be non-negative' };
    }

    return { valid: true };
  }

  private async processSearch(request: APISearchRequest): Promise<any> {
    // This would integrate with the actual search services
    // For demo, return mock results
    
    const mockResults: APISearchResult[] = [
      {
        id: 'creator-1',
        type: 'creator',
        title: 'FurryArtist_Pro',
        description: 'Professional digital artist specializing in character design and commissions',
        url: '/profile/furryartist-pro',
        thumbnail_url: '/images/branding/fox-mascot.webp',
        creator: {
          id: 'creator-1',
          name: 'FurryArtist_Pro',
          verified: true,
          avatar_url: '/images/branding/fox-mascot.webp'
        },
        metadata: {
          tags: ['digital-art', 'character-design', 'commissions'],
          category: 'creator',
          quality_score: 0.95,
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-12-01T00:00:00Z'
        },
        metrics: {
          views: 250000,
          likes: 18500,
          comments: 1200,
          shares: 450,
          engagement_rate: 0.078
        },
        relevance: {
          score: 0.95,
          factors: ['keyword_match', 'quality_score', 'user_engagement'],
          explanation: 'High relevance due to strong keyword match and excellent user engagement'
        },
        personalization: {
          recommendation_score: 0.88,
          reasons: ['matches_your_interests', 'similar_to_previous_searches'],
          similar_content: ['creator-2', 'content-1']
        }
      },
      {
        id: 'content-1',
        type: 'content',
        title: 'Digital Art Masterclass: Character Design Fundamentals',
        description: 'Complete guide to creating compelling furry characters with professional techniques',
        url: '/content/digital-art-masterclass',
        thumbnail_url: '/images/branding/fox-mascot.webp',
        creator: {
          id: 'creator-1',
          name: 'FurryArtist_Pro',
          verified: true,
          avatar_url: '/images/branding/fox-mascot.webp'
        },
        metadata: {
          tags: ['tutorial', 'character-design', 'digital-art'],
          category: 'tutorial',
          quality_score: 0.92,
          created_at: '2024-12-01T00:00:00Z',
          updated_at: '2024-12-01T00:00:00Z'
        },
        metrics: {
          views: 1200,
          likes: 89,
          comments: 23,
          shares: 15,
          engagement_rate: 0.106
        },
        relevance: {
          score: 0.92,
          factors: ['content_match', 'recent_content', 'high_engagement'],
          explanation: 'Excellent match for character design tutorials with high user engagement'
        },
        personalization: {
          recommendation_score: 0.85,
          reasons: ['matches_tutorial_preference', 'from_followed_creator'],
          similar_content: ['content-2', 'content-3']
        }
      }
    ];

    // Apply filters
    let filteredResults = mockResults;
    
    if (request.filters?.content_type) {
      filteredResults = filteredResults.filter(result => 
        request.filters!.content_type!.includes(result.type)
      );
    }

    if (request.filters?.quality_threshold) {
      filteredResults = filteredResults.filter(result => 
        result.metadata.quality_score >= request.filters!.quality_threshold!
      );
    }

    // Apply sorting
    if (request.options?.sort_by) {
      switch (request.options.sort_by) {
        case 'relevance':
          filteredResults.sort((a, b) => b.relevance.score - a.relevance.score);
          break;
        case 'date':
          filteredResults.sort((a, b) => 
            new Date(b.metadata.created_at).getTime() - new Date(a.metadata.created_at).getTime()
          );
          break;
        case 'popularity':
          filteredResults.sort((a, b) => b.metrics.views - a.metrics.views);
          break;
        case 'quality':
          filteredResults.sort((a, b) => b.metadata.quality_score - a.metadata.quality_score);
          break;
      }
    }

    // Apply pagination
    const limit = request.options?.limit || 10;
    const offset = request.options?.offset || 0;
    const paginatedResults = filteredResults.slice(offset, offset + limit);

    return {
      results: paginatedResults,
      total_count: filteredResults.length,
      processed_query: request.query,
      intent_detected: this.detectIntent(request.query),
      suggestions: request.options?.include_suggestions ? this.generateSuggestions(request.query) : undefined
    };
  }

  private detectIntent(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('tutorial') || lowerQuery.includes('guide') || lowerQuery.includes('how')) {
      return 'tutorial_search';
    } else if (lowerQuery.includes('creator') || lowerQuery.includes('artist') || lowerQuery.includes('user')) {
      return 'creator_search';
    } else if (lowerQuery.includes('commission') || lowerQuery.includes('price') || lowerQuery.includes('buy')) {
      return 'commission_search';
    }
    
    return 'general_search';
  }

  private generateSuggestions(query: string): any {
    return {
      related_queries: [
        `${query} tutorial`,
        `${query} guide`,
        `best ${query}`,
        `${query} examples`
      ],
      spelling_corrections: [],
      auto_complete: [
        `${query} basics`,
        `${query} advanced`,
        `${query} tips`,
        `${query} community`
      ]
    };
  }

  private createSuccessResponse(
    requestId: string, 
    searchResults: any, 
    request: APISearchRequest, 
    processingTime: number,
    apiKey: APIKey
  ): APISearchResponse {
    const limit = request.options?.limit || 10;
    const offset = request.options?.offset || 0;
    const totalPages = Math.ceil(searchResults.total_count / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      success: true,
      data: {
        results: searchResults.results,
        total_count: searchResults.total_count,
        query_analytics: {
          processed_query: searchResults.processed_query,
          intent_detected: searchResults.intent_detected,
          confidence_score: 0.85,
          processing_time_ms: processingTime
        },
        suggestions: searchResults.suggestions,
        pagination: {
          current_page: currentPage,
          total_pages: totalPages,
          has_next: currentPage < totalPages,
          has_previous: currentPage > 1
        }
      },
      meta: {
        api_version: '2.7.0',
        request_id: requestId,
        timestamp: new Date().toISOString(),
        rate_limit: {
          remaining: apiKey.rate_limit.requests_per_minute - apiKey.usage.current_minute,
          reset_time: new Date(Date.now() + 60000).toISOString()
        }
      }
    };
  }

  private createErrorResponse(requestId: string, code: string, message: string, details?: any): APISearchResponse {
    return {
      success: false,
      data: {
        results: [],
        total_count: 0,
        query_analytics: {
          processed_query: '',
          intent_detected: 'error',
          confidence_score: 0,
          processing_time_ms: 0
        },
        pagination: {
          current_page: 1,
          total_pages: 0,
          has_next: false,
          has_previous: false
        }
      },
      meta: {
        api_version: '2.7.0',
        request_id: requestId,
        timestamp: new Date().toISOString(),
        rate_limit: {
          remaining: 0,
          reset_time: new Date().toISOString()
        }
      },
      error: {
        code,
        message,
        details
      }
    };
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log API requests
  private logRequest(requestId: string, apiKey: string, request: any, response: any, duration: number): void {
    const logEntry = {
      request_id: requestId,
      api_key: apiKey.substring(0, 8) + '...',
      timestamp: new Date().toISOString(),
      method: 'search',
      query: request.query,
      filters: request.filters,
      options: request.options,
      success: response.success,
      result_count: response.data.total_count,
      processing_time_ms: duration,
      error_code: response.error?.code
    };

    this.requestLogs.push(logEntry);
    
    // Keep only last 1000 requests
    if (this.requestLogs.length > 1000) {
      this.requestLogs.shift();
    }
  }

  // Webhook functionality
  private async triggerWebhooks(event: string, data: any): Promise<void> {
    for (const webhook of this.webhooks.values()) {
      if (webhook.active && webhook.events.includes(event)) {
        try {
          await this.sendWebhook(webhook, event, data);
        } catch (error) {
          console.error(`Webhook failed for ${webhook.url}:`, error);
        }
      }
    }
  }

  private async sendWebhook(webhook: WebhookConfig, event: string, data: any): Promise<void> {
    const payload = {
      event,
      data,
      webhook_id: webhook.id,
      timestamp: new Date().toISOString()
    };

    // In a real implementation, this would make an HTTP request
    console.log(`Webhook ${webhook.id}: ${event}`, payload);
  }

  // API Key management
  generateAPIKey(name: string, permissions: string[]): APIKey {
    const key: APIKey = {
      id: `key-${Date.now()}`,
      key: `ofp_${this.generateRandomString(32)}`,
      name,
      permissions,
      rate_limit: {
        requests_per_minute: 60,
        requests_per_hour: 1000,
        requests_per_day: 10000
      },
      usage: {
        current_minute: 0,
        current_hour: 0,
        current_day: 0,
        last_reset: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      is_active: true
    };

    this.apiKeys.set(key.key, key);
    return key;
  }

  private generateRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Get API analytics
  getAPIAnalytics(apiKey: string): any {
    const key = this.apiKeys.get(apiKey);
    if (!key) return null;

    const logs = this.requestLogs.filter(log => log.api_key === apiKey.substring(0, 8) + '...');
    
    return {
      total_requests: logs.length,
      successful_requests: logs.filter(log => log.success).length,
      error_rate: logs.length > 0 ? logs.filter(log => !log.success).length / logs.length : 0,
      avg_processing_time: logs.length > 0 ? 
        logs.reduce((sum, log) => sum + log.processing_time_ms, 0) / logs.length : 0,
      rate_limit_usage: {
        current_minute: key.usage.current_minute,
        current_hour: key.usage.current_hour,
        current_day: key.usage.current_day,
        limits: key.rate_limit
      },
      last_used: key.last_used
    };
  }

  // Batch search endpoint
  async batchSearch(requests: APISearchRequest[], apiKey: string): Promise<APISearchResponse[]> {
    const results: APISearchResponse[] = [];
    
    for (const request of requests) {
      const result = await this.search(request, apiKey);
      results.push(result);
      
      // Add small delay to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    return results;
  }

  // Health check endpoint
  healthCheck(): { status: string; version: string; uptime: number; services: any } {
    return {
      status: 'healthy',
      version: '2.7.0',
      uptime: Date.now(),
      services: {
        search: 'operational',
        neural_search: 'operational',
        visual_search: 'operational',
        analytics: 'operational',
        rate_limiting: 'operational'
      }
    };
  }

  // Get API documentation
  getAPIDocumentation(): any {
    return {
      version: '2.7.0',
      base_url: 'https://api.onlyfur.com/v2.7',
      authentication: {
        type: 'API Key',
        header: 'X-API-Key',
        description: 'Include your API key in the X-API-Key header'
      },
      endpoints: {
        search: {
          method: 'POST',
          path: '/search',
          description: 'Search for content, creators, and more',
          parameters: {
            query: { type: 'string', required: true, description: 'Search query' },
            filters: { type: 'object', required: false, description: 'Search filters' },
            options: { type: 'object', required: false, description: 'Search options' }
          }
        },
        batch_search: {
          method: 'POST',
          path: '/search/batch',
          description: 'Perform multiple searches in one request',
          parameters: {
            requests: { type: 'array', required: true, description: 'Array of search requests' }
          }
        },
        analytics: {
          method: 'GET',
          path: '/analytics',
          description: 'Get API usage analytics',
          parameters: {}
        },
        health: {
          method: 'GET',
          path: '/health',
          description: 'Check API health status',
          parameters: {}
        }
      },
      rate_limits: {
        default: {
          requests_per_minute: 60,
          requests_per_hour: 1000,
          requests_per_day: 10000
        }
      },
      examples: {
        basic_search: {
          request: {
            query: 'digital art tutorial',
            options: { limit: 10, sort_by: 'relevance' }
          }
        }
      }
    };
  }
}

export const searchAPIService = new SearchAPIService();
export type { APISearchRequest, APISearchResponse, APISearchResult, APIKey };

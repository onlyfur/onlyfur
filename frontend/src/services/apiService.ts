/**
 * Centralized API service to prevent CORS spam and manage API calls
 */

import { buildApiUrl, apiFetch } from '@/utils/apiConfig';

class ApiService {
  private requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly DEFAULT_CACHE_TTL = 30000; // 30 seconds
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests to same endpoint
  private lastRequestTimes = new Map<string, number>();

  /**
   * Get data with caching to prevent repeated requests
   */
  async get<T = any>(
    endpoint: string, 
    options: RequestInit = {}, 
    cacheTtl: number = this.DEFAULT_CACHE_TTL
  ): Promise<T> {
    const cacheKey = `GET:${endpoint}`;
    
    // Check cache first
    const cached = this.getCachedData<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Check if request is already in progress
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Rate limiting
    await this.enforceRateLimit(cacheKey);

    // Make the request
    const promise = this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
    this.pendingRequests.set(cacheKey, promise);

    try {
      const result = await promise;
      
      // Cache successful responses
      this.setCachedData(cacheKey, result, cacheTtl);
      
      return result;
    } catch (error) {
      // Don't cache errors, but log them appropriately
      if (import.meta.env?.DEV) {
        console.error(`API GET request failed: ${endpoint}`, error);
      }
      throw error;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Post data without caching
   */
  async post<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const cacheKey = `POST:${endpoint}`;
    
    // Rate limiting
    await this.enforceRateLimit(cacheKey);

    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Put data without caching
   */
  async put<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const cacheKey = `PUT:${endpoint}`;
    
    // Rate limiting
    await this.enforceRateLimit(cacheKey);

    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Delete data without caching
   */
  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cacheKey = `DELETE:${endpoint}`;
    
    // Rate limiting
    await this.enforceRateLimit(cacheKey);

    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Make a raw request with error handling
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    try {
      const response = await apiFetch(endpoint, options);
      
      if (!response.ok) {
        // Handle different error types
        if (response.status === 401) {
          // Unauthorized - clear auth tokens
          localStorage.removeItem('onlyfur_auth_token');
          localStorage.removeItem('auth_token');
          throw new Error('Authentication required');
        } else if (response.status === 403) {
          throw new Error('Access forbidden');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error(`Request failed: ${response.status}`);
        }
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // Only log in development to prevent console spam
      if (import.meta.env?.DEV) {
        console.error(`API request failed: ${endpoint}`, error);
      }
      throw error;
    }
  }

  /**
   * Get cached data if available and not expired
   */
  private getCachedData<T>(key: string): T | null {
    const cached = this.requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    
    // Remove expired cache
    if (cached) {
      this.requestCache.delete(key);
    }
    
    return null;
  }

  /**
   * Set cached data with TTL
   */
  private setCachedData<T>(key: string, data: T, ttl: number): void {
    this.requestCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Cleanup old cache entries occasionally
    if (this.requestCache.size > 100) {
      this.cleanupCache();
    }
  }

  /**
   * Enforce rate limiting between requests
   */
  private async enforceRateLimit(key: string): Promise<void> {
    const lastRequest = this.lastRequestTimes.get(key);
    if (lastRequest) {
      const timeSinceLastRequest = Date.now() - lastRequest;
      if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
        await new Promise(resolve => 
          setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest)
        );
      }
    }
    this.lastRequestTimes.set(key, Date.now());
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.requestCache.entries()) {
      if (now - cached.timestamp >= cached.ttl) {
        this.requestCache.delete(key);
      }
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.requestCache.clear();
  }

  /**
   * Clear cache for specific endpoint pattern
   */
  clearCachePattern(pattern: string): void {
    for (const key of this.requestCache.keys()) {
      if (key.includes(pattern)) {
        this.requestCache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats() {
    return {
      size: this.requestCache.size,
      pendingRequests: this.pendingRequests.size,
      rateLimitedEndpoints: this.lastRequestTimes.size
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

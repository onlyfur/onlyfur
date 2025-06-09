import { prisma } from './database';
import { logger } from '../middleware/logger';
import { aiEngineService } from './aiEngine';

export interface SearchQuery {
  query: string;
  filters?: {
    type?: 'users' | 'content' | 'posts' | 'streams' | 'all';
    category?: string;
    tags?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    priceRange?: {
      min: number;
      max: number;
    };
    rating?: {
      min: number;
      max: number;
    };
    verified?: boolean;
    premium?: boolean;
    location?: string;
    language?: string;
  };
  sort?: {
    field: 'relevance' | 'date' | 'popularity' | 'rating' | 'price';
    order: 'asc' | 'desc';
  };
  pagination?: {
    limit: number;
    offset: number;
  };
  userId?: string; // For personalized results
}

export interface SearchResult {
  id: string;
  type: 'user' | 'content' | 'post' | 'stream';
  title: string;
  description: string;
  thumbnail?: string;
  url: string;
  score: number;
  relevanceScore: number;
  semanticScore: number;
  popularityScore: number;
  personalizedScore?: number;
  metadata: Record<string, any>;
  highlights: {
    title?: string[];
    description?: string[];
    tags?: string[];
  };
  matchReason: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchAnalytics {
  query: string;
  userId?: string;
  resultCount: number;
  clickedResults: string[];
  timeSpent: number;
  filters: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userAgent: string;
  location?: string;
}

export interface SearchSuggestion {
  text: string;
  type: 'completion' | 'correction' | 'related';
  score: number;
  category?: string;
}

export interface SearchTrend {
  query: string;
  count: number;
  growth: number;
  category: string;
  period: 'hour' | 'day' | 'week' | 'month';
}

/**
 * Enhanced AI Search Service - Advanced semantic search with ML
 */
export class EnhancedAISearchService {
  private static instance: EnhancedAISearchService;
  private searchIndex: Map<string, any> = new Map();
  private queryCache: Map<string, SearchResult[]> = new Map();
  private popularQueries: Map<string, number> = new Map();

  static getInstance(): EnhancedAISearchService {
    if (!EnhancedAISearchService.instance) {
      EnhancedAISearchService.instance = new EnhancedAISearchService();
    }
    return EnhancedAISearchService.instance;
  }

  /**
   * Main search function with AI-powered ranking
   */
  async search(searchQuery: SearchQuery): Promise<{
    results: SearchResult[];
    totalCount: number;
    suggestions: SearchSuggestion[];
    facets: Record<string, any>;
    searchTime: number;
    queryId: string;
  }> {
    const startTime = Date.now();
    const queryId = this.generateQueryId();

    try {
      // Log search analytics
      await this.logSearchAnalytics({
        query: searchQuery.query,
        userId: searchQuery.userId,
        filters: searchQuery.filters || {},
        queryId,
        timestamp: new Date()
      });

      // Process and enhance the query
      const processedQuery = await this.processQuery(searchQuery.query);
      const expandedQuery = await this.expandQuery(processedQuery, searchQuery.userId);

      // Check cache first
      const cacheKey = this.generateCacheKey(searchQuery);
      const cachedResults = this.queryCache.get(cacheKey);
      if (cachedResults) {
        return {
          results: cachedResults,
          totalCount: cachedResults.length,
          suggestions: [],
          facets: {},
          searchTime: Date.now() - startTime,
          queryId
        };
      }

      // Perform multi-stage search
      const searchResults = await this.performMultiStageSearch(expandedQuery, searchQuery);

      // Apply AI-powered ranking
      const rankedResults = await this.applyAIRanking(searchResults, searchQuery);

      // Generate search suggestions
      const suggestions = await this.generateSuggestions(searchQuery.query);

      // Generate facets for filtering
      const facets = await this.generateFacets(searchResults, searchQuery);

      // Cache results
      this.cacheResults(cacheKey, rankedResults);

      // Update search trends
      await this.updateSearchTrends(searchQuery.query);

      const searchTime = Date.now() - startTime;

      logger.info('AI search completed', {
        query: searchQuery.query,
        resultCount: rankedResults.length,
        searchTime,
        queryId
      });

      return {
        results: rankedResults,
        totalCount: rankedResults.length,
        suggestions,
        facets,
        searchTime,
        queryId
      };

    } catch (error) {
      logger.error('AI search failed', {
        query: searchQuery.query,
        error: error.message,
        queryId
      });
      throw error;
    }
  }

  /**
   * Process and clean the search query
   */
  private async processQuery(query: string): Promise<{
    original: string;
    cleaned: string;
    tokens: string[];
    entities: Array<{ text: string; type: string; confidence: number; }>;
    intent: string;
    language: string;
  }> {
    try {
      // Clean and normalize the query
      const cleaned = query
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ');

      // Tokenize
      const tokens = cleaned.split(' ').filter(token => token.length > 1);

      // Extract entities using AI
      const entities = await this.extractEntities(query);

      // Detect intent
      const intent = await this.detectIntent(query);

      // Detect language
      const language = await this.detectLanguage(query);

      return {
        original: query,
        cleaned,
        tokens,
        entities,
        intent,
        language
      };

    } catch (error) {
      logger.error('Failed to process query', { query, error: error.message });
      return {
        original: query,
        cleaned: query.toLowerCase().trim(),
        tokens: query.toLowerCase().split(' '),
        entities: [],
        intent: 'search',
        language: 'en'
      };
    }
  }

  /**
   * Expand query with synonyms and related terms
   */
  private async expandQuery(processedQuery: any, userId?: string): Promise<{
    originalTerms: string[];
    expandedTerms: string[];
    synonyms: string[];
    relatedTerms: string[];
    personalizedTerms: string[];
  }> {
    try {
      const { tokens, entities } = processedQuery;

      // Get synonyms for each token
      const synonyms = await this.getSynonyms(tokens);

      // Get related terms based on user behavior
      const relatedTerms = await this.getRelatedTerms(tokens);

      // Get personalized terms if user is provided
      const personalizedTerms = userId ? await this.getPersonalizedTerms(tokens, userId) : [];

      // Combine all terms
      const expandedTerms = [
        ...tokens,
        ...synonyms,
        ...relatedTerms,
        ...personalizedTerms
      ].filter((term, index, self) => self.indexOf(term) === index);

      return {
        originalTerms: tokens,
        expandedTerms,
        synonyms,
        relatedTerms,
        personalizedTerms
      };

    } catch (error) {
      logger.error('Failed to expand query', { error: error.message });
      return {
        originalTerms: processedQuery.tokens,
        expandedTerms: processedQuery.tokens,
        synonyms: [],
        relatedTerms: [],
        personalizedTerms: []
      };
    }
  }

  /**
   * Perform multi-stage search across different content types
   */
  private async performMultiStageSearch(expandedQuery: any, searchQuery: SearchQuery): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    try {
      // Stage 1: Exact match search
      const exactMatches = await this.performExactSearch(expandedQuery.originalTerms, searchQuery);
      results.push(...exactMatches);

      // Stage 2: Fuzzy/partial match search
      const fuzzyMatches = await this.performFuzzySearch(expandedQuery.expandedTerms, searchQuery);
      results.push(...fuzzyMatches);

      // Stage 3: Semantic search using embeddings
      const semanticMatches = await this.performSemanticSearch(searchQuery.query, searchQuery);
      results.push(...semanticMatches);

      // Stage 4: Tag-based search
      const tagMatches = await this.performTagSearch(expandedQuery.expandedTerms, searchQuery);
      results.push(...tagMatches);

      // Remove duplicates while preserving the best score for each item
      const uniqueResults = this.deduplicateResults(results);

      return uniqueResults;

    } catch (error) {
      logger.error('Multi-stage search failed', { error: error.message });
      return [];
    }
  }

  /**
   * Apply AI-powered ranking to search results
   */
  private async applyAIRanking(results: SearchResult[], searchQuery: SearchQuery): Promise<SearchResult[]> {
    try {
      const rankedResults = await Promise.all(
        results.map(async (result) => {
          // Calculate various scoring components
          const relevanceScore = await this.calculateRelevanceScore(result, searchQuery.query);
          const popularityScore = await this.calculatePopularityScore(result);
          const freshnessScore = this.calculateFreshnessScore(result);
          const qualityScore = await this.calculateQualityScore(result);
          const personalizedScore = searchQuery.userId 
            ? await this.calculatePersonalizedScore(result, searchQuery.userId)
            : 0;

          // Apply ML model for final scoring
          const finalScore = await this.applyMLScoring({
            relevanceScore,
            popularityScore,
            freshnessScore,
            qualityScore,
            personalizedScore,
            result,
            query: searchQuery.query
          });

          return {
            ...result,
            score: finalScore,
            relevanceScore,
            popularityScore,
            personalizedScore
          };
        })
      );

      // Sort by final score
      rankedResults.sort((a, b) => b.score - a.score);

      // Apply pagination
      const { limit = 20, offset = 0 } = searchQuery.pagination || {};
      return rankedResults.slice(offset, offset + limit);

    } catch (error) {
      logger.error('AI ranking failed', { error: error.message });
      return results;
    }
  }

  /**
   * Generate search suggestions and autocomplete
   */
  private async generateSuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      const suggestions: SearchSuggestion[] = [];

      // Query completion suggestions
      const completions = await this.getQueryCompletions(query);
      suggestions.push(...completions.map(text => ({
        text,
        type: 'completion' as const,
        score: 0.8
      })));

      // Spelling corrections
      const corrections = await this.getSpellingCorrections(query);
      suggestions.push(...corrections.map(text => ({
        text,
        type: 'correction' as const,
        score: 0.9
      })));

      // Related queries
      const related = await this.getRelatedQueries(query);
      suggestions.push(...related.map(text => ({
        text,
        type: 'related' as const,
        score: 0.7
      })));

      // Sort by score and limit results
      return suggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    } catch (error) {
      logger.error('Failed to generate suggestions', { query, error: error.message });
      return [];
    }
  }

  /**
   * Extract named entities from query using AI
   */
  private async extractEntities(query: string): Promise<Array<{ text: string; type: string; confidence: number; }>> {
    try {
      // Use AI service for entity extraction
      const entities = await aiEngineService.extractEntities(query);
      return entities || [];
    } catch (error) {
      logger.error('Entity extraction failed', { query, error: error.message });
      return [];
    }
  }

  /**
   * Detect user intent from query
   */
  private async detectIntent(query: string): Promise<string> {
    try {
      // Use AI to classify intent
      const intent = await aiEngineService.classifyIntent(query);
      return intent || 'search';
    } catch (error) {
      logger.error('Intent detection failed', { query, error: error.message });
      return 'search';
    }
  }

  /**
   * Detect query language
   */
  private async detectLanguage(query: string): Promise<string> {
    try {
      // Simple language detection - could be enhanced with proper NLP
      const commonEnglishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
      const words = query.toLowerCase().split(' ');
      const englishWordCount = words.filter(word => commonEnglishWords.includes(word)).length;
      
      return englishWordCount > 0 || /^[a-zA-Z\s]*$/.test(query) ? 'en' : 'unknown';
    } catch (error) {
      return 'en';
    }
  }

  /**
   * Get synonyms for search terms
   */
  private async getSynonyms(terms: string[]): Promise<string[]> {
    try {
      const synonyms: string[] = [];
      
      // Basic synonym mapping - could be enhanced with external APIs
      const synonymMap: Record<string, string[]> = {
        'furry': ['anthro', 'anthropomorphic', 'fursuit'],
        'art': ['artwork', 'drawing', 'illustration', 'design'],
        'commission': ['custom', 'request', 'order'],
        'cute': ['adorable', 'sweet', 'lovely'],
        'sexy': ['hot', 'attractive', 'sensual'],
        'character': ['char', 'oc', 'persona'],
        'video': ['clip', 'movie', 'film'],
        'photo': ['picture', 'image', 'pic']
      };

      for (const term of terms) {
        if (synonymMap[term]) {
          synonyms.push(...synonymMap[term]);
        }
      }

      return synonyms;
    } catch (error) {
      return [];
    }
  }

  /**
   * Perform exact match search
   */
  private async performExactSearch(terms: string[], searchQuery: SearchQuery): Promise<SearchResult[]> {
    // Implementation would search database for exact matches
    return [];
  }

  /**
   * Perform fuzzy/partial match search
   */
  private async performFuzzySearch(terms: string[], searchQuery: SearchQuery): Promise<SearchResult[]> {
    // Implementation would search database for fuzzy matches
    return [];
  }

  /**
   * Perform semantic search using embeddings
   */
  private async performSemanticSearch(query: string, searchQuery: SearchQuery): Promise<SearchResult[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await aiEngineService.generateEmbedding(query);
      
      // Find similar content using vector similarity
      // This would require a vector database or similarity search
      return [];
    } catch (error) {
      logger.error('Semantic search failed', { error: error.message });
      return [];
    }
  }

  /**
   * Perform tag-based search
   */
  private async performTagSearch(terms: string[], searchQuery: SearchQuery): Promise<SearchResult[]> {
    // Implementation would search content by tags
    return [];
  }

  /**
   * Remove duplicate results while preserving best scores
   */
  private deduplicateResults(results: SearchResult[]): SearchResult[] {
    const uniqueResults = new Map<string, SearchResult>();
    
    for (const result of results) {
      const existing = uniqueResults.get(result.id);
      if (!existing || result.score > existing.score) {
        uniqueResults.set(result.id, result);
      }
    }
    
    return Array.from(uniqueResults.values());
  }

  /**
   * Calculate relevance score based on query-result matching
   */
  private async calculateRelevanceScore(result: SearchResult, query: string): Promise<number> {
    // Calculate text similarity, keyword matching, etc.
    return Math.random(); // Placeholder
  }

  /**
   * Calculate popularity score based on engagement metrics
   */
  private async calculatePopularityScore(result: SearchResult): Promise<number> {
    // Factor in views, likes, comments, shares, etc.
    return Math.random(); // Placeholder
  }

  /**
   * Calculate freshness score based on content age
   */
  private calculateFreshnessScore(result: SearchResult): number {
    const ageInDays = (Date.now() - result.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - ageInDays / 365); // Decay over a year
  }

  /**
   * Calculate quality score based on various quality signals
   */
  private async calculateQualityScore(result: SearchResult): Promise<number> {
    // Factor in user ratings, reports, verification status, etc.
    return Math.random(); // Placeholder
  }

  /**
   * Calculate personalized score based on user preferences
   */
  private async calculatePersonalizedScore(result: SearchResult, userId: string): Promise<number> {
    // Factor in user's past interactions, preferences, subscriptions, etc.
    return Math.random(); // Placeholder
  }

  /**
   * Apply machine learning model for final scoring
   */
  private async applyMLScoring(data: any): Promise<number> {
    try {
      // This would use a trained ML model to predict the final score
      const weights = {
        relevance: 0.4,
        popularity: 0.2,
        freshness: 0.1,
        quality: 0.2,
        personalized: 0.1
      };

      return (
        data.relevanceScore * weights.relevance +
        data.popularityScore * weights.popularity +
        data.freshnessScore * weights.freshness +
        data.qualityScore * weights.quality +
        data.personalizedScore * weights.personalized
      );
    } catch (error) {
      return data.relevanceScore || 0.5;
    }
  }

  // Helper methods for search functionality
  private generateQueryId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(searchQuery: SearchQuery): string {
    return `search_${JSON.stringify(searchQuery)}`;
  }

  private cacheResults(cacheKey: string, results: SearchResult[]): void {
    // Implement LRU cache with TTL
    this.queryCache.set(cacheKey, results);
    
    // Clean old cache entries if cache is too large
    if (this.queryCache.size > 1000) {
      const firstKey = this.queryCache.keys().next().value;
      this.queryCache.delete(firstKey);
    }
  }

  async logSearchAnalytics(data: any): Promise<void> {
    try {
      await prisma.searchAnalytics.create({
        data: {
          queryId: data.queryId,
          userId: data.userId,
          query: data.query || '',
          resultCount: data.resultCount || 0,
          filters: JSON.stringify(data.filters || {}),
          clickedResults: JSON.stringify(data.clickedResults || []),
          timeSpent: data.timeSpent,
          sessionId: data.sessionId,
          userAgent: data.userAgent,
          location: data.location,
          timestamp: data.timestamp || new Date()
        }
      });
    } catch (error) {
      logger.error('Failed to log search analytics', { error: error.message });
    }
  }

  private async updateSearchTrends(query: string): Promise<void> {
    try {
      const now = new Date();
      const period = 'day';
      
      await prisma.searchTrend.upsert({
        where: {
          query_period_timestamp: {
            query,
            period,
            timestamp: now
          }
        },
        update: {
          count: { increment: 1 }
        },
        create: {
          query,
          count: 1,
          growth: 0,
          category: 'general',
          period,
          timestamp: now
        }
      });

      // Update in-memory cache
      const currentCount = this.popularQueries.get(query) || 0;
      this.popularQueries.set(query, currentCount + 1);
    } catch (error) {
      logger.error('Failed to update search trends', { query, error: error.message });
    }
  }

  private async getQueryCompletions(query: string): Promise<string[]> {
    try {
      // Get popular searches that start with the query
      const trends = await prisma.searchTrend.findMany({
        where: {
          query: { startsWith: query, mode: 'insensitive' },
          period: 'day'
        },
        orderBy: { count: 'desc' },
        take: 5
      });

      return trends.map(trend => trend.query);
    } catch (error) {
      logger.error('Failed to get query completions', { query, error: error.message });
      return [];
    }
  }

  private async getSpellingCorrections(query: string): Promise<string[]> {
    try {
      // Simple spelling correction using Levenshtein distance
      const popularQueries = Array.from(this.popularQueries.keys());
      const corrections = popularQueries
        .map(popular => ({
          query: popular,
          distance: this.levenshteinDistance(query.toLowerCase(), popular.toLowerCase())
        }))
        .filter(item => item.distance <= 2 && item.distance > 0)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map(item => item.query);

      return corrections;
    } catch (error) {
      logger.error('Failed to get spelling corrections', { query, error: error.message });
      return [];
    }
  }

  private async getRelatedQueries(query: string): Promise<string[]> {
    try {
      // Get queries that users searched after this query
      const relatedAnalytics = await prisma.searchAnalytics.findMany({
        where: {
          query: { contains: query, mode: 'insensitive' }
        },
        distinct: ['query'],
        orderBy: { timestamp: 'desc' },
        take: 5
      });

      return relatedAnalytics
        .map(analytics => analytics.query)
        .filter(q => q !== query);
    } catch (error) {
      logger.error('Failed to get related queries', { query, error: error.message });
      return [];
    }
  }

  private async getRelatedTerms(terms: string[]): Promise<string[]> {
    try {
      const relatedTerms = new Set<string>();
      
      // Basic co-occurrence analysis
      for (const term of terms) {
        const coOccurringQueries = await prisma.searchAnalytics.findMany({
          where: {
            query: { contains: term, mode: 'insensitive' }
          },
          take: 10
        });

        coOccurringQueries.forEach(analytics => {
          const queryTerms = analytics.query.toLowerCase().split(' ');
          queryTerms.forEach(queryTerm => {
            if (!terms.includes(queryTerm) && queryTerm.length > 2) {
              relatedTerms.add(queryTerm);
            }
          });
        });
      }

      return Array.from(relatedTerms).slice(0, 10);
    } catch (error) {
      logger.error('Failed to get related terms', { terms, error: error.message });
      return [];
    }
  }

  private async getPersonalizedTerms(terms: string[], userId: string): Promise<string[]> {
    try {
      // Get user's previous search patterns
      const userSearches = await prisma.searchAnalytics.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 50
      });

      const personalizedTerms = new Set<string>();
      
      userSearches.forEach(search => {
        const searchTerms = search.query.toLowerCase().split(' ');
        searchTerms.forEach(term => {
          if (!terms.includes(term) && term.length > 2) {
            personalizedTerms.add(term);
          }
        });
      });

      return Array.from(personalizedTerms).slice(0, 5);
    } catch (error) {
      logger.error('Failed to get personalized terms', { terms, userId, error: error.message });
      return [];
    }
  }

  private async generateFacets(results: SearchResult[], searchQuery: SearchQuery): Promise<Record<string, any>> {
    try {
      const facets: Record<string, any> = {
        types: {},
        categories: {},
        ratings: {},
        prices: {}
      };

      // Generate facets from results
      results.forEach(result => {
        // Type facets
        facets.types[result.type] = (facets.types[result.type] || 0) + 1;
        
        // Category facets
        if (result.metadata.category) {
          facets.categories[result.metadata.category] = (facets.categories[result.metadata.category] || 0) + 1;
        }
        
        // Rating facets
        if (result.metadata.rating) {
          const ratingRange = Math.floor(result.metadata.rating);
          facets.ratings[`${ratingRange}-${ratingRange + 1}`] = (facets.ratings[`${ratingRange}-${ratingRange + 1}`] || 0) + 1;
        }
        
        // Price facets
        if (result.metadata.price) {
          const priceRange = result.metadata.price < 10 ? '0-10' : 
                            result.metadata.price < 50 ? '10-50' : 
                            result.metadata.price < 100 ? '50-100' : '100+';
          facets.prices[priceRange] = (facets.prices[priceRange] || 0) + 1;
        }
      });

      return facets;
    } catch (error) {
      logger.error('Failed to generate facets', { error: error.message });
      return {};
    }
  }

  // Additional public methods for the search service
  async getTrendingSearches(options: {
    period: 'hour' | 'day' | 'week' | 'month';
    category?: string;
    limit: number;
  }): Promise<SearchTrend[]> {
    try {
      const trends = await prisma.searchTrend.findMany({
        where: {
          period: options.period,
          category: options.category
        },
        orderBy: { count: 'desc' },
        take: options.limit
      });

      return trends.map(trend => ({
        query: trend.query,
        count: trend.count,
        growth: trend.growth,
        category: trend.category || 'general',
        period: trend.period as any
      }));
    } catch (error) {
      logger.error('Failed to get trending searches', { options, error: error.message });
      return [];
    }
  }

  async getAvailableFilters(options: { type?: 'users' | 'content' | 'posts' | 'streams' }): Promise<any> {
    try {
      // This would typically come from analyzing existing content
      return {
        categories: ['Art', 'Photography', 'Music', 'Gaming', 'Lifestyle'],
        tags: ['furry', 'anthro', 'cute', 'digital art', 'commission'],
        priceRanges: [
          { label: 'Free', min: 0, max: 0 },
          { label: '$1-$10', min: 1, max: 10 },
          { label: '$10-$50', min: 10, max: 50 },
          { label: '$50+', min: 50, max: null }
        ],
        locations: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia'],
        languages: ['English', 'Spanish', 'French', 'German', 'Japanese']
      };
    } catch (error) {
      logger.error('Failed to get available filters', { options, error: error.message });
      return {};
    }
  }

  async getUserSavedSearches(userId: string, options: { limit: number; offset: number }): Promise<any[]> {
    try {
      const savedSearches = await prisma.savedSearch.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: options.limit,
        skip: options.offset
      });

      return savedSearches.map(search => ({
        ...search,
        filters: JSON.parse(search.filters as string || '{}')
      }));
    } catch (error) {
      logger.error('Failed to get user saved searches', { userId, error: error.message });
      return [];
    }
  }

  async saveSearch(userId: string, data: { query: string; name: string; filters?: any; notifications: boolean }): Promise<any> {
    try {
      const savedSearch = await prisma.savedSearch.create({
        data: {
          userId,
          name: data.name,
          query: data.query,
          filters: JSON.stringify(data.filters || {}),
          notifications: data.notifications
        }
      });

      return {
        ...savedSearch,
        filters: JSON.parse(savedSearch.filters as string || '{}')
      };
    } catch (error) {
      logger.error('Failed to save search', { userId, data, error: error.message });
      throw error;
    }
  }

  async deleteSavedSearch(userId: string, searchId: string): Promise<void> {
    try {
      await prisma.savedSearch.delete({
        where: { 
          id: searchId,
          userId 
        }
      });
    } catch (error) {
      logger.error('Failed to delete saved search', { userId, searchId, error: error.message });
      throw error;
    }
  }

  // Utility methods
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}

export const enhancedAISearchService = EnhancedAISearchService.getInstance();
export default enhancedAISearchService;

interface SearchAnalytics {
  query: string;
  timestamp: number;
  results: number;
  clicked?: boolean;
  filters?: SearchFilters;
  source: 'text' | 'voice' | 'suggestion';
}

interface SearchFilters {
  contentType: string[];
  dateRange: string;
  creatorType: string[];
  sortBy: string;
  tags: string[];
}

interface PopularSearch {
  query: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

class SearchAnalyticsService {
  private ANALYTICS_KEY = 'onlyfur_search_analytics';
  private POPULAR_SEARCHES_KEY = 'onlyfur_popular_searches';

  // Track search query
  trackSearch(query: string, results: number, filters?: SearchFilters, source: 'text' | 'voice' | 'suggestion' = 'text'): void {
    const analytics = this.getAnalytics();
    const searchEvent: SearchAnalytics = {
      query: query.toLowerCase().trim(),
      timestamp: Date.now(),
      results,
      filters,
      source
    };

    analytics.push(searchEvent);
    
    // Keep only last 1000 searches
    if (analytics.length > 1000) {
      analytics.splice(0, analytics.length - 1000);
    }

    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
    this.updatePopularSearches(query);
  }

  // Track search result click
  trackSearchClick(query: string): void {
    const analytics = this.getAnalytics();
    const recent = analytics.filter(a => a.query === query.toLowerCase().trim())
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (recent && !recent.clicked) {
      recent.clicked = true;
      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
    }
  }

  // Get search analytics
  getAnalytics(): SearchAnalytics[] {
    try {
      const data = localStorage.getItem(this.ANALYTICS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Get popular searches
  getPopularSearches(): PopularSearch[] {
    try {
      const data = localStorage.getItem(this.POPULAR_SEARCHES_KEY);
      return data ? JSON.parse(data) : this.getDefaultPopularSearches();
    } catch {
      return this.getDefaultPopularSearches();
    }
  }

  // Update popular searches based on usage
  private updatePopularSearches(query: string): void {
    const popular = this.getPopularSearches();
    const existing = popular.find(p => p.query.toLowerCase() === query.toLowerCase());

    if (existing) {
      existing.count++;
      existing.trend = 'up';
    } else if (query.length > 2) {
      popular.push({
        query,
        count: 1,
        trend: 'stable',
        category: this.categorizeQuery(query)
      });
    }

    // Sort by count and keep top 20
    popular.sort((a, b) => b.count - a.count);
    const topSearches = popular.slice(0, 20);

    localStorage.setItem(this.POPULAR_SEARCHES_KEY, JSON.stringify(topSearches));
  }

  // Categorize search query
  private categorizeQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('art') || lowerQuery.includes('draw') || lowerQuery.includes('paint')) {
      return 'art';
    } else if (lowerQuery.includes('fursuit') || lowerQuery.includes('costume')) {
      return 'fursuit';
    } else if (lowerQuery.includes('animation') || lowerQuery.includes('video')) {
      return 'animation';
    } else if (lowerQuery.includes('tutorial') || lowerQuery.includes('guide')) {
      return 'education';
    } else if (lowerQuery.includes('commission') || lowerQuery.includes('price')) {
      return 'business';
    }
    
    return 'general';
  }

  // Get search suggestions based on analytics
  getSearchSuggestions(partialQuery: string): string[] {
    const analytics = this.getAnalytics();
    const popular = this.getPopularSearches();
    
    const suggestions = new Set<string>();
    
    // Add matching popular searches
    popular
      .filter(p => p.query.toLowerCase().includes(partialQuery.toLowerCase()))
      .slice(0, 3)
      .forEach(p => suggestions.add(p.query));
    
    // Add matching recent searches
    analytics
      .filter(a => a.query.includes(partialQuery.toLowerCase()) && a.results > 0)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 2)
      .forEach(a => suggestions.add(a.query));
    
    return Array.from(suggestions).slice(0, 5);
  }

  // Get search trends
  getSearchTrends(): { [category: string]: number } {
    const analytics = this.getAnalytics();
    const last30Days = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    const recentSearches = analytics.filter(a => a.timestamp > last30Days);
    const trends: { [category: string]: number } = {};
    
    recentSearches.forEach(search => {
      const category = this.categorizeQuery(search.query);
      trends[category] = (trends[category] || 0) + 1;
    });
    
    return trends;
  }

  // Get default popular searches
  private getDefaultPopularSearches(): PopularSearch[] {
    return [
      { query: 'Digital Art', count: 156, trend: 'up', category: 'art' },
      { query: 'Fursuit Making', count: 134, trend: 'up', category: 'fursuit' },
      { query: 'Animation Tutorial', count: 112, trend: 'stable', category: 'animation' },
      { query: 'Character Design', count: 98, trend: 'up', category: 'art' },
      { query: 'Commission Prices', count: 87, trend: 'stable', category: 'business' },
      { query: 'Art Tutorial', count: 76, trend: 'up', category: 'education' },
      { query: 'Furry Art', count: 65, trend: 'stable', category: 'art' },
      { query: 'Concept Art', count: 54, trend: 'down', category: 'art' }
    ];
  }

  // Clear analytics data
  clearAnalytics(): void {
    localStorage.removeItem(this.ANALYTICS_KEY);
    localStorage.removeItem(this.POPULAR_SEARCHES_KEY);
  }
}

export const searchAnalytics = new SearchAnalyticsService();
export type { SearchFilters, SearchAnalytics, PopularSearch };

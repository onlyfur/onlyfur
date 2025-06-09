import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, TrendingUp } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { apiClient } from '../../services/apiClient';

interface SearchResult {
  id: string;
  type: 'user' | 'content' | 'post' | 'stream';
  title: string;
  description: string;
  thumbnail?: string;
  url: string;
  score: number;
  relevanceScore: number;
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
}

interface SearchFilters {
  type?: 'users' | 'content' | 'posts' | 'streams' | 'all';
  category?: string;
  tags?: string[];
  verified?: boolean;
  premium?: boolean;
  location?: string;
  language?: string;
}

interface SearchSuggestion {
  text: string;
  type: 'completion' | 'correction' | 'related';
  score: number;
  category?: string;
}

interface TrendingSearch {
  query: string;
  count: number;
  growth: number;
  category: string;
}

export const EnhancedSearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [trending, setTrending] = useState<TrendingSearch[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const debouncedSuggestionQuery = useDebounce(query, 150);

  // Load trending searches on component mount
  useEffect(() => {
    loadTrendingSearches();
  }, []);

  // Get suggestions as user types
  useEffect(() => {
    if (debouncedSuggestionQuery && debouncedSuggestionQuery.length > 1) {
      getSuggestions(debouncedSuggestionQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSuggestionQuery]);

  // Perform search when query changes
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 2) {
      performSearch(debouncedQuery, filters);
    } else {
      setResults([]);
      setTotalCount(0);
    }
  }, [debouncedQuery, filters]);

  const loadTrendingSearches = async () => {
    try {
      const response = await apiClient.get('/api/search/trending');
      if (response.data.success) {
        setTrending(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load trending searches:', error);
    }
  };

  const getSuggestions = async (searchQuery: string) => {
    try {
      const response = await apiClient.get(`/api/search/suggestions?query=${encodeURIComponent(searchQuery)}`);
      if (response.data.success) {
        setSuggestions(response.data.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/search', {
        query: searchQuery,
        filters: searchFilters,
        sort: { field: 'relevance', order: 'desc' },
        pagination: { limit: 20, offset: 0 }
      });
      
      if (response.data.success) {
        setResults(response.data.data.results);
        setTotalCount(response.data.data.totalCount);
        setSearchTime(response.data.data.searchTime);
        setSuggestions(response.data.data.suggestions || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setTotalCount(0);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Enhanced AI Search
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover content with our advanced AI-powered search engine
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search for users, content, posts, and more..."
            className="w-full pl-12 pr-20 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {query && (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                {suggestion.type === 'completion' && <Search className="w-4 h-4 text-gray-400" />}
                {suggestion.type === 'correction' && <span className="text-orange-500">📝</span>}
                {suggestion.type === 'related' && <span className="text-blue-500">🔗</span>}
                <span className="text-gray-900 dark:text-white">{suggestion.text}</span>
                {suggestion.category && (
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 ml-auto">
                    {suggestion.category}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type
              </label>
              <select
                value={filters.type || 'all'}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Content</option>
                <option value="users">Users</option>
                <option value="content">Content</option>
                <option value="posts">Posts</option>
                <option value="streams">Live Streams</option>
              </select>
            </div>

            {/* Verified Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification
              </label>
              <select
                value={filters.verified === undefined ? 'all' : filters.verified.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({ 
                    ...filters, 
                    verified: value === 'all' ? undefined : value === 'true' 
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>
            </div>

            {/* Premium Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Premium Content
              </label>
              <select
                value={filters.premium === undefined ? 'all' : filters.premium.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({ 
                    ...filters, 
                    premium: value === 'all' ? undefined : value === 'true' 
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All</option>
                <option value="true">Premium Only</option>
                <option value="false">Free Only</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setFilters({})}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Results Stats */}
      {(results.length > 0 || isLoading) && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            {isLoading ? (
              'Searching...'
            ) : (
              `${totalCount.toLocaleString()} results found in ${searchTime}ms`
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Searching with AI...</span>
        </div>
      )}

      {/* No Results */}
      {!isLoading && query && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Trending Searches (shown when no query) */}
      {!query && trending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Trending Searches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map((trend, index) => (
              <button
                key={index}
                onClick={() => setQuery(trend.query)}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{trend.query}</span>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full">
                    +{Math.round(trend.growth)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>{trend.count.toLocaleString()} searches</span>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {trend.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchInterface;

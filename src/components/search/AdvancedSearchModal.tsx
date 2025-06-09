import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, User, Hash, FileText, TrendingUp, Clock, X, Filter, 
  Mic, MicOff, Sparkles, Calendar, Tag, SortAsc, RotateCcw,
  AlertCircle, Volume2, Settings, Zap, Target
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { searchAnalytics, SearchFilters } from '@/services/searchAnalytics';
import { voiceSearchService, VoiceSearchResult } from '@/services/voiceSearch';
import { aiSearchService, AISearchSuggestion } from '@/services/aiSearch';
import { realDataAPI } from '@/services/realDataAPI';

interface SearchResult {
  id: string;
  type: 'creator' | 'content' | 'tag' | 'general';
  title: string;
  subtitle?: string;
  thumbnail?: string;
  url: string;
  badge?: string;
  relevanceScore?: number;
  createdAt?: string;
  tags?: string[];
  creatorType?: string;
}

interface AdvancedSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  
  // Voice search states
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  // AI suggestions
  const [aiSuggestions, setAiSuggestions] = useState<AISearchSuggestion[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState<SearchFilters>({
    contentType: [],
    dateRange: 'all',
    creatorType: [],
    sortBy: 'relevance',
    tags: []
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Real search data from database
  const [hasRealData, setHasRealData] = useState(false);

  // Check for real data on component mount
  useEffect(() => {
    const checkRealData = async () => {
      const hasData = await realDataAPI.hasRealData();
      setHasRealData(hasData);
    };
    checkRealData();
  }, []);
      tags: ['animation']
    },
    {
      id: 'general-1',
      type: 'general',
      title: 'Creator Program - Join OnlyFur',
      subtitle: 'Start earning with your creative content',
      url: '/creator-program',
      relevanceScore: 65
    },
    {
      id: 'general-2',
      type: 'general',
      title: 'Help Center - Getting Started',
      subtitle: 'Learn how to use OnlyFur effectively',
      url: '/help',
      relevanceScore: 60
    }
  ];

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('onlyfur_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Setup voice search
  useEffect(() => {
    voiceSearchService.setCallbacks({
      onResult: (result: VoiceSearchResult) => {
        setVoiceTranscript(result.transcript);
        if (result.isFinal) {
          const processedQuery = voiceSearchService.processVoiceCommand(result.transcript);
          setQuery(processedQuery);
          performSearch(processedQuery, 'voice');
          setIsVoiceSearching(false);
        }
      },
      onError: (error: string) => {
        setVoiceError(error);
        setIsVoiceSearching(false);
      },
      onStart: () => {
        setVoiceError(null);
        setVoiceTranscript('');
      },
      onEnd: () => {
        setIsVoiceSearching(false);
      }
    });
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string, source: 'text' | 'voice' = 'text') => {
      performSearch(searchQuery, source);
    }, 300),
    [filters, hasRealData]
  );

  // Enhanced search function with real data and analytics
  const performSearch = async (searchQuery: string, source: 'text' | 'voice' | 'suggestion' = 'text') => {
    if (!searchQuery.trim()) {
      setResults([]);
      setAiSuggestions([]);
      return;
    }

    setIsLoading(true);
    setShowAiSuggestions(false);

    try {
      // Get AI analysis
      const aiAnalysis = aiSearchService.analyzeQuery(searchQuery);
      
      // Search real data from database
      const searchResults: SearchResult[] = [];
      
      if (hasRealData) {
        // Search users/creators
        const usersResponse = await realDataAPI.searchUsers(searchQuery, 10);
        if (usersResponse.success && usersResponse.users) {
          const userResults = usersResponse.users.map((user: any) => ({
            id: `creator-${user.id}`,
            type: 'creator' as const,
            title: user.displayName || user.username,
            subtitle: `${user.followersCount || 0} followers • ${user.bio || 'Content Creator'}`,
            thumbnail: user.avatar || '/images/branding/fox-mascot.webp',
            url: `/profile/${user.username}`,
            badge: user.isVerified ? 'Verified' : undefined,
            relevanceScore: 85,
            createdAt: user.createdAt,
            creatorType: 'creator',
            tags: ['creator', 'content']
          }));
          searchResults.push(...userResults);
        }

        // Search content
        const contentResponse = await realDataAPI.getRealContent(10, 0, false);
        if (contentResponse.success && contentResponse.content) {
          const contentResults = contentResponse.content
            .filter((content: any) => 
              content.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              content.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              content.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((content: any) => ({
              id: `content-${content.id}`,
              type: 'content' as const,
              title: content.title,
              subtitle: `By ${content.creator?.displayName || 'Creator'} • ${content.viewsCount || 0} views`,
              thumbnail: content.thumbnailUrl || '/images/branding/fox-mascot.webp',
              url: `/content/${content.id}`,
              badge: content.status === 'published' ? 'Published' : undefined,
              relevanceScore: 80,
              createdAt: content.createdAt,
              tags: content.tags || []
            }));
          searchResults.push(...contentResults);
        }
      }

      // Apply filters
      let filtered = searchResults.filter(result => applyFilters(result));

      // Enhance results with AI if available
      filtered = aiSearchService.enhanceSearchResults(filtered, searchQuery);
      
      // Apply sorting
      filtered = applySorting(filtered);
      
      setResults(filtered);
      setAiSuggestions(aiAnalysis.suggestions);
      setShowAiSuggestions(aiAnalysis.suggestions.length > 0);
      
      // Track search analytics
      searchAnalytics.trackSearch(searchQuery, filtered.length, filters, source);
      
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setAiSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to results
  const applyFilters = (result: SearchResult): boolean => {
    // Content type filter
    if (filters.contentType.length > 0 && !filters.contentType.includes(result.type)) {
      return false;
    }
    
    // Creator type filter
    if (filters.creatorType.length > 0 && result.creatorType && !filters.creatorType.includes(result.creatorType)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange !== 'all' && result.createdAt) {
      const resultDate = new Date(result.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case 'today':
          if (daysDiff > 0) return false;
          break;
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
        case 'year':
          if (daysDiff > 365) return false;
          break;
      }
    }
    
    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        result.tags?.some(resultTag => resultTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) return false;
    }
    
    return true;
  };

  // Apply sorting to results
  const applySorting = (results: SearchResult[]): SearchResult[] => {
    switch (filters.sortBy) {
      case 'relevance':
        return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      case 'date':
        return results.sort((a, b) => {
          const dateA = new Date(a.createdAt || '2000-01-01');
          const dateB = new Date(b.createdAt || '2000-01-01');
          return dateB.getTime() - dateA.getTime();
        });
      case 'popularity':
        return results.sort((a, b) => {
          const scoreA = a.badge === 'Popular' ? 100 : a.badge === 'Trending' ? 80 : 0;
          const scoreB = b.badge === 'Popular' ? 100 : b.badge === 'Trending' ? 80 : 0;
          return scoreB - scoreA;
        });
      default:
        return results;
    }
  };

  // Handle input change with AI suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      // Get AI autocomplete suggestions
      const autocomplete = aiSearchService.getAutocompletesSuggestions(value);
      if (autocomplete.length > 0) {
        const suggestions: AISearchSuggestion[] = autocomplete.map(suggestion => ({
          query: suggestion,
          type: 'completion',
          confidence: 0.8,
          category: 'autocomplete'
        }));
        setAiSuggestions(suggestions);
        setShowAiSuggestions(true);
      }
    } else {
      setShowAiSuggestions(false);
    }
    
    debouncedSearch(value);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // Track click analytics
    searchAnalytics.trackSearchClick(query);
    
    // Save to recent searches
    const newRecentSearches = [
      result.title,
      ...recentSearches.filter(search => search !== result.title)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('onlyfur_recent_searches', JSON.stringify(newRecentSearches));

    // Navigate to result
    navigate(result.url);
    onOpenChange(false);
    setQuery('');
    setResults([]);
  };

  // Handle voice search
  const handleVoiceSearch = () => {
    if (!voiceSearchService.isSupported()) {
      setVoiceError('Voice search is not supported in your browser');
      return;
    }

    if (isVoiceSearching) {
      voiceSearchService.stopListening();
      setIsVoiceSearching(false);
    } else {
      setIsVoiceSearching(true);
      voiceSearchService.startListening({
        language: 'en-US',
        continuous: false,
        interimResults: true
      });
    }
  };

  // Handle AI suggestion click
  const handleAiSuggestionClick = (suggestion: AISearchSuggestion) => {
    setQuery(suggestion.query);
    performSearch(suggestion.query, 'suggestion');
    setShowAiSuggestions(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      contentType: [],
      dateRange: 'all',
      creatorType: [],
      sortBy: 'relevance',
      tags: []
    });
  };

  // Get result icon
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'creator': return User;
      case 'content': return FileText;
      case 'tag': return Hash;
      default: return Search;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Advanced Search
            </div>
            <Badge variant="secondary" className="ml-2">
              AI Powered
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search with AI assistance..."
              value={query}
              onChange={handleInputChange}
              className="pl-10 pr-20 h-12 text-lg"
            />
            
            {/* Voice Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-12 top-2 h-8 w-8 ${isVoiceSearching ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleVoiceSearch}
              disabled={!voiceSearchService.isSupported()}
            >
              {isVoiceSearching ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            {/* Filter Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Voice Search Feedback */}
          {isVoiceSearching && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center">
                <Volume2 className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  Listening... {voiceTranscript && `"${voiceTranscript}"`}
                </span>
              </div>
            </div>
          )}

          {/* Voice Error */}
          {voiceError && (
            <Alert className="mt-2 border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {voiceError}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="px-6 py-4 border-t bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <div className="space-y-2">
                  {['creator', 'content', 'tag', 'general'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.contentType.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters(prev => ({
                              ...prev,
                              contentType: [...prev.contentType, type]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              contentType: prev.contentType.filter(t => t !== type)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm capitalize">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 mx-6">
              <TabsTrigger value="search">Search Results</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="h-96 overflow-y-auto px-6 py-4">
              {/* AI Suggestions */}
              {showAiSuggestions && aiSuggestions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    AI Suggestions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.slice(0, 5).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiSuggestionClick(suggestion)}
                        className="text-xs"
                      >
                        {suggestion.query}
                        {suggestion.type === 'trending' && <TrendingUp className="w-3 h-3 ml-1" />}
                        {suggestion.type === 'correction' && <Target className="w-3 h-3 ml-1" />}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">Searching with AI...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {results.length} results found
                    </span>
                    {filters.sortBy === 'relevance' && (
                      <Badge variant="secondary" className="text-xs">
                        AI Ranked
                      </Badge>
                    )}
                  </div>
                  {results.map((result) => {
                    const Icon = getResultIcon(result.type);
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center w-full p-3 text-left rounded-md hover:bg-accent transition-colors group"
                      >
                        {result.thumbnail ? (
                          <Avatar className="w-10 h-10 mr-3">
                            <AvatarImage src={result.thumbnail} alt={result.title} />
                            <AvatarFallback>
                              <Icon className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 mr-3 rounded-full bg-accent flex items-center justify-center">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            {result.badge && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {result.badge}
                              </Badge>
                            )}
                            {result.relevanceScore && filters.sortBy === 'relevance' && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {result.relevanceScore}% match
                              </Badge>
                            )}
                          </div>
                          {result.subtitle && (
                            <p className="text-xs text-muted-foreground truncate">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : query ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try different keywords or check your spelling
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Recent Searches
                      </h3>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setQuery(search);
                              performSearch(search);
                            }}
                            className="flex items-center w-full p-2 text-left rounded-md hover:bg-accent transition-colors"
                          >
                            <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                            <span className="text-sm">{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trending Searches
                    </h3>
                    <div className="space-y-2">
                      {searchAnalytics.getPopularSearches().slice(0, 5).map((popular, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(popular.query);
                            performSearch(popular.query);
                          }}
                          className="flex items-center justify-between w-full p-2 text-left rounded-md hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-3 text-muted-foreground" />
                            <span className="text-sm">{popular.query}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {popular.count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="h-96 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Search Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(searchAnalytics.getSearchTrends()).map(([category, count]) => (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{category}</span>
                            <span>{count} searches</span>
                          </div>
                          <Progress value={(count / 20) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Popular Searches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {searchAnalytics.getPopularSearches().slice(0, 8).map((search, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{search.query}</span>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs mr-2">
                              {search.count}
                            </Badge>
                            <TrendingUp className={`w-3 h-3 ${
                              search.trend === 'up' ? 'text-green-500' : 
                              search.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="h-96 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Smart Suggestions</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Intent Detection</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Spelling Correction</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Voice Search</span>
                      <Badge variant={voiceSearchService.isSupported() ? "secondary" : "outline"}>
                        {voiceSearchService.isSupported() ? "Available" : "Not Available"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {voiceSearchService.isSupported() && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Mic className="w-4 h-4 mr-2" />
                        Voice Search Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {voiceSearchService.getVoiceSearchTips().map((tip, index) => (
                          <li key={index}>• {tip}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Press <kbd className="px-1 py-0.5 text-xs bg-background border rounded">Enter</kbd> to select first result</span>
              {voiceSearchService.isSupported() && (
                <span>Hold <kbd className="px-1 py-0.5 text-xs bg-background border rounded">Ctrl+Space</kbd> for voice search</span>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              Powered by AI
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default AdvancedSearchModal;

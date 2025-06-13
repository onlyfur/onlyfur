import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, User, Hash, FileText, TrendingUp, Clock, X, Filter, 
  Sparkles, Calendar, Tag, SortAsc, RotateCcw,
  AlertCircle, Settings, Zap, Target, Brain, Eye,
  Image, Camera, Upload, Cpu, Users, Activity, BarChart3, Book
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { realDataAPI } from '@/services/realDataAPI';
import { neuralSearchEngine, type NeuralSearchResult, type SearchContext } from '@/services/neuralSearch';

interface SearchResult {
  id: string;
  type: 'creator' | 'content' | 'tag' | 'general' | 'help';
  title: string;
  subtitle?: string;
  thumbnail?: string;
  url: string;
  badge?: string;
  relevanceScore?: number;
  createdAt?: string;
  tags?: string[];
  creatorType?: string;
  description?: string;
}

interface SearchFilters {
  contentType: string[];
  dateRange: string;
  creatorType: string[];
  sortBy: string;
  tags: string[];
}

interface NeuralSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NeuralSearchModal: React.FC<NeuralSearchModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  
  // Search mode states
  const [searchMode, setSearchMode] = useState<'traditional' | 'neural' | 'visual' | 'api'>('neural');
  const [visualSearchFile, setVisualSearchFile] = useState<File | null>(null);
  
  // Voice search removed
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  // Neural search features
  const [enablePersonalization, setEnablePersonalization] = useState(true);
  const [enableNeuralBoost, setEnableNeuralBoost] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  
  // Filters
  const [filters, setFilters] = useState<SearchFilters>({
    contentType: [],
    dateRange: 'all',
    creatorType: [],
    sortBy: 'relevance',
    tags: []
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Real data state
  const [hasRealData, setHasRealData] = useState(false);
  
  // Neural search state
  const [neuralResults, setNeuralResults] = useState<NeuralSearchResult[]>([]);
  const [showNeuralInsights, setShowNeuralInsights] = useState(false);

  // Check for real data on component mount
  useEffect(() => {
    const checkRealData = async () => {
      const hasData = await realDataAPI.hasRealData();
      setHasRealData(hasData);
    };
    checkRealData();
  }, []);

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

  // Debounced search function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedSearch = useCallback(
    debounce((searchQuery: string, source: 'text' | 'voice' = 'text') => {
      performSearch(searchQuery, source);
    }, 300),
    [filters, searchMode, enablePersonalization, enableNeuralBoost]
  );

  // Generate mock search results for demo purposes
  const generateMockSearchResults = async (query: string): Promise<SearchResult[]> => {
    const mockData = [
      {
        id: 'creator-demo-1',
        type: 'creator' as const,
        title: 'FurryArtist_Pro',
        subtitle: '12.5K followers • Digital art specialist',
        thumbnail: '/images/branding/fox-mascot.webp',
        url: '/profile/furryartist-pro',
        badge: 'Verified',
        relevanceScore: 92,
        createdAt: '2024-01-15',
        tags: ['digital-art', 'character-design', 'commissions']
      },
      {
        id: 'content-demo-1',
        type: 'content' as const,
        title: 'Digital Art Masterclass: Character Design Fundamentals',
        subtitle: 'By FurryArtist_Pro • 45.2K views',
        thumbnail: '/images/branding/fox-mascot.webp',
        url: '/content/digital-art-masterclass',
        badge: 'Premium',
        relevanceScore: 89,
        createdAt: '2024-02-01',
        tags: ['tutorial', 'character-design', 'digital-art']
      },
      {
        id: 'creator-demo-2',
        type: 'creator' as const,
        title: 'AnimationMaster',
        subtitle: '8.7K followers • Animation tutorials & tips',
        thumbnail: '/images/branding/fox-mascot.webp',
        url: '/profile/animation-master',
        badge: 'Featured',
        relevanceScore: 85,
        createdAt: '2024-01-20',
        tags: ['animation', 'tutorial', 'motion-graphics']
      },
      {
        id: 'content-demo-2',
        type: 'content' as const,
        title: 'Animation Basics: Walk Cycles for Beginners',
        subtitle: 'By AnimationMaster • 23.8K views',
        thumbnail: '/images/branding/fox-mascot.webp',
        url: '/content/animation-walk-cycles',
        badge: 'Tutorial',
        relevanceScore: 83,
        createdAt: '2024-02-10',
        tags: ['animation', 'tutorial', 'walk-cycle', 'beginner']
      },
      {
        id: 'content-demo-3',
        type: 'content' as const,
        title: 'Fursuit Construction: Head Building Techniques',
        subtitle: 'By CraftMaster • 18.5K views',
        thumbnail: '/images/branding/fox-mascot.webp',
        url: '/content/fursuit-construction',
        badge: 'Guide',
        relevanceScore: 78,
        createdAt: '2024-02-05',
        tags: ['fursuit', 'tutorial', 'crafting', 'construction']
      }
    ];

    // Filter based on query relevance
    const queryLower = query.toLowerCase();
    return mockData
      .filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.subtitle.toLowerCase().includes(queryLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .map(item => ({
        ...item,
        relevanceScore: item.relevanceScore * (Math.random() * 0.2 + 0.9) // Add some variation
      }));
  };

  // Enhanced search function with multiple engines
  const performSearch = async (searchQuery: string, source: 'text' | 'voice' | 'suggestion' = 'text') => {
    if (!searchQuery.trim()) {
      setResults([]);
      setNeuralResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Search real data from database
      const searchResults: SearchResult[] = [];
      
      if (hasRealData) {
        // Search users/creators
        const usersResponse = await realDataAPI.searchUsers(searchQuery, 10);
        if (usersResponse.success && usersResponse.users) {
          const userResults = usersResponse.users
            .filter((user: any) => filters.contentType.length === 0 || filters.contentType.includes('creator'))
            .map((user: any) => ({
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
            .filter((content: any) => {
              const matchesQuery = content.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 content.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 content.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
              
              const matchesFilters = filters.contentType.length === 0 || filters.contentType.includes('content');
              
              return matchesQuery && matchesFilters;
            })
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
      } else {
        // Fallback to mock data when no real data is available
        const mockResults = await generateMockSearchResults(searchQuery);
        searchResults.push(...mockResults);
      }

      // Perform neural search if enabled
      if (searchMode === 'neural' && enableNeuralBoost) {
        const currentTime = new Date().getHours();
        let timeContext: 'morning' | 'afternoon' | 'evening' | 'night' = 'afternoon';
        
        if (currentTime < 12) timeContext = 'morning';
        else if (currentTime < 17) timeContext = 'afternoon';
        else if (currentTime < 22) timeContext = 'evening';
        else timeContext = 'night';

        const searchContext: SearchContext = {
          user_preferences: {
            preferred_content_types: filters.contentType.length > 0 ? filters.contentType : ['art', 'tutorial'],
            favorite_creators: [],
            interest_categories: ['digital-art', 'character-design', 'animation'],
            content_quality_threshold: confidenceThreshold,
            language_preferences: ['en'],
            accessibility_needs: []
          },
          search_history: recentSearches,
          recent_interactions: [],
          time_context: timeContext,
          device_context: window.innerWidth < 768 ? 'mobile' : 'desktop'
        };

        const neuralSearchResults = await neuralSearchEngine.neuralSearch(
          searchQuery, 
          searchContext, 
          { limit: 10, threshold: confidenceThreshold * 0.5 }
        );

        setNeuralResults(neuralSearchResults);

        // Enhance search results with neural insights
        searchResults.forEach(result => {
          const neuralMatch = neuralSearchResults.find(nr => nr.id.includes(result.id.split('-')[1]));
          if (neuralMatch) {
            result.relevanceScore = (result.relevanceScore || 0) * (1 + neuralMatch.relevance_score);
          }
        });
        
        // Add help center articles from neural search results
        const helpArticles = neuralSearchResults
          .filter(result => result.id.startsWith('help-'))
          .map(result => {
            const vector = neuralSearchEngine.getVectorById(result.id);
            if (vector && vector.metadata.category === 'help') {
              return {
                id: result.id,
                type: 'help' as const,
                title: vector.metadata.title || 'Help Article',
                description: vector.metadata.description || '',
                subtitle: `Help Center • ${vector.metadata.tags.join(', ')}`,
                url: vector.metadata.url || '/help',
                badge: 'Help Article',
                relevanceScore: result.relevance_score * 100,
                tags: vector.metadata.tags,
                thumbnail: '/images/branding/fox-mascot.webp'
              };
            }
            return null;
          })
          .filter(Boolean) as SearchResult[];
          
        // Add help articles to search results
        searchResults.push(...helpArticles);
      }

      // Apply neural boost scoring
      if (enableNeuralBoost) {
        searchResults.forEach(result => {
          result.relevanceScore = (result.relevanceScore || 0) * 1.1;
        });
      }

      // Sort results
      const sortedResults = searchResults.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
          case 'popularity':
            return (b.relevanceScore || 0) - (a.relevanceScore || 0);
          default:
            return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        }
      });

      setResults(sortedResults);

      // Save to recent searches
      if (source !== 'suggestion') {
        const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem('onlyfur_recent_searches', JSON.stringify(updatedRecent));
      }

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  // Voice search removed

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onOpenChange(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setVoiceTranscript('');
    setVoiceError(null);
  };

  const renderSearchModeSelector = () => (
    <div className="flex items-center space-x-2 mb-4 p-3 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
      <Brain className={`w-4 h-4 ${searchMode === 'neural' ? 'text-blue-600' : 'text-blue-400'}`} />
      <span className="text-sm font-medium">Search Mode:</span>
      <Select value={searchMode} onValueChange={(value: any) => setSearchMode(value)}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="traditional">
            <div className="flex items-center">
              <Search className="w-3 h-3 mr-2" />
              Traditional
            </div>
          </SelectItem>
          <SelectItem value="neural">
            <div className="flex items-center">
              <Brain className="w-3 h-3 mr-2 text-blue-500" />
              Neural AI
            </div>
          </SelectItem>
          <SelectItem value="visual">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-2" />
              Visual
            </div>
          </SelectItem>
          <SelectItem value="api">
            <div className="flex items-center">
              <Zap className="w-3 h-3 mr-2" />
              API
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      {searchMode === 'neural' && (
        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Enhanced
        </Badge>
      )}
    </div>
  );

  const renderNeuralSettings = () => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Cpu className="w-4 h-4 mr-2" />
          Neural Enhancement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Personalization</span>
          <Switch checked={enablePersonalization} onCheckedChange={setEnablePersonalization} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Neural Boost</span>
          <Switch checked={enableNeuralBoost} onCheckedChange={setEnableNeuralBoost} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Confidence Threshold</span>
            <span className="text-xs text-muted-foreground">{Math.round(confidenceThreshold * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => (
    <div className="space-y-2">
      {results.map((result) => {
        const neuralMatch = neuralResults.find(nr => nr.id.includes(result.id.split('-')[1]));
        
        return (
          <div
            key={result.id}
            className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
            onClick={() => handleResultClick(result)}
          >
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={result.thumbnail} />
                <AvatarFallback>
                  {result.type === 'creator' ? (
                    <User className="w-5 h-5" />
                  ) : result.type === 'help' ? (
                    <Book className="w-5 h-5 text-blue-500" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-sm truncate">{result.title}</h3>
                  {result.badge && (
                    <Badge 
                      variant={result.type === 'help' ? "outline-solid" : "secondary"} 
                      className={`text-xs ${result.type === 'help' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' : ''}`}
                    >
                      {result.type === 'help' && <Book className="w-3 h-3 mr-1" />}
                      {result.badge}
                    </Badge>
                  )}
                  {searchMode === 'neural' && neuralMatch && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                      <Brain className="w-3 h-3 mr-1" />
                      {Math.round(neuralMatch.confidence_score * 100)}%
                    </Badge>
                  )}
                  {result.relevanceScore && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(result.relevanceScore)}%
                    </span>
                  )}
                </div>
                {result.subtitle && (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {result.subtitle}
                  </p>
                )}
                {result.type === 'help' && result.description && (
                  <p className="text-xs text-blue-600 mt-1">
                    {result.description}
                  </p>
                )}
                {searchMode === 'neural' && neuralMatch && neuralMatch.explanation && (
                  <p className="text-xs text-blue-600 mt-1 italic">
                    {neuralMatch.explanation}
                  </p>
                )}
                {result.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderNeuralInsights = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Brain className="w-4 h-4 mr-2 text-blue-500" />
          Neural Search Insights
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowNeuralInsights(!showNeuralInsights)}
        >
          {showNeuralInsights ? 'Hide' : 'Show'} Details
        </Button>
      </div>

      {showNeuralInsights && neuralResults.length > 0 && (
        <div className="space-y-3">
          {neuralResults.slice(0, 3).map((result) => (
            <Card key={result.id} className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Match #{result.id}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Confidence: {Math.round(result.confidence_score * 100)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Relevance: {Math.round(result.relevance_score * 100)}%
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {result.explanation}
                </p>

                {result.personalization_factors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium mb-1">Personalization Factors:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {result.personalization_factors.map((factor, idx) => (
                        <li key={idx} className="flex items-center">
                          <Target className="w-3 h-3 mr-1 text-green-500" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendation_reason && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded text-xs">
                    <strong>Why recommended:</strong> {result.recommendation_reason}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-500" />
            Neural Search
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-visible">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 sticky top-0 z-10 bg-background">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="insights" className="relative">
                Insights
                {searchMode === 'neural' && neuralResults.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs h-4 w-4 p-0 flex items-center justify-center">
                    {neuralResults.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="flex-1 mt-4 overflow-visible flex flex-col">
              {renderSearchModeSelector()}
              
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for creators, content, help articles, and more..."
                    value={query}
                    onChange={handleInputChange}
                    className="pl-10 pr-20"
                  />
                  {searchMode === 'neural' && !query && (
                    <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
                      Try searching with tags: "help article security", "creator digital art", etc.
                    </div>
                  )}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    {query && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </form>

              {/* Voice search removed */}

              <div className="flex-1 overflow-visible pb-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-[50vh] overflow-y-auto pr-1">
                    {renderResults()}
                  </div>
                ) : query ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSearches.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Recent Searches
                        </h3>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setQuery(search);
                                performSearch(search, 'suggestion');
                              }}
                              className="w-full justify-start text-sm"
                            >
                              <Clock className="w-3 h-3 mr-2" />
                              {search}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {searchMode === 'neural' && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                          Try These Searches
                        </h3>
                        <div className="space-y-1">
                          {[
                            "help article account security",
                            "creator digital art",
                            "help subscription management",
                            "content tutorial animation",
                            "help mobile app"
                          ].map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setQuery(suggestion);
                                performSearch(suggestion, 'suggestion');
                              }}
                              className="w-full justify-start text-sm"
                            >
                              <Sparkles className="w-3 h-3 mr-2 text-blue-500" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="mt-4 overflow-visible">
              {searchMode === 'neural' ? (
                neuralResults.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto pr-1 pb-4">
                    {renderNeuralInsights()}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Perform a neural search to see AI insights</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Switch to Neural mode to see AI-powered insights</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setSearchMode('neural')}
                  >
                    Enable Neural Search
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="filters" className="mt-4 overflow-visible">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 pb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['creator', 'content', 'tag', 'help'].map((type) => (
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
                        <label htmlFor={type} className="text-sm capitalize">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  >
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
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4 overflow-visible">
              <div className="max-h-[60vh] overflow-y-auto pr-1 pb-4">
                {renderNeuralSettings()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NeuralSearchModal;

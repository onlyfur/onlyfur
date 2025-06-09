import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, User, Hash, FileText, TrendingUp, Clock, X, Filter, 
  Mic, MicOff, Sparkles, Calendar, Tag, SortAsc, RotateCcw,
  AlertCircle, Volume2, Settings, Zap, Target, Brain, Eye,
  Image, Camera, Upload, Cpu, Users, Activity, BarChart3
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
  
  // Voice search states
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
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

  // Enhanced search function with multiple engines
  const performSearch = async (searchQuery: string, source: 'text' | 'voice' | 'suggestion' = 'text') => {
    if (!searchQuery.trim()) {
      setResults([]);
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

  const handleVoiceSearch = () => {
    if (isVoiceSearching) {
      setIsVoiceSearching(false);
      setVoiceError(null);
    } else {
      setIsVoiceSearching(true);
      setVoiceError(null);
      // Voice search would be implemented here
      setTimeout(() => {
        setVoiceTranscript('Searching for furry art tutorials...');
        setTimeout(() => {
          setQuery('furry art tutorials');
          performSearch('furry art tutorials', 'voice');
          setIsVoiceSearching(false);
        }, 2000);
      }, 500);
    }
  };

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
    <div className="flex items-center space-x-2 mb-4">
      <Brain className="w-4 h-4 text-blue-500" />
      <span className="text-sm font-medium">Search Mode:</span>
      <Select value={searchMode} onValueChange={(value: any) => setSearchMode(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="traditional">Traditional</SelectItem>
          <SelectItem value="neural">Neural</SelectItem>
          <SelectItem value="visual">Visual</SelectItem>
          <SelectItem value="api">API</SelectItem>
        </SelectContent>
      </Select>
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
      {results.map((result) => (
        <div
          key={result.id}
          className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
          onClick={() => handleResultClick(result)}
        >
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={result.thumbnail} />
              <AvatarFallback>
                {result.type === 'creator' ? <User className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-sm truncate">{result.title}</h3>
                {result.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {result.badge}
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
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-500" />
            Neural Search
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="flex-1 mt-4 overflow-hidden flex flex-col">
              {renderSearchModeSelector()}
              
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Neural search for creators, content, and more..."
                    value={query}
                    onChange={handleInputChange}
                    className="pl-10 pr-20"
                  />
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleVoiceSearch}
                      className={`h-6 w-6 p-0 ${isVoiceSearching ? 'text-red-500' : ''}`}
                    >
                      {isVoiceSearching ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </form>

              {isVoiceSearching && (
                <Alert className="mb-4">
                  <Volume2 className="w-4 h-4" />
                  <AlertDescription>
                    Listening... {voiceTranscript && `"${voiceTranscript}"`}
                  </AlertDescription>
                </Alert>
              )}

              {voiceError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{voiceError}</AlertDescription>
                </Alert>
              )}

              <div className="flex-1 overflow-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : results.length > 0 ? (
                  renderResults()
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
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="filters" className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['creator', 'content', 'tag'].map((type) => (
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

            <TabsContent value="settings" className="mt-4">
              {renderNeuralSettings()}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NeuralSearchModal;

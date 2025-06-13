import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search,
  Brain,
  Sparkles,
  Filter,
  SortAsc,
  Eye,
  Heart,
  MessageSquare,
  Share,
  Clock,
  TrendingUp,
  Users,
  Star,
  Zap,
  Target,
  Sliders,
  X,
  ChevronDown,
  Image,
  Video,
  FileText,
  Mic,
  Camera,
  Play
} from 'lucide-react';
import AnimatedLoader from '../ui/AnimatedLoader';

interface SearchResult {
  id: string;
  type: 'creator' | 'content' | 'community';
  title: string;
  description: string;
  thumbnail?: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  stats: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  tags: string[];
  relevanceScore: number;
  aiInsights: {
    whyRelevant: string;
    similarityScore: number;
    engagementPrediction: number;
  };
  contentType?: 'image' | 'video' | 'text' | 'audio';
  duration?: string;
  publishedAt: Date;
}

interface AISearchFilters {
  contentType: string[];
  timeRange: string;
  sortBy: string;
  minEngagement: number;
  creators: string[];
  tags: string[];
  aiPersonalized: boolean;
}

interface SearchSuggestion {
  query: string;
  type: 'trending' | 'personalized' | 'semantic';
  confidence: number;
  explanation: string;
}

export default function AISearchAndDiscovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AISearchFilters>({
    contentType: [],
    timeRange: 'all',
    sortBy: 'relevance',
    minEngagement: 0,
    creators: [],
    tags: [],
    aiPersonalized: true
  });

  // Mock search suggestions
  const generateSearchSuggestions = (query: string): SearchSuggestion[] => {
    if (!query) {
      return [
        {
          query: 'fursuit photography',
          type: 'trending',
          confidence: 95,
          explanation: 'Trending in your community this week'
        },
        {
          query: 'character design tips',
          type: 'personalized',
          confidence: 88,
          explanation: 'Based on your recent interests'
        },
        {
          query: 'anthro art commission',
          type: 'trending',
          confidence: 92,
          explanation: 'Popular search among creators'
        }
      ];
    }

    return [
      {
        query: `${query} tutorials`,
        type: 'semantic',
        confidence: 87,
        explanation: 'AI-enhanced search expansion'
      },
      {
        query: `${query} community`,
        type: 'semantic',
        confidence: 82,
        explanation: 'Related community content'
      }
    ];
  };

  // Mock search results
  const generateSearchResults = (query: string): SearchResult[] => {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'content',
        title: 'Fursuit Photography in Golden Hour',
        description: 'Professional outdoor fursuit photography session showcasing lighting techniques and poses that bring characters to life.',
        thumbnail: '/api/placeholder/300/200',
        creator: {
          name: 'PhotoPaws Studio',
          avatar: '/api/placeholder/40/40',
          verified: true,
          followers: 15420
        },
        stats: {
          views: 28500,
          likes: 2150,
          comments: 342,
          shares: 156
        },
        tags: ['fursuit', 'photography', 'golden hour', 'outdoor'],
        relevanceScore: 95,
        aiInsights: {
          whyRelevant: 'Matches your interest in fursuit photography and follows trending visual styles',
          similarityScore: 92,
          engagementPrediction: 89
        },
        contentType: 'image',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'creator',
        title: 'FurryArtist - Digital Character Designer',
        description: 'Specialized in anthropomorphic character design and digital art commissions. 8+ years experience in the furry community.',
        thumbnail: '/api/placeholder/300/200',
        creator: {
          name: 'FurryArtist',
          avatar: '/api/placeholder/40/40',
          verified: true,
          followers: 45200
        },
        stats: {
          views: 125000,
          likes: 8900,
          comments: 1240
        },
        tags: ['artist', 'commissions', 'character design', 'digital art'],
        relevanceScore: 88,
        aiInsights: {
          whyRelevant: 'Popular creator in your preferred art style with high engagement rates',
          similarityScore: 85,
          engagementPrediction: 91
        },
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'content',
        title: 'Character Design Process: From Sketch to Finished Art',
        description: 'Complete walkthrough of my character design process, including ideation, sketching, and digital rendering techniques.',
        thumbnail: '/api/placeholder/300/200',
        creator: {
          name: 'DigitalPaws',
          avatar: '/api/placeholder/40/40',
          verified: false,
          followers: 8750
        },
        stats: {
          views: 15600,
          likes: 1340,
          comments: 198,
          shares: 87
        },
        tags: ['tutorial', 'character design', 'digital art', 'process'],
        relevanceScore: 82,
        aiInsights: {
          whyRelevant: 'Educational content matching your learning preferences',
          similarityScore: 78,
          engagementPrediction: 84
        },
        contentType: 'video',
        duration: '24:15',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        type: 'community',
        title: 'Fursuit Makers Guild - Community Discussion',
        description: 'Active community of fursuit makers sharing techniques, materials, and collaboration opportunities.',
        creator: {
          name: 'Fursuit Makers Guild',
          avatar: '/api/placeholder/40/40',
          verified: true,
          followers: 23000
        },
        stats: {
          views: 45000,
          likes: 3200,
          comments: 892
        },
        tags: ['community', 'fursuit making', 'techniques', 'collaboration'],
        relevanceScore: 76,
        aiInsights: {
          whyRelevant: 'Active community discussions on topics you engage with',
          similarityScore: 73,
          engagementPrediction: 79
        },
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    // Filter based on query
    if (query) {
      return mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    return mockResults;
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Simulate AI search processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const results = generateSearchResults(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSuggestions(generateSearchSuggestions(value));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getContentTypeIcon = (type?: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'text': return FileText;
      case 'audio': return Mic;
      default: return FileText;
    }
  };

  const filteredResults = searchResults.filter(result => {
    if (activeTab === 'all') return true;
    return result.type === activeTab;
  });

  useEffect(() => {
    setSuggestions(generateSearchSuggestions(''));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Discovery
          </h1>
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover content, creators, and communities with intelligent search that understands context and your preferences.
        </p>
      </motion.div>

      {/* Search Interface */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search for creators, content, or communities..."
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    className="pl-10 pr-4 h-12 text-lg"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AnimatedLoader type="search" size="sm" />
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => handleSearch(searchQuery)}
                  disabled={isSearching}
                  className="h-12 px-6"
                >
                  {isSearching ? (
                    <AnimatedLoader type="search" size="sm" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Search
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-4"
                >
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Search Suggestions */}
            <AnimatePresence>
              {suggestions.length > 0 && searchQuery.length < 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <p className="text-sm font-medium text-gray-700">AI Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSearchQuery(suggestion.query);
                          handleSearch(suggestion.query);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-full text-sm transition-colors"
                      >
                        {suggestion.type === 'trending' && <TrendingUp className="w-3 h-3 text-purple-600" />}
                        {suggestion.type === 'personalized' && <Target className="w-3 h-3 text-purple-600" />}
                        {suggestion.type === 'semantic' && <Brain className="w-3 h-3 text-purple-600" />}
                        <span>{suggestion.query}</span>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.confidence}%
                        </Badge>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-4 space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Content Type</label>
                      <div className="space-y-1">
                        {['image', 'video', 'text', 'audio'].map(type => (
                          <label key={type} className="flex items-center space-x-2 text-sm">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              checked={filters.contentType.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
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
                            <span className="capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Time Range</label>
                      <select 
                        value={filters.timeRange}
                        onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                        className="w-full p-2 border rounded text-sm"
                      >
                        <option value="all">All Time</option>
                        <option value="day">Past Day</option>
                        <option value="week">Past Week</option>
                        <option value="month">Past Month</option>
                        <option value="year">Past Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <select 
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="w-full p-2 border rounded text-sm"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="recent">Most Recent</option>
                        <option value="popular">Most Popular</option>
                        <option value="engagement">Highest Engagement</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">AI Personalized</label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          checked={filters.aiPersonalized}
                          onChange={(e) => setFilters(prev => ({ ...prev, aiPersonalized: e.target.checked }))}
                        />
                        <span>Use AI personalization</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          {/* Results Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({searchResults.length})</TabsTrigger>
              <TabsTrigger value="content">Content ({searchResults.filter(r => r.type === 'content').length})</TabsTrigger>
              <TabsTrigger value="creator">Creators ({searchResults.filter(r => r.type === 'creator').length})</TabsTrigger>
              <TabsTrigger value="community">Communities ({searchResults.filter(r => r.type === 'community').length})</TabsTrigger>
            </TabsList>

            {/* Results Content */}
            <TabsContent value={activeTab} className="mt-6">
              <AnimatePresence>
                <div className="space-y-4">
                  {filteredResults.map((result, index) => {
                    const ContentIcon = getContentTypeIcon(result.contentType);
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex space-x-4">
                              {/* Thumbnail */}
                              <div className="w-32 h-24 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center relative">
                                {result.contentType === 'video' && (
                                  <Play className="w-8 h-8 text-white absolute z-10" />
                                )}
                                <ContentIcon className="w-8 h-8 text-gray-400" />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold">{result.title}</h3>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <img 
                                        src={result.creator.avatar} 
                                        alt={result.creator.name}
                                        className="w-5 h-5 rounded-full"
                                      />
                                      <span>{result.creator.name}</span>
                                      {result.creator.verified && (
                                        <Star className="w-4 h-4 text-blue-500" />
                                      )}
                                      <span>•</span>
                                      <span>{formatNumber(result.creator.followers)} followers</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-purple-100 text-purple-800">
                                      {result.relevanceScore}% match
                                    </Badge>
                                    <Badge variant="secondary" className="capitalize">
                                      {result.type}
                                    </Badge>
                                  </div>
                                </div>
                                
                                {/* Description */}
                                <p className="text-gray-700 text-sm">{result.description}</p>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1">
                                  {result.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                {/* Stats and AI Insights */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    {result.stats.views && (
                                      <div className="flex items-center space-x-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{formatNumber(result.stats.views)}</span>
                                      </div>
                                    )}
                                    {result.stats.likes && (
                                      <div className="flex items-center space-x-1">
                                        <Heart className="w-4 h-4" />
                                        <span>{formatNumber(result.stats.likes)}</span>
                                      </div>
                                    )}
                                    {result.stats.comments && (
                                      <div className="flex items-center space-x-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{formatNumber(result.stats.comments)}</span>
                                      </div>
                                    )}
                                    {result.duration && (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{result.duration}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Brain className="w-3 h-3" />
                                      <span>{result.aiInsights.whyRelevant}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !isSearching && searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No results found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or filters, or explore our AI suggestions.
          </p>
          <Button 
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            variant="outline"
          >
            Clear Search
          </Button>
        </motion.div>
      )}
    </div>
  );
}

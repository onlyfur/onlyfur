import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  TrendingUp,
  Camera,
  Video,
  Music,
  Palette,
  Heart,
  Zap,
  Crown,
  Sparkles,
  Loader2,
  UserPlus,
  Eye,
  MessageCircle,
  Calendar,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AISearchAndDiscovery from '@/components/ai/AISearchAndDiscovery';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  isVerified: boolean;
  categories: string[];
  tags: string[];
  subscriberCount: number;
  contentCount: number;
  createdAt: string;
  similarityScore?: number;
  trendingScore?: number;
}

interface Content {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  tier: string;
  mediaUrls: string[];
  textContent?: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  createdAt: string;
}

interface Category {
  name: string;
  contentCount: number;
  creatorCount: number;
  totalViews: number;
  totalLikes: number;
}

const ExploreV3: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [activeTab, setActiveTab] = useState('mixed');
  
  // Data states
  const [creators, setCreators] = useState<Creator[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingCreators, setTrendingCreators] = useState<Creator[]>([]);
  const [trendingContent, setTrendingContent] = useState<Content[]>([]);
  const [recommendations, setRecommendations] = useState<Creator[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    loadTrendingData();
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  // Load explore data when filters change
  useEffect(() => {
    loadExploreData();
  }, [selectedCategory, selectedType, sortBy, currentPage, searchQuery]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/home-v2/categories', {
        headers: {
          'Authorization': user ? `Bearer ${localStorage.getItem('token')}` : '',
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [user]);

  const loadTrendingData = useCallback(async () => {
    try {
      const response = await fetch('/api/home-v2/trending?timeframe=week&limit=20', {
        headers: {
          'Authorization': user ? `Bearer ${localStorage.getItem('token')}` : '',
        },
      });
      const data = await response.json();
      if (data.success) {
        setTrendingCreators(data.trending.creators || []);
        setTrendingContent(data.trending.content || []);
      }
    } catch (error) {
      console.error('Error loading trending data:', error);
    }
  }, [user]);

  const loadRecommendations = useCallback(async () => {
    try {
      const response = await fetch('/api/home-v2/recommendations?limit=12', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  }, []);

  const loadExploreData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '24',
        type: selectedType,
        sort: sortBy,
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchQuery) {
        // Use search endpoint for queries
        const response = await fetch(`/api/users-v3/search?${params.toString()}&q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': user ? `Bearer ${localStorage.getItem('token')}` : '',
          },
        });
        const data = await response.json();
        if (data.success) {
          setCreators(data.users || []);
          setTotalPages(data.pagination.pages);
        }
      } else {
        // Use explore endpoint
        const response = await fetch(`/api/home-v2/explore?${params.toString()}`, {
          headers: {
            'Authorization': user ? `Bearer ${localStorage.getItem('token')}` : '',
          },
        });
        const data = await response.json();
        if (data.success) {
          setCreators(data.results.creators || []);
          setContent(data.results.content || []);
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      console.error('Error loading explore data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory, selectedType, sortBy, searchQuery, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadExploreData();
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType, sortBy, searchQuery]);

  const CreatorCard: React.FC<{ creator: Creator }> = ({ creator }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-purple-200 dark:ring-purple-800">
              <AvatarImage src={creator.avatar} alt={creator.displayName} />
              <AvatarFallback>{creator.displayName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm">{creator.displayName}</h3>
                {creator.isVerified && (
                  <Award className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">@{creator.username}</p>
            </div>
          </div>
          {creator.similarityScore && (
            <Badge variant="secondary" className="text-xs">
              {Math.round(creator.similarityScore)}% match
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {creator.bio || 'Creative content creator sharing amazing work'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {creator.categories?.slice(0, 2).map((category, index) => (
            <Badge key={index} variant="outline-solid" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{creator.subscriberCount.toLocaleString()} subscribers</span>
          </div>
          <div className="flex items-center space-x-1">
            <Camera className="w-3 h-3" />
            <span>{creator.contentCount} posts</span>
          </div>
        </div>
        
        <Link to={`/creator/${creator.username}`}>
          <Button className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <UserPlus className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const ContentCard: React.FC<{ item: Content }> = ({ item }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={item.creator.avatar} alt={item.creator.displayName} />
              <AvatarFallback>{item.creator.displayName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{item.creator.displayName}</p>
              {item.creator.isVerified && <Award className="w-3 h-3 text-blue-500 inline ml-1" />}
            </div>
          </div>
          <Badge variant={item.tier === 'FREE' ? 'secondary' : 'default'} className="text-xs">
            {item.tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {item.mediaUrls?.[0] && (
          <div className="relative mb-3 rounded-lg overflow-hidden bg-muted">
            {item.type === 'IMAGE' ? (
              <img 
                src={item.mediaUrls[0]} 
                alt={item.title}
                className="w-full h-32 object-cover"
              />
            ) : item.type === 'VIDEO' ? (
              <video 
                src={item.mediaUrls[0]} 
                className="w-full h-32 object-cover"
                poster={item.mediaUrls[1]}
              />
            ) : (
              <div className="w-full h-32 flex items-center justify-center">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
        
        <h3 className="font-semibold text-sm mb-2 line-clamp-1">{item.title}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline-solid" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{item.stats.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-3 h-3" />
              <span>{item.stats.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{item.stats.views}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xs border-b border-purple-200 dark:border-purple-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Explore OnlyFur
                </h1>
                <p className="text-muted-foreground">
                  Discover amazing creators and content {user && 'personalized just for you'}
                </p>
              </div>
              {user && recommendations.length > 0 && (
                <Badge className="bg-linear-to-r from-purple-600 to-pink-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              )}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1">
              <AISearchAndDiscovery />
            </form>

            {/* Category and Type Filters */}
            <div className="flex gap-3 mt-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name} ({category.creatorCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="creators">Creators</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recommendations Section (for logged-in users) */}
        {user && recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Recommended for You</h2>
              <Badge variant="secondary">AI Powered</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.slice(0, 8).map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {(trendingCreators.length > 0 || trendingContent.length > 0) && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold">Trending This Week</h2>
            </div>
            <Tabs defaultValue="creators" className="space-y-4">
              <TabsList>
                <TabsTrigger value="creators">Trending Creators</TabsTrigger>
                <TabsTrigger value="content">Trending Content</TabsTrigger>
              </TabsList>
              <TabsContent value="creators">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trendingCreators.slice(0, 8).map((creator) => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="content">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trendingContent.slice(0, 8).map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Explore'}
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <>
              {selectedType === 'creators' || selectedType === 'all' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {creators.map((creator) => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              ) : null}

              {selectedType === 'content' || selectedType === 'all' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {content.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              ) : null}

              {creators.length === 0 && content.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreV3;

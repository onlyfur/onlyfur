import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { 
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  Award,
  Sparkles,
  TrendingUp,
  UserPlus,
  Eye,
  Star,
  Zap,
  Users,
  Camera,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createProductionApiCall } from '@/utils/productionApi';

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
  reasonsToSubscribe?: string[];
  recentContent?: any[];
  subscriptionTiers?: any[];
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
  userInteractions?: string[];
  createdAt: string;
}

interface FeedSection {
  title: string;
  items: any[];
  type: 'content' | 'creators' | 'categories';
}

const HomeV3: React.FC = () => {
  const { user } = useAuth();
  const [feedSections, setFeedSections] = useState<Record<string, FeedSection>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    loadHomeFeed();
  }, [user]);

  const loadHomeFeed = async () => {
    setIsLoading(!refreshing);
    try {
      const apiCall = createProductionApiCall('/api/home-v2/feed?limit=20', {
        method: 'GET',
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        } : {},
      });
      const data = await apiCall();
      
      if (data.success) {
        setFeedSections(data.feedSections);
      }
    } catch (error) {
      console.error('Error loading home feed:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHomeFeed();
  };

  const handleContentAction = async (contentId: string, action: 'like' | 'bookmark' | 'share') => {
    if (!user) return;

    try {
      if (action === 'like') {
        const apiCall = createProductionApiCall(`/api/content-v3/${contentId}/like`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await apiCall();
        
        if (data) {
          // Update local state to reflect the like
          loadHomeFeed();
        }
      }
      // Handle other actions similarly
    } catch (error) {
      console.error(`Error ${action}ing content:`, error);
    }
  };

  const ContentCard: React.FC<{ content: Content }> = ({ content }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const isLiked = content.userInteractions?.includes('LIKE') || false;
    const isBookmarked = content.userInteractions?.includes('BOOKMARK') || false;

    return (
      <Card className="w-full hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/creator/${content.creator.username}`}>
                <Avatar className="w-10 h-10 ring-2 ring-purple-200 hover:ring-purple-400 transition-colors">
                  <AvatarImage src={content.creator.avatar} alt={content.creator.displayName} />
                  <AvatarFallback>{content.creator.displayName?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  <Link to={`/creator/${content.creator.username}`} className="font-semibold hover:text-purple-600 transition-colors">
                    {content.creator.displayName}
                  </Link>
                  {content.creator.isVerified && (
                    <Award className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                  <Badge variant={content.tier === 'FREE' ? 'secondary' : 'default'} className="text-xs">
                    {content.tier}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
            {content.description && (
              <p className="text-muted-foreground">{content.description}</p>
            )}
          </div>

          {/* Media Content */}
          {content.mediaUrls && content.mediaUrls.length > 0 && (
            <div className="relative rounded-lg overflow-hidden bg-black">
              {content.type === 'IMAGE' && (
                <img 
                  src={content.mediaUrls[0]} 
                  alt={content.title}
                  className="w-full max-h-96 object-contain"
                />
              )}
              {content.type === 'VIDEO' && (
                <div className="relative">
                  <video 
                    src={content.mediaUrls[0]}
                    className="w-full max-h-96 object-contain"
                    controls={isPlaying}
                    muted={isMuted}
                    poster={content.mediaUrls[1]}
                  />
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}
              {content.type === 'AUDIO' && (
                <div className="p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Volume2 className="w-8 h-8 text-purple-600" />
                    </div>
                    <audio controls className="w-full">
                      <source src={content.mediaUrls[0]} />
                    </audio>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Content */}
          {content.textContent && (
            <div className="prose dark:prose-invert max-w-none">
              <p>{content.textContent}</p>
            </div>
          )}

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.tags.slice(0, 5).map((tag, index) => (
                <Badge key={index} variant="outline-solid" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleContentAction(content.id, 'like')}
                className={isLiked ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {content.stats.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                {content.stats.comments}
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                {content.stats.views}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleContentAction(content.id, 'bookmark')}
              className={isBookmarked ? 'text-yellow-500' : ''}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CreatorCard: React.FC<{ creator: Creator }> = ({ creator }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 ring-2 ring-purple-200">
            <AvatarImage src={creator.avatar} alt={creator.displayName} />
            <AvatarFallback>{creator.displayName?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{creator.displayName}</h3>
              {creator.isVerified && <Award className="w-4 h-4 text-blue-500" />}
              {creator.similarityScore && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(creator.similarityScore)}% match
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{creator.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {creator.bio || 'Creative content creator sharing amazing work'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{creator.subscriberCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Camera className="w-4 h-4" />
            <span>{creator.contentCount}</span>
          </div>
        </div>

        {creator.reasonsToSubscribe && creator.reasonsToSubscribe.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-purple-600">Why subscribe:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {creator.reasonsToSubscribe.slice(0, 2).map((reason, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to={`/creator/${creator.username}`}>
          <Button className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <UserPlus className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const FeedSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <FeedSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {user ? `Welcome back, ${user.displayName}!` : 'Welcome to OnlyFur'}
              </h1>
              <p className="text-muted-foreground">
                {user 
                  ? 'Your personalized feed with AI-powered recommendations'
                  : 'Discover amazing creators and content'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {user && (
                <Badge className="bg-linear-to-r from-purple-600 to-pink-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {!user && (
            <Card className="mb-6 bg-linear-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Get Personalized Recommendations
                    </h3>
                    <p className="text-purple-100 mb-4">
                      Sign up to get AI-powered content suggestions based on your interests
                    </p>
                    <div className="flex space-x-3">
                      <Link to="/register">
                        <Button variant="secondary">
                          Create Account
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Sparkles className="w-16 h-16 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Feed Sections */}
        <div className="space-y-8">
          {Object.entries(feedSections).map(([key, section]) => (
            <div key={key}>
              <div className="flex items-center space-x-2 mb-4">
                {key === 'recommendedCreators' && <Sparkles className="w-5 h-5 text-purple-600" />}
                {key === 'trendingContent' && <TrendingUp className="w-5 h-5 text-orange-600" />}
                {key === 'newCreators' && <Zap className="w-5 h-5 text-green-600" />}
                <h2 className="text-xl font-semibold">{section.title}</h2>
                {key === 'recommendedCreators' && (
                  <Badge variant="secondary">AI</Badge>
                )}
              </div>

              {section.type === 'content' && (
                <div className="space-y-6">
                  {section.items.map((content) => (
                    <ContentCard key={content.id} content={content} />
                  ))}
                </div>
              )}

              {section.type === 'creators' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((creator) => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              )}

              {section.type === 'categories' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {section.items.map((category, index) => (
                    <Link
                      key={index}
                      to={`/explore?category=${encodeURIComponent(category.name)}`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {category.contentCount} posts
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {section.items.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No content available in this section</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}

          {Object.keys(feedSections).length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start following creators to see content in your feed
                </p>
                <Link to="/explore">
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Explore Creators
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeV3;
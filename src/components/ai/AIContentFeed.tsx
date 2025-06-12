import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import {
  Brain,
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Eye,
  TrendingUp,
  Users,
  Clock,
  Zap,
  Target,
  Filter,
  RefreshCw,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Flag,
  UserPlus,
  Settings,
  ChevronDown,
  ImageIcon,
  VideoIcon,
  FileText,
  Camera,
  Mic,
  CheckCircle
} from 'lucide-react';
import AnimatedLoader from '../ui/AnimatedLoader';

interface AIContent {
  id: string;
  type: 'image' | 'video' | 'text' | 'audio';
  title: string;
  description: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  thumbnail?: string;
  tags: string[];
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  aiScore: number;
  trending: boolean;
  createdAt: string;
}

export default function AIContentFeed() {
  const [activeTab, setActiveTab] = useState('trending');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<AIContent[]>([]);
  const [filter, setFilter] = useState('all');

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockContent: AIContent[] = [
        {
          id: '1',
          type: 'image',
          title: 'AI-Enhanced Character Design',
          description: 'A stunning character design enhanced with AI techniques',
          creator: {
            name: 'ArtistAI',
            avatar: '/avatars/artist1.jpg',
            verified: true
          },
          thumbnail: '/thumbnails/design1.jpg',
          tags: ['character', 'design', 'ai-art'],
          stats: {
            likes: 1200,
            comments: 89,
            shares: 45,
            views: 15000
          },
          aiScore: 95,
          trending: true,
          createdAt: '2024-01-20T10:30:00Z'
        },
        {
          id: '2',
          type: 'video',
          title: 'AI Animation Showcase',
          description: 'Watch this amazing AI-powered animation sequence',
          creator: {
            name: 'AnimatorPro',
            avatar: '/avatars/animator1.jpg',
            verified: true
          },
          thumbnail: '/thumbnails/animation1.jpg',
          tags: ['animation', '3d', 'ai-motion'],
          stats: {
            likes: 2300,
            comments: 156,
            shares: 89,
            views: 28000
          },
          aiScore: 92,
          trending: true,
          createdAt: '2024-01-19T15:45:00Z'
        },
        {
          id: '3',
          type: 'text',
          title: 'AI-Generated Story',
          description: 'An engaging story created with AI assistance',
          creator: {
            name: 'StoryTeller',
            avatar: '/avatars/writer1.jpg',
            verified: false
          },
          tags: ['story', 'fiction', 'ai-writing'],
          stats: {
            likes: 890,
            comments: 67,
            shares: 23,
            views: 8500
          },
          aiScore: 88,
          trending: false,
          createdAt: '2024-01-18T09:15:00Z'
        },
        {
          id: '4',
          type: 'audio',
          title: 'AI Music Composition',
          description: 'Beautiful ambient music created with AI',
          creator: {
            name: 'MusicAI',
            avatar: '/avatars/musician1.jpg',
            verified: true
          },
          thumbnail: '/thumbnails/music1.jpg',
          tags: ['music', 'ambient', 'ai-composition'],
          stats: {
            likes: 1560,
            comments: 98,
            shares: 67,
            views: 12000
          },
          aiScore: 91,
          trending: true,
          createdAt: '2024-01-17T14:30:00Z'
        }
      ];

      setContent(mockContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent, activeTab, filter]);

  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <VideoIcon className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  }, []);

  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
  }, []);

  const filteredContent = useCallback(() => {
    if (filter === 'all') return content;
    return content.filter(item => item.type === filter);
  }, [content, filter]);

  const tabOptions = [
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'latest', label: 'Latest', icon: Clock },
    { value: 'following', label: 'Following', icon: Users },
    { value: 'favorites', label: 'Favorites', icon: Star }
  ];

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'text', label: 'Text' },
    { value: 'audio', label: 'Audio' }
  ];

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Content Feed
          </h1>
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover amazing AI-enhanced content from creators around the world
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabOptions.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={activeTab === value ? 'default' : 'outline'}
              onClick={() => handleTabChange(value)}
              className="flex items-center space-x-2"
              size="sm"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        {/* Filter Options */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter:</span>
          </div>
          
          {filterOptions.map(({ value, label }) => (
            <Badge
              key={value}
              variant={filter === value ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-opacity-80 transition-colors"
              onClick={() => handleFilterChange(value)}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content Feed */}
      <AnimatePresence>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <AnimatedLoader type="ai" size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6"
          >
            {filteredContent().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={item.creator.avatar} />
                          <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{item.creator.name}</CardTitle>
                            {item.creator.verified && (
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span className="text-xs">Verified</span>
                              </Badge>
                            )}
                            {item.trending && (
                              <Badge className="bg-orange-100 text-orange-800 flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-xs">Trending</span>
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(item.type)}
                              <span className="capitalize">{item.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>

                    {/* Content Preview */}
                    {item.thumbnail && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=${item.type.toUpperCase()}`;
                          }}
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button size="icon" variant="secondary" className="w-12 h-12 rounded-full bg-white/90 hover:bg-white">
                              <Play className="w-6 h-6" />
                            </Button>
                          </div>
                        )}
                        {item.type === 'audio' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                            <Button size="icon" variant="secondary" className="w-12 h-12 rounded-full bg-white/90 hover:bg-white">
                              <Play className="w-6 h-6" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs hover:bg-purple-100 cursor-pointer">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="space-x-2 hover:text-red-500">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(item.stats.likes)}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="space-x-2 hover:text-blue-500">
                          <MessageSquare className="w-4 h-4" />
                          <span>{formatNumber(item.stats.comments)}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="space-x-2 hover:text-green-500">
                          <Share2 className="w-4 h-4" />
                          <span>{formatNumber(item.stats.shares)}</span>
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(item.stats.views)}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:text-yellow-500">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* AI Score */}
                    {item.aiScore > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">AI Quality Score: {item.aiScore}%</span>
                        <Progress value={item.aiScore} className="w-24 h-2" />
                        {item.aiScore >= 90 && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Excellent
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More Button */}
      {!isLoading && filteredContent().length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            size="lg"
            className="space-x-2"
            onClick={fetchContent}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Load More Content</span>
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredContent().length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No content found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or check back later for new content.
          </p>
          <Button onClick={fetchContent} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Feed
          </Button>
        </motion.div>
      )}
    </div>
  );
}

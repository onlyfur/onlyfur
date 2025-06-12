import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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

  // Simulate fetching content
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
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
        // Add more mock content items as needed
      ];

      setContent(mockContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [activeTab, filter]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <VideoIcon className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'audio': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

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

      {/* Tabs and Filters */}
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="latest" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Latest</span>
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Following</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Favorites</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            onClick={() => setFilter('all')}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
          
          <Badge variant={filter === 'all' ? 'default' : 'secondary'} 
                className="cursor-pointer"
                onClick={() => setFilter('all')}>
            All
          </Badge>
          <Badge variant={filter === 'image' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setFilter('image')}>
            Images
          </Badge>
          <Badge variant={filter === 'video' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setFilter('video')}>
            Videos
          </Badge>
          <Badge variant={filter === 'text' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setFilter('text')}>
            Text
          </Badge>
          <Badge variant={filter === 'audio' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setFilter('audio')}>
            Audio
          </Badge>
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
            {content.map((item, index) => (
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
                              <Badge variant="secondary">
                                <CheckCircle className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{new Date(item.createdAt).toLocaleDateString()}</CardDescription>
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
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button size="icon" variant="secondary" className="w-12 h-12 rounded-full">
                              <Play className="w-6 h-6" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="space-x-2">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(item.stats.likes)}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>{formatNumber(item.stats.comments)}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="space-x-2">
                          <Share2 className="w-4 h-4" />
                          <span>{formatNumber(item.stats.shares)}</span>
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(item.stats.views)}</span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* AI Score */}
                    {item.aiScore > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span>AI Score: {item.aiScore}%</span>
                        <Progress value={item.aiScore} className="w-24 h-2" />
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
      <div className="flex justify-center pt-6">
        <Button
          variant="outline"
          size="lg"
          className="space-x-2"
          onClick={() => fetchContent()}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Load More</span>
        </Button>
      </div>
    </div>
  );
}

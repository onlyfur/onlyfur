import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  Eye, 
  Star, 
  Crown, 
  Shield,
  MapPin,
  Calendar,
  Link as LinkIcon,
  MessageCircle,
  Share2,
  Flag,
  MoreVertical,
  Settings,
  Camera,
  Edit3,
  Gift,
  DollarSign,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Bookmark,
  Zap,
  TrendingUp,
  Award,
  Target,
  Brain,
  Sparkles,
  BarChart3,
  Clock,
  CheckCircle,
  UserPlus,
  UserMinus,
  Bell,
  BellOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import AIRecommendationEngine from '@/components/ai/AIRecommendationEngine';
import { FullScreenLoader } from '@/components/ui/AnimatedLoader';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  location: string;
  website: string;
  joinDate: Date;
  isVerified: boolean;
  isCreator: boolean;
  role: 'user' | 'creator' | 'admin';
  stats: {
    followers: number;
    following: number;
    posts: number;
    likes: number;
    views: number;
    earnings: number;
  };
  social: {
    twitter?: string;
    instagram?: string;
    discord?: string;
    youtube?: string;
  };
  subscriptionTiers?: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    perks: string[];
    subscriberCount: number;
  }>;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  }>;
  aiInsights?: {
    personalityType: string;
    contentStyle: string;
    engagementPrediction: number;
    recommendationScore: number;
    growthTrend: 'up' | 'down' | 'stable';
  };
}

interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: 'image' | 'video' | 'audio' | 'text';
  duration?: number;
  createdAt: Date;
  likes: number;
  views: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tier: 'free' | 'basic' | 'pro' | 'vip';
  tags: string[];
  aiScore?: number;
}

const ProfileV3: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [activeTab, setActiveTab] = useState('content');
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const isOwnProfile = user?.id === userId || (!userId && user);

  useEffect(() => {
    loadProfile();
    loadContent();
  }, [userId]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      // Use production-safe API call
      const endpoint = `/api/users-v3/${userId || user?.id}`;
      const response = await fetch(endpoint, {
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        } : {},
        // Use same-origin credentials in production
        credentials: window.location.hostname.includes('vercel.app') ? 'same-origin' : 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
        setIsFollowing(data.isFollowing);
        setIsSubscribed(data.isSubscribed);
      } else {
        // Mock data for demo
        setProfile(generateMockProfile());
      }
    } catch (error) {
      // Only log in development to prevent console spam
      if (import.meta.env?.DEV) {
        console.error('Error loading profile:', error);
      }
      // Always provide fallback data to prevent crashes
      setProfile(generateMockProfile());
    } finally {
      setIsLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      const response = await fetch(`/api/content-v3/user/${userId || user?.id}`, {
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        } : {},
      });
      
      const data = await response.json();
      if (data.success) {
        setContent(data.content);
      } else {
        setContent(generateMockContent());
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(generateMockContent());
    }
  };

  const generateMockProfile = (): UserProfile => ({
    id: userId || user?.id || 'demo',
    username: 'artisticfox',
    displayName: 'ArtisticFox',
    avatar: '/api/placeholder/150/150',
    banner: '/api/placeholder/800/300',
    bio: '🎨 Digital artist creating furry art and tutorials\\n🔥 Commissions open\\n📚 Teaching art fundamentals\\n🌟 VIP tier includes exclusive content',
    location: 'Digital Realm',
    website: 'https://artisticfox.art',
    joinDate: new Date('2022-03-15'),
    isVerified: true,
    isCreator: true,
    role: 'creator',
    stats: {
      followers: 15420,
      following: 387,
      posts: 234,
      likes: 89341,
      views: 1234567,
      earnings: 45230,
    },
    social: {
      twitter: '@artisticfox',
      instagram: 'artisticfox_art',
      discord: 'ArtisticFox#1234',
      youtube: 'ArtisticFoxTutorials',
    },
    subscriptionTiers: [
      {
        id: 'basic',
        name: 'Art Enthusiast',
        price: 4.99,
        description: 'Access to all my regular artwork and tutorials',
        perks: ['High-res downloads', 'Weekly tutorials', 'Community access'],
        subscriberCount: 1234,
      },
      {
        id: 'pro',
        name: 'Art Student',
        price: 9.99,
        description: 'Everything in basic plus exclusive content and early access',
        perks: ['All basic perks', 'Early access', 'Monthly live streams', 'PSD files'],
        subscriberCount: 567,
      },
      {
        id: 'vip',
        name: 'Art Master',
        price: 19.99,
        description: 'Premium tier with personal attention and custom content',
        perks: ['All pro perks', 'Monthly 1-on-1 session', 'Custom tutorials', 'Direct messaging'],
        subscriberCount: 123,
      },
    ],
    badges: [
      {
        id: '1',
        name: 'Verified Creator',
        description: 'Verified content creator',
        icon: '✓',
        color: 'blue',
        rarity: 'rare',
      },
      {
        id: '2',
        name: 'Top Educator',
        description: 'Highly rated educational content',
        icon: '🎓',
        color: 'purple',
        rarity: 'epic',
      },
      {
        id: '3',
        name: 'Community Favorite',
        description: 'Loved by the community',
        icon: '❤️',
        color: 'red',
        rarity: 'legendary',
      },
    ],
    aiInsights: {
      personalityType: 'Creative Educator',
      contentStyle: 'Educational & Artistic',
      engagementPrediction: 94,
      recommendationScore: 97,
      growthTrend: 'up',
    },
  });

  const generateMockContent = (): Content[] => [
    {
      id: '1',
      title: 'Digital Art Fundamentals - Part 1',
      description: 'Learn the basics of digital art with this comprehensive tutorial',
      thumbnail: '/api/placeholder/400/300',
      type: 'video',
      duration: 1800,
      createdAt: new Date('2024-01-15'),
      likes: 1234,
      views: 5678,
      comments: 89,
      isLiked: false,
      isBookmarked: false,
      tier: 'basic',
      tags: ['tutorial', 'digital art', 'fundamentals'],
      aiScore: 94,
    },
    {
      id: '2',
      title: 'Character Design Workshop',
      description: 'Step-by-step character design process',
      thumbnail: '/api/placeholder/400/300',
      type: 'image',
      createdAt: new Date('2024-01-12'),
      likes: 2341,
      views: 7890,
      comments: 156,
      isLiked: true,
      isBookmarked: true,
      tier: 'pro',
      tags: ['character design', 'workshop', 'process'],
      aiScore: 97,
    },
    {
      id: '3',
      title: 'Speed Paint Session #23',
      description: 'Watch me create a fantasy landscape in real-time',
      thumbnail: '/api/placeholder/400/300',
      type: 'video',
      duration: 2400,
      createdAt: new Date('2024-01-10'),
      likes: 891,
      views: 3456,
      comments: 67,
      isLiked: false,
      isBookmarked: false,
      tier: 'free',
      tags: ['speed paint', 'landscape', 'fantasy'],
      aiScore: 89,
    },
  ];

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users-v3/follow/${profile?.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setIsFollowing(!isFollowing);
        if (profile) {
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
              followers: profile.stats.followers + (isFollowing ? -1 : 1),
            },
          });
        }
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleSubscribe = async (tierId: string) => {
    try {
      const response = await fetch('/api/subscriptions-v3/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          creatorId: profile?.id,
          tierId,
        }),
      });
      
      if (response.ok) {
        setIsSubscribed(true);
        setSelectedTier(tierId);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const StatCard: React.FC<{
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    index: number;
  }> = ({ label, value, icon, color, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="text-center hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
            {icon}
          </div>
          <motion.p 
            className="text-2xl font-bold mb-1"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          >
            {typeof value === 'number' ? formatNumber(value) : value}
          </motion.p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ContentCard: React.FC<{ content: Content; index: number }> = ({ content, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30">
        <div className="relative">
          <img
            src={content.thumbnail}
            alt={content.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* AI Score Badge */}
          {content.aiScore && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-2 left-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1"
            >
              <Brain className="w-3 h-3" />
              <span>{content.aiScore}</span>
            </motion.div>
          )}
          
          {/* Tier Badge */}
          <Badge 
            className={`absolute top-2 right-2 ${
              content.tier === 'free' ? 'bg-green-500' :
              content.tier === 'basic' ? 'bg-blue-500' :
              content.tier === 'pro' ? 'bg-purple-500' :
              'bg-yellow-500'
            } text-white border-0`}
          >
            {content.tier.toUpperCase()}
          </Badge>
          
          {/* Play button for videos */}
          {content.type === 'video' && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-800 ml-1" />
              </div>
            </motion.div>
          )}
          
          {/* Duration for videos */}
          {content.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {content.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {content.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatNumber(content.views)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className={`w-3 h-3 ${content.isLiked ? 'text-red-500 fill-current' : ''}`} />
                <span>{formatNumber(content.likes)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{content.comments}</span>
              </div>
            </div>
            <span>{format(content.createdAt, 'MMM d')}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {content.tags.slice(0, 3).map((tag, tagIndex) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: tagIndex * 0.1 + 0.4 }}
              >
                <Badge variant="outline-solid" className="text-xs">
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-1 rounded ${content.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`w-4 h-4 ${content.isLiked ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-1 rounded ${content.isBookmarked ? 'text-purple-500' : 'text-gray-400 hover:text-purple-500'}`}
              >
                <Bookmark className={`w-4 h-4 ${content.isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded text-gray-400 hover:text-blue-500"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                View
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return <FullScreenLoader message="Loading profile..." subMessage="Preparing all the amazing content" />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
            <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      {/* Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 bg-linear-to-r from-purple-600 to-pink-600 overflow-hidden"
      >
        <img
          src={profile.banner}
          alt="Profile banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        
        {/* AI Insights Toggle */}
        {profile.aiInsights && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="bg-white/10 backdrop-blur-xs border-white/20 text-white hover:bg-white/20"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-white dark:ring-gray-800">
                  <AvatarImage src={profile.avatar} alt={profile.displayName} />
                  <AvatarFallback className="text-2xl">{profile.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                {profile.isVerified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800"
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                )}
                
                {profile.isCreator && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800"
                  >
                    <Crown className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                    {profile.role === 'admin' && (
                      <Badge className="bg-red-500 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>
                
                <p className="text-sm whitespace-pre-line">{profile.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {format(profile.joinDate, 'MMMM yyyy')}</span>
                  </div>
                  {profile.website && (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge 
                        className={`${getBadgeRarityColor(badge.rarity)} border cursor-help`}
                        title={badge.description}
                      >
                        <span className="mr-1">{badge.icon}</span>
                        {badge.name}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                {!isOwnProfile ? (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleFollow}
                        variant={isFollowing ? "outline" : "default"}
                        className={isFollowing ? "" : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    </motion.div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Gift className="w-4 h-4 mr-2" />
                        Tip
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Insights Panel */}
        <AnimatePresence>
          {showAIInsights && profile.aiInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Card className="border-2 border-purple-200 dark:border-purple-800 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span>AI Profile Insights</span>
                    <Badge variant="secondary" className="bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Powered
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Machine learning analysis of profile patterns and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Personality Type</span>
                        <Target className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-lg font-bold text-purple-600">{profile.aiInsights.personalityType}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Content Style</span>
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-lg font-bold text-blue-600">{profile.aiInsights.contentStyle}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Engagement Prediction</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-lg font-bold text-green-600">{profile.aiInsights.engagementPrediction}%</p>
                      <Progress value={profile.aiInsights.engagementPrediction} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Recommendation Score</span>
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="text-lg font-bold text-yellow-600">{profile.aiInsights.recommendationScore}%</p>
                      <Progress value={profile.aiInsights.recommendationScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          <StatCard
            label="Followers"
            value={profile.stats.followers}
            icon={<Users className="w-5 h-5 text-white" />}
            color="bg-blue-500"
            index={0}
          />
          <StatCard
            label="Following"
            value={profile.stats.following}
            icon={<UserPlus className="w-5 h-5 text-white" />}
            color="bg-green-500"
            index={1}
          />
          <StatCard
            label="Posts"
            value={profile.stats.posts}
            icon={<Eye className="w-5 h-5 text-white" />}
            color="bg-purple-500"
            index={2}
          />
          <StatCard
            label="Likes"
            value={profile.stats.likes}
            icon={<Heart className="w-5 h-5 text-white" />}
            color="bg-red-500"
            index={3}
          />
          <StatCard
            label="Views"
            value={profile.stats.views}
            icon={<Eye className="w-5 h-5 text-white" />}
            color="bg-indigo-500"
            index={4}
          />
          {profile.isCreator && (
            <StatCard
              label="Earnings"
              value={`$${formatNumber(profile.stats.earnings)}`}
              icon={<DollarSign className="w-5 h-5 text-white" />}
              color="bg-yellow-500"
              index={5}
            />
          )}
        </div>

        {/* Subscription Tiers (for creators) */}
        {profile.isCreator && profile.subscriptionTiers && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span>Subscription Tiers</span>
                </CardTitle>
                <CardDescription>
                  Support this creator and get exclusive content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profile.subscriptionTiers.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.9 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${
                        selectedTier === tier.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50' : 'border-gray-200 dark:border-gray-700'
                      }`}>
                        <CardHeader className="text-center">
                          <CardTitle className="text-lg">{tier.name}</CardTitle>
                          <div className="text-3xl font-bold text-purple-600">
                            ${tier.price}
                            <span className="text-sm text-muted-foreground">/month</span>
                          </div>
                          <CardDescription>{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {tier.perks.map((perk, perkIndex) => (
                              <motion.li
                                key={perkIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: perkIndex * 0.1 + index * 0.1 + 1 }}
                                className="flex items-center space-x-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                <span>{perk}</span>
                              </motion.li>
                            ))}
                          </ul>
                          
                          <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {tier.subscriberCount} subscribers
                            </p>
                            {!isOwnProfile && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => handleSubscribe(tier.id)}
                                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                  disabled={isSubscribed && selectedTier === tier.id}
                                >
                                  {isSubscribed && selectedTier === tier.id ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Subscribed
                                    </>
                                  ) : (
                                    <>
                                      <Crown className="w-4 h-4 mr-2" />
                                      Subscribe
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {content.map((item, index) => (
                    <ContentCard key={item.id} content={item} index={index} />
                  ))}
                </AnimatePresence>
              </div>
              
              {content.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No content yet
                  </h3>
                  <p className="text-gray-500">
                    {isOwnProfile ? "Start creating amazing content!" : "This creator hasn't posted anything yet."}
                  </p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <AIRecommendationEngine
                userId={profile.id}
                context="creator"
                maxRecommendations={6}
                showInsights={true}
              />
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Connect on other platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(profile.social).map(([platform, handle], index) => (
                      handle && (
                        <motion.div
                          key={platform}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">{platform}</p>
                            <p className="text-sm text-muted-foreground">{handle}</p>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {profile.displayName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Achievements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.badges.map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 border rounded-lg"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${getBadgeRarityColor(badge.rarity)}`}>
                            {badge.icon}
                          </div>
                          <div>
                            <p className="font-medium">{badge.name}</p>
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileV3;
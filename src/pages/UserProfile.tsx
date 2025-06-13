import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Star, 
  Users, 
  Calendar,
  MapPin,
  Camera,
  Video,
  Image as ImageIcon,
  FileText,
  Crown,
  Zap,
  Lock,
  Eye,
  Download,
  Gift,
  Settings,
  Flag,
  MoreVertical,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState('posts');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data based on creators from Explore page
  const creators = [
    {
      id: 1,
      name: 'Luna Silverpaw',
      username: 'luna_silverpaw',
      avatar: '🦊',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=300&fit=crop',
      species: 'Fox',
      location: 'Pacific Northwest, USA',
      joinDate: '2023-01-15',
      isVerified: true,
      isOnline: true,
      lastSeen: '2 minutes ago',
      description: 'Professional fursuit photographer and content creator specializing in outdoor shoots and convention coverage. I love capturing the magic of the furry community through my lens! 📸✨',
      category: 'Fursuit Photos',
      price: 19.99,
      priceDisplay: '$19.99/month',
      subscribers: '3.2K',
      rating: 4.9,
      tags: ['fursuit', 'photography', 'convention', 'nature', 'sfw', 'outdoor']
    },
    {
      id: 2,
      name: 'Rex Dragonheart',
      username: 'rex_dragonheart',
      avatar: '🐲',
      banner: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop',
      species: 'Dragon',
      location: 'Fantasy Realm',
      joinDate: '2022-11-20',
      isVerified: true,
      isOnline: false,
      lastSeen: '1 hour ago',
      description: 'Fantasy dragon artist specializing in detailed character commissions and YCH. I bring mythical creatures to life through digital art! 🐉🎨',
      category: 'Digital Art',
      price: 14.99,
      priceDisplay: '$14.99/month',
      subscribers: '5.8K',
      rating: 4.8,
      tags: ['art', 'digital', 'dragon', 'commission', 'fantasy', 'detailed', 'male']
    },
    {
      id: 11,
      name: 'Ember Wolf',
      username: 'ember_wolf',
      avatar: '🔥',
      banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=300&fit=crop',
      species: 'Wolf',
      location: 'Private Studio, USA',
      joinDate: '2022-08-14',
      isVerified: true,
      isOnline: true,
      lastSeen: 'Just now',
      description: 'Adult content creator specializing in murrsuit and intimate experiences. Join me for exclusive NSFW content and private shows! 🔥💋 18+ ONLY',
      category: 'Murrsuit Content',
      price: 29.99,
      priceDisplay: '$29.99/month',
      subscribers: '7.3K',
      rating: 4.8,
      tags: ['murrsuit', 'adult', 'nsfw', 'intimate', 'wolf', 'male', 'latex']
    },
    {
      id: 13,
      name: 'Storm Gryphon',
      username: 'storm_gryphon',
      avatar: '🦅',
      banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=300&fit=crop',
      species: 'Avian',
      location: 'Mountain Peaks, Colorado',
      joinDate: '2022-07-19',
      isVerified: true,
      isOnline: false,
      lastSeen: '30 minutes ago',
      description: 'Majestic gryphon artist creating epic fantasy scenes and character art. Soar with me through realms of imagination! ⛰️🦅',
      category: 'Digital Art',
      price: 25.99,
      priceDisplay: '$25.99/month',
      subscribers: '4.9K',
      rating: 4.9,
      tags: ['art', 'digital', 'fantasy', 'epic', 'gryphon', 'male', 'detailed', 'commission']
    }
  ];

  const creator = creators.find(c => c.username === username) || creators[0];

  const posts = [
    {
      id: 1,
      type: 'photo',
      title: creator.category === 'Murrsuit Content' ? 'Exclusive Private Session Preview' : 'Golden Hour Forest Shoot',
      description: creator.category === 'Murrsuit Content' 
        ? 'A sneak peek of tonight\'s private show. Subscribe for full access to my intimate content! 🔥💋'
        : 'Captured this magical moment during golden hour in the redwood forest. The lighting was absolutely perfect! 🌲✨',
      thumbnail: creator.category === 'Murrsuit Content' 
        ? 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      isLocked: creator.category === 'Murrsuit Content',
      likes: creator.category === 'Murrsuit Content' ? 567 : 234,
      comments: creator.category === 'Murrsuit Content' ? 45 : 18,
      timestamp: '2 hours ago',
      tags: creator.category === 'Murrsuit Content' 
        ? ['murrsuit', 'private', 'exclusive', 'nsfw']
        : ['fursuit', 'nature', 'golden-hour', 'forest']
    },
    {
      id: 2,
      type: 'video',
      title: creator.category === 'Murrsuit Content' ? 'Intimate Roleplay Session' : 'Behind the Scenes: Convention Prep',
      description: creator.category === 'Murrsuit Content'
        ? 'Join me for a steamy roleplay session. VIP subscribers get extended versions! 💋🔥'
        : 'Getting ready for MFF2024! Watch me prepare my gear and plan the perfect shots.',
      thumbnail: creator.category === 'Murrsuit Content'
        ? 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop',
      isLocked: true,
      duration: creator.category === 'Murrsuit Content' ? '24:18' : '12:34',
      likes: creator.category === 'Murrsuit Content' ? 423 : 156,
      comments: creator.category === 'Murrsuit Content' ? 89 : 12,
      timestamp: '1 day ago',
      tags: creator.category === 'Murrsuit Content'
        ? ['roleplay', 'video', 'interactive', 'nsfw']
        : ['behind-scenes', 'convention', 'preparation', 'mff']
    },
    {
      id: 3,
      type: 'gallery',
      title: creator.category === 'Murrsuit Content' ? 'VIP Latex Collection' : 'Moonlight Adventure Series',
      description: creator.category === 'Murrsuit Content'
        ? 'My newest latex outfits in a steamy photoshoot. 25 exclusive photos for VIP subscribers! 🔥'
        : 'A collection of night photography shots from our midnight forest adventure. 15 photos included.',
      thumbnail: creator.category === 'Murrsuit Content'
        ? 'https://images.unsplash.com/photo-1566453620780-74b81e64c32b?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      isLocked: true,
      photoCount: creator.category === 'Murrsuit Content' ? 25 : 15,
      likes: creator.category === 'Murrsuit Content' ? 712 : 445,
      comments: creator.category === 'Murrsuit Content' ? 156 : 34,
      timestamp: '3 days ago',
      tags: creator.category === 'Murrsuit Content'
        ? ['latex', 'photoshoot', 'vip', 'nsfw']
        : ['moonlight', 'night', 'adventure', 'series']
    },
    {
      id: 4,
      type: 'video',
      title: creator.category === 'Murrsuit Content' ? 'Live Cam Show Replay' : 'Art Process Timelapse',
      description: creator.category === 'Murrsuit Content'
        ? 'Missed my live show? Catch the replay here! Interactive features included for premium subs.'
        : 'Watch me create this commission from sketch to final piece in this relaxing timelapse.',
      thumbnail: creator.category === 'Digital Art'
        ? 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      isLocked: creator.category === 'Murrsuit Content',
      duration: creator.category === 'Murrsuit Content' ? '45:22' : '18:45',
      likes: creator.category === 'Murrsuit Content' ? 634 : 267,
      comments: creator.category === 'Murrsuit Content' ? 123 : 56,
      timestamp: '1 week ago',
      tags: creator.category === 'Murrsuit Content'
        ? ['live', 'cam', 'interactive', 'nsfw']
        : ['timelapse', 'process', 'art', 'commission']
    },
    {
      id: 5,
      type: 'photo',
      title: creator.category === 'Murrsuit Content' ? 'Bedroom Selfie Collection' : 'Commission Showcase',
      description: creator.category === 'Murrsuit Content'
        ? 'Some sultry bedroom shots just for my fans. More intimate content in DMs! 😘'
        : 'A showcase of my latest commissioned artwork featuring amazing characters from the community.',
      thumbnail: creator.category === 'Digital Art'
        ? 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1611689341822-fcdd27784c91?w=400&h=300&fit=crop',
      isLocked: creator.category === 'Murrsuit Content',
      likes: creator.category === 'Murrsuit Content' ? 445 : 178,
      comments: creator.category === 'Murrsuit Content' ? 78 : 42,
      timestamp: '2 weeks ago',
      tags: creator.category === 'Murrsuit Content'
        ? ['selfie', 'bedroom', 'intimate', 'nsfw']
        : ['commission', 'showcase', 'art', 'community']
    },
    {
      id: 6,
      type: 'story',
      title: creator.category === 'Murrsuit Content' ? 'My Kinkiest Adventure Yet' : 'My Journey into Art',
      description: creator.category === 'Murrsuit Content'
        ? 'Read about my wildest experience at a private furry party. NSFW story for mature audiences!'
        : 'The story of how I discovered my passion for digital art and the community that supported me.',
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      isLocked: creator.category === 'Murrsuit Content',
      readTime: creator.category === 'Murrsuit Content' ? '8 min read' : '5 min read',
      likes: creator.category === 'Murrsuit Content' ? 234 : 178,
      comments: creator.category === 'Murrsuit Content' ? 67 : 42,
      timestamp: '3 weeks ago',
      tags: creator.category === 'Murrsuit Content'
        ? ['story', 'kinky', 'party', 'nsfw']
        : ['personal', 'story', 'journey', 'community']
    }
  ];

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'gallery': return <ImageIcon className="h-4 w-4" />;
      case 'story': return <FileText className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  const getPostTypeInfo = (post: any) => {
    switch (post.type) {
      case 'video':
        return <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">{post.duration}</span>;
      case 'gallery':
        return <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">{post.photoCount} photos</span>;
      case 'story':
        return <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">{post.readTime}</span>;
      default:
        return null;
    }
  };

  const subscriptionTiers = [
    { 
      name: 'Basic Access', 
      price: `$${(creator.price * 0.6).toFixed(2)}`, 
      description: creator.category === 'Murrsuit Content' 
        ? 'Access to basic NSFW content and behind-the-scenes material'
        : 'Access to all SFW content and basic interactions'
    },
    { 
      name: 'Premium Plus', 
      price: creator.priceDisplay, 
      description: creator.category === 'Murrsuit Content'
        ? 'Full access to all content + exclusive videos + priority messages'
        : 'All content + exclusive photos + priority messages + custom requests'
    },
    { 
      name: 'VIP Exclusive', 
      price: `$${(creator.price * 1.8).toFixed(2)}`, 
      description: creator.category === 'Murrsuit Content'
        ? 'Everything + private cam shows + custom content + direct messaging'
        : 'Everything + custom content + video calls + first access to new material'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Banner */}
      <div className="relative h-64 bg-linear-to-r from-purple-600 to-pink-600 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${creator.banner})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        
        {/* Age Warning for NSFW Content */}
        {creator.category === 'Murrsuit Content' && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Flag className="h-4 w-4" />
              18+ ONLY
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-10">
        {/* Age Verification Alert for NSFW Content */}
        {creator.category === 'Murrsuit Content' && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <Flag className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Age Restricted Content:</strong> This creator produces adult content. You must be 18+ to view and subscribe.
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <div className="w-32 h-32 text-6xl rounded-full bg-linear-to-r from-pink-500 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg">
                    {creator.avatar}
                  </div>
                  {creator.isOnline && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="mt-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{creator.name}</h1>
                    {creator.isVerified && (
                      <Badge className="bg-blue-500">
                        <Crown className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {creator.category === 'Murrsuit Content' && (
                      <Badge className="bg-red-500">
                        18+
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-1">@{creator.username}</p>
                  <p className="text-sm text-muted-foreground">{creator.species}</p>
                  <Badge variant="outline-solid" className="mt-2">{creator.category}</Badge>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {creator.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(creator.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">150+</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{creator.subscribers}</div>
                    <div className="text-sm text-muted-foreground">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 fill-current text-yellow-500" />
                      <span className="text-2xl font-bold text-primary">{creator.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    size="lg" 
                    className={`flex-1 min-w-40 ${isSubscribed ? 'bg-green-600 hover:bg-green-700' : creator.category === 'Murrsuit Content' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
                    onClick={() => setIsSubscribed(!isSubscribed)}
                  >
                    {isSubscribed ? (
                      <>
                        <Crown className="mr-2 h-4 w-4" />
                        Subscribed
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Subscribe {creator.priceDisplay}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Info */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {creator.isOnline ? 'Online now' : `Last seen ${creator.lastSeen}`}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Responds within 2 hours
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-muted-foreground mb-4">{creator.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {creator.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts (150+)</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="tiers">Subscription Tiers</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            {!isSubscribed && (
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <Lock className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Subscribe to unlock exclusive content!</strong> {creator.category === 'Murrsuit Content' ? 'Access intimate content and private shows.' : 'Some posts are only available to subscribers.'}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${post.isLocked && !isSubscribed ? 'opacity-75' : ''}`}>
                  <div className="relative">
                    <img 
                      src={post.thumbnail} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Post Type Indicator */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-black/60 text-white">
                        {getPostIcon(post.type)}
                        <span className="ml-1 capitalize">{post.type}</span>
                      </Badge>
                    </div>

                    {/* NSFW Badge */}
                    {creator.category === 'Murrsuit Content' && (
                      <div className="absolute top-2 left-20">
                        <Badge className="bg-red-600 text-white text-xs">
                          NSFW
                        </Badge>
                      </div>
                    )}

                    {/* Duration/Count Info */}
                    {getPostTypeInfo(post) && (
                      <div className="absolute top-2 right-2">
                        {getPostTypeInfo(post)}
                      </div>
                    )}

                    {/* Lock Indicator */}
                    {post.isLocked && !isSubscribed && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Subscribers Only</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline-solid" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </div>
                      </div>
                      <span>{post.timestamp}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Posts
              </Button>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>About {creator.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Species</h4>
                    <p className="text-muted-foreground">{creator.species}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Content Category</h4>
                    <p className="text-muted-foreground">{creator.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <p className="text-muted-foreground">{creator.location}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Member Since</h4>
                    <p className="text-muted-foreground">{new Date(creator.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Response Time</h4>
                    <p className="text-muted-foreground">Within 2 hours</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags & Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {creator.tags.map((tag) => (
                      <Badge key={tag} variant="outline-solid">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Tiers Tab */}
          <TabsContent value="tiers">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionTiers.map((tier, index) => (
                <Card key={tier.name} className={`relative ${index === 1 ? 'ring-2 ring-primary' : ''}`}>
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">{tier.price}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{tier.description}</p>
                    <Button 
                      className={`w-full ${creator.category === 'Murrsuit Content' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                    >
                      Subscribe to {tier.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from 'react';
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
  UserPlus
} from 'lucide-react';
import { realDataAPI } from '@/services/realDataAPI';
import OnlineStatusIndicator from '@/components/ui/OnlineStatusIndicator';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [featuredCreators, setFeaturedCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRealData, setHasRealData] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalContent: 0,
    totalSubscriptions: 0
  });

  const furryCategories = [
    { name: 'Murrsuit Content', icon: Heart, color: 'text-pink-500', count: 342, tag: 'murrsuit' },
    { name: 'Fursuit Porn', icon: Camera, color: 'text-red-500', count: 567, tag: 'fursuit-porn' },
    { name: 'Adult Digital Art', icon: Palette, color: 'text-purple-500', count: 189, tag: 'adult-art' },
    { name: 'NSFW Videos', icon: Video, color: 'text-orange-500', count: 234, tag: 'nsfw-video' },
    { name: 'Cam Shows & Live', icon: Zap, color: 'text-yellow-500', count: 156, tag: 'cam-shows' },
    { name: 'Roleplay Content', icon: Users, color: 'text-green-500', count: 98, tag: 'roleplay' },
    { name: 'Kinky Stories', icon: Music, color: 'text-indigo-500', count: 124, tag: 'kinky-stories' },
    { name: 'Custom Requests', icon: Crown, color: 'text-blue-500', count: 203, tag: 'custom' },
  ];

  const species = [
    'All Species', 'Fox', 'Wolf', 'Dragon', 'Cat', 'Dog', 'Bear', 'Rabbit', 'Deer', 'Horse', 'Bird', 
    'Sergal', 'Protogen', 'Avian', 'Reptile', 'Aquatic', 'Hybrid', 'Fictional', 'Bovine', 'Canine', 
    'Feline', 'Equine', 'Mustelid', 'Rodent', 'Marsupial', 'Primate', 'Other'
  ];

  // Load real creators from database
  useEffect(() => {
    const loadRealData = async () => {
      setIsLoading(true);
      try {
        // Check if there's real data
        const hasData = await realDataAPI.hasRealData();
        setHasRealData(hasData);

        // Load platform stats
        const statsResponse = await realDataAPI.getPlatformStats();
        if (statsResponse.success) {
          setPlatformStats(statsResponse.stats);
        }

        if (hasData) {
          // Load real creators
          const creatorsResponse = await realDataAPI.getFeaturedCreators(20);
          if (creatorsResponse.success) {
            const transformedCreators = creatorsResponse.creators.map((creator: any) => ({
              id: creator.id,
              name: creator.displayName,
              username: creator.username,
              avatar: creator.avatar || '🦊',
              category: 'Creator',
              species: 'Furry',
              subscribers: `${creator.followersCount}`,
              rating: 4.8,
              price: 19.99,
              priceDisplay: '$19.99/month',
              isVerified: creator.isVerified,
              joinDate: new Date(creator.createdAt).toISOString().split('T')[0],
              description: creator.bio || 'Amazing content creator sharing with the community',
              tags: ['creator', 'content', 'community'],
              contentCount: creator.contentCount,
              followersCount: creator.followersCount,
              recentContent: creator.recentContent || []
            }));
            setFeaturedCreators(transformedCreators);
          } else {
            setFeaturedCreators([]);
          }
        } else {
          setFeaturedCreators([]);
        }
      } catch (error) {
        console.error('Error loading real data:', error);
        setFeaturedCreators([]);
        setHasRealData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealData();
  }, []);

  const trendingCreators = featuredCreators.slice(0, 3);

  const filteredCreators = featuredCreators
    .filter(creator => {
      const matchesSearch = searchQuery === '' || 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || creator.category === selectedCategory;
      const matchesSpecies = selectedSpecies === 'all' || creator.species === selectedSpecies;
      
      return matchesSearch && matchesCategory && matchesSpecies;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'subscribers':
          const aSubscribers = parseInt(a.subscribers.replace(/[^\d]/g, ''));
          const bSubscribers = parseInt(b.subscribers.replace(/[^\d]/g, ''));
          return bSubscribers - aSubscribers;
        case 'popular':
        default:
          // Sort by a combination of rating and subscriber count
          const aScore = a.rating * (parseInt(a.subscribers.replace(/[^\d]/g, '')) / 1000);
          const bScore = b.rating * (parseInt(b.subscribers.replace(/[^\d]/g, '')) / 1000);
          return bScore - aScore;
      }
    });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <h2 className="text-2xl font-bold">Loading creators...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the latest creators</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-3 bg-muted rounded-full"></div>
                <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-16 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!hasRealData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold">Ready for Amazing Creators!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The platform is ready and waiting for the first creators to join and share their amazing content. 
            Be among the first to discover this vibrant community!
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">Join as Creator</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{platformStats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{platformStats.totalCreators}</div>
              <div className="text-sm text-muted-foreground">Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{platformStats.totalContent}</div>
              <div className="text-sm text-muted-foreground">Content</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{platformStats.totalSubscriptions}</div>
              <div className="text-sm text-muted-foreground">Subscriptions</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Explore Furry Creators</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          Discover Amazing Furry Content
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find fursuit photographers, digital artists, animators, and storytellers in the furry community
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search creators, species, or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {furryCategories.map((category) => (
                <SelectItem key={category.tag} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Species" />
            </SelectTrigger>
            <SelectContent>
              {species.map((species) => (
                <SelectItem key={species} value={species === 'All Species' ? 'all' : species}>
                  {species}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="subscribers">Followers</SelectItem>
              <SelectItem value="price-low">Price: Low</SelectItem>
              <SelectItem value="price-high">Price: High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trending Creators */}
      {trendingCreators.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-orange-500" />
              Trending Creators
            </h2>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingCreators.map((creator) => (
              <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="relative w-20 h-20 mx-auto mb-3 text-4xl rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    {creator.avatar}
                    <OnlineStatusIndicator userId={creator.id} size="md" position="bottom-right" />
                  </div>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Link 
                      to={`/profile/${creator.username}`} 
                      className="hover:text-primary cursor-pointer transition-colors"
                    >
                      {creator.name}
                    </Link>
                    {creator.isVerified && (
                      <Badge className="bg-blue-500">✓</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    <Link 
                      to={`/profile/${creator.username}`} 
                      className="hover:text-primary cursor-pointer transition-colors"
                    >
                      @{creator.username}
                    </Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{creator.subscribers}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span>{creator.rating}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{creator.category}</Badge>
                  <p className="text-sm text-muted-foreground">{creator.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-lg">{creator.priceDisplay}</span>
                    <Button size="sm">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Creators */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {searchQuery || selectedCategory !== 'all' || selectedSpecies !== 'all' 
                ? `Search Results`
                : 'Featured Creators'
              }
            </h2>
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedCategory !== 'all' || selectedSpecies !== 'all' 
                ? `Found ${filteredCreators.length} creator${filteredCreators.length !== 1 ? 's' : ''} matching your criteria`
                : `Discover ${featuredCreators.length} amazing creators in the furry community`
              }
            </p>
          </div>
          {(searchQuery || selectedCategory !== 'all' || selectedSpecies !== 'all') && (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSpecies('all');
              }}
            >
              Show All Creators
            </Button>
          )}
        </div>
        
        {filteredCreators.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No creators found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSpecies('all');
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 text-2xl rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                      {creator.avatar}
                      <OnlineStatusIndicator userId={creator.id} size="sm" position="bottom-right" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Link 
                          to={`/profile/${creator.username}`} 
                          className="hover:text-primary cursor-pointer transition-colors"
                        >
                          {creator.name}
                        </Link>
                        {creator.isVerified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            ✓
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        <Link 
                          to={`/profile/${creator.username}`} 
                          className="hover:text-primary cursor-pointer transition-colors"
                        >
                          @{creator.username}
                        </Link>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="outline">{creator.category}</Badge>
                  <p className="text-sm text-muted-foreground line-clamp-2">{creator.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{creator.subscribers} followers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span>{creator.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-lg">{creator.priceDisplay}</span>
                    <Button size="sm" className="w-full">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-none">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Join the Community</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Ready to Share Your Furry Art?</h3>
          <p className="text-muted-foreground mb-6">
            Join hundreds of furry creators earning from their passion. Share your fursuits, art, stories, and more with fans who appreciate your work.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Crown className="mr-2 h-4 w-4" />
              Become a Creator
            </Button>
            <Button variant="outline" size="lg">
              Learn More About Creating
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Explore;

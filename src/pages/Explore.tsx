import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

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

  const tags = [
    'murrsuit', 'nsfw', 'adult', 'explicit', 'kinky', 'sexy', 'hot', 'steamy', 'intimate', 'naughty',
    'fursuit-porn', 'cam', 'live', 'private', 'custom', 'commission', 'fetish', 'kink', 'bdsm',
    'latex', 'leather', 'bondage', 'roleplay', 'dominant', 'submissive', 'switch', 'daddy', 'mommy',
    'breeding', 'heat', 'rut', 'knot', 'mating', 'oral', 'anal', 'toys', 'vibrator', 'dildo',
    'male', 'female', 'trans', 'nb', 'gay', 'straight', 'bi', 'pan', 'furry', 'anthro', 'feral',
    'wolf', 'fox', 'dragon', 'cat', 'dog', 'horse', 'sergal', 'protogen', 'avian', 'shark',
    'solo', 'couple', 'threesome', 'group', 'orgy', 'gangbang', 'bukkake', 'creampie', 'cumshot',
    'video', 'photo', 'gif', 'stream', 'cam-show', 'private-show', 'sexting', 'audio', 'voice',
    'outdoor', 'indoor', 'bedroom', 'bathroom', 'public', 'risky', 'caught', 'exhibitionist',
    'big', 'huge', 'massive', 'tight', 'loose', 'wet', 'creamy', 'messy', 'dirty', 'clean',
    'rough', 'gentle', 'hard', 'soft', 'fast', 'slow', 'deep', 'shallow', 'long', 'short'
  ];

  const featuredCreators = [
    {
      id: 1,
      name: 'Luna Silverpaw',
      username: 'luna_silverpaw',
      avatar: '🦊',
      category: 'Fursuit Photos',
      species: 'Fox',
      subscribers: '3.2K',
      rating: 4.9,
      price: 19.99,
      priceDisplay: '$19.99/month',
      isVerified: true,
      joinDate: '2023-01-15',
      description: 'Professional fursuit photographer capturing magical moments at conventions and in nature',
      tags: ['fursuit', 'photography', 'convention', 'nature', 'sfw', 'outdoor'],
    },
    {
      id: 2,
      name: 'Rex Dragonheart',
      username: 'rex_dragonheart',
      avatar: '🐲',
      category: 'Adult Digital Art',
      species: 'Dragon',
      subscribers: '5.8K',
      rating: 4.8,
      price: 14.99,
      priceDisplay: '$14.99/month',
      isVerified: true,
      joinDate: '2022-11-20',
      description: 'Fantasy dragon artist specializing in detailed character commissions and explicit NSFW art',
      tags: ['adult', 'nsfw', 'digital', 'dragon', 'commission', 'explicit', 'male', 'kinky'],
    },
    {
      id: 3,
      name: 'Sage Moonwolf',
      username: 'sage_moonwolf',
      avatar: '🐺',
      category: 'Tutorials & Tips',
      species: 'Wolf',
      subscribers: '2.1K',
      rating: 4.9,
      price: 24.99,
      priceDisplay: '$24.99/month',
      isVerified: false,
      joinDate: '2023-03-10',
      description: 'Fursuit maker sharing detailed tutorials and behind-the-scenes crafting content',
      tags: ['tutorial', 'fursuit', 'crafting', 'educational', 'process', 'sfw'],
    },
    {
      id: 4,
      name: 'Zara Striped',
      username: 'zara_striped',
      avatar: '🦓',
      category: 'NSFW Videos',
      species: 'Equine',
      subscribers: '4.3K',
      rating: 4.7,
      price: 16.99,
      priceDisplay: '$16.99/month',
      isVerified: true,
      joinDate: '2023-02-05',
      description: 'Adult animator creating steamy furry films and explicit character animations',
      tags: ['nsfw', 'video', 'animation', 'explicit', 'female', 'sexy', 'adult'],
    },
    {
      id: 5,
      name: 'Copper Fennec',
      username: 'copper_fennec',
      avatar: '🦊',
      category: 'Kinky Stories',
      species: 'Fox',
      subscribers: '1.9K',
      rating: 4.8,
      price: 12.99,
      priceDisplay: '$12.99/month',
      isVerified: true,
      joinDate: '2023-04-20',
      description: 'Erotic storyteller crafting steamy furry fiction and kinky character adventures',
      tags: ['kinky', 'story', 'erotic', 'nsfw', 'fiction', 'adult', 'hot'],
    },
    {
      id: 6,
      name: 'Nova Starcat',
      username: 'nova_starcat',
      avatar: '🐱',
      category: 'Digital Art',
      species: 'Cat',
      subscribers: '6.8K',
      rating: 4.9,
      price: 18.99,
      priceDisplay: '$18.99/month',
      isVerified: true,
      joinDate: '2022-09-12',
      description: 'Sci-fi furry artist creating cosmic adventures and space-themed characters',
      tags: ['art', 'scifi', 'space', 'digital', 'commission', 'female', 'colorful'],
    },
    {
      id: 7,
      name: 'Thunder Sergal',
      username: 'thunder_sergal',
      avatar: '⚡',
      category: 'Fursuit Photos',
      species: 'Sergal',
      subscribers: '2.8K',
      rating: 4.6,
      price: 22.99,
      priceDisplay: '$22.99/month',
      isVerified: true,
      joinDate: '2023-01-30',
      description: 'Energetic sergal sharing dynamic fursuit photos and convention adventures',
      tags: ['fursuit', 'sergal', 'convention', 'energetic', 'male', 'photography'],
    },
    {
      id: 8,
      name: 'Mystic Protogen',
      username: 'mystic_protogen',
      avatar: '🤖',
      category: 'Digital Art',
      species: 'Protogen',
      subscribers: '4.1K',
      rating: 4.8,
      price: 17.99,
      priceDisplay: '$17.99/month',
      isVerified: true,
      joinDate: '2022-12-08',
      description: 'Cyberpunk protogen artist blending technology with organic beauty',
      tags: ['art', 'protogen', 'cyberpunk', 'digital', 'scifi', 'non-binary', 'tech'],
    },
    {
      id: 9,
      name: 'Willow Deer',
      username: 'willow_deer',
      avatar: '🦌',
      category: 'Traditional Art',
      species: 'Deer',
      subscribers: '3.5K',
      rating: 4.7,
      price: 13.99,
      priceDisplay: '$13.99/month',
      isVerified: false,
      joinDate: '2023-05-15',
      description: 'Traditional artist creating beautiful watercolor and pencil illustrations',
      tags: ['art', 'traditional', 'watercolor', 'pencil', 'nature', 'female', 'soft'],
    },
    {
      id: 10,
      name: 'Blaze Husky',
      username: 'blaze_husky',
      avatar: '🐕',
      category: 'Videos & Animations',
      species: 'Dog',
      subscribers: '5.2K',
      rating: 4.9,
      price: 21.99,
      priceDisplay: '$21.99/month',
      isVerified: true,
      joinDate: '2022-10-22',
      description: 'High-energy husky creating workout videos and lifestyle content',
      tags: ['video', 'fitness', 'lifestyle', 'energetic', 'male', 'motivation', 'sfw'],
    },
    {
      id: 11,
      name: 'Ember Wolf',
      username: 'ember_wolf',
      avatar: '🔥',
      category: 'Murrsuit Content',
      species: 'Wolf',
      subscribers: '7.3K',
      rating: 4.8,
      price: 29.99,
      priceDisplay: '$29.99/month',
      isVerified: true,
      joinDate: '2022-08-14',
      description: 'Adult content creator specializing in murrsuit and intimate experiences',
      tags: ['murrsuit', 'adult', 'nsfw', 'intimate', 'wolf', 'male', 'latex'],
    },
    {
      id: 12,
      name: 'Crystal Rabbit',
      username: 'crystal_rabbit',
      avatar: '🐰',
      category: 'Character Stories',
      species: 'Rabbit',
      subscribers: '2.7K',
      rating: 4.6,
      price: 11.99,
      priceDisplay: '$11.99/month',
      isVerified: false,
      joinDate: '2023-06-01',
      description: 'Wholesome bunny sharing slice-of-life stories and daily adventures',
      tags: ['story', 'slice-of-life', 'wholesome', 'daily', 'female', 'cute', 'sfw'],
    },
    {
      id: 13,
      name: 'Storm Gryphon',
      username: 'storm_gryphon',
      avatar: '🦅',
      category: 'Digital Art',
      species: 'Avian',
      subscribers: '4.9K',
      rating: 4.9,
      price: 25.99,
      priceDisplay: '$25.99/month',
      isVerified: true,
      joinDate: '2022-07-19',
      description: 'Majestic gryphon artist creating epic fantasy scenes and character art',
      tags: ['art', 'digital', 'fantasy', 'epic', 'gryphon', 'male', 'detailed', 'commission'],
    },
    {
      id: 14,
      name: 'Sunny Otter',
      username: 'sunny_otter',
      avatar: '🦦',
      category: 'Convention Coverage',
      species: 'Mustelid',
      subscribers: '3.1K',
      rating: 4.5,
      price: 15.99,
      priceDisplay: '$15.99/month',
      isVerified: true,
      joinDate: '2023-02-28',
      description: 'Convention reporter bringing you the latest from furry gatherings worldwide',
      tags: ['convention', 'reporting', 'news', 'community', 'travel', 'female', 'social'],
    },
    {
      id: 15,
      name: 'Midnight Bat',
      username: 'midnight_bat',
      avatar: '🦇',
      category: 'Digital Art',
      species: 'Bat',
      subscribers: '3.8K',
      rating: 4.7,
      price: 16.99,
      priceDisplay: '$16.99/month',
      isVerified: true,
      joinDate: '2022-11-03',
      description: 'Gothic bat artist specializing in dark fantasy and vampire aesthetics',
      tags: ['art', 'digital', 'gothic', 'dark', 'vampire', 'fantasy', 'non-binary', 'monochrome'],
    },
    {
      id: 16,
      name: 'Cyber Fox',
      username: 'cyber_fox',
      avatar: '🦊',
      category: 'Tutorials & Tips',
      species: 'Fox',
      subscribers: '4.6K',
      rating: 4.8,
      price: 23.99,
      priceDisplay: '$23.99/month',
      isVerified: true,
      joinDate: '2022-12-20',
      description: 'Tech-savvy fox teaching digital art techniques and software tutorials',
      tags: ['tutorial', 'digital', 'tech', 'software', 'educational', 'male', 'cyberpunk'],
    },
    {
      id: 17,
      name: 'River Dolphin',
      username: 'river_dolphin',
      avatar: '🐬',
      category: 'Videos & Animations',
      species: 'Aquatic',
      subscribers: '2.4K',
      rating: 4.6,
      price: 18.99,
      priceDisplay: '$18.99/month',
      isVerified: false,
      joinDate: '2023-04-10',
      description: 'Aquatic mammal creating underwater-themed animations and marine life content',
      tags: ['animation', 'aquatic', 'underwater', 'marine', 'nature', 'female', 'peaceful'],
    },
    {
      id: 18,
      name: 'Neon Tiger',
      username: 'neon_tiger',
      avatar: '🐅',
      category: 'Digital Art',
      species: 'Cat',
      subscribers: '6.1K',
      rating: 4.9,
      price: 27.99,
      priceDisplay: '$27.99/month',
      isVerified: true,
      joinDate: '2022-06-15',
      description: 'Vibrant tiger artist known for neon-colored cyberpunk character designs',
      tags: ['art', 'digital', 'cyberpunk', 'neon', 'colorful', 'tiger', 'male', 'commission'],
    },
    {
      id: 19,
      name: 'Cozy Bear',
      username: 'cozy_bear',
      avatar: '🐻',
      category: 'Character Stories',
      species: 'Bear',
      subscribers: '3.3K',
      rating: 4.7,
      price: 14.99,
      priceDisplay: '$14.99/month',
      isVerified: true,
      joinDate: '2023-01-08',
      description: 'Gentle bear sharing cozy stories, recipes, and hygge lifestyle content',
      tags: ['story', 'cozy', 'lifestyle', 'recipes', 'wholesome', 'male', 'comfort', 'sfw'],
    },
    {
      id: 20,
      name: 'Aurora Horse',
      username: 'aurora_horse',
      avatar: '🐴',
      category: 'Fursuit Photos',
      species: 'Horse',
      subscribers: '2.9K',
      rating: 4.8,
      price: 20.99,
      priceDisplay: '$20.99/month',
      isVerified: true,
      joinDate: '2023-03-25',
      description: 'Elegant horse showcasing beautiful fursuit photography in natural settings',
      tags: ['fursuit', 'photography', 'elegant', 'nature', 'outdoor', 'female', 'artistic'],
    }
  ];

  const trendingCreators = featuredCreators.slice(0, 3);

  const filteredCreators = featuredCreators
    .filter(creator => {
      const matchesSearch = searchQuery === '' || 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
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
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="subscribers">Most Subscribers</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Popular Tags */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 16).map((tag) => (
              <Badge 
                key={tag}
                variant={searchQuery === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSearchQuery(searchQuery === tag ? '' : tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== 'all' || selectedSpecies !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedSpecies !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Species: {selectedSpecies}
                <button 
                  onClick={() => setSelectedSpecies('all')}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSpecies('all');
              }}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {furryCategories.map((category, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow hover:scale-105"
              onClick={() => setSelectedCategory(category.name)}
            >
              <CardContent className="p-4 text-center">
                <category.icon className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count} creators</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Creators */}
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
                <div className="w-20 h-20 mx-auto mb-3 text-4xl rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  {creator.avatar}
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

      {/* Search Results */}
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
                  <div className="w-12 h-12 text-2xl rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    {creator.avatar}
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
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{creator.category}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span>{creator.rating}</span>
                  </div>
                </div>
                {creator.species && (
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-muted-foreground">Species:</span>
                    <Badge variant="secondary">{creator.species}</Badge>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{creator.description}</p>
                {creator.tags && (
                  <div className="flex flex-wrap gap-1">
                    {creator.tags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => setSearchQuery(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {creator.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{creator.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{creator.subscribers} subscribers</span>
                  </div>
                  <span className="font-semibold">{creator.priceDisplay}</span>
                </div>
                <Button className="w-full">Subscribe</Button>
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

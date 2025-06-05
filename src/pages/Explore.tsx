import React, { useState, useEffect } from 'react';
import { ContentStorage, FURRY_SPECIES, FURRY_CONTENT_TAGS, ADULT_CONTENT_TAGS } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Search, Filter, Star, Users, TrendingUp, Camera, Video, Palette,
  Heart, Play, Image, AlertTriangle, Flame, Crown, Zap
} from 'lucide-react';

interface FurryCreator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  species: string;
  fursona: string;
  category: string;
  subscribers: string;
  rating: number;
  price: string;
  isVerified: boolean;
  description: string;
  tags: string[];
  isNSFW: boolean;
  contentCount: number;
  featured: boolean;
}

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showNSFW, setShowNSFW] = useState(false);
  const [sortBy, setSortBy] = useState('trending');
  const [priceRange, setPriceRange] = useState('all');
  const [creators, setCreators] = useState<FurryCreator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<FurryCreator[]>([]);

  // Furry content categories
  const furryCategories = [
    { name: 'Fursuit Photos', icon: Camera, color: 'text-blue-500', count: 89, nsfw: false },
    { name: 'Murrsuit Content', icon: Heart, color: 'text-red-500', count: 67, nsfw: true },
    { name: 'Character Art', icon: Palette, color: 'text-purple-500', count: 156, nsfw: false },
    { name: 'Transformation', icon: Zap, color: 'text-yellow-500', count: 45, nsfw: true },
    { name: 'Furry Videos', icon: Video, color: 'text-green-500', count: 78, nsfw: false },
    { name: 'Adult Art', icon: Flame, color: 'text-orange-500', count: 134, nsfw: true },
    { name: 'Tutorials', icon: Play, color: 'text-indigo-500', count: 23, nsfw: false },
    { name: 'Photography', icon: Image, color: 'text-pink-500', count: 92, nsfw: false },
  ];

  // Mock furry creators data
  useEffect(() => {
    const mockCreators: FurryCreator[] = [
      {
        id: '1',
        name: 'Arctic Paws',
        username: 'arcticpaws',
        avatar: '/images/branding/fox-mascot.webp',
        species: 'Fox',
        fursona: 'Arctic Fox',
        category: 'Fursuit Photos',
        subscribers: '18.5K',
        rating: 4.9,
        price: '$25/month',
        isVerified: true,
        description: 'Professional fursuit photographer specializing in outdoor and studio shoots',
        tags: ['Fursuit', 'Photography', 'Outdoor', 'Professional'],
        isNSFW: false,
        contentCount: 156,
        featured: true
      },
      {
        id: '2',
        name: 'Dragon Flames',
        username: 'dragonflames',
        avatar: '/images/branding/fursuit-icon.jpg',
        species: 'Dragon',
        fursona: 'Fire Dragon',
        category: 'Character Art',
        subscribers: '23.1K',
        rating: 4.8,
        price: '$30/month',
        isVerified: true,
        description: 'Digital artist creating stunning dragon artwork and commissions',
        tags: ['Art', 'Dragon', 'Digital', 'Commission'],
        isNSFW: false,
        contentCount: 289,
        featured: true
      },
      {
        id: '3',
        name: 'Wolf Pack Studios',
        username: 'wolfpackstudios',
        avatar: '/images/branding/paw-logo.jpg',
        species: 'Wolf',
        fursona: 'Alpha Wolf',
        category: 'Murrsuit Content',
        subscribers: '15.7K',
        rating: 4.7,
        price: '$35/month',
        isVerified: true,
        description: 'Adult fursuit content and intimate photoshoots (18+ only)',
        tags: ['Murrsuit', 'Adult', 'Intimate', 'Studio'],
        isNSFW: true,
        contentCount: 178,
        featured: true
      },
      {
        id: '4',
        name: 'Feline Fantasies',
        username: 'felinefantasies',
        avatar: '/images/branding/paw-favicon.png',
        species: 'Cat',
        fursona: 'Maine Coon',
        category: 'Adult Art',
        subscribers: '12.3K',
        rating: 4.6,
        price: '$20/month',
        isVerified: false,
        description: 'Erotic furry art and character development',
        tags: ['Art', 'Erotic', 'NSFW', 'Character'],
        isNSFW: true,
        contentCount: 234,
        featured: false
      },
      {
        id: '5',
        name: 'Tiger Stripes',
        username: 'tigerstripes',
        avatar: '/images/branding/fox-silhouette.jpg',
        species: 'Tiger',
        fursona: 'Siberian Tiger',
        category: 'Fursuit Photos',
        subscribers: '9.8K',
        rating: 4.5,
        price: '$18/month',
        isVerified: true,
        description: 'Fursuit modeling and cosplay photography',
        tags: ['Fursuit', 'Cosplay', 'Modeling', 'Tiger'],
        isNSFW: false,
        contentCount: 123,
        featured: false
      },
      {
        id: '6',
        name: 'Rabbit Hole',
        username: 'rabbithole',
        avatar: '/images/branding/paw-logo.jpg',
        species: 'Rabbit',
        fursona: 'Lop Bunny',
        category: 'Transformation',
        subscribers: '14.2K',
        rating: 4.8,
        price: '$28/month',
        isVerified: true,
        description: 'Transformation sequences and magical furry content',
        tags: ['Transformation', 'Magic', 'Sequence', 'Fantasy'],
        isNSFW: true,
        contentCount: 167,
        featured: true
      }
    ];

    setCreators(mockCreators);
    setFilteredCreators(mockCreators);
  }, []);

  // Filter creators based on search and filters
  useEffect(() => {
    let filtered = creators.filter(creator => {
      // Search filter
      const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creator.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           creator.fursona.toLowerCase().includes(searchTerm.toLowerCase());

      // Species filter
      const matchesSpecies = selectedSpecies.length === 0 || selectedSpecies.includes(creator.species);

      // Tags filter
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => creator.tags.includes(tag));

      // NSFW filter
      const matchesNSFW = showNSFW || !creator.isNSFW;

      // Price filter
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const price = parseInt(creator.price.replace(/[^0-9]/g, ''));
        switch (priceRange) {
          case 'under15':
            matchesPrice = price < 15;
            break;
          case '15-25':
            matchesPrice = price >= 15 && price <= 25;
            break;
          case '25-35':
            matchesPrice = price >= 25 && price <= 35;
            break;
          case 'over35':
            matchesPrice = price > 35;
            break;
        }
      }

      return matchesSearch && matchesSpecies && matchesTags && matchesNSFW && matchesPrice;
    });

    // Sort filtered results
    switch (sortBy) {
      case 'trending':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'subscribers':
        filtered.sort((a, b) => parseFloat(b.subscribers) - parseFloat(a.subscribers));
        break;
      case 'newest':
        filtered.sort((a, b) => b.contentCount - a.contentCount);
        break;
      case 'price_low':
        filtered.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
        break;
      case 'price_high':
        filtered.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, '')));
        break;
    }

    setFilteredCreators(filtered);
  }, [creators, searchTerm, selectedSpecies, selectedTags, showNSFW, priceRange, sortBy]);

  const toggleSpeciesFilter = (species: string) => {
    setSelectedSpecies(prev => 
      prev.includes(species) 
        ? prev.filter(s => s !== species)
        : [...prev, species]
    );
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-orange-600">Explore OnlyFur</h1>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            18+ Adult Content Platform
          </Badge>
        </div>
        <p className="text-gray-600">Discover amazing furry creators and murrtubers</p>
      </div>

      {/* Age Verification Warning */}
      <Card className="mb-6 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Adult Content Warning</p>
              <p className="text-sm text-red-700">
                This platform contains adult content. By continuing, you confirm you are 18+ years old.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search creators, species, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="subscribers">Most Subscribers</SelectItem>
                <SelectItem value="newest">Most Content</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under15">Under $15</SelectItem>
                <SelectItem value="15-25">$15 - $25</SelectItem>
                <SelectItem value="25-35">$25 - $35</SelectItem>
                <SelectItem value="over35">Over $35</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch
                id="nsfw-toggle"
                checked={showNSFW}
                onCheckedChange={setShowNSFW}
              />
              <Label htmlFor="nsfw-toggle" className="text-sm font-medium">
                Show NSFW Content
              </Label>
            </div>
          </div>

          {/* Species Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Filter by Species</Label>
            <div className="flex flex-wrap gap-2">
              {FURRY_SPECIES.slice(0, 10).map((species) => (
                <Button
                  key={species}
                  variant={selectedSpecies.includes(species) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSpeciesFilter(species)}
                  className="h-8"
                >
                  {species}
                  {selectedSpecies.includes(species) && (
                    <span className="ml-2 bg-white/20 px-1 rounded text-xs">
                      {creators.filter(c => c.species === species).length}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Content Tags Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Content Tags</Label>
            <div className="flex flex-wrap gap-2">
              {[...FURRY_CONTENT_TAGS.slice(0, 8), ...ADULT_CONTENT_TAGS.slice(0, 4)].map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTagFilter(tag)}
                  className="h-8"
                >
                  {tag}
                  {tag === 'NSFW' && <AlertTriangle className="h-3 w-3 ml-1" />}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="creators" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creators">Featured Creators</TabsTrigger>
          <TabsTrigger value="categories">Browse Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="creators" className="space-y-6">
          {/* Featured Creators */}
          {filteredCreators.filter(c => c.featured).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                Featured Murrtubers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCreators.filter(c => c.featured).map((creator) => (
                  <Card key={creator.id} className={`relative ${creator.isNSFW ? 'border-red-200' : ''}`}>
                    {creator.isNSFW && (
                      <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        NSFW
                      </Badge>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{creator.name}</CardTitle>
                            {creator.isVerified && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Star className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">@{creator.username}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span>🦊 {creator.species}</span>
                        <span>✨ {creator.fursona}</span>
                      </div>
                      <p className="text-sm text-gray-600">{creator.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {creator.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {creator.subscribers}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {creator.rating}
                          </span>
                        </div>
                        <Badge variant="secondary" className="font-bold">
                          {creator.price}
                        </Badge>
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Creators */}
          <div>
            <h2 className="text-2xl font-bold mb-4">All Creators ({filteredCreators.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <Card key={creator.id} className={`relative ${creator.isNSFW ? 'border-red-200' : ''}`}>
                  {creator.isNSFW && (
                    <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      NSFW
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{creator.name}</CardTitle>
                          {creator.isVerified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{creator.species} • {creator.subscribers}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{creator.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {creator.rating}
                      </span>
                      <Badge variant="secondary" className="font-bold text-sm">
                        {creator.price}
                      </Badge>
                    </div>
                    <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                      Subscribe
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {furryCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.name} className={`cursor-pointer hover:shadow-lg transition-shadow ${category.nsfw ? 'border-red-200' : ''}`}>
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-3">
                        <Icon className={`h-12 w-12 ${category.color}`} />
                      </div>
                      <CardTitle className="flex items-center justify-center gap-2">
                        {category.name}
                        {category.nsfw && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </CardTitle>
                      <CardDescription>
                        {category.count} creators
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {filteredCreators.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">No creators found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecies([]);
                setSelectedTags([]);
                setPriceRange('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Explore;

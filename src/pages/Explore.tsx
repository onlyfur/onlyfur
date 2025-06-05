import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    { name: 'Fursuit Photos', icon: Camera, color: 'text-blue-500', count: 342, tag: 'fursuit' },
    { name: 'Digital Art', icon: Palette, color: 'text-purple-500', count: 567, tag: 'art' },
    { name: 'Videos & Animations', icon: Video, color: 'text-red-500', count: 189, tag: 'video' },
    { name: 'Tutorials & Tips', icon: Sparkles, color: 'text-green-500', count: 124, tag: 'tutorial' },
    { name: 'Murrsuit Content', icon: Heart, color: 'text-pink-500', count: 98, tag: 'murrsuit' },
    { name: 'Convention Coverage', icon: Users, color: 'text-orange-500', count: 76, tag: 'convention' },
    { name: 'Character Stories', icon: Music, color: 'text-indigo-500', count: 156, tag: 'story' },
    { name: 'Commissions', icon: Crown, color: 'text-yellow-500', count: 203, tag: 'commission' },
  ];

  const species = [
    'All Species', 'Fox', 'Wolf', 'Dragon', 'Cat', 'Dog', 'Bear', 'Rabbit', 'Deer', 'Horse', 'Bird', 'Other'
  ];

  const tags = [
    'fursuit', 'art', 'digital', 'traditional', 'commission', 'ych', 'anthro', 'feral',
    'sfw', 'cute', 'cool', 'detailed', 'simple', 'colorful', 'monochrome', 'realistic',
    'cartoon', 'anime', 'western', 'fantasy', 'scifi', 'modern', 'vintage', 'pride'
  ];

  const featuredCreators = [
    {
      id: 1,
      name: 'Luna Silverpaw',
      username: 'luna_silverpaw',
      avatar: '🦊',
      category: 'Fursuit Photos',
      species: 'Arctic Fox',
      subscribers: '3.2K',
      rating: 4.9,
      price: '$19.99/month',
      isVerified: true,
      description: 'Professional fursuit photographer capturing magical moments at conventions and in nature',
      tags: ['fursuit', 'photography', 'convention', 'nature'],
    },
    {
      id: 2,
      name: 'Rex Dragonheart',
      username: 'rex_dragonheart',
      avatar: '🐲',
      category: 'Digital Art',
      species: 'Dragon',
      subscribers: '5.8K',
      rating: 4.8,
      price: '$14.99/month',
      isVerified: true,
      description: 'Fantasy dragon artist specializing in detailed character commissions and YCH',
      tags: ['art', 'digital', 'dragon', 'commission', 'fantasy'],
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
      price: '$24.99/month',
      isVerified: false,
      description: 'Fursuit maker sharing detailed tutorials and behind-the-scenes crafting content',
      tags: ['tutorial', 'fursuit', 'crafting', 'educational'],
    },
    {
      id: 4,
      name: 'Zara Striped',
      username: 'zara_striped',
      avatar: '🦓',
      category: 'Videos & Animations',
      species: 'Zebra',
      subscribers: '4.3K',
      rating: 4.7,
      price: '$16.99/month',
      isVerified: true,
      description: 'Animator creating short furry films and character animations',
      tags: ['animation', 'video', 'story', 'character'],
    },
    {
      id: 5,
      name: 'Copper Fennec',
      username: 'copper_fennec',
      avatar: '🦊',
      category: 'Character Stories',
      species: 'Fennec Fox',
      subscribers: '1.9K',
      rating: 4.8,
      price: '$12.99/month',
      isVerified: true,
      description: 'Storyteller crafting immersive furry fiction and character development',
      tags: ['story', 'writing', 'character', 'fiction'],
    },
    {
      id: 6,
      name: 'Nova Starcat',
      username: 'nova_starcat',
      avatar: '🐱',
      category: 'Digital Art',
      species: 'Space Cat',
      subscribers: '6.8K',
      rating: 4.9,
      price: '$18.99/month',
      isVerified: true,
      description: 'Sci-fi furry artist creating cosmic adventures and space-themed characters',
      tags: ['art', 'scifi', 'space', 'digital', 'commission'],
    },
  ];

  const trendingCreators = featuredCreators.slice(0, 3);

  const filteredCreators = featuredCreators.filter(creator => {
    const matchesSearch = searchQuery === '' || 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || creator.category === selectedCategory;
    const matchesSpecies = selectedSpecies === 'all' || creator.species === selectedSpecies;
    
    return matchesSearch && matchesCategory && matchesSpecies;
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
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Popular Tags */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 12).map((tag) => (
              <Badge 
                key={tag}
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => setSearchQuery(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
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
                  <span>{creator.name}</span>
                  {creator.isVerified && (
                    <Badge className="bg-blue-500">✓</Badge>
                  )}
                </CardTitle>
                <CardDescription>@{creator.username}</CardDescription>
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
                  <span className="font-semibold text-lg">{creator.price}</span>
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
          <h2 className="text-2xl font-bold">
            {searchQuery || selectedCategory !== 'all' || selectedSpecies !== 'all' 
              ? `Search Results (${filteredCreators.length})`
              : 'Featured Creators'
            }
          </h2>
          {(searchQuery || selectedCategory !== 'all' || selectedSpecies !== 'all') && (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSpecies('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
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
                      <span>{creator.name}</span>
                      {creator.isVerified && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          ✓
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>@{creator.username}</CardDescription>
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
                      <Badge key={tag} variant="outline" className="text-xs">
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
                  <span className="font-semibold">{creator.price}</span>
                </div>
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>
          ))}
        </div>
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

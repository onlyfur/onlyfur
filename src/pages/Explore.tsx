import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Dumbbell,
  BookOpen,
  Utensils,
  Heart
} from 'lucide-react';

const Explore: React.FC = () => {
  const categories = [
    { name: 'Photography', icon: Camera, color: 'text-blue-500', count: 245 },
    { name: 'Fitness', icon: Dumbbell, color: 'text-green-500', count: 189 },
    { name: 'Art', icon: Palette, color: 'text-purple-500', count: 156 },
    { name: 'Music', icon: Music, color: 'text-pink-500', count: 134 },
    { name: 'Cooking', icon: Utensils, color: 'text-orange-500', count: 98 },
    { name: 'Education', icon: BookOpen, color: 'text-indigo-500', count: 87 },
    { name: 'Video', icon: Video, color: 'text-red-500', count: 203 },
    { name: 'Lifestyle', icon: Heart, color: 'text-rose-500', count: 167 },
  ];

  const featuredCreators = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: 'sarahj_photo',
      avatar: '👩‍💼',
      category: 'Photography',
      subscribers: '12.5K',
      rating: 4.9,
      price: '$15/month',
      isVerified: true,
      description: 'Professional photographer sharing exclusive behind-the-scenes content',
    },
    {
      id: 2,
      name: 'Mike Chen',
      username: 'mikefit',
      avatar: '🏋️‍♂️',
      category: 'Fitness',
      subscribers: '8.3K',
      rating: 4.8,
      price: '$20/month',
      isVerified: true,
      description: 'Certified personal trainer with custom workout plans',
    },
    {
      id: 3,
      name: 'Emma Davis',
      username: 'emma_arts',
      avatar: '🎨',
      category: 'Art',
      subscribers: '15.2K',
      rating: 4.9,
      price: '$12/month',
      isVerified: false,
      description: 'Digital artist creating stunning illustrations and tutorials',
    },
    {
      id: 4,
      name: 'Alex Thompson',
      username: 'alexmusic',
      avatar: '🎵',
      category: 'Music',
      subscribers: '9.7K',
      rating: 4.7,
      price: '$18/month',
      isVerified: true,
      description: 'Musician sharing exclusive tracks and music production tips',
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      username: 'lisa_cooks',
      avatar: '👩‍🍳',
      category: 'Cooking',
      subscribers: '11.1K',
      rating: 4.8,
      price: '$14/month',
      isVerified: true,
      description: 'Professional chef with exclusive recipes and cooking classes',
    },
    {
      id: 6,
      name: 'David Kim',
      username: 'david_learns',
      avatar: '📚',
      category: 'Education',
      subscribers: '6.8K',
      rating: 4.9,
      price: '$25/month',
      isVerified: false,
      description: 'Educational content on technology and programming',
    },
  ];

  const trendingCreators = featuredCreators.slice(0, 3);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Discover Amazing Creators</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore exclusive content from talented creators across various categories
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creators, categories, or content..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
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

      {/* Featured Creators */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Featured Creators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCreators.map((creator) => (
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
                <p className="text-sm text-muted-foreground">{creator.description}</p>
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
          <h3 className="text-2xl font-bold mb-2">Ready to Start Creating?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of creators earning from their passion
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">Become a Creator</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Explore;

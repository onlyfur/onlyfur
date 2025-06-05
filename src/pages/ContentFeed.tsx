import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ContentCard from '@/components/content/ContentCard';
import PricingModal from '@/components/subscription/PricingModal';
import { getSortedContent } from '@/data/mockContent';
import { Heart, Crown, Star, Filter, Search } from 'lucide-react';

const ContentFeed: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'discover'>('all');
  
  const contentWithCreators = getSortedContent();
  
  // Separate newest public post for non-subscribers
  const newestPublicContent = contentWithCreators.find(
    ({ content }) => content.privacyLevel === 'public'
  );
  
  const otherContent = contentWithCreators.filter(
    ({ content }) => content.id !== newestPublicContent?.content.id
  );

  const getFilteredContent = () => {
    switch (activeFilter) {
      case 'following':
        // In a real app, this would filter by followed creators
        return contentWithCreators.slice(0, 2);
      case 'discover':
        // In a real app, this would show recommended content
        return contentWithCreators.slice(2);
      default:
        return contentWithCreators;
    }
  };

  const filteredContent = getFilteredContent();

  return (
    <>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Content Feed</h1>
          <p className="text-muted-foreground">
            Discover amazing furry content from talented creators
          </p>
        </div>

        {/* Subscription Notice for Non-Authenticated Users */}
        {!isAuthenticated && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-500" />
                    Join the OnlyFur Community
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create an account to access exclusive content, message creators, and support your favorite artists.
                  </p>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link to="/register">
                        Join Free
                      </Link>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowPricingModal(true)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      View Plans
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="mb-1">🦊 50K+ Community Members</div>
                    <div className="mb-1">🎨 10K+ Active Creators</div>
                    <div>⭐ 1M+ Posts & Videos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Filters */}
        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content Grid */}
        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilter === 'following' 
                  ? "Start following creators to see their content here"
                  : "Check back later for new content"
                }
              </p>
              <Button asChild>
                <Link to="/explore">Explore Creators</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Newest Public Content for Everyone */}
            {newestPublicContent && activeFilter === 'all' && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Badge className="bg-green-500 text-white">
                    <Heart className="w-3 h-3 mr-1" />
                    Free Preview
                  </Badge>
                  <span className="ml-3 text-sm text-muted-foreground">
                    Latest from {newestPublicContent.creator.displayName}
                  </span>
                </div>
                <ContentCard
                  content={newestPublicContent.content}
                  creator={newestPublicContent.creator}
                  isNewestPost={true}
                />
              </div>
            )}

            {/* Other Content with Access Control */}
            <div className="grid gap-6">
              {otherContent.map(({ content, creator }, index) => (
                <div key={content.id}>
                  {index === 0 && activeFilter === 'all' && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">More Amazing Content</h3>
                      <p className="text-sm text-muted-foreground">
                        Subscribe to access exclusive content from your favorite creators
                      </p>
                    </div>
                  )}
                  <ContentCard
                    content={content}
                    creator={creator}
                    isNewestPost={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe CTA at Bottom */}
        {!isAuthenticated && filteredContent.length > 0 && (
          <Card className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to See More Amazing Content?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of furry fans supporting their favorite creators
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                  <Link to="/register">
                    <Heart className="mr-2 h-5 w-5" />
                    Join Free Now
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 border-white text-white hover:bg-white hover:text-purple-600"
                  onClick={() => setShowPricingModal(true)}
                >
                  <Crown className="mr-2 h-5 w-5" />
                  View Premium Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        initialTab="subscriber"
      />
    </>
  );
};

export default ContentFeed;

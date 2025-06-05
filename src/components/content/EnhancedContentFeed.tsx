import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import ContentCard from '@/components/content/ContentCard';
import ContentAccessControl from '@/components/content/ContentAccessControl';
import EnhancedPricingModal from '@/components/subscription/EnhancedPricingModal';
import { contentAccessService, ContentWithAccess } from '@/services/contentAccessService';
import { tierValidationService } from '@/services/tierValidationService';
import { getSortedContent } from '@/data/mockContent';
import { 
  Heart, 
  Crown, 
  Star, 
  Filter, 
  Search, 
  Eye,
  Lock,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Settings,
  Info,
  Zap,
  RefreshCw,
  Check
} from 'lucide-react';

interface ContentFeedProps {
  showAdvancedControls?: boolean;
  compactMode?: boolean;
  maxItems?: number;
}

const EnhancedContentFeed: React.FC<ContentFeedProps> = ({
  showAdvancedControls = true,
  compactMode = false,
  maxItems
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPricingTab, setSelectedPricingTab] = useState<'subscriber' | 'creator'>('subscriber');
  const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'discover' | 'accessible'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [showRestrictedContent, setShowRestrictedContent] = useState(true);
  const [groupByCreator, setGroupByCreator] = useState(false);
  const [filteredContent, setFilteredContent] = useState<ContentWithAccess[]>([]);
  const [upgradeRecommendations, setUpgradeRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get all content and process it
  const allContentWithCreators = getSortedContent();
  const allContent = allContentWithCreators.map(({ content }) => content);

  // Filter content based on user access and settings
  useEffect(() => {
    setIsLoading(true);
    
    try {
      let filtered = contentAccessService.filterContentForUser(allContent, user, {
        groupByCreator,
        showPreviewsOnly: !showRestrictedContent,
        includePublicContent: true
      });

      // Apply additional filters
      switch (activeFilter) {
        case 'following':
          // In real app, filter by followed creators
          filtered = filtered.slice(0, Math.ceil(filtered.length * 0.3));
          break;
        case 'discover':
          // In real app, show recommended content
          filtered = filtered.slice(Math.ceil(filtered.length * 0.3));
          break;
        case 'accessible':
          filtered = filtered.filter(item => item.canAccess);
          break;
      }

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          filtered.sort((a, b) => (b.content.likesCount + b.content.viewsCount) - (a.content.likesCount + a.content.viewsCount));
          break;
        case 'trending':
          // Mock trending logic - in real app, use engagement velocity
          filtered.sort((a, b) => b.content.likesCount - a.content.likesCount);
          break;
        default:
          // Already sorted by newest in service
          break;
      }

      // Apply max items limit
      if (maxItems) {
        filtered = filtered.slice(0, maxItems);
      }

      setFilteredContent(filtered);

      // Get upgrade recommendations for restricted content
      const restrictedItems = filtered.filter(item => !item.canAccess);
      const recommendations = contentAccessService.getUpgradeRecommendations(restrictedItems, user);
      setUpgradeRecommendations(recommendations);

    } catch (error) {
      console.error('Error filtering content:', error);
      setFilteredContent([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, activeFilter, sortBy, showRestrictedContent, groupByCreator, allContent, maxItems]);

  const getFilterBadgeCount = (filter: string): number => {
    switch (filter) {
      case 'following':
        return Math.ceil(allContent.length * 0.3);
      case 'discover':
        return Math.floor(allContent.length * 0.7);
      case 'accessible':
        return filteredContent.filter(item => item.canAccess).length;
      default:
        return filteredContent.length;
    }
  };

  const getRestrictedContentCount = (): number => {
    return filteredContent.filter(item => !item.canAccess).length;
  };

  const getAccessibleContentCount = (): number => {
    return filteredContent.filter(item => item.canAccess).length;
  };

  const handleUpgrade = (tierName?: string) => {
    setSelectedPricingTab('subscriber');
    setShowPricingModal(true);
  };

  const renderContentItem = (item: ContentWithAccess, index: number) => {
    const creator = allContentWithCreators.find(({ content }) => content.id === item.content.id)?.creator;
    
    if (!creator) return null;

    return (
      <div key={`${item.content.id}-${index}`} className="relative">
        <ContentAccessControl
          content={item.content}
          isNewestPost={item.isNewestPost}
          showUpgradePrompt={!compactMode}
          compactMode={compactMode}
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* Creator Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {creator.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm">{creator.displayName}</h4>
                      {creator.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.content.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Access indicators */}
                <div className="flex items-center space-x-2">
                  {item.isNewestPost && (
                    <Badge className="bg-green-500 text-white text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Badge>
                  )}
                  {!item.canAccess && (
                    <Badge variant="outline" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      {item.requiredTier}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-3">
                {item.content.title && (
                  <h3 className="font-bold text-lg leading-tight line-clamp-2">
                    {item.content.title}
                  </h3>
                )}
                
                {item.content.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {item.content.description}
                  </p>
                )}

                {/* Media placeholder */}
                {item.content.mediaUrl && (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.content.type} Content
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {item.content.tags && item.content.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.content.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {item.content.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.content.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {item.content.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {item.content.viewsCount}
                  </span>
                </div>
                
                {!item.canAccess && (
                  <Button
                    size="sm"
                    onClick={() => handleUpgrade(item.requiredTier)}
                    className="text-xs"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Unlock
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ContentAccessControl>
      </div>
    );
  };

  return (
    <>
      <div className={`${compactMode ? 'space-y-4' : 'container mx-auto p-6 max-w-4xl'}`}>
        {/* Header */}
        {!compactMode && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Content Feed</h1>
            <p className="text-muted-foreground">
              Discover amazing furry content from talented creators
            </p>
          </div>
        )}

        {/* Subscription Notice for Non-Authenticated Users */}
        {!isAuthenticated && !compactMode && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-500" />
                    Join the OnlyFur Community
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You're seeing free previews! Create an account to access exclusive content, message creators, and support your favorite artists.
                  </p>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link to="/register">
                        Join Free
                      </Link>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleUpgrade()}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      View Plans
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="mb-1">🦊 {getAccessibleContentCount()} Free Previews</div>
                    <div className="mb-1">🔒 {getRestrictedContentCount()} Locked Content</div>
                    <div>⭐ {upgradeRecommendations.length} Upgrade Options</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Access Status for Authenticated Users */}
        {isAuthenticated && !compactMode && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{getAccessibleContentCount()}</div>
                    <div className="text-xs text-muted-foreground">Accessible</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{getRestrictedContentCount()}</div>
                    <div className="text-xs text-muted-foreground">Locked</div>
                  </div>
                  {user?.subscriptionTier && (
                    <div className="text-center">
                      <Badge className={user.subscriptionTier.color}>
                        {user.subscriptionTier.name}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">Current Tier</div>
                    </div>
                  )}
                </div>
                
                {upgradeRecommendations.length > 0 && (
                  <Button variant="outline" onClick={() => handleUpgrade()}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Upgrade for {upgradeRecommendations[0]?.contentCount} more items
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Controls */}
        {showAdvancedControls && !compactMode && (
          <div className="mb-6 space-y-4">
            <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All ({getFilterBadgeCount('all')})
                </TabsTrigger>
                <TabsTrigger value="following">
                  Following ({getFilterBadgeCount('following')})
                </TabsTrigger>
                <TabsTrigger value="discover">
                  Discover ({getFilterBadgeCount('discover')})
                </TabsTrigger>
                <TabsTrigger value="accessible">
                  Accessible ({getFilterBadgeCount('accessible')})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="sort-by" className="text-sm font-medium">Sort by:</Label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-restricted"
                    checked={showRestrictedContent}
                    onCheckedChange={setShowRestrictedContent}
                  />
                  <Label htmlFor="show-restricted" className="text-sm">
                    Show locked content
                  </Label>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-32 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredContent.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilter === 'following' 
                  ? "Start following creators to see their content here"
                  : activeFilter === 'accessible'
                  ? "Subscribe to unlock more content"
                  : "Check back later for new content"
                }
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link to="/explore">Explore Creators</Link>
                </Button>
                {activeFilter === 'accessible' && (
                  <Button variant="outline" onClick={() => handleUpgrade()}>
                    View Subscription Plans
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredContent.map((item, index) => renderContentItem(item, index))}
          </div>
        )}

        {/* Upgrade Recommendations */}
        {upgradeRecommendations.length > 0 && !compactMode && (
          <Card className="mt-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Unlock More Content
              </CardTitle>
              <CardDescription>
                Get access to {getRestrictedContentCount()} more pieces of amazing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {upgradeRecommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{rec.tierName}</h4>
                      <Badge variant="outline">{rec.contentCount} items</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                      {rec.benefits.slice(0, 3).map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-muted-foreground mb-3">
                      Value: {rec.estimatedValue}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleUpgrade(rec.tierName)}
                    >
                      Upgrade to {rec.tierName}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <EnhancedPricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        initialTab={selectedPricingTab}
        showComparison={true}
      />
    </>
  );
};

export default EnhancedContentFeed;

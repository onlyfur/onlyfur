import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, Crown, Star, Heart, Users, Sparkles, ArrowRight, Zap, Info } from 'lucide-react';
import { Content, User, PlatformSubscriptionTier } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getTierById } from '@/data/subscriptionTiers';
import { tierValidationService } from '@/services/tierValidationService';
import EnhancedPricingModal from '../subscription/EnhancedPricingModal';

interface ContentAccessControlProps {
  content: Content;
  creatorTier?: PlatformSubscriptionTier;
  isNewestPost?: boolean;
  className?: string;
  children: React.ReactNode;
  showUpgradePrompt?: boolean;
  compactMode?: boolean;
}

const ContentAccessControl: React.FC<ContentAccessControlProps> = ({
  content,
  creatorTier,
  isNewestPost = false,
  className = '',
  children,
  showUpgradePrompt = true,
  compactMode = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  // Use enhanced tier validation service
  const accessCheck = tierValidationService.validateContentAccess(
    user, 
    content, 
    { isNewestPost }
  );

  const { allowed: canAccess, reason, requiredTier, currentTier } = accessCheck;

  const getTierDisplayInfo = () => {
    const tierName = requiredTier || getRequiredTierForPrivacy(content.privacyLevel);
    
    switch (content.privacyLevel) {
      case 'premium':
        return {
          icon: Star,
          name: tierName,
          color: 'bg-purple-500',
          gradient: 'from-purple-600 to-purple-400',
          description: 'Premium content for Pro subscribers and above'
        };
      case 'private':
        return {
          icon: Crown,
          name: tierName,
          color: 'bg-linear-to-r from-yellow-400 to-orange-500',
          gradient: 'from-yellow-500 to-orange-400',
          description: 'Exclusive VIP content'
        };
      case 'subscribers':
        return {
          icon: Heart,
          name: tierName,
          color: 'bg-blue-500',
          gradient: 'from-blue-600 to-blue-400',
          description: 'Subscriber-only content'
        };
      default:
        return {
          icon: Users,
          name: tierName,
          color: 'bg-gray-500',
          gradient: 'from-gray-600 to-gray-400',
          description: 'Subscription required'
        };
    }
  };

  const getRequiredTierForPrivacy = (privacyLevel: string): string => {
    switch (privacyLevel) {
      case 'subscribers': return 'Basic Subscriber';
      case 'premium': return 'Pro Subscriber';
      case 'private': return 'VIP Subscriber';
      default: return 'Subscription';
    }
  };

  const getSubscriberCount = (): number => {
    // Mock function - in real app, this would come from API
    const counts: Record<string, number> = {
      'public': 10000,
      'subscribers': 2500,
      'premium': 800,
      'private': 150
    };
    return counts[content.privacyLevel] || 0;
  };

  const tierInfo = getTierDisplayInfo();
  const TierIcon = tierInfo.icon;

  // If user can access content or it's the newest post, show normally
  if (canAccess) {
    return (
      <div className={className}>
        {isNewestPost && (
          <div className="mb-3">
            <Badge className="bg-green-500 text-white">
              <Eye className="w-3 h-3 mr-1" />
              Free Preview - Latest Post
            </Badge>
            <Alert className="mt-2 border-green-200 bg-green-50 dark:bg-green-900/10">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                This is the newest public post from this creator. Subscribe to see all their amazing content!
              </AlertDescription>
            </Alert>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Show blurred content with enhanced subscription prompt
  return (
    <>
      <Card className={`relative overflow-hidden ${className}`}>
        <div className="relative">
          {/* Blurred content with multiple blur layers for better effect */}
          <div className="relative">
            <div className="filter blur-lg scale-105 pointer-events-none opacity-30">
              {children}
            </div>
            <div className="absolute inset-0 filter blur-md pointer-events-none opacity-20">
              {children}
            </div>
          </div>
          
          {/* Enhanced overlay with gradient */}
          <div className={`absolute inset-0 bg-linear-to-br ${tierInfo.gradient} bg-opacity-90 backdrop-blur-xs flex items-center justify-center`}>
            <div className="text-center p-6 max-w-sm mx-4">
              {/* Animated icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-4 animate-pulse">
                  <Lock className="w-10 h-10" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className={`w-8 h-8 rounded-full ${tierInfo.color} flex items-center justify-center text-white shadow-lg`}>
                    <TierIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {compactMode ? 'Locked Content' : 'Subscription Required'}
              </h3>
              
              <p className="text-white/90 mb-3 text-sm leading-relaxed">
                {reason || tierInfo.description}
              </p>

              {/* Tier requirement info */}
              <div className="bg-white/10 backdrop-blur-xs rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TierIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-sm">
                    {tierInfo.name} Required
                  </span>
                </div>
                <div className="text-white/80 text-xs">
                  Join {getSubscriberCount().toLocaleString()}+ subscribers enjoying this content
                </div>
              </div>

              {/* Current tier info for authenticated users */}
              {isAuthenticated && currentTier && (
                <div className="bg-orange-500/20 backdrop-blur-xs rounded-lg p-2 mb-4">
                  <div className="text-white/90 text-xs">
                    Current tier: <span className="font-medium">{currentTier}</span>
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="space-y-3">
                {!compactMode ? (
                  <>
                    <Button 
                      onClick={() => setShowPricingModal(true)}
                      className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold"
                      size="lg"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {requiredTier ? `Upgrade to ${requiredTier}` : 'View Plans'}
                    </Button>
                    
                    {!isAuthenticated && (
                      <Button 
                        variant="outline" 
                        className="w-full text-white border-white/30 hover:bg-white/20 backdrop-blur-xs"
                        onClick={() => window.location.href = '/login'}
                      >
                        Login to Access
                      </Button>
                    )}

                    {showUpgradePrompt && (
                      <button
                        onClick={() => setShowFullPrompt(!showFullPrompt)}
                        className="text-white/80 text-xs hover:text-white transition-colors flex items-center mx-auto"
                      >
                        Learn more about benefits
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    )}
                  </>
                ) : (
                  <Button 
                    onClick={() => setShowPricingModal(true)}
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-white/90"
                  >
                    Unlock
                  </Button>
                )}
              </div>

              {/* Expanded benefits info */}
              {showFullPrompt && !compactMode && (
                <div className="mt-4 bg-white/10 backdrop-blur-xs rounded-lg p-3 text-left">
                  <h4 className="text-white font-medium text-sm mb-2">
                    What you'll get with {tierInfo.name}:
                  </h4>
                  <ul className="text-white/80 text-xs space-y-1">
                    {content.privacyLevel === 'subscribers' && (
                      <>
                        <li>• Access to all subscriber content</li>
                        <li>• Direct messaging with creators</li>
                        <li>• Community discussions</li>
                        <li>• Early access to new posts</li>
                      </>
                    )}
                    {content.privacyLevel === 'premium' && (
                      <>
                        <li>• All subscriber benefits</li>
                        <li>• Premium HD content</li>
                        <li>• Download content offline</li>
                        <li>• Priority support</li>
                      </>
                    )}
                    {content.privacyLevel === 'private' && (
                      <>
                        <li>• All premium benefits</li>
                        <li>• VIP exclusive content</li>
                        <li>• Unlimited messaging</li>
                        <li>• Ultra HD streaming</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced content metadata */}
        <CardContent className="p-4 bg-background border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {content.type}
              </Badge>
              <Badge className={`text-white text-xs ${tierInfo.color}`}>
                <TierIcon className="w-3 h-3 mr-1" />
                {tierInfo.name}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {content.createdAt?.toLocaleDateString()}
            </span>
          </div>
          
          {content.title && (
            <h4 className="font-semibold text-sm mb-1 line-clamp-1">
              {content.title}
            </h4>
          )}
          
          {content.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {content.description}
            </p>
          )}

          {/* Engagement preview */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {content.likesCount}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {content.viewsCount}
              </span>
            </div>
            <Button 
              size="sm"
              variant="ghost"
              onClick={() => setShowPricingModal(true)}
              className="text-xs h-auto py-1 px-2"
            >
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>

      <EnhancedPricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        initialTab="subscriber"
        showComparison={true}
      />
    </>
  );
};

export default ContentAccessControl;

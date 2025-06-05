import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Eye, Crown, Star, Heart } from 'lucide-react';
import { Content, User, PlatformSubscriptionTier } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getTierById } from '@/data/subscriptionTiers';
import PricingModal from '../subscription/PricingModal';

interface ContentAccessControlProps {
  content: Content;
  creatorTier?: PlatformSubscriptionTier;
  isNewestPost?: boolean;
  className?: string;
  children: React.ReactNode;
}

const ContentAccessControl: React.FC<ContentAccessControlProps> = ({
  content,
  creatorTier,
  isNewestPost = false,
  className = '',
  children
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Determine if user can access this content
  const canAccessContent = (): { canAccess: boolean; reason?: string } => {
    // Always show newest post to everyone (not blurred)
    if (isNewestPost) {
      return { canAccess: true };
    }

    // Public content is always accessible
    if (content.privacyLevel === 'public') {
      return { canAccess: true };
    }

    // Must be authenticated for non-public content
    if (!isAuthenticated || !user) {
      return { 
        canAccess: false, 
        reason: 'Login required to view this content' 
      };
    }

    // Admin can access everything
    if (user.role === 'admin') {
      return { canAccess: true };
    }

    // Creator can access their own content
    if (user.id === content.creatorId) {
      return { canAccess: true };
    }

    // Check subscription requirements
    if (content.requiresSubscription) {
      const userTier = user.subscriptionTier;
      
      if (!userTier || userTier.status !== 'active') {
        return { 
          canAccess: false, 
          reason: 'Active subscription required' 
        };
      }

      // Check privacy level requirements
      switch (content.privacyLevel) {
        case 'subscribers':
          // Basic subscriber access
          return { canAccess: true };
          
        case 'premium':
          // Requires pro subscriber or higher
          if (!userTier.contentAccess.canViewPremiumContent) {
            return { 
              canAccess: false, 
              reason: 'Pro Subscriber tier or higher required' 
            };
          }
          return { canAccess: true };
          
        case 'private':
          // Requires VIP subscriber access
          if (!userTier.contentAccess.canViewExclusiveContent) {
            return { 
              canAccess: false, 
              reason: 'VIP Subscriber tier required for exclusive content' 
            };
          }
          return { canAccess: true };
          
        default:
          return { canAccess: true };
      }
    }

    return { canAccess: true };
  };

  const { canAccess, reason } = canAccessContent();

  const getRequiredTierIcon = () => {
    switch (content.privacyLevel) {
      case 'premium':
        return <Star className="w-5 h-5" />;
      case 'private':
        return <Crown className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getRequiredTierName = () => {
    switch (content.privacyLevel) {
      case 'subscribers':
        return 'Basic Subscriber';
      case 'premium':
        return 'Pro Subscriber';
      case 'private':
        return 'VIP Subscriber';
      default:
        return 'Subscription';
    }
  };

  const getRequiredTierColor = () => {
    switch (content.privacyLevel) {
      case 'premium':
        return 'bg-purple-500';
      case 'private':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  // If user can access content or it's the newest post, show normally
  if (canAccess) {
    return (
      <div className={className}>
        {isNewestPost && (
          <Badge variant="secondary" className="mb-2">
            <Eye className="w-4 h-4 mr-1" />
            Latest Post - Free Preview
          </Badge>
        )}
        {children}
      </div>
    );
  }

  // Show blurred content with subscription prompt
  return (
    <>
      <Card className={`relative overflow-hidden ${className}`}>
        <div className="relative">
          {/* Blurred content */}
          <div className="filter blur-xl scale-105 pointer-events-none">
            {children}
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-6 max-w-sm">
              <div className={`w-16 h-16 mx-auto rounded-full ${getRequiredTierColor()} flex items-center justify-center text-white mb-4`}>
                <Lock className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Subscription Required
              </h3>
              
              <p className="text-gray-200 mb-4">
                {reason || 'Subscribe to see more amazing content from this creator'}
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`p-2 rounded-full ${getRequiredTierColor()} text-white`}>
                  {getRequiredTierIcon()}
                </div>
                <span className="text-white font-medium">
                  {getRequiredTierName()} Required
                </span>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowPricingModal(true)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  View Subscription Plans
                </Button>
                
                {!isAuthenticated && (
                  <Button 
                    variant="outline" 
                    className="w-full text-white border-white hover:bg-white hover:text-black"
                    onClick={() => window.location.href = '/login'}
                  >
                    Login to Access
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content metadata that's always visible */}
        <CardContent className="p-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{content.type}</Badge>
              {content.privacyLevel !== 'public' && (
                <Badge className={getRequiredTierColor()}>
                  {getRequiredTierName()}
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {content.createdAt?.toLocaleDateString()}
            </span>
          </div>
          
          {content.title && (
            <h4 className="font-semibold mt-2">{content.title}</h4>
          )}
          
          {content.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {content.description}
            </p>
          )}
        </CardContent>
      </Card>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        initialTab="subscriber"
      />
    </>
  );
};

export default ContentAccessControl;

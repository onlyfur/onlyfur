import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageCircle, 
  Lock, 
  Crown, 
  Star, 
  Heart, 
  Upload,
  Image as ImageIcon,
  Video,
  AlertTriangle
} from 'lucide-react';
import { User, PlatformSubscriptionTier } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getTierById } from '@/data/subscriptionTiers';
import PricingModal from '../subscription/PricingModal';

interface TierBasedMessagingProps {
  recipient: User;
  children?: React.ReactNode;
  className?: string;
}

const TierBasedMessaging: React.FC<TierBasedMessagingProps> = ({
  recipient,
  children,
  className = ''
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Check if user can message the recipient
  const canMessage = (): { 
    canSend: boolean; 
    reason?: string; 
    requiredTier?: string;
    currentLimit?: number;
    maxLimit?: number;
  } => {
    if (!isAuthenticated || !user) {
      return { 
        canSend: false, 
        reason: 'You must be logged in to send messages' 
      };
    }

    if (user.id === recipient.id) {
      return { canSend: true };
    }

    const userTier = user.subscriptionTier;
    const recipientTier = recipient.subscriptionTier;

    // Admin can message anyone
    if (user.role === 'admin') {
      return { canSend: true };
    }

    // Check if user has an active subscription
    if (!userTier || userTier.status !== 'active') {
      return { 
        canSend: false, 
        reason: 'Active subscription required to send messages',
        requiredTier: 'Basic Subscriber'
      };
    }

    // Check daily conversation limits
    if (userTier.maxConversations !== -1) {
      // In a real app, you'd check actual conversation count from the backend
      const currentConversations = 0; // Placeholder
      if (currentConversations >= userTier.maxConversations) {
        return {
          canSend: false,
          reason: 'Daily conversation limit reached',
          currentLimit: currentConversations,
          maxLimit: userTier.maxConversations,
          requiredTier: 'Pro Subscriber'
        };
      }
    }

    // Check if recipient allows messages from user's tier
    if (recipient.role === 'creator' && recipientTier) {
      // TODO: Update allowedTiers logic if needed
      const allowedTiers: string[] = [];
      
      if (!allowedTiers.includes(userTier.id)) {
        // Determine required tier based on recipient's settings
        let requiredTierName = 'Pro Subscriber';
        if (allowedTiers.includes('vip-subscriber')) {
          requiredTierName = 'VIP Subscriber';
        } else if (allowedTiers.includes('pro-subscriber')) {
          requiredTierName = 'Pro Subscriber';
        }

        return {
          canSend: false,
          reason: `This creator only accepts messages from ${requiredTierName} or higher`,
          requiredTier: requiredTierName
        };
      }
    }

    return { canSend: true };
  };

  const { canSend, reason, requiredTier, currentLimit, maxLimit } = canMessage();

  const getRequiredTierIcon = (tierName: string) => {
    if (tierName?.includes('VIP')) return <Crown className="w-5 h-5" />;
    if (tierName?.includes('Pro')) return <Star className="w-5 h-5" />;
    return <Heart className="w-5 h-5" />;
  };

  const getRequiredTierColor = (tierName: string) => {
    if (tierName?.includes('VIP')) return 'bg-linear-to-r from-yellow-400 to-orange-500';
    if (tierName?.includes('Pro')) return 'bg-purple-500';
    return 'bg-blue-500';
  };

  const canSendMedia = (): boolean => {
    if (!user?.subscriptionTier) return false;
    return user.subscriptionTier.messagingFeatures?.canSendMedia || false;
  };

  const getMessageFeatures = () => {
    if (!user?.subscriptionTier) return null;

    const tier = user.subscriptionTier;
    return {
      canSendMedia: tier.messagingFeatures?.canSendMedia || false,
      maxConversations: tier.maxConversations,
      supportLevel: tier.supportLevel
    };
  };

  // If user can send messages, show the messaging interface
  if (canSend) {
    const features = getMessageFeatures();

    return (
      <div className={className}>
        {children}
        
        {/* Message features info */}
        {features && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Your messaging features:</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                {features.canSendMedia ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <ImageIcon className="w-3 h-3" />
                    <Video className="w-3 h-3" />
                    <span>Media sharing enabled</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Text only (upgrade for media)</span>
                  </div>
                )}
              </div>
              <div>
                Conversations: {features.maxConversations === -1 ? 'Unlimited' : `${features.maxConversations}/day`}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show restriction notice and upgrade prompt
  return (
    <>
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2">
              Messaging Restricted
            </h3>
            
            <p className="text-muted-foreground mb-4">
              {reason}
            </p>

            {requiredTier && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`p-2 rounded-full ${getRequiredTierColor(requiredTier)} text-white`}>
                  {getRequiredTierIcon(requiredTier)}
                </div>
                <span className="font-medium">
                  {requiredTier} Required
                </span>
              </div>
            )}

            {currentLimit !== undefined && maxLimit && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You've reached your daily limit of {maxLimit} conversations. 
                  Upgrade to Pro Subscriber for more conversations.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button 
                onClick={() => setShowPricingModal(true)}
                className="w-full"
              >
                {requiredTier ? `Upgrade to ${requiredTier}` : 'View Subscription Plans'}
              </Button>
              
              {!isAuthenticated && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/login'}
                >
                  Login to Message
                </Button>
              )}
            </div>
          </div>
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

export default TierBasedMessaging;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lock, 
  Crown, 
  Star, 
  Heart, 
  Users, 
  Sparkles,
  ArrowRight,
  Zap,
  Gift,
  TrendingUp,
  Eye,
  Download,
  MessageCircle,
  Shield,
  Info
} from 'lucide-react';
import { Content, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { subscriberTiers } from '@/data/subscriptionTiers';
import { tierValidationService } from '@/services/tierValidationService';
import PricingModal from '../subscription/PricingModal';

interface SubscriptionPromptProps {
  content: Content;
  requiredTier?: string;
  className?: string;
  variant?: 'full' | 'compact' | 'overlay';
  showBenefits?: boolean;
  showUpgradeOnly?: boolean;
}

const SubscriptionPrompt: React.FC<SubscriptionPromptProps> = ({
  content,
  requiredTier,
  className = '',
  variant = 'full',
  showBenefits = true,
  showUpgradeOnly = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getTierInfo = () => {
    const tierName = requiredTier || getRequiredTierForPrivacy(content.privacyLevel);
    const tier = subscriberTiers.find(t => t.name === tierName);
    
    return {
      name: tierName,
      tier,
      icon: getTierIcon(content.privacyLevel),
      color: getTierColor(content.privacyLevel),
      gradient: getTierGradient(content.privacyLevel),
      description: getTierDescription(content.privacyLevel)
    };
  };

  const getRequiredTierForPrivacy = (privacyLevel: string): string => {
    switch (privacyLevel) {
      case 'subscribers': return 'Basic Subscriber';
      case 'premium': return 'Pro Subscriber';
      case 'private': return 'VIP Subscriber';
      default: return 'Subscription';
    }
  };

  const getTierIcon = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'premium': return Star;
      case 'private': return Crown;
      default: return Heart;
    }
  };

  const getTierColor = (privacyLevel: string): string => {
    switch (privacyLevel) {
      case 'premium': return 'bg-purple-500';
      case 'private': return 'bg-linear-to-r from-yellow-400 to-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getTierGradient = (privacyLevel: string): string => {
    switch (privacyLevel) {
      case 'premium': return 'from-purple-600 to-purple-400';
      case 'private': return 'from-yellow-500 to-orange-400';
      default: return 'from-blue-600 to-blue-400';
    }
  };

  const getTierDescription = (privacyLevel: string): string => {
    switch (privacyLevel) {
      case 'premium': return 'High-quality premium content for dedicated subscribers';
      case 'private': return 'Ultra-exclusive VIP content for top supporters';
      default: return 'Exclusive subscriber content from this creator';
    }
  };

  const getSubscriberCount = (): number => {
    // Mock function - in real app, get from API
    const counts: Record<string, number> = {
      'subscribers': 2500,
      'premium': 800,
      'private': 150
    };
    return counts[content.privacyLevel] || 1000;
  };

  const getBenefits = () => {
    const baseBenefits = [
      'Access to all subscriber content',
      'Direct messaging with creators',
      'Community discussions',
      'Early access to new posts'
    ];

    if (content.privacyLevel === 'premium') {
      return [
        ...baseBenefits,
        'Premium HD content',
        'Download content offline',
        'Priority support',
        'Advanced messaging features'
      ];
    }

    if (content.privacyLevel === 'private') {
      return [
        ...baseBenefits,
        'All premium benefits',
        'VIP exclusive content',
        'Unlimited messaging',
        'Ultra HD streaming',
        'VIP events and perks'
      ];
    }

    return baseBenefits;
  };

  const getCurrentTierInfo = () => {
    if (!user?.subscriptionTier) return null;
    return {
      name: user.subscriptionTier.name,
      level: user.subscriptionTier.level
    };
  };

  const getUpgradeValue = () => {
    const tier = getTierInfo().tier;
    if (!tier) return null;

    const currentTier = getCurrentTierInfo();
    const upgradeSavings = currentTier ? 
      Math.round((tier.price - 9.99) * 0.2) : // Mock calculation
      Math.round(tier.price * 0.15);

    return {
      monthlyPrice: tier.price,
      yearlyPrice: tier.price * 12 * 0.8, // 20% discount
      savings: upgradeSavings,
      contentValue: Math.round(tier.price / Math.max(getSubscriberCount() / 100, 1) * 100) / 100
    };
  };

  const tierInfo = getTierInfo();
  const TierIcon = tierInfo.icon;
  const benefits = getBenefits();
  const upgradeValue = getUpgradeValue();
  const currentTier = getCurrentTierInfo();

  // Overlay variant for blurred content
  if (variant === 'overlay') {
    return (
      <>
        <div className={`absolute inset-0 bg-linear-to-br ${tierInfo.gradient} bg-opacity-95 backdrop-blur-xs flex items-center justify-center z-10`}>
          <div className="text-center p-6 max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-4">
              <Lock className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              {tierInfo.name} Required
            </h3>
            
            <p className="text-white/90 mb-4 text-sm">
              {tierInfo.description}
            </p>

            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-3 mb-4">
              <div className="text-white/80 text-xs">
                Join {getSubscriberCount().toLocaleString()}+ subscribers
              </div>
            </div>
            
            <Button 
              onClick={() => setShowPricingModal(true)}
              className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold"
            >
              <Zap className="w-4 h-4 mr-2" />
              {requiredTier ? `Upgrade to ${requiredTier}` : 'View Plans'}
            </Button>
          </div>
        </div>

        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          initialTab="subscriber"
          showComparison={true}
        />
      </>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <>
        <Card className={`${className} border-2 border-dashed border-primary/30`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${tierInfo.color} flex items-center justify-center text-white`}>
                  <TierIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{tierInfo.name} Required</h4>
                  <p className="text-xs text-muted-foreground">
                    {getSubscriberCount()} subscribers
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => setShowPricingModal(true)}>
                Unlock
              </Button>
            </div>
          </CardContent>
        </Card>

        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          initialTab="subscriber"
          showComparison={true}
        />
      </>
    );
  }

  // Full variant
  return (
    <>
      <Card className={`${className} border-primary/20 bg-linear-to-br from-background to-muted/30`}>
        <CardHeader className="text-center pb-4">
          <div className={`w-20 h-20 mx-auto rounded-full ${tierInfo.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
            <TierIcon className="w-10 h-10" />
          </div>
          
          <CardTitle className="text-2xl font-bold mb-2">
            {showUpgradeOnly && currentTier ? 
              `Upgrade to ${tierInfo.name}` : 
              `${tierInfo.name} Required`
            }
          </CardTitle>
          
          <CardDescription className="text-base">
            {tierInfo.description}
          </CardDescription>

          {/* Current tier info */}
          {currentTier && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                You currently have <strong>{currentTier.name}</strong>. 
                Upgrade for access to this content and more exclusive features.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">
                {getSubscriberCount().toLocaleString()}+
              </div>
              <div className="text-xs text-muted-foreground">Subscribers</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">
                ${upgradeValue?.monthlyPrice || '9.99'}
              </div>
              <div className="text-xs text-muted-foreground">Per Month</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">
                ${upgradeValue?.contentValue || '0.10'}
              </div>
              <div className="text-xs text-muted-foreground">Per Content</div>
            </div>
          </div>

          {/* Benefits */}
          {showBenefits && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wide">
                What You'll Get:
              </h4>
              <div className="grid gap-2">
                {benefits.slice(0, showDetails ? benefits.length : 4).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-6 h-6 rounded-full ${tierInfo.color} flex items-center justify-center text-white`}>
                      {getBenefitIcon(benefit)}
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {benefits.length > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full"
                >
                  {showDetails ? 'Show Less' : `+${benefits.length - 4} More Benefits`}
                  <ArrowRight className={`w-3 h-3 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                </Button>
              )}
            </div>
          )}

          {/* Pricing */}
          {upgradeValue && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Monthly Plan</span>
                <span className="text-lg font-bold">${upgradeValue.monthlyPrice}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>Annual Plan (Save 20%)</span>
                <span>${(upgradeValue.yearlyPrice / 12).toFixed(2)}/month</span>
              </div>
              {upgradeValue.savings > 0 && (
                <div className="text-xs text-green-600 font-medium">
                  💡 Save ${upgradeValue.savings}/month compared to basic plans
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => setShowPricingModal(true)}
              className="w-full"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              {showUpgradeOnly ? `Upgrade to ${tierInfo.name}` : 'Choose Your Plan'}
            </Button>
            
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/login'}
              >
                Login to Access
              </Button>
            )}

            {/* Social proof */}
            <div className="text-center text-xs text-muted-foreground">
              <span className="flex items-center justify-center gap-1">
                <Users className="w-3 h-3" />
                Join {getSubscriberCount().toLocaleString()}+ happy subscribers
              </span>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Gift className="w-4 h-4" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Growing Community</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        initialTab="subscriber"
        showComparison={true}
      />
    </>
  );
};

// Helper function to get icons for benefits
const getBenefitIcon = (benefit: string) => {
  if (benefit.toLowerCase().includes('messaging')) {
    return <MessageCircle className="w-3 h-3" />;
  }
  if (benefit.toLowerCase().includes('download')) {
    return <Download className="w-3 h-3" />;
  }
  if (benefit.toLowerCase().includes('hd') || benefit.toLowerCase().includes('quality')) {
    return <Eye className="w-3 h-3" />;
  }
  if (benefit.toLowerCase().includes('support')) {
    return <Shield className="w-3 h-3" />;
  }
  if (benefit.toLowerCase().includes('vip') || benefit.toLowerCase().includes('exclusive')) {
    return <Crown className="w-3 h-3" />;
  }
  if (benefit.toLowerCase().includes('premium')) {
    return <Star className="w-3 h-3" />;
  }
  return <Sparkles className="w-3 h-3" />;
};

export default SubscriptionPrompt;

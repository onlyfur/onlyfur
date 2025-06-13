import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Crown, 
  Heart, 
  Upload, 
  DollarSign, 
  Users, 
  Camera, 
  MessageCircle, 
  TrendingUp,
  Star,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
  Shield,
  Download,
  Video,
  Image
} from 'lucide-react';
import { PlatformSubscriptionTier } from '@/types';
import { subscriberTiers, creatorTiers } from '@/data/subscriptionTiers';

interface EnhancedRoleSelectorProps {
  selectedRole: 'creator' | 'subscriber' | null;
  selectedTier: string | null;
  onRoleSelect: (role: 'creator' | 'subscriber') => void;
  onTierSelect: (tierId: string | null) => void;
  showTierSelection?: boolean;
}

const EnhancedRoleSelector: React.FC<EnhancedRoleSelectorProps> = ({ 
  selectedRole, 
  selectedTier,
  onRoleSelect, 
  onTierSelect,
  showTierSelection = true
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const roleOptions = [
    {
      id: 'subscriber' as const,
      title: 'Join as Subscriber',
      description: 'Discover and support amazing furry creators',
      icon: Heart,
      features: [
        'Access exclusive furry content',
        'Connect with favorite creators',
        'Join the furry community',
        'Support artists you love',
        'Get early access to new content'
      ],
      benefits: [
        'Free and premium content access',
        'Direct messaging with creators',
        'Community discussions',
        'Personalized recommendations'
      ],
      gradient: 'from-blue-500 to-purple-600',
      popular: true,
      tiers: subscriberTiers
    },
    {
      id: 'creator' as const,
      title: 'Join as Creator',
      description: 'Monetize your furry content and build your pack',
      icon: Crown,
      features: [
        'Upload and sell furry content',
        'Build your subscriber base',
        'Earn money from your art',
        'Connect with your pack',
        'Access creator tools'
      ],
      benefits: [
        'Multiple revenue streams',
        'Advanced analytics',
        'Creator community access',
        'Professional tools and features'
      ],
      gradient: 'from-orange-500 to-red-600',
      popular: false,
      tiers: creatorTiers
    }
  ];

  const getTierIcon = (tier: PlatformSubscriptionTier) => {
    switch (tier.level) {
      case 'basic':
        return Heart;
      case 'pro':
        return Star;
      case 'premium':
        return Crown;
      case 'vip':
        return Sparkles;
      default:
        return Heart;
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('messaging')) return MessageCircle;
    if (feature.toLowerCase().includes('content')) return Upload;
    if (feature.toLowerCase().includes('streaming')) return Video;
    if (feature.toLowerCase().includes('media')) return Image;
    if (feature.toLowerCase().includes('download')) return Download;
    if (feature.toLowerCase().includes('support')) return Shield;
    return Check;
  };

  const renderTierCard = (tier: PlatformSubscriptionTier, isSelected: boolean) => {
    const Icon = getTierIcon(tier);
    
    return (
      <Card 
        key={tier.id}
        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
          isSelected 
            ? 'ring-2 ring-primary border-primary shadow-lg' 
            : 'hover:border-primary/50'
        }`}
        onClick={() => onTierSelect(tier.id)}
      >
        {tier.isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className={`w-12 h-12 mx-auto rounded-full ${tier.color} flex items-center justify-center text-white mb-3`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <CardTitle className="text-lg font-bold">{tier.name}</CardTitle>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-bold">${tier.price}</span>
            <span className="text-sm text-muted-foreground">/{tier.billingPeriod}</span>
          </div>
          <CardDescription className="text-sm">{tier.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Key Features
            </h4>
            {tier.features.slice(0, showAdvanced ? undefined : 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
            {tier.features.length > 4 && !showAdvanced && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAdvanced(true);
                }}
                className="text-sm text-primary hover:underline"
              >
                +{tier.features.length - 4} more features
              </button>
            )}
          </div>

          {/* Messaging Features */}
          {showAdvanced && (
            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-semibold text-sm uppercase tracking-wide">
                Messaging & Content
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>
                    {/* Replace or remove maxConversations if not present on tier */}
                    {'Unlimited chats/day'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Image className="w-3 h-3" />
                  <span>
                    {tier.messagingFeatures.canSendMedia ? 'Media sharing' : 'Text only'}
                  </span>
                </div>
                {tier.contentAccess.canViewPremiumContent && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>Premium content</span>
                  </div>
                )}
                {tier.contentAccess.canViewExclusiveContent && (
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-purple-500" />
                    <span>VIP exclusive</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Creator-specific features */}
          {tier.type === 'creator' && tier.creatorFeatures && showAdvanced && (
            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-semibold text-sm uppercase tracking-wide">
                Creator Tools
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{tier.creatorFeatures.platformFeePercentage}% fee</span>
                </div>
                <div className="flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>
                    {tier.creatorFeatures.maxUploadsPerDay === -1 
                      ? 'Unlimited' 
                      : `${tier.creatorFeatures.maxUploadsPerDay}`} uploads/day
                  </span>
                </div>
                {tier.creatorFeatures.liveStreamingEnabled && (
                  <div className="flex items-center gap-1">
                    <Video className="w-3 h-3 text-red-500" />
                    <span>Live streaming</span>
                  </div>
                )}
                {tier.creatorFeatures.customBranding && (
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>Custom branding</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button 
            variant={isSelected ? "default" : "outline-solid"}
            className="w-full mt-4"
            onClick={() => onTierSelect(tier.id)}
          >
            {isSelected ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Selected
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Choose {tier.name}
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Journey</h2>
        <p className="text-muted-foreground">
          Select how you'd like to experience the OnlyFur platform
        </p>
      </div>

      {/* Advanced Toggle */}
      <div className="flex items-center justify-center gap-2">
        <Label htmlFor="advanced-mode" className="text-sm">
          Show detailed features
        </Label>
        <Switch
          id="advanced-mode"
          checked={showAdvanced}
          onCheckedChange={setShowAdvanced}
        />
      </div>

      {/* Role Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {roleOptions.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <Card 
              key={role.id}
              className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary shadow-lg' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onRoleSelect(role.id)}
            >
              {role.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-linear-to-br ${role.gradient} flex items-center justify-center text-white mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                    What You Can Do
                  </h4>
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                    Key Benefits
                  </h4>
                  {role.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={isSelected ? "default" : "outline-solid"}
                  className="w-full mt-6"
                  onClick={() => onRoleSelect(role.id)}
                >
                  {isSelected ? 'Selected' : `Choose ${role.id === 'creator' ? 'Creator' : 'Subscriber'}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tier Selection */}
      {selectedRole && showTierSelection && (
        <div className="space-y-6 pt-8 border-t">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              Choose Your {selectedRole === 'creator' ? 'Creator' : 'Subscriber'} Tier
            </h3>
            <p className="text-muted-foreground">
              {selectedRole === 'creator' 
                ? 'Select the tools and features that match your creator goals'
                : 'Pick the subscription level that fits your content consumption needs'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roleOptions
              .find(role => role.id === selectedRole)
              ?.tiers.map(tier => renderTierCard(tier, selectedTier === tier.id))
            }
          </div>

          {selectedTier && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                You can start with any tier and upgrade anytime. 
                Your subscription will be activated after completing registration.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedRole && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            You selected <strong>{selectedRole === 'creator' ? 'Creator' : 'Subscriber'}</strong>
            {selectedTier && (
              <>
                {' '}with <strong>
                  {roleOptions
                    .find(role => role.id === selectedRole)
                    ?.tiers.find(tier => tier.id === selectedTier)?.name
                  }
                </strong> tier
              </>
            )}. 
            You can always change this later in your profile settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedRoleSelector;

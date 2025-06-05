import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Heart, 
  Star, 
  Sparkles,
  Check, 
  X,
  DollarSign,
  Users,
  MessageCircle,
  Upload,
  Video,
  Image,
  Download,
  Shield,
  Zap,
  TrendingUp,
  Info
} from 'lucide-react';
import { PlatformSubscriptionTier } from '@/types';
import { subscriberTiers, creatorTiers } from '@/data/subscriptionTiers';
import { getTierComparison, getCreatorTierComparison } from '@/utils/permissionUtils';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'subscriber' | 'creator';
  onTierSelect?: (tierId: string) => void;
  showComparison?: boolean;
}

const EnhancedPricingModal: React.FC<EnhancedPricingModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'subscriber',
  onTierSelect,
  showComparison = true
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAnnual, setShowAnnual] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showFeatureComparison, setShowFeatureComparison] = useState(false);

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
    if (feature.toLowerCase().includes('analytics')) return TrendingUp;
    if (feature.toLowerCase().includes('branding')) return Sparkles;
    return Check;
  };

  const getAnnualDiscount = (monthlyPrice: number): number => {
    if (monthlyPrice === 0) return 0;
    return Math.round(monthlyPrice * 12 * 0.2); // 20% discount for annual
  };

  const getAnnualPrice = (monthlyPrice: number): number => {
    if (monthlyPrice === 0) return 0;
    return monthlyPrice * 12 - getAnnualDiscount(monthlyPrice);
  };

  const handleTierSelect = async (tierId: string) => {
    setSelectedTier(tierId);
    if (onTierSelect) {
      onTierSelect(tierId);
    }
    
    // If user is not logged in, redirect to login
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    // If this is the current tier, do nothing
    if (user?.subscriptionTier?.id === tierId) {
      return;
    }
    
    try {
      // Import payment service
      const { createSubscriptionPayment } = await import('@/services/api');
      
      // Create payment intent for the subscription
      const selectedTierData = [...subscriberTiers, ...creatorTiers].find(t => t.id === tierId);
      if (!selectedTierData) {
        throw new Error('Tier not found');
      }
      
      // Create payment intent
      const paymentData = await createSubscriptionPayment({
        tierId,
        amount: selectedTierData.price,
        currency: selectedTierData.currency || 'USD'
      });
      
      // Handle payment with Stripe
      if (paymentData.clientSecret) {
        // Import and initialize Stripe
        const stripe = (window as any).Stripe?.(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) {
          throw new Error('Stripe not loaded');
        }
        
        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret);
        
        if (error) {
          console.error('Payment failed:', error);
          // Handle payment error
        } else if (paymentIntent.status === 'succeeded') {
          // Payment successful, close modal and refresh user data
          onClose();
          window.location.reload(); // Refresh to update user subscription
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      // Handle subscription error
    }
  };

  const renderTierCard = (tier: PlatformSubscriptionTier, tiers: PlatformSubscriptionTier[]) => {
    const Icon = getTierIcon(tier);
    const isCurrentTier = user?.subscriptionTier?.id === tier.id;
    const isSelected = selectedTier === tier.id;
    const annualPrice = getAnnualPrice(tier.price);
    const annualDiscount = getAnnualDiscount(tier.price);
    
    return (
      <Card 
        key={tier.id}
        className={`relative transition-all duration-300 hover:scale-105 ${
          isSelected 
            ? 'ring-2 ring-primary border-primary shadow-lg' 
            : isCurrentTier
            ? 'ring-2 ring-green-500 border-green-500 shadow-lg'
            : 'hover:border-primary/50'
        }`}
      >
        {tier.isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">
              Most Popular
            </Badge>
          </div>
        )}

        {isCurrentTier && (
          <div className="absolute -top-3 right-4">
            <Badge className="bg-green-500 text-white">
              Current Plan
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className={`w-12 h-12 mx-auto rounded-full ${tier.color} flex items-center justify-center text-white mb-3`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <CardTitle className="text-lg font-bold">{tier.name}</CardTitle>
          
          <div className="space-y-2">
            {tier.price === 0 ? (
              <div className="text-2xl font-bold">Free</div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold">
                    ${showAnnual ? (annualPrice / 12).toFixed(2) : tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{showAnnual ? 'mo' : tier.billingPeriod}
                  </span>
                </div>
                
                {showAnnual && annualDiscount > 0 && (
                  <div className="text-xs text-green-600">
                    Save ${annualDiscount}/year
                  </div>
                )}
                
                {showAnnual && (
                  <div className="text-xs text-muted-foreground">
                    Billed annually: ${annualPrice}
                  </div>
                )}
              </>
            )}
          </div>
          
          <CardDescription className="text-sm">{tier.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Features
            </h4>
            {tier.features.slice(0, 5).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
            {tier.features.length > 5 && (
              <div className="text-sm text-muted-foreground">
                +{tier.features.length - 5} more features
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">
                  {tier.maxConversations === -1 ? '∞' : tier.maxConversations}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Chats/day</div>
            </div>
            
            {tier.type === 'creator' && tier.creatorFeatures && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span className="text-xs">
                    {tier.creatorFeatures.maxUploadsPerDay === -1 
                      ? '∞' 
                      : tier.creatorFeatures.maxUploadsPerDay
                    }
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">Uploads/day</div>
              </div>
            )}
            
            {tier.type === 'subscriber' && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Image className="w-3 h-3" />
                  <span className="text-xs">
                    {tier.messagingFeatures.maxFileSize}MB
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">File limit</div>
              </div>
            )}
          </div>

          {/* Limitations */}
          {tier.limitations.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-orange-600">
                Limitations
              </h4>
              {tier.limitations.slice(0, 3).map((limitation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <X className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{limitation}</span>
                </div>
              ))}
            </div>
          )}

          <Button 
            className="w-full mt-4"
            variant={isCurrentTier ? "outline" : isSelected ? "default" : "outline"}
            onClick={() => handleTierSelect(tier.id)}
            disabled={isCurrentTier}
          >
            {isCurrentTier ? (
              'Current Plan'
            ) : isSelected ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Selected
              </div>
            ) : tier.price === 0 ? (
              'Get Started Free'
            ) : (
              `Choose ${tier.name}`
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderComparisonTable = (tiers: PlatformSubscriptionTier[], comparisons: any[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Feature</th>
              {tiers.map(tier => (
                <th key={tier.id} className="text-center p-4 font-semibold">
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison, index) => (
              <tr key={index} className="border-b hover:bg-muted/50">
                <td className="p-4 font-medium">{comparison.feature}</td>
                {tiers.map(tier => {
                  const value = comparison[tier.level] ?? comparison[tier.level.replace('-', '')];
                  return (
                    <td key={tier.id} className="text-center p-4">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{value}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your OnlyFur Subscription
          </DialogTitle>
          <DialogDescription className="text-center">
            Unlock the full potential of the furry creator platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!showAnnual ? 'font-semibold' : ''}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={showAnnual}
              onCheckedChange={setShowAnnual}
            />
            <Label htmlFor="billing-toggle" className={showAnnual ? 'font-semibold' : ''}>
              Annual
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </Label>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subscriber" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Subscriber Plans
              </TabsTrigger>
              <TabsTrigger value="creator" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Creator Plans
              </TabsTrigger>
            </TabsList>

            {/* Subscriber Plans */}
            <TabsContent value="subscriber" className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Subscriber Plans</h3>
                <p className="text-muted-foreground">
                  Access amazing furry content and connect with creators
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {subscriberTiers.map(tier => renderTierCard(tier, subscriberTiers))}
              </div>

              {showComparison && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Feature Comparison</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFeatureComparison(!showFeatureComparison)}
                    >
                      {showFeatureComparison ? 'Hide' : 'Show'} Details
                    </Button>
                  </div>

                  {showFeatureComparison && (
                    <Card>
                      <CardContent className="p-0">
                        {renderComparisonTable(subscriberTiers, getTierComparison())}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Creator Plans */}
            <TabsContent value="creator" className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Creator Plans</h3>
                <p className="text-muted-foreground">
                  Build your furry content empire with powerful creator tools
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {creatorTiers.map(tier => renderTierCard(tier, creatorTiers))}
              </div>

              {showComparison && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Creator Feature Comparison</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFeatureComparison(!showFeatureComparison)}
                    >
                      {showFeatureComparison ? 'Hide' : 'Show'} Details
                    </Button>
                  </div>

                  {showFeatureComparison && (
                    <Card>
                      <CardContent className="p-0">
                        {renderComparisonTable(creatorTiers, getCreatorTierComparison())}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Selected Tier Summary */}
          {selectedTier && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You've selected the{' '}
                <strong>
                  {[...subscriberTiers, ...creatorTiers]
                    .find(tier => tier.id === selectedTier)?.name}
                </strong>{' '}
                plan. Click continue to proceed with payment.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            {selectedTier && (
              <Button 
                className="flex-1"
                onClick={() => {
                  // Handle checkout
                  onClose();
                  if (onTierSelect) {
                    onTierSelect(selectedTier);
                  }
                }}
              >
                Continue to Checkout
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedPricingModal;

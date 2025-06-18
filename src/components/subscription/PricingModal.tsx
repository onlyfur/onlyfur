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
  
  // Update activeTab when initialTab changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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
      // Find the selected tier data
      const selectedTierData = [...subscriberTiers, ...creatorTiers].find(t => t.id === tierId);
      if (!selectedTierData) {
        throw new Error('Tier not found');
      }
      
      // Check if we need to proceed with payment (free tiers don't need payment)
      if (selectedTierData.price === 0) {
        // For free tiers, just update the user's subscription
        try {
          const { updateUserSubscription } = await import('@/services/api');
          await updateUserSubscription(tierId);
          onClose();
          window.location.reload(); // Refresh to update user subscription
        } catch (updateError) {
          console.error('Failed to update subscription:', updateError);
          alert('Failed to update your subscription. Please try again.');
        }
        return;
      }
      
      // For paid tiers, create payment intent
      try {
        // Import payment service
        const { createSubscriptionPayment } = await import('@/services/api');
        
        // Create payment intent
        const paymentData = await createSubscriptionPayment({
          tierId,
          amount: selectedTierData.price,
          currency: selectedTierData.currency || 'USD'
        });
        
        // Check if Stripe is loaded
        if (typeof (window as any).Stripe === 'undefined') {
          // Load Stripe dynamically if not available
          const script = document.createElement('script');
          script.src = 'https://js.stripe.com/v3/';
          document.body.appendChild(script);
          
          // Wait for script to load
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }
        
        // Handle payment with Stripe
        if (paymentData.clientSecret) {
          // Initialize Stripe
          const stripe = (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
          if (!stripe) {
            throw new Error('Failed to initialize Stripe');
          }
          
          // Confirm payment
          const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret);
          
          if (error) {
            console.error('Payment failed:', error);
            alert(`Payment failed: ${error.message}`);
          } else if (paymentIntent.status === 'succeeded') {
            // Payment successful, close modal and refresh user data
            onClose();
            window.location.reload(); // Refresh to update user subscription
          }
        } else {
          throw new Error('No client secret returned from payment service');
        }
      } catch (paymentError) {
        console.error('Payment error:', paymentError);
        alert('There was a problem processing your payment. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('There was a problem with your subscription. Please try again.');
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
        onClick={() => !isCurrentTier && handleTierSelect(tier.id)}
        className={`relative transition-all duration-300 hover:scale-105 cursor-pointer select-none ${
          isSelected 
            ? 'ring-2 ring-primary border-primary shadow-lg' 
            : isCurrentTier
            ? 'ring-2 ring-green-500 border-green-500 shadow-lg cursor-default opacity-70'
            : 'hover:border-primary/50'
        }`}
        tabIndex={isCurrentTier ? -1 : 0}
        aria-disabled={isCurrentTier}
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

        <CardHeader className="text-center pb-1">
          <div className={`w-16 h-16 mx-auto rounded-full ${tier.color} flex items-center justify-center text-white mb-3`}>
            <Icon className="w-8 h-8" />
          </div>
          
          <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
          
          <div className="space-y-2">
            {tier.price === 0 ? (
              <div className="text-3xl font-bold">Free</div>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl font-bold">
                    €{showAnnual ? ((annualPrice / 12).toFixed(2)) : tier.price}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ≈ ${showAnnual ? ((tier.usdPrice * 12 * 0.8 / 12).toFixed(2)) : tier.usdPrice} USD
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{showAnnual ? 'mo' : tier.billingPeriod}
                  </span>
                </div>
                {showAnnual && annualDiscount > 0 && (
                  <div className="text-xs text-green-600">
                    Save €{annualDiscount}/year
                  </div>
                )}
                {showAnnual && (
                  <div className="text-xs text-muted-foreground">
                    Billed annually: €{annualPrice} (≈ ${Math.round(tier.usdPrice * 12 * 0.8)})
                  </div>
                )}
              </>
            )}
          </div>
          
          <CardDescription className="text-sm">{tier.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Features
            </h4>
            {tier.features.slice(0, 5).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
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
          <div className="grid grid-cols-2 gap-0 pt-1 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">
                  {tier.messagingFeatures.maxConversationsPerDay === -1 ? '∞' : tier.messagingFeatures.maxConversationsPerDay}
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
          {(tier.limitations.length > 0 || tier.id === 'pro-creator') && (
            <div className="space-y-1 pt-3 border-t">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-orange-600">
                Limitations
              </h4>
              {tier.limitations.slice(0, 3).map((limitation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <X className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{limitation}</span>
                </div>
              ))}
              {tier.id === 'pro-creator' && (
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">Reduced platform fee of 15%</span>
                </div>
              )}
            </div>
          )}
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
      <DialogContent className="max-w-7xl max-h-[96vh] min-h-[70vh] overflow-y-auto p-8 scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your OnlyFur Subscription
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Unlock the full potential of the furry creator platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!showAnnual ? 'font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent' : ''}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={showAnnual}
              onCheckedChange={setShowAnnual}
              className="border-2 border-purple-400 bg-gradient-to-r from-purple-500 to-pink-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
            />
            <Label htmlFor="billing-toggle" className={showAnnual ? 'font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent' : ''}>
              Annual
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </Label>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-md">
              <TabsTrigger value="subscriber" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-purple-600 font-semibold transition-all">
                <Heart className="w-4 h-4" />
                Subscriber Plans
              </TabsTrigger>
              <TabsTrigger value="creator" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-purple-600 font-semibold transition-all">
                <Crown className="w-4 h-4" />
                Creator Plans
              </TabsTrigger>
            </TabsList>

            {/* Subscriber Plans */}
            <TabsContent value="subscriber" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {subscriberTiers.map(tier => renderTierCard(tier, subscriberTiers))}
              </div>

              {showComparison && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Feature Comparison</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
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
              <div className="grid md:grid-cols-3 gap-4">
                {creatorTiers.map(tier => renderTierCard(tier, creatorTiers))}
              </div>

              {showComparison && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Creator Feature Comparison</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
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
          <div className="flex gap-4 pt-1 border-t">
            <Button 
              className="w-full mt-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-base py-2"
              onClick={onClose}
            >
              Cancel
            </Button>
            {selectedTier && (
              <Button 
                className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-base py-2"
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

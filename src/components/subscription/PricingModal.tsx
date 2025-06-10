import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Crown, Star, Zap, Heart, Loader2 } from 'lucide-react';
import { subscriptionAPI } from '@/services/api';
import { PlatformSubscriptionTier } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'subscriber' | 'creator';
  onSelectTier?: (tier: PlatformSubscriptionTier) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'subscriber',
  onSelectTier
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [subscriberTiers, setSubscriberTiers] = useState<PlatformSubscriptionTier[]>([]);
  const [creatorTiers, setCreatorTiers] = useState<PlatformSubscriptionTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch subscription tiers from API or use local data as fallback
  useEffect(() => {
    const fetchTiers = async () => {
      if (isOpen) {
        try {
          setIsLoading(true);
          
          // Try to fetch from API first
          try {
            const tiers = await subscriptionAPI.getTiers();
            
            if (tiers && Array.isArray(tiers) && tiers.length > 0) {
              const subscribers = tiers.filter((tier: any) => tier.type === 'SUBSCRIBER');
              const creators = tiers.filter((tier: any) => tier.type === 'CREATOR');
              
              setSubscriberTiers(subscribers);
              setCreatorTiers(creators);
            } else {
              // If API returns empty or invalid data, use local data
              throw new Error('Invalid data from API');
            }
          } catch (apiError) {
            console.warn('Could not fetch tiers from API, using local data:', apiError);
            
            // Import local data as fallback
            const { subscriberTiers: localSubscriberTiers, creatorTiers: localCreatorTiers } = 
              await import('@/data/subscriptionTiers');
            
            setSubscriberTiers(localSubscriberTiers);
            setCreatorTiers(localCreatorTiers);
          }
        } catch (error) {
          console.error('Failed to fetch subscription tiers:', error);
          toast({
            title: "Error",
            description: "Failed to load subscription plans. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTiers();
  }, [isOpen, toast]);

  const handleSelectTier = async (tier: PlatformSubscriptionTier) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login or register to subscribe to a tier.",
        variant: "destructive",
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
      return;
    }
    
    // Check if this is the current tier
    if (user?.subscriptionTier?.id === tier.id) {
      toast({
        title: "Current Plan",
        description: `You are already subscribed to the ${tier.name} plan.`,
      });
      return;
    }

    // If callback provided, use it
    if (onSelectTier) {
      onSelectTier(tier);
      return;
    }
    
    try {
      // For free tiers, just update the subscription
      if (tier.price === 0) {
        try {
          const { updateUserSubscription } = await import('@/services/api');
          await updateUserSubscription(tier.id);
          
          toast({
            title: "Subscription Updated",
            description: `You have successfully subscribed to the ${tier.name} plan.`,
          });
          
          // Close modal and refresh after a short delay
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1500);
          
        } catch (error) {
          console.error('Failed to update subscription:', error);
          toast({
            title: "Error",
            description: "Failed to update your subscription. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }
      
      // For paid tiers, redirect to payment page
      toast({
        title: "Proceeding to Payment",
        description: `You selected ${tier.name}. Redirecting to payment processing.`,
      });
      
      // In a real implementation, this would redirect to a payment page
      // For now, we'll just simulate it with a timeout
      setTimeout(() => {
        onClose();
        window.location.href = `/subscription?tier=${tier.id}`;
      }, 1500);
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "There was a problem with your subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTierIcon = (level: string) => {
    switch (level) {
      case 'basic':
        return <Heart className="w-6 h-6" />;
      case 'pro':
        return <Star className="w-6 h-6" />;
      case 'premium':
        return <Crown className="w-6 h-6" />;
      case 'vip':
        return <Zap className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  const getTierGradient = (tier: PlatformSubscriptionTier) => {
    if (tier.level === 'vip' || tier.level === 'premium') {
      return 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500';
    }
    if (tier.level === 'pro') {
      return 'bg-gradient-to-br from-purple-500 to-indigo-600';
    }
    return 'bg-gradient-to-br from-blue-500 to-blue-600';
  };

  const renderTierCard = (tier: PlatformSubscriptionTier) => (
    <Card 
      key={tier.id} 
      className={`relative transition-all duration-300 hover:scale-105 ${
        tier.isPopular ? 'ring-2 ring-primary border-primary' : ''
      }`}
    >
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className={`w-16 h-16 mx-auto rounded-full ${getTierGradient(tier)} flex items-center justify-center text-white mb-4`}>
          {getTierIcon(tier.level)}
        </div>
        
        <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
        <CardDescription className="text-sm">{tier.description}</CardDescription>
        
        <div className="mt-4">
          <div className="text-4xl font-bold">
            {tier.price === 0 ? 'Free' : `$${tier.price}`}
            {tier.price > 0 && <span className="text-lg font-normal text-muted-foreground">/month</span>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase tracking-wide">Features</h4>
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {tier.type === 'subscriber' && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm uppercase tracking-wide">Messaging</h4>
            <div className="text-sm space-y-2">
              <p>• Max conversations: {tier.messagingFeatures.maxConversationsPerDay === -1 ? 'Unlimited' : tier.messagingFeatures.maxConversationsPerDay}/day</p>
              <p>• Send media: {tier.messagingFeatures.canSendMedia ? 'Yes' : 'No'}</p>
              <p>• Priority support: {tier.messagingFeatures.canReceivePrioritySupport ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        {tier.type === 'creator' && tier.creatorFeatures && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm uppercase tracking-wide">Creator Tools</h4>
            <div className="text-sm space-y-2">
              <p>• Platform fee: {tier.id === 'basic-creator' ? '20%' : tier.id === 'pro-creator' ? '15%' : '10%'}</p>
              <p>• Uploads/day: {tier.creatorFeatures.maxUploadsPerDay === -1 ? 'Unlimited' : tier.creatorFeatures.maxUploadsPerDay}</p>
              <p>• Analytics: {tier.creatorFeatures.analyticsAccess}</p>
              <p>• Live streaming: {tier.creatorFeatures.liveStreamingEnabled ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        {tier.limitations.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Limitations</h4>
            {tier.limitations.map((limitation, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0">•</span>
                <span className="text-sm text-muted-foreground">{limitation}</span>
              </div>
            ))}
          </div>
        )}

        <Button 
          className="w-full mt-6" 
          variant={tier.isPopular ? "default" : "outline"}
          onClick={() => handleSelectTier(tier)}
        >
          {tier.price === 0 ? 'Get Started' : 'Subscribe Now'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Choose Your OnlyFur Experience
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Select the perfect tier for your furry journey
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mr-3" />
            <span className="text-lg">Loading subscription plans...</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'subscriber' | 'creator')}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="subscriber" className="text-lg py-3">
                🐾 Subscriber Plans
              </TabsTrigger>
              <TabsTrigger value="creator" className="text-lg py-3">
                🎨 Creator Plans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscriber" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Subscriber Tiers</h3>
                <p className="text-muted-foreground">
                  Access amazing furry content and connect with your favorite creators
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {subscriberTiers.map(renderTierCard)}
              </div>
            </TabsContent>

            <TabsContent value="creator" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Creator Tiers</h3>
                <p className="text-muted-foreground">
                  Monetize your furry content and build your community
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {creatorTiers.map(renderTierCard)}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;

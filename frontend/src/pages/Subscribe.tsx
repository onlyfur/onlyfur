import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import {
  CreditCard,
  Shield,
  Star,
  Crown,
  CheckCircle,
  ArrowLeft,
  Lock,
  Calendar,
  Users,
  Gift,
} from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionTier, SubscriptionFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import PayPalPaymentForm from '@/components/payment/PayPalPaymentForm';

// Initialize Stripe with test key
const stripePromise = loadStripe('pk_test_51234567890abcdef'); // Test key

const paypalOptions = {
  clientId: 'test-client-id', // Test client ID
  currency: 'USD',
  intent: 'subscription',
};

const Subscribe: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { subscriptionTiers, subscribe, isLoading } = usePayment();
  
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [step, setStep] = useState<'tier' | 'payment' | 'confirmation'>('tier');
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionFormData | null>(null);

  // Mock creator data
  const creatorData = {
    id: creatorId || 'demo-creator',
    name: 'Sarah Johnson',
    username: '@sarahjohnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    bio: 'Professional photographer and lifestyle content creator sharing behind-the-scenes moments and exclusive tutorials.',
    followers: '12.4K',
    content: '148 posts',
    rating: 4.9,
    responseTime: '< 1 hour',
  };

  // Filter tiers for this creator (in real app, would filter by creatorId)
  const availableTiers = subscriptionTiers.filter(tier => tier.isActive);

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const handleTierSelect = (tier: SubscriptionTier) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to subscribe to creators.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setSelectedTier(tier);
    setStep('payment');
  };

  const handlePaymentMethodChange = (method: 'stripe' | 'paypal') => {
    setPaymentMethod(method);
  };

  const handleSubscriptionSuccess = async (paymentDetails: any) => {
    if (!selectedTier) return;

    try {
      const formData: SubscriptionFormData = {
        tierId: selectedTier.id,
        paymentMethodType: paymentMethod,
        ...paymentDetails,
      };

      setSubscriptionData(formData);
      const subscription = await subscribe(formData);
      
      setStep('confirmation');
      
      toast({
        title: 'Subscription Successful!',
        description: `You're now subscribed to ${creatorData.name}'s ${selectedTier.name} tier.`,
      });
    } catch (error) {
      toast({
        title: 'Subscription Failed',
        description: 'There was an error processing your subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBackToTiers = () => {
    setStep('tier');
    setSelectedTier(null);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (step === 'confirmation') {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Subscription Confirmed!</CardTitle>
            <CardDescription>
              Welcome to {creatorData.name}'s {selectedTier?.name} tier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creator:</span>
                <span className="font-medium">{creatorData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tier:</span>
                <span className="font-medium">{selectedTier?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Price:</span>
                <span className="font-medium">{selectedTier && formatPrice(selectedTier.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Billing:</span>
                <span className="font-medium">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">What's Next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Access to exclusive content immediately</li>
                <li>• Billing on the same date each month</li>
                <li>• Manage subscription in your dashboard</li>
                <li>• Cancel anytime from settings</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleGoToDashboard} className="flex-1">
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate(`/creator/${creatorId}`)}>
                View Creator Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'payment' && selectedTier) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBackToTiers} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tiers
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Complete Your Subscription</h1>
            <p className="text-muted-foreground">
              Subscribing to {creatorData.name} • {selectedTier.name} Tier
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subscription Tier:</span>
                  <span className="font-medium">{selectedTier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Price:</span>
                  <span className="font-medium">{formatPrice(selectedTier.price)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Platform Fee:</span>
                  <span>Included</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(selectedTier.price)}/month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What You Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <Star className="w-4 h-4 mr-3 text-yellow-500" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your payment information is encrypted and secure. You can cancel anytime from your dashboard.
              </AlertDescription>
            </Alert>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Payment Method</CardTitle>
                <CardDescription>
                  Select your preferred payment method to complete the subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-3" />
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">
                              Visa, Mastercard, American Express
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">Recommended</Badge>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-5 h-5 mr-3 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            P
                          </div>
                          <div>
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-muted-foreground">
                              Pay with your PayPal account
                            </div>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Form */}
            {paymentMethod === 'stripe' ? (
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  tier={selectedTier}
                  onSuccess={handleSubscriptionSuccess}
                  isLoading={isLoading}
                />
              </Elements>
            ) : (
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalPaymentForm
                  tier={selectedTier}
                  onSuccess={handleSubscriptionSuccess}
                  isLoading={isLoading}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tier Selection Step
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Creator Header */}
      <div className="relative mb-8">
        <div 
          className="w-full h-48 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${creatorData.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/50 rounded-lg" />
        </div>
        <div className="absolute bottom-0 left-6 transform translate-y-1/2">
          <img
            src={creatorData.avatar}
            alt={creatorData.name}
            className="w-24 h-24 rounded-full border-4 border-background"
          />
        </div>
      </div>

      <div className="ml-32 mb-8">
        <h1 className="text-3xl font-bold mb-2">{creatorData.name}</h1>
        <p className="text-muted-foreground mb-4">{creatorData.username}</p>
        <p className="text-sm max-w-2xl mb-4">{creatorData.bio}</p>
        
        <div className="flex gap-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {creatorData.followers} followers
          </div>
          <div className="flex items-center">
            <Gift className="w-4 h-4 mr-1" />
            {creatorData.content}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {creatorData.rating} rating
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {creatorData.responseTime} response time
          </div>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Choose Your Subscription</h2>
        
        {availableTiers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Subscription Tiers Available</h3>
              <p className="text-muted-foreground">
                This creator hasn't set up subscription tiers yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative border-2 hover:border-current transition-colors cursor-pointer ${
                  tier.name === 'Premium' ? 'border-purple-500 shadow-lg' : ''
                }`}
                style={{ borderColor: tier.color }}
                onClick={() => handleTierSelect(tier)}
              >
                {tier.name === 'Premium' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: tier.color }}
                      />
                      <CardTitle className="flex items-center">
                        {tier.name}
                        {tier.name === 'VIP' && <Crown className="w-4 h-4 ml-2 text-yellow-500" />}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Price */}
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {formatPrice(tier.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>

                    {/* Subscriber Count */}
                    <div className="text-center text-sm text-muted-foreground border-t pt-3">
                      <Users className="w-4 h-4 inline mr-1" />
                      {tier.subscriberCount} subscribers
                    </div>

                    {/* Subscribe Button */}
                    <Button 
                      className="w-full"
                      style={{ backgroundColor: tier.color }}
                      onClick={() => handleTierSelect(tier)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Subscribe Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Secure Payments
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Cancel Anytime
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant Access
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Join {availableTiers.reduce((sum, tier) => sum + tier.subscriberCount, 0)}+ Subscribers
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribe;
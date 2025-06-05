import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import {
  CreditCard,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { SubscriptionTier } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface StripePaymentFormProps {
  tier: SubscriptionTier;
  onSuccess: (paymentDetails: any) => void;
  isLoading: boolean;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  tier,
  onSuccess,
  isLoading: parentLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        backgroundColor: 'hsl(var(--background))',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
        iconColor: 'hsl(var(--muted-foreground))',
      },
      invalid: {
        color: 'hsl(var(--destructive))',
        iconColor: 'hsl(var(--destructive))',
      },
    },
    hidePostalCode: false,
  };

  const handleCardChange = (event: any) => {
    setError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !agreeToTerms) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError('Card element not found');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
        billing_details: billingDetails,
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Simulate payment processing (in real app, would call backend)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      const paymentDetails = {
        paymentMethodId: paymentMethod.id,
        paymentMethodType: 'stripe',
        billingDetails,
        savePaymentMethod,
        transactionId: `stripe_${Date.now()}`,
        amount: tier.price,
        currency: 'usd',
      };

      onSuccess(paymentDetails);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your payment');
    } finally {
      setProcessing(false);
    }
  };

  const isLoading = processing || parentLoading;
  const canSubmit = stripe && cardComplete && agreeToTerms && billingDetails.name && billingDetails.email;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Credit Card Information
        </CardTitle>
        <CardDescription>
          Enter your payment details to complete the subscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Billing Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={billingDetails.name}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={billingDetails.email}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={billingDetails.address.line1}
                onChange={(e) => setBillingDetails(prev => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value }
                }))}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={billingDetails.address.city}
                  onChange={(e) => setBillingDetails(prev => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={billingDetails.address.state}
                  onChange={(e) => setBillingDetails(prev => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value }
                  }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postal">ZIP Code</Label>
                <Input
                  id="postal"
                  placeholder="10001"
                  value={billingDetails.address.postal_code}
                  onChange={(e) => setBillingDetails(prev => ({
                    ...prev,
                    address: { ...prev.address, postal_code: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Card Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Payment Details</h4>
            
            <div className="space-y-2">
              <Label>Card Information</Label>
              <div className="p-3 border rounded-md bg-background">
                <CardElement 
                  options={cardElementOptions}
                  onChange={handleCardChange}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-payment"
                checked={savePaymentMethod}
                onCheckedChange={(checked) => setSavePaymentMethod(checked === true)}
              />
              <Label htmlFor="save-payment" className="text-sm">
                Save this payment method for future purchases
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                required
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Your payment information is encrypted and processed securely. We never store your card details.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Subscribe for ${(tier.price / 100).toFixed(2)}/month
              </>
            )}
          </Button>

          {/* Security Indicators */}
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              PCI Compliant
            </div>
            <div className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Secure Payments
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;
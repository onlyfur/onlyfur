import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { SubscriptionTier } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface PayPalPaymentFormProps {
  tier: SubscriptionTier;
  onSuccess: (paymentDetails: any) => void;
  isLoading: boolean;
}

const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({
  tier,
  onSuccess,
  isLoading: parentLoading,
}) => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: `plan_${tier.id}`, // This would be created in PayPal dashboard
      application_context: {
        brand_name: 'OnlyFur',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        return_url: window.location.origin + '/subscription/success',
        cancel_url: window.location.origin + '/subscription/cancel',
      },
      subscriber: {
        name: {
          given_name: billingDetails.name.split(' ')[0] || '',
          surname: billingDetails.name.split(' ').slice(1).join(' ') || '',
        },
        email_address: billingDetails.email,
        shipping_address: {
          name: {
            full_name: billingDetails.name,
          },
          address: {
            address_line_1: billingDetails.address.line1,
            admin_area_2: billingDetails.address.city,
            admin_area_1: billingDetails.address.state,
            postal_code: billingDetails.address.postal_code,
            country_code: billingDetails.address.country,
          },
        },
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    setProcessing(true);
    setError(null);

    try {
      // In a real application, you would capture the subscription on your server
      // and then call onSuccess with the subscription details
      
      // Simulate API call to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentDetails = {
        subscriptionId: data.subscriptionID,
        paymentMethodType: 'paypal',
        billingDetails,
        transactionId: `paypal_${Date.now()}`,
        amount: tier.price,
        currency: 'usd',
        paypalOrderId: data.orderID,
      };

      onSuccess(paymentDetails);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your PayPal payment');
    } finally {
      setProcessing(false);
    }
  };

  const onError = (err: any) => {
    console.error('PayPal Error:', err);
    setError('An error occurred with PayPal. Please try again or use a different payment method.');
  };

  const onCancel = (data: any) => {
    console.log('PayPal payment cancelled:', data);
    setError('Payment was cancelled. Please try again.');
  };

  const isLoading = processing || parentLoading || isPending;
  const canProceed = agreeToTerms && billingDetails.name && billingDetails.email && billingDetails.address.line1;

  if (isPending) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Loading PayPal</h3>
          <p className="text-muted-foreground">Please wait while we load PayPal payment options...</p>
        </CardContent>
      </Card>
    );
  }

  if (isRejected) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-medium mb-2">PayPal Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            PayPal is currently unavailable. Please try again later or use a credit card.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-5 h-5 mr-2 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
          PayPal Payment
        </CardTitle>
        <CardDescription>
          Complete your subscription using PayPal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Billing Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Billing Information</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paypal-name">Full Name</Label>
              <Input
                id="paypal-name"
                placeholder="John Doe"
                value={billingDetails.name}
                onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paypal-email">Email Address</Label>
              <Input
                id="paypal-email"
                type="email"
                placeholder="john@example.com"
                value={billingDetails.email}
                onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal-address">Address</Label>
            <Input
              id="paypal-address"
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
              <Label htmlFor="paypal-city">City</Label>
              <Input
                id="paypal-city"
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
              <Label htmlFor="paypal-state">State</Label>
              <Input
                id="paypal-state"
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
              <Label htmlFor="paypal-postal">ZIP Code</Label>
              <Input
                id="paypal-postal"
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

        {/* Terms Agreement */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="paypal-terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
              required
            />
            <Label htmlFor="paypal-terms" className="text-sm">
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

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* PayPal Buttons */}
        {canProceed ? (
          <div className="space-y-4">
            <div className="paypal-button-container">
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'subscribe',
                  height: 48,
                }}
                createSubscription={createSubscription}
                onApprove={onApprove}
                onError={onError}
                onCancel={onCancel}
                disabled={isLoading}
              />
            </div>

            {isLoading && (
              <div className="text-center text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                Processing your PayPal payment...
              </div>
            )}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fill in all required information and agree to the terms to continue with PayPal payment.
            </AlertDescription>
          </Alert>
        )}

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Your payment is processed securely through PayPal. We never see or store your PayPal login information.
          </AlertDescription>
        </Alert>

        {/* Payment Summary */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Monthly Subscription:</span>
            <span className="text-lg font-bold">${(tier.price / 100).toFixed(2)}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Recurring monthly payment via PayPal
          </div>
        </div>

        {/* Security Indicators */}
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            PayPal Protected
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Buyer Protection
          </div>
          <div className="flex items-center">
            <Lock className="w-3 h-3 mr-1" />
            Secure Processing
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayPalPaymentForm;
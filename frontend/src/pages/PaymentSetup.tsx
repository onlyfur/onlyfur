import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface PaymentSetupProps {}

const PaymentSetup: React.FC<PaymentSetupProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId, selectedTier, userEmail, canSkip } = location.state || {};
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('billing.')) {
      const field = name.replace('billing.', '');
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Here you would integrate with a payment processor like Stripe
      const response = await fetch('/api/payments/setup-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          selectedTier,
          paymentMethod: paymentData
        })
      });

      if (response.ok) {
        toast({
          title: "Payment Method Added!",
          description: "Your payment method has been securely saved.",
        });
        
        navigate('/dashboard', { 
          state: { 
            message: 'Payment method added successfully!' 
          } 
        });
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to setup payment method');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Setup Skipped",
      description: "You can add a payment method later in your account settings.",
    });
    
    navigate('/dashboard', { 
      state: { 
        message: 'You can add a payment method later in your account settings.' 
      } 
    });
  };

  const getTierDisplayName = (tier: string) => {
    const tierMap: { [key: string]: string } = {
      'premium-creator': 'Premium Creator',
      'enterprise-creator': 'Enterprise Creator',
      'premium-subscriber': 'Premium Subscriber',
      'enterprise-subscriber': 'Enterprise Subscriber',
      'pro-creator': 'Pro Creator',
      'pro-subscriber': 'Pro Subscriber'
    };
    return tierMap[tier] || tier;
  };

  const getTierPrice = (tier: string) => {
    const priceMap: { [key: string]: string } = {
      'premium-creator': '$19.99/month',
      'enterprise-creator': '$49.99/month',
      'premium-subscriber': '$9.99/month',
      'enterprise-subscriber': '$24.99/month',
      'pro-creator': '$29.99/month',
      'pro-subscriber': '$14.99/month'
    };
    return priceMap[tier] || 'Custom pricing';
  };

  if (!selectedTier || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Invalid Access</h2>
            <p className="text-muted-foreground mb-6">This page requires valid registration data.</p>
            <Button onClick={() => navigate('/register')} className="w-full">
              Back to Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl border-0 bg-background/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CreditCard className="h-12 w-12 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">Setup Payment Method</CardTitle>
            <CardDescription>
              Complete your {getTierDisplayName(selectedTier)} subscription
              <br />
              <span className="font-semibold text-primary">{getTierPrice(selectedTier)}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  type="text"
                  name="cardholderName"
                  value={paymentData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Billing Address</h3>
                
                <Input
                  type="text"
                  name="billing.street"
                  value={paymentData.billingAddress.street}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    name="billing.city"
                    value={paymentData.billingAddress.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                  <Input
                    type="text"
                    name="billing.state"
                    value={paymentData.billingAddress.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    name="billing.zipCode"
                    value={paymentData.billingAddress.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP Code"
                    required
                  />
                  <Input
                    type="text"
                    name="billing.country"
                    value={paymentData.billingAddress.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Processing...' : 'Complete Setup'}
                </Button>

                {canSkip && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    className="w-full"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Skip for Now
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSetup;

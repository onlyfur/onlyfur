import React from 'react';
import { ArrowLeft, CreditCard, Shield, DollarSign, AlertTriangle, CheckCircle, Lock, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const PaymentMethods: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <p className="text-muted-foreground">Managing your payment methods and billing information securely</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Payments</Badge>
          <Badge variant="secondary">Billing</Badge>
          <Badge variant="secondary">Security</Badge>
        </div>
      </div>

      {/* Security Notice */}
      <Alert className="mb-8 border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Secure Payments:</strong> All payment information is encrypted and processed through industry-standard secure payment processors. We never store your full payment details on our servers.
        </AlertDescription>
      </Alert>

      {/* Accepted Payment Methods */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Accepted Payment Methods
          </CardTitle>
          <CardDescription>
            We support multiple secure payment options for your convenience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Credit & Debit Cards</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Visa, Mastercard, American Express</li>
                    <li>• Instant processing for subscriptions</li>
                    <li>• Automatic renewal support</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Digital Wallets</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• PayPal for quick checkout</li>
                    <li>• Apple Pay (iOS devices)</li>
                    <li>• Google Pay (Android devices)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Bank Transfers</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• ACH bank transfers (US)</li>
                    <li>• SEPA transfers (EU)</li>
                    <li>• Processing time: 3-5 business days</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Cryptocurrency</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Bitcoin, Ethereum</li>
                    <li>• Enhanced privacy option</li>
                    <li>• Coming soon...</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adding Payment Methods */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Adding a Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Payment Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Go to your Account Settings and select "Payment Methods" from the billing section.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Choose Payment Type</h4>
                <p className="text-sm text-muted-foreground">
                  Select your preferred payment method from the available options (card, PayPal, etc.).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Enter Payment Details</h4>
                <p className="text-sm text-muted-foreground">
                  Provide the required information securely through our encrypted payment form.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-green-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Verify and Save</h4>
                <p className="text-sm text-muted-foreground">
                  Complete verification (if required) and set as default payment method if desired.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Managing Payment Methods */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Managing Your Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-600 mb-2">Update Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Change expiration dates</li>
                <li>• Update billing addresses</li>
                <li>• Modify cardholder names</li>
                <li>• Switch default payment method</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-600 mb-2">Remove Methods</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Delete unused payment methods</li>
                <li>• Cancel recurring subscriptions first</li>
                <li>• Ensure alternative method is set</li>
                <li>• Immediate effect after confirmation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-600 mb-1">PCI DSS Compliant</h4>
                  <p className="text-sm text-green-700">
                    We follow Payment Card Industry Data Security Standards for maximum protection of your financial information.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-600 mb-1">Encrypted Storage</h4>
                  <p className="text-sm text-blue-700">
                    Payment details are encrypted and tokenized. We only store minimal information necessary for processing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-purple-600 mb-1">Fraud Protection</h4>
                  <p className="text-sm text-purple-700">
                    Advanced fraud detection systems monitor transactions and protect against unauthorized use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Issues?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you're experiencing problems with payments, our support team is here to help resolve any issues quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/support/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help/articles/refund-policy">Refund Policy</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;

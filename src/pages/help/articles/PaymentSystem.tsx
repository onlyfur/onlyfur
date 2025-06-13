import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Shield, DollarSign, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentSystem: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/help">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Center
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="w-6 h-6 text-green-500" />
          <Badge variant="secondary">Payments & Billing</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">How payments work on OnlyFur</h1>
        <p className="text-xl text-muted-foreground">
          Understanding OnlyFur's secure payment system, billing cycles, and how money flows between subscribers and creators.
        </p>
      </div>

      {/* Payment Overview */}
      <Card className="mb-8 bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Secure & Transparent Payment System</h3>
          <p className="text-muted-foreground mb-4">
            OnlyFur uses industry-standard payment processing with bank-level security. All transactions are encrypted and protected, giving both creators and subscribers peace of mind.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Secure Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Multiple Payment Methods</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Automatic Billing</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Instant Payouts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* For Subscribers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
              For Subscribers: How You Pay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Accepted Payment Methods:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Credit & Debit Cards</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Visa, Mastercard, American Express</li>
                    <li>• Discover, JCB, Diners Club</li>
                    <li>• International cards accepted</li>
                    <li>• 3D Secure verification supported</li>
                    <li>• CVV and address verification</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Digital Wallets</h5>
                  <ul className="text-sm space-y-1">
                    <li>• PayPal payments</li>
                    <li>• Apple Pay (iOS devices)</li>
                    <li>• Google Pay (Android devices)</li>
                    <li>• Samsung Pay supported</li>
                    <li>• One-click checkout</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Alternative Methods</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Bank transfers (ACH)</li>
                    <li>• Cryptocurrency (Bitcoin, Ethereum)</li>
                    <li>• Gift cards and prepaid options</li>
                    <li>• Regional payment methods</li>
                    <li>• Student discount programs</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Regional Options</h5>
                  <ul className="text-sm space-y-1">
                    <li>• SEPA (European Union)</li>
                    <li>• iDEAL (Netherlands)</li>
                    <li>• Giropay (Germany)</li>
                    <li>• Sofort (Europe)</li>
                    <li>• Local banking systems</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Billing Cycle Explanation:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Initial Subscription</p>
                  <p className="text-xs text-muted-foreground">Charged immediately upon subscribing. Access granted instantly.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Monthly Renewal</p>
                  <p className="text-xs text-muted-foreground">Automatic renewal on the same date each month (e.g., 15th to 15th)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Renewal Reminders</p>
                  <p className="text-xs text-muted-foreground">Email notification sent 3 days before renewal date</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Failed Payment Grace</p>
                  <p className="text-xs text-muted-foreground">7-day grace period to update payment info if renewal fails</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Payment Security:</strong> OnlyFur never stores your full credit card details. All payment processing is handled by PCI-compliant payment processors with bank-level encryption.</p>
            </div>
          </CardContent>
        </Card>

        {/* For Creators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              For Creators: How You Get Paid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Revenue Share Structure:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <h5 className="font-medium text-green-600 mb-2">Creator Share</h5>
                  <p className="text-3xl font-bold text-green-600">80%</p>
                  <p className="text-sm text-muted-foreground">You keep 80% of all subscription revenue</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h5 className="font-medium text-gray-600 mb-2">Platform Fee</h5>
                  <p className="text-3xl font-bold text-gray-600">20%</p>
                  <p className="text-sm text-muted-foreground">OnlyFur platform and processing fees</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Payout Schedule & Methods:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Weekly Payouts</p>
                  <p className="text-xs text-muted-foreground">Payments processed every Friday for earnings from the previous week</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Minimum Payout</p>
                  <p className="text-xs text-muted-foreground">$50 minimum required for payout (lower amounts roll over to next week)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Payout Methods</p>
                  <p className="text-xs text-muted-foreground">Bank transfer (ACH), PayPal, wire transfer, or cryptocurrency</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">International Creators</p>
                  <p className="text-xs text-muted-foreground">SWIFT wire transfers and PayPal available worldwide</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Earnings Breakdown:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Subscription Revenue</h5>
                  <p className="text-xs text-muted-foreground">Monthly recurring revenue from all subscription tiers</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Tips & Donations</h5>
                  <p className="text-xs text-muted-foreground">One-time payments from supporters (90% creator share)</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Commission Payments</h5>
                  <p className="text-xs text-muted-foreground">Custom work payments (85% creator share)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-500" />
              Payment Security & Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Security Measures:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Data Protection</h5>
                  <ul className="text-sm space-y-1">
                    <li>• PCI DSS Level 1 compliance</li>
                    <li>• 256-bit SSL encryption</li>
                    <li>• Tokenized payment processing</li>
                    <li>• No card details stored on servers</li>
                    <li>• SOC 2 Type II certified</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Fraud Prevention</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Machine learning fraud detection</li>
                    <li>• Real-time transaction monitoring</li>
                    <li>• Device fingerprinting</li>
                    <li>• Velocity checking</li>
                    <li>• Manual review for high-risk transactions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Dispute Resolution Process:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Chargebacks & Disputes</p>
                  <p className="text-xs text-muted-foreground">If a subscriber disputes a charge, OnlyFur handles the chargeback process and provides documentation to protect creators</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Creator Protection</p>
                  <p className="text-xs text-muted-foreground">Creators are protected from frivolous chargebacks with our comprehensive dispute response system</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Resolution Support</p>
                  <p className="text-xs text-muted-foreground">Dedicated support team assists with payment issues and disputes for both creators and subscribers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-blue-500" />
              Managing Your Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">For Subscribers:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Payment Methods</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Add multiple payment methods</li>
                    <li>• Set primary and backup cards</li>
                    <li>• Update expiring cards easily</li>
                    <li>• Remove old payment methods</li>
                    <li>• PayPal account linking</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Subscription Management</h5>
                  <ul className="text-sm space-y-1">
                    <li>• View all active subscriptions</li>
                    <li>• Change subscription tiers</li>
                    <li>• Pause or cancel subscriptions</li>
                    <li>• View billing history</li>
                    <li>• Download payment receipts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">For Creators:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Payout Settings</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Set up bank account details</li>
                    <li>• Configure PayPal payouts</li>
                    <li>• Choose payout frequency</li>
                    <li>• Set minimum payout amounts</li>
                    <li>• Tax information management</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Revenue Tracking</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Real-time earnings dashboard</li>
                    <li>• Monthly revenue reports</li>
                    <li>• Tax document generation</li>
                    <li>• Subscriber analytics</li>
                    <li>• Commission tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Payment Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Payment Issues:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Card Declined</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Common causes: Insufficient funds, expired card, incorrect billing address, bank security block</p>
                    <p><strong>Solution:</strong> Check card details, contact your bank, try alternative payment method</p>
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Payment Processing Delays</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Bank transfers and international payments may take 1-3 business days</p>
                    <p><strong>Solution:</strong> Allow processing time, check spam folder for confirmation emails</p>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Subscription Not Renewing</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Auto-renewal may fail due to expired or maxed-out cards</p>
                    <p><strong>Solution:</strong> Update payment method in account settings, manually renew if needed</p>
                  </div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Payout Delays (Creators)</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Bank details incorrect, minimum payout not reached, tax information missing</p>
                    <p><strong>Solution:</strong> Verify payout settings, complete tax forms, contact support</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Getting Help with Payments:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Self-Service Options</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Check payment status in account settings</li>
                    <li>• Review billing history and receipts</li>
                    <li>• Update payment methods</li>
                    <li>• Access FAQ and troubleshooting guides</li>
                    <li>• Use the payment troubleshooter tool</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Contact Support</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Live chat for immediate assistance</li>
                    <li>• Email support with transaction details</li>
                    <li>• Phone support for urgent payment issues</li>
                    <li>• Submit support tickets with screenshots</li>
                    <li>• Creator success team for payout issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Payments */}
        <Card>
          <CardHeader>
            <CardTitle>International Payments & Currency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Multi-Currency Support:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">Primary Currencies</h5>
                  <ul className="text-xs space-y-1">
                    <li>• USD (United States Dollar)</li>
                    <li>• EUR (Euro)</li>
                    <li>• GBP (British Pound)</li>
                    <li>• CAD (Canadian Dollar)</li>
                    <li>• AUD (Australian Dollar)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Regional Currencies</h5>
                  <ul className="text-xs space-y-1">
                    <li>• JPY (Japanese Yen)</li>
                    <li>• CHF (Swiss Franc)</li>
                    <li>• SEK (Swedish Krona)</li>
                    <li>• NOK (Norwegian Krone)</li>
                    <li>• DKK (Danish Krone)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Emerging Markets</h5>
                  <ul className="text-xs space-y-1">
                    <li>• BRL (Brazilian Real)</li>
                    <li>• MXN (Mexican Peso)</li>
                    <li>• PLN (Polish Zloty)</li>
                    <li>• CZK (Czech Koruna)</li>
                    <li>• HUF (Hungarian Forint)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Exchange Rates & Fees:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Real-Time Exchange Rates</p>
                  <p className="text-xs text-muted-foreground">Rates updated every 15 minutes based on interbank rates with minimal markup</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Transparent Conversion Fees</p>
                  <p className="text-xs text-muted-foreground">2.5% currency conversion fee for international transactions, clearly displayed before payment</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Local Currency Pricing</p>
                  <p className="text-xs text-muted-foreground">Creators can set prices in their local currency, automatically converted for international subscribers</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tax Considerations:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-orange-600 mb-2">For Creators</h5>
                  <ul className="text-sm space-y-1">
                    <li>• US creators receive 1099-NEC forms</li>
                    <li>• International creators get year-end summaries</li>
                    <li>• VAT handling for EU creators</li>
                    <li>• Tax treaty benefits where applicable</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">For Subscribers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• VAT added for EU subscribers</li>
                    <li>• GST for Australian subscribers</li>
                    <li>• Local tax compliance maintained</li>
                    <li>• Clear tax breakdowns on receipts</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Articles */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/subscription-management" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Subscription renewal and cancellation</h4>
              <p className="text-sm text-muted-foreground mt-1">Manage your subscription settings</p>
            </Link>
            <Link to="/help/articles/custom-commissions" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Custom content and commissions</h4>
              <p className="text-sm text-muted-foreground mt-1">Understanding commission payments</p>
            </Link>
            <Link to="/help/articles/understanding-analytics" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding creator analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">Track your revenue and earnings</p>
            </Link>
            <Link to="/help/articles/account-security" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Account security best practices</h4>
              <p className="text-sm text-muted-foreground mt-1">Protect your payment information</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-green-500 to-blue-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Payment Issues?</h3>
          <p className="mb-4 opacity-90">Our payment support team is available 24/7 to help resolve any billing or payout issues.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Payment Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSystem;
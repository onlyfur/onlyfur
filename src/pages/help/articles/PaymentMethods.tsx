import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Shield, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Lock,
  RefreshCw,
  Globe,
  Smartphone,
  Building2,
  Receipt,
  Eye,
  Calendar,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentMethods: React.FC = () => {
  const paymentMethods = [
    {
      name: "Credit/Debit Cards",
      icon: <CreditCard className="h-8 w-8" />,
      supported: ["Visa", "Mastercard", "American Express", "Discover"],
      processingTime: "Instant",
      fees: "No additional fees",
      regions: "Worldwide",
      description: "Most popular and convenient payment method",
      color: "bg-blue-500"
    },
    {
      name: "PayPal",
      icon: <Globe className="h-8 w-8" />,
      supported: ["PayPal Balance", "Linked Cards", "Bank Account"],
      processingTime: "Instant",
      fees: "No additional fees",
      regions: "190+ countries",
      description: "Secure payments without sharing card details",
      color: "bg-indigo-500"
    },
    {
      name: "Apple Pay",
      icon: <Smartphone className="h-8 w-8" />,
      supported: ["iPhone", "iPad", "Mac", "Apple Watch"],
      processingTime: "Instant",
      fees: "No additional fees",
      regions: "60+ countries",
      description: "Quick and secure payments on Apple devices",
      color: "bg-gray-800"
    },
    {
      name: "Google Pay",
      icon: <Smartphone className="h-8 w-8" />,
      supported: ["Android", "Chrome Browser", "Wear OS"],
      processingTime: "Instant",
      fees: "No additional fees",
      regions: "40+ countries",
      description: "Fast checkout with Google account",
      color: "bg-green-500"
    },
    {
      name: "Bank Transfer",
      icon: <Building2 className="h-8 w-8" />,
      supported: ["ACH", "Wire Transfer", "SEPA"],
      processingTime: "1-3 business days",
      fees: "May apply",
      regions: "Select countries",
      description: "Direct bank-to-bank transfers",
      color: "bg-orange-500"
    }
  ];

  const billingCycles = [
    {
      period: "Monthly",
      description: "Billed every month on the same date",
      bestFor: "Trying out the platform or flexibility",
      example: "Subscribed on Jan 15th = Next billing Feb 15th"
    },
    {
      period: "Quarterly",
      description: "Billed every 3 months with 5% discount",
      bestFor: "Regular users who want some savings",
      example: "3 months for the price of 2.85 months"
    },
    {
      period: "Annual",
      description: "Billed yearly with 15% discount",
      bestFor: "Committed users who want maximum savings",
      example: "12 months for the price of 10.2 months"
    }
  ];

  const securityFeatures = [
    {
      feature: "PCI DSS Compliance",
      description: "Highest level of payment card data security",
      icon: <Shield className="h-6 w-6" />
    },
    {
      feature: "SSL Encryption",
      description: "256-bit encryption for all payment data",
      icon: <Lock className="h-6 w-6" />
    },
    {
      feature: "3D Secure Authentication",
      description: "Additional verification for card payments",
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      feature: "Fraud Detection",
      description: "AI-powered fraud prevention system",
      icon: <Eye className="h-6 w-6" />
    }
  ];

  const troubleshooting = [
    {
      issue: "Payment Declined",
      causes: [
        "Insufficient funds in account",
        "Card expired or incorrect details",
        "Bank blocking online transactions",
        "International transaction restrictions"
      ],
      solutions: [
        "Check account balance and card details",
        "Contact your bank to authorize the transaction",
        "Try a different payment method",
        "Update expired card information"
      ]
    },
    {
      issue: "Double Billing",
      causes: [
        "Browser refresh during checkout",
        "Multiple payment attempts",
        "System processing delay"
      ],
      solutions: [
        "Check your account for duplicate charges",
        "Contact support for immediate refund",
        "Wait 24 hours for system to automatically resolve",
        "Use different payment method for future purchases"
      ]
    },
    {
      issue: "Failed Recurring Payment",
      causes: [
        "Card expired or canceled",
        "Insufficient funds",
        "Bank declined automatic charge",
        "Payment method removed"
      ],
      solutions: [
        "Update payment method in account settings",
        "Ensure sufficient funds before billing date",
        "Contact bank about recurring payment authorization",
        "Manually retry payment in account settings"
      ]
    }
  ];

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", regions: "United States, Global" },
    { code: "EUR", name: "Euro", symbol: "€", regions: "European Union" },
    { code: "GBP", name: "British Pound", symbol: "£", regions: "United Kingdom" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", regions: "Canada" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", regions: "Australia" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", regions: "Japan" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full mb-6">
            <CreditCard className="h-5 w-5" />
            <span className="font-semibold">Payment Guide</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Payment Methods & Billing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Learn about accepted payment methods, billing cycles, security features, and how to manage 
            your payments on OnlyFur platform.
          </p>
        </div>

        {/* Security Alert */}
        <Alert className="mb-12 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Security First:</strong> All payments are processed through industry-leading secure payment 
            processors. We never store your complete card details on our servers.
          </AlertDescription>
        </Alert>

        {/* Accepted Payment Methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Accepted Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <Card key={method.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`mx-auto p-4 rounded-full text-white w-fit mb-4 ${method.color}`}>
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Supported Options:</h4>
                      <div className="flex flex-wrap gap-1">
                        {method.supported.map((option, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-muted-foreground mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          Processing
                        </div>
                        <div className="font-medium">{method.processingTime}</div>
                      </div>
                      <div>
                        <div className="flex items-center text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Fees
                        </div>
                        <div className="font-medium">{method.fees}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1 text-sm">
                        <Globe className="h-4 w-4 mr-1" />
                        Availability
                      </div>
                      <div className="text-sm font-medium">{method.regions}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Supported Currencies */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-3 h-6 w-6 text-primary" />
              Supported Currencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currencies.map((currency, index) => (
                <div key={currency.code} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">{currency.code}</div>
                    <div className="text-sm text-muted-foreground">{currency.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{currency.symbol}</div>
                    <div className="text-xs text-muted-foreground">{currency.regions}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing Cycles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Billing Cycles & Savings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {billingCycles.map((cycle, index) => (
              <Card key={cycle.period} className={`hover:shadow-lg transition-shadow ${index === 2 ? 'ring-2 ring-green-500' : ''}`}>
                {index === 2 && (
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-center py-2 text-sm font-semibold">
                    Best Value
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mx-auto mb-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{cycle.period}</CardTitle>
                  <p className="text-muted-foreground">{cycle.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Best For:</h4>
                      <p className="text-sm text-muted-foreground">{cycle.bestFor}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Example:</h4>
                      <p className="text-sm text-muted-foreground">{cycle.example}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <Card className="mb-16 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
              <Shield className="mr-3 h-6 w-6" />
              Payment Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.feature}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Common Payment Issues</h2>
          <div className="space-y-6">
            {troubleshooting.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <AlertTriangle className="mr-3 h-5 w-5" />
                    {item.issue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-orange-600">Common Causes:</h4>
                      <ul className="space-y-1">
                        {item.causes.map((cause, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="mr-2 mt-1">•</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Solutions:</h4>
                      <ul className="space-y-1">
                        {item.solutions.map((solution, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Management Tips */}
        <Card className="mb-16 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
              <Receipt className="mr-3 h-6 w-6" />
              Payment Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">✅ Best Practices:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Keep payment methods up to date
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Set up backup payment methods
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Monitor billing statements regularly
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Enable billing notifications
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300">❌ Common Mistakes:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Using expired or invalid cards
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Not updating billing address changes
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Ignoring failed payment notifications
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Using public Wi-Fi for payments
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Payment Support?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Our support team is available 24/7 to help with payment issues, billing questions, 
              and account management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-green-600 hover:text-green-700" asChild>
                <Link to="/contact">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
                <Link to="/settings/billing">
                  <Receipt className="mr-2 h-5 w-5" />
                  Manage Billing
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6 text-center">Related Help Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <RefreshCw className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Subscription Management</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Learn how to upgrade, downgrade, or cancel subscriptions.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/subscription-management">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Receipt className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Billing History</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Access and download your billing statements and invoices.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/billing-history">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Refunds & Disputes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Understand our refund policy and how to dispute charges.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/refunds-disputes">Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;

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
  Info,
  ArrowLeft
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
          <CreditCard className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Billing & Payments</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Payment methods & billing</h1>
        <p className="text-xl text-muted-foreground">
          Learn about accepted payment methods, billing cycles, security features, and how to manage 
          your payments on OnlyFur platform.
        </p>
      </div>

      {/* Security Alert */}
      <Alert className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Security First:</strong> All payments are processed through industry-leading secure payment 
          processors. We never store your complete card details on our servers.
        </AlertDescription>
      </Alert>

      {/* Accepted Payment Methods */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-3 h-6 w-6 text-blue-500" />
            Accepted Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={method.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className={`p-3 rounded-full text-white mr-3 ${method.color}`}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Supported Options:</h4>
                    <div className="flex flex-wrap gap-1">
                      {method.supported.map((option, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Processing
                      </div>
                      <div className="text-sm">{method.processingTime}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1 text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Fees
                      </div>
                      <div className="text-sm">{method.fees}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-muted-foreground mb-1 text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      Availability
                    </div>
                    <div className="text-sm">{method.regions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supported Currencies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-3 h-6 w-6 text-green-500" />
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-3 h-6 w-6 text-purple-500" />
            Billing Cycles & Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {billingCycles.map((cycle, index) => (
              <div key={cycle.period} className={`border rounded-lg p-4 ${index === 2 ? 'ring-2 ring-green-500' : ''}`}>
                {index === 2 && (
                  <div className="bg-green-500 text-white text-center py-1 px-2 text-xs font-semibold rounded-full w-fit mb-2">
                    Best Value
                  </div>
                )}
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">{cycle.period}</h3>
                  <p className="text-sm text-muted-foreground">{cycle.description}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Best For:</h4>
                    <p className="text-sm text-muted-foreground">{cycle.bestFor}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Example:</h4>
                    <p className="text-sm text-muted-foreground">{cycle.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-3 h-6 w-6 text-orange-500" />
            Common Payment Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {troubleshooting.map((item, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="font-semibold mb-3">{item.issue}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-orange-600">Common Causes:</h4>
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
                    <h4 className="font-medium text-sm mb-2 text-green-600">Solutions:</h4>
                    <ul className="space-y-1">
                      {item.solutions.map((solution, idx) => (
                        <li key={idx} className="text-sm flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Management Tips */}
      <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
            <Receipt className="mr-3 h-6 w-6" />
            Payment Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-3 text-green-700 dark:text-green-300">✅ Best Practices:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  Keep payment methods up to date
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  Set up backup payment methods
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  Monitor billing statements regularly
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  Enable billing notifications
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3 text-red-700 dark:text-red-300">❌ Common Mistakes:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                  Using expired or invalid cards
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                  Not updating billing address changes
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                  Ignoring failed payment notifications
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                  Using public Wi-Fi for payments
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Need Payment Support?</h3>
              <p className="text-muted-foreground">
                Our support team is available 24/7 to help with payment issues and billing questions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="default" size="sm" asChild>
                <Link to="/contact">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/settings/billing">
                  <Receipt className="mr-2 h-4 w-4" />
                  Manage Billing
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;

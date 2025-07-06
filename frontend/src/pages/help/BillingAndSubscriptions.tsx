import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Lock, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Users,
  Star,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BillingAndSubscriptions: React.FC = () => {
  const subscriptionTiers = [
    {
      name: 'Free Tier',
      price: '$0',
      period: 'month',
      features: [
        'Browse public content',
        'Follow creators',
        'Basic messaging',
        'Community participation'
      ],
      color: 'border-gray-200'
    },
    {
      name: 'Basic Subscriber',
      price: '$9.99',
      period: 'month',
      features: [
        'Access to subscriber-only content',
        'Early access to new posts',
        'Priority support',
        'Enhanced messaging features'
      ],
      color: 'border-blue-200'
    },
    {
      name: 'Pro Subscriber',
      price: '$19.99',
      period: 'month',
      features: [
        'All Basic features',
        'Access to premium content',
        'Download content for offline viewing',
        'Exclusive creator interactions',
        'Beta feature access'
      ],
      color: 'border-purple-200'
    }
  ];

  const paymentMethods = [
    {
      name: 'Credit/Debit Cards',
      icon: CreditCard,
      supported: ['Visa', 'Mastercard', 'American Express', 'Discover'],
      description: 'Secure payments processed by Stripe'
    },
    {
      name: 'PayPal',
      icon: Shield,
      supported: ['PayPal Balance', 'Linked Bank Account', 'PayPal Credit'],
      description: 'Pay securely with your PayPal account'
    },
    {
      name: 'Digital Wallets',
      icon: DollarSign,
      supported: ['Apple Pay', 'Google Pay', 'Samsung Pay'],
      description: 'Quick checkout with your preferred wallet'
    }
  ];

  const billingFAQs = [
    {
      question: 'When will I be charged?',
      answer: 'Subscriptions are billed on the date you subscribe and then monthly on the same date. For annual subscriptions, you\'re charged immediately for the full year.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time from your subscription settings. You\'ll continue to have access until the end of your current billing period.'
    },
    {
      question: 'What happens if my payment fails?',
      answer: 'We\'ll retry the payment several times over a few days. If payment continues to fail, your subscription will be paused and you\'ll lose access to premium features until payment is resolved.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Refunds are handled on a case-by-case basis. Please contact support if you believe you\'re entitled to a refund. Generally, partial refunds may be available for unused portions of annual subscriptions.'
    },
    {
      question: 'How secure are my payment details?',
      answer: 'We use industry-standard encryption and work with trusted payment processors like Stripe and PayPal. We never store your full credit card information on our servers.'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Billing & Subscriptions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about payments, subscriptions, and billing on OnlyFur
        </p>
      </div>

      {/* Subscription Tiers */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Subscription Tiers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {subscriptionTiers.map((tier, index) => (
            <Card key={index} className={`${tier.color} relative`}>
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="text-2xl font-bold">
                  {tier.price}
                  <span className="text-sm font-normal text-muted-foreground">/{tier.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-primary" />
            Accepted Payment Methods
          </CardTitle>
          <CardDescription>
            We support multiple secure payment options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="grow">
                  <h3 className="font-semibold mb-1">{method.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {method.supported.map((option, optionIndex) => (
                      <Badge key={optionIndex} variant="secondary" className="text-xs">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-primary" />
            Managing Your Billing
          </CardTitle>
          <CardDescription>
            How to view and manage your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/billing">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Billing History
                </Button>
              </Link>
              <Link to="/subscription-settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Subscription Settings
                </Button>
              </Link>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You can view your current subscription status, billing history, and manage payment methods in your account settings.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What You Get with Each Tier</CardTitle>
          <CardDescription>
            Compare features across subscription levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-center py-2">Free</th>
                  <th className="text-center py-2">Basic</th>
                  <th className="text-center py-2">Pro</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-2">Browse public content</td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Subscriber-only content</td>
                  <td className="text-center"><XCircle className="w-4 h-4 mx-auto text-red-500" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Download content</td>
                  <td className="text-center"><XCircle className="w-4 h-4 mx-auto text-red-500" /></td>
                  <td className="text-center"><XCircle className="w-4 h-4 mx-auto text-red-500" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Priority support</td>
                  <td className="text-center"><XCircle className="w-4 h-4 mx-auto text-red-500" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                </tr>
                <tr>
                  <td className="py-2">Beta features</td>
                  <td className="text-center"><XCircle className="w-4 h-4 mx-auto text-red-500" /></td>
                  <td className="text-center"><XCircle className="w-4 h-4 mx-auto text-red-500" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 mx-auto text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/10">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Your payment information is secure.</strong> We use industry-standard encryption and work with trusted payment processors. We never store your full payment details on our servers.
        </AlertDescription>
      </Alert>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Common questions about billing and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {billingFAQs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Still have questions about billing or subscriptions?
            </p>
            <Link to="/contact">
              <Button variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingAndSubscriptions;

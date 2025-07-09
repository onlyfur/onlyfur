import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy: React.FC = () => {
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
          <Badge variant="secondary">Billing & Subscriptions</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
        <p className="text-xl text-muted-foreground">
          Understanding the refund policy on OnlyFur.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>When Are Refunds Issued?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            <li>Refunds are generally only issued in cases of accidental duplicate charges or technical errors.</li>
            <li>Subscription payments are non-refundable once content has been accessed.</li>
            <li>Chargebacks or payment disputes may result in account suspension.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Request a Refund</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Contact support at <a href="mailto:support@onlyfur.net" className="text-blue-600 underline">support@onlyfur.net</a> with your account details and transaction ID.</li>
            <li>Explain the reason for your refund request.</li>
            <li>Our team will review your request and respond within 3 business days.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            <li>Refunds are not guaranteed and are evaluated on a case-by-case basis.</li>
            <li>Repeated refund requests may result in account review.</li>
            <li>For more information, see our <Link to="/help/articles/terms-of-service" className="text-blue-600 underline">Terms of Service</Link>.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundPolicy;

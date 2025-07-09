import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionManagement: React.FC = () => {
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
          <Settings className="w-6 h-6 text-gray-700" />
          <Badge variant="secondary">Billing & Subscriptions</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Subscription Management</h1>
        <p className="text-xl text-muted-foreground">
          How to manage your subscriptions, billing, and payment methods on OnlyFur.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Managing Your Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal ml-6 space-y-2">
            <li>
              Go to your account dashboard and select{' '}
              <strong>Subscriptions</strong>.
            </li>
            <li>View your active subscriptions and their renewal dates.</li>
            <li>
              To cancel, click{' '}
              <strong>Cancel Subscription</strong> next to the creator or tier.
            </li>
            <li>
              To upgrade or downgrade, select a different tier and confirm the
              change.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Updating Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal ml-6 space-y-2">
            <li>
              Navigate to <strong>Billing Settings</strong> in your account.
            </li>
            <li>
              Add a new payment method or update existing details.
            </li>
            <li>Remove old payment methods if needed.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              You can cancel your subscription at any time; access remains until
              the end of the billing period.
            </li>
            <li>
              For payment issues, contact{' '}
              <a
                href="mailto:support@onlyfur.net"
                className="text-blue-600 underline"
              >
                support@onlyfur.net
              </a>
              .
            </li>
            <li>
              Refunds are handled according to our{' '}
              <Link
                to="/help/articles/refund-policy"
                className="text-blue-600 underline"
              >
                Refund Policy
              </Link>
              .
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;

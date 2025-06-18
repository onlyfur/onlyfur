import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FirstSubscription() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your First Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <p>What to expect when subscribing to a creator for the first time.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

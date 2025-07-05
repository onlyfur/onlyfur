import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentSystem() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How Payments Work</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Understanding the OnlyFur payment system and security.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

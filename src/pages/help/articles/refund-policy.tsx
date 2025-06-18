import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPolicy() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Refund Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Guidelines on refunds and how to request them.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

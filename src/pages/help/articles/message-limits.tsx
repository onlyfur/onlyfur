import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MessageLimits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Limits</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Understanding messaging restrictions by subscription tier.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

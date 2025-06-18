import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgeVerification() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Age Verification Process</CardTitle>
      </CardHeader>
      <CardContent>
        <p>How to verify your age to access adult content.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

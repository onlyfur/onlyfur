import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TaxInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Information for Creators</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Important tax considerations for creators.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

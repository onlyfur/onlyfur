import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MobileApp() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile App</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Guide to using the OnlyFur mobile application.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

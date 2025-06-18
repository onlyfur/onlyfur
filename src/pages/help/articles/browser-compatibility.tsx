import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BrowserCompatibility() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Browser Compatibility</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Supported browsers and technical requirements.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

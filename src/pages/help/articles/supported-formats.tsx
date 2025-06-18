import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportedFormats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supported Formats</CardTitle>
      </CardHeader>
      <CardContent>
        <p>File formats and sizes supported on OnlyFur.</p>
        {/* Add detailed instructions here */}
      </CardContent>
    </Card>
  );
}

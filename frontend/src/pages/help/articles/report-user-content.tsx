import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportUserContent: React.FC = () => {
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
          <Flag className="w-6 h-6 text-red-500" />
          <Badge variant="secondary">Safety & Privacy</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Report User Content</h1>
        <p className="text-xl text-muted-foreground">
          How to report inappropriate user content or behavior on OnlyFur.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>When to Report Content</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            <li>Content that violates community guidelines (hate speech, harassment, illegal material).</li>
            <li>Spam, scams, or fraudulent activity.</li>
            <li>Impersonation or copyright infringement.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Report</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Click the <strong>Report</strong> button on the content or user profile.</li>
            <li>Select the reason for your report and provide any additional details.</li>
            <li>Submit the report. Our moderation team will review it promptly.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            <li>Our team investigates all reports confidentially.</li>
            <li>Appropriate action is taken based on the severity and evidence.</li>
            <li>You may be contacted for more information if needed.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportUserContent;

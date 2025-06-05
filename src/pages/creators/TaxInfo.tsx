import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertTriangle, Calculator, BookOpen } from 'lucide-react';

const TaxInfo: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tax Information for Creators</h1>
        <p className="text-lg text-muted-foreground">
          Important tax considerations for content creators
        </p>
      </div>

      <Alert className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          <strong>Disclaimer:</strong> This information is for educational purposes only. Always consult with a qualified tax professional for advice specific to your situation.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-6 h-6 mr-3 text-primary" />
              Income Reporting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Creator earnings on OnlyFur are considered self-employment income and must be reported on your tax return.
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Report all earnings, including subscriptions, tips, and custom content</li>
              <li>• Keep detailed records of all income received</li>
              <li>• You'll receive a 1099 form if you earn over $600 in a calendar year</li>
              <li>• Consider quarterly estimated tax payments if earning substantial income</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-6 h-6 mr-3 text-primary" />
              Deductible Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              As a content creator, you may be able to deduct legitimate business expenses:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Equipment purchases (cameras, lighting, computers)</li>
              <li>• Software subscriptions and platform fees</li>
              <li>• Professional services (photography, editing)</li>
              <li>• Business-related travel and convention expenses</li>
              <li>• Home office expenses (if using part of home exclusively for business)</li>
              <li>• Costumes and props used for content creation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-primary" />
              Record Keeping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Good record keeping is essential for accurate tax reporting:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Save all receipts for business-related purchases</li>
              <li>• Track income from all sources</li>
              <li>• Maintain records for at least 3-7 years</li>
              <li>• Use accounting software or spreadsheets to organize finances</li>
              <li>• Separate business and personal expenses</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Professional Help</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Consider working with a tax professional who understands creator businesses, especially if you have complex situations or earn significant income. They can help ensure you're taking advantage of all available deductions while staying compliant with tax laws.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxInfo;

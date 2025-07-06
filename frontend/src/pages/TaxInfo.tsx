import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, FileText, Calculator, Globe, Phone } from 'lucide-react';

export default function TaxInfo() {
  const taxCategories = [
    {
      title: 'Income Reporting',
      icon: <Calculator className="w-5 h-5" />,
      content: [
        'All earnings from subscriptions, tips, and sales must be reported as income',
        'Keep detailed records of all payments received through the platform',
        'You may receive a 1099 form if you earn over $600 in a calendar year',
        'International creators should consult local tax authorities for reporting requirements'
      ]
    },
    {
      title: 'Business Expenses',
      icon: <FileText className="w-5 h-5" />,
      content: [
        'Equipment purchases (cameras, lighting, computers) may be deductible',
        'Internet and phone bills (portion used for business) can be claimed',
        'Marketing and promotional expenses are typically deductible',
        'Professional services (legal, accounting) are business expenses'
      ]
    },
    {
      title: 'Record Keeping',
      icon: <Globe className="w-5 h-5" />,
      content: [
        'Maintain detailed records of all income and expenses',
        'Save receipts for all business-related purchases',
        'Track mileage for business travel and meetings',
        'Keep records for at least 3-7 years depending on your jurisdiction'
      ]
    }
  ];

  const forms = [
    { name: 'Form 1099-NEC', description: 'Reports non-employee compensation over $600', region: 'US' },
    { name: 'Schedule C', description: 'Used to report business income and expenses', region: 'US' },
    { name: 'Form 1040', description: 'Individual income tax return', region: 'US' },
    { name: 'Quarterly Taxes', description: 'Estimated tax payments due quarterly', region: 'US' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tax Information for Creators</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Important tax considerations and guidelines for content creators earning income on our platform
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important Disclaimer</h3>
                <p className="text-amber-700 text-sm">
                  This information is for general guidance only and should not be considered professional tax advice. 
                  Tax laws vary by jurisdiction and individual circumstances. Please consult with a qualified tax 
                  professional or accountant for advice specific to your situation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Categories */}
        <div className="space-y-6 mb-8">
          {taxCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Tax Forms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Common Tax Forms (US)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forms.map((form, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{form.name}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {form.region}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{form.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quarterly Tax Calendar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>US Quarterly Tax Due Dates 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-600 mb-1">Q1 2025</div>
                <div className="text-sm text-gray-600">Due: April 15, 2025</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="font-bold text-green-600 mb-1">Q2 2025</div>
                <div className="text-sm text-gray-600">Due: June 16, 2025</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="font-bold text-yellow-600 mb-1">Q3 2025</div>
                <div className="text-sm text-gray-600">Due: September 15, 2025</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="font-bold text-purple-600 mb-1">Q4 2025</div>
                <div className="text-sm text-gray-600">Due: January 15, 2026</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Considerations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              International Creators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Tax Treaty Benefits</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Many countries have tax treaties with the US that may reduce or eliminate withholding taxes. 
                  Check if your country has a tax treaty and complete the appropriate forms.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Required Forms</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Form W-8BEN for individual foreign creators</li>
                  <li>• Form W-8BEN-E for foreign entities</li>
                  <li>• Form 1042-S for reporting US source income</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Local Reporting</h4>
                <p className="text-sm text-gray-600">
                  You must also report your earnings to your local tax authority according to your country's laws. 
                  Consult with a local tax professional familiar with international income reporting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Getting Professional Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">When to Consult a Professional</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You earn more than $400 in self-employment income</li>
                  <li>• You have complex deductions or multiple income sources</li>
                  <li>• You're an international creator with US earnings</li>
                  <li>• You're unsure about quarterly payment requirements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• IRS.gov for official US tax information</li>
                  <li>• Local tax authority websites for your jurisdiction</li>
                  <li>• Certified Public Accountants (CPAs)</li>
                  <li>• Tax preparation software with creator-specific features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

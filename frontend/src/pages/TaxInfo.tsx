import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertTriangle, FileText, Calculator, Globe, Phone, DollarSign, CheckCircle } from 'lucide-react';

export default function TaxInfo() {
  const taxCategories = [
    {
      title: 'Income Reporting',
      icon: Calculator,
      content: [
        'All earnings from subscriptions, tips, and sales must be reported as income',
        'Keep detailed records of all payments received through the platform',
        'You may receive a 1099 form if you earn over $600 in a calendar year',
        'International creators should consult local tax authorities for reporting requirements'
      ]
    },
    {
      title: 'Business Expenses',
      icon: FileText,
      content: [
        'Equipment purchases (cameras, lighting, computers) may be deductible',
        'Internet and phone bills (portion used for business) can be claimed',
        'Marketing and promotional expenses are typically deductible',
        'Professional services (legal, accounting) are business expenses'
      ]
    },
    {
      title: 'Record Keeping',
      icon: Globe,
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

  const quarterlyDates = [
    { quarter: 'Q1 2025', date: 'April 15, 2025', color: 'blue' },
    { quarter: 'Q2 2025', date: 'June 16, 2025', color: 'green' },
    { quarter: 'Q3 2025', date: 'September 15, 2025', color: 'yellow' },
    { quarter: 'Q4 2025', date: 'January 15, 2026', color: 'purple' }
  ];

  const internationalInfo = [
    {
      title: 'Tax Treaty Benefits',
      description: 'Many countries have tax treaties with the US that may reduce or eliminate withholding taxes. Check if your country has a tax treaty and complete the appropriate forms.'
    },
    {
      title: 'Required Forms',
      items: [
        'Form W-8BEN for individual foreign creators',
        'Form W-8BEN-E for foreign entities',
        'Form 1042-S for reporting US source income'
      ]
    },
    {
      title: 'Local Reporting',
      description: 'You must also report your earnings to your local tax authority according to your country\'s laws. Consult with a local tax professional familiar with international income reporting.'
    }
  ];

  const professionalHelp = {
    when: [
      'You earn more than $400 in self-employment income',
      'You have complex deductions or multiple income sources',
      'You\'re an international creator with US earnings',
      'You\'re unsure about quarterly payment requirements'
    ],
    resources: [
      'IRS.gov for official US tax information',
      'Local tax authority websites for your jurisdiction',
      'Certified Public Accountants (CPAs)',
      'Tax preparation software with creator-specific features'
    ]
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full mb-6">
          <DollarSign className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Tax Information</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
          Tax Information for Creators
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Important tax considerations and guidelines for content creators earning income on our platform. 
          Stay compliant and maximize your deductions.
        </p>
      </div>

      {/* Important Notice */}
      <div className="mb-16">
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Important Disclaimer:</strong> This information is for general guidance only and should not be considered professional tax advice. 
            Tax laws vary by jurisdiction and individual circumstances. Please consult with a qualified tax 
            professional or accountant for advice specific to your situation.
          </AlertDescription>
        </Alert>
      </div>

      {/* Tax Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Key Tax Considerations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {taxCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <category.icon className="w-5 h-5 mr-3 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0"></div>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Common Tax Forms */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Common Tax Forms (US)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {forms.map((form, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{form.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900/20 dark:text-blue-300">
                    {form.region}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{form.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quarterly Tax Calendar */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">US Quarterly Tax Due Dates 2025</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {quarterlyDates.map((quarter, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full bg-${quarter.color}-100 dark:bg-${quarter.color}-900/20 flex items-center justify-center mx-auto mb-4`}>
                  <Calculator className={`w-6 h-6 text-${quarter.color}-600`} />
                </div>
                <h3 className="font-bold mb-1">{quarter.quarter}</h3>
                <p className="text-sm text-muted-foreground">Due: {quarter.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* International Considerations */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">International Creators</h2>
        <div className="space-y-6">
          {internationalInfo.map((info, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Globe className="w-5 h-5 mr-3 text-primary" />
                  {info.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {info.description && (
                  <p className="text-muted-foreground mb-4">{info.description}</p>
                )}
                {info.items && (
                  <ul className="space-y-2">
                    {info.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Professional Help */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Getting Professional Help</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Phone className="w-5 h-5 mr-3 text-primary" />
                When to Consult a Professional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {professionalHelp.when.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-3 text-primary" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {professionalHelp.resources.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

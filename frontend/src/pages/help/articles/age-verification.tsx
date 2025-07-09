import React from 'react';
import { ArrowLeft, Shield, CheckCircle, Clock, AlertTriangle, FileText, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const AgeVerification: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Age Verification</h1>
            <p className="text-muted-foreground">Protecting our community through responsible age verification</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Privacy</Badge>
          <Badge variant="secondary">Legal Compliance</Badge>
          <Badge variant="secondary">Safety</Badge>
        </div>
      </div>

      {/* Important Notice */}
      <Alert className="mb-8 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> Age verification is required to access adult content on OnlyFur. This process helps us comply with legal requirements and protect minors.
        </AlertDescription>
      </Alert>

      {/* Why Age Verification */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Why Age Verification is Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            OnlyFur takes the safety of our community seriously. Age verification serves several important purposes:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Legal Compliance</h4>
              <ul className="space-y-2 text-sm">
                <li>• Compliance with international age verification laws</li>
                <li>• Protection against underage access to adult content</li>
                <li>• Meeting platform regulatory requirements</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">Community Safety</h4>
              <ul className="space-y-2 text-sm">
                <li>• Creating a safer environment for all users</li>
                <li>• Reducing risk of inappropriate interactions</li>
                <li>• Building trust within the community</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Process */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            How to Verify Your Age
          </CardTitle>
          <CardDescription>
            Follow these steps to complete your age verification quickly and securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">1</div>
              <div>
                <h4 className="font-semibold mb-2">Access Verification Settings</h4>
                <p className="text-muted-foreground mb-2">Navigate to your account settings and locate the "Age Verification" section.</p>
                <p className="text-sm text-blue-600">Account Settings → Privacy & Security → Age Verification</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">2</div>
              <div>
                <h4 className="font-semibold mb-2">Prepare Your Documents</h4>
                <p className="text-muted-foreground mb-2">Gather one of the following government-issued photo identification documents:</p>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">Accepted Documents:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Driver's License</li>
                      <li>• Passport</li>
                      <li>• National ID Card</li>
                      <li>• State ID Card</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">Requirements:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Clear, legible photo</li>
                      <li>• All corners visible</li>
                      <li>• No glare or shadows</li>
                      <li>• Current and valid</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">3</div>
              <div>
                <h4 className="font-semibold mb-2">Upload Your Document</h4>
                <p className="text-muted-foreground mb-2">Use our secure upload system to submit your identification:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Take a clear photo or scan of your ID</li>
                  <li>• Ensure file size is under 10MB</li>
                  <li>• Supported formats: JPG, PNG, PDF</li>
                  <li>• Follow the upload prompts carefully</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">4</div>
              <div>
                <h4 className="font-semibold mb-2">Wait for Verification</h4>
                <p className="text-muted-foreground">Our verification team will review your submission within 24-48 hours. You'll receive an email confirmation once approved.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacy & Security Measures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Data Protection</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>End-to-end encryption during upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Secure storage with industry-standard protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Automatic deletion after verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>GDPR and CCPA compliant processing</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Access Control</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Limited access to verification team only</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>No storage of personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Audit logs for all access attempts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Regular security audits and updates</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Document Upload Failed</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ensure your file is under 10MB, in JPG/PNG/PDF format, and shows all corners of your ID clearly.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Verification Taking Too Long</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Verification typically takes 24-48 hours. During peak times, it may take up to 72 hours.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Document Rejected</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Common reasons include poor image quality, expired documents, or documents not being government-issued.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you're experiencing issues with age verification or have questions about the process, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/support/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:verification@onlyfur.net">verification@onlyfur.net</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgeVerification;

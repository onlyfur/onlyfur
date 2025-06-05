import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertTriangle, Mail, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const DMCA: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 px-4 py-2 rounded-full mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">DMCA Policy</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">DMCA Copyright Policy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          OnlyFur respects intellectual property rights and responds to valid DMCA takedown notices.
        </p>
      </div>

      <Alert className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-900/10">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <strong>Important:</strong> Filing false DMCA claims can result in legal consequences. Only submit takedown notices for content you own or are authorized to represent.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Filing a DMCA Takedown Notice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you believe content on OnlyFur infringes your copyright, you may submit a DMCA takedown notice. 
              Your notice must include:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Your contact information (name, address, phone, email)</li>
              <li>• Identification of the copyrighted work being infringed</li>
              <li>• Identification of the infringing material and its location on OnlyFur</li>
              <li>• A statement of good faith belief that use is not authorized</li>
              <li>• A statement that the information is accurate under penalty of perjury</li>
              <li>• Your physical or electronic signature</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Submit a Takedown Notice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email (Preferred)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Send your DMCA notice to: dmca@onlyfur.com
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Mail
                </h4>
                <p className="text-sm text-muted-foreground">
                  OnlyFur DMCA Agent<br />
                  123 Platform Street<br />
                  Tech City, TC 12345
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Response Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Review Notice</h4>
                <p className="text-muted-foreground text-sm">We review your takedown notice for completeness and validity</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Remove Content</h4>
                <p className="text-muted-foreground text-sm">Valid claims result in immediate content removal</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Notify User</h4>
                <p className="text-muted-foreground text-sm">We inform the user who posted the content</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Counter-Notice Period</h4>
                <p className="text-muted-foreground text-sm">User has 10-14 days to file a counter-notice</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Counter-Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If your content was removed due to a DMCA claim and you believe it was removed in error, you may file a counter-notice containing:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Your contact information</li>
              <li>• Identification of the removed material</li>
              <li>• A statement under penalty of perjury that you have a good faith belief the content was removed in error</li>
              <li>• Consent to jurisdiction of federal court</li>
              <li>• Your physical or electronic signature</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Timeframes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h4 className="font-semibold">Notice Review</h4>
                <p className="text-sm text-muted-foreground">24-48 hours</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <h4 className="font-semibold">Content Removal</h4>
                <p className="text-sm text-muted-foreground">Immediate upon validation</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h4 className="font-semibold">Counter-Notice</h4>
                <p className="text-sm text-muted-foreground">10-14 days to restore</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repeat Infringer Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              OnlyFur will terminate accounts of users who are repeat copyright infringers. We track copyright violations 
              and may suspend or permanently ban accounts that receive multiple valid DMCA takedown notices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fair Use and Educational Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We recognize that some uses of copyrighted material may qualify as fair use under copyright law. 
              However, fair use is determined on a case-by-case basis. When in doubt, it's best to obtain permission 
              from the copyright owner or create original content.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12 bg-red-50 dark:bg-red-900/10 border-red-200">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">Need Help with Copyright Issues?</h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to help with copyright questions and DMCA-related concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="mailto:dmca@onlyfur.com">
                <Mail className="w-4 h-4 mr-2" />
                Email DMCA Agent
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">
                <FileText className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DMCA;

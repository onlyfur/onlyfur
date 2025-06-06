import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertTriangle, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  const lastUpdated = 'December 1, 2024';

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-900/20 dark:to-blue-900/20 px-4 py-2 rounded-full mb-6">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Terms of Service</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
      </div>

      <Alert className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          By using OnlyFur, you agree to these terms. Please read them carefully.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By accessing or using OnlyFur, you agree to be bound by these Terms of Service and our Privacy Policy. 
              If you do not agree to these terms, please do not use our platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Platform Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              OnlyFur is a subscription-based platform that connects furry content creators with their fans. 
              Users can subscribe to creators, purchase content, and interact through messaging and community features.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">To use OnlyFur, you must:</p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Be at least 18 years old</li>
              <li>• Provide accurate registration information</li>
              <li>• Comply with all applicable laws</li>
              <li>• Not be previously banned from the platform</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Account Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">You are responsible for:</p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Maintaining the security of your account credentials</li>
              <li>• All activities that occur under your account</li>
              <li>• Keeping your account information up to date</li>
              <li>• Reporting any unauthorized use of your account</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Content Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Allowed Content</h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Original furry artwork and photography</li>
                <li>• Fursuit content and performances</li>
                <li>• Educational and tutorial content</li>
                <li>• Creative writing and stories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Prohibited Content</h4>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Content involving minors</li>
                <li>• Illegal activities or substances</li>
                <li>• Harassment or hate speech</li>
                <li>• Copyright infringement</li>
                <li>• Spam or misleading content</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Subscriptions are billed monthly or annually</li>
              <li>• All payments are processed securely through third-party providers</li>
              <li>• Refunds are available according to our refund policy</li>
              <li>• Creators receive payouts according to our creator agreement</li>
              <li>• Platform fees are deducted from creator earnings</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You retain ownership of content you create and upload. By using OnlyFur, you grant us a license to 
              display and distribute your content through our platform. You must have the right to share any content you upload.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your personal information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Platform Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may modify, suspend, or discontinue any aspect of OnlyFur at any time. We will provide reasonable 
              notice of significant changes that affect your use of the platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Either party may terminate this agreement:</p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• You may delete your account at any time</li>
              <li>• We may terminate accounts that violate these terms</li>
              <li>• Upon termination, your access to the platform will cease</li>
              <li>• Some provisions of these terms will survive termination</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Disclaimers and Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              OnlyFur is provided "as is" without warranties. We are not liable for user-generated content or 
              interactions between users. Our liability is limited to the maximum extent permitted by law.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These terms are governed by the laws of [Jurisdiction]. Any disputes will be resolved in the courts 
              of [Jurisdiction] or through binding arbitration.
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-300 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800 dark:text-red-200">
              <AlertTriangle className="w-5 h-5 mr-2" />
              13. Platform Content Liability & User Responsibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-300 bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>CRITICAL DISCLAIMER:</strong> OnlyFur operates as a platform service provider. We are NOT responsible for user-generated content, user behavior, or any illegal activities conducted through our platform.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">User Content Responsibility</h4>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Users are solely responsible</strong> for all content they upload, share, post, or distribute on OnlyFur</li>
                  <li>• OnlyFur does NOT review, approve, monitor, or control user-generated content before publication</li>
                  <li>• We do not endorse, verify, guarantee, or take responsibility for any user content</li>
                  <li>• Content posted by users does not reflect OnlyFur's opinions, views, or positions</li>
                  <li>• Users must ensure they own all rights to content they upload or have proper authorization</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Illegal Content & Activities</h4>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>OnlyFur is NOT responsible for illegal content</strong> uploaded or shared by users</li>
                  <li>• Users who engage in illegal activities are solely liable for their actions</li>
                  <li>• We do not monitor user activities for legal compliance</li>
                  <li>• Users must comply with all applicable local, state, federal, and international laws</li>
                  <li>• OnlyFur will cooperate with law enforcement investigations when legally required</li>
                  <li>• We reserve the right to remove content and terminate accounts without notice</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Copyright & Intellectual Property</h4>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Users are responsible for ensuring they do not infringe copyright</strong></li>
                  <li>• OnlyFur does NOT verify copyright ownership of uploaded content</li>
                  <li>• Copyright infringement by users is their sole responsibility and liability</li>
                  <li>• OnlyFur responds to valid DMCA takedown notices but does not proactively monitor for infringement</li>
                  <li>• Users indemnify OnlyFur against any copyright infringement claims</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Platform Limitations & Disclaimers</h4>
                <ul className="space-y-1 ml-4">
                  <li>• OnlyFur provides platform infrastructure and services only</li>
                  <li>• We cannot and do not control user behavior, interactions, or content</li>
                  <li>• Users interact with each other entirely at their own risk</li>
                  <li>• OnlyFur makes no warranties about user content accuracy, legality, or appropriateness</li>
                  <li>• The platform is provided "AS IS" without any warranties or guarantees</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">User Indemnification</h4>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Users agree to indemnify and hold harmless OnlyFur</strong> from any claims, damages, or legal issues arising from:</li>
                  <li>• Their use of the platform or violations of these terms</li>
                  <li>• Content they upload, share, or distribute</li>
                  <li>• Their interactions with other users</li>
                  <li>• Any illegal activities they conduct on or through the platform</li>
                  <li>• Any copyright infringement or intellectual property violations</li>
                </ul>
              </div>

              <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/10 mt-4">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>By using OnlyFur, you acknowledge and agree that:</strong> (1) You are solely responsible for your content and actions, (2) OnlyFur is not liable for user content or behavior, (3) You will use the platform legally and responsibly, (4) You indemnify OnlyFur against any legal issues arising from your use of the platform.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>14. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              For questions about these terms, contact us at legal@onlyfur.com or through our support channels.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:legal@onlyfur.com">Legal Email</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12 bg-gray-50 dark:bg-gray-900/10 border-gray-200">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you understand your rights and responsibilities.
          </p>
          <Button asChild>
            <Link to="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Get Help
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;

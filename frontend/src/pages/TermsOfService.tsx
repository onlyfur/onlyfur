import React from 'react';
import { FileText, Users, Shield, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TermsOfService: React.FC = () => {
  const lastUpdated = 'December 15, 2024';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Terms of Service</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">
          Please read these terms carefully before using OnlyFur
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Important Notice */}
      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          By using OnlyFur, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <CardTitle>Acceptance of Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service ("Terms") govern your use of OnlyFur and constitute a legally binding agreement between you and OnlyFur. By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <CardTitle>Eligibility</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>You must be at least 18 years old to use OnlyFur</li>
              <li>You must have the legal capacity to enter into binding agreements</li>
              <li>You may not use OnlyFur if you are prohibited by law</li>
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for maintaining the security of your account</li>
            </ul>
          </CardContent>
        </Card>

        {/* Account Types and Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Account Types and Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Subscriber Accounts</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Subscribe to creators and access exclusive content</li>
                <li>Respect creator boundaries and content rules</li>
                <li>Use content only for personal, non-commercial purposes</li>
                <li>Do not share, redistribute, or resell creator content</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Creator Accounts</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Create and upload original content</li>
                <li>Set fair and transparent pricing for content access</li>
                <li>Maintain regular communication with subscribers</li>
                <li>Comply with all content guidelines and community standards</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Content Guidelines */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <CardTitle>Content Guidelines</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Allowed Content</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Furry art, illustrations, and digital creations</li>
                <li>Fursuit photography and videos</li>
                <li>Educational content about furry culture</li>
                <li>Original stories and written content</li>
                <li>Tutorials and behind-the-scenes content</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Prohibited Content</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Content involving minors or underage characters</li>
                <li>Non-consensual or stolen content</li>
                <li>Harassment, hate speech, or discriminatory content</li>
                <li>Illegal activities or content</li>
                <li>Spam or misleading information</li>
                <li>Content that infringes on intellectual property rights</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <CardTitle>Payment Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Subscriptions and Billing</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Subscriptions are billed on a recurring basis</li>
                <li>You may cancel your subscription at any time</li>
                <li>No refunds for partial billing periods</li>
                <li>Prices may change with 30 days notice</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Creator Earnings</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Platform fees apply to all creator earnings</li>
                <li>Creators are responsible for their own taxes</li>
                <li>Minimum payout thresholds apply</li>
                <li>Payment processing times vary by method</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Your Content</h3>
                <p className="text-muted-foreground">
                  You retain ownership of content you create and upload. By posting content, you grant OnlyFur a license to host, display, and distribute your content on our platform.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Platform Content</h3>
                <p className="text-muted-foreground">
                  OnlyFur and its licensors own all rights to the platform software, design, and features. You may not copy, modify, or distribute our platform code or design.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Standards */}
        <Card>
          <CardHeader>
            <CardTitle>Community Standards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              OnlyFur is built for the furry community, and we expect all users to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Treat all community members with respect and kindness</li>
              <li>Celebrate diversity and inclusion within the furry community</li>
              <li>Report inappropriate behavior or content</li>
              <li>Support creators fairly and constructively</li>
              <li>Maintain a positive and welcoming environment</li>
            </ul>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Your Right to Terminate</h3>
                <p className="text-muted-foreground">
                  You may delete your account at any time through your account settings. Upon deletion, your content will be removed from the platform.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Our Right to Terminate</h3>
                <p className="text-muted-foreground">
                  We may suspend or terminate accounts that violate these Terms, engage in harmful behavior, or for other legitimate reasons with appropriate notice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card>
          <CardHeader>
            <CardTitle>Disclaimers and Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                OnlyFur is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service or the accuracy of user-generated content.
              </p>
              <p>
                We are not responsible for disputes between creators and subscribers, though we may assist in resolution efforts.
              </p>
              <p>
                Our liability is limited to the maximum extent permitted by law.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <div><strong>Email:</strong> legal@onlyfur.net</div>
              <div><strong>General Support:</strong> support@onlyfur.net</div>
              <div><strong>Address:</strong> [Company Address - To be updated in production]</div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms from time to time. We will notify users of significant changes via email or platform notification. Your continued use of OnlyFur after changes constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;

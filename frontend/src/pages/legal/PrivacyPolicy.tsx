import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, Lock, FileText, Mail, Calendar, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = 'December 1, 2024';

  const privacyPrinciples = [
    {
      icon: Shield,
      title: 'Data Protection',
      description: 'We use industry-standard security measures to protect your personal information.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We clearly explain what data we collect and how we use it.'
    },
    {
      icon: Lock,
      title: 'Your Control',
      description: 'You have control over your data and privacy settings.'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 px-4 py-2 rounded-full mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Privacy Policy</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-4">
          Last updated: {lastUpdated}
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains how OnlyFur collects, uses, and protects your personal information.
        </p>
      </div>

      {/* Privacy Principles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Our Privacy Principles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {privacyPrinciples.map((principle, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <principle.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{principle.title}</h3>
                <p className="text-muted-foreground text-sm">{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Account Information</h4>
              <p className="text-muted-foreground">Email address, username, display name, profile picture, and any biographical information you provide.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Content and Communications</h4>
              <p className="text-muted-foreground">Photos, videos, messages, comments, and other content you upload or send through our platform.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payment Information</h4>
              <p className="text-muted-foreground">Billing details and payment method information (processed securely by our payment partners).</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Usage Data</h4>
              <p className="text-muted-foreground">Information about how you use our platform, including pages visited, features used, and interaction patterns.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span>Provide and improve our services</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span>Process payments and subscriptions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span>Communicate with you about your account and our services</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span>Ensure platform safety and prevent abuse</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span>Comply with legal obligations</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Information Sharing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">We do not sell your personal information. We may share information in these limited circumstances:</p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">With Your Consent</h4>
                <p className="text-muted-foreground text-sm">When you explicitly agree to share information.</p>
              </div>
              <div>
                <h4 className="font-semibold">Service Providers</h4>
                <p className="text-muted-foreground text-sm">Trusted partners who help us operate our platform (payment processors, hosting providers).</p>
              </div>
              <div>
                <h4 className="font-semibold">Legal Requirements</h4>
                <p className="text-muted-foreground text-sm">When required by law or to protect our users' safety.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">We implement appropriate security measures to protect your personal information:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Encryption of data in transit and at rest</li>
              <li>• Regular security audits and updates</li>
              <li>• Access controls and authentication measures</li>
              <li>• Secure payment processing through certified providers</li>
              <li>• Staff training on data protection practices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">You have the following rights regarding your personal information:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Access</h4>
                <p className="text-muted-foreground text-sm">Request a copy of your personal data</p>
              </div>
              <div>
                <h4 className="font-semibold">Correction</h4>
                <p className="text-muted-foreground text-sm">Update or correct inaccurate information</p>
              </div>
              <div>
                <h4 className="font-semibold">Deletion</h4>
                <p className="text-muted-foreground text-sm">Request deletion of your personal data</p>
              </div>
              <div>
                <h4 className="font-semibold">Portability</h4>
                <p className="text-muted-foreground text-sm">Export your data in a readable format</p>
              </div>
            </div>
            <Alert className="mt-4">
              <Mail className="h-4 w-4" />
              <AlertDescription>
                To exercise these rights, contact us at privacy@onlyfur.com
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5.1. Regional Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">European Union (GDPR)</h4>
              <p className="text-muted-foreground mb-2">EU users have additional rights under the General Data Protection Regulation:</p>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Right to object to processing for legitimate interests</li>
                <li>• Right to restrict processing in certain circumstances</li>
                <li>• Right to withdraw consent at any time</li>
                <li>• Right to lodge a complaint with your local data protection authority</li>
                <li>• Enhanced notification requirements for data breaches</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">United States (CCPA/CPRA)</h4>
              <p className="text-muted-foreground mb-2">California residents have rights under the California Consumer Privacy Act:</p>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Right to know what personal information is collected</li>
                <li>• Right to delete personal information</li>
                <li>• Right to opt-out of the sale of personal information</li>
                <li>• Right to non-discrimination for exercising privacy rights</li>
                <li>• Right to correct inaccurate personal information</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Other Jurisdictions</h4>
              <p className="text-muted-foreground">We respect privacy rights in all jurisdictions and will work with users to address local privacy requirements where applicable.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">We use cookies and similar technologies to:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Keep you logged in</li>
              <li>• Remember your preferences</li>
              <li>• Analyze platform usage</li>
              <li>• Provide personalized content</li>
            </ul>
            <p className="text-muted-foreground">You can control cookies through your browser settings.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We retain your personal information only as long as necessary to provide our services and comply with legal obligations. 
              Account data is typically deleted within 30 days of account closure, though some information may be retained longer 
              for legal or safety reasons.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              OnlyFur is intended for users 18 years and older. We do not knowingly collect personal information from anyone under 18. 
              If we become aware that we have collected such information, we will take steps to delete it promptly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
              safeguards are in place to protect your data during such transfers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of significant changes by email or 
              through our platform. Your continued use of OnlyFur after such changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        {/* Platform Content Liability Disclaimer */}
        <Card className="border-red-300 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800 dark:text-red-200">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Platform Content & Liability Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-300 bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>IMPORTANT:</strong> While we protect your privacy and personal data, OnlyFur is not responsible for content posted by users or any illegal activities conducted on our platform.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">User-Generated Content</h4>
                <ul className="space-y-1 ml-4">
                  <li>• OnlyFur does NOT monitor, review, or control user-generated content</li>
                  <li>• Users are solely responsible for all content they post, share, or distribute</li>
                  <li>• We do not endorse, verify, or guarantee the accuracy of user content</li>
                  <li>• Content uploaded by users does not reflect OnlyFur's views or opinions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Legal Content Compliance</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Users must ensure their content complies with all applicable laws</li>
                  <li>• OnlyFur is NOT responsible for illegal content uploaded by users</li>
                  <li>• Users who upload illegal content are solely liable for their actions</li>
                  <li>• We will cooperate with law enforcement when legally required</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Privacy vs. Content Responsibility</h4>
                <ul className="space-y-1 ml-4">
                  <li>• This privacy policy protects YOUR personal data that WE collect</li>
                  <li>• It does NOT cover content that YOU choose to share publicly</li>
                  <li>• Content you post may be viewed by other users according to your privacy settings</li>
                  <li>• You are responsible for managing what content you share and with whom</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Platform Limitations</h4>
                <ul className="space-y-1 ml-4">
                  <li>• OnlyFur provides the platform infrastructure only</li>
                  <li>• We cannot guarantee the behavior or actions of other users</li>
                  <li>• Users interact with each other at their own risk</li>
                  <li>• Report inappropriate content or behavior through our reporting system</li>
                </ul>
              </div>

              <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/10 mt-4">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>User Responsibility:</strong> By using OnlyFur, you acknowledge that you are responsible for your own content and actions. You agree to use the platform legally and responsibly, and understand that OnlyFur cannot control or be held liable for other users' content or behavior.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="mt-12 bg-blue-50 dark:bg-blue-900/10 border-blue-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-muted-foreground mb-6">
            If you have questions about this privacy policy or how we handle your data, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/contact">
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:privacy@onlyfur.com">
                <Shield className="w-4 h-4 mr-2" />
                privacy@onlyfur.com
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, Lock, FileText, Mail, Calendar } from 'lucide-react';
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
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 px-4 py-2 rounded-full mb-6">
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

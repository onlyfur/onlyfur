import React from 'react';
import { Shield, Eye, Lock, Users, Database, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = 'December 15, 2024';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Privacy Policy</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Your Privacy Matters</h1>
        <p className="text-xl text-muted-foreground">
          Learn how OnlyFur protects and handles your personal information
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <CardTitle>Introduction</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              OnlyFur ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform designed specifically for the furry community.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-500" />
              <CardTitle>Information We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Email address and username</li>
                <li>Profile information (display name, bio, avatar)</li>
                <li>Furry community preferences (fursona, species)</li>
                <li>Account type (creator or subscriber)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Content and Usage Data</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Content you upload, share, or create</li>
                <li>Messages and communications</li>
                <li>Subscription and interaction history</li>
                <li>Platform usage analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Payment method details (processed securely by third parties)</li>
                <li>Transaction history and billing information</li>
                <li>Tax information for creators</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <CardTitle>How We Use Your Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Provide and maintain our platform services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Facilitate communication between creators and subscribers</li>
              <li>Personalize content recommendations</li>
              <li>Ensure platform safety and prevent abuse</li>
              <li>Send important updates and notifications</li>
              <li>Improve our services through analytics</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-red-500" />
              <CardTitle>Information Sharing and Disclosure</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>With your explicit consent</li>
              <li>To provide services you've requested</li>
              <li>With trusted service providers (payment processors, hosting services)</li>
              <li>To comply with legal requirements or court orders</li>
              <li>To protect our rights, safety, or property</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <CardTitle>Data Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Secure payment processing through certified providers</li>
              <li>Access controls and employee training</li>
              <li>Content protection and watermarking for creators</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Access and review your personal data</li>
              <li>Correct or update inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of non-essential communications</li>
              <li>Restrict certain data processing activities</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us at privacy@onlyfur.com
            </p>
          </CardContent>
        </Card>

        {/* Furry Community Specific */}
        <Card>
          <CardHeader>
            <CardTitle>Furry Community Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We understand the unique needs of the furry community:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Respect for alternative identities and fursonas</li>
              <li>Privacy protection for community members</li>
              <li>Safe spaces for creative expression</li>
              <li>Anti-discrimination policies</li>
              <li>Community-driven moderation approaches</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <CardTitle>Contact Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <div><strong>Email:</strong> privacy@onlyfur.com</div>
              <div><strong>General Support:</strong> support@onlyfur.com</div>
              <div><strong>Address:</strong> [Company Address - To be updated in production]</div>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of OnlyFur after any changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

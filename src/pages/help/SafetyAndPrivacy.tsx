import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  Lock, 
  UserCheck, 
  Flag, 
  AlertTriangle,
  Settings,
  MessageCircle,
  CreditCard,
  CheckCircle,
  XCircle,
  Info,
  Users,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SafetyAndPrivacy: React.FC = () => {
  const safetyFeatures = [
    {
      icon: UserCheck,
      title: 'Age Verification',
      description: 'All users must verify they are 18+ to join our platform',
      details: 'We use industry-standard age verification methods to ensure a mature, responsible community where all participants are legal adults.'
    },
    {
      icon: Shield,
      title: 'Content Moderation',
      description: 'AI and human moderation to keep content appropriate',
      details: 'Our advanced moderation system combines automated detection with human review to maintain community standards and remove inappropriate content.'
    },
    {
      icon: Flag,
      title: 'Reporting System',
      description: 'Easy reporting tools for concerning content or behavior',
      details: 'Quick and confidential reporting system allows community members to flag inappropriate content, harassment, or policy violations.'
    },
    {
      icon: Lock,
      title: 'Privacy Controls',
      description: 'Granular privacy settings for your account and content',
      details: 'Control who can see your content, contact you, and access your profile information with comprehensive privacy settings.'
    }
  ];

  const privacySettings = [
    {
      category: 'Profile Visibility',
      options: [
        { setting: 'Public Profile', description: 'Anyone can view your profile' },
        { setting: 'Subscribers Only', description: 'Only subscribers can view full profile' },
        { setting: 'Private', description: 'Profile hidden from searches' }
      ]
    },
    {
      category: 'Content Access',
      options: [
        { setting: 'Public Content', description: 'Visible to all users' },
        { setting: 'Subscriber Content', description: 'Visible to subscribers only' },
        { setting: 'Tier-Specific', description: 'Visible to specific subscription tiers' }
      ]
    },
    {
      category: 'Communication',
      options: [
        { setting: 'Anyone', description: 'Anyone can message you' },
        { setting: 'Subscribers Only', description: 'Only subscribers can message' },
        { setting: 'No Messages', description: 'Disable direct messages' }
      ]
    }
  ];

  const dataProtection = [
    {
      type: 'Personal Information',
      icon: FileText,
      protection: [
        'Encrypted storage of all personal data',
        'Limited access on need-to-know basis',
        'Regular security audits and updates',
        'GDPR and CCPA compliance'
      ]
    },
    {
      type: 'Payment Information',
      icon: CreditCard,
      protection: [
        'PCI DSS compliant payment processing',
        'No storage of full credit card numbers',
        'Tokenized payment information',
        'Trusted payment processors (Stripe, PayPal)'
      ]
    },
    {
      type: 'Content & Messages',
      icon: MessageCircle,
      protection: [
        'End-to-end encryption for private messages',
        'Secure content delivery networks',
        'Regular backups with encryption',
        'Content access controls and auditing'
      ]
    }
  ];

  const reportingTypes = [
    {
      type: 'Harassment',
      description: 'Unwanted contact, threats, or abusive behavior',
      examples: ['Threatening messages', 'Persistent unwanted contact', 'Doxxing attempts']
    },
    {
      type: 'Inappropriate Content',
      description: 'Content that violates community guidelines',
      examples: ['Non-consensual content', 'Underage-appearing content', 'Extreme violence']
    },
    {
      type: 'Spam or Scams',
      description: 'Fraudulent activity or spam content',
      examples: ['Fake accounts', 'Financial scams', 'Malicious links']
    },
    {
      type: 'Copyright Violation',
      description: 'Unauthorized use of copyrighted material',
      examples: ['Stolen artwork', 'Reposted content', 'Trademark infringement']
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Safety & Privacy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your safety and privacy are our top priorities. Learn about our security measures and how to protect yourself on OnlyFur.
        </p>
      </div>

      {/* Safety Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Safety Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {safetyFeatures.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <feature.icon className="w-5 h-5 mr-2 text-primary" />
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-6 h-6 mr-3 text-primary" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control how others can interact with you and view your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {privacySettings.map((category, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-3">{category.category}</h3>
                <div className="space-y-2">
                  {category.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{option.setting}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      <Badge variant="outline">Option</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/settings">
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Configure Privacy Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-6 h-6 mr-3 text-primary" />
            Data Protection
          </CardTitle>
          <CardDescription>
            How we protect your personal information and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dataProtection.map((data, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <data.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold mb-2">{data.type}</h3>
                  <ul className="space-y-1">
                    {data.protection.map((protection, protectionIndex) => (
                      <li key={protectionIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                        {protection}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reporting System */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flag className="w-6 h-6 mr-3 text-primary" />
            Reporting & Support
          </CardTitle>
          <CardDescription>
            How to report concerning content or behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {reportingTypes.map((type, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{type.type}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                  <div>
                    <p className="text-xs font-medium mb-1">Examples:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">How to Report</h3>
              <ol className="text-sm space-y-1">
                <li>1. Click the report button on content or profiles</li>
                <li>2. Select the appropriate reason for reporting</li>
                <li>3. Provide additional details if requested</li>
                <li>4. Submit the report for review</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-3">
                All reports are reviewed within 24 hours. Serious violations are prioritized.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-6 h-6 mr-3 text-primary" />
            Safety Tips
          </CardTitle>
          <CardDescription>
            Best practices to stay safe on OnlyFur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-600">Do:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  Use strong, unique passwords
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  Enable two-factor authentication
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  Report suspicious behavior
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  Keep personal information private
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  Use privacy settings effectively
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-red-600">Don't:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                  Share login credentials
                </li>
                <li className="flex items-center text-sm">
                  <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                  Meet strangers in person
                </li>
                <li className="flex items-center text-sm">
                  <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                  Send money to other users
                </li>
                <li className="flex items-center text-sm">
                  <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                  Share personal documents
                </li>
                <li className="flex items-center text-sm">
                  <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                  Ignore suspicious messages
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Alert className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/10">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <strong>Emergency situations:</strong> If you feel you are in immediate danger, contact local emergency services. 
          For urgent safety concerns on OnlyFur, use our emergency reporting feature or contact support immediately.
        </AlertDescription>
      </Alert>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            More information about safety and privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/PrivacySettings">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Privacy Settings Guide
              </Button>
            </Link>
            <Link to="/help/articles/TwoFactorAuthentication">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Two-Factor Authentication
              </Button>
            </Link>
            <Link to="/guidelines">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Community Guidelines
              </Button>
            </Link>
            <Link to="/help/articles/ContentPrivacyLevels">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Content Privacy Levels
              </Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
            </Link>
            <Link to="/terms">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Terms of Service
              </Button>
            </Link>
            <Link to="/help/articles/ReportUserContent">
              <Button variant="outline" className="w-full justify-start">
                <Flag className="w-4 h-4 mr-2" />
                How to Report Content
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyAndPrivacy;

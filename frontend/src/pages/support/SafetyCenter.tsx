import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Lock, 
  Eye,
  EyeOff,
  UserX,
  Flag,
  Heart,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  XCircle,
  MessageCircle,
  Camera,
  Clock,
  Gavel
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SafetyCenter: React.FC = () => {
  const safetyFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Account Protection",
      description: "Two-factor authentication, secure passwords, and account recovery options",
      features: ["2FA Security", "Password Strength", "Login Alerts", "Account Recovery"]
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Content Controls",
      description: "Control who sees your content and how it's shared",
      features: ["Privacy Settings", "Content Visibility", "Age Restrictions", "Download Protection"]
    },
    {
      icon: <UserX className="h-6 w-6" />,
      title: "Blocking & Reporting",
      description: "Tools to block unwanted users and report inappropriate behavior",
      features: ["User Blocking", "Content Reporting", "Harassment Protection", "Spam Prevention"]
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Payment Security",
      description: "Secure payment processing and financial data protection",
      features: ["Encrypted Transactions", "Fraud Protection", "Secure Payouts", "Financial Privacy"]
    }
  ];

  const reportingOptions = [
    {
      type: "Harassment or Bullying",
      description: "Someone is repeatedly sending unwanted messages or being abusive",
      action: "Block and Report",
      severity: "high"
    },
    {
      type: "Inappropriate Content",
      description: "Content that violates our community guidelines",
      action: "Report Content",
      severity: "medium"
    },
    {
      type: "Spam or Scam",
      description: "Unwanted promotional messages or fraudulent activity",
      action: "Report User",
      severity: "medium"
    },
    {
      type: "Copyright Violation",
      description: "Someone using your content without permission",
      action: "DMCA Report",
      severity: "high"
    },
    {
      type: "Underage User",
      description: "Suspected user under 18 years old",
      action: "Immediate Report",
      severity: "critical"
    },
    {
      type: "Privacy Violation",
      description: "Sharing personal information without consent",
      action: "Privacy Report",
      severity: "high"
    }
  ];

  const emergencyContacts = [
    {
      type: "Platform Safety Team",
      contact: "safety@onlyfur.net",
      description: "24/7 safety concerns and urgent reports",
      responseTime: "< 1 hour"
    },
    {
      type: "Legal Issues",
      contact: "legal@onlyfur.net", 
      description: "Copyright, DMCA, and legal matters",
      responseTime: "< 24 hours"
    },
    {
      type: "Crisis Hotline",
      contact: "988 (US) or local emergency",
      description: "Immediate mental health or safety crisis",
      responseTime: "Immediate"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline-solid">Low</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-6">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Safety Center</span>
          </div>
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Your Safety is Our Priority
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            OnlyFur is committed to providing a safe, secure environment for all creators and subscribers. 
            Learn about our safety features, reporting tools, and community standards.
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Need immediate help?</strong> If you're in danger or experiencing a crisis, contact local emergency services immediately. 
            For platform-related safety concerns, email safety@onlyfur.net or use our reporting tools below.
          </AlertDescription>
        </Alert>

        {/* Safety Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Safety Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reporting System */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Report Inappropriate Behavior</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help us maintain a safe community by reporting violations. All reports are reviewed by our safety team within 24 hours.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportingOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{option.type}</CardTitle>
                    {getSeverityBadge(option.severity)}
                  </div>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant={option.severity === 'critical' ? 'destructive' : 'default'}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Safety Tips */}
        <Card className="mb-16 bg-linear-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800 dark:text-green-200">
              <Heart className="mr-2 h-5 w-5" />
              Quick Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">For Creators:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    Set clear boundaries and content guidelines
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    Use watermarks on exclusive content
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    Keep personal information private
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    Report suspicious subscriber behavior
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">For Subscribers:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    Respect creator boundaries and guidelines
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    Never share or redistribute creator content
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    Report content that violates guidelines
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    Use secure payment methods only
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 w-fit mb-4">
                    {contact.type.includes('Crisis') ? <Phone className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
                  </div>
                  <CardTitle className="text-lg">{contact.type}</CardTitle>
                  <CardDescription>{contact.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-mono mb-2">{contact.contact}</div>
                  <Badge variant="outline-solid" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    Response: {contact.responseTime}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Standards */}
        <Card className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Community Standards</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Our community guidelines ensure a positive, safe environment for everyone. 
              Learn about our policies and how we enforce them.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-blue-600 hover:text-blue-700" asChild>
                <Link to="/community-guidelines">
                  <Gavel className="mr-2 h-5 w-5" />
                  Read Community Guidelines
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/help/safety-and-privacy">
                  <Shield className="mr-2 h-5 w-5" />
                  Privacy & Safety Help
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Additional Safety Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Report a User</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Report inappropriate behavior or policy violations.</p>
                <Button variant="outline" className="w-full">Report Now</Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Camera className="h-8 w-8 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Content Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Learn what content is allowed on our platform.</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/community-guidelines">View Guidelines</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Control your privacy and data sharing preferences.</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/settings/privacy">Privacy Settings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <ExternalLink className="h-8 w-8 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">External Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Mental health and crisis support resources.</p>
                <Button variant="outline" className="w-full">Find Help</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyCenter;

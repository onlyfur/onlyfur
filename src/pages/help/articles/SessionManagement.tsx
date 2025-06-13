import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Laptop,
  Smartphone,
  Shield,
  ArrowLeft,
  LogOut,
  AlertTriangle,
  Globe,
  Clock,
  Lock,
  Eye,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SessionManagement: React.FC = () => {
  const sessionTypes = [
    {
      type: "Browser Session",
      description: "Active login in web browsers",
      details: "Includes desktop and mobile browsers, typically valid for 7 days",
      icon: <Globe className="h-6 w-6" />
    },
    {
      type: "Mobile App Session",
      description: "Login sessions in the OnlyFur mobile app",
      details: "Remains active until manually logged out or app data is cleared",
      icon: <Smartphone className="h-6 w-6" />
    },
    {
      type: "Remember Me Session",
      description: "Extended login sessions when 'Remember Me' is checked",
      details: "Keeps you logged in for 30 days on trusted devices",
      icon: <Clock className="h-6 w-6" />
    }
  ];

  const managementFeatures = [
    {
      feature: "View Active Sessions",
      description: "See all devices currently logged into your account",
      steps: [
        "Go to Account Settings",
        "Select Security & Privacy",
        "View 'Active Sessions' list",
        "Check device details and locations"
      ]
    },
    {
      feature: "End Individual Sessions",
      description: "Log out from specific devices remotely",
      steps: [
        "Find the session in Active Sessions list",
        "Click the 'End Session' button",
        "Confirm action to terminate access",
        "Session ends immediately"
      ]
    },
    {
      feature: "End All Sessions",
      description: "Log out from all devices at once",
      steps: [
        "Go to Security Settings",
        "Click 'End All Sessions'",
        "Confirm the action",
        "Maintains current session only"
      ]
    }
  ];

  const securityTips = [
    {
      tip: "Regular Session Review",
      description: "Check active sessions weekly to spot unauthorized access",
      icon: <Eye className="h-5 w-5 text-blue-500" />
    },
    {
      tip: "Public Device Safety",
      description: "Always log out when using shared or public computers",
      icon: <LogOut className="h-5 w-5 text-orange-500" />
    },
    {
      tip: "Suspicious Activity",
      description: "End unknown sessions and change password immediately",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />
    },
    {
      tip: "Device Verification",
      description: "Enable notifications for new device logins",
      icon: <Shield className="h-5 w-5 text-green-500" />
    }
  ];

  const deviceInfo = [
    {
      label: "Browser & OS",
      description: "Chrome on Windows, Safari on iOS, etc.",
      importance: "Identify specific devices and platforms"
    },
    {
      label: "Location",
      description: "Approximate login location based on IP",
      importance: "Detect suspicious login locations"
    },
    {
      label: "Last Active",
      description: "Most recent activity timestamp",
      importance: "Track session usage patterns"
    },
    {
      label: "Login Time",
      description: "When the session started",
      importance: "Monitor session duration"
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/help">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Center
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Laptop className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Account Security</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Managing your active sessions</h1>
        <p className="text-xl text-muted-foreground">
          Control and monitor devices logged into your OnlyFur account for enhanced security.
        </p>
      </div>

      {/* Security Alert */}
      <Alert className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Security Tip:</strong> Regularly review your active sessions and end any that you don't recognize 
          to protect your account from unauthorized access.
        </AlertDescription>
      </Alert>

      {/* Session Types */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-3 h-6 w-6 text-purple-500" />
            Understanding Session Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sessionTypes.map((session, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="text-primary mt-1">
                  {session.icon}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{session.type}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
                  <p className="text-xs text-muted-foreground">{session.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-3 h-6 w-6 text-green-500" />
            Session Management Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {managementFeatures.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{feature.feature}</h4>
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <ol className="text-sm space-y-2">
                  {feature.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Laptop className="mr-3 h-6 w-6 text-blue-500" />
            Understanding Device Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {deviceInfo.map((info, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-sm mb-1">{info.label}</h4>
                <p className="text-sm text-muted-foreground mb-2">{info.description}</p>
                <p className="text-xs text-muted-foreground italic">Why it matters: {info.importance}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-3 h-6 w-6 text-orange-500" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {securityTips.map((tip, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {tip.icon}
                  <div>
                    <h4 className="font-medium text-sm mb-1">{tip.tip}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Related Help Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-xs transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-4 w-4 text-primary mr-2" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Learn about our comprehensive security features.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/account-security">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xs transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Smartphone className="h-4 w-4 text-primary mr-2" />
                Mobile App Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Secure your mobile app access.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/mobile-app">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xs transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Lock className="h-4 w-4 text-primary mr-2" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Control your account privacy and security.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/privacy-settings">Read More</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;

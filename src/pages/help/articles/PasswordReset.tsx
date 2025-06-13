import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  KeyRound, 
  Mail, 
  AlertTriangle,
  Shield,
  ArrowLeft,
  Clock,
  CheckCircle,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PasswordReset: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Access Reset Page",
      description: "Click 'Forgot Password' on the login screen",
      details: "You can find this link below the login form or on the main login page.",
      icon: <KeyRound className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Enter Email",
      description: "Provide the email address associated with your account",
      details: "Make sure to use the email address you registered with. Check your spam folder if you don't receive the reset link.",
      icon: <Mail className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Check Email",
      description: "Click the password reset link in your email",
      details: "The link expires after 1 hour for security. Request a new one if needed.",
      icon: <Clock className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Create New Password",
      description: "Set a strong new password following our requirements",
      details: "Your new password must be different from your previous password and meet our security standards.",
      icon: <Lock className="h-6 w-6" />
    },
    {
      step: 5,
      title: "Confirm Reset",
      description: "Log in with your new password",
      details: "After resetting, you'll be logged out of all devices for security.",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  const troubleshooting = [
    {
      issue: "Reset Link Expired",
      solution: "Request a new reset link from the login page. Links expire after 1 hour for security."
    },
    {
      issue: "Email Not Received",
      solution: "Check spam folder, verify email address, or contact support if problems persist."
    },
    {
      issue: "Account Not Found",
      solution: "Verify email address, check for typos, or contact support if you've lost access to your email."
    },
    {
      issue: "Multiple Failed Attempts",
      solution: "Wait 30 minutes before trying again, or contact support for assistance."
    }
  ];

  const securityTips = [
    {
      tip: "Use a Strong Password",
      description: "Create a unique password with at least 12 characters, including numbers and symbols."
    },
    {
      tip: "Enable 2FA After Reset",
      description: "Re-enable two-factor authentication if previously enabled."
    },
    {
      tip: "Check Recent Activity",
      description: "Review your account activity after resetting your password."
    },
    {
      tip: "Update Other Services",
      description: "If you used the same password elsewhere, change those too."
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
          <KeyRound className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Account Security</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">How to reset your password</h1>
        <p className="text-xl text-muted-foreground">
          Follow these steps to securely reset your password and regain access to your account.
        </p>
      </div>

      {/* Security Alert */}
      <Alert className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Security Note:</strong> OnlyFur will never ask for your password via email or messages. 
          Only reset your password through the official website.
        </AlertDescription>
      </Alert>

      {/* Step-by-Step Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyRound className="mr-3 h-6 w-6 text-green-500" />
            Password Reset Process
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {steps.map((step, index) => (
              <div key={step.step} className="p-4">
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-1 shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <p className="text-xs text-muted-foreground">{step.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-3 h-6 w-6 text-orange-500" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {troubleshooting.map((item, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4 py-1">
                <h4 className="font-medium text-sm mb-1">{item.issue}</h4>
                <p className="text-sm text-muted-foreground">{item.solution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-3 h-6 w-6 text-blue-500" />
            After Reset Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {securityTips.map((tip, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-sm mb-1">{tip.tip}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
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
                <Lock className="h-4 w-4 text-primary mr-2" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Add an extra layer of security to your account.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/two-factor-authentication">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xs transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <AlertTriangle className="h-4 w-4 text-primary mr-2" />
                Account Recovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Additional options for regaining account access.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/account-recovery">Read More</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;

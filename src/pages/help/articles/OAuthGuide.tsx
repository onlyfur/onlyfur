import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Chrome,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Link as LinkIcon,
  Unlink,
  Lock,
  Mail,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OAuthGuide: React.FC = () => {
  const benefits = [
    {
      benefit: "Quick Registration",
      description: "Create your account instantly using your existing Google account",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      benefit: "Enhanced Security",
      description: "Leverage Google's advanced security features and two-factor authentication",
      icon: <Shield className="h-5 w-5 text-blue-500" />
    },
    {
      benefit: "No Password Management",
      description: "No need to remember another password - Google handles authentication",
      icon: <Lock className="h-5 w-5 text-purple-500" />
    },
    {
      benefit: "Automatic Verification",
      description: "Your email is automatically verified when using Google login",
      icon: <Mail className="h-5 w-5 text-orange-500" />
    }
  ];

  const setupSteps = [
    {
      step: 1,
      title: "Click 'Sign in with Google'",
      description: "On the OnlyFur login or registration page",
      details: "Look for the Google button on the login form or registration page.",
      icon: <Chrome className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Choose Your Google Account",
      description: "Select the Google account you want to use",
      details: "If you're logged into multiple Google accounts, choose the one you prefer for OnlyFur.",
      icon: <User className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Grant Permissions",
      description: "Allow OnlyFur to access your basic profile information",
      details: "OnlyFur only requests access to your name, email, and profile picture.",
      icon: <Shield className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Complete Your Profile",
      description: "Add any additional information to complete your OnlyFur profile",
      details: "You may need to choose a username and complete your profile setup.",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  const troubleshooting = [
    {
      issue: "Google Login Button Not Working",
      symptoms: ["Button doesn't respond", "Page doesn't redirect", "Nothing happens when clicked"],
      solutions: [
        "Clear your browser cache and cookies",
        "Disable ad blockers or privacy extensions",
        "Try a different browser or incognito mode",
        "Check if JavaScript is enabled"
      ]
    },
    {
      issue: "Permission Denied Error",
      symptoms: ["'Access denied' message", "Can't grant permissions", "Authorization fails"],
      solutions: [
        "Make sure you're logged into the correct Google account",
        "Check if your Google account has restrictions",
        "Try logging out of Google and back in",
        "Contact support if using a work/school Google account"
      ]
    },
    {
      issue: "Account Already Exists",
      symptoms: ["'Email already registered' message", "Can't link Google account"],
      solutions: [
        "Use 'Forgot Password' to access your existing account",
        "Link your Google account from account settings",
        "Contact support to merge accounts if needed",
        "Use a different email address"
      ]
    },
    {
      issue: "Profile Information Missing",
      symptoms: ["Name or email not populated", "Profile picture not showing"],
      solutions: [
        "Check your Google account privacy settings",
        "Ensure your Google profile is public",
        "Re-authorize OnlyFur access to your Google account",
        "Manually update your profile information"
      ]
    }
  ];

  const securityFeatures = [
    {
      feature: "OAuth 2.0 Protocol",
      description: "Industry-standard secure authentication protocol"
    },
    {
      feature: "Limited Permissions",
      description: "OnlyFur only accesses basic profile information"
    },
    {
      feature: "No Password Storage",
      description: "Your Google password is never shared with OnlyFur"
    },
    {
      feature: "Revocable Access",
      description: "You can revoke OnlyFur's access anytime from Google settings"
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
          <Chrome className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Authentication</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Google OAuth authentication guide</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to use Google Sign-In for secure and convenient access to your OnlyFur account.
        </p>
      </div>

      {/* Benefits */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
            Benefits of Google Sign-In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                {benefit.icon}
                <div>
                  <h4 className="font-medium text-sm mb-1">{benefit.benefit}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Chrome className="mr-3 h-6 w-6 text-blue-500" />
            Setting Up Google Sign-In
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {setupSteps.map((step, index) => (
              <div key={step.step} className="p-4">
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-1 flex-shrink-0">
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

      {/* Security Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-3 h-6 w-6 text-green-500" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-sm mb-1">{feature.feature}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          <Alert className="mt-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>Privacy Note:</strong> OnlyFur only requests access to your basic profile information 
              (name, email, profile picture). We never access your Google account password or other personal data.
            </AlertDescription>
          </Alert>
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
          <div className="space-y-6">
            {troubleshooting.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2">{issue.issue}</h4>
                <div className="mb-3">
                  <h5 className="font-medium text-sm text-red-600 mb-1">Symptoms:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {issue.symptoms.map((symptom, idx) => (
                      <li key={idx}>• {symptom}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm text-green-600 mb-1">Solutions:</h5>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    {issue.solutions.map((solution, idx) => (
                      <li key={idx}>{idx + 1}. {solution}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Managing Google Connection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="mr-3 h-6 w-6 text-purple-500" />
            Managing Your Google Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Linking Google to Existing Account</h4>
              <p className="text-sm text-muted-foreground mb-3">
                If you already have an OnlyFur account, you can link your Google account:
              </p>
              <ol className="text-sm space-y-1">
                <li>1. Log into your existing OnlyFur account</li>
                <li>2. Go to Account Settings → Security</li>
                <li>3. Click "Link Google Account"</li>
                <li>4. Complete the Google authorization process</li>
              </ol>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Unlinking Google Account</h4>
              <p className="text-sm text-muted-foreground mb-3">
                To remove Google Sign-In from your account:
              </p>
              <ol className="text-sm space-y-1">
                <li>1. Ensure you have a password set for your account</li>
                <li>2. Go to Account Settings → Security</li>
                <li>3. Click "Unlink Google Account"</li>
                <li>4. Confirm the action</li>
              </ol>
              <Alert className="mt-3 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>Warning:</strong> Make sure you have a password set before unlinking Google, 
                  or you may lose access to your account.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Related Help Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <User className="h-4 w-4 text-primary mr-2" />
                Account Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Learn how to create your OnlyFur account.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/how-to-create-account">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-4 w-4 text-primary mr-2" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Best practices for account security.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/account-security">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <AlertTriangle className="h-4 w-4 text-primary mr-2" />
                Login Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Resolve common login issues.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/login-troubleshooting">Read More</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OAuthGuide;

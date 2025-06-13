import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  AlertTriangle,
  Eye,
  EyeOff,
  Smartphone,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowToCreateAccount: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Visit the Registration Page",
      description: "Navigate to OnlyFur.com and click the 'Sign Up' button",
      details: "You can find the Sign Up button in the top right corner of any page, or click 'Get Started' from the home page.",
      icon: <UserPlus className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Choose Your Account Type",
      description: "Select whether you want to be a Creator or Subscriber",
      details: "Creators can upload content and earn money, while Subscribers can view and support creators. You can change this later in your settings.",
      icon: <Shield className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Enter Your Information",
      description: "Fill in your email, username, display name, and password",
      details: "Choose a unique username that represents you. Your display name is what others will see, and you can change it later.",
      icon: <Mail className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Create a Strong Password",
      description: "Your password must be at least 8 characters with mixed case, numbers, and symbols",
      details: "We recommend using a password manager to generate and store a secure password. Enable two-factor authentication for extra security.",
      icon: <Lock className="h-6 w-6" />
    },
    {
      step: 5,
      title: "Verify Your Email",
      description: "Check your email and click the verification link",
      details: "The verification email should arrive within a few minutes. Check your spam folder if you don't see it.",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  const requirements = [
    {
      requirement: "Age Verification",
      description: "You must be 18+ years old to create an account",
      mandatory: true
    },
    {
      requirement: "Valid Email Address",
      description: "A working email address for account verification and communications",
      mandatory: true
    },
    {
      requirement: "Unique Username",
      description: "Choose a username that hasn't been taken by another user",
      mandatory: true
    },
    {
      requirement: "Strong Password",
      description: "Minimum 8 characters with uppercase, lowercase, number, and symbol",
      mandatory: true
    },
    {
      requirement: "Profile Picture",
      description: "Upload an avatar image to personalize your profile",
      mandatory: false
    }
  ];

  const troubleshooting = [
    {
      issue: "Email Not Received",
      solution: "Check spam folder, ensure email is correct, request a new verification email"
    },
    {
      issue: "Username Already Taken",
      solution: "Try adding numbers or underscores, use a variation of your preferred name"
    },
    {
      issue: "Password Too Weak",
      solution: "Include uppercase letters, numbers, and special characters. Try a passphrase."
    },
    {
      issue: "Account Creation Failed",
      solution: "Clear browser cache, disable ad blockers, try a different browser or device"
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
          <UserPlus className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Getting Started</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">How to create your account</h1>
        <p className="text-xl text-muted-foreground">
          Follow this step-by-step guide to create your account and join the OnlyFur community.
        </p>
      </div>

      {/* Quick Start Alert */}
      <Alert className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Quick Start:</strong> Have your email ready and choose whether you want to be a creator or subscriber. 
          The entire process takes less than 5 minutes!
        </AlertDescription>
      </Alert>

      {/* Requirements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-3 h-6 w-6 text-blue-500" />
            Account Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${req.mandatory ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {req.mandatory ? 
                    <AlertTriangle className="h-4 w-4" /> : 
                    <CheckCircle className="h-4 w-4" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm">{req.requirement}</h4>
                    <Badge variant={req.mandatory ? "destructive" : "secondary"} className="text-xs">
                      {req.mandatory ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-3 h-6 w-6 text-green-500" />
            Step-by-Step Creation Process
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
                    {index < steps.length - 1 && (
                      <div className="flex items-center mt-2 text-xs text-primary">
                        <span>Next: {steps[index + 1].title}</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Password Security Tips */}
      <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
            <Lock className="mr-3 h-6 w-6" />
            Password Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-3 text-green-700 dark:text-green-300">Good Password Practices:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  Use a mix of uppercase and lowercase letters
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  Include numbers and special characters
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  Make it at least 12 characters long
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  Use a unique password for OnlyFur
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3 text-red-700 dark:text-red-300">Avoid These Mistakes:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                  Don't use personal information (birthday, name)
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                  Avoid common passwords like "password123"
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                  Don't reuse passwords from other sites
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                  Never share your password with anyone
                </li>
              </ul>
            </div>
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

      {/* Next Steps */}
      <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Account?</h3>
              <p className="text-muted-foreground">
                Join thousands of creators and fans in the OnlyFur community.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="default" size="sm" asChild>
                <Link to="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account Now
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/help">
                  <Smartphone className="mr-2 h-4 w-4" />
                  More Help Articles
                </Link>
              </Button>
            </div>
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
              <p className="text-muted-foreground mb-3 text-sm">Learn how to secure your account with two-factor authentication.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/account-security">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xs transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Eye className="h-4 w-4 text-primary mr-2" />
                Profile Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Complete your profile to attract followers and subscribers.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/profile-setup">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xs transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Mail className="h-4 w-4 text-primary mr-2" />
                Email Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Troubleshoot email verification issues and resend emails.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/email-verification">Read More</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowToCreateAccount;

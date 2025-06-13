import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LogIn, 
  AlertTriangle,
  Shield,
  ArrowLeft,
  Clock,
  CheckCircle,
  Lock,
  Smartphone,
  Globe,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginTroubleshooting: React.FC = () => {
  const commonIssues = [
    {
      issue: "Incorrect Email or Password",
      symptoms: ["'Invalid credentials' error message", "Login form rejects your input"],
      solutions: [
        "Double-check your email address for typos",
        "Ensure Caps Lock is off when typing password",
        "Try typing your password in a text editor first to verify",
        "Use 'Forgot Password' if you're unsure of your password"
      ],
      icon: <Lock className="h-5 w-5" />
    },
    {
      issue: "Account Locked",
      symptoms: ["'Account temporarily locked' message", "Unable to login after multiple attempts"],
      solutions: [
        "Wait 30 minutes before trying again",
        "Check your email for security notifications",
        "Contact support if lockout persists",
        "Ensure you're using the correct password"
      ],
      icon: <Shield className="h-5 w-5" />
    },
    {
      issue: "Two-Factor Authentication Problems",
      symptoms: ["2FA code not working", "Not receiving SMS codes", "Authenticator app issues"],
      solutions: [
        "Check your phone's time settings (must be accurate)",
        "Try generating a new code from your authenticator app",
        "Use backup codes if available",
        "Contact support to reset 2FA if needed"
      ],
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      issue: "Browser or Cache Issues",
      symptoms: ["Page won't load", "Login button not working", "Stuck on loading screen"],
      solutions: [
        "Clear your browser cache and cookies",
        "Try logging in with an incognito/private window",
        "Disable browser extensions temporarily",
        "Try a different browser"
      ],
      icon: <Globe className="h-5 w-5" />
    },
    {
      issue: "Email Not Verified",
      symptoms: ["'Please verify your email' message", "Limited account access"],
      solutions: [
        "Check your email inbox and spam folder",
        "Request a new verification email",
        "Ensure you're checking the correct email address",
        "Contact support if verification email doesn't arrive"
      ],
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  const quickFixes = [
    {
      title: "Clear Browser Data",
      description: "Remove cached login data that might be causing conflicts",
      steps: [
        "Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)",
        "Select 'Cookies and site data' and 'Cached images and files'",
        "Choose 'Last hour' or 'Last 24 hours'",
        "Click 'Clear data' and try logging in again"
      ]
    },
    {
      title: "Check Account Status",
      description: "Verify your account is active and in good standing",
      steps: [
        "Try accessing the 'Forgot Password' page",
        "If your email is recognized, your account exists",
        "Check for any suspension or ban notifications",
        "Contact support if account status is unclear"
      ]
    },
    {
      title: "Test Different Devices",
      description: "Determine if the issue is device-specific",
      steps: [
        "Try logging in from your phone",
        "Test on a different computer",
        "Use a different internet connection",
        "Compare results to isolate the problem"
      ]
    }
  ];

  const preventionTips = [
    {
      tip: "Use a Password Manager",
      description: "Avoid typing errors and ensure you always have the correct password"
    },
    {
      tip: "Keep Browser Updated",
      description: "Use the latest browser version for best compatibility"
    },
    {
      tip: "Save Backup Codes",
      description: "Store 2FA backup codes in a secure location"
    },
    {
      tip: "Regular Security Checkups",
      description: "Review your account security settings monthly"
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
          <LogIn className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Technical Support</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Login troubleshooting guide</h1>
        <p className="text-xl text-muted-foreground">
          Resolve common login issues and regain access to your OnlyFur account quickly.
        </p>
      </div>

      {/* Quick Help Alert */}
      <Alert className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <LogIn className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Quick Fix:</strong> Most login issues can be resolved by clearing your browser cache 
          or trying an incognito/private browsing window.
        </AlertDescription>
      </Alert>

      {/* Common Issues */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-3 h-6 w-6 text-orange-500" />
            Common Login Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {commonIssues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="text-orange-500 mt-1">
                    {issue.icon}
                  </div>
                  <div className="flex-1">
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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Fixes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="mr-3 h-6 w-6 text-green-500" />
            Quick Fixes to Try First
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-1 gap-6">
            {quickFixes.map((fix, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{fix.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{fix.description}</p>
                <ol className="text-sm space-y-1">
                  {fix.steps.map((step, idx) => (
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

      {/* Browser-Specific Instructions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-3 h-6 w-6 text-purple-500" />
            Browser-Specific Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Chrome</h4>
              <ul className="text-sm space-y-2">
                <li>• Settings → Privacy and security → Clear browsing data</li>
                <li>• Try incognito mode (Ctrl+Shift+N)</li>
                <li>• Disable extensions temporarily</li>
                <li>• Check if Chrome is up to date</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Firefox</h4>
              <ul className="text-sm space-y-2">
                <li>• Options → Privacy & Security → Clear Data</li>
                <li>• Try private browsing (Ctrl+Shift+P)</li>
                <li>• Restart in Safe Mode</li>
                <li>• Check for Firefox updates</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Safari</h4>
              <ul className="text-sm space-y-2">
                <li>• Safari → Preferences → Privacy → Manage Website Data</li>
                <li>• Try private browsing</li>
                <li>• Check Safari version</li>
                <li>• Disable Safari extensions</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Edge</h4>
              <ul className="text-sm space-y-2">
                <li>• Settings → Privacy → Clear browsing data</li>
                <li>• Try InPrivate browsing (Ctrl+Shift+N)</li>
                <li>• Reset Edge settings if needed</li>
                <li>• Check for Edge updates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prevention Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-3 h-6 w-6 text-blue-500" />
            Prevention Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {preventionTips.map((tip, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-sm mb-1">{tip.tip}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Still Need Help */}
      <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800 dark:text-red-200">
            <AlertTriangle className="mr-3 h-6 w-6" />
            Still Can't Login?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-800 dark:text-red-200 mb-4">
            If you've tried all the solutions above and still can't access your account, 
            our support team is here to help.
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Before contacting support, please have ready:</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Your registered email address</li>
                  <li>• Description of error messages you're seeing</li>
                  <li>• Browser and device information</li>
                  <li>• Steps you've already tried</li>
                </ul>
              </div>
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
                <Lock className="h-4 w-4 text-primary mr-2" />
                Password Reset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Learn how to reset your password securely.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/password-reset">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xs transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-4 w-4 text-primary mr-2" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Best practices for keeping your account secure.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/account-security">Read More</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xs transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Smartphone className="h-4 w-4 text-primary mr-2" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Set up 2FA for enhanced account protection.</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/help/two-factor-authentication">Read More</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginTroubleshooting;

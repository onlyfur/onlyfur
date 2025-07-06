import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cookie, Settings, Eye, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiePolicy: React.FC = () => {
  const cookieTypes = [
    {
      type: 'Essential Cookies',
      icon: Shield,
      purpose: 'Required for basic platform functionality',
      examples: ['Login sessions', 'Security features', 'Load balancing'],
      canDisable: false,
      color: 'bg-green-100 dark:bg-green-900/20 border-green-200'
    },
    {
      type: 'Performance Cookies',
      icon: TrendingUp,
      purpose: 'Help us understand how users interact with our platform',
      examples: ['Page views', 'Feature usage', 'Error tracking'],
      canDisable: true,
      color: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200'
    },
    {
      type: 'Functionality Cookies',
      icon: Settings,
      purpose: 'Remember your preferences and settings',
      examples: ['Theme preferences', 'Language settings', 'Layout choices'],
      canDisable: true,
      color: 'bg-purple-100 dark:bg-purple-900/20 border-purple-200'
    },
    {
      type: 'Targeting Cookies',
      icon: Eye,
      purpose: 'Provide personalized content and recommendations',
      examples: ['Content suggestions', 'Creator recommendations', 'Personalized feeds'],
      canDisable: true,
      color: 'bg-orange-100 dark:bg-orange-900/20 border-orange-200'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 px-4 py-2 rounded-full mb-6">
          <Cookie className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Cookie Policy</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn about how OnlyFur uses cookies and similar technologies to improve your experience.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cookies are small text files stored on your device when you visit our website. They help us provide 
              you with a better experience by remembering your preferences, keeping you logged in, and understanding 
              how you use our platform.
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
          <div className="grid gap-6">
            {cookieTypes.map((cookie, index) => (
              <Card key={index} className={`${cookie.color} hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <cookie.icon className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{cookie.type}</h3>
                        <p className="text-muted-foreground">{cookie.purpose}</p>
                      </div>
                    </div>
                    <Badge variant={cookie.canDisable ? "secondary" : "default"}>
                      {cookie.canDisable ? "Optional" : "Required"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <ul className="space-y-1">
                      {cookie.examples.map((example, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Managing Your Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Browser Settings</h4>
              <p className="text-muted-foreground mb-2">
                You can control cookies through your browser settings. However, disabling certain cookies may affect your experience on OnlyFur.
              </p>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                <li>• <strong>Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">OnlyFur Settings</h4>
              <p className="text-muted-foreground">
                You can also manage some cookie preferences directly in your OnlyFur account settings.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We may allow trusted third-party services to set cookies for:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Payment Processing:</strong> Secure payment transactions (Stripe, PayPal)</li>
              <li>• <strong>Analytics:</strong> Understanding platform usage and performance</li>
              <li>• <strong>Customer Support:</strong> Providing help and assistance features</li>
              <li>• <strong>Security:</strong> Protecting against fraud and abuse</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookie Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Session Cookies</h4>
                <p className="text-muted-foreground text-sm">Deleted when you close your browser</p>
              </div>
              <div>
                <h4 className="font-semibold">Persistent Cookies</h4>
                <p className="text-muted-foreground text-sm">Stored for a specific period (typically 30 days to 2 years)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this cookie policy from time to time. Any changes will be posted on this page with 
              an updated revision date. Your continued use of OnlyFur constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12 bg-orange-50 dark:bg-orange-900/10 border-orange-200">
        <CardContent className="p-8 text-center">
          <Cookie className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
          <p className="text-muted-foreground mb-6">
            Contact our support team if you have questions about our cookie policy or need help managing your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/privacy">Privacy Policy</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookiePolicy;

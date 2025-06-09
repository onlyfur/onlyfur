import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentPopupProps {
  onAccept: (preferences: CookiePreferences) => void;
  onDecline: () => void;
}

const CookieConsentPopup: React.FC<CookieConsentPopupProps> = ({ onAccept, onDecline }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const cookieCategories = [
    {
      id: 'necessary',
      title: 'Necessary Cookies',
      description: 'Essential for the basic functionality of the website. These cannot be disabled.',
      required: true,
      examples: 'Authentication, security, basic functionality'
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization, such as remembering your preferences.',
      required: false,
      examples: 'Language preferences, theme settings, user interface customization'
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
      required: false,
      examples: 'Page views, user behavior, performance metrics'
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and track the effectiveness of advertising campaigns.',
      required: false,
      examples: 'Targeted advertising, social media integration, marketing analytics'
    }
  ];

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    onAccept(allAccepted);
  };

  const handleAcceptSelected = () => {
    onAccept(preferences);
  };

  const handleDeclineAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    onAccept(onlyNecessary);
  };

  const updatePreference = (category: keyof CookiePreferences, value: boolean) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <>
      {/* Main Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      🍪 We use cookies to enhance your experience
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We use cookies and similar technologies to provide you with a personalized experience, 
                      analyze site traffic, and improve our services. By clicking "Accept All", you consent 
                      to our use of cookies as described in our{' '}
                      <a 
                        href="/legal/cookie-policy" 
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Cookie Policy
                      </a>
                      {' '}and{' '}
                      <a 
                        href="/legal/privacy-policy" 
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button 
                      onClick={handleAcceptAll}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Accept All
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleDeclineAll}
                      className="border-muted-foreground/30 hover:bg-muted"
                    >
                      Decline All
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowDetails(true)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Settings Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Cookie Preferences
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              <p>
                We respect your privacy and give you control over how we use cookies on our platform. 
                You can enable or disable different categories of cookies below. Please note that 
                disabling some cookies may affect your experience on our site.
              </p>
            </div>

            <Separator />

            <div className="space-y-6">
              {cookieCategories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{category.title}</h4>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Examples:</strong> {category.examples}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <Switch
                        checked={preferences[category.id as keyof CookiePreferences]}
                        onCheckedChange={(checked) => 
                          updatePreference(category.id as keyof CookiePreferences, checked)
                        }
                        disabled={category.required}
                      />
                    </div>
                  </div>
                  
                  {category.id !== 'marketing' && <Separator />}
                </div>
              ))}
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h5 className="font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Learn More
              </h5>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  For detailed information about how we use cookies and your data, please review:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <a 
                      href="/legal/cookie-policy" 
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/legal/privacy-policy" 
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/legal/terms-of-service" 
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)}
              >
                Cancel
              </Button>
              
              <Button 
                onClick={() => {
                  handleAcceptSelected();
                  setShowDetails(false);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsentPopup;

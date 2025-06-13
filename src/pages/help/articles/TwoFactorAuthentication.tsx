import React from 'react';
import { ArrowLeft, Shield, Smartphone, Key, AlertTriangle, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TwoFactorAuthentication: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link to="/help">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Two-Factor Authentication (2FA)
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn how to secure your OnlyFur account with two-factor authentication for enhanced protection.
          </p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            We strongly recommend enabling two-factor authentication for all accounts, especially for creators who manage earnings and sensitive content.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">What is Two-Factor Authentication?</h2>
            <p className="mb-4">
              Two-Factor Authentication (2FA) adds an extra layer of security to your account by requiring two different types of verification:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Something You Know</h3>
                <p className="text-sm text-muted-foreground">
                  Your password
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Something You Have</h3>
                <p className="text-sm text-muted-foreground">
                  Your mobile device or authentication app
                </p>
              </div>
            </div>
            
            <p className="mt-6 text-muted-foreground">
              Even if someone discovers your password, they still can't access your account without the second factor, significantly improving your account security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">2FA Methods on OnlyFur</h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Authenticator App (Recommended)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Use apps like Google Authenticator, Authy, or Microsoft Authenticator to generate time-based verification codes.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Most secure option</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Works without internet or cell service</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Not tied to your phone number</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">SMS Text Message</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Receive a verification code via text message to your registered phone number.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Easy to set up</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>No additional app required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Less secure than authenticator apps</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Requires cell service</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Backup Codes</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      One-time use codes that can be used if you lose access to your primary 2FA method.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Emergency access when other methods aren't available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Must be stored securely</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Each code can only be used once</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Setting Up 2FA with an Authenticator App</h2>
            
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Install an Authenticator App</h3>
                  <p className="text-muted-foreground mb-2">
                    Download and install one of these authenticator apps on your smartphone:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Google Authenticator (Android/iOS)</li>
                    <li>Authy (Android/iOS)</li>
                    <li>Microsoft Authenticator (Android/iOS)</li>
                  </ul>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Access Security Settings</h3>
                  <p className="text-muted-foreground mb-2">
                    Log in to your OnlyFur account, go to Settings → Security → Two-Factor Authentication.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Select Authenticator App</h3>
                  <p className="text-muted-foreground mb-2">
                    Choose "Authenticator App" as your 2FA method and click "Set Up".
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Scan QR Code</h3>
                  <p className="text-muted-foreground mb-2">
                    Open your authenticator app and scan the QR code displayed on the OnlyFur website. Alternatively, you can manually enter the provided secret key.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Enter Verification Code</h3>
                  <p className="text-muted-foreground mb-2">
                    Your authenticator app will generate a 6-digit code. Enter this code on the OnlyFur website to verify setup.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">6</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Save Backup Codes</h3>
                  <p className="text-muted-foreground mb-2">
                    OnlyFur will provide backup codes. Download or copy these codes and store them in a secure location. These are essential if you lose access to your authenticator app.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Setting Up SMS-Based 2FA</h2>
            
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Access Security Settings</h3>
                  <p className="text-muted-foreground mb-2">
                    Log in to your OnlyFur account, go to Settings → Security → Two-Factor Authentication.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Select SMS Method</h3>
                  <p className="text-muted-foreground mb-2">
                    Choose "SMS Text Message" as your 2FA method and click "Set Up".
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Verify Phone Number</h3>
                  <p className="text-muted-foreground mb-2">
                    Enter your phone number and verify it by entering the code sent to your phone.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full h-fit flex items-center justify-center min-w-8">
                  <span className="font-medium">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Save Backup Codes</h3>
                  <p className="text-muted-foreground mb-2">
                    Download or copy the provided backup codes and store them securely.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Using 2FA When Logging In</h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Once 2FA is enabled, here's what happens when you log in:
              </p>
              
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-3 ml-2">
                <li>Enter your username and password as usual</li>
                <li>You'll be prompted for your second factor:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>For authenticator app: Enter the 6-digit code from your app</li>
                    <li>For SMS: Enter the code sent to your phone</li>
                  </ul>
                </li>
                <li>After successful verification, you'll be logged in</li>
              </ol>
              
              <div className="p-4 bg-muted rounded-lg mt-4">
                <h3 className="font-medium mb-2">Trusted Devices</h3>
                <p className="text-sm text-muted-foreground">
                  OnlyFur allows you to mark devices as trusted, which means you won't need to enter a 2FA code every time on that device. You can manage trusted devices in your security settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">What to Do If You Lose Access</h2>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Lost Phone or Authenticator App</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Use one of your backup codes to log in</li>
                  <li>Go to Security Settings and disable or reset 2FA</li>
                  <li>Set up 2FA again with your new device</li>
                </ol>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Lost Backup Codes</h3>
                <p className="text-sm text-muted-foreground">
                  If you still have access to your authenticator app or phone number, log in and generate new backup codes immediately.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Lost Everything</h3>
                <p className="text-sm text-muted-foreground">
                  If you've lost access to both your 2FA device and backup codes, contact OnlyFur support with proof of identity. Recovery may take several days for security verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Additional Security Tips</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Use a Strong Password</h3>
                  <p className="text-muted-foreground">
                    Even with 2FA, a strong password is your first line of defense. Use a unique password with at least 12 characters including numbers, symbols, and mixed case.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Enable Login Notifications</h3>
                  <p className="text-muted-foreground">
                    Get email alerts whenever someone logs into your account from a new device or location.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-full h-fit">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Review Active Sessions</h3>
                  <p className="text-muted-foreground">
                    Regularly check and terminate any unknown sessions in your security settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link to="/help">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Help Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthentication;
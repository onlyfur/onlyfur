import React from 'react';
import { ArrowLeft, Monitor, Smartphone, Shield, Clock, MapPin, Eye, LogOut, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const SessionManagement: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">Session Management</h1>
            <p className="text-muted-foreground">Monitor and control your active login sessions for enhanced security</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Security</Badge>
          <Badge variant="secondary">Account Management</Badge>
          <Badge variant="secondary">Privacy</Badge>
        </div>
      </div>

      {/* What are Sessions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            What are Login Sessions?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            A login session represents an active connection between your OnlyFur account and a device or browser. 
            Each time you log in, a new session is created that keeps you signed in until you log out or the session expires.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-600 mb-3">Session Information Includes:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Device type (Desktop, Mobile, Tablet)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Browser and operating system</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Approximate location</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Last activity time</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-600 mb-3">Why Session Management Matters:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Detect unauthorized access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">End sessions on lost devices</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Monitor account activity</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Improve account security</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Viewing Sessions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Viewing Your Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">How to Access Session Management</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Go to Account Settings</p>
                  <p className="text-sm text-muted-foreground">Click your profile picture &gt; Settings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Navigate to Security Settings</p>
                  <p className="text-sm text-muted-foreground">Find "Privacy &amp; Security" in the sidebar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Select "Active Sessions"</p>
                  <p className="text-sm text-muted-foreground">View all your current login sessions</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Understanding Session Information</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Current Session (This Device)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  This is the device and browser you're currently using. It's marked with a "Current" badge.
                </p>
                <div className="text-sm">
                  <span className="font-medium">Example:</span> Chrome on Windows • Last active: Now • Location: New York, NY
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Other Active Sessions</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These are other devices or browsers where you're currently logged in.
                </p>
                <div className="text-sm">
                  <span className="font-medium">Example:</span> OnlyFur Mobile App • Last active: 2 hours ago • Location: New York, NY
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Managing Sessions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Managing and Ending Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Ending Individual Sessions</h3>
            <p className="text-muted-foreground mb-4">
              You can end any session except your current one. This will immediately log out that device.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Identify the Session</p>
                  <p className="text-sm text-muted-foreground">Look for the device/browser you want to log out</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Click "End Session"</p>
                  <p className="text-sm text-muted-foreground">Click the "End Session" button next to that device</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Confirm Action</p>
                  <p className="text-sm text-muted-foreground">Confirm that you want to end the session</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">End All Other Sessions</h3>
            <p className="text-muted-foreground mb-4">
              For maximum security, you can log out of all devices except your current one with a single click.
            </p>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Important:</strong> This will log you out of all other devices immediately. You'll need to log in again on those devices.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Security Best Practices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Session Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Regular Session Review</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Check your active sessions weekly</li>
              <li>End sessions from devices you no longer use</li>
              <li>Look for unfamiliar locations or devices</li>
              <li>Pay attention to last activity times</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">When to End Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Immediately end sessions if:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Unfamiliar device appears</li>
                  <li>Unknown location shows up</li>
                  <li>You lose a device</li>
                  <li>Someone else had access to your device</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Regularly end sessions for:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Public computers</li>
                  <li>Borrowed devices</li>
                  <li>Old devices you don't use</li>
                  <li>Shared computers</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Additional Security Tips</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">Always log out on public devices</h4>
                <p className="text-sm text-muted-foreground">Never stay logged in on computers that others can access</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Enable two-factor authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to prevent unauthorized logins</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium">Use strong, unique passwords</h4>
                <p className="text-sm text-muted-foreground">Protect your account with a secure password</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Session Management Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Can't See All My Sessions</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Refresh the page and try again</li>
                <li>• Only active sessions are shown</li>
                <li>• Expired sessions are automatically removed</li>
                <li>• Sessions may take a few minutes to appear</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Session Won't End</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Try refreshing the page</li>
                <li>• Use "End All Other Sessions" instead</li>
                <li>• The device may already be offline</li>
                <li>• Contact support if issue persists</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Unfamiliar Session Appeared</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• End the session immediately</li>
                <li>• Change your password</li>
                <li>• Enable two-factor authentication</li>
                <li>• Review recent account activity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Related Help Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/help/articles/account-security" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Account Security</h4>
              <p className="text-sm text-muted-foreground">Best practices for account protection</p>
            </Link>
            <Link to="/help/articles/two-factor-authentication" className="p-3 border rounded-lg hover:bg-muted transition-colors">
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionManagement;

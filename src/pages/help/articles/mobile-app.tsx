import React from 'react';
import { ArrowLeft, Smartphone, Download, Star, Bell, Camera, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const MobileApp: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">OnlyFur Mobile App</h1>
            <p className="text-muted-foreground">Access OnlyFur on the go with our mobile app for iOS and Android</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Mobile</Badge>
          <Badge variant="secondary">App Guide</Badge>
          <Badge variant="secondary">iOS & Android</Badge>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <Download className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Coming Soon:</strong> The OnlyFur mobile app is currently in development. For now, you can access OnlyFur through your mobile browser with our mobile-optimized website.
        </AlertDescription>
      </Alert>

      {/* Mobile Web Experience */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile Web Experience
          </CardTitle>
          <CardDescription>
            Full OnlyFur functionality available through your mobile browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600 mb-2">Mobile Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Responsive design for all screen sizes</li>
                  <li>• Touch-optimized interface</li>
                  <li>• Fast loading and smooth scrolling</li>
                  <li>• Offline content caching</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Available Functions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse and discover creators</li>
                  <li>• Subscribe and manage subscriptions</li>
                  <li>• Send and receive messages</li>
                  <li>• Upload and share content (creators)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-600 mb-2">Optimizations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mobile-first design approach</li>
                  <li>• Gesture-based navigation</li>
                  <li>• Battery-efficient performance</li>
                  <li>• Data usage optimization</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-600 mb-2">Browser Compatibility</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Safari (iOS 12+)</li>
                  <li>• Chrome (Android 8+)</li>
                  <li>• Firefox Mobile</li>
                  <li>• Samsung Internet</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planned App Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Planned Native App Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              When the native app launches, it will include these enhanced mobile features:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-600">Enhanced Notifications</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Push notifications for new content</li>
                  <li>• Custom notification preferences</li>
                  <li>• Real-time message alerts</li>
                  <li>• Creator activity updates</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-600">Advanced Camera Integration</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Built-in photo and video editing</li>
                  <li>• Direct camera capture</li>
                  <li>• Multiple format support</li>
                  <li>• Quality optimization</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-600">Messaging Enhancements</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Voice message support</li>
                  <li>• Media sharing improvements</li>
                  <li>• Chat encryption</li>
                  <li>• Offline message sync</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Download className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-600">Offline Features</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Download content for offline viewing</li>
                  <li>• Sync when connection returns</li>
                  <li>• Reduced data usage options</li>
                  <li>• Background content updates</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Use Mobile Web */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Using OnlyFur on Mobile Browsers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Open Your Mobile Browser</h4>
                <p className="text-sm text-muted-foreground">
                  Launch Safari, Chrome, or your preferred mobile browser and navigate to onlyfur.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Add to Home Screen (Optional)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  For easier access, add OnlyFur to your home screen for an app-like experience.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm"><strong>iOS:</strong> Share button → Add to Home Screen</p>
                  <p className="text-sm"><strong>Android:</strong> Menu → Add to Home screen</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Login and Enjoy</h4>
                <p className="text-sm text-muted-foreground">
                  Sign in with your OnlyFur account and enjoy the full mobile experience with touch-optimized navigation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Mobile Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Best Practices</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Enable browser notifications for messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use landscape mode for better video viewing</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep your browser updated for best performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use WiFi for uploading large content files</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-orange-600 mb-3">Performance Tips</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Clear browser cache regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Close other browser tabs to free memory</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Enable data saver mode on limited plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Update to the latest OS version</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Stay Updated on App Development</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We'll announce the mobile app launch through our official channels. Sign up for notifications to be among the first to know!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/support/contact">Get App Updates</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help/articles/browser-compatibility">Browser Compatibility</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileApp;

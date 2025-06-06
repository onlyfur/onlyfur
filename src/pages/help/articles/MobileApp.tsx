import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Smartphone, Download, Bell, Shield, Zap, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileApp: React.FC = () => {
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
          <Smartphone className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Mobile & Apps</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">OnlyFur mobile app features and download</h1>
        <p className="text-xl text-muted-foreground">
          Get the most out of OnlyFur with our mobile apps for iOS and Android. Access all features on the go with enhanced mobile experience.
        </p>
      </div>

      {/* App Features Overview */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Mobile App Benefits</h3>
          <p className="text-muted-foreground mb-4">
            The OnlyFur mobile app provides a seamless experience optimized for mobile devices with exclusive features not available on the web.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Push Notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Camera Integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Offline Mode</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Enhanced Security</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Download Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2 text-blue-500" />
              Download & Installation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Available Platforms:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">iOS App Store</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Requirements:</strong> iOS 14.0 or later</li>
                    <li>• <strong>Devices:</strong> iPhone, iPad, iPod touch</li>
                    <li>• <strong>Size:</strong> ~85 MB download</li>
                    <li>• <strong>Rating:</strong> 4.8/5 stars</li>
                    <li>• <strong>Last Update:</strong> Weekly updates</li>
                    <li>• Free download with in-app purchases</li>
                  </ul>
                  <Button className="mt-3 w-full" variant="outline">
                    Download for iOS
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Google Play Store</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Requirements:</strong> Android 8.0 (API level 26)</li>
                    <li>• <strong>Devices:</strong> Phones and tablets</li>
                    <li>• <strong>Size:</strong> ~75 MB download</li>
                    <li>• <strong>Rating:</strong> 4.7/5 stars</li>
                    <li>• <strong>Last Update:</strong> Weekly updates</li>
                    <li>• Free download with in-app purchases</li>
                  </ul>
                  <Button className="mt-3 w-full" variant="outline">
                    Download for Android
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Installation Process:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Download from Official Store</p>
                    <p className="text-muted-foreground">Only download from App Store (iOS) or Google Play Store (Android) for security</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Allow Permissions</p>
                    <p className="text-muted-foreground">Grant camera, storage, and notification permissions for full functionality</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Sign In or Register</p>
                    <p className="text-muted-foreground">Use existing OnlyFur credentials or create new account</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Enable Biometric Security</p>
                    <p className="text-muted-foreground">Set up Face ID, Touch ID, or fingerprint login for secure access</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Beta Program:</strong> Join our beta testing program to get early access to new features and help improve the app before public release.</p>
            </div>
          </CardContent>
        </Card>

        {/* App Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Mobile-Exclusive Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Enhanced Mobile Experience:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">Content Creation</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Camera Integration:</strong> Take photos/videos directly in app</li>
                    <li>• <strong>Built-in Editing:</strong> Filters, cropping, basic adjustments</li>
                    <li>• <strong>Quick Upload:</strong> Share content in seconds</li>
                    <li>• <strong>Live Streaming:</strong> Stream directly from your phone</li>
                    <li>• <strong>Story Features:</strong> Temporary content posts</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Notifications & Alerts</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Push Notifications:</strong> Instant alerts for new content</li>
                    <li>• <strong>Custom Alerts:</strong> Set preferences for each creator</li>
                    <li>• <strong>Message Notifications:</strong> Never miss a message</li>
                    <li>• <strong>Live Alerts:</strong> Know when creators go live</li>
                    <li>• <strong>Payment Reminders:</strong> Subscription renewal alerts</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Offline Capabilities</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Download Content:</strong> Save for offline viewing</li>
                    <li>• <strong>Sync When Online:</strong> Auto-sync when connected</li>
                    <li>• <strong>Draft Posts:</strong> Create content offline</li>
                    <li>• <strong>Message Queue:</strong> Send messages when reconnected</li>
                    <li>• <strong>Analytics Cache:</strong> View stats offline</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Security Features</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Biometric Login:</strong> Face ID, Touch ID, fingerprint</li>
                    <li>• <strong>App Lock:</strong> Additional security layer</li>
                    <li>• <strong>Private Mode:</strong> Hide app from recent apps</li>
                    <li>• <strong>Auto-logout:</strong> Secure timeout options</li>
                    <li>• <strong>Device Management:</strong> Control logged-in devices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Mobile-Optimized Interface:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Touch-Friendly Design</p>
                  <p className="text-xs text-muted-foreground">Larger buttons, swipe gestures, and thumb-friendly navigation optimized for one-handed use</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Adaptive Layout</p>
                  <p className="text-xs text-muted-foreground">Interface automatically adjusts for different screen sizes and orientations</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Performance Optimization</p>
                  <p className="text-xs text-muted-foreground">Faster loading, reduced data usage, and battery optimization for mobile devices</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile vs Web Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-blue-500" />
              Mobile App vs Web Browser
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Feature Comparison:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      <th className="text-center p-2">Mobile App</th>
                      <th className="text-center p-2">Web Browser</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-b">
                      <td className="p-2 font-medium">Push Notifications</td>
                      <td className="p-2 text-center text-green-600">✓ Full Support</td>
                      <td className="p-2 text-center text-yellow-600">⚠ Limited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Camera Integration</td>
                      <td className="p-2 text-center text-green-600">✓ Native Camera</td>
                      <td className="p-2 text-center text-yellow-600">⚠ File Upload Only</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Offline Access</td>
                      <td className="p-2 text-center text-green-600">✓ Full Offline Mode</td>
                      <td className="p-2 text-center text-red-600">✗ Online Only</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Biometric Security</td>
                      <td className="p-2 text-center text-green-600">✓ Face/Touch ID</td>
                      <td className="p-2 text-center text-yellow-600">⚠ Browser-dependent</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Performance</td>
                      <td className="p-2 text-center text-green-600">✓ Optimized</td>
                      <td className="p-2 text-center text-yellow-600">⚠ Variable</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Live Streaming</td>
                      <td className="p-2 text-center text-green-600">✓ Native Support</td>
                      <td className="p-2 text-center text-yellow-600">⚠ Limited Features</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Content Download</td>
                      <td className="p-2 text-center text-green-600">✓ Built-in</td>
                      <td className="p-2 text-center text-yellow-600">⚠ Manual Save</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Updates</td>
                      <td className="p-2 text-center text-green-600">✓ Auto-update</td>
                      <td className="p-2 text-center text-green-600">✓ Always Latest</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">When to Use Each:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Mobile App Best For:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Daily browsing and content consumption</li>
                    <li>• Creating and uploading content</li>
                    <li>• Real-time messaging and notifications</li>
                    <li>• On-the-go access and offline viewing</li>
                    <li>• Live streaming and camera features</li>
                    <li>• Enhanced security with biometrics</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Web Browser Best For:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Detailed account management</li>
                    <li>• Complex content editing and scheduling</li>
                    <li>• Comprehensive analytics review</li>
                    <li>• Multi-tab browsing and research</li>
                    <li>• Large screen content creation</li>
                    <li>• Administrative and business tasks</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Tips & Tricks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2 text-green-500" />
              Mobile Tips & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Content Creation Tips:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Photography Tips</p>
                  <p className="text-xs text-muted-foreground">Use natural lighting, clean your camera lens, use the grid for composition, and shoot in landscape for better quality</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Video Guidelines</p>
                  <p className="text-xs text-muted-foreground">Shoot in highest available quality, keep videos stable, ensure good audio, and use horizontal orientation for most content</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Editing Features</p>
                  <p className="text-xs text-muted-foreground">Use built-in filters sparingly, crop for optimal composition, adjust brightness and contrast, and preview before posting</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Performance Optimization:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Battery Life</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Enable dark mode to save battery</li>
                    <li>• Turn off unnecessary notifications</li>
                    <li>• Close app when not in use</li>
                    <li>• Disable background refresh if needed</li>
                    <li>• Lower video quality in settings</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Data Usage</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Download content on Wi-Fi</li>
                    <li>• Adjust video quality settings</li>
                    <li>• Enable data saver mode</li>
                    <li>• Use Wi-Fi for uploads when possible</li>
                    <li>• Monitor usage in settings</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Security Best Practices:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Secure Your Device</p>
                  <p className="text-xs text-muted-foreground">Always lock your phone, use strong passcodes, enable automatic app locking, and don't share your device with others</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">App Permissions</p>
                  <p className="text-xs text-muted-foreground">Only grant necessary permissions, review permissions regularly, and revoke access for unused features</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Public Wi-Fi Safety</p>
                  <p className="text-xs text-muted-foreground">Avoid sensitive activities on public Wi-Fi, use VPN when possible, and prefer cellular data for payments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Troubleshooting Common Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Problems & Solutions:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">App Won't Open or Crashes</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Solutions: Force close and reopen, restart your device, check for app updates, clear app cache (Android), reinstall if necessary</p>
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Login Issues</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Solutions: Check internet connection, verify credentials, reset password, clear app data, contact support for account issues</p>
                  </div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Upload Failures</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Solutions: Check file size and format, ensure stable internet, try uploading on Wi-Fi, restart app, check storage space</p>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Notification Problems</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Solutions: Check notification settings in app and device settings, allow background refresh, check Do Not Disturb mode</p>
                  </div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Performance Issues</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Solutions: Close other apps, restart device, clear cache, free up storage space, update to latest app version</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Getting Help:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">In-App Support</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Tap Settings → Help & Support</li>
                    <li>• Use in-app chat feature</li>
                    <li>• Submit bug reports directly</li>
                    <li>• Access FAQ and tutorials</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">External Support</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Email: mobile@onlyfur.com</li>
                    <li>• Rate and review in app store</li>
                    <li>• Visit help center website</li>
                    <li>• Join community forums</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Articles */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/articles/account-security" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Account security best practices</h4>
              <p className="text-sm text-muted-foreground mt-1">Protect your mobile account</p>
            </Link>
            <Link to="/help/articles/upload-organize-content" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Uploading and organizing content</h4>
              <p className="text-sm text-muted-foreground mt-1">Mobile content creation tips</p>
            </Link>
            <Link to="/help/articles/messaging-creators" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How to message creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Mobile messaging features</p>
            </Link>
            <Link to="/help/articles/payment-methods" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Payment methods and withdrawal options</h4>
              <p className="text-sm text-muted-foreground mt-1">Mobile payment features</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with the Mobile App?</h3>
          <p className="mb-4 opacity-90">Our mobile support team is here to help with app issues, features, and optimization.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Mobile Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileApp;
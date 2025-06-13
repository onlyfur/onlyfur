import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Chrome, Smartphone, Laptop, RefreshCw, AlertTriangle, CheckCircle, XCircle, Settings, MessageCircle, Upload, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrowserCompatibility: React.FC = () => {
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
          <Globe className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Technical</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Browser compatibility</h1>
        <p className="text-xl text-muted-foreground">
          Learn which browsers and devices work best with OnlyFur and how to optimize your browsing experience.
        </p>
      </div>

      {/* Quick Overview */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Browser Compatibility at a Glance</h3>
          <p className="text-muted-foreground mb-4">
            OnlyFur is designed to work on modern browsers across desktop and mobile devices. For the best experience, we recommend using the latest version of Chrome, Firefox, Safari, or Edge.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Chrome className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Recommended Browsers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Laptop className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Desktop Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Mobile Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Troubleshooting</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Supported Browsers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Chrome className="w-5 h-5 mr-2 text-blue-500" />
              Supported Browsers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Browser Compatibility Chart:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">Browser</th>
                      <th className="border p-2">Minimum Version</th>
                      <th className="border p-2">Recommended Version</th>
                      <th className="border p-2">Support Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-green-50 dark:bg-green-900/10">
                      <td className="border p-2 font-medium">Google Chrome</td>
                      <td className="border p-2">88+</td>
                      <td className="border p-2">Latest</td>
                      <td className="border p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Full Support
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-green-50 dark:bg-green-900/10">
                      <td className="border p-2 font-medium">Mozilla Firefox</td>
                      <td className="border p-2">85+</td>
                      <td className="border p-2">Latest</td>
                      <td className="border p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Full Support
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-green-50 dark:bg-green-900/10">
                      <td className="border p-2 font-medium">Microsoft Edge</td>
                      <td className="border p-2">88+ (Chromium)</td>
                      <td className="border p-2">Latest</td>
                      <td className="border p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Full Support
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-green-50 dark:bg-green-900/10">
                      <td className="border p-2 font-medium">Apple Safari</td>
                      <td className="border p-2">14+</td>
                      <td className="border p-2">Latest</td>
                      <td className="border p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Full Support
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Opera</td>
                      <td className="border p-2">74+</td>
                      <td className="border p-2">Latest</td>
                      <td className="border p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                          Good Support
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Samsung Internet</td>
                      <td className="border p-2">14+</td>
                      <td className="border p-2">Latest</td>
                      <td className="border p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                          Good Support
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-red-50 dark:bg-red-900/10">
                      <td className="border p-2 font-medium">Internet Explorer</td>
                      <td className="border p-2">Not Supported</td>
                      <td className="border p-2">Not Supported</td>
                      <td className="border p-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          No Support
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Support Level Definitions:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 border-green-200 bg-green-50 dark:bg-green-900/10">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <h5 className="font-medium text-green-700">Full Support</h5>
                  </div>
                  <p className="text-sm text-green-700">All features work as expected. Regular testing and optimization ensure the best experience.</p>
                </div>
                <div className="border rounded-lg p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                    <h5 className="font-medium text-yellow-700">Good Support</h5>
                  </div>
                  <p className="text-sm text-yellow-700">Most features work well, but some advanced features may have minor issues or performance limitations.</p>
                </div>
                <div className="border rounded-lg p-4 border-red-200 bg-red-50 dark:bg-red-900/10">
                  <div className="flex items-center mb-2">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <h5 className="font-medium text-red-700">No Support</h5>
                  </div>
                  <p className="text-sm text-red-700">The browser is not supported. Critical features will not work correctly, and we recommend switching to a supported browser.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Browser Recommendation:</strong> For the best experience on OnlyFur, we recommend using the latest version of Google Chrome or Mozilla Firefox. These browsers offer the best performance, feature support, and security for our platform.</p>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Compatibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Laptop className="w-5 h-5 mr-2 text-purple-500" />
              Desktop Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Operating System Compatibility:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Windows</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Supported versions:</strong> Windows 10, 11</li>
                    <li>• <strong>Partially supported:</strong> Windows 8.1</li>
                    <li>• <strong>Not supported:</strong> Windows 7 and earlier</li>
                    <li>• <strong>Recommended browsers:</strong> Chrome, Firefox, Edge</li>
                    <li>• <strong>Notes:</strong> Best performance with hardware acceleration enabled</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">macOS</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Supported versions:</strong> macOS 10.15 (Catalina) and newer</li>
                    <li>• <strong>Partially supported:</strong> macOS 10.14 (Mojave)</li>
                    <li>• <strong>Not supported:</strong> macOS 10.13 and earlier</li>
                    <li>• <strong>Recommended browsers:</strong> Safari, Chrome, Firefox</li>
                    <li>• <strong>Notes:</strong> Safari offers best battery performance</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Linux</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Supported distributions:</strong> Ubuntu 20.04+, Fedora 34+, other modern distros</li>
                    <li>• <strong>Recommended browsers:</strong> Firefox, Chrome</li>
                    <li>• <strong>Notes:</strong> Video playback performance may vary by distribution</li>
                    <li>• <strong>Hardware acceleration:</strong> May require additional configuration</li>
                    <li>• <strong>Support level:</strong> Community supported</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Hardware Requirements:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Minimum Requirements</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Processor:</strong> Dual-core 2.0 GHz or equivalent</li>
                    <li>• <strong>RAM:</strong> 4 GB</li>
                    <li>• <strong>Graphics:</strong> Integrated graphics with hardware acceleration</li>
                    <li>• <strong>Display:</strong> 1366 × 768 resolution</li>
                    <li>• <strong>Internet:</strong> 5 Mbps download, 2 Mbps upload</li>
                    <li>• <strong>Storage:</strong> 1 GB available space for caching</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Recommended Specifications</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Processor:</strong> Quad-core 2.5 GHz or equivalent</li>
                    <li>• <strong>RAM:</strong> 8 GB or more</li>
                    <li>• <strong>Graphics:</strong> Dedicated graphics card with 2GB+ VRAM</li>
                    <li>• <strong>Display:</strong> 1920 × 1080 resolution or higher</li>
                    <li>• <strong>Internet:</strong> 25+ Mbps download, 5+ Mbps upload</li>
                    <li>• <strong>Storage:</strong> SSD with 5+ GB available space</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Desktop Performance Tip:</strong> For the best experience when viewing high-resolution content or streaming videos, ensure your browser's hardware acceleration is enabled. This setting allows your graphics card to assist with rendering, resulting in smoother playback and better overall performance.</p>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Compatibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-green-500" />
              Mobile Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Mobile Device Support:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">iOS Devices</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Supported versions:</strong> iOS 14 and newer</li>
                    <li>• <strong>Partially supported:</strong> iOS 13</li>
                    <li>• <strong>Not supported:</strong> iOS 12 and earlier</li>
                    <li>• <strong>Recommended browsers:</strong> Safari, Chrome</li>
                    <li>• <strong>Supported devices:</strong> iPhone 8 and newer, iPad 6th gen and newer</li>
                    <li>• <strong>Notes:</strong> Safari provides best integration with iOS</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Android Devices</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Supported versions:</strong> Android 9.0 (Pie) and newer</li>
                    <li>• <strong>Partially supported:</strong> Android 8.0 (Oreo)</li>
                    <li>• <strong>Not supported:</strong> Android 7.0 and earlier</li>
                    <li>• <strong>Recommended browsers:</strong> Chrome, Firefox, Samsung Internet</li>
                    <li>• <strong>Hardware:</strong> 2GB+ RAM recommended</li>
                    <li>• <strong>Notes:</strong> Experience may vary by device manufacturer</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Mobile App vs. Mobile Browser:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">Feature</th>
                      <th className="border p-2">OnlyFur Mobile App</th>
                      <th className="border p-2">Mobile Browser</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Performance</td>
                      <td className="border p-2">Optimized, faster loading</td>
                      <td className="border p-2">Good, but may be slower</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Notifications</td>
                      <td className="border p-2">Push notifications supported</td>
                      <td className="border p-2">Limited notification support</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Offline Access</td>
                      <td className="border p-2">Limited offline content available</td>
                      <td className="border p-2">No offline access</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Video Playback</td>
                      <td className="border p-2">Optimized for mobile devices</td>
                      <td className="border p-2">Depends on browser capabilities</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Battery Usage</td>
                      <td className="border p-2">More efficient</td>
                      <td className="border p-2">Higher battery consumption</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Storage Usage</td>
                      <td className="border p-2">Requires app installation (100MB+)</td>
                      <td className="border p-2">Only browser cache storage</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Updates</td>
                      <td className="border p-2">Requires app updates</td>
                      <td className="border p-2">Always on latest version</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Mobile Recommendation:</strong> For the best mobile experience, we recommend downloading our official OnlyFur mobile app from the App Store or Google Play Store. The app provides better performance, notifications, and a more optimized interface for mobile devices.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <AppleIcon className="w-4 h-4 mr-2" />
                  Download for iOS
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <AndroidIcon className="w-4 h-4 mr-2" />
                  Download for Android
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Browser Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-orange-500" />
              Optimizing Browser Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Recommended Browser Settings:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Chrome Settings</h5>
                  <ol className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                      <div>
                        <p className="font-medium">Enable Hardware Acceleration</p>
                        <p className="text-muted-foreground">Settings → Advanced → System → "Use hardware acceleration when available"</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                      <div>
                        <p className="font-medium">Update to Latest Version</p>
                        <p className="text-muted-foreground">Settings → About Chrome</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                      <div>
                        <p className="font-medium">Clear Cache and Cookies</p>
                        <p className="text-muted-foreground">Settings → Privacy and security → Clear browsing data</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                      <div>
                        <p className="font-medium">Disable Conflicting Extensions</p>
                        <p className="text-muted-foreground">Settings → Extensions → Disable ad blockers or privacy extensions that might interfere</p>
                      </div>
                    </li>
                  </ol>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Firefox Settings</h5>
                  <ol className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                      <div>
                        <p className="font-medium">Enable Hardware Acceleration</p>
                        <p className="text-muted-foreground">Settings → General → Performance → "Use recommended performance settings"</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                      <div>
                        <p className="font-medium">Update to Latest Version</p>
                        <p className="text-muted-foreground">Menu → Help → About Firefox</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                      <div>
                        <p className="font-medium">Adjust Content Blocking</p>
                        <p className="text-muted-foreground">Settings → Privacy & Security → "Standard" protection recommended</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                      <div>
                        <p className="font-medium">Clear Cache and Cookies</p>
                        <p className="text-muted-foreground">Settings → Privacy & Security → Cookies and Site Data → Clear Data</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Cookie and Privacy Settings:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Required Cookies</p>
                  <p className="text-xs text-muted-foreground">
                    OnlyFur requires certain cookies to function properly. These include:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1 pl-5 list-disc">
                    <li>Authentication cookies (to keep you logged in)</li>
                    <li>Session cookies (to maintain your browsing session)</li>
                    <li>Preference cookies (to remember your settings)</li>
                    <li>Security cookies (to protect your account)</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Privacy Extensions</p>
                  <p className="text-xs text-muted-foreground">
                    Some privacy extensions and ad blockers may interfere with OnlyFur functionality:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1 pl-5 list-disc">
                    <li>Consider adding OnlyFur to your extension's allowlist</li>
                    <li>Temporarily disable extensions if you experience issues</li>
                    <li>Use private/incognito mode to test if extensions are causing problems</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Local Storage</p>
                  <p className="text-xs text-muted-foreground">
                    OnlyFur uses local storage to improve performance and user experience:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1 pl-5 list-disc">
                    <li>Ensure your browser allows local storage</li>
                    <li>Clearing site data will reset your preferences</li>
                    <li>Private browsing modes may limit local storage functionality</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Browser Settings Tip:</strong> If you experience performance issues, try these steps in order: 1) Clear your browser cache and cookies, 2) Disable extensions, 3) Enable hardware acceleration, 4) Update your browser to the latest version, 5) Try a different supported browser.</p>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Common Browser Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Troubleshooting Common Problems:</h4>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">Video Playback Issues</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Symptoms:</strong> Videos buffer constantly, won't play, or display poor quality.</p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ol className="text-sm space-y-1 pl-5 list-decimal">
                        <li>Check your internet connection speed (minimum 5 Mbps recommended)</li>
                        <li>Enable hardware acceleration in your browser settings</li>
                        <li>Try lowering the video quality in the player settings</li>
                        <li>Clear browser cache and cookies</li>
                        <li>Update your graphics drivers</li>
                        <li>Try a different browser (Chrome or Firefox recommended)</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">Page Loading Issues</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Symptoms:</strong> Pages load slowly, images don't appear, or interface elements are missing.</p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ol className="text-sm space-y-1 pl-5 list-decimal">
                        <li>Clear browser cache and cookies</li>
                        <li>Disable browser extensions, especially ad blockers</li>
                        <li>Check your internet connection</li>
                        <li>Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)</li>
                        <li>Ensure JavaScript is enabled in your browser</li>
                        <li>Try incognito/private browsing mode</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">Login and Authentication Issues</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Symptoms:</strong> Can't log in, keep getting logged out, or session expires too quickly.</p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ol className="text-sm space-y-1 pl-5 list-decimal">
                        <li>Ensure cookies are enabled in your browser</li>
                        <li>Check if your browser is set to clear cookies on exit</li>
                        <li>Disable privacy extensions that might block authentication cookies</li>
                        <li>Try a different browser</li>
                        <li>Check if your account has been locked (too many login attempts)</li>
                        <li>Reset your password if necessary</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">Upload and Download Issues</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Symptoms:</strong> Can't upload content, downloads fail, or transfers are extremely slow.</p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ol className="text-sm space-y-1 pl-5 list-decimal">
                        <li>Check your internet upload/download speed</li>
                        <li>Ensure your browser has permission to access files</li>
                        <li>Try a different browser (Chrome has best upload performance)</li>
                        <li>Disable any download manager extensions</li>
                        <li>Check if your firewall is blocking uploads/downloads</li>
                        <li>For large files, use our desktop uploader tool if available</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Quick Fix:</strong> If you're experiencing persistent browser issues with OnlyFur, try this quick troubleshooting sequence:</p>
              <ol className="text-sm mt-2 space-y-1 list-decimal pl-5">
                <li>Clear your browser cache and cookies</li>
                <li>Restart your browser</li>
                <li>Try incognito/private browsing mode</li>
                <li>If the issue persists, try a different supported browser</li>
                <li>If all browsers have the same issue, check your internet connection</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Browser-Specific Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Chrome className="w-5 h-5 mr-2 text-blue-500" />
              Browser-Specific Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Chrome</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Best overall performance and compatibility</li>
                  <li>• Enable hardware acceleration for smoother video</li>
                  <li>• Use Chrome's built-in task manager to identify resource-heavy tabs</li>
                  <li>• Consider using the "Lite" mode for slower connections</li>
                  <li>• Extensions like "h264ify" can improve YouTube video performance</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Firefox</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Good balance of privacy and performance</li>
                  <li>• Set Enhanced Tracking Protection to "Standard" for OnlyFur</li>
                  <li>• Enable DNS over HTTPS for additional security</li>
                  <li>• Use about:performance to monitor resource usage</li>
                  <li>• Consider creating a separate profile for OnlyFur usage</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Safari</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Best battery life on macOS and iOS devices</li>
                  <li>• Enable "Develop" menu for advanced troubleshooting</li>
                  <li>• Check "Privacy Report" to see what's being blocked</li>
                  <li>• Disable "Prevent cross-site tracking" if experiencing issues</li>
                  <li>• Use "Website Settings" to allow all cookies for OnlyFur</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Edge</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Good integration with Windows systems</li>
                  <li>• Use "Efficiency mode" to reduce resource usage</li>
                  <li>• Set tracking prevention to "Balanced" for OnlyFur</li>
                  <li>• Enable "Strict" enhancement for better security</li>
                  <li>• Use vertical tabs for better organization</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📝 Browser Extensions to Consider</h4>
              <p className="text-sm">These extensions can enhance your OnlyFur experience:</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm mt-2">
                <ul className="space-y-1">
                  <li>• <strong>Dark Reader:</strong> For comfortable night browsing</li>
                  <li>• <strong>uBlock Origin:</strong> Ad blocking (whitelist OnlyFur)</li>
                  <li>• <strong>HTTPS Everywhere:</strong> Enhanced security</li>
                  <li>• <strong>Honey:</strong> Find discount codes for subscriptions</li>
                </ul>
                <ul className="space-y-1">
                  <li>• <strong>Grammarly:</strong> For better messaging</li>
                  <li>• <strong>LastPass/Bitwarden:</strong> Secure password management</li>
                  <li>• <strong>Enhancer for YouTube:</strong> Better video controls</li>
                  <li>• <strong>OneTab:</strong> Reduce browser memory usage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Having Browser Issues?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our technical support team can help troubleshoot browser-specific problems and provide personalized assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-blue-600 hover:text-blue-700" asChild>
                <Link to="/contact">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/help">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Help Center
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-center">Related Help Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Upload Troubleshooting</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Solutions for common upload issues and errors.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/upload-troubleshooting">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Video className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Video Quality</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Guidelines for optimal video quality and performance.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/video-quality">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Smartphone className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Mobile App</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Information about our mobile applications.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/mobile-app">Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom icons
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const AndroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" {...props}>
    <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55"/>
  </svg>
);

export default BrowserCompatibility;
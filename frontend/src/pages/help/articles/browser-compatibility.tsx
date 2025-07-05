import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Monitor, Smartphone, Tablet } from 'lucide-react';

export default function BrowserCompatibility() {
  const supportedBrowsers = [
    { name: 'Chrome', version: '90+', status: 'full', icon: '🟢' },
    { name: 'Firefox', version: '88+', status: 'full', icon: '🟢' },
    { name: 'Safari', version: '14+', status: 'full', icon: '🟢' },
    { name: 'Edge', version: '90+', status: 'full', icon: '🟢' },
    { name: 'Opera', version: '76+', status: 'partial', icon: '🟡' },
    { name: 'Internet Explorer', version: 'Any', status: 'unsupported', icon: '🔴' }
  ];

  const mobileBrowsers = [
    { name: 'Chrome Mobile', version: '90+', status: 'full' },
    { name: 'Safari Mobile', version: '14+', status: 'full' },
    { name: 'Firefox Mobile', version: '88+', status: 'partial' },
    { name: 'Samsung Internet', version: '14+', status: 'partial' }
  ];

  const features = [
    { name: 'Video Streaming', requirement: 'HTML5 Video support', status: 'Required' },
    { name: 'File Uploads', requirement: 'Drag & Drop API', status: 'Required' },
    { name: 'Real-time Messaging', requirement: 'WebSocket support', status: 'Required' },
    { name: 'Neural Search', requirement: 'Modern JavaScript (ES6+)', status: 'Required' },
    { name: 'Payment Processing', requirement: 'TLS 1.2+ support', status: 'Required' },
    { name: 'Push Notifications', requirement: 'Service Worker support', status: 'Optional' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Browser Compatibility
          </CardTitle>
          <p className="text-muted-foreground">
            OnlyFur is designed to work seamlessly across modern browsers. Here's what you need to know about browser support and technical requirements.
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Desktop Browser Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportedBrowsers.map((browser) => (
              <div key={browser.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{browser.icon}</span>
                  <div>
                    <h4 className="font-medium">{browser.name}</h4>
                    <p className="text-sm text-muted-foreground">Version {browser.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {browser.status === 'full' && (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Full Support</Badge>
                    </>
                  )}
                  {browser.status === 'partial' && (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Partial Support</Badge>
                    </>
                  )}
                  {browser.status === 'unsupported' && (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <Badge variant="destructive">Not Supported</Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Mobile Browser Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mobileBrowsers.map((browser) => (
              <div key={browser.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{browser.name}</h4>
                  <p className="text-sm text-muted-foreground">Version {browser.version}</p>
                </div>
                <div className="flex items-center gap-2">
                  {browser.status === 'full' && (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Full Support</Badge>
                    </>
                  )}
                  {browser.status === 'partial' && (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Partial Support</Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <h4 className="font-medium">Minimum System Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>RAM:</strong> 2GB+ (4GB+ recommended)</li>
                <li>• <strong>Internet:</strong> Broadband connection (10 Mbps+ for streaming)</li>
                <li>• <strong>JavaScript:</strong> Must be enabled</li>
                <li>• <strong>Cookies:</strong> Must be enabled for login and preferences</li>
                <li>• <strong>Local Storage:</strong> Required for offline features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{feature.name}</h4>
                  <p className="text-sm text-muted-foreground">{feature.requirement}</p>
                </div>
                <Badge 
                  variant={feature.status === 'Required' ? 'destructive' : 'secondary'}
                  className={feature.status === 'Required' ? '' : 'bg-blue-100 text-blue-700'}
                >
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Common Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-medium">Video won't play</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Update your browser to the latest version</li>
                <li>• Check if hardware acceleration is enabled</li>
                <li>• Clear browser cache and cookies</li>
                <li>• Disable browser extensions temporarily</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Upload issues</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Ensure your browser supports drag & drop</li>
                <li>• Check file size limits (500MB max per file)</li>
                <li>• Try uploading one file at a time</li>
                <li>• Check your internet connection stability</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Page loading slowly</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Close unnecessary browser tabs</li>
                <li>• Clear browser cache</li>
                <li>• Disable unnecessary browser extensions</li>
                <li>• Check your internet speed</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Login problems</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Ensure cookies are enabled</li>
                <li>• Check if third-party cookies are blocked</li>
                <li>• Try incognito/private browsing mode</li>
                <li>• Clear browser data and try again</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Getting Help</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you're still experiencing issues after trying these solutions:
          </p>
          <ul className="space-y-2 text-sm">
            <li>• Check our <a href="/help" className="text-primary hover:underline">Help Center</a> for more guides</li>
            <li>• Contact our <a href="/support/contact" className="text-primary hover:underline">Support Team</a> with your browser and version details</li>
            <li>• Include any error messages you're seeing</li>
            <li>• Let us know what you were trying to do when the issue occurred</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

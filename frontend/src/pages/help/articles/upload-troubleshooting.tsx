import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Wifi, HardDrive, Clock, RefreshCw } from 'lucide-react';

export default function UploadTroubleshooting() {
  const commonIssues = [
    {
      issue: 'Upload fails immediately',
      icon: XCircle,
      severity: 'high',
      causes: [
        'File format not supported',
        'File size exceeds limit',
        'Network connection lost',
        'Browser compatibility issue'
      ],
      solutions: [
        'Check supported file formats in help center',
        'Compress large files or break into smaller parts',
        'Test internet connection and retry',
        'Try a different browser or update current one'
      ]
    },
    {
      issue: 'Upload starts but stops midway',
      icon: AlertCircle,
      severity: 'medium',
      causes: [
        'Unstable internet connection',
        'Browser tab became inactive',
        'Computer went to sleep',
        'Network timeout'
      ],
      solutions: [
        'Keep browser tab active during upload',
        'Disable computer sleep mode',
        'Use wired connection instead of Wi-Fi',
        'Try uploading during off-peak hours'
      ]
    },
    {
      issue: 'Very slow upload speeds',
      icon: Clock,
      severity: 'medium',
      causes: [
        'Large file size',
        'Network congestion',
        'Multiple uploads running',
        'Background applications using bandwidth'
      ],
      solutions: [
        'Upload one file at a time',
        'Close bandwidth-heavy applications',
        'Compress files before uploading',
        'Upload during off-peak hours (late night/early morning)'
      ]
    },
    {
      issue: 'File uploads but won\'t process',
      icon: RefreshCw,
      severity: 'low',
      causes: [
        'File corruption during upload',
        'Unsupported codec or format variation',
        'Server processing queue backlog',
        'File contains invalid metadata'
      ],
      solutions: [
        'Re-upload the file',
        'Convert file to standard format',
        'Wait for processing queue to clear',
        'Remove or update file metadata'
      ]
    }
  ];

  const preventiveMeasures = [
    {
      category: 'Network Optimization',
      icon: Wifi,
      tips: [
        'Use wired ethernet connection when possible',
        'Close other devices using the same network',
        'Pause cloud syncing (Dropbox, Google Drive, etc.)',
        'Test upload speed at speedtest.net',
        'Consider upgrading internet plan for regular large uploads'
      ]
    },
    {
      category: 'File Preparation',
      icon: HardDrive,
      tips: [
        'Verify file integrity before uploading',
        'Use standard, widely-supported formats',
        'Compress files appropriately for web delivery',
        'Remove unnecessary metadata to reduce file size',
        'Test files locally to ensure they work properly'
      ]
    },
    {
      category: 'Browser Optimization',
      icon: CheckCircle,
      tips: [
        'Keep browser updated to latest version',
        'Clear cache and cookies regularly',
        'Disable unnecessary browser extensions',
        'Increase browser memory allocation if possible',
        'Use incognito/private mode for uploads if issues persist'
      ]
    }
  ];

  const quickDiagnostics = [
    {
      check: 'Internet Connection',
      description: 'Test your connection speed and stability',
      action: 'Run speed test and check for packet loss'
    },
    {
      check: 'File Compatibility',
      description: 'Verify file format and size requirements',
      action: 'Check against supported formats list'
    },
    {
      check: 'Browser Health',
      description: 'Ensure browser is updated and functioning',
      action: 'Clear cache, update browser, disable extensions'
    },
    {
      check: 'System Resources',
      description: 'Check available memory and CPU usage',
      action: 'Close unnecessary applications and processes'
    }
  ];

  const errorCodes = [
    { code: 'ERR_001', meaning: 'File too large', solution: 'Reduce file size or upgrade account' },
    { code: 'ERR_002', meaning: 'Unsupported format', solution: 'Convert to supported format' },
    { code: 'ERR_003', meaning: 'Network timeout', solution: 'Check connection and retry' },
    { code: 'ERR_004', meaning: 'Storage quota exceeded', solution: 'Delete old content or upgrade plan' },
    { code: 'ERR_005', meaning: 'Server busy', solution: 'Wait and retry in a few minutes' },
    { code: 'ERR_006', meaning: 'Authentication failed', solution: 'Log out and log back in' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Upload Troubleshooting
          </CardTitle>
          <p className="text-muted-foreground">
            Common upload issues and their solutions to help you get your content uploaded successfully.
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Diagnostics Checklist</CardTitle>
          <p className="text-muted-foreground">
            Run through these quick checks before diving into specific troubleshooting steps.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quickDiagnostics.map((check, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{check.check}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{check.description}</p>
                  <p className="text-sm font-medium">{check.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Upload Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {commonIssues.map((issue, index) => {
              const IconComponent = issue.icon;
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className={`w-5 h-5 ${
                      issue.severity === 'high' ? 'text-red-500' :
                      issue.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <h4 className="font-medium">{issue.issue}</h4>
                    <Badge variant={
                      issue.severity === 'high' ? 'destructive' :
                      issue.severity === 'medium' ? 'default' :
                      'secondary'
                    }>
                      {issue.severity} priority
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Common Causes:</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {issue.causes.map((cause, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Solutions:</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {issue.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Code Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errorCodes.map((error) => (
              <div key={error.code} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono">{error.code}</Badge>
                    <span className="font-medium">{error.meaning}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{error.solution}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preventive Measures</CardTitle>
          <p className="text-muted-foreground">
            Best practices to avoid upload issues before they happen.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {preventiveMeasures.map((section) => {
              const IconComponent = section.icon;
              return (
                <div key={section.category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">{section.category}</h4>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {section.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Network Analysis</h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium mb-2">Tools to test your connection:</h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Speedtest.net:</strong> Test download/upload speeds</li>
                  <li>• <strong>Ping test:</strong> Check connection stability</li>
                  <li>• <strong>Traceroute:</strong> Identify network routing issues</li>
                  <li>• <strong>Browser dev tools:</strong> Monitor network requests</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Browser Console Debugging</h4>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h5 className="font-medium mb-2">How to check for JavaScript errors:</h5>
                <ol className="space-y-1 text-sm text-muted-foreground">
                  <li>1. Press F12 to open developer tools</li>
                  <li>2. Go to the "Console" tab</li>
                  <li>3. Attempt your upload</li>
                  <li>4. Look for red error messages</li>
                  <li>5. Include these errors when contacting support</li>
                </ol>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Alternative Upload Methods</h4>
              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-medium mb-2">If standard upload fails, try:</h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use a different browser (Chrome, Firefox, Safari)</li>
                  <li>• Try incognito/private browsing mode</li>
                  <li>• Upload from a different device</li>
                  <li>• Use a different network (mobile hotspot)</li>
                  <li>• Upload files individually instead of in batches</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>When to Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Contact our support team if you've tried the above solutions and still experience issues. 
              Include the following information for faster resolution:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Technical Information:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Browser name and version</li>
                  <li>• Operating system</li>
                  <li>• File size and format</li>
                  <li>• Error codes or messages</li>
                  <li>• Upload attempt timestamps</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Behavior Description:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• What you were trying to upload</li>
                  <li>• When the issue started</li>
                  <li>• What happens vs. what you expected</li>
                  <li>• Steps you've already tried</li>
                  <li>• Frequency of the issue</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 border rounded-lg">
              <p className="text-sm">
                <strong>Support Contact:</strong> Visit our <a href="/support/contact" className="text-primary hover:underline">Contact Support page</a> or email support@onlyfur.net with your issue details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

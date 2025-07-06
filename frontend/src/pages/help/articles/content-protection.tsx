import React from 'react';
import { Shield, Lock, Eye, AlertTriangle, FileText, Zap, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';

const ContentProtection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 rounded-lg">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Protection for Creators
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Comprehensive tools and strategies to protect your valuable content from unauthorized use and distribution.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Security</Badge>
            <Badge variant="secondary">Copyright</Badge>
            <Badge variant="secondary">Protection</Badge>
            <Badge variant="secondary">DMCA</Badge>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Content protection is crucial for maintaining your revenue and intellectual property rights. This guide covers our built-in protections and additional steps you can take.
        </AlertDescription>
      </Alert>

      {/* Built-in Protection Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Built-in Protection Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Access Controls</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Subscription-gated content</li>
                <li>• Tier-based access levels</li>
                <li>• Geographic restrictions</li>
                <li>• Time-limited access</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Technical Protections</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Right-click protection</li>
                <li>• Download prevention</li>
                <li>• Screen recording detection</li>
                <li>• URL obfuscation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Watermarking Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Watermarking Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-1">Visual Watermarks</h4>
              <p className="text-sm text-gray-600">Add semi-transparent logos or text overlays to images and videos</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-1">Digital Fingerprinting</h4>
              <p className="text-sm text-gray-600">Embed invisible metadata that identifies you as the creator</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold mb-1">Dynamic Watermarks</h4>
              <p className="text-sm text-gray-600">Include subscriber information to trace leaks back to specific users</p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Watermark Placement Tips:</h4>
            <ul className="text-sm space-y-1">
              <li>• Place watermarks across important content areas</li>
              <li>• Use multiple small watermarks rather than one large one</li>
              <li>• Make them visible but not overly distracting</li>
              <li>• Consider animated watermarks for videos</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring and Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Monitoring for Unauthorized Use
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="font-semibold mb-1">Reverse Image Search</h4>
              <p className="text-sm text-gray-600">Use Google Images, TinEye, or other tools to find copies</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-1">Automated Monitoring</h4>
              <p className="text-sm text-gray-600">Set up Google Alerts for your content and brand name</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-1">Community Reports</h4>
              <p className="text-sm text-gray-600">Encourage fans to report unauthorized sharing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DMCA and Takedown Procedures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            DMCA Takedown Process
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Document the Infringement</h4>
                <p className="text-sm text-gray-600">Take screenshots, save URLs, and gather evidence of unauthorized use</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Contact Our Support Team</h4>
                <p className="text-sm text-gray-600">Submit a report with all evidence through our support portal</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Platform Action</h4>
                <p className="text-sm text-gray-600">We'll file DMCA takedowns and pursue legal action when necessary</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Required Information for DMCA Claims:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Your contact information and signature</li>
              <li>• Description of copyrighted work being infringed</li>
              <li>• URL or location of infringing material</li>
              <li>• Statement of good faith belief</li>
              <li>• Statement of accuracy under penalty of perjury</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Prevention Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Prevention Strategies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Content Strategy</h4>
              <ul className="text-sm space-y-1">
                <li>• Create exclusive, time-sensitive content</li>
                <li>• Use progressive reveal techniques</li>
                <li>• Offer personalized interactions</li>
                <li>• Build strong community relationships</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technical Measures</h4>
              <ul className="text-sm space-y-1">
                <li>• Enable all available platform protections</li>
                <li>• Use secure hosting for external links</li>
                <li>• Implement regular content audits</li>
                <li>• Monitor subscriber behavior patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Legal Resources and Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Legal Assistance</h4>
              <p className="text-sm text-gray-600 mb-2">
                For serious copyright infringement cases, consider consulting with an intellectual property attorney.
              </p>
              <p className="text-sm text-gray-600">
                We can provide documentation and evidence to support your legal proceedings.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Creator Protection Fund</h4>
              <p className="text-sm text-gray-600">
                High-tier creators may be eligible for legal support through our Creator Protection Fund. Contact support for details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help Right Now?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Report Infringement</h4>
              <p className="text-sm text-red-700 mb-3">
                Found unauthorized use of your content? Report it immediately.
              </p>
              <button className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Submit Report
              </button>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Contact Support</h4>
              <p className="text-sm text-blue-700 mb-3">
                Questions about content protection? Our team is here to help.
              </p>
              <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Contact Support
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentProtection;

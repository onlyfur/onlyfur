import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Flag, Shield, AlertTriangle, Eye, Ban, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportUserContent: React.FC = () => {
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
          <Flag className="w-6 h-6 text-red-500" />
          <Badge variant="secondary">Safety & Privacy</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">How to report users or content</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to report inappropriate content, users, or behavior to help maintain a safe community on OnlyFur.
        </p>
      </div>

      {/* Quick Reporting */}
      <Card className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Emergency Reporting</h3>
          <p className="text-muted-foreground mb-4">
            For urgent safety concerns, illegal content, or immediate threats, contact our emergency response team immediately.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Immediate Danger</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Illegal Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <Ban className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium">Severe Violations</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* What to Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flag className="w-5 h-5 mr-2 text-red-500" />
              What Should Be Reported
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Content Violations:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Immediate Removal Required</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Illegal content (child exploitation, revenge porn)</li>
                    <li>• Non-consensual content sharing</li>
                    <li>• Doxxing or personal information sharing</li>
                    <li>• Real-world threats or violence</li>
                    <li>• Hate speech targeting individuals</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Policy Violations</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Copyright infringement or art theft</li>
                    <li>• Spam or excessive self-promotion</li>
                    <li>• Impersonation of other users</li>
                    <li>• Misleading content or scams</li>
                    <li>• Content outside community guidelines</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">User Behavior Issues:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Harassment & Bullying</p>
                  <p className="text-xs text-muted-foreground">Persistent unwanted contact, intimidation, coordinated harassment, or public shaming</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Inappropriate Communication</p>
                  <p className="text-xs text-muted-foreground">Unwanted sexual advances, persistent messaging after being asked to stop, or boundary violations</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Platform Manipulation</p>
                  <p className="text-xs text-muted-foreground">Fake accounts, vote manipulation, circumventing bans, or gaming the system</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Commercial Abuse</p>
                  <p className="text-xs text-muted-foreground">Off-platform sales pressure, pyramid schemes, or violating creator terms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              How to Submit Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Reporting Content:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Find the Report Button</p>
                    <p className="text-muted-foreground">Look for the three-dot menu or flag icon on posts, comments, or profiles</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Select Report Type</p>
                    <p className="text-muted-foreground">Choose the most appropriate category from the dropdown menu</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Provide Details</p>
                    <p className="text-muted-foreground">Include specific information about the violation and context</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Submit Evidence</p>
                    <p className="text-muted-foreground">Screenshots, chat logs, or other relevant documentation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                  <div>
                    <p className="font-medium">Receive Confirmation</p>
                    <p className="text-muted-foreground">Get a report ID and expected timeline for review</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Reporting Users:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Profile Reporting</p>
                  <p className="text-xs text-muted-foreground">Go to user's profile → click three-dot menu → select "Report User"</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Message Reporting</p>
                  <p className="text-xs text-muted-foreground">In message thread → click user name → select "Report" from profile options</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Block and Report</p>
                  <p className="text-xs text-muted-foreground">You can simultaneously block a user and report them to prevent further contact</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-500" />
              Report Categories & Descriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Content Report Types:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-red-600 mb-1">Illegal Content</h5>
                    <p className="text-xs text-muted-foreground">Content that violates laws or involves minors</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-orange-600 mb-1">Copyright Violation</h5>
                    <p className="text-xs text-muted-foreground">Unauthorized use of protected material</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-yellow-600 mb-1">Spam/Commercial</h5>
                    <p className="text-xs text-muted-foreground">Unwanted advertising or repetitive content</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-purple-600 mb-1">Hate Speech</h5>
                    <p className="text-xs text-muted-foreground">Content targeting individuals or groups</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-blue-600 mb-1">Misinformation</h5>
                    <p className="text-xs text-muted-foreground">False or misleading information</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium text-green-600 mb-1">Other Violation</h5>
                    <p className="text-xs text-muted-foreground">Other community guideline violations</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">User Behavior Report Types:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Harassment</p>
                  <p className="text-xs text-muted-foreground">Bullying, stalking, doxxing, or persistent unwanted contact</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Impersonation</p>
                  <p className="text-xs text-muted-foreground">Pretending to be another person, brand, or organization</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Scam/Fraud</p>
                  <p className="text-xs text-muted-foreground">Attempting to deceive users for financial gain</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Account Abuse</p>
                  <p className="text-xs text-muted-foreground">Multiple accounts, ban evasion, or system manipulation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* After Reporting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              What Happens After Reporting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Review Process:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Initial Review (Within 2 Hours)</h5>
                    <p className="text-xs text-muted-foreground">High-priority reports reviewed immediately; urgent content may be temporarily hidden</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Detailed Investigation (24-48 Hours)</h5>
                    <p className="text-xs text-muted-foreground">Trained moderators review evidence, context, and community guidelines</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Decision & Action (Within 72 Hours)</h5>
                    <p className="text-xs text-muted-foreground">Appropriate action taken and reporter notified of outcome</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Possible Outcomes:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium">Content Actions:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span>Content Removal</span>
                      <span className="text-xs text-muted-foreground">Deleted permanently</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <span>Content Hidden</span>
                      <span className="text-xs text-muted-foreground">Removed from public view</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <span>Warning Added</span>
                      <span className="text-xs text-muted-foreground">Content marked with warning</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span>No Action</span>
                      <span className="text-xs text-muted-foreground">Doesn't violate guidelines</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="font-medium">User Actions:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span>Account Suspension</span>
                      <span className="text-xs text-muted-foreground">Temporary ban</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded">
                      <span>Permanent Ban</span>
                      <span className="text-xs text-muted-foreground">Account terminated</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <span>Content Restrictions</span>
                      <span className="text-xs text-muted-foreground">Limited posting ability</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <span>Warning Issued</span>
                      <span className="text-xs text-muted-foreground">Formal notice sent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Follow-Up:</strong> You'll receive a notification with the report outcome. If you disagree with the decision, you can appeal within 7 days.</p>
            </div>
          </CardContent>
        </Card>

        {/* False Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ban className="w-5 h-5 mr-2 text-red-500" />
              False Reporting & Consequences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What Constitutes False Reporting:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Malicious Reporting</p>
                  <p className="text-xs text-muted-foreground">Intentionally false reports to harass users or remove content you simply dislike</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Spam Reporting</p>
                  <p className="text-xs text-muted-foreground">Mass reporting content that doesn't violate guidelines</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Coordinated Attacks</p>
                  <p className="text-xs text-muted-foreground">Organizing groups to falsely report users or content</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Consequences for False Reporting:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">First Offense</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Warning sent to account</li>
                    <li>• Education about proper reporting</li>
                    <li>• Report weight reduced temporarily</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Repeated Violations</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Loss of reporting privileges</li>
                    <li>• Account restrictions</li>
                    <li>• Possible suspension or ban</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Good Faith Reporting:</strong> Honest mistakes or misunderstandings about guidelines don't count as false reporting. We only penalize intentionally malicious or obviously frivolous reports.</p>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
              Alternatives to Reporting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Before Reporting, Consider:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Direct Communication</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Politely explain the issue</li>
                    <li>• Ask for clarification</li>
                    <li>• Request content changes</li>
                    <li>• Resolve misunderstandings</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Personal Actions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Block the user</li>
                    <li>• Mute specific content</li>
                    <li>• Adjust your privacy settings</li>
                    <li>• Use content filters</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">When Direct Action is Better:</h4>
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Minor Disagreements</p>
                  <p className="text-xs text-muted-foreground">Content you personally dislike but doesn't violate guidelines</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Misunderstandings</p>
                  <p className="text-xs text-muted-foreground">Communication issues that can be resolved through discussion</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Personal Boundaries</p>
                  <p className="text-xs text-muted-foreground">Content that bothers you personally but may be acceptable to others</p>
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
            <Link to="/help/articles/community-guidelines" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Community guidelines overview</h4>
              <p className="text-sm text-muted-foreground mt-1">Understand what content is acceptable</p>
            </Link>
            <Link to="/help/articles/account-security" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Account security best practices</h4>
              <p className="text-sm text-muted-foreground mt-1">Protect yourself from threats</p>
            </Link>
            <Link to="/help/articles/content-privacy-levels" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Setting content privacy levels</h4>
              <p className="text-sm text-muted-foreground mt-1">Control who sees your content</p>
            </Link>
            <Link to="/help/articles/messaging-creators" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How to message creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Communication guidelines</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Reporting?</h3>
          <p className="mb-4 opacity-90">Our safety team is here to help with urgent reports or complex situations.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Safety Team</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportUserContent;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Users, Heart, AlertTriangle, Flag, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityGuidelines: React.FC = () => {
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
          <Shield className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Safety & Privacy</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Community guidelines overview</h1>
        <p className="text-xl text-muted-foreground">
          Understanding OnlyFur's community standards, content policies, and how we maintain a safe, inclusive environment.
        </p>
      </div>

      {/* Overview */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Our Community Values</h3>
          <p className="text-muted-foreground mb-4">
            OnlyFur is built on respect, creativity, and inclusivity. Our guidelines ensure everyone can express themselves safely while building meaningful connections in the furry community.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Respect</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Inclusivity</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Safety</span>
            </div>
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Fairness</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Core Principles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Core Community Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Fundamental Values:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Respect & Kindness</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Treat all community members with dignity</li>
                    <li>• Use inclusive and welcoming language</li>
                    <li>• Respect different perspectives and identities</li>
                    <li>• Practice empathy in all interactions</li>
                    <li>• Support fellow community members</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Creative Expression</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Celebrate diverse art styles and content</li>
                    <li>• Encourage artistic growth and exploration</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Share constructive feedback when asked</li>
                    <li>• Support emerging and established artists</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Safe Environment</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Maintain age-appropriate content standards</li>
                    <li>• Protect personal privacy and boundaries</li>
                    <li>• Report harmful or inappropriate behavior</li>
                    <li>• Follow consent guidelines in all interactions</li>
                    <li>• Create welcoming spaces for all identities</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Community Support</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Help new members feel welcome</li>
                    <li>• Share knowledge and resources generously</li>
                    <li>• Collaborate on community projects</li>
                    <li>• Promote positive community growth</li>
                    <li>• Resolve conflicts constructively</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flag className="w-5 h-5 mr-2 text-orange-500" />
              Content Standards & Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Allowed Content:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Welcomed Content</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Original furry artwork and creations</li>
                    <li>• Safe-for-work and adult content (properly tagged)</li>
                    <li>• Educational and tutorial content</li>
                    <li>• Convention coverage and community events</li>
                    <li>• Character development and world-building</li>
                    <li>• Photography and real-life furry content</li>
                    <li>• Music, stories, and multimedia projects</li>
                    <li>• Commissions and custom artwork</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Content Guidelines</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Must be original or properly licensed</li>
                    <li>• Appropriate content warnings required</li>
                    <li>• Accurate tagging for filtering</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Follow platform-specific formatting</li>
                    <li>• Include meaningful descriptions</li>
                    <li>• Credit collaborators and inspirations</li>
                    <li>• Maintain quality standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Prohibited Content:</h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm text-red-600">Illegal or Harmful Content</p>
                  <p className="text-xs text-muted-foreground">Child exploitation, non-consensual content, revenge sharing, doxxing, harassment campaigns</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm text-orange-600">Hate Speech & Discrimination</p>
                  <p className="text-xs text-muted-foreground">Content targeting individuals based on race, religion, gender, sexuality, disability, or other protected characteristics</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm text-yellow-600">Copyright Infringement</p>
                  <p className="text-xs text-muted-foreground">Unauthorized use of copyrighted material, art theft, trademark violations without proper licensing</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm text-purple-600">Spam & Commercial Abuse</p>
                  <p className="text-xs text-muted-foreground">Excessive self-promotion, unrelated commercial content, fake engagement, misleading content</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interaction Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Community Interaction Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Positive Interaction Standards:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Communication Etiquette</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Use respectful language in all interactions</li>
                    <li>• Avoid excessive caps or spamming</li>
                    <li>• Respect others' time and boundaries</li>
                    <li>• Give constructive feedback when requested</li>
                    <li>• Acknowledge and thank creators for their work</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Conflict Resolution</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Address disagreements privately first</li>
                    <li>• Focus on behavior, not personal attacks</li>
                    <li>• Seek mediation when needed</li>
                    <li>• Accept when others disagree</li>
                    <li>• Report serious issues to moderators</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Supporting Creators</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Engage meaningfully with content</li>
                    <li>• Share creators' work with permission</li>
                    <li>• Provide thoughtful comments and feedback</li>
                    <li>• Respect pricing and commission terms</li>
                    <li>• Celebrate creators' milestones</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Newcomer Welcome</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Help new members understand platform</li>
                    <li>• Answer questions patiently</li>
                    <li>• Recommend relevant creators and content</li>
                    <li>• Include newcomers in discussions</li>
                    <li>• Share community resources</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Behaviors to Avoid:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Harassment & Bullying</p>
                  <p className="text-xs text-muted-foreground">Persistent unwanted contact, intimidation, public shaming, coordinated harassment</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Inappropriate Solicitation</p>
                  <p className="text-xs text-muted-foreground">Unsolicited personal requests, demanding free content, pressuring for personal information</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-sm">Drama & Toxicity</p>
                  <p className="text-xs text-muted-foreground">Starting or escalating conflicts, spreading rumors, public call-outs, revenge sharing</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Platform Manipulation</p>
                  <p className="text-xs text-muted-foreground">Fake accounts, vote manipulation, gaming algorithms, circumventing restrictions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Age and Safety */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              Age Verification & Safety Measures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Age Requirements & Verification:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Platform Access</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Minimum age: 18 years old</li>
                    <li>• Valid ID required for creator accounts</li>
                    <li>• Age verification for adult content access</li>
                    <li>• Parental consent not accepted</li>
                    <li>• Immediate suspension for underage users</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Content Restrictions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• All adult content must be properly tagged</li>
                    <li>• Content warnings required for sensitive material</li>
                    <li>• No content involving minors in any context</li>
                    <li>• Clear distinction between SFW and NSFW</li>
                    <li>• Appropriate privacy levels enforced</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Safety Features & Tools:</h4>
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Blocking & Filtering</p>
                  <p className="text-xs text-muted-foreground">Block users, filter content by tags, hide specific types of material, customize your experience</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Reporting System</p>
                  <p className="text-xs text-muted-foreground">Report inappropriate content, harassment, or policy violations with detailed evidence submission</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Privacy Controls</p>
                  <p className="text-xs text-muted-foreground">Control who can message you, see your activity, access your content, and interact with your profile</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enforcement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="w-5 h-5 mr-2 text-purple-500" />
              Policy Enforcement & Consequences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Violation Response Process:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Report Investigation</h5>
                    <p className="text-xs text-muted-foreground">All reports reviewed within 24-48 hours by trained moderation team</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Evidence Evaluation</h5>
                    <p className="text-xs text-muted-foreground">Screenshots, chat logs, and context considered for fair assessment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Appropriate Action</h5>
                    <p className="text-xs text-muted-foreground">Warnings, content removal, temporary restrictions, or permanent bans</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">4</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Appeal Process</h5>
                    <p className="text-xs text-muted-foreground">Opportunity to appeal decisions with additional evidence or context</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Enforcement Actions:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium">Progressive Discipline:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <span>Warning</span>
                      <span className="text-xs text-muted-foreground">First offense</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <span>Content Removal</span>
                      <span className="text-xs text-muted-foreground">Policy violation</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span>7-Day Suspension</span>
                      <span className="text-xs text-muted-foreground">Repeated violations</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded">
                      <span>Permanent Ban</span>
                      <span className="text-xs text-muted-foreground">Serious violations</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="font-medium">Immediate Actions:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span>Illegal Content</span>
                      <span className="text-xs text-muted-foreground">Immediate ban</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span>Doxxing/Harassment</span>
                      <span className="text-xs text-muted-foreground">Immediate ban</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <span>Copyright Violation</span>
                      <span className="text-xs text-muted-foreground">Content removal</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <span>Spam/Commercial</span>
                      <span className="text-xs text-muted-foreground">Account restriction</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reporting System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              How to Report Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Reporting Process:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Identify the Violation</p>
                    <p className="text-muted-foreground">Determine which community guideline was violated</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Gather Evidence</p>
                    <p className="text-muted-foreground">Screenshots, links, chat logs, and relevant context</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Submit Report</p>
                    <p className="text-muted-foreground">Use report button or contact support with detailed information</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Follow Up</p>
                    <p className="text-muted-foreground">Receive notification of investigation results and actions taken</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What to Include in Reports:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-yellow-600 mb-2">Required Information</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Specific policy violation category</li>
                    <li>• URL/link to problematic content</li>
                    <li>• Username of violating account</li>
                    <li>• Date and time of incident</li>
                    <li>• Clear description of the issue</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Supporting Evidence</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Screenshots of content/messages</li>
                    <li>• Chat conversation history</li>
                    <li>• Multiple instances if pattern exists</li>
                    <li>• Any relevant context or background</li>
                    <li>• Impact on yourself or community</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Anonymous Reporting:</strong> All reports can be submitted anonymously. Your identity will not be shared with the reported user unless legally required.</p>
            </div>
          </CardContent>
        </Card>

        {/* Appeals Process */}
        <Card>
          <CardHeader>
            <CardTitle>Appeals & Resolution Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How to Appeal a Decision:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Submit Appeal Within 7 Days</p>
                  <p className="text-xs text-muted-foreground">Use the appeals form in your account settings or contact support directly</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Provide Additional Context</p>
                  <p className="text-xs text-muted-foreground">Explain circumstances, provide new evidence, clarify misunderstandings</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Senior Review Process</p>
                  <p className="text-xs text-muted-foreground">Appeals reviewed by senior moderation team with fresh perspective</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Decision Communication</p>
                  <p className="text-xs text-muted-foreground">Final decision communicated within 3-5 business days with reasoning</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Community Support Resources:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Support Channels</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Live chat support (24/7)</li>
                    <li>• Email support team</li>
                    <li>• Community forums</li>
                    <li>• Creator success team</li>
                    <li>• Mental health resources</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Educational Resources</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Community guideline tutorials</li>
                    <li>• Best practices guides</li>
                    <li>• Creator workshops</li>
                    <li>• Safety and privacy training</li>
                    <li>• Conflict resolution guides</li>
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
              <p className="text-sm text-muted-foreground mt-1">Protect your account and privacy</p>
            </Link>
            <Link to="/help/articles/messaging-creators" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How to message creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Communication guidelines and etiquette</p>
            </Link>
            <Link to="/help/articles/content-privacy-levels" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Setting content privacy levels</h4>
              <p className="text-sm text-muted-foreground mt-1">Control who sees your content</p>
            </Link>
            <Link to="/help/articles/report-user-content" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How to report users or content</h4>
              <p className="text-sm text-muted-foreground mt-1">Report violations and safety concerns</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Questions About Community Guidelines?</h3>
          <p className="mb-4 opacity-90">Our community team is here to help clarify policies and address concerns.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Community Team</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityGuidelines;
import React from 'react';
import { ArrowLeft, Shield, Users, AlertTriangle, CheckCircle, Heart, Eye, MessageCircle, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const CommunityGuidelines: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Community Guidelines</h1>
            <p className="text-muted-foreground">Building a safe, inclusive, and respectful community for everyone</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Safety</Badge>
          <Badge variant="secondary">Community</Badge>
          <Badge variant="secondary">Standards</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <Heart className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Our Mission:</strong> OnlyFur is committed to fostering a welcoming community where furry enthusiasts can express themselves safely, connect meaningfully, and support each other's creative journeys.
        </AlertDescription>
      </Alert>

      {/* Core Values */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Our Core Community Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Respect & Inclusion</h4>
                  <p className="text-sm text-muted-foreground">Everyone deserves to be treated with dignity, regardless of background, identity, or expression.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Creative Freedom</h4>
                  <p className="text-sm text-muted-foreground">Supporting artistic expression while maintaining community safety and legal compliance.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Authenticity</h4>
                  <p className="text-sm text-muted-foreground">Encouraging genuine connections and honest representation of oneself and content.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Consent & Boundaries</h4>
                  <p className="text-sm text-muted-foreground">Respecting personal boundaries and ensuring all interactions are consensual.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Mutual Support</h4>
                  <p className="text-sm text-muted-foreground">Building a community that uplifts and supports each member's growth and well-being.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Legal Compliance</h4>
                  <p className="text-sm text-muted-foreground">Adhering to all applicable laws and platform terms of service.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Standards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Community Standards
          </CardTitle>
          <CardDescription>
            What we expect from all community members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-600">Respectful Communication</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Use kind and constructive language in all interactions</li>
                <li>• Respect different perspectives and experiences</li>
                <li>• Avoid personal attacks, insults, or inflammatory comments</li>
                <li>• Practice active listening and empathy</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-600">Content Standards</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Only share content you have rights to distribute</li>
                <li>• Properly label mature or sensitive content</li>
                <li>• Ensure all content involves consenting adults only</li>
                <li>• Maintain high quality and authentic representations</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-600">Privacy & Consent</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Respect others' privacy and personal boundaries</li>
                <li>• Never share private information without permission</li>
                <li>• Obtain clear consent before featuring others in content</li>
                <li>• Honor requests to remove or modify shared content</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-orange-600">Platform Integrity</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Use the platform as intended and described</li>
                <li>• Report bugs, abuse, or policy violations promptly</li>
                <li>• Avoid manipulating metrics or engagement artificially</li>
                <li>• Maintain one authentic account per person</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prohibited Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Prohibited Content & Behavior
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Strictly Prohibited</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Content involving minors in any sexual context</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Non-consensual content or revenge sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Harassment, bullying, or targeted abuse</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Hate speech or discrimination</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Violent or illegal content</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 mb-3">Policy Violations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Copyright infringement</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Spam or misleading content</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Impersonation or false identity</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Doxxing or sharing private information</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Platform manipulation or abuse</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reporting & Enforcement */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Reporting Violations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Help us maintain community standards by reporting violations when you see them:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">How to Report</h4>
                <ul className="text-sm space-y-1">
                  <li>• Use the report button on content or profiles</li>
                  <li>• Send detailed reports to support@onlyfur.net</li>
                  <li>• Include screenshots and relevant information</li>
                  <li>• Reports are reviewed confidentially</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">What Happens Next</h4>
                <ul className="text-sm space-y-1">
                  <li>• Reports reviewed within 24-48 hours</li>
                  <li>• Action taken based on severity</li>
                  <li>• Reporter notified of resolution</li>
                  <li>• Appeals process available</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enforcement Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enforcement Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Violations are addressed through a progressive enforcement system:</p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-yellow-600">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Warning</h4>
                  <p className="text-sm text-muted-foreground">First-time or minor violations result in educational warnings and guidance.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-orange-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Content Removal</h4>
                  <p className="text-sm text-muted-foreground">Violating content is removed and creators are notified with explanation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-red-600">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Temporary Suspension</h4>
                  <p className="text-sm text-muted-foreground">Repeated violations may result in temporary account restrictions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-gray-600">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Permanent Ban</h4>
                  <p className="text-sm text-muted-foreground">Severe or repeated violations may result in permanent account termination.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Questions About Community Guidelines?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our community team is here to help clarify guidelines, address concerns, and support positive community interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/support/contact">Contact Community Team</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:community@onlyfur.net">community@onlyfur.net</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityGuidelines;

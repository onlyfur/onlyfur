import React from 'react';
import { ArrowLeft, Paintbrush, DollarSign, Clock, CheckCircle, Star, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const CustomCommissions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <Paintbrush className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">Custom Commissions</h1>
            <p className="text-muted-foreground">Offer personalized content and artwork to your subscribers</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Creator Tools</Badge>
          <Badge variant="secondary">Custom Content</Badge>
          <Badge variant="secondary">Monetization</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-purple-200 bg-purple-50">
        <Star className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <strong>Expand Your Earnings:</strong> Custom commissions allow you to offer personalized content and artwork to subscribers, creating additional revenue streams beyond regular subscriptions.
        </AlertDescription>
      </Alert>

      {/* What Are Commissions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            What Are Custom Commissions?
          </CardTitle>
          <CardDescription>
            Understanding the commission system on OnlyFur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Custom commissions are personalized content requests from subscribers who want unique artwork, stories, or other creative content tailored specifically for them.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600 mb-2">What You Can Offer</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Custom artwork and illustrations</li>
                  <li>• Personalized stories or writing</li>
                  <li>• Character designs and concepts</li>
                  <li>• Custom photo sets or videos</li>
                  <li>• Voice recordings or audio content</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Benefits for Creators</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Additional income beyond subscriptions</li>
                  <li>• Direct connection with subscribers</li>
                  <li>• Flexibility in pricing and terms</li>
                  <li>• Creative freedom and artistic growth</li>
                  <li>• Building long-term client relationships</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Set Up Commissions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Setting Up Commissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Enable Commission Features</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Go to your creator dashboard and enable the custom commissions feature in your profile settings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Set Your Pricing Structure</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Create clear pricing tiers for different types of commissions (sketches, full artwork, stories, etc.).
                </p>
                <div className="bg-blue-50 p-3 rounded-lg mt-2">
                  <p className="text-sm text-blue-800"><strong>Tip:</strong> Research market rates and start competitively while building your reputation.</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Define Your Terms & Conditions</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Clearly state what you will and won't create, typical turnaround times, revision policies, and payment terms.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-purple-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Create Portfolio Examples</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload sample work to show potential commissioners your style and quality level.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-green-600">5</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Launch Your Commission Services</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Announce to your subscribers that commissions are available and start accepting requests!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Managing Commissions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Managing Commission Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-600 mb-3">Best Practices</h4>
              <ul className="text-sm space-y-2">
                <li>• Respond to requests within 24-48 hours</li>
                <li>• Ask clarifying questions before starting</li>
                <li>• Provide work-in-progress updates</li>
                <li>• Request payment upfront or use escrow</li>
                <li>• Deliver on time and communicate delays</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-600 mb-3">Common Challenges</h4>
              <ul className="text-sm space-y-2">
                <li>• Scope creep and additional requests</li>
                <li>• Unclear or changing requirements</li>
                <li>• Payment delays or disputes</li>
                <li>• Balancing commissions with regular content</li>
                <li>• Managing multiple projects simultaneously</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Guidelines */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Pricing your commissions fairly benefits both you and your clients. Consider these factors:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">Time Investment</h4>
                <ul className="text-sm space-y-1">
                  <li>• Hours required for completion</li>
                  <li>• Complexity of the request</li>
                  <li>• Research and preparation time</li>
                  <li>• Revision and refinement time</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">Skill & Experience</h4>
                <ul className="text-sm space-y-1">
                  <li>• Your artistic skill level</li>
                  <li>• Years of experience</li>
                  <li>• Specialized techniques or styles</li>
                  <li>• Portfolio quality and reputation</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">Market Factors</h4>
                <ul className="text-sm space-y-1">
                  <li>• Industry standard rates</li>
                  <li>• Competitor pricing research</li>
                  <li>• Client budget considerations</li>
                  <li>• Supply and demand in your niche</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Workflow */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Typical Commission Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <span className="font-medium">Client submits request with details and references</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <span className="font-medium">You review, discuss details, and provide quote</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <span className="font-medium">Client accepts terms and makes payment</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">4</span>
                </div>
                <span className="font-medium">You create content and provide progress updates</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-green-600">5</span>
                </div>
                <span className="font-medium">Final delivery and client satisfaction confirmation</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ready to Start Commissioning?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Custom commissions are a great way to build deeper relationships with your subscribers while earning additional income from your creative talents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/help/articles/pricing-strategies">Pricing Strategies</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help/articles/creator-earnings">Creator Earnings Guide</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomCommissions;

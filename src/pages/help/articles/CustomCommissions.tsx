import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Palette, DollarSign, MessageCircle, Clock, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomCommissions: React.FC = () => {
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
          <Palette className="w-6 h-6 text-purple-500" />
          <Badge variant="secondary">Creator Tools</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Custom content and commissions</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to offer, price, and manage custom artwork and commissions for your OnlyFur subscribers.
        </p>
      </div>

      {/* Commission Overview */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Commission System Benefits</h3>
          <p className="text-muted-foreground mb-4">
            Custom commissions are one of the highest-revenue opportunities for furry creators. OnlyFur's integrated commission system makes it easy to manage custom work and get paid.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">High Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Direct Communication</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Payment Protection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Portfolio Building</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Setting Up Commissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-purple-500" />
              Setting Up Your Commission Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How to Enable Commissions:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Go to Creator Settings</p>
                    <p className="text-muted-foreground">Navigate to Creator Dashboard → Settings → Commission Services</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Enable Commission Features</p>
                    <p className="text-muted-foreground">Toggle on "Accept Custom Commissions" and set your status</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Create Your Price Sheet</p>
                    <p className="text-muted-foreground">Set up pricing for different types of artwork and services</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Set Terms of Service</p>
                    <p className="text-muted-foreground">Define your working terms, revision policy, and delivery timeframes</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pro Tip:</strong> Start with a simple price sheet and expand as you gain experience. You can always add more services and adjust pricing later.</p>
            </div>
          </CardContent>
        </Card>

        {/* Commission Pricing Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              Commission Pricing Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Furry Art Commission Price Ranges (2024):</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Digital Art</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Sketch:</strong> $15-50</li>
                    <li>• <strong>Flat Colors:</strong> $30-80</li>
                    <li>• <strong>Full Rendering:</strong> $60-200</li>
                    <li>• <strong>Reference Sheet:</strong> $100-300</li>
                    <li>• <strong>Animation (simple):</strong> $100-500</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Traditional Art</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Pencil Sketch:</strong> $20-60</li>
                    <li>• <strong>Ink Drawing:</strong> $40-100</li>
                    <li>• <strong>Watercolor:</strong> $60-150</li>
                    <li>• <strong>Acrylic/Oil:</strong> $100-400</li>
                    <li>• <strong>Mixed Media:</strong> $80-250</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">3D Services</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Model Base:</strong> $200-600</li>
                    <li>• <strong>Character Model:</strong> $400-1200</li>
                    <li>• <strong>Environment:</strong> $300-800</li>
                    <li>• <strong>Animation Rig:</strong> $500-1500</li>
                    <li>• <strong>VR Chat Avatar:</strong> $300-800</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Special Services</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Character Design:</strong> $100-400</li>
                    <li>• <strong>Fursuit Design:</strong> $150-500</li>
                    <li>• <strong>Logo Design:</strong> $80-300</li>
                    <li>• <strong>Comic Page:</strong> $100-400</li>
                    <li>• <strong>Concept Art:</strong> $80-250</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Pricing Factors to Consider:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Complexity Multipliers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Extra Characters:</strong> +50-80% each</li>
                    <li>• <strong>Complex Backgrounds:</strong> +30-100%</li>
                    <li>• <strong>Detailed Props:</strong> +20-50%</li>
                    <li>• <strong>Special Effects:</strong> +40-80%</li>
                    <li>• <strong>NSFW Content:</strong> +25-50%</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">Rush Order Fees</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>1-3 days:</strong> +100-200%</li>
                    <li>• <strong>1 week:</strong> +50-75%</li>
                    <li>• <strong>2 weeks:</strong> +25-40%</li>
                    <li>• <strong>Standard (1 month):</strong> Base price</li>
                    <li>• <strong>No rush (2+ months):</strong> -10-20%</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pricing Strategy:</strong> Start competitive, then raise prices as demand increases and you build a waitlist. Quality and speed allow for premium pricing.</p>
            </div>
          </CardContent>
        </Card>

        {/* Commission Workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Commission Workflow Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Step-by-Step Commission Process:</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Initial Inquiry</h5>
                    <p className="text-xs text-muted-foreground mb-2">Client contacts you through OnlyFur messaging with commission request</p>
                    <div className="text-xs">
                      <p><strong>You provide:</strong> Price quote, timeline estimate, initial requirements</p>
                      <p><strong>Client provides:</strong> Detailed description, references, special requests</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Agreement & Payment</h5>
                    <p className="text-xs text-muted-foreground mb-2">Finalize terms and secure payment through OnlyFur's system</p>
                    <div className="text-xs">
                      <p><strong>Set terms:</strong> Price, timeline, revisions, usage rights</p>
                      <p><strong>Payment:</strong> 50% upfront, 50% on completion (recommended)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Sketch/Concept Phase</h5>
                    <p className="text-xs text-muted-foreground mb-2">Create initial concept for client approval</p>
                    <div className="text-xs">
                      <p><strong>Delivery:</strong> Rough sketch or wireframe</p>
                      <p><strong>Client feedback:</strong> Major changes, pose adjustments</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Work in Progress Updates</h5>
                    <p className="text-xs text-muted-foreground mb-2">Regular updates showing progress (weekly recommended)</p>
                    <div className="text-xs">
                      <p><strong>Share:</strong> Process shots, progress renders</p>
                      <p><strong>Gather:</strong> Feedback on colors, details, composition</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">5</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Final Delivery</h5>
                    <p className="text-xs text-muted-foreground mb-2">Complete artwork delivery and final payment</p>
                    <div className="text-xs">
                      <p><strong>Deliver:</strong> High-res files, web versions, source files (if requested)</p>
                      <p><strong>Complete:</strong> Final payment, usage rights transfer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Commission Queues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-orange-500" />
              Managing Your Commission Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Queue Management Strategies:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Commission Slots System</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Limit concurrent commissions (3-5 max)</li>
                    <li>• Open slots periodically (monthly/quarterly)</li>
                    <li>• Maintain waitlist for interested clients</li>
                    <li>• First-come-first-served or application-based</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Priority Queue Systems</h5>
                  <ul className="text-sm space-y-1">
                    <li>• VIP subscribers get priority slots</li>
                    <li>• Repeat clients get preference</li>
                    <li>• Higher-value commissions prioritized</li>
                    <li>• Emergency slots for urgent requests</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">OnlyFur Commission Dashboard:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Active Commissions</p>
                  <p className="text-xs text-muted-foreground">Track all current commissions with progress status and deadlines</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Queue Management</p>
                  <p className="text-xs text-muted-foreground">Organize waitlist, set opening dates, manage slot availability</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Payment Tracking</p>
                  <p className="text-xs text-muted-foreground">Monitor payment status, send invoices, track completion payments</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Client Communication</p>
                  <p className="text-xs text-muted-foreground">Integrated messaging for each commission with file sharing</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Queue Tip:</strong> Always maintain a buffer between commissions to handle revisions and unexpected delays. Better to underpromise and overdeliver!</p>
            </div>
          </CardContent>
        </Card>

        {/* Terms of Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Commission Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Essential Terms to Include:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Payment Terms</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Payment schedule (upfront vs. milestones)</li>
                    <li>• Accepted payment methods</li>
                    <li>• Refund policy and conditions</li>
                    <li>• Late payment consequences</li>
                    <li>• Currency and tax considerations</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Work Scope & Revisions</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Number of included revisions (2-3 typical)</li>
                    <li>• What constitutes a major vs. minor change</li>
                    <li>• Additional revision fees</li>
                    <li>• Timeline for feedback and approvals</li>
                    <li>• Scope creep policies</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Usage Rights</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Personal use vs. commercial licensing</li>
                    <li>• Social media posting permissions</li>
                    <li>• Modification and derivative work rights</li>
                    <li>• Credit and attribution requirements</li>
                    <li>• Resale and redistribution policies</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Delivery & Completion</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Estimated completion timeframes</li>
                    <li>• File formats and resolutions provided</li>
                    <li>• Delivery method (OnlyFur, email, etc.)</li>
                    <li>• What happens if deadlines are missed</li>
                    <li>• Source file availability and costs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Sample Terms Clauses:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Revision Policy</p>
                  <p className="text-xs text-muted-foreground italic">
                    "Three (3) minor revisions are included in the base price. Major changes to composition, character design, or pose after approval constitute additional work charged at $X per hour."
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Payment Terms</p>
                  <p className="text-xs text-muted-foreground italic">
                    "50% payment required upfront to begin work. Final 50% due before delivery of high-resolution files. Payments must be made through OnlyFur's secure payment system."
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Usage Rights</p>
                  <p className="text-xs text-muted-foreground italic">
                    "Client receives non-exclusive rights for personal use. Commercial use requires separate licensing agreement. Artist retains right to display work in portfolio and social media with proper client credit."
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriber Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Commission Benefits by Subscription Tier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Tier-Based Commission Perks:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Basic Tier Subscribers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Access to commission slots</li>
                    <li>• Standard pricing</li>
                    <li>• Basic communication</li>
                    <li>• Standard timeline</li>
                    <li>• Normal queue position</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Premium Tier Subscribers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 10-15% commission discount</li>
                    <li>• Priority queue placement</li>
                    <li>• Extra revision included</li>
                    <li>• WIP updates priority</li>
                    <li>• Rush order eligibility</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">VIP Tier Subscribers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 20-25% commission discount</li>
                    <li>• First access to new slots</li>
                    <li>• Unlimited minor revisions</li>
                    <li>• Direct communication line</li>
                    <li>• Free source files</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Special Commission Types for Subscribers:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Monthly Subscriber Commissions</p>
                  <p className="text-xs text-muted-foreground">Raffle or vote for one free commission each month for long-term subscribers</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Subscriber Request Streams</p>
                  <p className="text-xs text-muted-foreground">Live streams where you take small requests from active subscribers</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Collaborative Projects</p>
                  <p className="text-xs text-muted-foreground">Group commissions or subscriber character interactions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commission Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Professional Commission Management:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">✅ Do:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Set clear terms before starting work</li>
                    <li>• Communicate regularly with clients</li>
                    <li>• Keep detailed records of all agreements</li>
                    <li>• Deliver on time or communicate delays early</li>
                    <li>• Ask for feedback and testimonials</li>
                    <li>• Build a portfolio of commission work</li>
                    <li>• Price your work fairly but don't undervalue</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-600 mb-2">❌ Don't:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Start work without payment or clear agreement</li>
                    <li>• Accept unlimited revisions</li>
                    <li>• Work outside OnlyFur's payment system</li>
                    <li>• Miss deadlines without communication</li>
                    <li>• Accept commissions beyond your skill level</li>
                    <li>• Ignore red flags from difficult clients</li>
                    <li>• Overcommit and sacrifice quality</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Building Your Commission Reputation:</h4>
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Quality and Consistency</p>
                  <p className="text-xs text-muted-foreground">Maintain consistent quality across all commissions to build a strong reputation</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Client Testimonials</p>
                  <p className="text-xs text-muted-foreground">Ask satisfied clients to leave reviews that you can showcase on your profile</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Portfolio Development</p>
                  <p className="text-xs text-muted-foreground">Use completed commissions to expand your portfolio and attract new clients</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Success Tip:</strong> Happy clients are your best marketing. Focus on excellent service and communication, and word-of-mouth will grow your commission business naturally.</p>
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
            <Link to="/help/articles/pricing-strategies" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Pricing strategies for creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn pricing fundamentals</p>
            </Link>
            <Link to="/help/articles/messaging-creators" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How to message creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Communication best practices</p>
            </Link>
            <Link to="/help/articles/payment-system" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">How payments work on OnlyFur</h4>
              <p className="text-sm text-muted-foreground mt-1">Understanding payment processing</p>
            </Link>
            <Link to="/help/articles/understanding-analytics" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding creator analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">Track commission performance</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Commission Setup?</h3>
          <p className="mb-4 opacity-90">Our creator success team can help you optimize your commission services and pricing strategy.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Get Commission Help</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomCommissions;
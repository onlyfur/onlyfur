import React from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Target, Users, BarChart3, Lightbulb, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const PricingStrategies: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link to="/help" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Pricing Strategies</h1>
            <p className="text-muted-foreground">Tips for setting subscription and content prices that maximize your creator earnings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Creator Tips</Badge>
          <Badge variant="secondary">Pricing</Badge>
          <Badge variant="secondary">Monetization</Badge>
        </div>
      </div>

      {/* Introduction */}
      <Alert className="mb-8 border-green-200 bg-green-50">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Maximize Your Earnings:</strong> Strategic pricing is key to building a sustainable creator business. Find the right balance between accessibility and value to grow your audience and income.
        </AlertDescription>
      </Alert>

      {/* Pricing Fundamentals */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pricing Fundamentals
          </CardTitle>
          <CardDescription>
            Core principles for setting effective subscription prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600 mb-2">Know Your Value</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Quality and uniqueness of your content</li>
                  <li>• Frequency of posts and updates</li>
                  <li>• Level of interaction with subscribers</li>
                  <li>• Exclusive perks and benefits offered</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Research the Market</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check similar creators' pricing</li>
                  <li>• Understand your niche's price range</li>
                  <li>• Consider your experience level</li>
                  <li>• Factor in your content production costs</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-600 mb-2">Start Strategic</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Begin with competitive introductory pricing</li>
                  <li>• Plan for gradual price increases</li>
                  <li>• Test different price points</li>
                  <li>• Monitor subscriber response and retention</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-600 mb-2">Consider Psychology</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use charm pricing ($9.99 vs $10.00)</li>
                  <li>• Create clear value perception</li>
                  <li>• Offer multiple tier options</li>
                  <li>• Highlight savings on longer commitments</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tier Strategy */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Subscription Tier Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Creating multiple subscription tiers allows you to cater to different audience segments and maximize revenue potential.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-3">Basic Tier ($5-15)</h4>
                <ul className="text-sm space-y-2">
                  <li>• Access to regular content</li>
                  <li>• Community participation</li>
                  <li>• Monthly updates</li>
                  <li>• Behind-the-scenes content</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-semibold text-purple-600">Premium Tier ($15-35)</h4>
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <ul className="text-sm space-y-2">
                  <li>• All basic tier content</li>
                  <li>• Exclusive artwork/stories</li>
                  <li>• Early access to new content</li>
                  <li>• Direct messaging privileges</li>
                  <li>• Monthly livestreams</li>
                </ul>
              </div>

              <div className="bg-gold-50 p-4 rounded-lg" style={{backgroundColor: '#fef7cd'}}>
                <h4 className="font-semibold text-yellow-600 mb-3">VIP Tier ($35+)</h4>
                <ul className="text-sm space-y-2">
                  <li>• All previous tier benefits</li>
                  <li>• Custom commissions included</li>
                  <li>• One-on-one video calls</li>
                  <li>• Personalized content requests</li>
                  <li>• Exclusive merchandise</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Best Practices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Pricing Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Do's</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Start lower and gradually increase as you build value</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Offer grandfathered pricing for early supporters</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Bundle related content into clear tier packages</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Communicate clearly what each tier includes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Monitor analytics to optimize pricing</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Don'ts</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Don't underprice your content's true value</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Avoid sudden, drastic price increases</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Don't copy others without considering your unique value</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Avoid too many tiers that confuse subscribers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Don't forget to factor in platform fees</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Testing */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Testing and Adjusting Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Finding the optimal price is an ongoing process. Here's how to test and refine your pricing strategy:
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">A/B Testing</h4>
                <p className="text-sm text-blue-700">
                  Test different price points with new subscribers while maintaining existing subscriber pricing. 
                  Monitor conversion rates and subscriber satisfaction.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">Seasonal Adjustments</h4>
                <p className="text-sm text-green-700">
                  Consider temporary promotions during holidays or special events. 
                  Use limited-time offers to attract new subscribers.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">Feedback Integration</h4>
                <p className="text-sm text-purple-700">
                  Regularly survey your community about pricing perceptions and value satisfaction. 
                  Use their input to guide pricing decisions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Revenue Streams */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Revenue Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Diversify your income beyond subscriptions to maximize earning potential and provide more value to your audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/help/articles/custom-commissions">Custom Commissions</Link>
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

export default PricingStrategies;

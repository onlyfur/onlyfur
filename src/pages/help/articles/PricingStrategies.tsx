import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, TrendingUp, Target, BarChart3, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingStrategies: React.FC = () => {
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
          <DollarSign className="w-6 h-6 text-green-500" />
          <Badge variant="secondary">Creator Tools</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Pricing strategies for creators</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to set competitive prices that maximize revenue while building a loyal subscriber base.
        </p>
      </div>

      {/* Pricing Overview */}
      <Card className="mb-8 bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Strategic Pricing Principles</h3>
          <p className="text-muted-foreground mb-4">
            Successful pricing balances value perception, market position, and your content quality. The right pricing strategy can make or break your creator business.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Market Research</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Value Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Growth Strategy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Audience Value</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Market Research */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Market Research & Competitive Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Research Your Competition:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Similar Creators Analysis</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Find creators with similar art styles</li>
                    <li>• Check their subscription tier pricing</li>
                    <li>• Analyze their content frequency</li>
                    <li>• Note their subscriber count ranges</li>
                    <li>• Study their tier benefit structures</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Market Positioning</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Identify pricing gaps in the market</li>
                    <li>• Determine your unique value proposition</li>
                    <li>• Consider your experience level</li>
                    <li>• Assess your content quality honestly</li>
                    <li>• Factor in your posting consistency</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Furry Creator Market Ranges (2024):</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Beginner Artists (0-6 months)</p>
                  <p className="text-xs text-muted-foreground">Basic: $5-12 | Premium: $10-20 | VIP: $20-40</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Intermediate Artists (6 months - 2 years)</p>
                  <p className="text-xs text-muted-foreground">Basic: $10-20 | Premium: $18-35 | VIP: $30-60</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Established Artists (2+ years)</p>
                  <p className="text-xs text-muted-foreground">Basic: $15-30 | Premium: $25-50 | VIP: $45-100+</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Premium/Celebrity Artists</p>
                  <p className="text-xs text-muted-foreground">Basic: $25-50 | Premium: $40-80 | VIP: $75-200+</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Research Tip:</strong> Spend at least 2-3 hours researching similar creators before setting your prices. Consider subscribing to 2-3 competitors to understand their value delivery.</p>
            </div>
          </CardContent>
        </Card>

        {/* Value-Based Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-500" />
              Value-Based Pricing Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Calculate Your Content Value:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Time Investment</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Hours per artwork/post</li>
                    <li>• Research and planning time</li>
                    <li>• Communication with subscribers</li>
                    <li>• Platform management time</li>
                    <li>• Desired hourly wage</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Quality Factors</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Artistic skill level</li>
                    <li>• Unique style/niche</li>
                    <li>• Content variety and creativity</li>
                    <li>• Professional presentation</li>
                    <li>• Community engagement quality</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Value Proposition Framework:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Basic Tier Value</p>
                  <p className="text-xs text-muted-foreground">Regular content + community access + basic interaction</p>
                  <p className="text-xs font-medium">Formula: (Content frequency × Quality score) + Community value</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Premium Tier Value</p>
                  <p className="text-xs text-muted-foreground">Basic benefits + exclusive content + priority interaction + higher quality</p>
                  <p className="text-xs font-medium">Formula: Basic value × 1.5-2.5 + Exclusive content value</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">VIP Tier Value</p>
                  <p className="text-xs text-muted-foreground">Premium benefits + personal interaction + custom content + special perks</p>
                  <p className="text-xs font-medium">Formula: Premium value × 2-3 + Personal interaction value</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier Structure Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Optimal Tier Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Recommended Price Ratios:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <h5 className="font-medium text-blue-600 mb-2">Basic Tier</h5>
                  <p className="text-2xl font-bold">1x</p>
                  <p className="text-xs text-muted-foreground">Base price point</p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• Entry-level pricing</li>
                    <li>• Accessible to most fans</li>
                    <li>• High volume potential</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h5 className="font-medium text-purple-600 mb-2">Premium Tier</h5>
                  <p className="text-2xl font-bold">2-2.5x</p>
                  <p className="text-xs text-muted-foreground">Sweet spot for value</p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• Most popular tier usually</li>
                    <li>• Best revenue per subscriber</li>
                    <li>• Significant value increase</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h5 className="font-medium text-yellow-600 mb-2">VIP Tier</h5>
                  <p className="text-2xl font-bold">4-6x</p>
                  <p className="text-xs text-muted-foreground">Premium supporters</p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• Lower volume, high value</li>
                    <li>• Personal interaction focus</li>
                    <li>• Exclusive benefits</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Pricing Structures:</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Conservative Approach (New Creator)</h5>
                  <p className="text-xs text-muted-foreground">Basic: $8 | Premium: $18 | VIP: $35</p>
                  <p className="text-xs">Focus on building audience first, revenue second</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Balanced Approach (6+ months experience)</h5>
                  <p className="text-xs text-muted-foreground">Basic: $15 | Premium: $30 | VIP: $60</p>
                  <p className="text-xs">Moderate pricing with good value perception</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-1">Premium Approach (Established creator)</h5>
                  <p className="text-xs text-muted-foreground">Basic: $25 | Premium: $50 | VIP: $100</p>
                  <p className="text-xs">Higher prices justified by quality and reputation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Psychological Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Psychological Pricing Tactics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Price Psychology Techniques:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Charm Pricing</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Use .99 or .95 endings ($14.99 vs $15.00)</li>
                    <li>• Creates perception of better value</li>
                    <li>• Works especially well for Basic tiers</li>
                    <li>• Example: $9.99, $19.99, $39.99</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Anchor Pricing</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Start with highest tier to set anchor</li>
                    <li>• Makes lower tiers appear more reasonable</li>
                    <li>• VIP tier makes Premium seem moderate</li>
                    <li>• Display prices from high to low</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Bundle Value</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Emphasize what's included in each tier</li>
                    <li>• Calculate cost per benefit/feature</li>
                    <li>• Show savings compared to individual pricing</li>
                    <li>• Highlight exclusive tier benefits</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Limited Time Offers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Launch promotions (first month 50% off)</li>
                    <li>• Anniversary/holiday discounts</li>
                    <li>• Loyalty rewards for long-term subscribers</li>
                    <li>• Referral bonuses and incentives</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Pricing Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Dynamic Pricing & Growth Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Pricing Evolution Timeline:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                  <div>
                    <p className="font-medium text-sm">Launch Phase (Months 1-3)</p>
                    <p className="text-xs text-muted-foreground">Start 20-30% below market rate to build initial audience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                  <div>
                    <p className="font-medium text-sm">Growth Phase (Months 4-12)</p>
                    <p className="text-xs text-muted-foreground">Gradually increase prices to market rate as quality and audience grow</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                  <div>
                    <p className="font-medium text-sm">Established Phase (Year 2+)</p>
                    <p className="text-xs text-muted-foreground">Price at or above market rate based on unique value and loyalty</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Price Adjustment Strategies:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">When to Increase Prices:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Significant improvement in art quality</li>
                    <li>• Increased content frequency</li>
                    <li>• Growing subscriber base (demand increase)</li>
                    <li>• Added new benefits or features</li>
                    <li>• Market rates have increased</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-600 mb-2">When to Consider Decreasing:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Subscriber growth has stalled</li>
                    <li>• High churn rate (people cancelling)</li>
                    <li>• New competitor with better value</li>
                    <li>• Reduced content output temporarily</li>
                    <li>• Economic downturn affecting audience</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Important:</strong> Always give existing subscribers 30-day notice before price increases. Consider grandfathering loyal subscribers at their current rate as a retention strategy.</p>
            </div>
          </CardContent>
        </Card>

        {/* Testing and Optimization */}
        <Card>
          <CardHeader>
            <CardTitle>A/B Testing Your Prices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Price Testing Methods:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Split Testing</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Test different price points for new subscribers</li>
                    <li>• Run for 2-4 weeks minimum</li>
                    <li>• Compare conversion rates and total revenue</li>
                    <li>• Factor in long-term retention differences</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Survey Testing</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Ask current subscribers about price sensitivity</li>
                    <li>• Poll potential subscribers on social media</li>
                    <li>• Use Van Westendorp price sensitivity analysis</li>
                    <li>• Test willingness to pay for specific benefits</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Metrics to Track:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-1">Conversion Rate</h5>
                  <p className="text-xs text-muted-foreground">Visitors to subscribers ratio</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Average Revenue Per User (ARPU)</h5>
                  <p className="text-xs text-muted-foreground">Total revenue ÷ total subscribers</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Customer Lifetime Value (CLV)</h5>
                  <p className="text-xs text-muted-foreground">ARPU × average subscription length</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Churn Rate</h5>
                  <p className="text-xs text-muted-foreground">Percentage of subscribers who cancel</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Tier Distribution</h5>
                  <p className="text-xs text-muted-foreground">Which tiers are most popular</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Price Elasticity</h5>
                  <p className="text-xs text-muted-foreground">How price changes affect demand</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Pricing Situations */}
        <Card>
          <CardHeader>
            <CardTitle>Special Pricing Situations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Custom Content Pricing:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Commission Multipliers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Basic subscribers: Full commission price</li>
                    <li>• Premium subscribers: 10-15% discount</li>
                    <li>• VIP subscribers: 20-25% discount</li>
                    <li>• Rush orders: 25-50% premium</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Special Content Pricing</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Pay-per-view exclusive content</li>
                    <li>• Limited edition prints/merchandise</li>
                    <li>• Video calls or personal sessions</li>
                    <li>• Custom character designs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Seasonal and Promotional Pricing:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Holiday Promotions</p>
                  <p className="text-xs text-muted-foreground">Black Friday, Christmas, Valentine's Day specials (20-40% off first month)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Anniversary Sales</p>
                  <p className="text-xs text-muted-foreground">Celebrate milestones with subscriber appreciation discounts</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Bundle Offers</p>
                  <p className="text-xs text-muted-foreground">3-month or annual subscriptions at discounted rates</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Referral Programs</p>
                  <p className="text-xs text-muted-foreground">Reward existing subscribers for bringing new customers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Pricing Mistakes */}
        <Card>
          <CardHeader>
            <CardTitle>Common Pricing Mistakes to Avoid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-red-600 mb-2">❌ Mistakes to Avoid:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Pricing too low out of fear</li>
                  <li>• Copying competitors without considering your value</li>
                  <li>• Never adjusting prices as you improve</li>
                  <li>• Making tiers too similar in price</li>
                  <li>• Frequent price changes that confuse subscribers</li>
                  <li>• Not considering your time investment</li>
                  <li>• Ignoring market feedback and data</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-600 mb-2">✅ Best Practices:</h5>
                <ul className="text-sm space-y-1">
                  <li>• Start slightly below market, then grow</li>
                  <li>• Clearly communicate value at each tier</li>
                  <li>• Review and adjust quarterly</li>
                  <li>• Grandfather loyal subscribers when increasing</li>
                  <li>• Test prices with small changes first</li>
                  <li>• Factor in platform fees (OnlyFur takes 20%)</li>
                  <li>• Focus on lifetime value, not just monthly revenue</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Remember:</strong> It's easier to lower prices than to raise them. Start with conservative pricing and gradually increase as you prove your value to subscribers.</p>
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
            <Link to="/help/articles/understanding-analytics" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding creator analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">Track your pricing performance</p>
            </Link>
            <Link to="/help/articles/custom-commissions" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Custom content and commissions</h4>
              <p className="text-sm text-muted-foreground mt-1">Pricing custom work and commissions</p>
            </Link>
            <Link to="/help/articles/subscription-tiers" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding subscription tiers</h4>
              <p className="text-sm text-muted-foreground mt-1">Learn about tier structures</p>
            </Link>
            <Link to="/help/articles/content-privacy-levels" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Setting content privacy levels</h4>
              <p className="text-sm text-muted-foreground mt-1">Control who sees your content</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-green-500 to-blue-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Pricing Strategy?</h3>
          <p className="mb-4 opacity-90">Our creator success team can help you optimize your pricing for maximum revenue and growth.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Get Pricing Help</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingStrategies;
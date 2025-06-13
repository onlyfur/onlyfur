import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Camera, Edit, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingUpCreatorProfile: React.FC = () => {
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
          <User className="w-6 h-6 text-purple-500" />
          <Badge variant="secondary">Getting Started</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Setting up your profile as a creator</h1>
        <p className="text-xl text-muted-foreground">
          Complete your creator profile to attract subscribers and showcase your content effectively.
        </p>
      </div>

      {/* Table of Contents */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Quick Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li><a href="#basic-info" className="text-primary hover:underline">Basic Profile Information</a></li>
            <li><a href="#profile-pictures" className="text-primary hover:underline">Profile Pictures and Banner</a></li>
            <li><a href="#bio-description" className="text-primary hover:underline">Writing Your Bio</a></li>
            <li><a href="#content-categories" className="text-primary hover:underline">Setting Content Categories</a></li>
            <li><a href="#pricing-tiers" className="text-primary hover:underline">Configuring Subscription Tiers</a></li>
            <li><a href="#verification" className="text-primary hover:underline">Getting Verified</a></li>
            <li><a href="#optimization-tips" className="text-primary hover:underline">Profile Optimization Tips</a></li>
          </ul>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Basic Profile Information */}
        <section id="basic-info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Username Selection</h3>
                <p className="text-muted-foreground mb-3">
                  Your username is permanent and appears in your profile URL. Choose something memorable and professional.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm"><strong>Tips:</strong></p>
                  <ul className="text-sm list-disc ml-4 mt-2">
                    <li>Keep it short and easy to remember</li>
                    <li>Avoid special characters and numbers if possible</li>
                    <li>Consider using your character name or art brand</li>
                    <li>Check that it's available across other social platforms</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Display Name</h3>
                <p className="text-muted-foreground mb-3">
                  This is what appears prominently on your profile and can be changed anytime.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Location and Contact</h3>
                <p className="text-muted-foreground mb-3">
                  Add your general location (city/state) and any public contact information you're comfortable sharing.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Profile Pictures */}
        <section id="profile-pictures">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Profile Pictures and Banner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
                <p className="text-muted-foreground mb-3">
                  Your profile picture appears next to all your posts and comments. Make it recognizable and high-quality.
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm"><strong>Requirements:</strong></p>
                  <ul className="text-sm list-disc ml-4 mt-2">
                    <li>Minimum size: 400x400 pixels</li>
                    <li>Square aspect ratio recommended</li>
                    <li>File formats: JPG, PNG, GIF</li>
                    <li>Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Banner Image</h3>
                <p className="text-muted-foreground mb-3">
                  Your banner appears at the top of your profile page. Use it to showcase your art style or character.
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm"><strong>Requirements:</strong></p>
                  <ul className="text-sm list-disc ml-4 mt-2">
                    <li>Recommended size: 1500x500 pixels</li>
                    <li>Aspect ratio: 3:1</li>
                    <li>File formats: JPG, PNG</li>
                    <li>Maximum file size: 15MB</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Image Tips</h3>
                <ul className="text-muted-foreground list-disc ml-4 space-y-1">
                  <li>Use high-resolution images that won't pixelate</li>
                  <li>Ensure images represent your content style</li>
                  <li>Consider how they'll look on mobile devices</li>
                  <li>Update seasonally to keep your profile fresh</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bio and Description */}
        <section id="bio-description">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Writing Your Bio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Bio Section</h3>
                <p className="text-muted-foreground mb-3">
                  Your bio is the first thing potential subscribers read. Make it engaging and informative.
                </p>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
                  <p className="text-sm font-semibold mb-2">Example Bio Structure:</p>
                  <div className="text-sm space-y-1">
                    <p>🎨 Digital artist specializing in furry character design</p>
                    <p>🦊 Creating art for the community since 2020</p>
                    <p>📧 Commissions: Open (DM for details)</p>
                    <p>🎯 New posts: Mon/Wed/Fri</p>
                    <p>💫 Let's bring your characters to life!</p>
                  </div>
                </div>

                <h4 className="font-semibold mb-2">Bio Writing Tips:</h4>
                <ul className="text-muted-foreground list-disc ml-4 space-y-1">
                  <li>Start with what type of content you create</li>
                  <li>Mention your posting schedule</li>
                  <li>Include commission status if applicable</li>
                  <li>Add personality with emojis and friendly language</li>
                  <li>End with a call-to-action</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Keywords and Tags</h3>
                <p className="text-muted-foreground mb-3">
                  Include relevant keywords that help people find your content through search.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">furry art</Badge>
                  <Badge variant="outline">digital painting</Badge>
                  <Badge variant="outline">character design</Badge>
                  <Badge variant="outline">commissions</Badge>
                  <Badge variant="outline">fantasy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Content Categories */}
        <section id="content-categories">
          <Card>
            <CardHeader>
              <CardTitle>Setting Content Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Select the categories that best describe your content. This helps subscribers find exactly what they're looking for.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Popular Categories:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✨ Digital Art & Illustrations</li>
                    <li>📸 Fursuit Photography</li>
                    <li>📝 Stories & Writing</li>
                    <li>🎥 Videos & Animations</li>
                    <li>🎨 Traditional Art</li>
                    <li>🎭 Character Roleplay</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Specialty Categories:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>🔧 Tutorials & How-To</li>
                    <li>🏆 Convention Content</li>
                    <li>💼 Commission Work</li>
                    <li>🌟 Behind-the-Scenes</li>
                    <li>🎮 Gaming Content</li>
                    <li>📱 Social & Lifestyle</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm"><strong>Pro Tip:</strong> You can select multiple categories, but choose the ones that represent 80% or more of your content for the best results.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pricing Tiers */}
        <section id="pricing-tiers">
          <Card>
            <CardHeader>
              <CardTitle>Configuring Subscription Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Set up your subscription tiers to offer different levels of access and benefits.
              </p>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-2">Basic Tier ($9.99/month)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Access to general content posts</li>
                    <li>• Community interaction</li>
                    <li>• Monthly behind-the-scenes content</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-purple-600 mb-2">Premium Tier ($19.99/month)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• All Basic tier benefits</li>
                    <li>• Exclusive premium content</li>
                    <li>• Early access to new posts</li>
                    <li>• Higher resolution downloads</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-600 mb-2">VIP Tier ($39.99/month)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• All previous tier benefits</li>
                    <li>• Personal messages and interaction</li>
                    <li>• Custom content requests</li>
                    <li>• Commission discounts</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm"><strong>Pricing Strategy:</strong> Start with competitive pricing and adjust based on your content quality and subscriber feedback. You can always modify tiers later.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Verification */}
        <section id="verification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Getting Verified
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Verified creators get a blue checkmark and increased visibility on the platform.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Verification Requirements:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    Active account for at least 30 days
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    Minimum 50 subscribers
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    Consistent posting schedule (minimum 10 posts)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    Complete profile with bio and profile pictures
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    No community guideline violations
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Application Process:</h4>
                <ol className="space-y-1 text-sm list-decimal ml-4">
                  <li>Ensure you meet all requirements</li>
                  <li>Go to Profile Settings → Verification</li>
                  <li>Submit verification request with required information</li>
                  <li>Wait for review (typically 5-10 business days)</li>
                  <li>Receive notification of approval or feedback for improvements</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Optimization Tips */}
        <section id="optimization-tips">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Profile Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">SEO and Discoverability:</h4>
                <ul className="space-y-1 text-sm list-disc ml-4">
                  <li>Use relevant keywords in your bio and content descriptions</li>
                  <li>Tag your content consistently</li>
                  <li>Engage with other creators in your niche</li>
                  <li>Cross-promote on other social media platforms</li>
                  <li>Participate in community events and challenges</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Engagement Strategies:</h4>
                <ul className="space-y-1 text-sm list-disc ml-4">
                  <li>Respond to comments and messages promptly</li>
                  <li>Post consistently according to your stated schedule</li>
                  <li>Ask questions to encourage subscriber interaction</li>
                  <li>Share behind-the-scenes content</li>
                  <li>Host polls and Q&A sessions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Regular Maintenance:</h4>
                <ul className="space-y-1 text-sm list-disc ml-4">
                  <li>Update your bio seasonally or when your content focus changes</li>
                  <li>Refresh profile and banner images periodically</li>
                  <li>Review and adjust subscription tier benefits</li>
                  <li>Monitor analytics to understand what content performs best</li>
                  <li>Stay active in the community</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
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
              <p className="text-sm text-muted-foreground mt-1">Learn how to price your content effectively</p>
            </Link>
            <Link to="/help/articles/upload-organize-content" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Uploading and organizing your content</h4>
              <p className="text-sm text-muted-foreground mt-1">Best practices for content management</p>
            </Link>
            <Link to="/help/articles/understanding-analytics" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding creator analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">Track your performance and growth</p>
            </Link>
            <Link to="/help/articles/community-guidelines" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Community guidelines overview</h4>
              <p className="text-sm text-muted-foreground mt-1">Understanding our community standards</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Still Need Help?</h3>
          <p className="mb-4 opacity-90">Our creator support team is here to help you succeed.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Creator Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingUpCreatorProfile;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Image, Edit, Settings, Eye, MessageCircle, Users, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileSetup: React.FC = () => {
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
          <User className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Account Setup</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Profile setup guide</h1>
        <p className="text-xl text-muted-foreground">
          Create an engaging profile that attracts followers and subscribers to your OnlyFur content.
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="mb-8 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Why Your Profile Matters</h3>
          <p className="text-muted-foreground mb-4">
            Your profile is your digital storefront on OnlyFur. A well-crafted profile helps you stand out, connect with your audience, and convert visitors into subscribers.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Image className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Visual Appeal</span>
            </div>
            <div className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Compelling Bio</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Target Audience</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Engagement</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Profile Basics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Profile Basics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Essential Profile Elements:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Profile Picture</p>
                    <p className="text-muted-foreground">Clear, high-quality image that represents you or your brand</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Cover Photo</p>
                    <p className="text-muted-foreground">Eye-catching banner that showcases your content style</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Display Name</p>
                    <p className="text-muted-foreground">Your preferred name or artist name (can be different from username)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Bio/About Me</p>
                    <p className="text-muted-foreground">Compelling description of who you are and what you create</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                  <div>
                    <p className="font-medium">Subscription Tiers</p>
                    <p className="text-muted-foreground">Clear pricing and benefits for different subscription levels</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pro Tip:</strong> Update your profile picture and cover photo regularly to keep your profile fresh and showcase your latest work.</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Picture & Cover Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="w-5 h-5 mr-2 text-green-500" />
              Profile Picture & Cover Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Profile Picture Guidelines:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Technical Requirements</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Size:</strong> 400 x 400 pixels (minimum)</li>
                    <li>• <strong>Format:</strong> JPG, PNG, or GIF</li>
                    <li>• <strong>Max file size:</strong> 5MB</li>
                    <li>• <strong>Aspect ratio:</strong> 1:1 (square)</li>
                    <li>• <strong>Resolution:</strong> 72 DPI minimum</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Content Recommendations</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Close-up of face or fursona</li>
                    <li>• Good lighting and clear focus</li>
                    <li>• Consistent with your brand</li>
                    <li>• Recognizable at small sizes</li>
                    <li>• Appropriate for all audiences</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Cover Photo Guidelines:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Technical Requirements</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Size:</strong> 1200 x 400 pixels (recommended)</li>
                    <li>• <strong>Format:</strong> JPG, PNG, or GIF</li>
                    <li>• <strong>Max file size:</strong> 10MB</li>
                    <li>• <strong>Aspect ratio:</strong> 3:1 (rectangular)</li>
                    <li>• <strong>Resolution:</strong> 72 DPI minimum</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Content Recommendations</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Showcase your best artwork</li>
                    <li>• Include your character/fursona</li>
                    <li>• Use vibrant, eye-catching colors</li>
                    <li>• Consider adding text overlay</li>
                    <li>• Avoid cluttered compositions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Design Tip:</strong> Your profile picture and cover photo should complement each other visually while maintaining your brand identity. Consider creating them as a matching set.</p>
            </div>
          </CardContent>
        </Card>

        {/* Writing Your Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2 text-purple-500" />
              Writing an Effective Bio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Bio Content Suggestions:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">Introduce Yourself</p>
                  <p className="text-xs text-muted-foreground">Share your name, pronouns, and a brief introduction about who you are</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-sm">Describe Your Content</p>
                  <p className="text-xs text-muted-foreground">Explain what type of art/content you create and your unique style or approach</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Highlight Your Experience</p>
                  <p className="text-xs text-muted-foreground">Mention relevant experience, skills, or achievements in your creative field</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Set Expectations</p>
                  <p className="text-xs text-muted-foreground">Tell subscribers what they can expect (posting frequency, content types)</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Include a Call-to-Action</p>
                  <p className="text-xs text-muted-foreground">Encourage visitors to subscribe, message you, or check out specific content</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Bio Examples:</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Artist Bio Example</p>
                  <p className="text-xs text-muted-foreground italic">
                    "Hey there! I'm Luna (she/her), a digital artist specializing in anthro character design and fantasy illustrations. With 5+ years of professional experience, I create vibrant, detailed artwork featuring unique characters and immersive worlds. Subscribe for weekly art posts, monthly tutorials, and behind-the-scenes content. Message me for commission inquiries!"
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Cosplayer Bio Example</p>
                  <p className="text-xs text-muted-foreground italic">
                    "Wolf cosplayer and fursuit maker bringing your favorite characters to life! I post new cosplay photos 3x weekly, fursuit WIPs, and exclusive behind-the-scenes content. Premium subscribers get first looks at new projects and detailed crafting tutorials. Join my furry family and let's create some magic together!"
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="font-medium text-sm">Writer Bio Example</p>
                  <p className="text-xs text-muted-foreground italic">
                    "Fantasy writer crafting anthropomorphic adventures since 2015. My stories feature complex characters, immersive worlds, and themes of identity and belonging. New short stories every Monday, chapter updates on Fridays. VIP subscribers get early access to new works and input on story development. Come explore new worlds with me!"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Tiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-orange-500" />
              Setting Up Subscription Tiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Tier Structure Recommendations:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Basic Tier ($5-8)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Access to subscriber-only posts</li>
                    <li>• Monthly content packs</li>
                    <li>• Basic messaging privileges</li>
                    <li>• Feed access and likes</li>
                    <li>• Perfect entry point for new fans</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Premium Tier ($10-15)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Basic tier</li>
                    <li>• High-resolution downloads</li>
                    <li>• Behind-the-scenes content</li>
                    <li>• Priority messaging response</li>
                    <li>• Monthly Q&A sessions</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-yellow-600 mb-2">VIP Tier ($20+)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Everything in Premium tier</li>
                    <li>• Exclusive VIP-only content</li>
                    <li>• Input on upcoming projects</li>
                    <li>• Personal thank-you messages</li>
                    <li>• Special discount on commissions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Writing Effective Tier Descriptions:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Be Specific About Benefits</h5>
                    <p className="text-xs text-muted-foreground">Clearly list exactly what subscribers get at each tier level</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Highlight Exclusive Content</h5>
                    <p className="text-xs text-muted-foreground">Emphasize what's unique to each tier that subscribers can't get elsewhere</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Set Clear Expectations</h5>
                    <p className="text-xs text-muted-foreground">Include posting frequency and content types for each tier</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Use Compelling Language</h5>
                    <p className="text-xs text-muted-foreground">Make descriptions exciting and appealing to potential subscribers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pricing Tip:</strong> Start with competitive pricing based on your experience level and content quality. You can always adjust prices as your subscriber base grows and your content library expands.</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-red-500" />
              Profile Visibility Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Managing Your Profile Privacy:</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">Public Profile</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Visible to everyone, appears in search results and discovery feeds</p>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="font-medium">Limited Profile</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Basic info visible publicly, but content only visible to subscribers</p>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="font-medium">Private Profile</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Only visible to approved followers and subscribers</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">How to Adjust Visibility Settings:</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">1.</span>
                  <div>
                    <p className="font-medium">Go to Account Settings</p>
                    <p className="text-muted-foreground">Click your profile picture → Settings → Privacy</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">2.</span>
                  <div>
                    <p className="font-medium">Select Profile Visibility</p>
                    <p className="text-muted-foreground">Choose your preferred visibility level</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">3.</span>
                  <div>
                    <p className="font-medium">Customize Discovery Settings</p>
                    <p className="text-muted-foreground">Control whether your profile appears in search and recommendations</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">4.</span>
                  <div>
                    <p className="font-medium">Save Changes</p>
                    <p className="text-muted-foreground">Apply your new privacy settings</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Privacy Tip:</strong> For most creators, a public profile with limited content visibility offers the best balance between discoverability and content protection.</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Optimization */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Optimization Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">📈 Increase Discoverability</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use relevant keywords in your bio</li>
                  <li>• Add appropriate tags to your profile</li>
                  <li>• Link your social media accounts</li>
                  <li>• Post consistently to stay visible</li>
                  <li>• Engage with other creators</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">🔄 Regular Updates</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Refresh your profile picture quarterly</li>
                  <li>• Update your bio with current projects</li>
                  <li>• Review and adjust tier pricing</li>
                  <li>• Add new achievements or milestones</li>
                  <li>• Keep your pinned posts current</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🌟 Profile Checklist</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-1">
                  <li>✓ High-quality profile picture</li>
                  <li>✓ Eye-catching cover photo</li>
                  <li>✓ Detailed, engaging bio</li>
                  <li>✓ Clear subscription tiers</li>
                  <li>✓ Appropriate privacy settings</li>
                </ul>
                <ul className="space-y-1">
                  <li>✓ Linked social media accounts</li>
                  <li>✓ Pinned welcome post</li>
                  <li>✓ Relevant tags and keywords</li>
                  <li>✓ Sample content visible</li>
                  <li>✓ Contact information (if desired)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-center">Related Help Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <User className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Account Creation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Learn how to create and set up your OnlyFur account.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/how-to-create-account">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Content Upload</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Tips for uploading and organizing your content effectively.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/upload-organize-content">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Messaging</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">How to communicate with your subscribers and fans.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/messaging-creators">Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, FolderOpen, Image, Video, FileText, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const UploadOrganizeContent: React.FC = () => {
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
          <Upload className="w-6 h-6 text-purple-500" />
          <Badge variant="secondary">Creator Tools</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Uploading and organizing your content</h1>
        <p className="text-xl text-muted-foreground">
          Best practices for content management and organization to keep your OnlyFur profile professional and engaging.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* File Formats and Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Supported File Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Image className="w-5 h-5 text-blue-500 mr-2" />
                  <h4 className="font-semibold">Images</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• JPEG (.jpg, .jpeg)</li>
                  <li>• PNG (.png)</li>
                  <li>• GIF (.gif)</li>
                  <li>• WebP (.webp)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Max size: 50MB per image</p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Video className="w-5 h-5 text-red-500 mr-2" />
                  <h4 className="font-semibold">Videos</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• MP4 (.mp4)</li>
                  <li>• MOV (.mov)</li>
                  <li>• AVI (.avi)</li>
                  <li>• WebM (.webm)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Max size: 2GB per video</p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FileText className="w-5 h-5 text-green-500 mr-2" />
                  <h4 className="font-semibold">Documents</h4>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• PDF (.pdf)</li>
                  <li>• Text (.txt)</li>
                  <li>• ZIP (.zip)</li>
                  <li>• PSD (.psd)</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Max size: 100MB per file</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Quality Recommendations:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Images: Minimum 1080px width for best display</li>
                <li>• Videos: 1080p (1920x1080) or 4K for premium content</li>
                <li>• Always upload the highest quality you have</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upload Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              How to Upload Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Step-by-Step Upload Process:</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Access Upload Page</p>
                    <p className="text-muted-foreground">Go to your dashboard and click "Upload Content" or use the "+" button in navigation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Choose Files</p>
                    <p className="text-muted-foreground">Drag and drop files or click to browse. You can select multiple files at once</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Add Details</p>
                    <p className="text-muted-foreground">Write descriptions, add tags, set privacy levels, and choose subscription tiers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Preview and Publish</p>
                    <p className="text-muted-foreground">Review your post, schedule if desired, then publish to your subscribers</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Pro Tips:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Upload during peak hours (evenings) for maximum visibility</li>
                <li>• Prepare content in batches to maintain consistent posting</li>
                <li>• Use the scheduler to plan posts in advance</li>
                <li>• Always preview before publishing</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Content Organization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              Organizing Your Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Content Categories:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-purple-600 mb-2">By Content Type</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 🎨 Digital Art</li>
                    <li>• 📸 Photography</li>
                    <li>• 🎥 Videos</li>
                    <li>• 📝 Written Content</li>
                    <li>• 🎭 Character Content</li>
                    <li>• 🎮 Gaming Content</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-600 mb-2">By Subscription Tier</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 🆓 Public/Free Content</li>
                    <li>• 🥉 Basic Subscriber Content</li>
                    <li>• 🥈 Premium Subscriber Content</li>
                    <li>• 🥇 VIP Exclusive Content</li>
                    <li>• 💎 Custom Commission Work</li>
                    <li>• 🎁 Special Events/Limited</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tagging Best Practices:</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <p className="font-medium text-sm mb-1">Use Descriptive Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">furry</Badge>
                    <Badge variant="outline" className="text-xs">wolf</Badge>
                    <Badge variant="outline" className="text-xs">digital-art</Badge>
                    <Badge variant="outline" className="text-xs">commission</Badge>
                    <Badge variant="outline" className="text-xs">fantasy</Badge>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="font-medium text-sm mb-1">Character-Specific Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">original-character</Badge>
                    <Badge variant="outline" className="text-xs">fursona</Badge>
                    <Badge variant="outline" className="text-xs">character-ref</Badge>
                    <Badge variant="outline" className="text-xs">backstory</Badge>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="font-medium text-sm mb-1">Content Style Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">cute</Badge>
                    <Badge variant="outline" className="text-xs">realistic</Badge>
                    <Badge variant="outline" className="text-xs">cartoon</Badge>
                    <Badge variant="outline" className="text-xs">detailed</Badge>
                    <Badge variant="outline" className="text-xs">colorful</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Access Control */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy and Access Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Privacy Levels:</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">Public</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Visible to everyone, appears in explore feeds and search results</p>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="font-medium">Subscribers Only</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Only visible to your subscribers (all tiers)</p>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="font-medium">Tier-Specific</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Only visible to specific subscription tiers (Premium, VIP)</p>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="font-medium">Private</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Only visible to you (drafts, private notes)</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Content Strategy Tip:</strong> Use a mix of public content to attract new subscribers and exclusive content to reward existing ones. Aim for 70% subscriber content, 30% public content.</p>
            </div>
          </CardContent>
        </Card>

        {/* Content Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle>Content Scheduling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Scheduling Features:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <div>
                    <p className="font-medium">Immediate Publishing</p>
                    <p className="text-muted-foreground">Post goes live immediately after uploading</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <p className="font-medium">Scheduled Publishing</p>
                    <p className="text-muted-foreground">Set specific date and time for automatic posting</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <div>
                    <p className="font-medium">Draft Mode</p>
                    <p className="text-muted-foreground">Save content to publish later manually</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Optimal Posting Times:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium mb-2">Weekdays</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Morning: 8-10 AM</li>
                    <li>• Lunch: 12-1 PM</li>
                    <li>• Evening: 6-9 PM</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3">
                  <h5 className="font-medium mb-2">Weekends</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Late Morning: 10 AM-12 PM</li>
                    <li>• Afternoon: 2-4 PM</li>
                    <li>• Evening: 7-10 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Management Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Content Management Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Workflow Organization:</h4>
              <ol className="space-y-2 text-sm">
                <li><strong>1. Content Creation:</strong> Create content in batches when inspired</li>
                <li><strong>2. Content Review:</strong> Review and edit before uploading</li>
                <li><strong>3. Metadata Addition:</strong> Add descriptions, tags, and privacy settings</li>
                <li><strong>4. Scheduling:</strong> Plan publication times strategically</li>
                <li><strong>5. Engagement:</strong> Monitor and respond to comments after posting</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Quality Control Checklist:</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">High-quality images/videos uploaded</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Descriptive title and caption written</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Relevant tags added (5-10 tags recommended)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Appropriate privacy level selected</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Correct subscription tier assigned</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Content preview reviewed</span>
                </label>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Success Metrics to Track:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Engagement rate (likes, comments, shares)</li>
                <li>• View duration for videos</li>
                <li>• Subscriber growth after posting</li>
                <li>• Content performance by tier</li>
                <li>• Peak engagement times</li>
              </ul>
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
            <Link to="/help/articles/setting-up-creator-profile" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Setting up your creator profile</h4>
              <p className="text-sm text-muted-foreground mt-1">Complete your profile to attract subscribers</p>
            </Link>
            <Link to="/help/articles/content-privacy-levels" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Setting content privacy levels</h4>
              <p className="text-sm text-muted-foreground mt-1">Control who can see your content</p>
            </Link>
            <Link to="/help/articles/understanding-analytics" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Understanding creator analytics</h4>
              <p className="text-sm text-muted-foreground mt-1">Track your performance and growth</p>
            </Link>
            <Link to="/help/articles/pricing-strategies" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Pricing strategies for creators</h4>
              <p className="text-sm text-muted-foreground mt-1">Tips for setting subscription prices</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-linear-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Uploads?</h3>
          <p className="mb-4 opacity-90">Our technical support team can help with upload issues and content organization.</p>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Technical Support</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadOrganizeContent;

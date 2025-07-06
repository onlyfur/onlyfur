import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FolderOpen, Image, Video, FileText, Music, Tag, Calendar, Shield } from 'lucide-react';

export default function UploadOrganizeContent() {
  const supportedFormats = [
    {
      type: 'Images',
      icon: Image,
      formats: ['JPEG', 'PNG', 'GIF', 'WebP'],
      maxSize: '50 MB',
      recommended: 'JPEG for photos, PNG for graphics'
    },
    {
      type: 'Videos',
      icon: Video,
      formats: ['MP4', 'MOV', 'AVI', 'WebM'],
      maxSize: '500 MB',
      recommended: 'MP4 H.264 for best compatibility'
    },
    {
      type: 'Audio',
      icon: Music,
      formats: ['MP3', 'WAV', 'AAC', 'OGG'],
      maxSize: '100 MB',
      recommended: 'MP3 320kbps for quality'
    },
    {
      type: 'Documents',
      icon: FileText,
      formats: ['PDF', 'TXT', 'DOC', 'DOCX'],
      maxSize: '25 MB',
      recommended: 'PDF for formatted content'
    }
  ];

  const organizationTips = [
    {
      category: 'Naming Conventions',
      icon: Tag,
      tips: [
        'Use descriptive, consistent file names',
        'Include dates in format YYYY-MM-DD',
        'Add series numbers for sequential content',
        'Use keywords that describe the content'
      ]
    },
    {
      category: 'Content Categories',
      icon: FolderOpen,
      tips: [
        'Create clear content categories',
        'Use consistent tags across similar content',
        'Group related content into collections',
        'Separate public and subscriber-only content'
      ]
    },
    {
      category: 'Scheduling',
      icon: Calendar,
      tips: [
        'Plan content releases in advance',
        'Use scheduling features for consistent posting',
        'Consider your audience\'s active hours',
        'Balance different content types throughout the week'
      ]
    },
    {
      category: 'Privacy Levels',
      icon: Shield,
      tips: [
        'Set appropriate privacy levels before uploading',
        'Review content visibility settings regularly',
        'Use subscriber tiers to control access',
        'Consider preview images for subscription content'
      ]
    }
  ];

  const uploadSteps = [
    {
      step: 1,
      title: 'Prepare Your Content',
      description: 'Ensure your files meet format and size requirements'
    },
    {
      step: 2,
      title: 'Choose Upload Method',
      description: 'Use drag & drop, file browser, or bulk upload'
    },
    {
      step: 3,
      title: 'Add Metadata',
      description: 'Include titles, descriptions, and tags'
    },
    {
      step: 4,
      title: 'Set Privacy Level',
      description: 'Choose who can view your content'
    },
    {
      step: 5,
      title: 'Schedule or Publish',
      description: 'Post immediately or schedule for later'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload & Organize Content
          </CardTitle>
          <p className="text-muted-foreground">
            Complete guide to uploading, organizing, and managing your content as a creator on OnlyFur. 
            Learn best practices for file management, content organization, and optimization.
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported File Formats</CardTitle>
          <p className="text-muted-foreground">
            OnlyFur supports a wide variety of content formats to accommodate different types of creators.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {supportedFormats.map((format) => {
              const IconComponent = format.icon;
              return (
                <div key={format.type} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">{format.type}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Formats: </span>
                      {format.formats.map((fmt, index) => (
                        <Badge key={fmt} variant="secondary" className="ml-1">
                          {fmt}
                        </Badge>
                      ))}
                    </div>
                    <div>
                      <span className="font-medium">Max Size: </span>
                      <span className="text-muted-foreground">{format.maxSize}</span>
                    </div>
                    <div>
                      <span className="font-medium">Recommended: </span>
                      <span className="text-muted-foreground">{format.recommended}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadSteps.map((step) => (
              <div key={step.step} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {step.step}
                </div>
                <div>
                  <h4 className="font-medium mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-medium">Drag & Drop Upload</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The quickest way to upload multiple files at once.
              </p>
              <ol className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>1. Navigate to your content dashboard</li>
                <li>2. Drag files from your computer to the upload area</li>
                <li>3. Files will be automatically queued for upload</li>
                <li>4. Add metadata and settings for each file</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">File Browser Upload</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Traditional file selection method for precise file choosing.
              </p>
              <ol className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>1. Click the "Upload Content" button</li>
                <li>2. Select "Choose Files" to open file browser</li>
                <li>3. Select single or multiple files (Ctrl/Cmd + click)</li>
                <li>4. Click "Open" to begin upload</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Bulk Upload (Premium Feature)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Upload entire folders or large batches with advanced options.
              </p>
              <ol className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>1. Access "Bulk Upload" from the creator tools menu</li>
                <li>2. Select folder or compress files into ZIP archive</li>
                <li>3. Set default metadata for all files</li>
                <li>4. Review and customize individual file settings</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Organization Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {organizationTips.map((section) => {
              const IconComponent = section.icon;
              return (
                <div key={section.category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">{section.category}</h4>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {section.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata and Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Writing Effective Titles</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Keep titles under 60 characters for best display</li>
                <li>• Include relevant keywords for searchability</li>
                <li>• Make titles descriptive but engaging</li>
                <li>• Use consistent naming for series content</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Creating Compelling Descriptions</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Provide context and background for your content</li>
                <li>• Include relevant hashtags and keywords</li>
                <li>• Mention any special techniques or equipment used</li>
                <li>• Add credits for collaborations or commissions</li>
                <li>• Include content warnings when appropriate</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Tagging Strategy</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Use 5-10 relevant tags per content piece</li>
                <li>• Mix popular and niche tags for better discovery</li>
                <li>• Include character names, species, and themes</li>
                <li>• Use consistent tags across related content</li>
                <li>• Research trending tags in your content category</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Collections and Series</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Creating Collections</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Group related content together for better organization and discovery.
              </p>
              <ol className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>1. Go to your content library</li>
                <li>2. Select "Create Collection" from the menu</li>
                <li>3. Add a title and description for the collection</li>
                <li>4. Select content to include in the collection</li>
                <li>5. Set collection privacy and access settings</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Managing Series Content</h4>
              <p className="text-sm text-muted-foreground mb-3">
                For ongoing projects or sequential content releases.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Number episodes or parts clearly</li>
                <li>• Create a consistent release schedule</li>
                <li>• Use series-specific tags and titles</li>
                <li>• Link to previous and next episodes in descriptions</li>
                <li>• Consider creating a dedicated series collection</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality and Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Image Optimization</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Use high resolution (at least 1920x1080 for landscape)</li>
                <li>• Compress images to reduce file size without quality loss</li>
                <li>• Consider aspect ratios for different display formats</li>
                <li>• Use consistent color profiles across your content</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Video Optimization</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Export in 1080p or higher for best quality</li>
                <li>• Use H.264 codec for broad compatibility</li>
                <li>• Keep bitrate between 5-15 Mbps for optimal streaming</li>
                <li>• Include engaging thumbnails and preview clips</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Audio Optimization</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Record at 44.1kHz sample rate minimum</li>
                <li>• Use 320kbps for MP3 or lossless formats when possible</li>
                <li>• Normalize audio levels for consistent playback</li>
                <li>• Include cover art for audio-only content</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Content Library Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Search and filter your content by various criteria</li>
                <li>• Bulk edit metadata for multiple files</li>
                <li>• Duplicate successful content with similar settings</li>
                <li>• Archive or delete old content to manage storage</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Storage Management</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Monitor your storage usage in account settings</li>
                <li>• Compress or resize large files to save space</li>
                <li>• Remove duplicate or unused content regularly</li>
                <li>• Upgrade to higher tiers for more storage capacity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Upload Issues and Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Upload Failures</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Check file size limits and format compatibility</li>
                <li>• Ensure stable internet connection</li>
                <li>• Clear browser cache and try again</li>
                <li>• Try uploading files one at a time</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Slow Upload Speeds</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Upload during off-peak hours</li>
                <li>• Close other applications using bandwidth</li>
                <li>• Use wired connection instead of Wi-Fi when possible</li>
                <li>• Consider compressing large files before upload</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Processing Delays</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Large files may take longer to process</li>
                <li>• High-resolution videos require additional processing time</li>
                <li>• Content will be available once processing completes</li>
                <li>• You'll receive a notification when content is ready</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

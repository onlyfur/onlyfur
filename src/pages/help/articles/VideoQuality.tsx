import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, Settings, Sliders, FileVideo, Gauge, Zap, Upload, AlertTriangle, MessageCircle, FileText, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoQuality: React.FC = () => {
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
          <Video className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Content Creation</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Video quality guidelines</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to optimize your videos for the best quality, performance, and viewer experience on OnlyFur.
        </p>
      </div>

      {/* Quick Overview */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Video Quality at a Glance</h3>
          <p className="text-muted-foreground mb-4">
            High-quality videos lead to better engagement, more subscribers, and higher earnings. Follow these guidelines to ensure your videos look their best on all devices.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <FileVideo className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Optimal Formats</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Resolution Settings</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Bitrate Guidelines</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Performance Tips</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Recommended Video Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileVideo className="w-5 h-5 mr-2 text-blue-500" />
              Recommended Video Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Optimal Video Formats for OnlyFur:</h4>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">MP4 (H.264) - Recommended</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Why it's best:</strong> Excellent balance of quality and file size, widely compatible across all devices.</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Specifications:</p>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        <li>Container: MP4</li>
                        <li>Video codec: H.264 (AVC)</li>
                        <li>Audio codec: AAC</li>
                        <li>Maximum file size: 2GB</li>
                        <li>Maximum length: 60 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">WebM (VP9) - Alternative</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Best for:</strong> Higher compression efficiency, good for longer videos where file size is a concern.</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Specifications:</p>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        <li>Container: WebM</li>
                        <li>Video codec: VP9</li>
                        <li>Audio codec: Opus</li>
                        <li>Maximum file size: 2GB</li>
                        <li>Maximum length: 60 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">MOV (H.264) - For Mac Users</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Best for:</strong> Content created on Apple devices, maintains good quality but larger file sizes.</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Specifications:</p>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        <li>Container: MOV</li>
                        <li>Video codec: H.264</li>
                        <li>Audio codec: AAC</li>
                        <li>Maximum file size: 2GB</li>
                        <li>Maximum length: 60 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
                  <h5 className="font-medium text-yellow-600 mb-2">Formats to Avoid</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Not recommended:</strong> These formats may cause quality issues or playback problems.</p>
                    <ul className="text-sm space-y-1 pl-5 list-disc">
                      <li>AVI (outdated, large file sizes)</li>
                      <li>WMV (limited compatibility)</li>
                      <li>FLV (deprecated format)</li>
                      <li>3GP (low quality mobile format)</li>
                      <li>MKV (limited web compatibility)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Format Conversion Tip:</strong> If your video is in a format not listed above, use a free converter like <a href="https://handbrake.fr/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">HandBrake</a> or <a href="https://www.ffmpeg.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">FFmpeg</a> to convert it to MP4 (H.264) before uploading.</p>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sliders className="w-5 h-5 mr-2 text-purple-500" />
              Resolution Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Optimal Resolutions for Different Content Types:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">Resolution</th>
                      <th className="border p-2">Pixel Dimensions</th>
                      <th className="border p-2">Best For</th>
                      <th className="border p-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 font-medium">4K (UHD)</td>
                      <td className="border p-2">3840 × 2160</td>
                      <td className="border p-2">Premium content, animations, high-detail artwork showcases</td>
                      <td className="border p-2">Large file size, use for special content only</td>
                    </tr>
                    <tr className="bg-green-50 dark:bg-green-900/10">
                      <td className="border p-2 font-medium text-green-600">1080p (Full HD)</td>
                      <td className="border p-2">1920 × 1080</td>
                      <td className="border p-2">Standard for most content, recommended default</td>
                      <td className="border p-2">Best balance of quality and file size</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">720p (HD)</td>
                      <td className="border p-2">1280 × 720</td>
                      <td className="border p-2">Longer videos, mobile-focused content</td>
                      <td className="border p-2">Good for reducing file size</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">480p (SD)</td>
                      <td className="border p-2">854 × 480</td>
                      <td className="border p-2">Very long videos, talking head content</td>
                      <td className="border p-2">Not recommended for visual showcases</td>
                    </tr>
                    <tr className="bg-red-50 dark:bg-red-900/10">
                      <td className="border p-2 font-medium text-red-600">360p or lower</td>
                      <td className="border p-2">640 × 360 or smaller</td>
                      <td className="border p-2">Not recommended</td>
                      <td className="border p-2">Too low quality for paid content</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Aspect Ratios:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="aspect-video bg-blue-100 dark:bg-blue-900/20 mb-3 flex items-center justify-center">
                    <span className="text-xs font-medium">16:9</span>
                  </div>
                  <h5 className="font-medium text-sm mb-1">Landscape (16:9)</h5>
                  <p className="text-xs text-muted-foreground">Standard widescreen format, best for most content. Recommended for desktop viewing.</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="aspect-square bg-blue-100 dark:bg-blue-900/20 mb-3 flex items-center justify-center">
                    <span className="text-xs font-medium">1:1</span>
                  </div>
                  <h5 className="font-medium text-sm mb-1">Square (1:1)</h5>
                  <p className="text-xs text-muted-foreground">Good for content that will be shared on social media. Works well on both mobile and desktop.</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="w-2/3 mx-auto aspect-[9/16] bg-blue-100 dark:bg-blue-900/20 mb-3 flex items-center justify-center">
                    <span className="text-xs font-medium">9:16</span>
                  </div>
                  <h5 className="font-medium text-sm mb-1">Portrait (9:16)</h5>
                  <p className="text-xs text-muted-foreground">Optimized for mobile viewing. Good for content primarily viewed on phones.</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Resolution Tip:</strong> When in doubt, use 1080p (1920×1080) with a 16:9 aspect ratio. This provides excellent quality for most content while keeping file sizes manageable. For premium tier subscribers, consider offering 4K versions of select content as an added value.</p>
            </div>
          </CardContent>
        </Card>

        {/* Bitrate and Encoding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gauge className="w-5 h-5 mr-2 text-green-500" />
              Bitrate and Encoding Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Recommended Bitrate Settings:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">Resolution</th>
                      <th className="border p-2">Standard Content</th>
                      <th className="border p-2">High Motion Content</th>
                      <th className="border p-2">File Size (10 min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">4K (2160p)</td>
                      <td className="border p-2">35-45 Mbps</td>
                      <td className="border p-2">53-68 Mbps</td>
                      <td className="border p-2">~2.6-5.1 GB</td>
                    </tr>
                    <tr className="bg-green-50 dark:bg-green-900/10">
                      <td className="border p-2">1080p</td>
                      <td className="border p-2">8-12 Mbps</td>
                      <td className="border p-2">10-20 Mbps</td>
                      <td className="border p-2">~600-1500 MB</td>
                    </tr>
                    <tr>
                      <td className="border p-2">720p</td>
                      <td className="border p-2">5-7.5 Mbps</td>
                      <td className="border p-2">7.5-10 Mbps</td>
                      <td className="border p-2">~375-750 MB</td>
                    </tr>
                    <tr>
                      <td className="border p-2">480p</td>
                      <td className="border p-2">2.5-4 Mbps</td>
                      <td className="border p-2">4-6 Mbps</td>
                      <td className="border p-2">~188-450 MB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">* High motion content includes fast action, quick scene changes, or complex animations</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Audio Settings:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Recommended Audio Settings</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Codec:</strong> AAC (Advanced Audio Coding)</li>
                    <li>• <strong>Bitrate:</strong> 128-256 Kbps (stereo)</li>
                    <li>• <strong>Sample rate:</strong> 44.1 kHz or 48 kHz</li>
                    <li>• <strong>Channels:</strong> Stereo (2 channels)</li>
                    <li>• <strong>Normalization:</strong> -14 dB to -16 dB LUFS</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Audio Quality Tips</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Record in a quiet environment</li>
                    <li>• Use a good quality microphone</li>
                    <li>• Normalize audio to prevent volume issues</li>
                    <li>• Remove background noise in editing</li>
                    <li>• Check audio on different devices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Advanced Encoding Settings:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Frame Rate</p>
                  <p className="text-xs text-muted-foreground">
                    Use the frame rate your content was recorded in. Common options:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1 pl-5 list-disc">
                    <li>24 fps: Cinematic look, good for narrative content</li>
                    <li>30 fps: Standard for most content, good balance</li>
                    <li>60 fps: Smooth motion, good for action or gaming content</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Keyframe Interval</p>
                  <p className="text-xs text-muted-foreground">
                    Set keyframe interval to 2 seconds (or 60 frames at 30fps)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This improves seeking/scrubbing through the video and overall streaming performance.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Encoding Profile</p>
                  <p className="text-xs text-muted-foreground">
                    For H.264 (AVC), use High Profile (not Baseline or Main) for best quality.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Level 4.1 or 4.2 is recommended for 1080p content.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Rate Control</p>
                  <p className="text-xs text-muted-foreground">
                    Use VBR (Variable Bit Rate) 2-pass encoding for the best quality-to-size ratio.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    For live content or quick uploads, CRF (Constant Rate Factor) 18-23 is a good alternative.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Encoding Tip:</strong> If you're not familiar with video encoding, use these presets in your video editor or converter:</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• <strong>Adobe Premiere Pro:</strong> Export using H.264, Match Source - High Bitrate</li>
                <li>• <strong>Final Cut Pro:</strong> Export using H.264, Better Quality</li>
                <li>• <strong>DaVinci Resolve:</strong> QuickTime H.264, Quality set to High</li>
                <li>• <strong>HandBrake:</strong> H.264 video, Web Optimized, Constant Quality RF 18-22</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-500" />
              Video Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Tips for Better Video Performance:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Lighting & Visual Quality</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Use good lighting to reduce video noise</li>
                    <li>• Ensure your subject is well-lit and in focus</li>
                    <li>• Avoid backlighting that creates silhouettes</li>
                    <li>• Use a tripod or stabilizer for steady footage</li>
                    <li>• Consider your background and composition</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Editing & Post-Production</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Trim unnecessary footage to keep viewers engaged</li>
                    <li>• Add a title card and end screen</li>
                    <li>• Color grade for consistent, appealing visuals</li>
                    <li>• Add subtle background music when appropriate</li>
                    <li>• Consider adding captions for accessibility</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">File Size Optimization</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Remove unused audio tracks before exporting</li>
                    <li>• Use two-pass encoding for better compression</li>
                    <li>• Consider splitting very long videos into parts</li>
                    <li>• Remove unnecessary high-frequency detail</li>
                    <li>• Use scene detection for better compression</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-orange-600 mb-2">Platform-Specific Tips</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Create an eye-catching thumbnail</li>
                    <li>• Add detailed descriptions with timestamps</li>
                    <li>• Tag your content appropriately</li>
                    <li>• Consider offering multiple quality versions</li>
                    <li>• Test playback on different devices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Common Video Issues and Solutions:</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">1</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Blurry or Pixelated Video</h5>
                    <p className="text-xs text-muted-foreground"><strong>Cause:</strong> Bitrate too low, resolution too low, or excessive compression.</p>
                    <p className="text-xs text-muted-foreground"><strong>Solution:</strong> Increase bitrate, use higher resolution, or check export settings for quality options.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Audio Out of Sync</h5>
                    <p className="text-xs text-muted-foreground"><strong>Cause:</strong> Variable frame rate recording, editing issues, or conversion problems.</p>
                    <p className="text-xs text-muted-foreground"><strong>Solution:</strong> Convert to constant frame rate before editing, check audio sync during editing, use proper export settings.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Buffering or Slow Playback</h5>
                    <p className="text-xs text-muted-foreground"><strong>Cause:</strong> File size too large, bitrate too high, or inefficient encoding.</p>
                    <p className="text-xs text-muted-foreground"><strong>Solution:</strong> Optimize bitrate for streaming, use efficient codecs, ensure proper keyframe intervals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">4</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">Color Issues</h5>
                    <p className="text-xs text-muted-foreground"><strong>Cause:</strong> Incorrect color space, color profile issues, or export settings.</p>
                    <p className="text-xs text-muted-foreground"><strong>Solution:</strong> Use Rec.709 color space for standard content, check color management in your editor, avoid extreme color grading.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Quality Testing Tip:</strong> Before uploading, watch your video on multiple devices (computer, tablet, phone) to ensure it looks good across different screen sizes. Pay special attention to dark scenes, which often reveal compression artifacts.</p>
            </div>
          </CardContent>
        </Card>

        {/* Software Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-500" />
              Recommended Software
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Video Editing Software:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Professional</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Adobe Premiere Pro</strong> ($20.99/mo)</li>
                    <li>• <strong>Final Cut Pro</strong> ($299.99 one-time)</li>
                    <li>• <strong>DaVinci Resolve Studio</strong> ($295 one-time)</li>
                    <li>• <strong>Vegas Pro</strong> ($12.99/mo or $399 one-time)</li>
                    <li>• <strong>Avid Media Composer</strong> ($23.99/mo)</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Mid-Range</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Adobe Premiere Elements</strong> ($99.99 one-time)</li>
                    <li>• <strong>Filmora</strong> ($49.99/year)</li>
                    <li>• <strong>PowerDirector</strong> ($69.99/year)</li>
                    <li>• <strong>Pinnacle Studio</strong> ($59.95 one-time)</li>
                    <li>• <strong>Vegas Movie Studio</strong> ($49.99 one-time)</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Free Options</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>DaVinci Resolve</strong> (Free version)</li>
                    <li>• <strong>Shotcut</strong> (Open source)</li>
                    <li>• <strong>HitFilm Express</strong> (Free version)</li>
                    <li>• <strong>OpenShot</strong> (Open source)</li>
                    <li>• <strong>iMovie</strong> (Free for Mac users)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Video Conversion and Compression:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Conversion Tools</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>HandBrake</strong> (Free, open-source)</li>
                    <li>• <strong>FFmpeg</strong> (Free, command-line)</li>
                    <li>• <strong>Adobe Media Encoder</strong> (Included with Adobe CC)</li>
                    <li>• <strong>Shutter Encoder</strong> (Free)</li>
                    <li>• <strong>XMedia Recode</strong> (Free)</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Online Tools</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Clideo</strong> (Free tier available)</li>
                    <li>• <strong>CloudConvert</strong> (Free tier available)</li>
                    <li>• <strong>FreeConvert</strong> (Free tier available)</li>
                    <li>• <strong>Online-Convert</strong> (Free tier available)</li>
                    <li>• <strong>Kapwing</strong> (Free tier available)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Software Recommendation:</strong> For most creators, we recommend <strong>DaVinci Resolve</strong> (free version) for editing and <strong>HandBrake</strong> for conversion/compression. This combination provides professional-quality results at no cost, with a reasonable learning curve.</p>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Upload and Processing Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">🔍 Common Upload Issues</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Video upload fails or times out</li>
                  <li>• Processing gets stuck at a certain percentage</li>
                  <li>• Video quality is lower than the original</li>
                  <li>• Audio issues after upload</li>
                  <li>• Playback problems on certain devices</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">🛠️ Quick Solutions</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Check your internet connection stability</li>
                  <li>• Reduce file size if over 2GB</li>
                  <li>• Convert to MP4 (H.264) format</li>
                  <li>• Try uploading during off-peak hours</li>
                  <li>• Check for codec compatibility issues</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📝 For Detailed Troubleshooting</h4>
              <p className="text-sm">If you're experiencing persistent video upload or quality issues, please check our detailed troubleshooting guide:</p>
              <div className="mt-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/help/articles/upload-troubleshooting">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    View Upload Troubleshooting Guide
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help With Video Quality?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our technical support team can provide personalized advice for your specific video content and setup.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-blue-600 hover:text-blue-700" asChild>
                <Link to="/contact">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/help">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Help Center
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-center">Related Help Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Learn about all supported file types and size limits.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/supported-formats">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Upload Troubleshooting</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Solutions for common upload issues and errors.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/upload-troubleshooting">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <Monitor className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Browser Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Browser recommendations for the best experience.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/browser-compatibility">Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoQuality;
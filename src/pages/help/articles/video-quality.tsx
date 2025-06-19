import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Settings, Zap, Monitor, Smartphone, Tablet, CheckCircle, AlertTriangle } from 'lucide-react';

export default function VideoQuality() {
  const qualitySettings = [
    {
      quality: '4K (2160p)',
      resolution: '3840x2160',
      bitrate: '15-25 Mbps',
      use: 'Premium content, showcase work',
      audience: 'Desktop users with fast internet',
      recommended: false
    },
    {
      quality: '1080p HD',
      resolution: '1920x1080',
      bitrate: '8-12 Mbps',
      use: 'Standard high-quality content',
      audience: 'Most users, best balance',
      recommended: true
    },
    {
      quality: '720p HD',
      resolution: '1280x720',
      bitrate: '5-8 Mbps',
      use: 'Good quality, smaller files',
      audience: 'Mobile users, slower internet',
      recommended: false
    },
    {
      quality: '480p',
      resolution: '854x480',
      bitrate: '2.5-4 Mbps',
      use: 'Preview clips, thumbnails',
      audience: 'Very slow internet, backup quality',
      recommended: false
    }
  ];

  const codecs = [
    {
      name: 'H.264 (AVC)',
      compatibility: 'Excellent',
      fileSize: 'Medium',
      quality: 'Good',
      recommendation: 'Best for most content',
      pros: ['Universal compatibility', 'Good compression', 'Fast encoding'],
      cons: ['Larger files than newer codecs', 'Not future-proof']
    },
    {
      name: 'H.265 (HEVC)',
      compatibility: 'Good',
      fileSize: 'Small',
      quality: 'Excellent',
      recommendation: 'For high-quality, long content',
      pros: ['Excellent compression', 'High quality', 'Smaller files'],
      cons: ['Limited compatibility', 'Slower encoding', 'Licensing costs']
    },
    {
      name: 'VP9',
      compatibility: 'Fair',
      fileSize: 'Small',
      quality: 'Excellent',
      recommendation: 'Alternative to H.265',
      pros: ['Open source', 'Good compression', 'No licensing fees'],
      cons: ['Browser support varies', 'CPU intensive']
    }
  ];

  const optimizationTips = [
    {
      category: 'Pre-Production',
      icon: Settings,
      tips: [
        'Plan your shots to minimize post-processing needs',
        'Use adequate lighting to reduce noise',
        'Record at consistent frame rates (24, 30, or 60 fps)',
        'Use a tripod or stabilizer for smooth footage',
        'Record in the highest quality your equipment allows'
      ]
    },
    {
      category: 'Recording Settings',
      icon: Video,
      tips: [
        'Record in 1080p or higher resolution',
        'Use 30fps for most content, 60fps for action',
        'Set bitrate to 20-50 Mbps for recording',
        'Choose proper aspect ratio (16:9 for horizontal)',
        'Enable image stabilization if available'
      ]
    },
    {
      category: 'Export Settings',
      icon: Zap,
      tips: [
        'Export in H.264 format for best compatibility',
        'Use constant bitrate (CBR) for streaming',
        'Match frame rate to original recording',
        'Use 2-pass encoding for better quality',
        'Include closed captions when possible'
      ]
    }
  ];

  const deviceOptimization = [
    {
      device: 'Desktop/Laptop',
      icon: Monitor,
      resolution: '1080p - 4K',
      recommendations: [
        'Use highest available quality',
        'Progressive download for long videos',
        'Include multiple quality options',
        'Optimize for widescreen viewing'
      ]
    },
    {
      device: 'Tablet',
      icon: Tablet,
      resolution: '720p - 1080p',
      recommendations: [
        'Focus on 1080p as primary quality',
        'Ensure touch-friendly controls',
        'Optimize for both orientations',
        'Consider data usage for cellular users'
      ]
    },
    {
      device: 'Mobile Phone',
      icon: Smartphone,
      resolution: '480p - 720p',
      recommendations: [
        'Provide 720p and 480p options',
        'Optimize for vertical viewing when relevant',
        'Keep file sizes reasonable for data plans',
        'Ensure fast loading and playback start'
      ]
    }
  ];

  const troubleshooting = [
    {
      issue: 'Video won\'t play',
      solutions: [
        'Check if codec is supported (use H.264)',
        'Verify file isn\'t corrupted',
        'Try re-encoding with different settings',
        'Check if file size exceeds platform limits'
      ]
    },
    {
      issue: 'Poor video quality after upload',
      solutions: [
        'Upload higher resolution source file',
        'Use higher bitrate during export',
        'Avoid upscaling lower resolution content',
        'Check compression settings in editor'
      ]
    },
    {
      issue: 'Long upload times',
      solutions: [
        'Compress video before uploading',
        'Use lower resolution for preview versions',
        'Upload during off-peak hours',
        'Consider splitting longer videos'
      ]
    },
    {
      issue: 'Buffering or streaming issues',
      solutions: [
        'Provide multiple quality options',
        'Use adaptive bitrate streaming',
        'Optimize keyframe intervals',
        'Test on different internet speeds'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Quality Guidelines
          </CardTitle>
          <p className="text-muted-foreground">
            Learn how to optimize your video content for the best viewing experience across all devices and connection speeds.
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Quality Settings</CardTitle>
          <p className="text-muted-foreground">
            Choose the right quality settings based on your content type and target audience.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualitySettings.map((setting) => (
              <div key={setting.quality} className="p-4 border rounded-lg relative">
                {setting.recommended && (
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    Recommended
                  </Badge>
                )}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {setting.quality}
                      {setting.recommended && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </h4>
                    <p className="text-sm text-muted-foreground">{setting.resolution}</p>
                    <p className="text-sm text-muted-foreground">Bitrate: {setting.bitrate}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Best for:</h5>
                    <p className="text-sm text-muted-foreground">{setting.use}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Target audience:</h5>
                    <p className="text-sm text-muted-foreground">{setting.audience}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Codecs Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {codecs.map((codec) => (
              <div key={codec.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{codec.name}</h4>
                  <Badge variant={codec.name === 'H.264 (AVC)' ? 'default' : 'secondary'}>
                    {codec.recommendation}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Compatibility:</span>
                      <Badge variant={
                        codec.compatibility === 'Excellent' ? 'default' :
                        codec.compatibility === 'Good' ? 'secondary' : 'warning'
                      }>
                        {codec.compatibility}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">File Size:</span>
                      <span className="text-sm text-muted-foreground">{codec.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Quality:</span>
                      <span className="text-sm text-muted-foreground">{codec.quality}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-sm font-medium text-green-600 mb-1">Pros:</h6>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {codec.pros.map((pro, idx) => (
                            <li key={idx}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-red-600 mb-1">Cons:</h6>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {codec.cons.map((con, idx) => (
                            <li key={idx}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device-Specific Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deviceOptimization.map((device) => {
              const IconComponent = device.icon;
              return (
                <div key={device.device} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">{device.device}</h4>
                    <Badge variant="secondary">{device.resolution}</Badge>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {device.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {rec}
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
          <CardTitle>Optimization Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {optimizationTips.map((section) => {
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
          <CardTitle>Platform-Specific Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-3">OnlyFur Recommended Settings</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Standard Content:</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Resolution: 1920x1080 (1080p)</li>
                    <li>• Frame Rate: 30fps</li>
                    <li>• Bitrate: 8-12 Mbps</li>
                    <li>• Codec: H.264</li>
                    <li>• Audio: AAC, 128-320 kbps</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Premium Content:</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Resolution: 3840x2160 (4K)</li>
                    <li>• Frame Rate: 30-60fps</li>
                    <li>• Bitrate: 15-25 Mbps</li>
                    <li>• Codec: H.264 or H.265</li>
                    <li>• Audio: AAC, 256-320 kbps</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">File Size Guidelines</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Maximum file size: 500MB per video</li>
                <li>• Recommended: Keep under 100MB for better user experience</li>
                <li>• For longer content: Consider breaking into episodes</li>
                <li>• Use compression tools to optimize file size without quality loss</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {troubleshooting.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <h4 className="font-medium">{item.issue}</h4>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {item.solutions.map((solution, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testing Your Video Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Quality Checklist</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Video plays smoothly without stuttering
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Image is sharp and clear at intended viewing size
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Audio is clear and properly synchronized
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  File size is reasonable for content length
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  Video loads quickly and starts playing promptly
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Testing Across Devices</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Always test your content on multiple devices before publishing:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Preview on desktop/laptop computers</li>
                <li>• Test on mobile phones (both iOS and Android)</li>
                <li>• Check tablet viewing experience</li>
                <li>• Test with different internet speeds</li>
                <li>• Verify compatibility across major browsers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

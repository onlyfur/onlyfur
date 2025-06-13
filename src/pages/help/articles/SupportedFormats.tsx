import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Image, Video, File, FileArchive, AlertTriangle, CheckCircle, Upload, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportedFormats: React.FC = () => {
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
          <FileText className="w-6 h-6 text-blue-500" />
          <Badge variant="secondary">Content Creation</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Supported file formats and size limits</h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive guide to all file types, formats, and size restrictions for uploading content to OnlyFur.
        </p>
      </div>

      {/* Format Overview */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Format Support Overview</h3>
          <p className="text-muted-foreground mb-4">
            OnlyFur supports a wide range of file formats to help you share your creative content. Understanding format limitations ensures smooth uploads and optimal display quality.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Image className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Image Files</span>
            </div>
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Video Files</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Document Files</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileArchive className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Archive Files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Image Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="w-5 h-5 mr-2 text-blue-500" />
              Image Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Supported Image Formats:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">JPEG/JPG</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 50MB</li>
                    <li>• <strong>Max dimensions:</strong> 10,000 x 10,000px</li>
                    <li>• <strong>Best for:</strong> Photos, artwork</li>
                    <li>• <strong>Quality:</strong> Lossy compression</li>
                    <li>• <strong>Transparency:</strong> Not supported</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">PNG</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 50MB</li>
                    <li>• <strong>Max dimensions:</strong> 10,000 x 10,000px</li>
                    <li>• <strong>Best for:</strong> Graphics, transparency</li>
                    <li>• <strong>Quality:</strong> Lossless compression</li>
                    <li>• <strong>Transparency:</strong> Fully supported</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">GIF</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 50MB</li>
                    <li>• <strong>Max dimensions:</strong> 5,000 x 5,000px</li>
                    <li>• <strong>Best for:</strong> Animations, simple graphics</li>
                    <li>• <strong>Quality:</strong> Limited colors (256)</li>
                    <li>• <strong>Animation:</strong> Supported</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">WebP</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 50MB</li>
                    <li>• <strong>Max dimensions:</strong> 10,000 x 10,000px</li>
                    <li>• <strong>Best for:</strong> Web optimization</li>
                    <li>• <strong>Quality:</strong> Better than JPEG at same size</li>
                    <li>• <strong>Animation:</strong> Supported</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">HEIF/HEIC</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 50MB</li>
                    <li>• <strong>Max dimensions:</strong> 10,000 x 10,000px</li>
                    <li>• <strong>Best for:</strong> iOS photos</li>
                    <li>• <strong>Quality:</strong> Better than JPEG</li>
                    <li>• <strong>Support:</strong> Limited browser support</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">TIFF</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 100MB</li>
                    <li>• <strong>Max dimensions:</strong> 10,000 x 10,000px</li>
                    <li>• <strong>Best for:</strong> High-quality artwork</li>
                    <li>• <strong>Quality:</strong> Lossless, high fidelity</li>
                    <li>• <strong>Support:</strong> Limited browser support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Image Recommendations:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Use JPEG for photographs and most artwork</li>
                <li>• Use PNG for graphics with transparency or text</li>
                <li>• Use GIF only for simple animations</li>
                <li>• Aim for at least 1080px width for best display quality</li>
                <li>• Keep file sizes under 10MB for faster loading</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Video Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="w-5 h-5 mr-2 text-red-500" />
              Video Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Supported Video Formats:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">MP4 (H.264)</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 2GB</li>
                    <li>• <strong>Max duration:</strong> 60 minutes</li>
                    <li>• <strong>Max resolution:</strong> 4K (3840 x 2160)</li>
                    <li>• <strong>Best for:</strong> Most video content</li>
                    <li>• <strong>Compatibility:</strong> Excellent</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">MOV</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 2GB</li>
                    <li>• <strong>Max duration:</strong> 60 minutes</li>
                    <li>• <strong>Max resolution:</strong> 4K (3840 x 2160)</li>
                    <li>• <strong>Best for:</strong> Apple device recordings</li>
                    <li>• <strong>Compatibility:</strong> Good</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">WebM</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 2GB</li>
                    <li>• <strong>Max duration:</strong> 60 minutes</li>
                    <li>• <strong>Max resolution:</strong> 4K (3840 x 2160)</li>
                    <li>• <strong>Best for:</strong> Web-optimized video</li>
                    <li>• <strong>Compatibility:</strong> Good on modern browsers</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">AVI</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 2GB</li>
                    <li>• <strong>Max duration:</strong> 60 minutes</li>
                    <li>• <strong>Max resolution:</strong> 4K (3840 x 2160)</li>
                    <li>• <strong>Best for:</strong> Windows recordings</li>
                    <li>• <strong>Compatibility:</strong> Fair</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">MKV</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 2GB</li>
                    <li>• <strong>Max duration:</strong> 60 minutes</li>
                    <li>• <strong>Max resolution:</strong> 4K (3840 x 2160)</li>
                    <li>• <strong>Best for:</strong> High-quality video</li>
                    <li>• <strong>Compatibility:</strong> Limited</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">FLV</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 2GB</li>
                    <li>• <strong>Max duration:</strong> 60 minutes</li>
                    <li>• <strong>Max resolution:</strong> 1080p</li>
                    <li>• <strong>Best for:</strong> Legacy content</li>
                    <li>• <strong>Compatibility:</strong> Limited</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Video Specifications:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Recommended Encoding</p>
                  <p className="text-xs text-muted-foreground">H.264 codec with AAC audio at 128kbps or higher</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Frame Rate</p>
                  <p className="text-xs text-muted-foreground">24-60 FPS (frames per second)</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Aspect Ratio</p>
                  <p className="text-xs text-muted-foreground">16:9 (widescreen) or 9:16 (vertical) recommended</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-sm">Bit Rate</p>
                  <p className="text-xs text-muted-foreground">8-15 Mbps for 1080p, 20-30 Mbps for 4K</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Video Recommendations:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Use MP4 (H.264) format for best compatibility</li>
                <li>• Keep videos under 10 minutes for optimal streaming</li>
                <li>• 1080p resolution is ideal for most content</li>
                <li>• Include captions or subtitles when possible</li>
                <li>• Consider creating preview clips for longer videos</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Document Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-500" />
              Document Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Supported Document Formats:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">PDF</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 100MB</li>
                    <li>• <strong>Max pages:</strong> 500</li>
                    <li>• <strong>Best for:</strong> Multi-page documents</li>
                    <li>• <strong>Viewer:</strong> Built-in PDF viewer</li>
                    <li>• <strong>Compatibility:</strong> Excellent</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">TXT</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 50MB</li>
                    <li>• <strong>Best for:</strong> Plain text, stories</li>
                    <li>• <strong>Encoding:</strong> UTF-8 supported</li>
                    <li>• <strong>Viewer:</strong> In-browser text viewer</li>
                    <li>• <strong>Compatibility:</strong> Universal</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">DOCX/DOC</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 100MB</li>
                    <li>• <strong>Best for:</strong> Word documents</li>
                    <li>• <strong>Viewer:</strong> Download required</li>
                    <li>• <strong>Compatibility:</strong> Good</li>
                    <li>• <strong>Note:</strong> Convert to PDF recommended</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">EPUB</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 100MB</li>
                    <li>• <strong>Best for:</strong> E-books, long stories</li>
                    <li>• <strong>Viewer:</strong> Built-in EPUB viewer</li>
                    <li>• <strong>Compatibility:</strong> Good</li>
                    <li>• <strong>Features:</strong> Supports chapters, TOC</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">RTF</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 50MB</li>
                    <li>• <strong>Best for:</strong> Formatted text</li>
                    <li>• <strong>Viewer:</strong> In-browser viewer</li>
                    <li>• <strong>Compatibility:</strong> Good</li>
                    <li>• <strong>Features:</strong> Basic formatting</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-green-600 mb-2">Markdown</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 50MB</li>
                    <li>• <strong>Best for:</strong> Formatted text</li>
                    <li>• <strong>Viewer:</strong> Rendered in browser</li>
                    <li>• <strong>Compatibility:</strong> Good</li>
                    <li>• <strong>Features:</strong> Supports basic formatting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Document Recommendations:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Use PDF for most document sharing</li>
                <li>• Include bookmarks in PDFs for easier navigation</li>
                <li>• Keep text documents under 20MB for faster loading</li>
                <li>• Use EPUB for long-form fiction or stories</li>
                <li>• Convert Word documents to PDF before uploading</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Other Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <File className="w-5 h-5 mr-2 text-purple-500" />
              Other Supported Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Archive and Special Formats:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">ZIP</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 500MB</li>
                    <li>• <strong>Best for:</strong> Multiple file delivery</li>
                    <li>• <strong>Handling:</strong> Download only</li>
                    <li>• <strong>Security:</strong> Scanned for malware</li>
                    <li>• <strong>Note:</strong> Password protection supported</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">RAR</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 500MB</li>
                    <li>• <strong>Best for:</strong> Compressed archives</li>
                    <li>• <strong>Handling:</strong> Download only</li>
                    <li>• <strong>Security:</strong> Scanned for malware</li>
                    <li>• <strong>Note:</strong> Better compression than ZIP</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">PSD</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 500MB</li>
                    <li>• <strong>Best for:</strong> Photoshop source files</li>
                    <li>• <strong>Handling:</strong> Download only</li>
                    <li>• <strong>Preview:</strong> First layer shown</li>
                    <li>• <strong>Note:</strong> Include JPG preview recommended</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">AI/EPS</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Max size:</strong> 500MB</li>
                    <li>• <strong>Best for:</strong> Vector artwork</li>
                    <li>• <strong>Handling:</strong> Download only</li>
                    <li>• <strong>Preview:</strong> Generated thumbnail</li>
                    <li>• <strong>Note:</strong> Include PNG preview recommended</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">3D Models</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Formats:</strong> OBJ, STL, FBX, GLTF</li>
                    <li>• <strong>Max size:</strong> 500MB</li>
                    <li>• <strong>Handling:</strong> Download only</li>
                    <li>• <strong>Preview:</strong> Static image only</li>
                    <li>• <strong>Note:</strong> Include renders recommended</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Audio</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Formats:</strong> MP3, WAV, OGG, FLAC</li>
                    <li>• <strong>Max size:</strong> 200MB</li>
                    <li>• <strong>Max duration:</strong> 3 hours</li>
                    <li>• <strong>Player:</strong> Built-in audio player</li>
                    <li>• <strong>Note:</strong> MP3 recommended for compatibility</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Special Format Tips:</strong></p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Always include preview images with specialized formats</li>
                <li>• Use ZIP for bundling multiple files together</li>
                <li>• Provide installation/usage instructions for specialized files</li>
                <li>• Consider file size impact on subscriber download times</li>
                <li>• Test downloads to ensure files remain intact</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Unsupported Formats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Unsupported Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Files That Cannot Be Uploaded:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Executable Files</p>
                  <p className="text-xs text-muted-foreground">.exe, .bat, .msi, .app, .dmg, .sh and other executable formats</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Script Files</p>
                  <p className="text-xs text-muted-foreground">.js, .php, .py, .rb, .pl and other script formats</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">System Files</p>
                  <p className="text-xs text-muted-foreground">.sys, .dll, .bin, .dat and other system files</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Database Files</p>
                  <p className="text-xs text-muted-foreground">.db, .sql, .mdb, .accdb and other database formats</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-sm">Certain Archive Types</p>
                  <p className="text-xs text-muted-foreground">.7z, .tar.gz, .bz2 and other specialized archive formats</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Important:</strong> Attempting to upload unsupported file types may result in upload failures or account restrictions. If you need to share specialized file types, consider converting them to supported formats or using ZIP archives with clear instructions.</p>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Best Practices & Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">📊 File Size Optimization</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Compress images before uploading</li>
                  <li>• Use appropriate resolution for intended viewing</li>
                  <li>• Convert videos to MP4 with H.264 encoding</li>
                  <li>• Use audio compression for sound files</li>
                  <li>• Consider file size impact on mobile users</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">🔄 Format Conversion Tools</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Images:</strong> Adobe Photoshop, GIMP, Squoosh</li>
                  <li>• <strong>Videos:</strong> Handbrake, Adobe Premiere, DaVinci Resolve</li>
                  <li>• <strong>Documents:</strong> Adobe Acrobat, Microsoft Office</li>
                  <li>• <strong>Audio:</strong> Audacity, Adobe Audition</li>
                  <li>• <strong>Online:</strong> Convertio, CloudConvert</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🌟 Quality vs. File Size Balance</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-1">
                  <li>✓ Use 1080p for most video content</li>
                  <li>✓ Save JPEGs at 80-90% quality</li>
                  <li>✓ Aim for 128-192kbps for audio</li>
                  <li>✓ Resize images to actual display dimensions</li>
                  <li>✓ Use progressive JPEGs for faster loading</li>
                </ul>
                <ul className="space-y-1">
                  <li>✓ Reserve 4K for premium content</li>
                  <li>✓ Use PNG only when transparency is needed</li>
                  <li>✓ Consider WebP for better compression</li>
                  <li>✓ Split large files into smaller parts</li>
                  <li>✓ Test on mobile devices before uploading</li>
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
                <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Content Upload</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Learn how to upload and organize your content effectively.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/upload-organize-content">Read More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-3" />
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
                <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg text-center">Content Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Control who can see your content with privacy settings.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/content-privacy-levels">Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportedFormats;
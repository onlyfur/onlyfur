import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Upload, RefreshCw, Wifi, HardDrive, FileWarning, Clock, Shield, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const UploadTroubleshooting: React.FC = () => {
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
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <Badge variant="secondary">Content Creation</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Upload troubleshooting guide</h1>
        <p className="text-xl text-muted-foreground">
          Solutions for common upload issues, error messages, and how to resolve problems when uploading content.
        </p>
      </div>

      {/* Quick Solutions */}
      <Card className="mb-8 bg-linear-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Quick Solutions for Common Issues</h3>
          <p className="text-muted-foreground mb-4">
            Before diving into specific problems, try these general troubleshooting steps that resolve many upload issues:
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Refresh Browser</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Check Connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Clear Cache</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileWarning className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Check File Format</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Common Upload Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Common Upload Errors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Error Messages and Solutions:</h4>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">"File size exceeds the maximum limit"</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Cause:</strong> Your file is larger than the allowed limit (50MB for images, 2GB for videos).</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        <li>Compress your image using tools like Photoshop, GIMP, or online services</li>
                        <li>For videos, use a video compressor like Handbrake or Adobe Media Encoder</li>
                        <li>Reduce video resolution (1080p is sufficient for most content)</li>
                        <li>Split large videos into multiple smaller parts</li>
                        <li>Use more efficient file formats (JPEG for photos, MP4/H.264 for videos)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">"Unsupported file format"</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Cause:</strong> You're trying to upload a file type that OnlyFur doesn't support.</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        <li>Convert your file to a supported format (see our <Link to="/help/articles/supported-formats" className="text-blue-600 hover:underline">Supported Formats</Link> guide)</li>
                        <li>For images: convert to JPG, PNG, or WebP</li>
                        <li>For videos: convert to MP4 (H.264)</li>
                        <li>For documents: convert to PDF</li>
                        <li>Use file conversion tools like CloudConvert or Adobe products</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">"Upload failed" or "Connection error"</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Cause:</strong> Network issues, unstable internet connection, or server problems.</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        <li>Check your internet connection (try loading another website)</li>
                        <li>Switch from Wi-Fi to a wired connection if possible</li>
                        <li>Try uploading during off-peak hours when servers are less busy</li>
                        <li>Disable VPN or proxy services that might interfere with uploads</li>
                        <li>Try a different browser or device</li>
                        <li>Refresh the page and try again</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">"File appears to be corrupted"</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Cause:</strong> The file is damaged or incomplete, often due to interrupted downloads or transfer issues.</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        <li>Try re-downloading the original file if it came from another source</li>
                        <li>Check if the file opens correctly on your device before uploading</li>
                        <li>Re-export or re-save the file from your editing software</li>
                        <li>Try repairing the file with specialized software</li>
                        <li>As a last resort, recreate the file from scratch</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">"Upload timeout"</h5>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Cause:</strong> The upload is taking too long, usually due to large file size or slow internet connection.</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm font-medium">Solutions:</p>
                      <ul className="text-sm space-y-1 pl-5 list-disc">
                        <li>Reduce the file size through compression</li>
                        <li>Use a faster and more stable internet connection</li>
                        <li>Upload one file at a time instead of multiple files</li>
                        <li>Try uploading during off-peak hours</li>
                        <li>Split large files into smaller parts</li>
                        <li>Use the desktop uploader for large files (if available)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Browser-Specific Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-blue-500" />
              Browser-Specific Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Troubleshooting by Browser:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Chrome</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Clear cache:</strong> Settings → Privacy and Security → Clear browsing data</li>
                    <li>• <strong>Disable extensions:</strong> Try incognito mode or disable extensions</li>
                    <li>• <strong>Hardware acceleration:</strong> Try disabling in advanced settings</li>
                    <li>• <strong>Update browser:</strong> Ensure you're on the latest version</li>
                    <li>• <strong>Common issue:</strong> Memory usage with multiple uploads</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Firefox</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Clear cache:</strong> Options → Privacy & Security → Clear Data</li>
                    <li>• <strong>Safe Mode:</strong> Launch Firefox in Safe Mode to test</li>
                    <li>• <strong>Content blocking:</strong> Temporarily disable enhanced tracking protection</li>
                    <li>• <strong>Update browser:</strong> Check for Firefox updates</li>
                    <li>• <strong>Common issue:</strong> Content blocking features may interfere</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Safari</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Clear cache:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li>• <strong>JavaScript:</strong> Ensure JavaScript is enabled</li>
                    <li>• <strong>Content blockers:</strong> Temporarily disable content blockers</li>
                    <li>• <strong>Private browsing:</strong> Try uploading in a private window</li>
                    <li>• <strong>Common issue:</strong> More restrictive with file access</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-blue-600 mb-2">Edge</h5>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Clear cache:</strong> Settings → Privacy, search, and services → Clear browsing data</li>
                    <li>• <strong>Tracking prevention:</strong> Try lowering tracking prevention level</li>
                    <li>• <strong>Extensions:</strong> Disable extensions and try again</li>
                    <li>• <strong>Update browser:</strong> Check for Edge updates</li>
                    <li>• <strong>Common issue:</strong> Similar to Chrome but with additional security features</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Browser Recommendation:</strong> Chrome and Firefox generally provide the most reliable upload experience. If you're having persistent issues with one browser, try switching to another.</p>
            </div>
          </CardContent>
        </Card>

        {/* Device and Connection Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wifi className="w-5 h-5 mr-2 text-green-500" />
              Device and Connection Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Internet Connection Problems:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Slow Upload Speed</p>
                  <p className="text-xs text-muted-foreground">
                    Upload speed is often much slower than download speed. For large files, you need at least 5 Mbps upload speed for smooth experience.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Solution:</strong> Test your speed at <span className="text-blue-600">speedtest.net</span> and contact your ISP if speeds are below what you're paying for.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Unstable Connection</p>
                  <p className="text-xs text-muted-foreground">
                    Intermittent connection drops can interrupt uploads and cause failures, especially with larger files.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Solution:</strong> Use a wired connection instead of Wi-Fi, move closer to your router, or try uploading during off-peak hours.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-sm">Network Restrictions</p>
                  <p className="text-xs text-muted-foreground">
                    Some networks (office, school, public Wi-Fi) may block or restrict large uploads or certain file types.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Solution:</strong> Try a different network, use your mobile data (if unlimited), or wait until you have access to an unrestricted network.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Device-Specific Issues:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Mobile Devices</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Limited storage space for large files</li>
                    <li>• Apps may compress files automatically</li>
                    <li>• Battery drain during large uploads</li>
                    <li>• Background process limitations</li>
                    <li>• <strong>Solution:</strong> Use the OnlyFur mobile app instead of browser, keep your device charged, close other apps during upload</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-purple-600 mb-2">Older Computers</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Limited RAM causing browser crashes</li>
                    <li>• Outdated browsers lacking modern features</li>
                    <li>• Slow processing of large files</li>
                    <li>• Disk space limitations</li>
                    <li>• <strong>Solution:</strong> Close other programs during upload, update your browser, compress files before uploading</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Connection Test:</strong> If you're having persistent upload issues, try this simple test: upload a small file (under 1MB) to OnlyFur. If that works, your connection is functioning but may be too slow for larger files. If even small files fail, the issue is likely with your connection stability or account settings.</p>
            </div>
          </CardContent>
        </Card>

        {/* File-Specific Problems */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileWarning className="w-5 h-5 mr-2 text-red-500" />
              File-Specific Problems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Issues with Specific File Types:</h4>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Image Issues</h5>
                  <div className="space-y-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Common Problems:</p>
                        <ul className="text-sm space-y-1 pl-5 list-disc">
                          <li>Images appear blurry or low quality</li>
                          <li>Colors look different after upload</li>
                          <li>Transparency not working (PNG files)</li>
                          <li>HEIC/HEIF files from iPhones not accepted</li>
                          <li>Animated GIFs not playing</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Solutions:</p>
                        <ul className="text-sm space-y-1 pl-5 list-disc">
                          <li>Use PNG for graphics, JPEG for photos</li>
                          <li>Ensure color profile is sRGB</li>
                          <li>Convert HEIC to JPEG before uploading</li>
                          <li>Keep GIFs under 15MB for animation</li>
                          <li>Check image dimensions (min 400px width)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Video Issues</h5>
                  <div className="space-y-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Common Problems:</p>
                        <ul className="text-sm space-y-1 pl-5 list-disc">
                          <li>Video processing stuck at 0%</li>
                          <li>Poor video quality after upload</li>
                          <li>Audio out of sync</li>
                          <li>Video plays but has no sound</li>
                          <li>Video length incorrect</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Solutions:</p>
                        <ul className="text-sm space-y-1 pl-5 list-disc">
                          <li>Convert to MP4 with H.264 encoding</li>
                          <li>Use AAC audio codec</li>
                          <li>Keep bitrate between 8-15 Mbps for 1080p</li>
                          <li>Ensure video isn't corrupted before upload</li>
                          <li>Videos over 10 minutes may need higher compression</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-red-600 mb-2">Document and Archive Issues</h5>
                  <div className="space-y-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Common Problems:</p>
                        <ul className="text-sm space-y-1 pl-5 list-disc">
                          <li>PDF preview not showing</li>
                          <li>ZIP files rejected as unsafe</li>
                          <li>Document formatting lost</li>
                          <li>Text appearing as gibberish</li>
                          <li>Files inside archives not accessible</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Solutions:</p>
                        <ul className="text-sm space-y-1 pl-5 list-disc">
                          <li>Ensure PDFs are not password protected</li>
                          <li>Don't include executable files in archives</li>
                          <li>Use PDF instead of DOC/DOCX for documents</li>
                          <li>Ensure text files use UTF-8 encoding</li>
                          <li>Include a README file in archives</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>File Repair Tools:</strong> If you suspect your file is corrupted, there are specialized repair tools available:</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• <strong>Images:</strong> JPEG Repair Tool, Stellar Phoenix Photo Recovery</li>
                <li>• <strong>Videos:</strong> VLC Media Player (conversion), Wondershare Repairit</li>
                <li>• <strong>Documents:</strong> Repair My PDF, Recovery Toolbox for PDF</li>
                <li>• <strong>Archives:</strong> WinRAR Repair, Zip Repair Pro</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Account and Permission Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-500" />
              Account and Permission Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Account-Related Upload Problems:</h4>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">"You don't have permission to upload content"</p>
                  <p className="text-xs text-muted-foreground">
                    This usually means your account hasn't been verified or doesn't have creator privileges.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Solution:</strong> Verify your email address, complete your profile setup, and ensure you've applied for creator status if required.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">"You've reached your storage limit"</p>
                  <p className="text-xs text-muted-foreground">
                    Your account has a storage quota that you've exceeded.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Solution:</strong> Delete unused content, compress future uploads, or upgrade your account for more storage.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">"Your account is under review"</p>
                  <p className="text-xs text-muted-foreground">
                    Content uploads may be temporarily restricted if your account is being reviewed for policy violations.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Solution:</strong> Check your email for communications from OnlyFur, review the community guidelines, and contact support if needed.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-sm">"Daily upload limit reached"</p>
                  <p className="text-xs text-muted-foreground">
                    To prevent spam, there are daily limits on the number of uploads per account.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Solution:</strong> Wait until the next day to upload more content, or batch your uploads more efficiently.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm"><strong>Account Status Check:</strong> If you're experiencing persistent permission issues, check your account status in your creator dashboard. Look for any warnings, notices, or requirements that need to be addressed. Sometimes a simple verification step or profile update can resolve these issues.</p>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Advanced Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">🔍 Technical Diagnostics</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Check browser console for specific error messages (F12)</li>
                  <li>• Test upload on different networks (home, mobile, public)</li>
                  <li>• Try uploading the same file to a different service</li>
                  <li>• Check if antivirus or firewall is blocking uploads</li>
                  <li>• Test with a completely different device</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">🛠️ Last Resort Solutions</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Completely reinstall your browser</li>
                  <li>• Try using a different internet service provider</li>
                  <li>• Use a desktop uploader application (if available)</li>
                  <li>• Ask a trusted friend to upload on your behalf</li>
                  <li>• Contact support with detailed error information</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📝 When Contacting Support</h4>
              <p className="text-sm">If you need to contact support about upload issues, include this information:</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm mt-2">
                <ul className="space-y-1">
                  <li>• Exact error message (screenshot if possible)</li>
                  <li>• File type, size, and name</li>
                  <li>• Browser and version</li>
                  <li>• Device type (desktop/mobile)</li>
                  <li>• Operating system</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Steps you've already tried</li>
                  <li>• When the problem started</li>
                  <li>• Whether it happens with all files</li>
                  <li>• Internet connection type</li>
                  <li>• Any recent account changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Having Upload Issues?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              If you've tried all the troubleshooting steps and still can't upload your content, our support team is here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-blue-600 hover:text-blue-700" asChild>
                <Link to="/contact">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/help">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  More Help Articles
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
                <CardTitle className="text-lg text-center">Content Upload</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 text-sm">Step-by-step guide to uploading and organizing content.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/help/articles/upload-organize-content">Read More</Link>
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

export default UploadTroubleshooting;
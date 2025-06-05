import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Upload,
  X,
  Image,
  Video,
  FileText,
  Calendar,
  Tag,
  Globe,
  Users,
  Crown,
  Lock,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
  Star,
  Heart,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { ContentFile, ContentFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { tierValidationService } from '@/services/tierValidationService';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters'),
  tags: z.string(),
  category: z.string().min(1, 'Category is required'),
  privacyLevel: z.enum(['public', 'subscribers', 'premium', 'private']),
  requiresSubscription: z.boolean().default(false),
  scheduledAt: z.string().optional(),
  customPrice: z.number().optional(),
  enableTips: z.boolean().default(true),
});

type ContentFormValues = z.infer<typeof contentSchema>;

const EnhancedContentUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createContent, categories, fileValidation, uploadFiles, isLoading: contentLoading } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<ContentFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      privacyLevel: 'public',
      requiresSubscription: false,
      category: '',
      enableTips: true,
    },
  });

  const privacyLevel = watch('privacyLevel');
  const requiresSubscription = watch('requiresSubscription');
  const tagsValue = watch('tags');
  const enableTips = watch('enableTips');

  // Enhanced privacy options with detailed descriptions
  const privacyOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Visible to everyone, even non-subscribers',
      longDescription: 'Perfect for promotional content, teasers, or building your audience',
      icon: Globe,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      audience: 'Everyone',
      monetization: 'Tips only',
      estimatedViews: '10,000+',
      pros: ['Maximum visibility', 'Great for growth', 'No barriers'],
      cons: ['No subscription revenue', 'Lower perceived value']
    },
    {
      value: 'subscribers',
      label: 'Subscribers Only',
      description: 'All your subscribers can see this content',
      longDescription: 'Reward your supporters with exclusive content they can\'t get anywhere else',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      audience: 'All Subscribers',
      monetization: 'Subscription + Tips',
      estimatedViews: '2,500+',
      pros: ['Drives subscriptions', 'Loyal audience', 'Recurring revenue'],
      cons: ['Limited reach', 'Requires subscriber base']
    },
    {
      value: 'premium',
      label: 'Premium Tier',
      description: 'Pro Subscribers and above only',
      longDescription: 'High-quality content for your most valuable supporters',
      icon: Star,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      audience: 'Pro & VIP Subscribers',
      monetization: 'Premium subscription + Tips',
      estimatedViews: '800+',
      pros: ['Higher revenue per view', 'Premium positioning', 'Dedicated audience'],
      cons: ['Smaller audience', 'Higher expectations']
    },
    {
      value: 'private',
      label: 'VIP Exclusive',
      description: 'Only VIP subscribers can access',
      longDescription: 'Ultra-exclusive content for your biggest supporters',
      icon: Crown,
      color: 'text-yellow-500',
      bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      gradient: 'from-yellow-500 to-orange-500',
      audience: 'VIP Subscribers Only',
      monetization: 'VIP subscription + Tips',
      estimatedViews: '150+',
      pros: ['Maximum value', 'VIP experience', 'Highest revenue'],
      cons: ['Very limited reach', 'Must justify exclusivity']
    },
  ];

  // Check if user can use advanced features
  const canUseCustomPricing = tierValidationService.validateAdvancedCreatorFeatures(user, 'pricing').allowed;
  const canUseAdvancedScheduling = tierValidationService.validateAdvancedCreatorFeatures(user, 'scheduling').allowed;

  const handlePrivacyChange = (value: string) => {
    setValue('privacyLevel', value as any);
    setValue('requiresSubscription', value !== 'public');
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  }, []);

  const processFiles = async (files: File[]) => {
    setUploadError(null);
    
    // Validate files with tier restrictions
    for (const file of files) {
      const validation = tierValidationService.validateFileUpload(user, file);
      if (!validation.allowed) {
        setUploadError(validation.reason || 'File upload not allowed');
        return;
      }
    }
    
    try {
      const contentFiles = await uploadFiles(files);
      setUploadedFiles(prev => [...prev, ...contentFiles]);
      
      // Simulate upload progress
      contentFiles.forEach(file => {
        if (file.status === 'uploading') {
          const interval = setInterval(() => {
            setUploadProgress(prev => {
              const newProgress = (prev[file.id] || 0) + Math.random() * 15;
              if (newProgress >= 100) {
                clearInterval(interval);
                return { ...prev, [file.id]: 100 };
              }
              return { ...prev, [file.id]: newProgress };
            });
          }, 200);
        }
      });
    } catch (error) {
      setUploadError('Failed to upload files. Please try again.');
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const getSelectedPrivacyOption = () => {
    return privacyOptions.find(option => option.value === privacyLevel);
  };

  const onSubmit = async (data: ContentFormValues) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate upload permissions
      const uploadCheck = tierValidationService.validateContentUpload(user);
      if (!uploadCheck.allowed) {
        setUploadError(uploadCheck.reason || 'Upload not allowed');
        return;
      }

      const contentData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        files: uploadedFiles,
      };

      await createContent(contentData);
      navigate('/content');
    } catch (error) {
      setUploadError('Failed to create content. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    return FileText;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Content</h1>
        <p className="text-muted-foreground">
          Share your creativity with the OnlyFur community
        </p>
      </div>

      {uploadError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Content</CardTitle>
                <CardDescription>
                  Upload images, videos, or other content files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${isDragOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Drop files here or click to upload
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support for images, videos, and documents
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={[
                      ...fileValidation.supportedImageTypes,
                      ...fileValidation.supportedVideoTypes,
                    ].join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* File size and type info */}
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>
                        Max file size: {user?.subscriptionTier?.messagingFeatures?.maxFileSize || 5}MB
                      </span>
                      <span>
                        Types: {fileValidation.supportedImageTypes.concat(fileValidation.supportedVideoTypes).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Preview */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedFiles.map((file) => {
                      const FileIcon = getFileIcon(file.file.type);
                      const progress = uploadProgress[file.id] || 0;
                      
                      return (
                        <div key={file.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <FileIcon className="h-8 w-8 text-primary" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {file.file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {file.type === 'image' && (
                            <div className="aspect-video bg-muted rounded-md overflow-hidden">
                              <img
                                src={file.preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {file.status === 'uploading' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Uploading...</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          )}

                          {file.status === 'completed' && (
                            <div className="flex items-center text-sm text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Upload complete
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Information</CardTitle>
                <CardDescription>
                  Add a title, description, and organize your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Give your content a catchy title..."
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your content, share behind-the-scenes info, or add context..."
                    rows={4}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="furry, art, cute (comma separated)"
                      {...register('tags')}
                    />
                  </div>
                </div>

                {tagsValue && (
                  <div className="flex flex-wrap gap-2">
                    {tagsValue.split(',').map((tag, index) => {
                      const trimmedTag = tag.trim();
                      if (!trimmedTag) return null;
                      return (
                        <Badge key={index} variant="secondary">
                          <Tag className="w-3 h-3 mr-1" />
                          {trimmedTag}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Control Tab */}
          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Access Control</CardTitle>
                <CardDescription>
                  Choose who can see your content and how it's monetized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={privacyLevel}
                  onValueChange={handlePrivacyChange}
                  className="space-y-4"
                >
                  {privacyOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = privacyLevel === option.value;
                    
                    return (
                      <div key={option.value}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label
                            htmlFor={option.value}
                            className={`
                              flex items-center space-x-4 cursor-pointer flex-1 p-4 rounded-lg border-2 transition-all
                              ${isSelected 
                                ? 'border-primary bg-primary/5' 
                                : 'border-muted hover:border-primary/50'
                              }
                            `}
                          >
                            <div className={`w-12 h-12 rounded-full ${option.bgColor} flex items-center justify-center text-white`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold">{option.label}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {option.audience}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {option.description}
                              </p>
                              <div className="grid grid-cols-3 gap-4 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Monetization:</span>
                                  <div className="font-medium">{option.monetization}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Est. Views:</span>
                                  <div className="font-medium">{option.estimatedViews}</div>
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        {isSelected && (
                          <div className="ml-9 mt-3 p-4 bg-muted rounded-lg">
                            <h5 className="font-medium text-sm mb-2">{option.longDescription}</h5>
                            <div className="grid md:grid-cols-2 gap-4 text-xs">
                              <div>
                                <h6 className="font-medium text-green-600 mb-1">Pros:</h6>
                                <ul className="space-y-1">
                                  {option.pros.map((pro, idx) => (
                                    <li key={idx} className="flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h6 className="font-medium text-orange-600 mb-1">Considerations:</h6>
                                <ul className="space-y-1">
                                  {option.cons.map((con, idx) => (
                                    <li key={idx} className="flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3 text-orange-500" />
                                      {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Monetization Settings */}
            {privacyLevel !== 'public' && (
              <Card>
                <CardHeader>
                  <CardTitle>Monetization Options</CardTitle>
                  <CardDescription>
                    Configure how this content generates revenue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-tips">Enable Tips</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow subscribers to tip you for this content
                      </p>
                    </div>
                    <Switch
                      id="enable-tips"
                      checked={enableTips}
                      onCheckedChange={(checked) => setValue('enableTips', checked)}
                    />
                  </div>

                  {canUseCustomPricing && (
                    <div className="space-y-2">
                      <Label htmlFor="custom-price">Custom Price (Optional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="custom-price"
                          type="number"
                          placeholder="0.00"
                          className="pl-9"
                          {...register('customPrice', { valueAsNumber: true })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Set a one-time purchase price in addition to subscription requirements
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Advanced Scheduling */}
            {canUseAdvancedScheduling && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Publishing
                  </CardTitle>
                  <CardDescription>
                    Schedule your content to be published later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledAt">Publish Date & Time</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      {...register('scheduledAt')}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave empty to publish immediately
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Advanced Settings Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Additional options for content management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="advanced-settings">Show Advanced Options</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable additional content controls and features
                    </p>
                  </div>
                  <Switch
                    id="advanced-settings"
                    checked={showAdvancedSettings}
                    onCheckedChange={setShowAdvancedSettings}
                  />
                </div>

                {showAdvancedSettings && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Advanced settings require higher subscription tiers for full functionality.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="text-sm text-muted-foreground">
                      <h5 className="font-medium mb-2">Available Features:</h5>
                      <ul className="space-y-1">
                        <li>• Bulk content scheduling</li>
                        <li>• Custom content collections</li>
                        <li>• Advanced analytics tracking</li>
                        <li>• A/B testing for titles</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/content')}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={isUploading || contentLoading || uploadedFiles.length === 0}
            className="min-w-[140px]"
            size="lg"
          >
            {isUploading || contentLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Publish Content
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedContentUpload;

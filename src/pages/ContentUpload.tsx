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
  Folder,
  Globe,
  Users,
  Crown,
  Lock,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
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

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters'),
  tags: z.string(),
  category: z.string().min(1, 'Category is required'),
  privacyLevel: z.enum(['public', 'subscribers', 'premium', 'private']),
  scheduledAt: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

const ContentUpload: React.FC = () => {
  const navigate = useNavigate();
  const { createContent, categories, fileValidation, uploadFiles, isLoading: contentLoading } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<ContentFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
      category: '',
    },
  });

  const privacyLevel = watch('privacyLevel');
  const tagsValue = watch('tags');

  const privacyOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Visible to everyone',
      icon: Globe,
      color: 'text-blue-500',
    },
    {
      value: 'subscribers',
      label: 'Subscribers Only',
      description: 'Only your subscribers can see this',
      icon: Users,
      color: 'text-green-500',
    },
    {
      value: 'premium',
      label: 'Premium Tier',
      description: 'Premium subscribers only',
      icon: Crown,
      color: 'text-purple-500',
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Only you can see this',
      icon: Lock,
      color: 'text-gray-500',
    },
  ];

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
    
    try {
      const contentFiles = await uploadFiles(files);
      setUploadedFiles(prev => [...prev, ...contentFiles]);
      
      // Simulate upload progress tracking
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
      setUploadError('Failed to process files. Please try again.');
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const onSubmit = async (data: ContentFormValues) => {
    if (uploadedFiles.length === 0 && !data.description.trim()) {
      setUploadError('Please upload at least one file or add a description for text posts.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      await createContent({
        title: data.title,
        description: data.description,
        files: uploadedFiles,
        tags,
        category: data.category,
        privacyLevel: data.privacyLevel,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      });

      setUploadSuccess(true);
      
      // Redirect to content management after a short delay
      setTimeout(() => {
        navigate('/content');
      }, 2000);
    } catch (error) {
      setUploadError('Failed to create content. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (uploadSuccess) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Content Created Successfully!</h2>
            <p className="text-muted-foreground mb-4">
              Your content has been uploaded and is now live on your profile.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/content')}>
                View Content
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Upload More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Content</h1>
        <p className="text-muted-foreground">
          Upload photos, videos, or create text posts to share with your audience
        </p>
      </div>

      {uploadError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload & Preview</TabsTrigger>
            <TabsTrigger value="details">Content Details</TabsTrigger>
            <TabsTrigger value="settings">Privacy & Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Files
                </CardTitle>
                <CardDescription>
                  Drag and drop your files here, or click to browse. 
                  Supports images (JPG, PNG, WebP, GIF up to {fileValidation.maxImageSize}MB) 
                  and videos (MP4, WebM, MOV up to {fileValidation.maxVideoSize}MB).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    Drop your files here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Multiple files supported • Max {fileValidation.maxVideoSize}MB per video • Max {fileValidation.maxImageSize}MB per image
                  </p>
                  
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

                          {file.type === 'video' && (
                            <div className="aspect-video bg-muted rounded-md overflow-hidden">
                              <video
                                src={file.preview}
                                controls
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

                          {file.status === 'error' && (
                            <div className="text-sm text-red-600">
                              <AlertCircle className="h-4 w-4 mr-2 inline" />
                              {file.error}
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

          <TabsContent value="details" className="space-y-6">
            {/* Content Details */}
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
                    placeholder="photography, lifestyle, behind-the-scenes (separate with commas)"
                    {...register('tags')}
                  />
                  {tagsValue && (
                    <div className="flex flex-wrap gap-2 mt-2">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Accessibility</CardTitle>
                <CardDescription>
                  Control who can see your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={privacyLevel}
                  onValueChange={(value: any) => setValue('privacyLevel', value)}
                  className="space-y-4"
                >
                  {privacyOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-accent"
                      >
                        <option.icon className={`h-5 w-5 ${option.color}`} />
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Publishing
                </CardTitle>
                <CardDescription>
                  Schedule your content to be published later (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Publish Date & Time</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    {...register('scheduledAt')}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty to publish immediately
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/content')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading || contentLoading}
            className="min-w-[120px]"
          >
            {isUploading || contentLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Publish Content
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContentUpload;

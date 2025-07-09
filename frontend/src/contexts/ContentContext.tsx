import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Content,
  ContentFile,
  ContentUpload,
  ContentCategory,
  ContentFolder,
  ContentFilter,
  ContentStats,
  FileValidation,
  SupportedImageType,
  SupportedVideoType,
} from '@/types';
import { useAuth } from './AuthContext';
import { realDataAPI } from '@/services/realDataAPI';

interface ContentContextType {
  // Content State
  contents: Content[];
  folders: ContentFolder[];
  categories: ContentCategory[];
  stats: ContentStats | null;
  isLoading: boolean;
  error: string | null;

  // Content Management
  createContent: (contentData: ContentUpload) => Promise<Content>;
  updateContent: (id: string, updates: Partial<Content>) => Promise<Content>;
  deleteContent: (id: string) => Promise<void>;
  publishContent: (id: string) => Promise<void>;
  archiveContent: (id: string) => Promise<void>;

  // File Operations
  validateFile: (file: File) => { isValid: boolean; error?: string };
  uploadFiles: (files: File[]) => Promise<ContentFile[]>;
  removeFile: (fileId: string) => void;

  // Content Organization
  createFolder: (name: string, description?: string) => Promise<ContentFolder>;
  updateFolder: (id: string, updates: Partial<ContentFolder>) => Promise<ContentFolder>;
  deleteFolder: (id: string) => Promise<void>;
  moveContentToFolder: (contentId: string, folderId: string) => Promise<void>;

  // Content Filtering & Search
  filterContent: (filter: ContentFilter) => Content[];
  searchContent: (query: string) => Content[];
  
  // Analytics
  getContentAnalytics: (contentId: string) => Promise<any>;
  refreshStats: () => Promise<void>;

  // File Validation Configuration
  fileValidation: FileValidation;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: React.ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [folders, setFolders] = useState<ContentFolder[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to prevent multiple simultaneous loads
  const isLoadingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // File validation configuration
  const fileValidation: FileValidation = {
    maxImageSize: 10, // 10MB
    maxVideoSize: 100, // 100MB
    supportedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    supportedVideoTypes: ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'],
  };

  // Initialize default categories
  const defaultCategories: ContentCategory[] = [
    { id: '1', name: 'Photography', description: 'Photo content', color: '#3B82F6', icon: 'Camera', contentCount: 0 },
    { id: '2', name: 'Videos', description: 'Video content', color: '#EF4444', icon: 'Video', contentCount: 0 },
    { id: '3', name: 'Lifestyle', description: 'Lifestyle content', color: '#F59E0B', icon: 'Heart', contentCount: 0 },
    { id: '4', name: 'Tutorials', description: 'Educational content', color: '#10B981', icon: 'BookOpen', contentCount: 0 },
    { id: '5', name: 'Behind the Scenes', description: 'BTS content', color: '#8B5CF6', icon: 'Eye', contentCount: 0 },
  ];

  // Reset state when user changes
  useEffect(() => {
    // Reset refs when user changes
    hasInitializedRef.current = false;
    isLoadingRef.current = false;
    
    // Clear state
    setContents([]);
    setFolders([]);
    setStats(null);
    setError(null);
  }, [user?.id]);

  // Load content from localStorage and real data
  useEffect(() => {
    if (user?.id && !hasInitializedRef.current && !isLoadingRef.current) {
      hasInitializedRef.current = true;
      setCategories(defaultCategories);
      loadContentFromStorage();
    }
  }, [user?.id]); // Only depend on user ID to prevent unnecessary re-renders

  const loadContentFromStorage = async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingRef.current) {
      return;
    }
    
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const storedContent = localStorage.getItem(`creator-content-${user?.id}`);
      const storedFolders = localStorage.getItem(`creator-folders-${user?.id}`);
      const storedStats = localStorage.getItem(`creator-stats-${user?.id}`);

      if (storedContent) {
        const parsedContent = JSON.parse(storedContent).map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt),
          scheduledAt: content.scheduledAt ? new Date(content.scheduledAt) : undefined,
        }));
        setContents(parsedContent);
      } else {
        // No stored content, try to load real data
        await loadRealContent();
      }

      if (storedFolders) {
        const parsedFolders = JSON.parse(storedFolders).map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt),
          updatedAt: new Date(folder.updatedAt),
        }));
        setFolders(parsedFolders);
      }

      if (storedStats) {
        setStats(JSON.parse(storedStats));
      } else {
        generateMockStats();
      }
    } catch (error) {
      console.error('Failed to load content from storage:', error);
      setError('Failed to load content');
      // Set empty state on error instead of trying to load real content
      // to prevent infinite loops
      setContents([]);
      generateMockStats();
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const saveContentToStorage = (updatedContent: Content[]) => {
    localStorage.setItem(`creator-content-${user?.id}`, JSON.stringify(updatedContent));
  };

  const saveFoldersToStorage = (updatedFolders: ContentFolder[]) => {
    localStorage.setItem(`creator-folders-${user?.id}`, JSON.stringify(updatedFolders));
  };

  const loadRealContent = async () => {
    try {
      if (!user?.id) {
        setContents([]);
        return;
      }

      // Use a timeout to prevent infinite loops on network errors
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const hasData = await Promise.race([
        realDataAPI.hasRealData(),
        timeoutPromise
      ]);
      
      if (!hasData) {
        setContents([]);
        return;
      }

      // Load real content from database
      const contentResponse = await Promise.race([
        realDataAPI.getRealContent(50, 0, true),
        timeoutPromise
      ]);
      
      if (contentResponse.success && contentResponse.content) {
        const transformedContent: Content[] = contentResponse.content
          .filter((item: any) => item.creatorId === user.id)
          .map((item: any) => ({
            id: item.id,
            creatorId: item.creatorId,
            title: item.title,
            description: item.description,
            type: item.type,
            mediaUrl: item.mediaUrl,
            thumbnailUrl: item.thumbnailUrl,
            isPublic: item.isPublic,
            requiresSubscription: item.requiresSubscription,
            privacyLevel: item.privacyLevel,
            status: item.status,
            tags: Array.isArray(item.tags) ? item.tags : [],
            category: item.category || 'General',
            likesCount: item.likesCount,
            commentsCount: item.commentsCount,
            viewsCount: item.viewsCount,
            sharesCount: item.sharesCount,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            duration: item.duration
          }));

        setContents(transformedContent);
        saveContentToStorage(transformedContent);
      } else {
        setContents([]);
      }
    } catch (error) {
      console.error('Error loading real content:', error);
      setContents([]);
      // Don't retry on error to prevent infinite loops
    }
  };

  const generateMockStats = () => {
    const mockStats: ContentStats = {
      totalContent: 3,
      publishedContent: 2,
      draftContent: 1,
      archivedContent: 0,
      totalViews: 3770,
      totalLikes: 213,
      totalComments: 43,
      totalShares: 47,
      averageEngagement: 8.2,
      topPerformingContent: contents.slice(0, 3),
      recentActivity: [
        {
          type: 'view',
          contentId: '1',
          contentTitle: 'Sunset Photography Session',
          timestamp: new Date(),
          userId: 'user123',
          username: 'photoFan',
        },
        {
          type: 'like',
          contentId: '2',
          contentTitle: 'Morning Workout Routine',
          timestamp: new Date(Date.now() - 300000),
          userId: 'user456',
          username: 'fitnessLover',
        },
      ],
    };

    setStats(mockStats);
    localStorage.setItem(`creator-stats-${user?.id}`, JSON.stringify(mockStats));
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const isImage = fileValidation.supportedImageTypes.includes(file.type as SupportedImageType);
    const isVideo = fileValidation.supportedVideoTypes.includes(file.type as SupportedVideoType);

    if (!isImage && !isVideo) {
      return {
        isValid: false,
        error: 'Unsupported file type. Please upload JPG, PNG, WebP, GIF, MP4, WebM, or MOV files.',
      };
    }

    const maxSize = isImage ? fileValidation.maxImageSize : fileValidation.maxVideoSize;
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSize}MB limit. Please choose a smaller file.`,
      };
    }

    return { isValid: true };
  };

  const uploadFiles = async (files: File[]): Promise<ContentFile[]> => {
    const contentFiles: ContentFile[] = [];

    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        contentFiles.push({
          id: Date.now().toString() + Math.random(),
          file,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          preview: '',
          uploadProgress: 0,
          status: 'error',
          error: validation.error,
        });
        continue;
      }

      const preview = URL.createObjectURL(file);
      const contentFile: ContentFile = {
        id: Date.now().toString() + Math.random(),
        file,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        preview,
        uploadProgress: 0,
        status: 'pending',
      };

      contentFiles.push(contentFile);

      // Simulate upload progress
      simulateUpload(contentFile);
    }

    return contentFiles;
  };

  const simulateUpload = (contentFile: ContentFile) => {
    contentFile.status = 'uploading';
    const interval = setInterval(() => {
      contentFile.uploadProgress += Math.random() * 20;
      
      if (contentFile.uploadProgress >= 100) {
        contentFile.uploadProgress = 100;
        contentFile.status = 'completed';
        clearInterval(interval);
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    // This would remove the file from the upload queue
    console.log('Removing file:', fileId);
  };

  const createContent = async (contentData: ContentUpload): Promise<Content> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newContent: Content = {
        id: Date.now().toString(),
        creatorId: user?.id || '1',
        title: contentData.title,
        description: contentData.description,
        type: contentData.files.length > 0 ? (contentData.files[0].type === 'image' ? 'photo' : 'video') : 'text',
        mediaUrl: contentData.files[0]?.preview,
        mediaUrls: contentData.files.map(f => f.preview),
        thumbnailUrl: contentData.files[0]?.preview,
        isPublic: contentData.privacyLevel === 'public',
        requiresSubscription: contentData.privacyLevel !== 'public',
        privacyLevel: contentData.privacyLevel,
        status: contentData.scheduledAt ? 'scheduled' : 'published',
        scheduledAt: contentData.scheduledAt,
        tags: contentData.tags,
        category: contentData.category,
        likesCount: 0,
        commentsCount: 0,
        viewsCount: 0,
        sharesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedContents = [newContent, ...contents];
      setContents(updatedContents);
      saveContentToStorage(updatedContents);
      
      await refreshStats();
      return newContent;
    } catch (error) {
      const errorMessage = 'Failed to create content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (id: string, updates: Partial<Content>): Promise<Content> => {
    const contentIndex = contents.findIndex(c => c.id === id);
    if (contentIndex === -1) {
      throw new Error('Content not found');
    }

    const updatedContent = {
      ...contents[contentIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedContents = [...contents];
    updatedContents[contentIndex] = updatedContent;
    
    setContents(updatedContents);
    saveContentToStorage(updatedContents);
    
    return updatedContent;
  };

  const deleteContent = async (id: string): Promise<void> => {
    const updatedContents = contents.filter(c => c.id !== id);
    setContents(updatedContents);
    saveContentToStorage(updatedContents);
    await refreshStats();
  };

  const publishContent = async (id: string): Promise<void> => {
    await updateContent(id, { status: 'published' });
  };

  const archiveContent = async (id: string): Promise<void> => {
    await updateContent(id, { status: 'archived' });
  };

  const createFolder = async (name: string, description?: string): Promise<ContentFolder> => {
    const newFolder: ContentFolder = {
      id: Date.now().toString(),
      name,
      description,
      creatorId: user?.id || '1',
      contentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveFoldersToStorage(updatedFolders);
    
    return newFolder;
  };

  const updateFolder = async (id: string, updates: Partial<ContentFolder>): Promise<ContentFolder> => {
    const folderIndex = folders.findIndex(f => f.id === id);
    if (folderIndex === -1) {
      throw new Error('Folder not found');
    }

    const updatedFolder = {
      ...folders[folderIndex],
      ...updates,
      updatedAt: new Date(),
    };

    const updatedFolders = [...folders];
    updatedFolders[folderIndex] = updatedFolder;
    
    setFolders(updatedFolders);
    saveFoldersToStorage(updatedFolders);
    
    return updatedFolder;
  };

  const deleteFolder = async (id: string): Promise<void> => {
    const updatedFolders = folders.filter(f => f.id !== id);
    setFolders(updatedFolders);
    saveFoldersToStorage(updatedFolders);
  };

  const moveContentToFolder = async (contentId: string, folderId: string): Promise<void> => {
    // Implementation for moving content to folders
    console.log('Moving content', contentId, 'to folder', folderId);
  };

  const filterContent = (filter: ContentFilter): Content[] => {
    return contents.filter(content => {
      if (filter.type && filter.type !== 'all' && content.type !== filter.type) return false;
      if (filter.category && content.category !== filter.category) return false;
      if (filter.status && filter.status !== 'all' && content.status !== filter.status) return false;
      if (filter.privacyLevel && filter.privacyLevel !== 'all' && content.privacyLevel !== filter.privacyLevel) return false;
      if (filter.tags && filter.tags.length > 0 && !filter.tags.some(tag => content.tags.includes(tag))) return false;
      
      return true;
    });
  };

  const searchContent = (query: string): Content[] => {
    const lowercaseQuery = query.toLowerCase();
    return contents.filter(content =>
      content.title.toLowerCase().includes(lowercaseQuery) ||
      content.description?.toLowerCase().includes(lowercaseQuery) ||
      content.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getContentAnalytics = async (contentId: string) => {
    // Mock analytics data
    return {
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 25),
    };
  };

  const refreshStats = async (): Promise<void> => {
    const newStats: ContentStats = {
      totalContent: contents.length,
      publishedContent: contents.filter(c => c.status === 'published').length,
      draftContent: contents.filter(c => c.status === 'draft').length,
      archivedContent: contents.filter(c => c.status === 'archived').length,
      totalViews: contents.reduce((sum, c) => sum + c.viewsCount, 0),
      totalLikes: contents.reduce((sum, c) => sum + c.likesCount, 0),
      totalComments: contents.reduce((sum, c) => sum + c.commentsCount, 0),
      totalShares: contents.reduce((sum, c) => sum + c.sharesCount, 0),
      averageEngagement: 8.2,
      topPerformingContent: contents.slice(0, 5),
      recentActivity: stats?.recentActivity || [],
    };

    setStats(newStats);
    localStorage.setItem(`creator-stats-${user?.id}`, JSON.stringify(newStats));
  };

  const value = {
    contents,
    folders,
    categories,
    stats,
    isLoading,
    error,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    archiveContent,
    validateFile,
    uploadFiles,
    removeFile,
    createFolder,
    updateFolder,
    deleteFolder,
    moveContentToFolder,
    filterContent,
    searchContent,
    getContentAnalytics,
    refreshStats,
    fileValidation,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

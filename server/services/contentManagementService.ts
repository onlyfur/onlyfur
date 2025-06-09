import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';
import { vercelBlobStorage } from './vercelBlobStorage';
import { Content, ContentType, ContentStatus } from '@prisma/client';

export interface ContentData {
  title: string;
  description?: string;
  type: ContentType;
  tags?: string[];
  isPublic: boolean;
  isPremium: boolean;
  price?: number;
  category?: string;
  metadata?: any;
}

export interface ContentWithFiles {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  status: ContentStatus;
  isPublic: boolean;
  isPremium: boolean;
  price?: number;
  category?: string;
  tags: string[];
  metadata?: any;
  thumbnailUrl?: string;
  contentUrl?: string;
  fileSize?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  blobFiles: Array<{
    id: string;
    fileName: string;
    originalName: string;
    blobUrl: string;
    size: number;
    mimeType: string;
    category: string;
  }>;
}

export interface ContentUploadResult {
  success: boolean;
  content?: ContentWithFiles;
  error?: string;
}

/**
 * Comprehensive Content Management Service with PostgreSQL and Vercel Blob Integration
 */
export class ContentManagementService {
  private static instance: ContentManagementService;

  static getInstance(): ContentManagementService {
    if (!ContentManagementService.instance) {
      ContentManagementService.instance = new ContentManagementService();
    }
    return ContentManagementService.instance;
  }

  /**
   * Create new content with file uploads
   */
  async createContent(
    userId: string,
    contentData: ContentData,
    files: {
      mainFile?: Express.Multer.File;
      thumbnail?: Express.Multer.File;
      additionalFiles?: Express.Multer.File[];
    }
  ): Promise<ContentUploadResult> {
    try {
      // Validate user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, displayName: true, avatar: true }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Create content record in PostgreSQL
      const content = await prisma.content.create({
        data: {
          title: contentData.title,
          description: contentData.description,
          type: contentData.type,
          status: ContentStatus.PUBLISHED,
          isPublic: contentData.isPublic,
          isPremium: contentData.isPremium,
          price: contentData.price,
          category: contentData.category,
          tags: contentData.tags || [],
          metadata: contentData.metadata,
          creatorId: userId
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          }
        }
      });

      const uploadedFiles: any[] = [];

      // Upload main file if provided
      if (files.mainFile) {
        const mainFileUpload = await vercelBlobStorage.uploadFile(files.mainFile, {
          userId,
          category: 'content',
          metadata: {
            contentId: content.id,
            type: 'main_file',
            contentType: contentData.type
          }
        });

        uploadedFiles.push(mainFileUpload);

        // Update content with main file URL
        await prisma.content.update({
          where: { id: content.id },
          data: {
            contentUrl: mainFileUpload.blobUrl,
            fileSize: mainFileUpload.size,
            // Extract duration for video files if available
            duration: contentData.metadata?.duration
          }
        });
      }

      // Upload thumbnail if provided
      if (files.thumbnail) {
        const thumbnailUpload = await vercelBlobStorage.uploadFile(files.thumbnail, {
          userId,
          category: 'thumbnail',
          metadata: {
            contentId: content.id,
            type: 'thumbnail'
          }
        });

        uploadedFiles.push(thumbnailUpload);

        // Update content with thumbnail URL
        await prisma.content.update({
          where: { id: content.id },
          data: {
            thumbnailUrl: thumbnailUpload.blobUrl
          }
        });
      }

      // Upload additional files if provided
      if (files.additionalFiles && files.additionalFiles.length > 0) {
        const additionalUploads = await vercelBlobStorage.uploadFiles(files.additionalFiles, {
          userId,
          category: 'content',
          metadata: {
            contentId: content.id,
            type: 'additional_file'
          }
        });

        uploadedFiles.push(...additionalUploads);
      }

      // Create audit log
      await createAuditLog({
        userId,
        action: AuditActions.CREATE,
        resource: 'content',
        resourceId: content.id,
        metadata: {
          contentType: contentData.type,
          title: contentData.title,
          filesUploaded: uploadedFiles.length,
          totalFileSize: uploadedFiles.reduce((sum, file) => sum + file.size, 0)
        }
      });

      // Get updated content with all data
      const updatedContent = await this.getContentById(content.id, userId);

      logger.info('Content created successfully', {
        userId,
        contentId: content.id,
        contentType: contentData.type,
        filesUploaded: uploadedFiles.length
      });

      return {
        success: true,
        content: updatedContent!
      };

    } catch (error: any) {
      logger.error('Content creation failed', {
        userId,
        contentData,
        error: error.message
      });

      return {
        success: false,
        error: 'Content creation failed. Please try again.'
      };
    }
  }

  /**
   * Update existing content
   */
  async updateContent(
    contentId: string,
    userId: string,
    updates: Partial<ContentData>,
    files?: {
      mainFile?: Express.Multer.File;
      thumbnail?: Express.Multer.File;
      additionalFiles?: Express.Multer.File[];
    }
  ): Promise<ContentUploadResult> {
    try {
      // Check if content exists and user owns it
      const existingContent = await prisma.content.findFirst({
        where: {
          id: contentId,
          creatorId: userId
        }
      });

      if (!existingContent) {
        return {
          success: false,
          error: 'Content not found or access denied'
        };
      }

      // Update content metadata in PostgreSQL
      const updatedContent = await prisma.content.update({
        where: { id: contentId },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });

      const uploadedFiles: any[] = [];

      // Handle file updates if provided
      if (files) {
        // Upload new main file if provided
        if (files.mainFile) {
          const mainFileUpload = await vercelBlobStorage.uploadFile(files.mainFile, {
            userId,
            category: 'content',
            metadata: {
              contentId,
              type: 'main_file',
              contentType: updatedContent.type
            }
          });

          uploadedFiles.push(mainFileUpload);

          // Update content with new main file URL
          await prisma.content.update({
            where: { id: contentId },
            data: {
              contentUrl: mainFileUpload.blobUrl,
              fileSize: mainFileUpload.size
            }
          });
        }

        // Upload new thumbnail if provided
        if (files.thumbnail) {
          const thumbnailUpload = await vercelBlobStorage.uploadFile(files.thumbnail, {
            userId,
            category: 'thumbnail',
            metadata: {
              contentId,
              type: 'thumbnail'
            }
          });

          uploadedFiles.push(thumbnailUpload);

          // Update content with new thumbnail URL
          await prisma.content.update({
            where: { id: contentId },
            data: {
              thumbnailUrl: thumbnailUpload.blobUrl
            }
          });
        }

        // Upload additional files if provided
        if (files.additionalFiles && files.additionalFiles.length > 0) {
          const additionalUploads = await vercelBlobStorage.uploadFiles(files.additionalFiles, {
            userId,
            category: 'content',
            metadata: {
              contentId,
              type: 'additional_file'
            }
          });

          uploadedFiles.push(...additionalUploads);
        }
      }

      // Create audit log
      await createAuditLog({
        userId,
        action: AuditActions.UPDATE,
        resource: 'content',
        resourceId: contentId,
        metadata: {
          updates: Object.keys(updates),
          newFilesUploaded: uploadedFiles.length
        }
      });

      // Get updated content with all data
      const finalContent = await this.getContentById(contentId, userId);

      logger.info('Content updated successfully', {
        userId,
        contentId,
        updates: Object.keys(updates),
        newFilesUploaded: uploadedFiles.length
      });

      return {
        success: true,
        content: finalContent!
      };

    } catch (error: any) {
      logger.error('Content update failed', {
        contentId,
        userId,
        error: error.message
      });

      return {
        success: false,
        error: 'Content update failed. Please try again.'
      };
    }
  }

  /**
   * Delete content and associated files
   */
  async deleteContent(contentId: string, userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Check if content exists and user owns it
      const content = await prisma.content.findFirst({
        where: {
          id: contentId,
          creatorId: userId
        }
      });

      if (!content) {
        return {
          success: false,
          error: 'Content not found or access denied'
        };
      }

      // Get all files associated with this content
      const contentFiles = await prisma.blobStorage.findMany({
        where: {
          userId,
          metadata: {
            path: ['contentId'],
            equals: contentId
          }
        }
      });

      // Delete all associated files from Vercel Blob
      for (const file of contentFiles) {
        try {
          await vercelBlobStorage.deleteFile(file.id, userId);
        } catch (error) {
          logger.warn('Failed to delete content file during content deletion', {
            contentId,
            fileId: file.id,
            error: error.message
          });
        }
      }

      // Delete content from PostgreSQL (this will cascade delete related records)
      await prisma.content.delete({
        where: { id: contentId }
      });

      // Create audit log
      await createAuditLog({
        userId,
        action: AuditActions.DELETE,
        resource: 'content',
        resourceId: contentId,
        metadata: {
          title: content.title,
          type: content.type,
          deletedFilesCount: contentFiles.length
        }
      });

      logger.info('Content deleted successfully', {
        userId,
        contentId,
        deletedFilesCount: contentFiles.length
      });

      return {
        success: true,
        message: 'Content deleted successfully'
      };

    } catch (error: any) {
      logger.error('Content deletion failed', {
        contentId,
        userId,
        error: error.message
      });

      return {
        success: false,
        error: 'Content deletion failed. Please try again.'
      };
    }
  }

  /**
   * Get content by ID with file information
   */
  async getContentById(contentId: string, userId?: string): Promise<ContentWithFiles | null> {
    try {
      const content = await prisma.content.findUnique({
        where: { id: contentId },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          }
        }
      });

      if (!content) {
        return null;
      }

      // Check access permissions
      if (!content.isPublic && (!userId || content.creatorId !== userId)) {
        return null;
      }

      // Get associated blob files
      const blobFiles = await prisma.blobStorage.findMany({
        where: {
          userId: content.creatorId,
          metadata: {
            path: ['contentId'],
            equals: contentId
          }
        },
        select: {
          id: true,
          fileName: true,
          originalName: true,
          blobUrl: true,
          size: true,
          mimeType: true,
          category: true
        }
      });

      return {
        ...content,
        blobFiles
      };

    } catch (error: any) {
      logger.error('Failed to get content by ID', {
        contentId,
        userId,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Get user's content list
   */
  async getUserContent(
    userId: string,
    options: {
      type?: ContentType;
      status?: ContentStatus;
      isPublic?: boolean;
      isPremium?: boolean;
      limit?: number;
      offset?: number;
      search?: string;
    } = {}
  ): Promise<{ content: ContentWithFiles[]; total: number }> {
    try {
      const where: any = { creatorId: userId };

      if (options.type) where.type = options.type;
      if (options.status) where.status = options.status;
      if (options.isPublic !== undefined) where.isPublic = options.isPublic;
      if (options.isPremium !== undefined) where.isPremium = options.isPremium;
      if (options.search) {
        where.OR = [
          { title: { contains: options.search, mode: 'insensitive' } },
          { description: { contains: options.search, mode: 'insensitive' } }
        ];
      }

      const [content, total] = await Promise.all([
        prisma.content.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: options.offset || 0,
          take: options.limit || 20
        }),
        prisma.content.count({ where })
      ]);

      // Get blob files for each content
      const contentWithFiles = await Promise.all(
        content.map(async (item) => {
          const blobFiles = await prisma.blobStorage.findMany({
            where: {
              userId,
              metadata: {
                path: ['contentId'],
                equals: item.id
              }
            },
            select: {
              id: true,
              fileName: true,
              originalName: true,
              blobUrl: true,
              size: true,
              mimeType: true,
              category: true
            }
          });

          return {
            ...item,
            blobFiles
          };
        })
      );

      return { content: contentWithFiles, total };

    } catch (error: any) {
      logger.error('Failed to get user content', {
        userId,
        options,
        error: error.message
      });
      return { content: [], total: 0 };
    }
  }

  /**
   * Get public content feed
   */
  async getPublicContent(
    options: {
      type?: ContentType;
      category?: string;
      tags?: string[];
      limit?: number;
      offset?: number;
      search?: string;
      sortBy?: 'newest' | 'popular' | 'trending';
    } = {}
  ): Promise<{ content: ContentWithFiles[]; total: number }> {
    try {
      const where: any = {
        isPublic: true,
        status: ContentStatus.PUBLISHED
      };

      if (options.type) where.type = options.type;
      if (options.category) where.category = options.category;
      if (options.tags && options.tags.length > 0) {
        where.tags = { hasSome: options.tags };
      }
      if (options.search) {
        where.OR = [
          { title: { contains: options.search, mode: 'insensitive' } },
          { description: { contains: options.search, mode: 'insensitive' } }
        ];
      }

      let orderBy: any = { createdAt: 'desc' };
      if (options.sortBy === 'popular') {
        orderBy = { views: 'desc' };
      } else if (options.sortBy === 'trending') {
        // For trending, we could implement a more complex algorithm
        // For now, use recent creation with high views
        orderBy = [{ views: 'desc' }, { createdAt: 'desc' }];
      }

      const [content, total] = await Promise.all([
        prisma.content.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true
              }
            }
          },
          orderBy,
          skip: options.offset || 0,
          take: options.limit || 20
        }),
        prisma.content.count({ where })
      ]);

      // Get blob files for each content
      const contentWithFiles = await Promise.all(
        content.map(async (item) => {
          const blobFiles = await prisma.blobStorage.findMany({
            where: {
              userId: item.creatorId,
              metadata: {
                path: ['contentId'],
                equals: item.id
              }
            },
            select: {
              id: true,
              fileName: true,
              originalName: true,
              blobUrl: true,
              size: true,
              mimeType: true,
              category: true
            }
          });

          return {
            ...item,
            blobFiles
          };
        })
      );

      return { content: contentWithFiles, total };

    } catch (error: any) {
      logger.error('Failed to get public content', {
        options,
        error: error.message
      });
      return { content: [], total: 0 };
    }
  }

  /**
   * Increment content views
   */
  async incrementViews(contentId: string, userId?: string): Promise<boolean> {
    try {
      await prisma.content.update({
        where: { id: contentId },
        data: {
          views: { increment: 1 }
        }
      });

      // Optionally track view analytics
      if (userId) {
        await createAuditLog({
          userId,
          action: AuditActions.VIEW,
          resource: 'content',
          resourceId: contentId,
          metadata: {
            action: 'view_content'
          }
        });
      }

      return true;
    } catch (error: any) {
      logger.error('Failed to increment content views', {
        contentId,
        userId,
        error: error.message
      });
      return false;
    }
  }
}

export const contentManagementService = ContentManagementService.getInstance();
export default contentManagementService;

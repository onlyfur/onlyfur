import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './database';

interface UploadOptions {
  userId?: string;
  category?: string;
  metadata?: Record<string, any>;
  maxSize?: number;
  allowedTypes?: string[];
}

interface UploadResult {
  id: string;
  blobUrl: string;
  size: number;
  mimeType: string;
  originalName: string;
}

class BlobService {
  private static instance: BlobService;
  private readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  
  private constructor() {}

  static getInstance(): BlobService {
    if (!BlobService.instance) {
      BlobService.instance = new BlobService();
    }
    return BlobService.instance;
  }

  async uploadFile(
    file: Express.Multer.File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Validate file
      this.validateFile(file, options);

      // Generate unique path
      const path = this.generatePath(file.originalname, options);

      // Upload to Vercel Blob
      const blob = await put(path, file.buffer, { 
        contentType: file.mimetype,
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      // Create record in database
      const record = await prisma.blobStorage.create({
        data: {
          userId: options.userId,
          fileName: path,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          blobUrl: blob.url,
          category: options.category || 'general',
          metadata: options.metadata || {}
        }
      });

      return {
        id: record.id,
        blobUrl: blob.url,
        size: file.size,
        mimeType: file.mimetype,
        originalName: file.originalname
      };
    } catch (error: any) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<UploadResult> {
    return this.uploadFile(file, {
      userId,
      category: 'avatar',
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/jpeg', 'image/png'],
      metadata: { type: 'user_avatar' }
    });
  }

  async deleteFile(fileId: string, userId?: string): Promise<void> {
    try {
      // Get file record
      const file = await prisma.blobStorage.findUnique({
        where: { id: fileId }
      });

      if (!file) {
        throw new Error('File not found');
      }

      // Check ownership if userId provided
      if (userId && file.userId !== userId) {
        throw new Error('Unauthorized to delete this file');
      }

      // Delete from Vercel Blob
      await del(file.blobUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      // Delete record from database
      await prisma.blobStorage.delete({
        where: { id: fileId }
      });
    } catch (error: any) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  async getUserFiles(userId: string, category?: string): Promise<{ files: any[] }> {
    try {
      const files = await prisma.blobStorage.findMany({
        where: {
          userId,
          ...(category && { category })
        }
      });

      return { files };
    } catch (error: any) {
      throw new Error(`Failed to get user files: ${error.message}`);
    }
  }

  private validateFile(file: Express.Multer.File, options: UploadOptions): void {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;

    if (file.size > maxSize) {
      throw new Error(`File size exceeds limit of ${maxSize / 1024 / 1024}MB`);
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }

  private generatePath(originalName: string, options: UploadOptions): string {
    const ext = originalName.split('.').pop();
    const category = options.category || 'general';
    const userId = options.userId || 'anonymous';
    return `${category}/${userId}/${uuidv4()}.${ext}`;
  }
}

export const blobService = BlobService.getInstance();

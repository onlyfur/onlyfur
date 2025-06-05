import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { logger, logFileOperation } from '../middleware/logger';
import { AppError } from '../middleware/errorHandler';

// Local storage configuration
interface LocalStorageConfig {
  uploadsDir: string;
  maxFileSize: number;
  allowedTypes: string[];
  imageQuality: number;
  generateThumbnails: boolean;
}

const config: LocalStorageConfig = {
  uploadsDir: process.env.UPLOAD_DEST || 'uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '50000000'), // 50MB
  allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp,video/mp4').split(','),
  imageQuality: 85,
  generateThumbnails: true
};

// Initialize local storage directories
export async function initializeLocalStorage(): Promise<void> {
  try {
    const directories = [
      config.uploadsDir,
      path.join(config.uploadsDir, 'images'),
      path.join(config.uploadsDir, 'videos'),
      path.join(config.uploadsDir, 'avatars'),
      path.join(config.uploadsDir, 'thumbnails'),
      path.join(config.uploadsDir, 'temp')
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`Created directory: ${dir}`);
      }
    }

    logger.info('Local storage initialized successfully', { config });
  } catch (error) {
    logger.error('Failed to initialize local storage:', error);
    throw error;
  }
}

// Upload file interface
interface UploadResult {
  success: boolean;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata?: any;
}

// Upload file to local storage
export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  options: {
    folder?: 'images' | 'videos' | 'avatars';
    generateThumbnail?: boolean;
    resize?: { width?: number; height?: number };
  } = {}
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!config.allowedTypes.includes(mimeType)) {
      throw new AppError(`File type ${mimeType} not allowed`, 400);
    }

    // Validate file size
    if (buffer.length > config.maxFileSize) {
      throw new AppError(`File too large. Max size: ${config.maxFileSize} bytes`, 400);
    }

    const fileExtension = path.extname(originalName).toLowerCase();
    const fileName = `${uuidv4()}${fileExtension}`;
    const folder = options.folder || (mimeType.startsWith('image/') ? 'images' : 'videos');
    const filePath = path.join(config.uploadsDir, folder, fileName);

    let processedBuffer = buffer;
    let metadata: any = {};

    // Process images
    if (mimeType.startsWith('image/')) {
      const image = sharp(buffer);
      const imageMetadata = await image.metadata();
      
      metadata = {
        width: imageMetadata.width,
        height: imageMetadata.height,
        format: imageMetadata.format,
        size: buffer.length
      };

      // Resize if specified
      if (options.resize) {
        image.resize(options.resize.width, options.resize.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Optimize image
      if (mimeType === 'image/jpeg') {
        image.jpeg({ quality: config.imageQuality });
      } else if (mimeType === 'image/png') {
        image.png({ quality: config.imageQuality });
      } else if (mimeType === 'image/webp') {
        image.webp({ quality: config.imageQuality });
      }

      processedBuffer = await image.toBuffer();
    }

    // Save file
    fs.writeFileSync(filePath, processedBuffer);

    const result: UploadResult = {
      success: true,
      fileName,
      originalName,
      mimeType,
      size: processedBuffer.length,
      url: `/uploads/${folder}/${fileName}`,
      metadata
    };

    // Generate thumbnail for images
    if (mimeType.startsWith('image/') && config.generateThumbnails) {
      try {
        const thumbnailFileName = `thumb_${fileName}`;
        const thumbnailPath = path.join(config.uploadsDir, 'thumbnails', thumbnailFileName);
        
        await sharp(buffer)
          .resize(300, 300, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath);

        result.thumbnailUrl = `/uploads/thumbnails/${thumbnailFileName}`;
      } catch (thumbError) {
        logger.warn('Failed to generate thumbnail:', thumbError);
      }
    }

    logFileOperation('File uploaded', {
      fileName,
      originalName,
      mimeType,
      size: result.size,
      folder
    });

    return result;

  } catch (error) {
    logger.error('Failed to upload file:', error);
    throw error instanceof AppError ? error : new AppError('File upload failed', 500);
  }
}

// Delete file from local storage
export async function deleteFile(fileName: string, folder?: string): Promise<boolean> {
  try {
    if (!folder) {
      // Try to find the file in common folders
      const folders = ['images', 'videos', 'avatars'];
      for (const f of folders) {
        const filePath = path.join(config.uploadsDir, f, fileName);
        if (fs.existsSync(filePath)) {
          folder = f;
          break;
        }
      }
    }

    if (!folder) {
      throw new AppError('File not found', 404);
    }

    const filePath = path.join(config.uploadsDir, folder, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      // Also delete thumbnail if it exists
      const thumbnailPath = path.join(config.uploadsDir, 'thumbnails', `thumb_${fileName}`);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }

      logFileOperation('File deleted', { fileName, folder });
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Failed to delete file:', error);
    throw error instanceof AppError ? error : new AppError('File deletion failed', 500);
  }
}

// Get file info
export async function getFileInfo(fileName: string): Promise<any> {
  try {
    const folders = ['images', 'videos', 'avatars'];
    
    for (const folder of folders) {
      const filePath = path.join(config.uploadsDir, folder, fileName);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          fileName,
          folder,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          url: `/uploads/${folder}/${fileName}`
        };
      }
    }

    throw new AppError('File not found', 404);
  } catch (error) {
    logger.error('Failed to get file info:', error);
    throw error instanceof AppError ? error : new AppError('Failed to get file info', 500);
  }
}

// Clean up old files (utility function)
export async function cleanupOldFiles(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  try {
    const now = Date.now();
    const folders = ['temp'];

    for (const folder of folders) {
      const folderPath = path.join(config.uploadsDir, folder);
      if (!fs.existsSync(folderPath)) continue;

      const files = fs.readdirSync(folderPath);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (now - stats.birthtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        logger.info(`Cleaned up ${deletedCount} old files from ${folder}`);
      }
    }
  } catch (error) {
    logger.error('Failed to cleanup old files:', error);
  }
}

// Export configuration for other modules
export { config as localStorageConfig };

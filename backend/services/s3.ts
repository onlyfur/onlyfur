import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { logger, logFileOperation } from '../middleware/logger';
import { AppError } from '../middleware/errorHandler';

let s3: AWS.S3 | null = null;
let isConfigured = false;

// Initialize S3 service
export async function initializeS3(): Promise<void> {
  try {
    const region = process.env.AWS_REGION || 'us-east-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!accessKeyId || !secretAccessKey || !bucketName) {
      logger.warn('S3 not configured - missing AWS credentials or bucket name');
      return;
    }

    // Configure AWS
    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });

    s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      region,
    });

    // Test S3 connection by listing objects (with limit)
    await s3.listObjectsV2({
      Bucket: bucketName,
      MaxKeys: 1
    }).promise();

    isConfigured = true;
    logger.info('S3 service initialized successfully', { region, bucketName });

  } catch (error) {
    logger.error('Failed to initialize S3:', error);
    throw error;
  }
}

// Upload file to S3
export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  const bucketName = process.env.S3_BUCKET_NAME!;

  try {
    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: metadata,
    };

    const result = await s3.upload(uploadParams).promise();

    logFileOperation('File uploaded to S3', {
      key,
      bucket: bucketName,
      location: result.Location,
      size: file.length
    });

    return result.Location;
  } catch (error) {
    logger.error('Failed to upload file to S3:', error);
    throw new AppError('File upload failed', 500);
  }
}

// Upload image with optimization
export async function uploadImage(
  imageBuffer: Buffer,
  folder: string,
  filename?: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<{ url: string; key: string; thumbnailUrl?: string; thumbnailKey?: string }> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    // Generate unique filename if not provided
    const fileId = filename || uuidv4();
    const key = `${folder}/${fileId}.${format}`;
    const thumbnailKey = `${folder}/thumbnails/${fileId}.${format}`;

    // Optimize main image
    const optimizedImage = await sharp(imageBuffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toBuffer();

    // Create thumbnail
    const thumbnail = await sharp(imageBuffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toBuffer();

    // Upload main image
    const mainImageUrl = await uploadFile(
      optimizedImage,
      key,
      `image/${format}`,
      {
        originalName: filename || 'image',
        type: 'content-image'
      }
    );

    // Upload thumbnail
    const thumbnailUrl = await uploadFile(
      thumbnail,
      thumbnailKey,
      `image/${format}`,
      {
        originalName: filename || 'image',
        type: 'thumbnail'
      }
    );

    logFileOperation('Image uploaded with thumbnail', {
      key,
      thumbnailKey,
      originalSize: imageBuffer.length,
      optimizedSize: optimizedImage.length,
      thumbnailSize: thumbnail.length
    });

    return {
      url: mainImageUrl,
      key,
      thumbnailUrl,
      thumbnailKey
    };

  } catch (error) {
    logger.error('Failed to upload and optimize image:', error);
    throw new AppError('Image upload failed', 500);
  }
}

// Upload video
export async function uploadVideo(
  videoBuffer: Buffer,
  folder: string,
  filename?: string,
  contentType: string = 'video/mp4'
): Promise<{ url: string; key: string }> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  try {
    const fileId = filename || uuidv4();
    const extension = contentType.split('/')[1] || 'mp4';
    const key = `${folder}/${fileId}.${extension}`;

    const url = await uploadFile(
      videoBuffer,
      key,
      contentType,
      {
        originalName: filename || 'video',
        type: 'content-video'
      }
    );

    logFileOperation('Video uploaded', {
      key,
      size: videoBuffer.length,
      contentType
    });

    return { url, key };

  } catch (error) {
    logger.error('Failed to upload video:', error);
    throw new AppError('Video upload failed', 500);
  }
}

// Delete file from S3
export async function deleteFile(key: string): Promise<void> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  const bucketName = process.env.S3_BUCKET_NAME!;

  try {
    await s3.deleteObject({
      Bucket: bucketName,
      Key: key
    }).promise();

    logFileOperation('File deleted from S3', { key, bucket: bucketName });

  } catch (error) {
    logger.error('Failed to delete file from S3:', error);
    throw new AppError('File deletion failed', 500);
  }
}

// Delete multiple files from S3
export async function deleteFiles(keys: string[]): Promise<void> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  if (keys.length === 0) return;

  const bucketName = process.env.S3_BUCKET_NAME!;

  try {
    await s3.deleteObjects({
      Bucket: bucketName,
      Delete: {
        Objects: keys.map(key => ({ Key: key }))
      }
    }).promise();

    logFileOperation('Multiple files deleted from S3', { 
      keys, 
      bucket: bucketName, 
      count: keys.length 
    });

  } catch (error) {
    logger.error('Failed to delete files from S3:', error);
    throw new AppError('File deletion failed', 500);
  }
}

// Generate presigned URL for direct upload
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  const bucketName = process.env.S3_BUCKET_NAME!;

  try {
    const url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      Expires: expiresIn
    });

    logFileOperation('Presigned upload URL generated', {
      key,
      contentType,
      expiresIn
    });

    return url;

  } catch (error) {
    logger.error('Failed to generate presigned upload URL:', error);
    throw new AppError('Failed to generate upload URL', 500);
  }
}

// Generate presigned URL for download
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  const bucketName = process.env.S3_BUCKET_NAME!;

  try {
    const url = s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn
    });

    logFileOperation('Presigned download URL generated', {
      key,
      expiresIn
    });

    return url;

  } catch (error) {
    logger.error('Failed to generate presigned download URL:', error);
    throw new AppError('Failed to generate download URL', 500);
  }
}

// Get file metadata
export async function getFileMetadata(key: string): Promise<AWS.S3.HeadObjectOutput> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  const bucketName = process.env.S3_BUCKET_NAME!;

  try {
    const metadata = await s3.headObject({
      Bucket: bucketName,
      Key: key
    }).promise();

    return metadata;

  } catch (error) {
    logger.error('Failed to get file metadata:', error);
    throw new AppError('Failed to get file metadata', 500);
  }
}

// List files in a folder
export async function listFiles(
  prefix: string,
  maxKeys: number = 100
): Promise<AWS.S3.ObjectList> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  const bucketName = process.env.S3_BUCKET_NAME!;

  try {
    const result = await s3.listObjectsV2({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: maxKeys
    }).promise();

    return result.Contents || [];

  } catch (error) {
    logger.error('Failed to list files:', error);
    throw new AppError('Failed to list files', 500);
  }
}

// Copy file within S3
export async function copyFile(sourceKey: string, destinationKey: string): Promise<void> {
  if (!s3 || !isConfigured) {
    throw new AppError('S3 not initialized', 500);
  }

  const bucketName = process.env.S3_BUCKET_NAME!;

  try {
    await s3.copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${sourceKey}`,
      Key: destinationKey
    }).promise();

    logFileOperation('File copied in S3', {
      sourceKey,
      destinationKey,
      bucket: bucketName
    });

  } catch (error) {
    logger.error('Failed to copy file in S3:', error);
    throw new AppError('File copy failed', 500);
  }
}

// Check if S3 is configured
export function isS3Configured(): boolean {
  return isConfigured;
}

// Get CloudFront URL if configured
export function getCloudFrontUrl(key: string): string | null {
  const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
  
  if (cloudFrontDomain) {
    return `https://${cloudFrontDomain}/${key}`;
  }
  
  return null;
}

// Generate unique file key
export function generateFileKey(folder: string, filename: string, userId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const userPrefix = userId ? `${userId}/` : '';
  
  return `${folder}/${userPrefix}${timestamp}-${random}-${filename}`;
}

export default {
  initializeS3,
  uploadFile,
  uploadImage,
  uploadVideo,
  deleteFile,
  deleteFiles,
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
  getFileMetadata,
  listFiles,
  copyFile,
  isS3Configured,
  getCloudFrontUrl,
  generateFileKey
};

import { put, del, list } from '@vercel/blob';
import { NextRequest } from 'next/server';

// Upload file to Vercel Blob
export const uploadFileToBlob = async (
  file: File | Buffer,
  filename: string,
  folder: string = 'uploads'
): Promise<{ url: string; pathname: string }> => {
  try {
    const pathname = `${folder}/${Date.now()}-${filename}`;
    
    const blob = await put(pathname, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  } catch (error) {
    console.error('Blob upload error:', error);
    throw new Error('Failed to upload file to blob storage');
  }
};

// Upload image with optimization
export const uploadImageToBlob = async (
  file: File | Buffer,
  filename: string,
  folder: string = 'images'
): Promise<{ url: string; pathname: string }> => {
  return uploadFileToBlob(file, filename, folder);
};

// Upload video to blob
export const uploadVideoToBlob = async (
  file: File | Buffer,
  filename: string,
  folder: string = 'videos'
): Promise<{ url: string; pathname: string }> => {
  return uploadFileToBlob(file, filename, folder);
};

// Upload avatar to blob
export const uploadAvatarToBlob = async (
  file: File | Buffer,
  filename: string,
  userId: string
): Promise<{ url: string; pathname: string }> => {
  const folder = `avatars/${userId}`;
  return uploadFileToBlob(file, filename, folder);
};

// Delete file from blob
export const deleteFileFromBlob = async (pathname: string): Promise<void> => {
  try {
    await del(pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.error('Blob delete error:', error);
    throw new Error('Failed to delete file from blob storage');
  }
};

// List files in folder
export const listBlobFiles = async (
  folder: string,
  limit: number = 100
): Promise<Array<{ url: string; pathname: string; size: number; uploadedAt: Date }>> => {
  try {
    const { blobs } = await list({
      prefix: folder,
      limit,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));
  } catch (error) {
    console.error('Blob list error:', error);
    throw new Error('Failed to list blob files');
  }
};

// Clean up old files (optional utility)
export const cleanupOldBlobFiles = async (
  folder: string,
  olderThanDays: number = 30
): Promise<number> => {
  try {
    const { blobs } = await list({
      prefix: folder,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const filesToDelete = blobs.filter(blob => blob.uploadedAt < cutoffDate);
    
    for (const blob of filesToDelete) {
      await deleteFileFromBlob(blob.pathname);
    }

    return filesToDelete.length;
  } catch (error) {
    console.error('Blob cleanup error:', error);
    return 0;
  }
};

// Handle file upload from request
export const handleBlobUpload = async (
  request: NextRequest,
  folder: string = 'uploads'
): Promise<{ url: string; pathname: string }> => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'video/webm'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    // Validate file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '100000000'); // 100MB default
    if (file.size > maxSize) {
      throw new Error(`File size ${file.size} exceeds maximum ${maxSize}`);
    }

    return await uploadFileToBlob(file, file.name, folder);
  } catch (error) {
    console.error('Handle blob upload error:', error);
    throw error;
  }
};

// Get blob storage stats
export const getBlobStorageStats = async (): Promise<{
  totalFiles: number;
  totalSize: number;
  folderStats: Record<string, { files: number; size: number }>;
}> => {
  try {
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const folderStats: Record<string, { files: number; size: number }> = {};
    let totalSize = 0;

    blobs.forEach(blob => {
      const folder = blob.pathname.split('/')[0] || 'root';
      if (!folderStats[folder]) {
        folderStats[folder] = { files: 0, size: 0 };
      }
      folderStats[folder].files++;
      folderStats[folder].size += blob.size;
      totalSize += blob.size;
    });

    return {
      totalFiles: blobs.length,
      totalSize,
      folderStats,
    };
  } catch (error) {
    console.error('Blob stats error:', error);
    return {
      totalFiles: 0,
      totalSize: 0,
      folderStats: {},
    };
  }
};

export default {
  uploadFileToBlob,
  uploadImageToBlob,
  uploadVideoToBlob,
  uploadAvatarToBlob,
  deleteFileFromBlob,
  listBlobFiles,
  cleanupOldBlobFiles,
  handleBlobUpload,
  getBlobStorageStats,
};

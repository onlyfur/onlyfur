import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

class BlobService {
  private static instance: BlobService;
  
  private constructor() {}

  static getInstance(): BlobService {
    if (!BlobService.instance) {
      BlobService.instance = new BlobService();
    }
    return BlobService.instance;
  }

  async uploadAvatar(userId: string, file: Buffer, contentType: string) {
    const path = `avatars/${userId}/${uuidv4()}`;
    const blob = await put(path, file, { 
      contentType,
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return blob.url;
  }

  async deleteAvatar(url: string) {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
  }
}

export const blobService = BlobService.getInstance();

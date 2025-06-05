import { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { promisify } from 'util';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { createContent } from '@/lib/database';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

const uploadSingle = promisify(upload.single('file'));

// Upload content handler
async function uploadContentHandler(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    // Parse multipart form data
    await uploadSingle(req, res);

    const { title, description, contentType, tags, species, pricing, isAdult } = req.body;
    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!title || !contentType) {
      return res.status(400).json({ 
        error: 'Title and content type are required' 
      });
    }

    // Validate content type
    const validContentTypes = ['image', 'video', 'audio', 'text', 'gallery'];
    if (!validContentTypes.includes(contentType)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `onlyfur/${contentType}s`,
          public_id: `${req.user!.userId}_${Date.now()}`,
          transformation: contentType === 'image' ? [
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto' },
            { format: 'auto' }
          ] : undefined,
          video: contentType === 'video' ? {
            quality: 'auto',
            format: 'mp4'
          } : undefined
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(file.buffer);
    });

    const cloudinaryResult = uploadResult as any;

    // Generate thumbnail for videos
    let thumbnailUrl;
    if (contentType === 'video') {
      thumbnailUrl = cloudinary.url(cloudinaryResult.public_id, {
        resource_type: 'video',
        transformation: [
          { width: 400, height: 300, crop: 'fill', quality: 'auto' },
          { format: 'jpg' }
        ]
      });
    }

    // Create content record in database
    const contentData = {
      creatorId: req.user!.userId,
      title,
      description: description || '',
      contentType,
      fileUrl: cloudinaryResult.secure_url,
      thumbnailUrl,
      metadata: {
        fileSize: file.size,
        originalName: file.originalname,
        mimeType: file.mimetype,
        duration: cloudinaryResult.duration, // for videos
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format
      },
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      species: species ? species.split(',').map((s: string) => s.trim()) : [],
      pricing: pricing ? JSON.parse(pricing) : { isFree: true },
      isAdult: isAdult === 'true',
      status: 'pending', // Require moderation
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const content = await createContent(contentData);

    res.status(201).json({
      success: true,
      content: {
        id: content.id,
        title: content.title,
        description: content.description,
        contentType: content.contentType,
        fileUrl: content.fileUrl,
        thumbnailUrl: content.thumbnailUrl,
        tags: content.tags,
        species: content.species,
        status: content.status,
        createdAt: content.createdAt
      },
      message: 'Content uploaded successfully and pending moderation'
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'File type not allowed') {
        return res.status(400).json({ error: 'File type not allowed' });
      }
      if (error.message.includes('File too large')) {
        return res.status(400).json({ error: 'File size too large' });
      }
    }

    res.status(500).json({ error: 'Upload failed' });
  }
}

// Main handler with authentication
export default withAuth(uploadContentHandler);

// Export for Vercel
export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads
  },
};

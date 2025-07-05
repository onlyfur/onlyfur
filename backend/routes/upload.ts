import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { authenticateToken, requireCreator } from '../middleware/auth';
import { asyncHandler, ValidationError } from '../middleware/errorHandler';
import { logger, logFileOperation } from '../middleware/logger';
import { 
  uploadImage, 
  uploadVideo, 
  uploadFile, 
  generatePresignedUploadUrl,
  generateFileKey,
  isS3Configured 
} from '../services/s3';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`File type ${file.mimetype} not allowed`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '50000000') // 50MB default
  }
});

// Validation schemas
const presignedUrlSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  contentType: z.string().min(1, 'Content type is required'),
  folder: z.enum(['content', 'avatars', 'covers', 'messages']).default('content')
});

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload and optimize image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file
 *               folder:
 *                 type: string
 *                 enum: [content, avatars, covers, messages]
 *                 default: content
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 url:
 *                   type: string
 *                   description: Image URL
 *                 thumbnailUrl:
 *                   type: string
 *                   description: Thumbnail URL
 *                 key:
 *                   type: string
 *                   description: S3 key
 *       400:
 *         description: Invalid file or upload error
 */
router.post('/image', authenticateToken, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError('No image file provided');
  }

  if (!isS3Configured()) {
    throw new ValidationError('File upload not configured');
  }

  const folder = req.body.folder || 'content';
  const userId = req.user!.userId;

  // Validate image type
  if (!req.file.mimetype.startsWith('image/')) {
    throw new ValidationError('File must be an image');
  }

  try {
    const result = await uploadImage(
      req.file.buffer,
      folder,
      undefined, // Let the service generate filename
      {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 85,
        format: 'jpeg'
      }
    );

    logFileOperation('Image uploaded via API', {
      userId,
      originalName: req.file.originalname,
      size: req.file.size,
      folder,
      key: result.key
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      key: result.key,
      thumbnailKey: result.thumbnailKey
    });

  } catch (error) {
    logger.error('Image upload failed:', error);
    throw new ValidationError('Image upload failed');
  }
}));

/**
 * @swagger
 * /api/upload/video:
 *   post:
 *     summary: Upload video file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file
 *               folder:
 *                 type: string
 *                 enum: [content, messages]
 *                 default: content
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       400:
 *         description: Invalid file or upload error
 */
router.post('/video', authenticateToken, requireCreator, upload.single('video'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError('No video file provided');
  }

  if (!isS3Configured()) {
    throw new ValidationError('File upload not configured');
  }

  const folder = req.body.folder || 'content';
  const userId = req.user!.userId;

  // Validate video type
  if (!req.file.mimetype.startsWith('video/')) {
    throw new ValidationError('File must be a video');
  }

  try {
    const result = await uploadVideo(
      req.file.buffer,
      folder,
      undefined, // Let the service generate filename
      req.file.mimetype
    );

    logFileOperation('Video uploaded via API', {
      userId,
      originalName: req.file.originalname,
      size: req.file.size,
      folder,
      key: result.key
    });

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      url: result.url,
      key: result.key
    });

  } catch (error) {
    logger.error('Video upload failed:', error);
    throw new ValidationError('Video upload failed');
  }
}));

/**
 * @swagger
 * /api/upload/file:
 *   post:
 *     summary: Upload general file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *               folder:
 *                 type: string
 *                 default: content
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post('/file', authenticateToken, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError('No file provided');
  }

  if (!isS3Configured()) {
    throw new ValidationError('File upload not configured');
  }

  const folder = req.body.folder || 'content';
  const userId = req.user!.userId;

  try {
    const key = generateFileKey(folder, req.file.originalname, userId);
    
    const url = await uploadFile(
      req.file.buffer,
      key,
      req.file.mimetype,
      {
        originalName: req.file.originalname,
        uploadedBy: userId,
        size: req.file.size.toString()
      }
    );

    logFileOperation('File uploaded via API', {
      userId,
      originalName: req.file.originalname,
      size: req.file.size,
      contentType: req.file.mimetype,
      folder,
      key
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url,
      key,
      filename: req.file.originalname,
      size: req.file.size,
      contentType: req.file.mimetype
    });

  } catch (error) {
    logger.error('File upload failed:', error);
    throw new ValidationError('File upload failed');
  }
}));

/**
 * @swagger
 * /api/upload/presigned-url:
 *   post:
 *     summary: Get presigned URL for direct upload
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Original filename
 *               contentType:
 *                 type: string
 *                 description: MIME type
 *               folder:
 *                 type: string
 *                 enum: [content, avatars, covers, messages]
 *                 default: content
 *     responses:
 *       200:
 *         description: Presigned URL generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 uploadUrl:
 *                   type: string
 *                   description: Presigned upload URL
 *                 key:
 *                   type: string
 *                   description: S3 key for the file
 *                 expiresIn:
 *                   type: integer
 *                   description: URL expiration time in seconds
 */
router.post('/presigned-url', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = presignedUrlSchema.parse(req.body);
  const { filename, contentType, folder } = validatedData;
  const userId = req.user!.userId;

  if (!isS3Configured()) {
    throw new ValidationError('File upload not configured');
  }

  // Validate content type
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime'
  ];

  if (!allowedTypes.includes(contentType)) {
    throw new ValidationError(`Content type ${contentType} not allowed`);
  }

  try {
    const key = generateFileKey(folder, filename, userId);
    const expiresIn = 3600; // 1 hour
    
    const uploadUrl = await generatePresignedUploadUrl(key, contentType, expiresIn);

    logFileOperation('Presigned URL generated', {
      userId,
      filename,
      contentType,
      folder,
      key,
      expiresIn
    });

    res.json({
      success: true,
      uploadUrl,
      key,
      expiresIn,
      filename
    });

  } catch (error) {
    logger.error('Presigned URL generation failed:', error);
    throw new ValidationError('Failed to generate upload URL');
  }
}));

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *                 default: content
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Upload error
 */
router.post('/multiple', authenticateToken, upload.array('files', 10), asyncHandler(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    throw new ValidationError('No files provided');
  }

  if (!isS3Configured()) {
    throw new ValidationError('File upload not configured');
  }

  const folder = req.body.folder || 'content';
  const userId = req.user!.userId;

  try {
    const uploadPromises = files.map(async (file) => {
      const key = generateFileKey(folder, file.originalname, userId);
      
      const url = await uploadFile(
        file.buffer,
        key,
        file.mimetype,
        {
          originalName: file.originalname,
          uploadedBy: userId,
          size: file.size.toString()
        }
      );

      return {
        url,
        key,
        filename: file.originalname,
        size: file.size,
        contentType: file.mimetype
      };
    });

    const results = await Promise.all(uploadPromises);

    logFileOperation('Multiple files uploaded via API', {
      userId,
      count: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      folder
    });

    res.json({
      success: true,
      message: `${files.length} files uploaded successfully`,
      files: results
    });

  } catch (error) {
    logger.error('Multiple file upload failed:', error);
    throw new ValidationError('Multiple file upload failed');
  }
}));

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload and set user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image
 *     responses:
 *       200:
 *         description: Avatar uploaded and updated
 */
router.post('/avatar', authenticateToken, upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError('No avatar file provided');
  }

  if (!isS3Configured()) {
    throw new ValidationError('File upload not configured');
  }

  const userId = req.user!.userId;

  // Validate image type
  if (!req.file.mimetype.startsWith('image/')) {
    throw new ValidationError('Avatar must be an image');
  }

  try {
    const result = await uploadImage(
      req.file.buffer,
      'avatars',
      `avatar-${userId}`,
      {
        maxWidth: 400,
        maxHeight: 400,
        quality: 90,
        format: 'jpeg'
      }
    );

    // Update user's avatar URL in database
    const { prisma } = await import('../services/database');
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: result.url }
    });

    logFileOperation('Avatar uploaded and updated', {
      userId,
      originalName: req.file.originalname,
      size: req.file.size,
      key: result.key
    });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: result.url
    });

  } catch (error) {
    logger.error('Avatar upload failed:', error);
    throw new ValidationError('Avatar upload failed');
  }
}));

export default router;

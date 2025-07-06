import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { authenticateToken, requireCreator } from '../middleware/auth';
import { asyncHandler, ValidationError, AppError } from '../middleware/errorHandler';
import { logger, logFileOperation } from '../middleware/logger';
import { uploadFile, deleteFile, getFileInfo } from '../services/local-storage';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 
    'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime').split(',');

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

// Upload single file
router.post('/single', 
  authenticateToken,
  upload.single('file'),
  asyncHandler(async (req: any, res) => {
    if (!req.file) {
      throw new ValidationError('No file provided');
    }

    const folder = req.body.folder as 'images' | 'videos' | 'avatars' || 'images';
    const generateThumbnail = req.body.generateThumbnail !== 'false';
    
    // Handle resize options
    let resize;
    if (req.body.width || req.body.height) {
      resize = {
        width: req.body.width ? parseInt(req.body.width) : undefined,
        height: req.body.height ? parseInt(req.body.height) : undefined
      };
    }

    const result = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      {
        folder,
        generateThumbnail,
        resize
      }
    );

    logFileOperation('File uploaded via API', {
      userId: req.user.id,
      fileName: result.fileName,
      originalName: result.originalName,
      size: result.size,
      folder
    });

    res.json({
      success: true,
      data: result
    });
  })
);

// Upload multiple files
router.post('/multiple',
  authenticateToken,
  upload.array('files', 10), // Max 10 files
  asyncHandler(async (req: any, res) => {
    if (!req.files || req.files.length === 0) {
      throw new ValidationError('No files provided');
    }

    const folder = req.body.folder as 'images' | 'videos' | 'avatars' || 'images';
    const generateThumbnail = req.body.generateThumbnail !== 'false';
    
    const results = [];
    const errors = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        const result = await uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          {
            folder,
            generateThumbnail
          }
        );
        results.push(result);
      } catch (error) {
        errors.push({
          file: file.originalname,
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
    }

    logFileOperation('Multiple files uploaded via API', {
      userId: req.user.id,
      successful: results.length,
      failed: errors.length,
      folder
    });

    res.json({
      success: true,
      data: {
        successful: results,
        failed: errors,
        summary: {
          total: req.files.length,
          successful: results.length,
          failed: errors.length
        }
      }
    });
  })
);

// Upload avatar (special endpoint for user avatars)
router.post('/avatar',
  authenticateToken,
  upload.single('avatar'),
  asyncHandler(async (req: any, res) => {
    if (!req.file) {
      throw new ValidationError('No avatar file provided');
    }

    // Validate it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      throw new ValidationError('Avatar must be an image file');
    }

    const result = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      {
        folder: 'avatars',
        generateThumbnail: true,
        resize: { width: 400, height: 400 } // Square avatar
      }
    );

    // Update user avatar in database
    await req.db.user.update({
      where: { id: req.user.id },
      data: { avatar: result.url }
    });

    logFileOperation('Avatar uploaded', {
      userId: req.user.id,
      fileName: result.fileName,
      originalName: result.originalName
    });

    res.json({
      success: true,
      data: result
    });
  })
);

// Delete file
router.delete('/:fileName',
  authenticateToken,
  asyncHandler(async (req: any, res) => {
    const { fileName } = req.params;
    const folder = req.query.folder as string;

    const deleted = await deleteFile(fileName, folder);

    if (!deleted) {
      throw new AppError('File not found', 404);
    }

    logFileOperation('File deleted via API', {
      userId: req.user.id,
      fileName,
      folder
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  })
);

// Get file info
router.get('/:fileName/info',
  authenticateToken,
  asyncHandler(async (req: any, res) => {
    const { fileName } = req.params;

    const fileInfo = await getFileInfo(fileName);

    res.json({
      success: true,
      data: fileInfo
    });
  })
);

// Health check for upload service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Local File Upload',
    timestamp: new Date().toISOString(),
    config: {
      maxFileSize: process.env.MAX_FILE_SIZE || '50000000',
      allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp,video/mp4').split(','),
      uploadPath: process.env.UPLOAD_DEST || 'uploads'
    }
  });
});

export default router;

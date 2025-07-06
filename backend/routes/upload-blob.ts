import express from 'express';
import { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { uploadFileToBlob, uploadImageToBlob, uploadVideoToBlob, uploadAvatarToBlob } from '../services/vercel-blob';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '100000000'), // 100MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'video/webm'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

// Upload general file
router.post('/', authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { folder = 'uploads' } = req.body;
    const userId = (req as any).userId;

    const result = await uploadFileToBlob(
      req.file.buffer,
      req.file.originalname,
      folder
    );

    res.json({
      success: true,
      url: result.url,
      pathname: result.pathname,
      filename: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload avatar
router.post('/avatar', authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const userId = (req as any).userId;

    // Validate that it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Avatar must be an image' });
    }

    const result = await uploadAvatarToBlob(
      req.file.buffer,
      req.file.originalname,
      userId
    );

    res.json({
      success: true,
      url: result.url,
      pathname: result.pathname,
      filename: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Avatar upload failed' });
  }
});

// Upload content media
router.post('/content', authenticateToken, upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const userId = (req as any).userId;
    const uploadPromises = req.files.map(async (file) => {
      const isImage = file.mimetype.startsWith('image/');
      const isVideo = file.mimetype.startsWith('video/');

      if (isImage) {
        return uploadImageToBlob(file.buffer, file.originalname, `content/${userId}`);
      } else if (isVideo) {
        return uploadVideoToBlob(file.buffer, file.originalname, `content/${userId}`);
      } else {
        return uploadFileToBlob(file.buffer, file.originalname, `content/${userId}`);
      }
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      files: results.map((result, index) => ({
        url: result.url,
        pathname: result.pathname,
        filename: req.files![index].originalname,
        size: req.files![index].size,
        mimeType: req.files![index].mimetype,
      })),
    });
  } catch (error) {
    console.error('Content upload error:', error);
    res.status(500).json({ error: 'Content upload failed' });
  }
});

// Get upload statistics (admin only)
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    if (userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { getBlobStorageStats } = await import('../services/vercel-blob');
    const stats = await getBlobStorageStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get upload statistics' });
  }
});

export default router;

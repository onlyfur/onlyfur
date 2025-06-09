import express from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../middleware/logger';
import { contentManagementService } from '../services/contentManagementService';
import { vercelBlobStorage } from '../services/vercelBlobStorage';
import { ContentType, ContentStatus } from '@prisma/client';

const router = express.Router();

// Rate limiting
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: { error: 'Too many uploads, please try again later.' }
});

const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

// Validation schemas
const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'LIVESTREAM']),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
  isPremium: z.boolean().default(false),
  price: z.number().min(0).optional(),
  category: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const updateContentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  price: z.number().min(0).optional(),
  category: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const getContentSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'LIVESTREAM']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED']).optional(),
  isPublic: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  search: z.string().optional(),
  sortBy: z.enum(['newest', 'popular', 'trending']).default('newest')
});

/**
 * @swagger
 * /api/content/upload:
 *   post:
 *     summary: Create new content with file uploads
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [IMAGE, VIDEO, AUDIO, DOCUMENT, LIVESTREAM]
 *               tags:
 *                 type: string
 *                 description: JSON array of tags
 *               isPublic:
 *                 type: boolean
 *               isPremium:
 *                 type: boolean
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               metadata:
 *                 type: string
 *                 description: JSON object with metadata
 *               mainFile:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               additionalFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Content created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large
 *       500:
 *         description: Internal server error
 */
router.post('/upload', authMiddleware, uploadRateLimit, async (req, res) => {
  try {
    const { userId } = req.user!;

    // Configure multer for content uploads
    const upload = vercelBlobStorage.configureMulter({
      category: 'content',
      userId
    });

    upload.fields([
      { name: 'mainFile', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'additionalFiles', maxCount: 10 }
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      try {
        // Parse and validate content data
        const contentData: any = {};
        
        if (req.body.title) contentData.title = req.body.title;
        if (req.body.description) contentData.description = req.body.description;
        if (req.body.type) contentData.type = req.body.type;
        if (req.body.category) contentData.category = req.body.category;
        if (req.body.isPublic !== undefined) contentData.isPublic = req.body.isPublic === 'true';
        if (req.body.isPremium !== undefined) contentData.isPremium = req.body.isPremium === 'true';
        if (req.body.price !== undefined) contentData.price = parseFloat(req.body.price);
        
        if (req.body.tags) {
          try {
            contentData.tags = JSON.parse(req.body.tags);
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: 'Invalid tags format'
            });
          }
        }
        
        if (req.body.metadata) {
          try {
            contentData.metadata = JSON.parse(req.body.metadata);
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: 'Invalid metadata format'
            });
          }
        }

        // Validate content data
        const validatedData = createContentSchema.parse(contentData);

        // Get uploaded files
        const files = req.files as any;
        const uploadFiles = {
          mainFile: files?.mainFile?.[0],
          thumbnail: files?.thumbnail?.[0],
          additionalFiles: files?.additionalFiles || []
        };

        // Create content with files
        const result = await contentManagementService.createContent(
          userId,
          validatedData,
          uploadFiles
        );

        if (result.success) {
          res.status(201).json({
            success: true,
            message: 'Content created successfully',
            content: result.content
          });
        } else {
          res.status(400).json({
            success: false,
            error: result.error
          });
        }
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Invalid input data',
            details: error.errors
          });
        }

        logger.error('Content upload endpoint error', {
          userId,
          error: error.message
        });

        res.status(500).json({
          success: false,
          error: 'Content upload failed. Please try again.'
        });
      }
    });
  } catch (error: any) {
    logger.error('Content upload endpoint error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Content upload failed. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/content/{contentId}:
 *   put:
 *     summary: Update existing content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: JSON array of tags
 *               isPublic:
 *                 type: boolean
 *               isPremium:
 *                 type: boolean
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               metadata:
 *                 type: string
 *                 description: JSON object with metadata
 *               mainFile:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               additionalFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.put('/:contentId', authMiddleware, uploadRateLimit, async (req, res) => {
  try {
    const { userId } = req.user!;
    const { contentId } = req.params;

    // Configure multer for content uploads
    const upload = vercelBlobStorage.configureMulter({
      category: 'content',
      userId
    });

    upload.fields([
      { name: 'mainFile', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'additionalFiles', maxCount: 10 }
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      try {
        // Parse and validate update data
        const updates: any = {};
        
        if (req.body.title) updates.title = req.body.title;
        if (req.body.description) updates.description = req.body.description;
        if (req.body.category) updates.category = req.body.category;
        if (req.body.isPublic !== undefined) updates.isPublic = req.body.isPublic === 'true';
        if (req.body.isPremium !== undefined) updates.isPremium = req.body.isPremium === 'true';
        if (req.body.price !== undefined) updates.price = parseFloat(req.body.price);
        
        if (req.body.tags) {
          try {
            updates.tags = JSON.parse(req.body.tags);
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: 'Invalid tags format'
            });
          }
        }
        
        if (req.body.metadata) {
          try {
            updates.metadata = JSON.parse(req.body.metadata);
          } catch (e) {
            return res.status(400).json({
              success: false,
              error: 'Invalid metadata format'
            });
          }
        }

        // Validate update data
        const validatedUpdates = updateContentSchema.parse(updates);

        // Get uploaded files
        const files = req.files as any;
        const uploadFiles = {
          mainFile: files?.mainFile?.[0],
          thumbnail: files?.thumbnail?.[0],
          additionalFiles: files?.additionalFiles || []
        };

        // Update content
        const result = await contentManagementService.updateContent(
          contentId,
          userId,
          validatedUpdates,
          Object.keys(uploadFiles).some(key => uploadFiles[key]) ? uploadFiles : undefined
        );

        if (result.success) {
          res.json({
            success: true,
            message: 'Content updated successfully',
            content: result.content
          });
        } else {
          const statusCode = result.error?.includes('not found') ? 404 : 400;
          res.status(statusCode).json({
            success: false,
            error: result.error
          });
        }
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            error: 'Invalid input data',
            details: error.errors
          });
        }

        logger.error('Content update endpoint error', {
          userId,
          contentId,
          error: error.message
        });

        res.status(500).json({
          success: false,
          error: 'Content update failed. Please try again.'
        });
      }
    });
  } catch (error: any) {
    logger.error('Content update endpoint error', {
      userId: req.user?.userId,
      contentId: req.params.contentId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Content update failed. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/content/{contentId}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.get('/:contentId', generalRateLimit, async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user?.userId; // Optional for public content

    const content = await contentManagementService.getContentById(contentId, userId);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Increment views
    await contentManagementService.incrementViews(contentId, userId);

    res.json({
      success: true,
      content
    });
  } catch (error: any) {
    logger.error('Get content endpoint error', {
      contentId: req.params.contentId,
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get content'
    });
  }
});

/**
 * @swagger
 * /api/content/{contentId}:
 *   delete:
 *     summary: Delete content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:contentId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!;
    const { contentId } = req.params;

    const result = await contentManagementService.deleteContent(contentId, userId);

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      const statusCode = result.error?.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    logger.error('Delete content endpoint error', {
      userId: req.user?.userId,
      contentId: req.params.contentId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Content deletion failed. Please try again.'
    });
  }
});

/**
 * @swagger
 * /api/content/my-content:
 *   get:
 *     summary: Get user's content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [IMAGE, VIDEO, AUDIO, DOCUMENT, LIVESTREAM]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED, DELETED]
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isPremium
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/my-content', authMiddleware, generalRateLimit, async (req, res) => {
  try {
    const { userId } = req.user!;
    const options = getContentSchema.parse(req.query);

    const result = await contentManagementService.getUserContent(userId, options);

    res.json({
      success: true,
      content: result.content,
      total: result.total,
      pagination: {
        limit: options.limit,
        offset: options.offset,
        hasMore: result.total > options.offset + options.limit
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    }

    logger.error('Get user content endpoint error', {
      userId: req.user?.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get content'
    });
  }
});

/**
 * @swagger
 * /api/content/feed:
 *   get:
 *     summary: Get public content feed
 *     tags: [Content]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [IMAGE, VIDEO, AUDIO, DOCUMENT, LIVESTREAM]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, popular, trending]
 *           default: newest
 *     responses:
 *       200:
 *         description: Content feed retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/feed', generalRateLimit, async (req, res) => {
  try {
    const options: any = {
      type: req.query.type as ContentType,
      category: req.query.category as string,
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0,
      search: req.query.search as string,
      sortBy: (req.query.sortBy as string) || 'newest'
    };

    // Parse tags if provided
    if (req.query.tags) {
      try {
        options.tags = Array.isArray(req.query.tags) 
          ? req.query.tags 
          : [req.query.tags];
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid tags format'
        });
      }
    }

    const result = await contentManagementService.getPublicContent(options);

    res.json({
      success: true,
      content: result.content,
      total: result.total,
      pagination: {
        limit: options.limit,
        offset: options.offset,
        hasMore: result.total > options.offset + options.limit
      }
    });
  } catch (error: any) {
    logger.error('Get public content feed endpoint error', {
      query: req.query,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get content feed'
    });
  }
});

export default router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const { prisma } = require('../app.cjs');

const router = express.Router();

// Import authentication middleware
const { authenticateToken } = require('./auth.cjs');

// File upload configuration for content
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = file.mimetype.startsWith('image/') 
      ? path.join(__dirname, '../../uploads/images')
      : path.join(__dirname, '../../uploads/videos');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'content-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// Utility function to check content access
const checkContentAccess = (userTier, contentTier) => {
  const tierHierarchy = { 'FREE': 0, 'BASIC': 1, 'PREMIUM': 2, 'VIP': 3 };
  const userLevel = tierHierarchy[userTier] || 0;
  const contentLevel = tierHierarchy[contentTier] || 0;
  return userLevel >= contentLevel;
};

// Get content feed with pagination and filtering
router.get('/feed', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const creatorId = req.query.creatorId;
    const userTier = req.user ? req.user.subscriptionTier : 'FREE';

    // Build where clause
    const where = {
      isActive: true,
      ...(category && { category }),
      ...(creatorId && { authorId: creatorId })
    };

    // Get content
    const content = await prisma.content.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Filter content based on user's subscription tier
    const accessibleContent = content.map(item => {
      const hasAccess = checkContentAccess(userTier, item.requiredTier);
      
      if (!hasAccess) {
        return {
          ...item,
          content: null, // Hide actual content
          mediaUrl: null, // Hide media
          videoUrl: null, // Hide video
          isLocked: true,
          requiredTier: item.requiredTier
        };
      }
      
      return {
        ...item,
        isLocked: false
      };
    });

    // Get total count for pagination
    const total = await prisma.content.count({ where });

    res.json({
      success: true,
      content: accessibleContent,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get content feed error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get content feed'
    });
  }
});

// Get specific content by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userTier = req.user ? req.user.subscriptionTier : 'FREE';

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!content || !content.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Check access
    const hasAccess = checkContentAccess(userTier, content.requiredTier);
    
    if (!hasAccess) {
      return res.json({
        success: true,
        content: {
          ...content,
          content: null,
          mediaUrl: null,
          videoUrl: null,
          isLocked: true,
          requiredTier: content.requiredTier
        }
      });
    }

    res.json({
      success: true,
      content: {
        ...content,
        isLocked: false
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get content'
    });
  }
});

// Create new content
router.post('/', authenticateToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const {
      title,
      content,
      category = 'GENERAL',
      requiredTier = 'FREE',
      tags
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }

    // Handle file uploads
    let mediaUrl = null;
    let videoUrl = null;
    
    if (req.files) {
      if (req.files.image) {
        mediaUrl = `/uploads/images/${req.files.image[0].filename}`;
      }
      if (req.files.video) {
        videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
      }
    }

    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = [];
      }
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        content,
        category,
        requiredTier,
        tags: parsedTags,
        mediaUrl,
        videoUrl,
        authorId: req.user.id,
        isActive: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      content: newContent
    });

    console.log(`✅ Content created: ${newContent.title} by ${req.user.username}`);
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create content',
      details: error.message
    });
  }
});

// Update content
router.put('/:id', authenticateToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id } = req.params;
    const {
      title,
      content,
      category,
      requiredTier,
      tags
    } = req.body;

    // Check if content exists and user owns it
    const existingContent = await prisma.content.findUnique({
      where: { id }
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    if (existingContent.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You can only edit your own content'
      });
    }

    // Handle file uploads
    let updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(category && { category }),
      ...(requiredTier && { requiredTier })
    };

    if (req.files) {
      if (req.files.image) {
        updateData.mediaUrl = `/uploads/images/${req.files.image[0].filename}`;
      }
      if (req.files.video) {
        updateData.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
      }
    }

    if (tags) {
      try {
        updateData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        // Keep existing tags if parsing fails
      }
    }

    const updatedContent = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Content updated successfully',
      content: updatedContent
    });

    console.log(`✅ Content updated: ${updatedContent.title} by ${req.user.username}`);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update content'
    });
  }
});

// Delete content
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id } = req.params;

    const existingContent = await prisma.content.findUnique({
      where: { id }
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    if (existingContent.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own content'
      });
    }

    await prisma.content.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

    console.log(`✅ Content deleted: ${id} by ${req.user.username}`);
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete content'
    });
  }
});

// Like/Unlike content
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id } = req.params;

    // Check if content exists
    const content = await prisma.content.findUnique({
      where: { id }
    });

    if (!content || !content.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Check if user already liked this content
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_contentId: {
          userId: req.user.id,
          contentId: id
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_contentId: {
            userId: req.user.id,
            contentId: id
          }
        }
      });

      res.json({
        success: true,
        message: 'Content unliked',
        liked: false
      });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: req.user.id,
          contentId: id
        }
      });

      res.json({
        success: true,
        message: 'Content liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Like content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like/unlike content'
    });
  }
});

// Add comment to content
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }

    // Check if content exists
    const contentExists = await prisma.content.findUnique({
      where: { id }
    });

    if (!contentExists || !contentExists.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: req.user.id,
        contentId: id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment'
    });
  }
});

// Get user's own content
router.get('/my/posts', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const content = await prisma.content.findMany({
      where: {
        authorId: req.user.id,
        isActive: true
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.content.count({
      where: {
        authorId: req.user.id,
        isActive: true
      }
    });

    res.json({
      success: true,
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user content'
    });
  }
});

module.exports = router;

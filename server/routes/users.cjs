const express = require('express');
const multer = require('multer');
const path = require('path');
const { prisma } = require('../app.cjs');

const router = express.Router();

// Import authentication middleware
const { authenticateToken } = require('./auth.cjs');

// Avatar upload configuration
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/avatars'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for avatars.'));
    }
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        isEmailVerified: true,
        createdAt: true,
        _count: {
          select: {
            content: {
              where: { isActive: true }
            },
            followers: true,
            following: true
          }
        }
      }
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.patch('/profile', authenticateToken, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { username, bio, email } = req.body;
    const updateData = {};

    // Check if username is taken by another user
    if (username && username !== req.user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() }
      });

      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({
          success: false,
          error: 'Username is already taken'
        });
      }

      updateData.username = username.toLowerCase();
    }

    // Check if email is taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({
          success: false,
          error: 'Email is already taken'
        });
      }

      updateData.email = email.toLowerCase();
      updateData.isEmailVerified = false; // Reset email verification
    }

    if (bio !== undefined) updateData.bio = bio;

    // Handle avatar upload
    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        role: true,
        subscriptionTier: true,
        isEmailVerified: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

    console.log(`✅ User ${req.user.username} updated profile`);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      details: error.message
    });
  }
});

// Get public user profile
router.get('/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            content: {
              where: { isActive: true }
            },
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { query, role, page = 1, limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      AND: [
        { isActive: true },
        {
          OR: [
            { username: { contains: query.trim(), mode: 'insensitive' } },
            { bio: { contains: query.trim(), mode: 'insensitive' } }
          ]
        },
        ...(role && [{ role }])
      ]
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        role: true,
        bio: true,
        avatar: true,
        _count: {
          select: {
            content: {
              where: { isActive: true }
            },
            followers: true
          }
        }
      },
      orderBy: [
        { role: 'desc' }, // Creators first
        { username: 'asc' }
      ],
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
});

// Follow/Unfollow user
router.post('/:id/follow', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id: targetUserId } = req.params;

    if (targetUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot follow yourself'
      });
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, username: true, isActive: true }
    });

    if (!targetUser || !targetUser.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: targetUserId
        }
      }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: req.user.id,
            followingId: targetUserId
          }
        }
      });

      res.json({
        success: true,
        message: `Unfollowed ${targetUser.username}`,
        following: false
      });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: req.user.id,
          followingId: targetUserId
        }
      });

      res.json({
        success: true,
        message: `Now following ${targetUser.username}`,
        following: true
      });
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to follow/unfollow user'
    });
  }
});

// Get user's followers
router.get('/:id/followers', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.follow.count({
      where: { followingId: id }
    });

    res.json({
      success: true,
      followers: followers.map(f => f.follower),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get followers'
    });
  }
});

// Get user's following
router.get('/:id/following', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const following = await prisma.follow.findMany({
      where: { followerId: id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.follow.count({
      where: { followerId: id }
    });

    res.json({
      success: true,
      following: following.map(f => f.following),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get following'
    });
  }
});

// Get user's content
router.get('/:id/content', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const userTier = req.user ? req.user.subscriptionTier : 'FREE';

    // Check if user can view this profile
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, isActive: true }
    });

    if (!targetUser || !targetUser.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const content = await prisma.content.findMany({
      where: {
        authorId: id,
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
    const tierHierarchy = { 'FREE': 0, 'BASIC': 1, 'PREMIUM': 2, 'VIP': 3 };
    const userLevel = tierHierarchy[userTier] || 0;

    const accessibleContent = content.map(item => {
      const contentLevel = tierHierarchy[item.requiredTier] || 0;
      const hasAccess = userLevel >= contentLevel;
      
      if (!hasAccess) {
        return {
          ...item,
          content: null,
          mediaUrl: null,
          videoUrl: null,
          isLocked: true,
          requiredTier: item.requiredTier
        };
      }
      
      return {
        ...item,
        isLocked: false
      };
    });

    const total = await prisma.content.count({
      where: {
        authorId: id,
        isActive: true
      }
    });

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
    console.error('Get user content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user content'
    });
  }
});

// Get creators (users with CREATOR role)
router.get('/creators', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    const where = {
      role: 'CREATOR',
      isActive: true,
      ...(search && {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const creators = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            content: {
              where: { isActive: true }
            },
            followers: true
          }
        }
      },
      orderBy: [
        { _count: { followers: 'desc' } },
        { username: 'asc' }
      ],
      skip,
      take: limit
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      creators,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get creators error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get creators'
    });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Deactivate account instead of hard delete
    await prisma.user.update({
      where: { id: req.user.id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

    console.log(`✅ User ${req.user.username} deleted their account`);
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
});

module.exports = router;

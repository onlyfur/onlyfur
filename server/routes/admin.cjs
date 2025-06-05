const express = require('express');
const { prisma } = require('../app.cjs');

const router = express.Router();

// Import authentication middleware
const { authenticateToken } = require('./auth.cjs');

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  next();
};

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Admin Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    // Get various statistics for the admin dashboard
    const [
      totalUsers,
      totalCreators,
      totalContent,
      totalTransactions,
      activeSubscriptions,
      todayRegistrations,
      todayContent,
      todayRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CREATOR' } }),
      prisma.content.count({ where: { isActive: true } }),
      prisma.transaction.count(),
      prisma.user.count({ where: { subscriptionStatus: 'ACTIVE' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.content.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.transaction.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          },
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      })
    ]);

    // Recent activities
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const recentContent = await prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        author: {
          select: {
            username: true
          }
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCreators,
        totalContent,
        totalTransactions,
        activeSubscriptions,
        todayRegistrations,
        todayContent,
        todayRevenue: todayRevenue._sum.amount || 0
      },
      recentActivities: {
        users: recentUsers,
        content: recentContent
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard stats'
    });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const role = req.query.role;
    const status = req.query.status;

    const where = {
      ...(search && {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(role && { role }),
      ...(status === 'active' && { isActive: true }),
      ...(status === 'inactive' && { isActive: false })
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            content: true,
            sentMessages: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
    });
  }
});

// Update user status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, role, subscriptionTier } = req.body;

    const updateData = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (role) updateData.role = role;
    if (subscriptionTier) updateData.subscriptionTier = subscriptionTier;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        subscriptionTier: true
      }
    });

    res.json({
      success: true,
      message: 'User status updated successfully',
      user
    });

    console.log(`✅ Admin ${req.user.username} updated user ${user.username}`);
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status'
    });
  }
});

// Content Management
router.get('/content', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const status = req.query.status;

    const where = {
      ...(category && { category }),
      ...(status === 'active' && { isActive: true }),
      ...(status === 'inactive' && { isActive: false })
    };

    const content = await prisma.content.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
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

    const total = await prisma.content.count({ where });

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
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get content'
    });
  }
});

// Moderate content
router.patch('/content/:id/moderate', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, moderationNote } = req.body;

    const content = await prisma.content.update({
      where: { id },
      data: {
        isActive,
        ...(moderationNote && { moderationNote })
      },
      include: {
        author: {
          select: {
            username: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Content moderated successfully',
      content
    });

    console.log(`✅ Admin ${req.user.username} moderated content ${content.title}`);
  } catch (error) {
    console.error('Moderate content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to moderate content'
    });
  }
});

// Subscription Tier Management
router.get('/subscription-tiers', async (req, res) => {
  try {
    const tiers = await prisma.platformSubscriptionTier.findMany({
      orderBy: { price: 'asc' }
    });

    res.json({
      success: true,
      tiers
    });
  } catch (error) {
    console.error('Get subscription tiers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription tiers'
    });
  }
});

// Create subscription tier
router.post('/subscription-tiers', async (req, res) => {
  try {
    const { id, name, price, description, features } = req.body;

    if (!id || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'ID, name, and price are required'
      });
    }

    const tier = await prisma.platformSubscriptionTier.create({
      data: {
        id,
        name,
        price,
        description: description || '',
        features: features || [],
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Subscription tier created successfully',
      tier
    });

    console.log(`✅ Admin ${req.user.username} created subscription tier ${tier.name}`);
  } catch (error) {
    console.error('Create subscription tier error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription tier'
    });
  }
});

// Update subscription tier
router.patch('/subscription-tiers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, features, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (features) updateData.features = features;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const tier = await prisma.platformSubscriptionTier.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Subscription tier updated successfully',
      tier
    });

    console.log(`✅ Admin ${req.user.username} updated subscription tier ${tier.name}`);
  } catch (error) {
    console.error('Update subscription tier error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription tier'
    });
  }
});

// Transaction Management
router.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const type = req.query.type;

    const where = {
      ...(status && { status }),
      ...(type && { type })
    };

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.transaction.count({ where });

    // Calculate revenue stats
    const revenueStats = await prisma.transaction.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      },
      _count: true
    });

    res.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalRevenue: revenueStats._sum.amount || 0,
        totalTransactions: revenueStats._count
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get transactions'
    });
  }
});

// Analytics
router.get('/analytics/overview', async (req, res) => {
  try {
    const period = req.query.period || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // User growth
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Revenue over time
    const revenueOverTime = await prisma.transaction.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        },
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });

    // Content creation over time
    const contentOverTime = await prisma.content.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Subscription distribution
    const subscriptionDistribution = await prisma.user.groupBy({
      by: ['subscriptionTier'],
      _count: true
    });

    res.json({
      success: true,
      analytics: {
        userGrowth,
        revenueOverTime,
        contentOverTime,
        subscriptionDistribution
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics'
    });
  }
});

// System Settings
router.get('/settings', async (req, res) => {
  try {
    // This would typically fetch from a settings table
    // For now, return some default settings
    const settings = {
      platformName: 'OnlyFur',
      allowRegistration: true,
      defaultSubscriptionTier: 'FREE',
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
      maintenanceMode: false
    };

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get settings'
    });
  }
});

// Update system settings
router.patch('/settings', async (req, res) => {
  try {
    const settings = req.body;

    // In a real application, you would save these to a database
    // For now, just return success
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });

    console.log(`✅ Admin ${req.user.username} updated system settings`);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    });
  }
});

module.exports = router;

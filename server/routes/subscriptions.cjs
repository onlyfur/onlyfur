const express = require('express');
const { prisma } = require('../app.cjs');

const router = express.Router();

// Import authentication middleware
const { authenticateToken } = require('./auth.cjs');

// Get all subscription tiers
router.get('/tiers', async (req, res) => {
  try {
    const tiers = await prisma.platformSubscriptionTier.findMany({
      where: { isActive: true },
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

// Get specific subscription tier
router.get('/tiers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tier = await prisma.platformSubscriptionTier.findUnique({
      where: { id }
    });

    if (!tier) {
      return res.status(404).json({
        success: false,
        error: 'Subscription tier not found'
      });
    }

    res.json({
      success: true,
      tier
    });
  } catch (error) {
    console.error('Get subscription tier error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription tier'
    });
  }
});

// Get user's current subscription
router.get('/my-subscription', authenticateToken, async (req, res) => {
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
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true
      }
    });

    const tier = await prisma.platformSubscriptionTier.findUnique({
      where: { id: user.subscriptionTier }
    });

    res.json({
      success: true,
      subscription: {
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        tierDetails: tier
      }
    });
  } catch (error) {
    console.error('Get user subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user subscription'
    });
  }
});

// Subscribe to a tier (mock implementation - replace with Stripe)
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { tierId } = req.body;

    if (!tierId) {
      return res.status(400).json({
        success: false,
        error: 'Tier ID is required'
      });
    }

    // Check if tier exists
    const tier = await prisma.platformSubscriptionTier.findUnique({
      where: { id: tierId }
    });

    if (!tier || !tier.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Subscription tier not found'
      });
    }

    // Update user subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        subscriptionTier: tierId,
        subscriptionStatus: 'ACTIVE',
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate
      },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true
      }
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        amount: tier.price,
        type: 'SUBSCRIPTION',
        status: 'COMPLETED',
        description: `Subscription to ${tier.name} tier`,
        stripeTransactionId: `mock_${Date.now()}` // Replace with actual Stripe transaction ID
      }
    });

    res.json({
      success: true,
      message: 'Subscription successful',
      subscription: {
        tier: updatedUser.subscriptionTier,
        status: updatedUser.subscriptionStatus,
        startDate: updatedUser.subscriptionStartDate,
        endDate: updatedUser.subscriptionEndDate
      }
    });

    console.log(`✅ User ${req.user.email} subscribed to ${tier.name}`);
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      error: 'Subscription failed',
      details: error.message
    });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        subscriptionStatus: 'CANCELLED'
      },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionEndDate: true
      }
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: updatedUser
    });

    console.log(`✅ User ${req.user.email} cancelled subscription`);
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    });
  }
});

// Get subscription history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        type: 'SUBSCRIPTION'
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Get subscription history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription history'
    });
  }
});

module.exports = router;

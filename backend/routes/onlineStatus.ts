import { Router } from 'express';
import { ActivityStatus } from '@prisma/client';
import onlineStatusService from '../services/onlineStatusService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/online-status/heartbeat:
 *   post:
 *     summary: Send heartbeat to maintain online status
 *     tags: [OnlineStatus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Heartbeat recorded successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/heartbeat', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await onlineStatusService.updateUserActivity(userId);
    
    res.json({ 
      success: true, 
      message: 'Heartbeat recorded',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({ success: false, message: 'Failed to record heartbeat' });
  }
});

/**
 * @swagger
 * /api/online-status/set-status:
 *   post:
 *     summary: Set user activity status
 *     tags: [OnlineStatus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ONLINE, AWAY, BUSY, OFFLINE]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 */
router.post('/set-status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!Object.values(ActivityStatus).includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status',
        validStatuses: Object.values(ActivityStatus)
      });
    }

    await onlineStatusService.setUserActivityStatus(userId, status);
    
    res.json({ 
      success: true, 
      message: 'Status updated successfully',
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Set status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

/**
 * @swagger
 * /api/online-status/status/{userId}:
 *   get:
 *     summary: Get user's online status
 *     tags: [OnlineStatus]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User status retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const status = await onlineStatusService.getUserOnlineStatus(userId);
    
    res.json({ 
      success: true,
      userId,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user status' });
  }
});

/**
 * @swagger
 * /api/online-status/bulk-status:
 *   post:
 *     summary: Get multiple users' online status
 *     tags: [OnlineStatus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bulk status retrieved successfully
 *       400:
 *         description: Invalid request
 */
router.post('/bulk-status', async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'userIds must be a non-empty array' 
      });
    }

    if (userIds.length > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum 100 users per request' 
      });
    }

    const statusMap = await onlineStatusService.getMultipleUsersOnlineStatus(userIds);
    
    // Convert Map to object for JSON response
    const statusObject: Record<string, any> = {};
    for (const [userId, status] of statusMap.entries()) {
      statusObject[userId] = status;
    }

    res.json({ 
      success: true,
      statuses: statusObject,
      count: userIds.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Bulk status error:', error);
    res.status(500).json({ success: false, message: 'Failed to get bulk status' });
  }
});

/**
 * @swagger
 * /api/online-status/online-count:
 *   get:
 *     summary: Get current online users count
 *     tags: [OnlineStatus]
 *     responses:
 *       200:
 *         description: Online count retrieved successfully
 */
router.get('/online-count', async (req, res) => {
  try {
    const count = await onlineStatusService.getOnlineUsersCount();
    
    res.json({ 
      success: true,
      onlineCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Online count error:', error);
    res.status(500).json({ success: false, message: 'Failed to get online count' });
  }
});

/**
 * @swagger
 * /api/online-status/online-users:
 *   get:
 *     summary: Get list of currently online users
 *     tags: [OnlineStatus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *     responses:
 *       200:
 *         description: Online users list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/online-users', authMiddleware, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    
    const onlineUsers = await onlineStatusService.getOnlineUsers(limit);
    
    res.json({ 
      success: true,
      users: onlineUsers,
      count: onlineUsers.length,
      limit,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Online users error:', error);
    res.status(500).json({ success: false, message: 'Failed to get online users' });
  }
});

/**
 * @swagger
 * /api/online-status/set-online:
 *   post:
 *     summary: Set user as online (usually called on login/connect)
 *     tags: [OnlineStatus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               socketId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User set as online successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/set-online', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { socketId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await onlineStatusService.setUserOnline(userId, socketId);
    
    res.json({ 
      success: true, 
      message: 'User set as online',
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Set online error:', error);
    res.status(500).json({ success: false, message: 'Failed to set user online' });
  }
});

/**
 * @swagger
 * /api/online-status/set-offline:
 *   post:
 *     summary: Set user as offline (usually called on logout/disconnect)
 *     tags: [OnlineStatus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User set as offline successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/set-offline', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    await onlineStatusService.setUserOffline(userId);
    
    res.json({ 
      success: true, 
      message: 'User set as offline',
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Set offline error:', error);
    res.status(500).json({ success: false, message: 'Failed to set user offline' });
  }
});

export default router;

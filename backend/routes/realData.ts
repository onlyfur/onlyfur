import express from 'express';
import { realDataService } from '../services/realDataService.js';

const router = express.Router();

/**
 * @swagger
 * /api/real-data/platform-stats:
 *   get:
 *     summary: Get real platform statistics
 *     tags: [Real Data]
 *     responses:
 *       200:
 *         description: Platform statistics
 */
router.get('/platform-stats', async (req, res) => {
  try {
    const stats = await realDataService.getPlatformStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch platform stats' });
  }
});

/**
 * @swagger
 * /api/real-data/creators:
 *   get:
 *     summary: Get real creators from database
 *     tags: [Real Data]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of real creators
 */
router.get('/creators', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const creators = await realDataService.getRealCreators(limit, offset);
    res.json({ success: true, creators, total: creators.length });
  } catch (error) {
    console.error('Error fetching real creators:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch creators' });
  }
});

/**
 * @swagger
 * /api/real-data/featured-creators:
 *   get:
 *     summary: Get featured creators
 *     tags: [Real Data]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: List of featured creators
 */
router.get('/featured-creators', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const creators = await realDataService.getFeaturedCreators(limit);
    res.json({ success: true, creators });
  } catch (error) {
    console.error('Error fetching featured creators:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch featured creators' });
  }
});

/**
 * @swagger
 * /api/real-data/content:
 *   get:
 *     summary: Get real content from database
 *     tags: [Real Data]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: includePrivate
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: List of real content
 */
router.get('/content', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const includePrivate = req.query.includePrivate === 'true';
    
    const content = await realDataService.getRealContent(limit, offset, includePrivate);
    res.json({ success: true, content, total: content.length });
  } catch (error) {
    console.error('Error fetching real content:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch content' });
  }
});

/**
 * @swagger
 * /api/real-data/trending:
 *   get:
 *     summary: Get trending content
 *     tags: [Real Data]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of trending content
 */
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const content = await realDataService.getTrendingContent(limit);
    res.json({ success: true, content });
  } catch (error) {
    console.error('Error fetching trending content:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trending content' });
  }
});

/**
 * @swagger
 * /api/real-data/search/users:
 *   get:
 *     summary: Search real users
 *     tags: [Real Data]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search/users', async (req, res) => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (!query || query.trim().length === 0) {
      return res.json({ success: true, users: [] });
    }
    
    const users = await realDataService.searchUsers(query, limit);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ success: false, error: 'Failed to search users' });
  }
});

/**
 * @swagger
 * /api/real-data/user/{userId}:
 *   get:
 *     summary: Get user by ID with full details
 *     tags: [Real Data]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await realDataService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

/**
 * @swagger
 * /api/real-data/recent-activity:
 *   get:
 *     summary: Get recent platform activity
 *     tags: [Real Data]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Recent activity list
 */
router.get('/recent-activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const activity = await realDataService.getRecentActivity(limit);
    res.json({ success: true, activity });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recent activity' });
  }
});

export default router;

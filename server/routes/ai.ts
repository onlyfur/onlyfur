import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { createRateLimit } from '../middleware/rateLimiter';
import { aiEngine } from '../services/aiEngine';
import { logger } from '../middleware/logger';

const router = express.Router();

// Rate limiting for AI features
const aiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many AI requests, please try again later.'
});

// More restrictive rate limit for expensive operations
const heavyAiRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
  message: 'Too many intensive AI requests, please try again later.'
});

// Validation schemas
const recommendationSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  categories: z.array(z.string()).optional()
});

const searchEnhancementSchema = z.object({
  query: z.string().min(1).max(200),
  context: z.record(z.any()).optional()
});

const pricingPredictionSchema = z.object({
  contentId: z.string().min(1)
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ContentRecommendation:
 *       type: object
 *       properties:
 *         contentId:
 *           type: string
 *         score:
 *           type: number
 *         reason:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         confidence:
 *           type: number
 *     UserInsight:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         category:
 *           type: string
 *           enum: [engagement, content_preference, behavior, monetization]
 *         insight:
 *           type: string
 *         confidence:
 *           type: number
 *         actionable:
 *           type: boolean
 *         suggestions:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/ai/recommendations:
 *   post:
 *     summary: Get AI-powered content recommendations
 *     tags: [AI Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 50
 *                 default: 20
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Content recommendations generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContentRecommendation'
 */
router.post('/recommendations', authenticateToken, aiRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = recommendationSchema.parse(req.body || {});

    const recommendations = await aiEngine.generateContentRecommendations(
      userId,
      validatedData.limit || 20,
      validatedData.categories
    );

    res.json({
      recommendations,
      count: recommendations.length,
      message: 'Content recommendations generated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to generate recommendations', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: 'An error occurred while generating content recommendations'
    });
  }
});

/**
 * @swagger
 * /api/ai/insights:
 *   get:
 *     summary: Get AI-powered user insights
 *     tags: [AI Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User insights generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insights:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserInsight'
 */
router.get('/insights', authenticateToken, heavyAiRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const insights = await aiEngine.generateUserInsights(userId);

    res.json({
      insights,
      count: insights.length,
      message: 'User insights generated successfully'
    });

  } catch (error) {
    logger.error('Failed to generate user insights', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to generate insights',
      message: 'An error occurred while generating user insights'
    });
  }
});

/**
 * @swagger
 * /api/ai/creator-insights:
 *   get:
 *     summary: Get comprehensive creator insights and recommendations
 *     tags: [AI Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Creator insights generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insights:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserInsight'
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *                 opportunities:
 *                   type: array
 *                   items:
 *                     type: object
 *                 warnings:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/creator-insights', authenticateToken, heavyAiRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const creatorInsights = await aiEngine.generateCreatorInsights(userId);

    res.json({
      ...creatorInsights,
      message: 'Creator insights generated successfully'
    });

  } catch (error) {
    logger.error('Failed to generate creator insights', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to generate creator insights',
      message: 'An error occurred while generating creator insights'
    });
  }
});

/**
 * @swagger
 * /api/ai/search/enhance:
 *   post:
 *     summary: Enhance search query with AI
 *     tags: [AI Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *               context:
 *                 type: object
 *     responses:
 *       200:
 *         description: Search query enhanced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enhancement:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                     enhancedQuery:
 *                       type: string
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     filters:
 *                       type: object
 *                     intent:
 *                       type: string
 *                     confidence:
 *                       type: number
 */
router.post('/search/enhance', authenticateToken, aiRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = searchEnhancementSchema.parse(req.body);

    const enhancement = await aiEngine.enhanceSearch(
      validatedData.query,
      userId,
      validatedData.context
    );

    res.json({
      enhancement,
      message: 'Search query enhanced successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to enhance search', {
      userId: (req as any).user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to enhance search',
      message: 'An error occurred while enhancing the search query'
    });
  }
});

/**
 * @swagger
 * /api/ai/moderation/predict:
 *   post:
 *     summary: Predict content moderation needs
 *     tags: [AI Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentId
 *             properties:
 *               contentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Moderation prediction generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prediction:
 *                   type: object
 *                   properties:
 *                     contentId:
 *                       type: string
 *                     riskScore:
 *                       type: number
 *                     violations:
 *                       type: array
 *                       items:
 *                         type: object
 *                     autoAction:
 *                       type: string
 *                       enum: [approve, flag, remove, review]
 */
router.post('/moderation/predict', authenticateToken, aiRateLimit, async (req, res) => {
  try {
    const { contentId } = req.body;

    if (!contentId) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Content ID is required'
      });
    }

    const prediction = await aiEngine.predictModerationNeeds(contentId);

    res.json({
      prediction,
      message: 'Moderation prediction generated successfully'
    });

  } catch (error) {
    logger.error('Failed to predict moderation needs', {
      contentId: req.body?.contentId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to predict moderation needs',
      message: 'An error occurred while analyzing content'
    });
  }
});

/**
 * @swagger
 * /api/ai/pricing/predict:
 *   post:
 *     summary: Predict optimal content pricing
 *     tags: [AI Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentId
 *             properties:
 *               contentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pricing prediction generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pricing:
 *                   type: object
 *                   properties:
 *                     suggestedPrice:
 *                       type: number
 *                     confidence:
 *                       type: number
 *                     reasoning:
 *                       type: string
 *                     priceRange:
 *                       type: object
 *                       properties:
 *                         min:
 *                           type: number
 *                         max:
 *                           type: number
 *                     factors:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.post('/pricing/predict', authenticateToken, heavyAiRateLimit, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = pricingPredictionSchema.parse(req.body);

    const pricing = await aiEngine.predictOptimalPricing(
      validatedData.contentId,
      userId
    );

    res.json({
      pricing,
      message: 'Pricing prediction generated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    logger.error('Failed to predict optimal pricing', {
      userId: (req as any).user?.id,
      contentId: req.body?.contentId,
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to predict pricing',
      message: 'An error occurred while predicting optimal pricing'
    });
  }
});

/**
 * @swagger
 * /api/ai/status:
 *   get:
 *     summary: Get AI service status
 *     tags: [AI Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI service status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 models:
 *                   type: object
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/status', authenticateToken, aiRateLimit, async (req, res) => {
  try {
    // Initialize AI engine if not already done
    await aiEngine.initialize();

    const status = {
      status: 'operational',
      models: {
        recommendation: 'v2.1',
        moderation: 'v1.8',
        insight: 'v1.5',
        search: 'v1.2'
      },
      features: [
        'content_recommendations',
        'user_insights',
        'creator_insights',
        'search_enhancement',
        'moderation_prediction',
        'pricing_optimization'
      ],
      lastUpdated: new Date().toISOString()
    };

    res.json({
      ...status,
      message: 'AI service status retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get AI status', {
      error: error.message
    });

    res.status(500).json({
      error: 'Failed to get AI status',
      message: 'An error occurred while checking AI service status'
    });
  }
});

export default router;
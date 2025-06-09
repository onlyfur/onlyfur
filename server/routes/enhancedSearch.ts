import { Router } from 'express';
import { enhancedAISearchService } from '../services/enhancedAISearch';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';
import { logger } from '../middleware/logger';
import { z } from 'zod';

const router = Router();

// Validation schemas
const searchSchema = z.object({
  query: z.string().min(1).max(500),
  filters: z.object({
    type: z.enum(['users', 'content', 'posts', 'streams', 'all']).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    dateRange: z.object({
      start: z.string().datetime(),
      end: z.string().datetime()
    }).optional(),
    priceRange: z.object({
      min: z.number().min(0),
      max: z.number().min(0)
    }).optional(),
    rating: z.object({
      min: z.number().min(0).max(5),
      max: z.number().min(0).max(5)
    }).optional(),
    verified: z.boolean().optional(),
    premium: z.boolean().optional(),
    location: z.string().optional(),
    language: z.string().optional()
  }).optional(),
  sort: z.object({
    field: z.enum(['relevance', 'date', 'popularity', 'rating', 'price']),
    order: z.enum(['asc', 'desc'])
  }).optional(),
  pagination: z.object({
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0)
  }).optional()
});

const suggestionSchema = z.object({
  query: z.string().min(1).max(100)
});

const analyticsSchema = z.object({
  queryId: z.string(),
  resultId: z.string().optional(),
  action: z.enum(['click', 'view', 'bookmark', 'share']),
  timeSpent: z.number().min(0).optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchQuery:
 *       type: object
 *       required: [query]
 *       properties:
 *         query:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *         filters:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [users, content, posts, streams, all]
 *             category:
 *               type: string
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *             dateRange:
 *               type: object
 *               properties:
 *                 start:
 *                   type: string
 *                   format: date-time
 *                 end:
 *                   type: string
 *                   format: date-time
 *             priceRange:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   minimum: 0
 *                 max:
 *                   type: number
 *                   minimum: 0
 *         sort:
 *           type: object
 *           properties:
 *             field:
 *               type: string
 *               enum: [relevance, date, popularity, rating, price]
 *             order:
 *               type: string
 *               enum: [asc, desc]
 *         pagination:
 *           type: object
 *           properties:
 *             limit:
 *               type: number
 *               minimum: 1
 *               maximum: 100
 *             offset:
 *               type: number
 *               minimum: 0
 *     SearchResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [user, content, post, stream]
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         thumbnail:
 *           type: string
 *         url:
 *           type: string
 *         score:
 *           type: number
 *         relevanceScore:
 *           type: number
 *         popularityScore:
 *           type: number
 *         personalizedScore:
 *           type: number
 *         highlights:
 *           type: object
 *         matchReason:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: Perform AI-powered search
 *     tags: [Enhanced Search]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchQuery'
 *     responses:
 *       200:
 *         description: Search results retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SearchResult'
 *                     totalCount:
 *                       type: number
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                     facets:
 *                       type: object
 *                     searchTime:
 *                       type: number
 *                     queryId:
 *                       type: string
 */
router.post('/', 
  optionalAuthenticate, // Allow both authenticated and anonymous search
  rateLimiter('search', { windowMs: 60 * 1000, max: 30 }), // 30 searches per minute
  validateRequest(searchSchema),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const searchQuery = {
        ...req.body,
        userId
      };

      // Convert date strings to Date objects if present
      if (searchQuery.filters?.dateRange) {
        searchQuery.filters.dateRange.start = new Date(searchQuery.filters.dateRange.start);
        searchQuery.filters.dateRange.end = new Date(searchQuery.filters.dateRange.end);
      }

      const searchResults = await enhancedAISearchService.search(searchQuery);

      res.json({
        success: true,
        data: searchResults
      });

    } catch (error) {
      logger.error('Search request failed', {
        userId: req.user?.id,
        query: req.body.query,
        error: error.message
      });
      
      res.status(500).json({
        success: false,
        error: 'Search request failed'
      });
    }
  }
);

/**
 * @swagger
 * /api/search/suggestions:
 *   get:
 *     summary: Get search suggestions and autocomplete
 *     tags: [Enhanced Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *     responses:
 *       200:
 *         description: Search suggestions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [completion, correction, related]
 *                       score:
 *                         type: number
 *                       category:
 *                         type: string
 */
router.get('/suggestions',
  rateLimiter('search_suggestions', { windowMs: 60 * 1000, max: 60 }), // 60 requests per minute
  async (req, res) => {
    try {
      const { query, limit = 10 } = req.query;

      if (!query || typeof query !== 'string' || query.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Query parameter is required'
        });
      }

      const suggestions = await enhancedAISearchService.generateSuggestions(query);
      const limitedSuggestions = suggestions.slice(0, parseInt(limit as string));

      res.json({
        success: true,
        data: limitedSuggestions
      });

    } catch (error) {
      logger.error('Search suggestions failed', {
        query: req.query.query,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get search suggestions'
      });
    }
  }
);

/**
 * @swagger
 * /api/search/trending:
 *   get:
 *     summary: Get trending search queries
 *     tags: [Enhanced Search]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: day
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *     responses:
 *       200:
 *         description: Trending searches retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       query:
 *                         type: string
 *                       count:
 *                         type: number
 *                       growth:
 *                         type: number
 *                       category:
 *                         type: string
 */
router.get('/trending',
  rateLimiter('search_trending', { windowMs: 60 * 1000, max: 20 }), // 20 requests per minute
  async (req, res) => {
    try {
      const { period = 'day', category, limit = 20 } = req.query;

      const trends = await enhancedAISearchService.getTrendingSearches({
        period: period as 'hour' | 'day' | 'week' | 'month',
        category: category as string,
        limit: parseInt(limit as string)
      });

      res.json({
        success: true,
        data: trends
      });

    } catch (error) {
      logger.error('Trending searches failed', {
        period: req.query.period,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get trending searches'
      });
    }
  }
);

/**
 * @swagger
 * /api/search/analytics:
 *   post:
 *     summary: Log search analytics for ML training
 *     tags: [Enhanced Search]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [queryId, action]
 *             properties:
 *               queryId:
 *                 type: string
 *               resultId:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [click, view, bookmark, share]
 *               timeSpent:
 *                 type: number
 *                 minimum: 0
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Analytics logged
 */
router.post('/analytics',
  optionalAuthenticate,
  rateLimiter('search_analytics', { windowMs: 60 * 1000, max: 100 }), // 100 analytics events per minute
  validateRequest(analyticsSchema),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const analyticsData = {
        ...req.body,
        userId,
        timestamp: new Date(),
        userAgent: req.headers['user-agent'],
        ip: req.ip
      };

      await enhancedAISearchService.logSearchAnalytics(analyticsData);

      res.json({
        success: true,
        message: 'Analytics logged successfully'
      });

    } catch (error) {
      logger.error('Search analytics logging failed', {
        userId: req.user?.id,
        error: error.message
      });

      // Don't fail the request for analytics logging
      res.json({
        success: true,
        message: 'Analytics logging skipped'
      });
    }
  }
);

/**
 * @swagger
 * /api/search/filters:
 *   get:
 *     summary: Get available search filters and facets
 *     tags: [Enhanced Search]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [users, content, posts, streams]
 *     responses:
 *       200:
 *         description: Available filters retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     priceRanges:
 *                       type: array
 *                       items:
 *                         type: object
 *                     locations:
 *                       type: array
 *                       items:
 *                         type: string
 *                     languages:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/filters',
  rateLimiter('search_filters', { windowMs: 60 * 1000, max: 30 }), // 30 requests per minute
  async (req, res) => {
    try {
      const { type } = req.query;

      const filters = await enhancedAISearchService.getAvailableFilters({
        type: type as 'users' | 'content' | 'posts' | 'streams'
      });

      res.json({
        success: true,
        data: filters
      });

    } catch (error) {
      logger.error('Get search filters failed', {
        type: req.query.type,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get search filters'
      });
    }
  }
);

/**
 * @swagger
 * /api/search/saved:
 *   get:
 *     summary: Get user's saved searches
 *     tags: [Enhanced Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           minimum: 0
 *           default: 0
 *     responses:
 *       200:
 *         description: Saved searches retrieved
 */
router.get('/saved',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const { limit = 20, offset = 0 } = req.query;

      const savedSearches = await enhancedAISearchService.getUserSavedSearches(userId, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      res.json({
        success: true,
        data: savedSearches
      });

    } catch (error) {
      logger.error('Get saved searches failed', {
        userId: req.user?.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get saved searches'
      });
    }
  }
);

/**
 * @swagger
 * /api/search/saved:
 *   post:
 *     summary: Save a search query
 *     tags: [Enhanced Search]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [query, name]
 *             properties:
 *               query:
 *                 type: string
 *               name:
 *                 type: string
 *               filters:
 *                 type: object
 *               notifications:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Search saved
 */
router.post('/saved',
  authenticate,
  rateLimiter('save_search', { windowMs: 60 * 1000, max: 10 }), // 10 saves per minute
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const { query, name, filters, notifications = false } = req.body;

      const savedSearch = await enhancedAISearchService.saveSearch(userId, {
        query,
        name,
        filters,
        notifications
      });

      res.status(201).json({
        success: true,
        data: savedSearch
      });

    } catch (error) {
      logger.error('Save search failed', {
        userId: req.user?.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to save search'
      });
    }
  }
);

/**
 * @swagger
 * /api/search/saved/{id}:
 *   delete:
 *     summary: Delete a saved search
 *     tags: [Enhanced Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saved search deleted
 */
router.delete('/saved/:id',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await enhancedAISearchService.deleteSavedSearch(userId, id);

      res.json({
        success: true,
        message: 'Saved search deleted successfully'
      });

    } catch (error) {
      logger.error('Delete saved search failed', {
        userId: req.user?.id,
        searchId: req.params.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Failed to delete saved search'
      });
    }
  }
);

export default router;
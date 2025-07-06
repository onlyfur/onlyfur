import express from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { asyncHandler, ValidationError, AuthorizationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import { ReportReason, ReportStatus } from '@prisma/client';
import {
  autoModerateContent,
  createContentReport,
  getModerationQueue,
  takeModerationAction,
  getModerationStats
} from '../services/moderation';
import { createAuditLog, AuditActions, extractRequestInfo } from '../services/auditLog';

const router = express.Router();

// Validation schemas
const createReportSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  reason: z.nativeEnum(ReportReason),
  description: z.string().max(1000, 'Description too long').optional()
});

const moderationActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'remove_content', 'warn_user', 'suspend_user']),
  resolution: z.string().min(1, 'Resolution reason is required').max(500, 'Resolution too long'),
  metadata: z.record(z.any()).optional()
});

const moderationQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => Math.min(parseInt(val) || 20, 50)).optional(),
  status: z.nativeEnum(ReportStatus).optional(),
  reason: z.nativeEnum(ReportReason).optional()
});

const statsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

/**
 * @swagger
 * /api/moderation/reports:
 *   post:
 *     summary: Create a content report
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *               reason:
 *                 type: string
 *                 enum: [SPAM, HARASSMENT, INAPPROPRIATE_CONTENT, COPYRIGHT_VIOLATION, FRAUD, VIOLENCE, HATE_SPEECH, OTHER]
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Report created successfully
 */
router.post('/reports', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = createReportSchema.parse(req.body);

  const reportId = await createContentReport({
    ...validatedData,
    reporterId: userId
  });

  // Log report creation
  await createAuditLog({
    userId,
    action: AuditActions.REPORT_CREATE,
    resource: 'content_report',
    resourceId: reportId,
    newValues: validatedData,
    ...extractRequestInfo(req)
  });

  res.status(201).json({
    success: true,
    reportId,
    message: 'Content report created successfully'
  });
}));

/**
 * @swagger
 * /api/moderation/queue:
 *   get:
 *     summary: Get moderation queue (Admin only)
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 50
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, UNDER_REVIEW, RESOLVED, DISMISSED]
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *           enum: [SPAM, HARASSMENT, INAPPROPRIATE_CONTENT, COPYRIGHT_VIOLATION, FRAUD, VIOLENCE, HATE_SPEECH, OTHER]
 *     responses:
 *       200:
 *         description: Moderation queue retrieved successfully
 */
router.get('/queue', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const query = moderationQuerySchema.parse(req.query);

  const result = await getModerationQueue(
    query.page,
    query.limit,
    query.status,
    query.reason
  );

  res.json({
    success: true,
    ...result
  });
}));

/**
 * @swagger
 * /api/moderation/reports/{id}/action:
 *   post:
 *     summary: Take moderation action on a report (Admin only)
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject, remove_content, warn_user, suspend_user]
 *               resolution:
 *                 type: string
 *                 maxLength: 500
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Moderation action taken successfully
 */
router.post('/reports/:id/action', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const adminId = req.user!.userId;
  const reportId = req.params.id;
  const validatedData = moderationActionSchema.parse(req.body);

  await takeModerationAction({
    reportId,
    adminId,
    ...validatedData
  });

  res.json({
    success: true,
    message: 'Moderation action taken successfully'
  });
}));

/**
 * @swagger
 * /api/moderation/content/{id}/auto-moderate:
 *   post:
 *     summary: Auto-moderate content (Admin only)
 *     tags: [Moderation]
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
 *         description: Auto-moderation completed
 */
router.post('/content/:id/auto-moderate', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const contentId = req.params.id;

  // Get content details
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: {
      title: true,
      description: true,
      mediaUrl: true,
      type: true
    }
  });

  if (!content) {
    throw new ValidationError('Content not found');
  }

  const moderationResult = await autoModerateContent(contentId, {
    title: content.title,
    description: content.description,
    mediaUrl: content.mediaUrl,
    type: content.type
  });

  // Log auto-moderation
  await createAuditLog({
    adminId: req.user!.userId,
    action: AuditActions.ADMIN_CONTENT_MODERATE,
    resource: 'content',
    resourceId: contentId,
    metadata: {
      autoModeration: true,
      result: moderationResult
    },
    ...extractRequestInfo(req)
  });

  res.json({
    success: true,
    moderationResult
  });
}));

/**
 * @swagger
 * /api/moderation/stats:
 *   get:
 *     summary: Get moderation statistics (Admin only)
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Moderation statistics retrieved successfully
 */
router.get('/stats', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const query = statsQuerySchema.parse(req.query);

  const stats = await getModerationStats(
    query.startDate ? new Date(query.startDate) : undefined,
    query.endDate ? new Date(query.endDate) : undefined
  );

  res.json({
    success: true,
    stats
  });
}));

/**
 * @swagger
 * /api/moderation/reports/user/{userId}:
 *   get:
 *     summary: Get reports for a specific user (Admin only)
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: User reports retrieved successfully
 */
router.get('/reports/user/:userId', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const skip = (page - 1) * limit;

  // Get reports where user is either reporter or content creator
  const [reports, total] = await Promise.all([
    prisma.contentReport.findMany({
      where: {
        OR: [
          { reporterId: userId },
          { content: { creatorId: userId } }
        ]
      },
      include: {
        content: {
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                displayName: true
              }
            }
          }
        },
        reporter: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.contentReport.count({
      where: {
        OR: [
          { reporterId: userId },
          { content: { creatorId: userId } }
        ]
      }
    })
  ]);

  res.json({
    success: true,
    reports,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total
  });
}));

/**
 * @swagger
 * /api/moderation/users/{userId}/suspend:
 *   post:
 *     summary: Suspend user (Admin only)
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               days:
 *                 type: integer
 *                 default: 7
 *     responses:
 *       200:
 *         description: User suspended successfully
 */
router.post('/users/:userId/suspend', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const adminId = req.user!.userId;
  const targetUserId = req.params.userId;
  const { reason, days = 7 } = req.body;

  if (!reason) {
    throw new ValidationError('Suspension reason is required');
  }

  const suspensionEnd = new Date();
  suspensionEnd.setDate(suspensionEnd.getDate() + days);

  // Update user status
  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      isActive: false,
      lockedUntil: suspensionEnd
    }
  });

  // Log suspension
  await createAuditLog({
    adminId,
    action: AuditActions.ADMIN_ACTION,
    resource: 'user',
    resourceId: targetUserId,
    oldValues: { isActive: true, lockedUntil: null },
    newValues: { isActive: false, lockedUntil: suspensionEnd },
    metadata: { reason, days },
    ...extractRequestInfo(req)
  });

  res.json({
    success: true,
    message: `User suspended for ${days} days`
  });
}));

/**
 * @swagger
 * /api/moderation/users/{userId}/unsuspend:
 *   post:
 *     summary: Unsuspend user (Admin only)
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unsuspended successfully
 */
router.post('/users/:userId/unsuspend', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const adminId = req.user!.userId;
  const targetUserId = req.params.userId;

  // Update user status
  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      isActive: true,
      lockedUntil: null
    }
  });

  // Log unsuspension
  await createAuditLog({
    adminId,
    action: AuditActions.ADMIN_ACTION,
    resource: 'user',
    resourceId: targetUserId,
    oldValues: { isActive: false },
    newValues: { isActive: true, lockedUntil: null },
    metadata: { action: 'unsuspend' },
    ...extractRequestInfo(req)
  });

  res.json({
    success: true,
    message: 'User unsuspended successfully'
  });
}));

export default router;

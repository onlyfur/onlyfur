import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createNotification, NotificationTemplates } from './notifications';
import { createAuditLog, AuditActions } from './auditLog';
import { ReportReason, ReportStatus, NotificationType, NotificationPriority } from '@prisma/client';

export interface ContentModerationResult {
  isApproved: boolean;
  confidence: number;
  flags: string[];
  reason?: string;
}

export interface CreateReportData {
  contentId: string;
  reporterId: string;
  reason: ReportReason;
  description?: string;
}

export interface ModerationAction {
  reportId: string;
  adminId: string;
  action: 'approve' | 'reject' | 'remove_content' | 'warn_user' | 'suspend_user';
  resolution: string;
  metadata?: any;
}

/**
 * Auto-moderate content using various filters
 */
export async function autoModerateContent(
  contentId: string,
  content: {
    title: string;
    description?: string;
    mediaUrl?: string;
    type: string;
  }
): Promise<ContentModerationResult> {
  try {
    const flags: string[] = [];
    let confidence = 0;

    // Text content moderation
    const textFlags = await moderateText(content.title, content.description);
    flags.push(...textFlags);

    // Media content moderation (if applicable)
    if (content.mediaUrl) {
      const mediaFlags = await moderateMedia(content.mediaUrl, content.type);
      flags.push(...mediaFlags);
    }

    // Calculate confidence based on flags
    confidence = calculateModerationConfidence(flags);

    const isApproved = flags.length === 0 || confidence < 0.7;

    // Log moderation result
    logger.info('Content auto-moderation completed', {
      contentId,
      isApproved,
      confidence,
      flags
    });

    // If content is flagged, create a report for manual review
    if (!isApproved) {
      await createAutoModerationReport(contentId, flags, confidence);
    }

    return {
      isApproved,
      confidence,
      flags,
      reason: flags.length > 0 ? `Content flagged for: ${flags.join(', ')}` : undefined
    };

  } catch (error) {
    logger.error('Auto-moderation failed', { contentId, error: error.message });
    
    // Default to manual review if auto-moderation fails
    return {
      isApproved: false,
      confidence: 0,
      flags: ['auto_moderation_error'],
      reason: 'Content requires manual review due to moderation system error'
    };
  }
}

/**
 * Create a content report
 */
export async function createContentReport(data: CreateReportData): Promise<string> {
  try {
    // Check if content exists
    const content = await prisma.content.findUnique({
      where: { id: data.contentId },
      include: { creator: true }
    });

    if (!content) {
      throw new Error('Content not found');
    }

    // Check if user already reported this content
    const existingReport = await prisma.contentReport.findFirst({
      where: {
        contentId: data.contentId,
        reporterId: data.reporterId
      }
    });

    if (existingReport) {
      throw new Error('You have already reported this content');
    }

    // Create the report
    const report = await prisma.contentReport.create({
      data: {
        contentId: data.contentId,
        reporterId: data.reporterId,
        reason: data.reason,
        description: data.description
      }
    });

    // Notify content creator (if not self-reporting)
    if (content.creatorId !== data.reporterId) {
      await createNotification({
        userId: content.creatorId,
        type: NotificationType.CONTENT,
        title: 'Content Reported',
        message: `One of your posts has been reported and is under review.`,
        priority: NotificationPriority.HIGH,
        data: {
          contentId: data.contentId,
          reportId: report.id,
          reason: data.reason
        }
      });
    }

    // Notify admins for high-priority reasons
    if (isHighPriorityReason(data.reason)) {
      await notifyAdminsOfReport(report.id, data.reason);
    }

    // Log the report creation
    await createAuditLog({
      userId: data.reporterId,
      action: AuditActions.REPORT_CREATE,
      resource: 'content_report',
      resourceId: report.id,
      newValues: data
    });

    logger.info('Content report created', {
      reportId: report.id,
      contentId: data.contentId,
      reporterId: data.reporterId,
      reason: data.reason
    });

    return report.id;

  } catch (error) {
    logger.error('Failed to create content report', {
      contentId: data.contentId,
      reporterId: data.reporterId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Get reports for moderation queue
 */
export async function getModerationQueue(
  page: number = 1,
  limit: number = 20,
  status?: ReportStatus,
  reason?: ReportReason
) {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (status) where.status = status;
    if (reason) where.reason = reason;

    const [reports, total] = await Promise.all([
      prisma.contentReport.findMany({
        where,
        include: {
          content: {
            include: {
              creator: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true
                }
              }
            }
          },
          reporter: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.contentReport.count({ where })
    ]);

    return {
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    };

  } catch (error) {
    logger.error('Failed to get moderation queue', { error: error.message });
    throw error;
  }
}

/**
 * Take moderation action on a report
 */
export async function takeModerationAction(action: ModerationAction): Promise<void> {
  try {
    const { reportId, adminId, action: actionType, resolution, metadata } = action;

    // Get the report
    const report = await prisma.contentReport.findUnique({
      where: { id: reportId },
      include: {
        content: {
          include: { creator: true }
        },
        reporter: true
      }
    });

    if (!report) {
      throw new Error('Report not found');
    }

    // Update report status
    const newStatus = actionType === 'approve' ? ReportStatus.DISMISSED : ReportStatus.RESOLVED;
    
    await prisma.contentReport.update({
      where: { id: reportId },
      data: {
        status: newStatus,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        resolution
      }
    });

    // Take action based on decision
    switch (actionType) {
      case 'remove_content':
        await removeContent(report.content.id, adminId, resolution);
        break;
      
      case 'warn_user':
        await warnUser(report.content.creatorId, adminId, resolution);
        break;
      
      case 'suspend_user':
        await suspendUser(report.content.creatorId, adminId, resolution, metadata?.suspensionDays);
        break;
      
      case 'approve':
        // Content is approved, no action needed
        break;
      
      case 'reject':
        // Report is rejected, no action on content
        break;
    }

    // Notify relevant parties
    await notifyModerationDecision(report, actionType, resolution);

    // Log the moderation action
    await createAuditLog({
      adminId,
      action: AuditActions.ADMIN_CONTENT_MODERATE,
      resource: 'content_report',
      resourceId: reportId,
      oldValues: { status: report.status },
      newValues: { status: newStatus, action: actionType, resolution },
      metadata
    });

    logger.info('Moderation action taken', {
      reportId,
      adminId,
      action: actionType,
      contentId: report.contentId
    });

  } catch (error) {
    logger.error('Failed to take moderation action', {
      reportId: action.reportId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Get moderation statistics
 */
export async function getModerationStats(
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  dismissedReports: number;
  reportsByReason: Record<string, number>;
  averageResolutionTime: number;
}> {
  try {
    const where: any = {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Get report counts by status
    const [total, pending, resolved, dismissed] = await Promise.all([
      prisma.contentReport.count({ where }),
      prisma.contentReport.count({ where: { ...where, status: ReportStatus.PENDING } }),
      prisma.contentReport.count({ where: { ...where, status: ReportStatus.RESOLVED } }),
      prisma.contentReport.count({ where: { ...where, status: ReportStatus.DISMISSED } })
    ]);

    // Get reports by reason
    const reasonStats = await prisma.contentReport.groupBy({
      by: ['reason'],
      where,
      _count: {
        reason: true
      }
    });

    const reportsByReason = reasonStats.reduce((acc, stat) => {
      acc[stat.reason] = stat._count.reason;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average resolution time
    const resolvedReports = await prisma.contentReport.findMany({
      where: {
        ...where,
        status: { in: [ReportStatus.RESOLVED, ReportStatus.DISMISSED] },
        reviewedAt: { not: null }
      },
      select: {
        createdAt: true,
        reviewedAt: true
      }
    });

    const totalResolutionTime = resolvedReports.reduce((acc, report) => {
      const resolutionTime = report.reviewedAt!.getTime() - report.createdAt.getTime();
      return acc + resolutionTime;
    }, 0);

    const averageResolutionTime = resolvedReports.length > 0 
      ? totalResolutionTime / resolvedReports.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    return {
      totalReports: total,
      pendingReports: pending,
      resolvedReports: resolved,
      dismissedReports: dismissed,
      reportsByReason,
      averageResolutionTime
    };

  } catch (error) {
    logger.error('Failed to get moderation stats', { error: error.message });
    throw error;
  }
}

// Helper functions

async function moderateText(title: string, description?: string): Promise<string[]> {
  const flags: string[] = [];
  const text = `${title} ${description || ''}`.toLowerCase();

  // Simple keyword detection (in a real implementation, use ML services)
  const bannedKeywords = [
    'spam', 'scam', 'fraud', 'illegal', 'violence', 'hate',
    'harassment', 'abuse', 'inappropriate'
  ];

  const inappropriateKeywords = [
    'unauthorized', 'copyright', 'stolen', 'pirated'
  ];

  for (const keyword of bannedKeywords) {
    if (text.includes(keyword)) {
      flags.push('inappropriate_content');
      break;
    }
  }

  for (const keyword of inappropriateKeywords) {
    if (text.includes(keyword)) {
      flags.push('copyright_violation');
      break;
    }
  }

  return flags;
}

async function moderateMedia(mediaUrl: string, mediaType: string): Promise<string[]> {
  const flags: string[] = [];

  // TODO: Implement media moderation using services like:
  // - Google Vision API for image content
  // - AWS Rekognition for image/video analysis
  // - Microsoft Content Moderator
  
  // For now, return empty flags
  return flags;
}

function calculateModerationConfidence(flags: string[]): number {
  if (flags.length === 0) return 0;
  
  const flagWeights: Record<string, number> = {
    'inappropriate_content': 0.8,
    'copyright_violation': 0.9,
    'spam': 0.7,
    'harassment': 0.9,
    'violence': 0.95,
    'hate_speech': 0.95,
    'auto_moderation_error': 0.5
  };

  const maxWeight = Math.max(...flags.map(flag => flagWeights[flag] || 0.6));
  return maxWeight;
}

async function createAutoModerationReport(
  contentId: string,
  flags: string[],
  confidence: number
): Promise<void> {
  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!content) return;

    await prisma.contentReport.create({
      data: {
        contentId,
        reporterId: content.creatorId, // System report
        reason: ReportReason.OTHER,
        description: `Auto-flagged content: ${flags.join(', ')} (confidence: ${confidence.toFixed(2)})`,
        status: ReportStatus.PENDING
      }
    });

  } catch (error) {
    logger.error('Failed to create auto-moderation report', {
      contentId,
      flags,
      error: error.message
    });
  }
}

function isHighPriorityReason(reason: ReportReason): boolean {
  return [
    ReportReason.VIOLENCE,
    ReportReason.HATE_SPEECH,
    ReportReason.HARASSMENT,
    ReportReason.FRAUD
  ].includes(reason);
}

async function notifyAdminsOfReport(reportId: string, reason: ReportReason): Promise<void> {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    });

    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: NotificationType.SYSTEM,
        title: 'High Priority Report',
        message: `A ${reason.toLowerCase().replace('_', ' ')} report requires immediate attention.`,
        priority: NotificationPriority.URGENT,
        data: { reportId, reason }
      });
    }

  } catch (error) {
    logger.error('Failed to notify admins of report', { reportId, error: error.message });
  }
}

async function removeContent(contentId: string, adminId: string, reason: string): Promise<void> {
  await prisma.content.update({
    where: { id: contentId },
    data: { status: 'ARCHIVED' }
  });
  
  // Additional cleanup logic could go here
}

async function warnUser(userId: string, adminId: string, reason: string): Promise<void> {
  await createNotification({
    userId,
    type: NotificationType.SECURITY,
    title: 'Content Warning',
    message: `Your content has been flagged: ${reason}. Please review our community guidelines.`,
    priority: NotificationPriority.HIGH
  });
}

async function suspendUser(
  userId: string,
  adminId: string,
  reason: string,
  days: number = 7
): Promise<void> {
  const suspensionEnd = new Date();
  suspensionEnd.setDate(suspensionEnd.getDate() + days);

  await prisma.user.update({
    where: { id: userId },
    data: { 
      isActive: false,
      lockedUntil: suspensionEnd
    }
  });

  await createNotification({
    userId,
    type: NotificationType.SECURITY,
    title: 'Account Suspended',
    message: `Your account has been suspended for ${days} days. Reason: ${reason}`,
    priority: NotificationPriority.URGENT
  });
}

async function notifyModerationDecision(
  report: any,
  action: string,
  resolution: string
): Promise<void> {
  // Notify content creator
  if (action !== 'approve') {
    await createNotification({
      userId: report.content.creatorId,
      type: NotificationType.CONTENT,
      title: 'Moderation Decision',
      message: `Action taken on your reported content: ${resolution}`,
      priority: NotificationPriority.HIGH
    });
  }

  // Notify reporter
  await createNotification({
    userId: report.reporterId,
    type: NotificationType.SYSTEM,
    title: 'Report Update',
    message: `Your report has been reviewed: ${resolution}`,
    priority: NotificationPriority.NORMAL
  });
}

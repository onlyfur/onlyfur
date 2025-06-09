import { prisma } from './database';
import { logger } from '../middleware/logger';
import { AuditAction } from '@prisma/client';

export interface AuditLogData {
  userId?: string;
  adminId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export interface AuditLogQuery {
  userId?: string;
  adminId?: string;
  action?: AuditAction;
  resource?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        adminId: data.adminId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        oldValues: data.oldValues,
        newValues: data.newValues,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata
      }
    });

    logger.debug('Audit log created', {
      userId: data.userId,
      adminId: data.adminId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId
    });

  } catch (error) {
    logger.error('Failed to create audit log', {
      data,
      error: error.message
    });
    // Don't throw error to avoid disrupting main operations
  }
}

/**
 * Get audit logs with filtering and pagination
 */
export async function getAuditLogs(query: AuditLogQuery) {
  try {
    const {
      userId,
      adminId,
      action,
      resource,
      resourceId,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) where.userId = userId;
    if (adminId) where.adminId = adminId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (resourceId) where.resourceId = resourceId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              displayName: true
            }
          },
          admin: {
            select: {
              id: true,
              username: true,
              email: true,
              displayName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.auditLog.count({ where })
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    };

  } catch (error) {
    logger.error('Failed to get audit logs', { query, error: error.message });
    throw error;
  }
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStats(
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalLogs: number;
  actionBreakdown: Record<string, number>;
  resourceBreakdown: Record<string, number>;
  userBreakdown: Array<{ userId: string; username: string; count: number }>;
}> {
  try {
    const where: any = {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Get total count
    const totalLogs = await prisma.auditLog.count({ where });

    // Get action breakdown
    const actionStats = await prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: {
        action: true
      }
    });

    const actionBreakdown = actionStats.reduce((acc, stat) => {
      acc[stat.action] = stat._count.action;
      return acc;
    }, {} as Record<string, number>);

    // Get resource breakdown
    const resourceStats = await prisma.auditLog.groupBy({
      by: ['resource'],
      where,
      _count: {
        resource: true
      }
    });

    const resourceBreakdown = resourceStats.reduce((acc, stat) => {
      acc[stat.resource] = stat._count.resource;
      return acc;
    }, {} as Record<string, number>);

    // Get user breakdown (top 10 most active users)
    const userStats = await prisma.auditLog.groupBy({
      by: ['userId'],
      where: {
        ...where,
        userId: { not: null }
      },
      _count: {
        userId: true
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },
      take: 10
    });

    // Get user details for the stats
    const userIds = userStats.map(stat => stat.userId!);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true }
    });

    const userBreakdown = userStats.map(stat => {
      const user = users.find(u => u.id === stat.userId);
      return {
        userId: stat.userId!,
        username: user?.username || 'Unknown',
        count: stat._count.userId
      };
    });

    return {
      totalLogs,
      actionBreakdown,
      resourceBreakdown,
      userBreakdown
    };

  } catch (error) {
    logger.error('Failed to get audit log stats', { error: error.message });
    throw error;
  }
}

/**
 * Clean up old audit logs
 */
export async function cleanupOldAuditLogs(retentionDays: number = 90): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });

    logger.info('Old audit logs cleaned up', {
      deletedCount: result.count,
      retentionDays,
      cutoffDate
    });

    return result.count;

  } catch (error) {
    logger.error('Failed to cleanup old audit logs', {
      retentionDays,
      error: error.message
    });
    throw error;
  }
}

/**
 * Helper function to extract request information
 */
export function extractRequestInfo(req: any): { ipAddress?: string; userAgent?: string } {
  return {
    ipAddress: req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'],
    userAgent: req.headers['user-agent']
  };
}

// Predefined audit actions for common operations
export const AuditActions = {
  // User actions
  USER_REGISTER: AuditAction.CREATE,
  USER_LOGIN: AuditAction.LOGIN,
  USER_LOGOUT: AuditAction.LOGOUT,
  USER_UPDATE_PROFILE: AuditAction.UPDATE,
  USER_DELETE: AuditAction.DELETE,
  USER_PASSWORD_CHANGE: AuditAction.PASSWORD_CHANGE,
  USER_EMAIL_CHANGE: AuditAction.EMAIL_CHANGE,

  // Content actions
  CONTENT_CREATE: AuditAction.CONTENT_UPLOAD,
  CONTENT_UPDATE: AuditAction.UPDATE,
  CONTENT_DELETE: AuditAction.CONTENT_DELETE,
  CONTENT_PUBLISH: AuditAction.UPDATE,
  CONTENT_UNPUBLISH: AuditAction.UPDATE,

  // Subscription actions
  SUBSCRIPTION_CREATE: AuditAction.SUBSCRIPTION_CREATE,
  SUBSCRIPTION_CANCEL: AuditAction.SUBSCRIPTION_CANCEL,
  SUBSCRIPTION_UPDATE: AuditAction.UPDATE,

  // Payment actions
  PAYMENT_PROCESS: AuditAction.PAYMENT_PROCESS,
  PAYMENT_REFUND: AuditAction.UPDATE,

  // Message actions
  MESSAGE_SEND: AuditAction.MESSAGE_SEND,
  MESSAGE_DELETE: AuditAction.DELETE,

  // Admin actions
  ADMIN_USER_UPDATE: AuditAction.ADMIN_ACTION,
  ADMIN_USER_SUSPEND: AuditAction.ADMIN_ACTION,
  ADMIN_CONTENT_MODERATE: AuditAction.ADMIN_ACTION,
  ADMIN_SYSTEM_UPDATE: AuditAction.ADMIN_ACTION,

  // Report actions
  REPORT_CREATE: AuditAction.REPORT_CREATE,
  REPORT_RESOLVE: AuditAction.UPDATE,
  REPORT_DISMISS: AuditAction.UPDATE
};

// Helper functions for common audit log scenarios

export async function logUserAction(
  userId: string,
  action: AuditAction,
  resource: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any,
  req?: any
): Promise<void> {
  const requestInfo = req ? extractRequestInfo(req) : {};
  
  await createAuditLog({
    userId,
    action,
    resource,
    resourceId,
    oldValues,
    newValues,
    ...requestInfo
  });
}

export async function logAdminAction(
  adminId: string,
  action: AuditAction,
  resource: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any,
  req?: any
): Promise<void> {
  const requestInfo = req ? extractRequestInfo(req) : {};
  
  await createAuditLog({
    adminId,
    action,
    resource,
    resourceId,
    oldValues,
    newValues,
    ...requestInfo
  });
}

export async function logSystemAction(
  action: AuditAction,
  resource: string,
  resourceId?: string,
  metadata?: any
): Promise<void> {
  await createAuditLog({
    action,
    resource,
    resourceId,
    metadata
  });
}

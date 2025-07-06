import { prisma } from './database';
import { logger } from '../middleware/logger';
import { Request } from 'express';

export enum AuditActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SUBSCRIPTION_CREATE = 'SUBSCRIPTION_CREATE',
  SUBSCRIPTION_CANCEL = 'SUBSCRIPTION_CANCEL',
  PAYMENT_PROCESS = 'PAYMENT_PROCESS',
  CONTENT_UPLOAD = 'CONTENT_UPLOAD',
  CONTENT_DELETE = 'CONTENT_DELETE',
  USER_BAN = 'USER_BAN',
  USER_UNBAN = 'USER_UNBAN',
  ADMIN_ACTION = 'ADMIN_ACTION',
  MODERATION_ACTION = 'MODERATION_ACTION'
}

interface AuditLogData {
  userId?: string;
  adminId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export function extractRequestInfo(req: Request) {
  return {
    ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown'
  };
}

export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        adminId: data.adminId,
        action: data.action as any, // Cast to enum
        resource: data.resource,
        resourceId: data.resourceId,
        oldValues: data.oldValues,
        newValues: data.newValues,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata
      }
    });
  } catch (error) {
    logger.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking the main operation
  }
}

export async function getAuditLogs(
  filters: {
    userId?: string;
    adminId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
  },
  pagination: {
    page: number;
    limit: number;
  }
) {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  const whereClause: any = {};
  
  if (filters.userId) whereClause.userId = filters.userId;
  if (filters.adminId) whereClause.adminId = filters.adminId;
  if (filters.action) whereClause.action = filters.action;
  if (filters.resource) whereClause.resource = filters.resource;
  
  if (filters.startDate || filters.endDate) {
    whereClause.createdAt = {};
    if (filters.startDate) whereClause.createdAt.gte = filters.startDate;
    if (filters.endDate) whereClause.createdAt.lte = filters.endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true
          }
        },
        admin: {
          select: {
            id: true,
            email: true,
            displayName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    }),
    prisma.auditLog.count({
      where: whereClause
    })
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

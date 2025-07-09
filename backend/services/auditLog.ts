import { prisma } from './database';
import { logger } from '../middleware/logger';
import { Request } from 'express';
import * as crypto from 'crypto';

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
  MODERATION_ACTION = 'MODERATION_ACTION',
  // New admin user management actions
  VIEW_USER_CREDENTIALS = 'VIEW_USER_CREDENTIALS',
  VIEW_USER_DETAILS = 'VIEW_USER_DETAILS',
  UPDATE_USER = 'UPDATE_USER',
  RESET_USER_PASSWORD = 'RESET_USER_PASSWORD',
  DELETE_USER = 'DELETE_USER',
  ACTIVATE_USER = 'ACTIVATE_USER',
  DEACTIVATE_USER = 'DEACTIVATE_USER',
  VERIFY_USER = 'VERIFY_USER',
  UNVERIFY_USER = 'UNVERIFY_USER',
  EXPORT_USER_DATA = 'EXPORT_USER_DATA'
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
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        userId: data.userId || null,
        adminId: data.adminId || null,
        action: data.action as any, // Cast to enum
        resource: data.resource,
        resourceId: data.resourceId || null,
        oldValues: data.oldValues || null,
        newValues: data.newValues || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        metadata: data.metadata || null
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
    prisma.audit_logs.findMany({
      where: whereClause,
      include: {
        users_audit_logs_userIdTousers: {
          select: {
            id: true,
            email: true,
            displayName: true
          }
        },
        users_audit_logs_adminIdTousers: {
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
    prisma.audit_logs.count({
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

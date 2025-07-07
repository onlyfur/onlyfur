import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions, extractRequestInfo } from '../services/auditLog';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import * as crypto from 'crypto';

// Enhanced validation schemas for user credential management
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(128),
  sendNotification: z.boolean().default(true)
});

export const updateUserCredentialsSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().min(1).max(100).optional(),
  role: z.enum(['CREATOR', 'SUBSCRIBER', 'ADMIN']).optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  subscriptionStatus: z.enum(['FREE', 'ACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID', 'TRIALING', 'PAUSED', 'EXPIRED']).optional(),
  createdAt: z.string().datetime().optional()
});

export const bulkActionSchema = z.object({
  userIds: z.array(z.string()).min(1).max(100),
  action: z.enum(['activate', 'deactivate', 'verify', 'unverify', 'delete', 'reset_password']),
  reason: z.string().optional()
});

export interface UserCredentialsFilter {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserExportOptions {
  format?: 'csv' | 'json';
  fields?: string;
}

/**
 * Service class for managing user credentials and admin operations
 */
export class UserCredentialsService {
  
  /**
   * Get comprehensive user credentials with filtering and pagination
   */
  async getAllUserCredentials(filters: UserCredentialsFilter, adminId: string, req: Request) {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const offset = (page - 1) * Math.min(limit, 100);

    // Build where clause
    const whereClause: any = {};
    
    if (role) whereClause.role = role;
    if (isActive !== undefined) whereClause.isActive = isActive;
    
    if (search) {
      whereClause.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          isVerified: true,
          isActive: true,
          isEmailVerified: true,
          authProvider: true,
          googleId: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          lastActivityAt: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          failedLoginAttempts: true,
          lockedUntil: true,
          isTwoFactorEnabled: true,
          stripeCustomerId: true,
          subscriberCount: true,
          followersCount: true,
          followingCount: true,
          contentCount: true,
          categories: true,
          tags: true,
          website: true,
          twitter: true,
          instagram: true,
          bio: true,
          coverImage: true,
          timezone: true,
          preferredLanguage: true,
          emailNotifications: true,
          pushNotifications: true,
          marketingEmails: true,
          _count: {
            select: {
              content: true,
              subscriptions: true,
              payment_intents: true,
              audit_logs_audit_logs_userIdTousers: true
            }
          }
        },
        orderBy,
        skip: offset,
        take: Math.min(limit, 100)
      }),
      prisma.users.count({ where: whereClause })
    ]);

    // Create audit log for accessing user credentials
    await createAuditLog({
      adminId,
      action: AuditActions.VIEW_USER_CREDENTIALS,
      resource: 'users',
      metadata: {
        searchQuery: search,
        filters: { role, isActive },
        userCount: users.length,
        requestInfo: extractRequestInfo(req)
      }
    });

    const metadata = {
      totalActiveUsers: await prisma.users.count({ where: { isActive: true } }),
      totalVerifiedUsers: await prisma.users.count({ where: { isVerified: true } }),
      totalCreators: await prisma.users.count({ where: { role: 'CREATOR' } }),
      totalSubscribers: await prisma.users.count({ where: { role: 'SUBSCRIBER' } }),
      totalAdmins: await prisma.users.count({ where: { role: 'ADMIN' } })
    };

    return {
      users,
      pagination: {
        page,
        limit: Math.min(limit, 100),
        total,
        pages: Math.ceil(total / Math.min(limit, 100))
      },
      metadata
    };
  }

  /**
   * Get detailed user credentials and activity
   */
  async getUserCredentialDetails(userId: string, adminId: string, req: Request) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            viewsCount: true,
            likesCount: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        subscriptions: {
          select: {
            id: true,
            createdAt: true,
            status: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        payment_intents: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        audit_logs_audit_logs_userIdTousers: {
          select: {
            id: true,
            action: true,
            resource: true,
            createdAt: true,
            ipAddress: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Create audit log for viewing detailed user credentials
    await createAuditLog({
      adminId,
      action: AuditActions.VIEW_USER_DETAILS,
      resource: 'user',
      resourceId: userId,
      metadata: {
        viewedUser: {
          email: user.email,
          username: user.username,
          role: user.role
        },
        requestInfo: extractRequestInfo(req)
      }
    });

    return {
      user,
      stats: {
        totalContent: user.content?.length || 0,
        totalSubscriptions: user.subscriptions?.length || 0,
        totalPayments: user.payment_intents?.length || 0,
        totalAuditLogs: user.audit_logs_audit_logs_userIdTousers?.length || 0
      }
    };
  }

  /**
   * Update user credentials and profile data
   */
  async updateUserCredentials(userId: string, updateData: any, adminId: string, req: Request) {
    const validatedData = updateUserCredentialsSchema.parse(updateData);

    // Get current user data for audit log
    const currentUser = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        email: true,
        username: true,
        displayName: true,
        role: true,
        isVerified: true,
        isActive: true,
        subscriptionStatus: true,
        createdAt: true
      }
    });

    if (!currentUser) {
      throw new NotFoundError('User not found');
    }

    // Check for unique constraints if updating email or username
    if (validatedData.email && validatedData.email !== currentUser.email) {
      const existingEmail = await prisma.users.findUnique({
        where: { email: validatedData.email }
      });
      if (existingEmail) {
        throw new ValidationError('Email already exists');
      }
    }

    if (validatedData.username && validatedData.username !== currentUser.username) {
      const existingUsername = await prisma.users.findUnique({
        where: { username: validatedData.username }
      });
      if (existingUsername) {
        throw new ValidationError('Username already exists');
      }
    }

    // Prepare update data
    const dbUpdateData: any = { ...validatedData };
    
    // Handle createdAt modification (admin can backdate accounts)
    if (validatedData.createdAt) {
      dbUpdateData.createdAt = new Date(validatedData.createdAt);
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: dbUpdateData,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        isVerified: true,
        isActive: true,
        subscriptionStatus: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Create audit log
    await createAuditLog({
      adminId,
      action: AuditActions.UPDATE_USER,
      resource: 'user',
      resourceId: userId,
      oldValues: currentUser,
      newValues: updatedUser,
      metadata: {
        modifiedFields: Object.keys(validatedData),
        requestInfo: extractRequestInfo(req)
      }
    });

    return updatedUser;
  }

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string, passwordData: any, adminId: string, req: Request) {
    const { newPassword, sendNotification = true } = resetPasswordSchema.parse(passwordData);

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, displayName: true }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Hash the new password using crypto
    const hashedPassword = crypto.pbkdf2Sync(newPassword, 'salt', 100000, 64, 'sha512').toString('hex');

    // Update password and clear any existing reset tokens
    await prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date()
      }
    });

    // Create audit log
    await createAuditLog({
      adminId,
      action: AuditActions.RESET_USER_PASSWORD,
      resource: 'user',
      resourceId: userId,
      metadata: {
        targetUser: {
          email: user.email,
          username: user.username
        },
        sentNotification: sendNotification,
        requestInfo: extractRequestInfo(req)
      }
    });

    // TODO: Send notification email if requested
    if (sendNotification) {
      logger.info(`Password reset notification should be sent to ${user.email}`);
    }

    return { success: true, message: 'Password reset successfully' };
  }

  /**
   * Delete user account permanently
   */
  async deleteUserAccount(userId: string, adminId: string, req: Request) {
    // Prevent self-deletion
    if (userId === adminId) {
      throw new ValidationError('Cannot delete your own account');
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        _count: {
          select: {
            content: true,
            subscriptions: true,
            payment_intents: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent deletion of other admins without explicit confirmation
    if (user.role === 'ADMIN') {
      throw new ValidationError('Cannot delete admin accounts through this endpoint');
    }

    // Create audit log before deletion
    await createAuditLog({
      adminId,
      action: AuditActions.DELETE_USER,
      resource: 'user',
      resourceId: userId,
      oldValues: user,
      metadata: {
        deletedUserStats: user._count,
        requestInfo: extractRequestInfo(req)
      }
    });

    // Delete user (cascade will handle related records)
    await prisma.users.delete({
      where: { id: userId }
    });

    return { success: true, message: 'User account deleted successfully' };
  }

  /**
   * Perform bulk actions on multiple users
   */
  async performBulkAction(actionData: any, adminId: string, req: Request) {
    const { userIds, action, reason } = bulkActionSchema.parse(actionData);

    // Prevent actions on admin's own account
    if (userIds.includes(adminId)) {
      throw new ValidationError('Cannot perform bulk actions on your own account');
    }

    // Get users for audit logging
    const users = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, username: true, role: true }
    });

    let updateData: any = {};
    let auditAction: string = '';

    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        auditAction = AuditActions.ACTIVATE_USER;
        break;
      case 'deactivate':
        updateData = { isActive: false };
        auditAction = AuditActions.DEACTIVATE_USER;
        break;
      case 'verify':
        updateData = { isVerified: true, isEmailVerified: true };
        auditAction = AuditActions.VERIFY_USER;
        break;
      case 'unverify':
        updateData = { isVerified: false };
        auditAction = AuditActions.UNVERIFY_USER;
        break;
      case 'delete':
        // Prevent deletion of admins
        const adminUsers = users.filter(u => u.role === 'ADMIN');
        if (adminUsers.length > 0) {
          throw new ValidationError('Cannot bulk delete admin accounts');
        }
        break;
      case 'reset_password':
        throw new ValidationError('Bulk password reset not implemented. Use individual reset.');
      default:
        throw new ValidationError('Invalid bulk action');
    }

    let result: any = {};

    if (action === 'delete') {
      // Create audit logs before deletion
      for (const user of users) {
        await createAuditLog({
          adminId,
          action: AuditActions.DELETE_USER,
          resource: 'user',
          resourceId: user.id,
          oldValues: user,
          metadata: {
            bulkAction: true,
            reason,
            requestInfo: extractRequestInfo(req)
          }
        });
      }

      result = await prisma.users.deleteMany({
        where: { id: { in: userIds } }
      });
    } else {
      result = await prisma.users.updateMany({
        where: { id: { in: userIds } },
        data: updateData
      });

      // Create audit logs for updates
      for (const user of users) {
        await createAuditLog({
          adminId,
          action: auditAction,
          resource: 'user',
          resourceId: user.id,
          metadata: {
            bulkAction: true,
            reason,
            targetUser: user,
            requestInfo: extractRequestInfo(req)
          }
        });
      }
    }

    return {
      success: true,
      message: `Bulk ${action} completed successfully`,
      affectedUsers: result.count || userIds.length
    };
  }

  /**
   * Export user data to CSV or JSON
   */
  async exportUserData(options: UserExportOptions, adminId: string, req: Request) {
    const { format = 'csv', fields } = options;

    // Define exportable fields for security
    const allowedFields = [
      'id', 'email', 'username', 'displayName', 'role', 'isVerified', 'isActive',
      'createdAt', 'updatedAt', 'lastLoginAt', 'subscriptionStatus', 'subscriberCount',
      'contentCount', 'followersCount', 'authProvider'
    ];

    const selectedFields = fields ? 
      fields.split(',').filter(f => allowedFields.includes(f.trim())) : 
      allowedFields;

    // Build select object
    const selectObj: any = {};
    selectedFields.forEach(field => {
      selectObj[field] = true;
    });

    const users = await prisma.users.findMany({
      select: selectObj,
      orderBy: { createdAt: 'desc' }
    });

    // Create audit log
    await createAuditLog({
      adminId,
      action: AuditActions.EXPORT_USER_DATA,
      resource: 'users',
      metadata: {
        format,
        fields: selectedFields,
        userCount: users.length,
        requestInfo: extractRequestInfo(req)
      }
    });

    return {
      users,
      format,
      fields: selectedFields,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Generate CSV string from user data
   */
  generateCSV(users: any[], fields: string[]): string {
    const headers = fields.join(',');
    const rows = users.map(user => 
      fields.map(field => {
        const value = user[field];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return String(value);
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}

export const userCredentialsService = new UserCredentialsService();

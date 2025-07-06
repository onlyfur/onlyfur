import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createNotification, NotificationTemplates } from './notifications';
import { createAuditLog, AuditActions } from './auditLog';
import { NotificationType, NotificationPriority } from '@prisma/client';

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  blacklistedPasswords: string[];
}

export interface LoginAttempt {
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  userId?: string;
  email?: string;
  timestamp: Date;
  failureReason?: string;
}

export interface SecurityAlert {
  userId: string;
  type: 'suspicious_login' | 'password_change' | 'account_locked' | 'unusual_activity';
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

// Default password policy
const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  blacklistedPasswords: [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]
};

/**
 * Validate password against security policy
 */
export async function validatePassword(
  password: string, 
  email?: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): Promise<{
  isValid: boolean;
  errors: string[];
  score: number;
}> {
  const errors: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  } else {
    score += 20;
  }

  // Check uppercase letters
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 15;
  }

  // Check lowercase letters
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 15;
  }

  // Check numbers
  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/\d/.test(password)) {
    score += 15;
  }

  // Check special characters
  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 15;
  }

  // Check against blacklisted passwords
  if (policy.blacklistedPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common and not allowed');
  }

  // Check if password contains email
  if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
    errors.push('Password cannot contain your email address');
    score -= 10;
  }

  // Additional security checks
  if (password.length >= 12) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  if (password.length >= 16) score += 10;

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.max(score, 0)
  };
}

/**
 * Track login attempt
 */
export async function trackLoginAttempt(attempt: LoginAttempt): Promise<void> {
  try {
    // Log the attempt
    logger.info('Login attempt tracked', {
      ipAddress: attempt.ipAddress,
      success: attempt.success,
      userId: attempt.userId,
      email: attempt.email,
      failureReason: attempt.failureReason
    });

    // If failed login, check for suspicious activity
    if (!attempt.success) {
      await checkForSuspiciousActivity(attempt);
    }

    // If successful login, check for unusual location/device
    if (attempt.success && attempt.userId) {
      await checkForUnusualLogin(attempt);
    }

  } catch (error) {
    logger.error('Failed to track login attempt', {
      attempt,
      error: error.message
    });
  }
}

/**
 * Check if user account should be locked due to failed attempts
 */
export async function checkAccountLockout(
  identifier: string, // email or IP
  type: 'email' | 'ip' = 'email'
): Promise<{
  isLocked: boolean;
  lockoutTime?: Date;
  attemptsRemaining?: number;
}> {
  try {
    const maxAttempts = 5;
    const lockoutDuration = 30 * 60 * 1000; // 30 minutes
    const timeWindow = 15 * 60 * 1000; // 15 minutes

    const since = new Date(Date.now() - timeWindow);

    let user;
    if (type === 'email') {
      user = await prisma.user.findUnique({
        where: { email: identifier },
        select: {
          id: true,
          loginAttempts: true,
          lockedUntil: true
        }
      });

      if (!user) {
        return { isLocked: false };
      }

      // Check if account is currently locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        return {
          isLocked: true,
          lockoutTime: user.lockedUntil
        };
      }

      // Check recent failed attempts
      if (user.loginAttempts >= maxAttempts) {
        const lockoutTime = new Date(Date.now() + lockoutDuration);
        
        await prisma.user.update({
          where: { email: identifier },
          data: {
            lockedUntil: lockoutTime,
            loginAttempts: 0
          }
        });

        // Send security alert
        await sendSecurityAlert({
          userId: user.id,
          type: 'account_locked',
          description: `Account locked due to ${maxAttempts} failed login attempts`
        });

        return {
          isLocked: true,
          lockoutTime
        };
      }

      return {
        isLocked: false,
        attemptsRemaining: maxAttempts - user.loginAttempts
      };
    }

    // For IP-based checking, we'd need to implement rate limiting logic
    // This could be stored in Redis or a similar cache
    return { isLocked: false };

  } catch (error) {
    logger.error('Failed to check account lockout', {
      identifier,
      type,
      error: error.message
    });
    return { isLocked: false };
  }
}

/**
 * Increment failed login attempts
 */
export async function incrementFailedAttempts(email: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: { increment: 1 }
      }
    });

  } catch (error) {
    logger.error('Failed to increment failed attempts', {
      email,
      error: error.message
    });
  }
}

/**
 * Reset failed login attempts on successful login
 */
export async function resetFailedAttempts(email: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date()
      }
    });

  } catch (error) {
    logger.error('Failed to reset failed attempts', {
      email,
      error: error.message
    });
  }
}

/**
 * Generate secure password reset token
 */
export async function generatePasswordResetToken(email: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return null;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token (in a real implementation, you'd have a password_reset_tokens table)
    // For now, we'll use the user preferences
    await prisma.userPreference.upsert({
      where: {
        userId_category_key: {
          userId: user.id,
          category: 'password_reset',
          key: 'token'
        }
      },
      create: {
        userId: user.id,
        category: 'password_reset',
        key: 'token',
        value: JSON.stringify({ token, expiresAt })
      },
      update: {
        value: JSON.stringify({ token, expiresAt })
      }
    });

    logger.info('Password reset token generated', {
      userId: user.id,
      email
    });

    return token;

  } catch (error) {
    logger.error('Failed to generate password reset token', {
      email,
      error: error.message
    });
    return null;
  }
}

/**
 * Validate password reset token
 */
export async function validatePasswordResetToken(token: string): Promise<string | null> {
  try {
    // Find user with this token
    const preference = await prisma.userPreference.findFirst({
      where: {
        category: 'password_reset',
        key: 'token',
        value: { contains: token }
      },
      include: {
        user: true
      }
    });

    if (!preference) {
      return null;
    }

    const tokenData = JSON.parse(preference.value);
    if (tokenData.token !== token || new Date(tokenData.expiresAt) < new Date()) {
      return null;
    }

    return preference.userId;

  } catch (error) {
    logger.error('Failed to validate password reset token', {
      token: token.substring(0, 10) + '...',
      error: error.message
    });
    return null;
  }
}

/**
 * Send security alert to user
 */
export async function sendSecurityAlert(alert: SecurityAlert): Promise<void> {
  try {
    await createNotification({
      userId: alert.userId,
      type: NotificationType.SECURITY,
      title: getSecurityAlertTitle(alert.type),
      message: alert.description,
      priority: NotificationPriority.HIGH,
      data: {
        alertType: alert.type,
        ipAddress: alert.ipAddress,
        userAgent: alert.userAgent,
        metadata: alert.metadata
      }
    });

    // Also log to audit trail
    await createAuditLog({
      userId: alert.userId,
      action: AuditActions.USER_LOGIN,
      resource: 'security_alert',
      resourceId: alert.userId,
      metadata: alert
    });

    logger.warn('Security alert sent', {
      userId: alert.userId,
      type: alert.type,
      description: alert.description
    });

  } catch (error) {
    logger.error('Failed to send security alert', {
      alert,
      error: error.message
    });
  }
}

/**
 * Check for suspicious login activity
 */
async function checkForSuspiciousActivity(attempt: LoginAttempt): Promise<void> {
  if (!attempt.email) return;

  try {
    const user = await prisma.user.findUnique({
      where: { email: attempt.email },
      select: { id: true }
    });

    if (!user) return;

    // Check for multiple failed attempts from same IP
    const recentFailedAttempts = await getRecentFailedAttempts(attempt.ipAddress);
    
    if (recentFailedAttempts >= 3) {
      await sendSecurityAlert({
        userId: user.id,
        type: 'suspicious_login',
        description: `Multiple failed login attempts detected from IP ${attempt.ipAddress}`,
        ipAddress: attempt.ipAddress,
        userAgent: attempt.userAgent
      });
    }

  } catch (error) {
    logger.error('Failed to check suspicious activity', {
      attempt,
      error: error.message
    });
  }
}

/**
 * Check for unusual login patterns
 */
async function checkForUnusualLogin(attempt: LoginAttempt): Promise<void> {
  if (!attempt.userId) return;

  try {
    // Get user's recent sessions to check for unusual patterns
    const recentSessions = await prisma.userSession.findMany({
      where: {
        userId: attempt.userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      select: {
        ipAddress: true,
        location: true,
        device: true
      }
    });

    const knownIPs = new Set(recentSessions.map(s => s.ipAddress).filter(Boolean));
    const knownLocations = new Set(recentSessions.map(s => s.location).filter(Boolean));

    // Check if this is a new IP or location
    if (!knownIPs.has(attempt.ipAddress)) {
      await sendSecurityAlert({
        userId: attempt.userId,
        type: 'suspicious_login',
        description: `Login from new IP address: ${attempt.ipAddress}`,
        ipAddress: attempt.ipAddress,
        userAgent: attempt.userAgent
      });
    }

  } catch (error) {
    logger.error('Failed to check unusual login', {
      attempt,
      error: error.message
    });
  }
}

/**
 * Get recent failed attempts count for an IP
 */
async function getRecentFailedAttempts(ipAddress: string): Promise<number> {
  // In a real implementation, this would query a rate limiting store
  // For now, return a placeholder
  return 0;
}

/**
 * Get security alert title based on type
 */
function getSecurityAlertTitle(type: SecurityAlert['type']): string {
  switch (type) {
    case 'suspicious_login':
      return 'Suspicious Login Activity';
    case 'password_change':
      return 'Password Changed';
    case 'account_locked':
      return 'Account Locked';
    case 'unusual_activity':
      return 'Unusual Account Activity';
    default:
      return 'Security Alert';
  }
}

/**
 * Generate secure hash for passwords
 */
export async function hashPassword(password: string): Promise<string> {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  return await bcrypt.hash(password, rounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate secure random string
 */
export function generateSecureRandom(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate secure API key
 */
export function generateApiKey(): string {
  const prefix = 'of_'; // OnlyFur prefix
  const random = crypto.randomBytes(32).toString('hex');
  return prefix + random;
}

/**
 * Hash API key for storage
 */
export async function hashApiKey(apiKey: string): Promise<string> {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Check if IP is in whitelist/blacklist
 */
export async function checkIPRestrictions(ipAddress: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  try {
    // Get IP restrictions from system settings
    const settings = await prisma.systemSettings.findMany({
      where: {
        category: 'security',
        key: { in: ['ip_whitelist', 'ip_blacklist'] }
      }
    });

    const whitelist = settings.find(s => s.key === 'ip_whitelist')?.value;
    const blacklist = settings.find(s => s.key === 'ip_blacklist')?.value;

    // Check blacklist first
    if (blacklist) {
      const blacklistedIPs = JSON.parse(blacklist);
      if (blacklistedIPs.includes(ipAddress)) {
        return {
          allowed: false,
          reason: 'IP address is blacklisted'
        };
      }
    }

    // Check whitelist if it exists
    if (whitelist) {
      const whitelistedIPs = JSON.parse(whitelist);
      if (!whitelistedIPs.includes(ipAddress)) {
        return {
          allowed: false,
          reason: 'IP address not in whitelist'
        };
      }
    }

    return { allowed: true };

  } catch (error) {
    logger.error('Failed to check IP restrictions', {
      ipAddress,
      error: error.message
    });
    return { allowed: true }; // Default to allowing if check fails
  }
}

/**
 * Get security metrics for admin dashboard
 */
export async function getSecurityMetrics(days: number = 7): Promise<{
  totalLoginAttempts: number;
  failedLoginAttempts: number;
  successfulLogins: number;
  accountsLocked: number;
  securityAlerts: number;
  topFailedIPs: Array<{ ip: string; count: number }>;
}> {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get locked accounts
    const accountsLocked = await prisma.user.count({
      where: {
        lockedUntil: { gt: new Date() }
      }
    });

    // Get security-related audit logs
    const securityLogs = await prisma.auditLog.count({
      where: {
        createdAt: { gte: since },
        action: { in: ['LOGIN', 'PASSWORD_CHANGE'] }
      }
    });

    // Get recent notifications of security type
    const securityAlerts = await prisma.notification.count({
      where: {
        createdAt: { gte: since },
        type: 'SECURITY'
      }
    });

    return {
      totalLoginAttempts: 0, // Would need login attempt tracking
      failedLoginAttempts: 0,
      successfulLogins: 0,
      accountsLocked,
      securityAlerts,
      topFailedIPs: [] // Would need IP tracking
    };

  } catch (error) {
    logger.error('Failed to get security metrics', {
      days,
      error: error.message
    });
    return {
      totalLoginAttempts: 0,
      failedLoginAttempts: 0,
      successfulLogins: 0,
      accountsLocked: 0,
      securityAlerts: 0,
      topFailedIPs: []
    };
  }
}

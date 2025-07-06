import crypto from 'crypto';
import { prisma } from './database';
import { logger } from '../middleware/logger';

export interface CreateSessionData {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  device?: string;
  expiresAt: Date;
}

export interface SessionInfo {
  id: string;
  userId: string;
  sessionToken: string;
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  device?: string;
  isActive: boolean;
  lastActivity: Date;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Create a new user session
 */
export async function createSession(data: CreateSessionData): Promise<{
  sessionToken: string;
  refreshToken: string;
  sessionId: string;
}> {
  try {
    const sessionToken = generateSecureToken();
    const refreshToken = generateSecureToken();

    const session = await prisma.userSession.create({
      data: {
        userId: data.userId,
        sessionToken,
        refreshToken,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        location: data.location,
        device: data.device,
        expiresAt: data.expiresAt,
        isActive: true,
        lastActivity: new Date()
      }
    });

    logger.info('Session created', {
      sessionId: session.id,
      userId: data.userId,
      ipAddress: data.ipAddress
    });

    return {
      sessionToken,
      refreshToken,
      sessionId: session.id
    };

  } catch (error) {
    logger.error('Failed to create session', {
      userId: data.userId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Validate session token
 */
export async function validateSession(sessionToken: string): Promise<SessionInfo | null> {
  try {
    const session = await prisma.userSession.findUnique({
      where: { sessionToken }
    });

    if (!session) {
      return null;
    }

    if (!session.isActive || session.expiresAt < new Date()) {
      await invalidateSession(sessionToken);
      return null;
    }

    // Update last activity
    await updateSessionActivity(session.id);

    return {
      id: session.id,
      userId: session.userId,
      sessionToken: session.sessionToken,
      refreshToken: session.refreshToken || '',
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      location: session.location,
      device: session.device,
      isActive: session.isActive,
      lastActivity: session.lastActivity,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt
    };

  } catch (error) {
    logger.error('Failed to validate session', {
      sessionToken: sessionToken.substring(0, 10) + '...',
      error: error.message
    });
    return null;
  }
}

/**
 * Refresh session with new tokens
 */
export async function refreshSession(refreshToken: string): Promise<{
  sessionToken: string;
  refreshToken: string;
  expiresAt: Date;
} | null> {
  try {
    const session = await prisma.userSession.findUnique({
      where: { refreshToken }
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return null;
    }

    const newSessionToken = generateSecureToken();
    const newRefreshToken = generateSecureToken();
    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + 24); // 24 hours

    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        sessionToken: newSessionToken,
        refreshToken: newRefreshToken,
        expiresAt: newExpiresAt,
        lastActivity: new Date()
      }
    });

    logger.info('Session refreshed', {
      sessionId: session.id,
      userId: session.userId
    });

    return {
      sessionToken: newSessionToken,
      refreshToken: newRefreshToken,
      expiresAt: newExpiresAt
    };

  } catch (error) {
    logger.error('Failed to refresh session', {
      refreshToken: refreshToken.substring(0, 10) + '...',
      error: error.message
    });
    return null;
  }
}

/**
 * Invalidate a session
 */
export async function invalidateSession(sessionToken: string): Promise<void> {
  try {
    await prisma.userSession.updateMany({
      where: { sessionToken },
      data: {
        isActive: false,
        lastActivity: new Date()
      }
    });

    logger.debug('Session invalidated', {
      sessionToken: sessionToken.substring(0, 10) + '...'
    });

  } catch (error) {
    logger.error('Failed to invalidate session', {
      sessionToken: sessionToken.substring(0, 10) + '...',
      error: error.message
    });
  }
}

/**
 * Invalidate all sessions for a user
 */
export async function invalidateAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
  try {
    const where: any = { userId, isActive: true };
    if (exceptSessionId) {
      where.id = { not: exceptSessionId };
    }

    const result = await prisma.userSession.updateMany({
      where,
      data: {
        isActive: false,
        lastActivity: new Date()
      }
    });

    logger.info('All user sessions invalidated', {
      userId,
      exceptSessionId,
      invalidatedCount: result.count
    });

  } catch (error) {
    logger.error('Failed to invalidate all user sessions', {
      userId,
      error: error.message
    });
  }
}

/**
 * Get active sessions for a user
 */
export async function getUserSessions(userId: string): Promise<SessionInfo[]> {
  try {
    const sessions = await prisma.userSession.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: new Date() }
      },
      orderBy: { lastActivity: 'desc' }
    });

    return sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      sessionToken: session.sessionToken,
      refreshToken: session.refreshToken || '',
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      location: session.location,
      device: session.device,
      isActive: session.isActive,
      lastActivity: session.lastActivity,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt
    }));

  } catch (error) {
    logger.error('Failed to get user sessions', {
      userId,
      error: error.message
    });
    return [];
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.userSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isActive: false }
        ]
      }
    });

    logger.info('Expired sessions cleaned up', {
      deletedCount: result.count
    });

    return result.count;

  } catch (error) {
    logger.error('Failed to cleanup expired sessions', {
      error: error.message
    });
    return 0;
  }
}

/**
 * Update session last activity
 */
export async function updateSessionActivity(sessionId: string): Promise<void> {
  try {
    await prisma.userSession.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() }
    });

  } catch (error) {
    // Don't log errors for activity updates to avoid spam
  }
}

/**
 * Get session statistics
 */
export async function getSessionStats(): Promise<{
  totalActive: number;
  totalToday: number;
  totalThisWeek: number;
  averageSessionTime: number;
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
}> {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get active sessions count
    const totalActive = await prisma.userSession.count({
      where: {
        isActive: true,
        expiresAt: { gt: now }
      }
    });

    // Get today's sessions
    const totalToday = await prisma.userSession.count({
      where: {
        createdAt: { gte: today }
      }
    });

    // Get this week's sessions
    const totalThisWeek = await prisma.userSession.count({
      where: {
        createdAt: { gte: weekAgo }
      }
    });

    // Calculate average session time
    const recentSessions = await prisma.userSession.findMany({
      where: {
        isActive: false,
        createdAt: { gte: weekAgo }
      },
      select: {
        createdAt: true,
        lastActivity: true
      }
    });

    const totalSessionTime = recentSessions.reduce((total, session) => {
      const sessionTime = session.lastActivity.getTime() - session.createdAt.getTime();
      return total + sessionTime;
    }, 0);

    const averageSessionTime = recentSessions.length > 0 
      ? totalSessionTime / recentSessions.length / (1000 * 60) // Convert to minutes
      : 0;

    // Get device breakdown
    const deviceStats = await prisma.userSession.groupBy({
      by: ['device'],
      where: {
        createdAt: { gte: weekAgo },
        device: { not: null }
      },
      _count: true
    });

    const deviceBreakdown = deviceStats.reduce((acc, stat) => {
      acc[stat.device || 'Unknown'] = stat._count;
      return acc;
    }, {} as Record<string, number>);

    // Get location breakdown
    const locationStats = await prisma.userSession.groupBy({
      by: ['location'],
      where: {
        createdAt: { gte: weekAgo },
        location: { not: null }
      },
      _count: true
    });

    const locationBreakdown = locationStats.reduce((acc, stat) => {
      acc[stat.location || 'Unknown'] = stat._count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalActive,
      totalToday,
      totalThisWeek,
      averageSessionTime,
      deviceBreakdown,
      locationBreakdown
    };

  } catch (error) {
    logger.error('Failed to get session stats', { error: error.message });
    return {
      totalActive: 0,
      totalToday: 0,
      totalThisWeek: 0,
      averageSessionTime: 0,
      deviceBreakdown: {},
      locationBreakdown: {}
    };
  }
}

// Helper functions

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function parseUserAgent(userAgent: string): {
  device: string;
  browser: string;
  os: string;
} {
  const ua = userAgent.toLowerCase();
  
  // Detect device
  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  
  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return { device, browser, os };
}

export function getLocationFromIP(ipAddress: string): Promise<string> {
  // TODO: Implement IP geolocation using a service like:
  // - MaxMind GeoIP2
  // - IPinfo
  // - IP-API
  
  // For now, return a placeholder
  return Promise.resolve('Unknown');
}

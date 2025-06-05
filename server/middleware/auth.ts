import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/database';
import { AuthenticationError, AuthorizationError } from './errorHandler';
import { logger, logSecurityEvent } from './logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        subscriptionTier?: string;
        subscriptionStatus?: string;
      };
    }
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Authentication middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logSecurityEvent('Missing authentication token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });
      throw new AuthenticationError('Access token is required');
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      throw new Error('Authentication configuration error');
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      logSecurityEvent('User not found for valid token', {
        userId: decoded.userId,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      throw new AuthenticationError('User not found');
    }

    // Attach user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier || undefined,
      subscriptionStatus: user.subscriptionStatus
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logSecurityEvent('Invalid JWT token', {
        error: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next(new AuthenticationError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      logSecurityEvent('Expired JWT token', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(); // Continue without authentication if no secret
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true
      }
    });

    if (user) {
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier || undefined,
        subscriptionStatus: user.subscriptionStatus
      };
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      logSecurityEvent('Authorization attempted without authentication', {
        ip: req.ip,
        path: req.path,
        requiredRoles: allowedRoles
      });
      throw new AuthenticationError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      logSecurityEvent('Insufficient permissions', {
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path,
        ip: req.ip
      });
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

// Subscription tier authorization
export const requireSubscriptionTier = (...allowedTiers: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!req.user.subscriptionTier || !allowedTiers.includes(req.user.subscriptionTier)) {
      logSecurityEvent('Insufficient subscription tier', {
        userId: req.user.userId,
        userTier: req.user.subscriptionTier,
        requiredTiers: allowedTiers,
        path: req.path
      });
      throw new AuthorizationError('Subscription upgrade required');
    }

    next();
  };
};

// Admin only middleware
export const requireAdmin = requireRole('ADMIN');

// Creator only middleware
export const requireCreator = requireRole('CREATOR', 'ADMIN');

// Creator or Admin middleware
export const requireCreatorOrAdmin = requireRole('CREATOR', 'ADMIN');

// Self or Admin middleware (user can access their own data or admin can access any)
export const requireSelfOrAdmin = (userIdParam: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const targetUserId = req.params[userIdParam] || req.body[userIdParam];
    
    if (req.user.role === 'ADMIN' || req.user.userId === targetUserId) {
      return next();
    }

    logSecurityEvent('Unauthorized access attempt', {
      userId: req.user.userId,
      targetUserId,
      path: req.path
    });
    throw new AuthorizationError('Access denied');
  };
};

// Active subscription required
export const requireActiveSubscription = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (req.user.subscriptionStatus !== 'ACTIVE') {
    throw new AuthorizationError('Active subscription required');
  }

  next();
};

// Email verification required
export const requireVerifiedEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { isVerified: true }
  });

  if (!user?.isVerified) {
    throw new AuthorizationError('Email verification required');
  }

  next();
};

// Generate JWT token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(payload, jwtSecret, { expiresIn });
};

// Generate refresh token
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  return jwt.sign(payload, refreshSecret, { expiresIn });
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  return jwt.verify(token, refreshSecret) as JWTPayload;
};

export default {
  authenticateToken,
  optionalAuth,
  requireRole,
  requireSubscriptionTier,
  requireAdmin,
  requireCreator,
  requireCreatorOrAdmin,
  requireSelfOrAdmin,
  requireActiveSubscription,
  requireVerifiedEmail,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
};

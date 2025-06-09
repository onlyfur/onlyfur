import { Request, Response, NextFunction } from 'express';
import { authenticationService } from '../services/authenticationService';
import { logger } from './logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        username: string;
        role: string;
        isVerified: boolean;
        subscriptionStatus?: string;
      };
    }
  }
}

/**
 * Enhanced authentication middleware using the authentication service
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('Missing authentication token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method
      });

      res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
      return;
    }

    // Verify token using authentication service
    const tokenData = authenticationService.verifyToken(token);
    
    if (!tokenData) {
      logger.warn('Invalid or expired token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method
      });

      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    // Get current user data from database
    const user = await authenticationService.getUserById(tokenData.userId);
    
    if (!user) {
      logger.warn('User not found for valid token', {
        userId: tokenData.userId,
        ip: req.ip,
        path: req.path
      });

      res.status(401).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn('Inactive user attempted access', {
        userId: user.id,
        ip: req.ip,
        path: req.path
      });

      res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
      return;
    }

    // Attach user to request
    req.user = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
      subscriptionStatus: user.subscriptionStatus
    };

    next();
  } catch (error: any) {
    logger.error('Authentication middleware error', {
      error: error.message,
      ip: req.ip,
      path: req.path,
      method: req.method
    });

    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Optional authentication middleware (for public endpoints that benefit from user context)
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const tokenData = authenticationService.verifyToken(token);
      
      if (tokenData) {
        const user = await authenticationService.getUserById(tokenData.userId);
        
        if (user && user.isActive) {
          req.user = {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            isVerified: user.isVerified,
            subscriptionStatus: user.subscriptionStatus
          };
        }
      }
    }

    next();
  } catch (error: any) {
    // For optional auth, we don't block the request on auth errors
    logger.warn('Optional authentication failed', {
      error: error.message,
      ip: req.ip,
      path: req.path
    });
    next();
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path
      });

      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

/**
 * Creator verification middleware
 */
export const requireCreator = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'CREATOR' && req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: 'Creator account required'
    });
    return;
  }

  next();
};

/**
 * Admin verification middleware
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
    return;
  }

  next();
};

/**
 * Verified user middleware
 */
export const requireVerified = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  if (!req.user.isVerified) {
    res.status(403).json({
      success: false,
      error: 'Account verification required'
    });
    return;
  }

  next();
};

/**
 * Premium subscription middleware
 */
export const requirePremium = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
    return;
  }

  const premiumStatuses = ['PREMIUM', 'VIP', 'ENTERPRISE'];
  
  if (!premiumStatuses.includes(req.user.subscriptionStatus || '')) {
    res.status(403).json({
      success: false,
      error: 'Premium subscription required'
    });
    return;
  }

  next();
};

// Export the main middleware as default for backward compatibility
export default authMiddleware;

// Export individual middlewares
export {
  authMiddleware as authenticateToken, // Alias for backward compatibility
  optionalAuthMiddleware as optionalAuth,
  requireRole,
  requireCreator,
  requireAdmin,
  requireVerified,
  requirePremium
};

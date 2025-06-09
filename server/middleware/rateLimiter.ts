import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class MemoryStore {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    
    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = {
        count: 1,
        resetTime: now + windowMs
      };
    } else {
      this.store[key].count++;
    }

    return this.store[key];
  }

  get(key: string): { count: number; resetTime: number } | null {
    const entry = this.store[key];
    if (!entry || entry.resetTime < Date.now()) {
      return null;
    }
    return entry;
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store = {};
  }
}

const defaultStore = new MemoryStore();

/**
 * Create a rate limiting middleware
 */
export function createRateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req: Request) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);
      const entry = defaultStore.increment(key, windowMs);

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - entry.count).toString(),
        'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
      });

      if (entry.count > maxRequests) {
        logger.warn('Rate limit exceeded', {
          key,
          count: entry.count,
          limit: maxRequests,
          userAgent: req.get('User-Agent'),
          url: req.url
        });

        return res.status(429).json({
          error: 'Rate limit exceeded',
          message,
          retryAfter: Math.ceil((entry.resetTime - Date.now()) / 1000)
        });
      }

      // Skip counting based on response if configured
      const originalSend = res.send;
      res.send = function(body) {
        const statusCode = res.statusCode;
        const isSuccessful = statusCode >= 200 && statusCode < 300;
        const isFailed = statusCode >= 400;

        if ((skipSuccessfulRequests && isSuccessful) || 
            (skipFailedRequests && isFailed)) {
          // Decrement the count
          const currentEntry = defaultStore.get(key);
          if (currentEntry && currentEntry.count > 0) {
            currentEntry.count--;
          }
        }

        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      logger.error('Rate limiter error', { error: error.message });
      next(); // Continue without rate limiting on error
    }
  };
}

/**
 * Standard rate limiters for different endpoints
 */

// General API rate limiter - 100 requests per 15 minutes
export const generalRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

// Authentication rate limiter - 5 login attempts per 15 minutes
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many authentication attempts, please try again after 15 minutes.',
  keyGenerator: (req: Request) => {
    // Use email + IP for auth attempts
    const email = req.body?.email || '';
    return `auth:${req.ip}:${email}`;
  },
  skipSuccessfulRequests: true // Don't count successful logins
});

// Upload rate limiter - 10 uploads per hour
export const uploadRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
  message: 'Upload limit exceeded, please try again after 1 hour.',
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise IP
    const userId = (req as any).user?.id;
    return userId ? `upload:user:${userId}` : `upload:ip:${req.ip}`;
  }
});

// Message rate limiter - 50 messages per hour
export const messageRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50,
  message: 'Message limit exceeded, please try again after 1 hour.',
  keyGenerator: (req: Request) => {
    const userId = (req as any).user?.id;
    return userId ? `message:user:${userId}` : `message:ip:${req.ip}`;
  }
});

// API key rate limiter - 1000 requests per hour
export const apiKeyRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
  message: 'API rate limit exceeded, please try again after 1 hour.',
  keyGenerator: (req: Request) => {
    const apiKey = req.headers['x-api-key'] as string;
    return apiKey ? `api:${apiKey}` : `api:ip:${req.ip}`;
  }
});

// Search rate limiter - 100 searches per 10 minutes
export const searchRateLimit = createRateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 100,
  message: 'Search limit exceeded, please try again after 10 minutes.',
  keyGenerator: (req: Request) => {
    const userId = (req as any).user?.id;
    return userId ? `search:user:${userId}` : `search:ip:${req.ip}`;
  }
});

// Password reset rate limiter - 3 attempts per hour
export const passwordResetRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  message: 'Too many password reset attempts, please try again after 1 hour.',
  keyGenerator: (req: Request) => {
    const email = req.body?.email || '';
    return `reset:${req.ip}:${email}`;
  }
});

// Email verification rate limiter - 5 requests per hour
export const emailVerificationRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5,
  message: 'Too many email verification requests, please try again after 1 hour.',
  keyGenerator: (req: Request) => {
    const email = req.body?.email || (req as any).user?.email || '';
    return `verify:${req.ip}:${email}`;
  }
});

// User-specific rate limiter factory
export function createUserRateLimit(config: {
  windowMs: number;
  maxRequests: number;
  action: string;
  message?: string;
}) {
  return createRateLimit({
    ...config,
    keyGenerator: (req: Request) => {
      const userId = (req as any).user?.id;
      return userId ? `${config.action}:user:${userId}` : `${config.action}:ip:${req.ip}`;
    }
  });
}

// IP-based rate limiter factory
export function createIPRateLimit(config: {
  windowMs: number;
  maxRequests: number;
  action: string;
  message?: string;
}) {
  return createRateLimit({
    ...config,
    keyGenerator: (req: Request) => `${config.action}:ip:${req.ip}`
  });
}

// Cleanup function for graceful shutdown
export function cleanup() {
  defaultStore.destroy();
}

// Advanced rate limiting with different tiers
export function createTieredRateLimit(tiers: {
  [userType: string]: { windowMs: number; maxRequests: number; };
}) {
  return createRateLimit({
    windowMs: Math.max(...Object.values(tiers).map(t => t.windowMs)),
    maxRequests: 1, // Will be overridden per user
    keyGenerator: (req: Request) => {
      const user = (req as any).user;
      const userType = user?.role || 'anonymous';
      return `tiered:${userType}:${user?.id || req.ip}`;
    }
  });
}

export default {
  createRateLimit,
  generalRateLimit,
  authRateLimit,
  uploadRateLimit,
  messageRateLimit,
  apiKeyRateLimit,
  searchRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  createUserRateLimit,
  createIPRateLimit,
  createTieredRateLimit,
  cleanup
};

import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { getUserById } from './database';

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Rate limiting middleware
interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

export async function applyRateLimit(
  req: VercelRequest, 
  res: VercelResponse, 
  options: RateLimitOptions
): Promise<VercelResponse | null> {
  const key = getClientIp(req);
  const now = Date.now();
  const windowStart = now - options.windowMs;
  
  // Clean up expired entries
  if (rateLimitStore.has(key)) {
    const entry = rateLimitStore.get(key)!;
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
  
  // Check current usage
  const entry = rateLimitStore.get(key) || { count: 0, resetTime: now + options.windowMs };
  
  if (entry.count >= options.max) {
    res.setHeader('X-RateLimit-Limit', options.max);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
    
    return res.status(429).json({ error: options.message });
  }
  
  // Update usage
  entry.count++;
  rateLimitStore.set(key, entry);
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', options.max);
  res.setHeader('X-RateLimit-Remaining', options.max - entry.count);
  res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
  
  return null; // No rate limit exceeded
}

// CORS middleware
export async function applyCors(req: VercelRequest, res: VercelResponse): Promise<void> {
  const origin = req.headers.origin;
  const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');
  
  if (allowedOrigins.includes(origin || '') || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}

// Authentication middleware
export function withAuth(handler: (req: AuthenticatedRequest, res: VercelResponse) => void | Promise<void>) {
  return async (req: AuthenticatedRequest, res: VercelResponse) => {
    try {
      const authHeader = req.headers.authorization;
      const cookieToken = req.cookies?.['onlyfur-token'];
      
      const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : cookieToken;
      
      if (!token) {
        return res.status(401).json({ error: 'No valid token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Verify user still exists
      const user = await getUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Account suspended or inactive' });
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

// Admin authentication middleware
export function withAdminAuth(handler: (req: AuthenticatedRequest, res: VercelResponse) => void | Promise<void>) {
  return withAuth((req: AuthenticatedRequest, res: VercelResponse) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    return handler(req, res);
  });
}

// Creator authentication middleware
export function withCreatorAuth(handler: (req: AuthenticatedRequest, res: VercelResponse) => void | Promise<void>) {
  return withAuth((req: AuthenticatedRequest, res: VercelResponse) => {
    if (!['creator', 'admin'].includes(req.user?.role || '')) {
      return res.status(403).json({ error: 'Creator access required' });
    }
    return handler(req, res);
  });
}

// Get client IP address
function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded ? forwarded.split(',')[0] : req.connection?.remoteAddress || 'unknown';
  return ip;
}

// Input validation middleware
export function validateInput(schema: any) {
  return (req: VercelRequest, res: VercelResponse, next: () => void) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid input data',
        details: error 
      });
    }
  };
}

// CSRF protection middleware
export function csrfProtection(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return true; // Safe methods don't need CSRF protection
  }
  
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');
  
  if (!origin && !referer) {
    return false;
  }
  
  const requestOrigin = origin || (referer ? new URL(referer).origin : '');
  
  return allowedOrigins.includes(requestOrigin) || process.env.NODE_ENV === 'development';
}

export function withCreatorAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => void | Promise<void>) {
  return withAuth((req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.user?.role !== 'creator' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Creator access required' });
    }
    return handler(req, res);
  });
}

// CORS middleware
export function withCors(handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://onlyfur.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
}

// Rate limiting middleware (simple implementation)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function withRateLimit(maxRequests: number = 10, windowMs: number = 60000) {
  return (handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const clientIp = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      
      const clientData = rateLimitMap.get(clientIp);
      
      if (clientData) {
        if (now - clientData.timestamp < windowMs) {
          if (clientData.count >= maxRequests) {
            return res.status(429).json({ error: 'Too many requests' });
          }
          clientData.count++;
        } else {
          // Reset window
          clientData.count = 1;
          clientData.timestamp = now;
        }
      } else {
        rateLimitMap.set(clientIp, { count: 1, timestamp: now });
      }

      return handler(req, res);
    };
  };
}

// Input validation middleware
export function withValidation<T>(schema: (data: any) => { valid: boolean; errors: string[]; data?: T }) {
  return (handler: (req: NextApiRequest & { validatedData: T }, res: NextApiResponse) => void | Promise<void>) => {
    return async (req: NextApiRequest & { validatedData: T }, res: NextApiResponse) => {
      const validation = schema(req.body);
      
      if (!validation.valid) {
        return res.status(400).json({ error: validation.errors[0] });
      }

      req.validatedData = validation.data!;
      return handler(req, res);
    };
  };
}

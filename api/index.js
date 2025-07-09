const { getDatabase } = require('../backend/database');
const { createRoutes } = require('../backend/routes');
const { corsHeaders } = require('../backend/utils');
const url = require('url');

// Global database instance for serverless functions
let dbInstance = null;
let routeHandlers = null;
let initializationPromise = null;

// CORS error tracking to prevent console spam
const corsErrorTracker = {
  reportedOrigins: new Set(),
  lastReportTime: 0,
  reportCooldown: 300000, // 5 minute cooldown between reports for same origin
  maxReports: 10, // Maximum reports per time window
  reportCount: 0,
  
  shouldReport(origin) {
    const now = Date.now();
    
    // Reset report count every hour
    if (now - this.lastReportTime > 3600000) {
      this.reportedOrigins.clear();
      this.reportCount = 0;
      this.lastReportTime = now;
    }
    
    // Limit total reports
    if (this.reportCount >= this.maxReports) {
      return false;
    }
    
    const key = `${origin}_${Math.floor(now / this.reportCooldown)}`;
    
    if (this.reportedOrigins.has(key)) {
      return false; // Already reported this origin in current time window
    }
    
    this.reportedOrigins.add(key);
    this.reportCount++;
    
    return true;
  }
};

// Initialize database and routes if needed
async function initializeBackend() {
  // If already initialized, return immediately
  if (dbInstance && routeHandlers && dbInstance.isConnected) {
    return { db: dbInstance, routes: routeHandlers };
  }
  
  // If initialization is already in progress, wait for it
  if (initializationPromise) {
    console.log('🔄 Waiting for ongoing initialization...');
    return await initializationPromise;
  }
  
  // Start initialization process
  initializationPromise = performInitialization();
  
  try {
    const result = await initializationPromise;
    return result;
  } catch (error) {
    // Reset promise on error so it can be retried
    initializationPromise = null;
    throw error;
  }
}

// Actual initialization logic
async function performInitialization() {
  try {
    console.log('🔧 Initializing backend...');
    
    // Initialize database
    if (!dbInstance) {
      console.log('🔧 Creating database instance...');
      dbInstance = getDatabase();
    }
    
    // Ensure database is connected
    if (!dbInstance.isConnected) {
      console.log('🔧 Connecting to database...');
      await dbInstance.connect();
    }
    
    // Create routes only after database is connected
    if (!routeHandlers) {
      console.log('🔧 Creating routes...');
      routeHandlers = createRoutes(dbInstance);
      
      if (routeHandlers) {
        console.log('🔧 Routes created successfully:', Object.keys(routeHandlers).length, 'routes');
      } else {
        throw new Error('Failed to create routes');
      }
    }
    
    console.log('✅ Backend initialization complete');
    return { db: dbInstance, routes: routeHandlers };
  } catch (error) {
    console.error('❌ Error in performInitialization:', error);
    throw error;
  }
}

// Add CORS headers
function addCorsHeaders(res, origin = null) {
  // Get allowed origins
  const allowedOrigins = [
    'https://onlyfur.net',
    'https://onlyfur.vercel.app', 
    'https://creatorplattform.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://onlyfur.net:5173'
  ];
  
  // Default to allowing any Vercel deployment to prevent CORS spam in production
  let allowedOrigin = origin || '*';
  
  if (origin) {
    // Check exact matches first
    if (allowedOrigins.includes(origin)) {
      allowedOrigin = origin;
    } 
    // Auto-allow any Vercel deployment URLs for development branches
    else if (origin.includes('vercel.app') && (
      origin.includes('onlyfur') || 
      origin.includes('k3noxs-projects') ||
      origin.includes('creatorplattform') ||
      // Allow any git branch pattern: projectname-git-branchname-username.vercel.app
      /^https:\/\/[a-zA-Z0-9-]+-git-[a-zA-Z0-9-]+-[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)
    )) {
      allowedOrigin = origin;
      // Only log in development to prevent production console spam
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌐 Auto-allowing Vercel deployment: ${origin}`);
      }
    }
    // Allow localhost with any port for local development
    else if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      allowedOrigin = origin;
      if (process.env.NODE_ENV === 'development') {
        console.log(`🏠 Auto-allowing localhost development: ${origin}`);
      }
    }
    // Handle blocked origin with throttled error reporting
    else {
      if (corsErrorTracker.shouldReport(origin)) {
        console.warn(`🚫 CORS: Blocked origin "${origin}"`);
      }
      // Use wildcard for unknown origins to prevent CORS errors in production
      allowedOrigin = '*';
    }
  }
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
    'Access-Control-Allow-Credentials': allowedOrigin !== '*' ? 'true' : 'false',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  };
  
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

async function handler(req, res) {
  const { method } = req;
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const origin = req.headers?.origin || 'http://localhost:5173';
  
  
  // Add CORS headers to all responses
  addCorsHeaders(res, origin);
  
  // Handle preflight OPTIONS requests
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Initialize backend
    const { routes } = await initializeBackend();
    
    if (!routes) {
      console.error('❌ Routes object is null or undefined');
      return res.status(500).json({ success: false, error: 'Routes not initialized' });
    }
    
    // Find route handler
    let routeKey = `${method} ${pathname}`;
    let handler = routes[routeKey];
    
    
    // Handle dynamic routes
    if (!handler) {
      // Handle /user/:username route
      if (pathname.startsWith('/user/') && method === 'GET') {
        handler = routes['GET /user/:username'];
      }
      // Handle /api/user/check-url/:url route
      else if (pathname.startsWith('/api/user/check-url/') && method === 'GET') {
        handler = routes['GET /api/user/check-url/:url'];
      }
      // Handle /api/online-status/:userId route
      else if (pathname.startsWith('/api/online-status/') && method === 'GET') {
        handler = routes['GET /api/online-status/:userId'];
      }
    }
    
    if (handler) {
      // Convert Vercel req/res to Node.js format for compatibility
      const nodeReq = {
        ...req,
        url: req.url,
        method: req.method,
        headers: req.headers || {},
        params: req.params || {}
      };
      
      
      const nodeRes = {
        writeHead: (status, headers) => {
          res.status(status);
          if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
              res.setHeader(key, value);
            });
          }
        },
        end: (data) => {
          if (data) {
            res.send(data);
          } else {
            res.end();
          }
        },
        setHeader: (key, value) => res.setHeader(key, value)
      };
      
      await handler(nodeReq, nodeRes);
    } else {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: pathname,
        method: method
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// For local development
if (require.main === module) {
  const http = require('http');
  const PORT = process.env.PORT || 3001;
  
  console.log('🚀 Starting serverless backend for local development...');
  
  const server = http.createServer(async (req, res) => {
    // Parse request body for POST/PUT/PATCH requests
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      try {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString();
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch (error) {
        console.error('Error parsing request body:', error.message);
        body = {};
      }
    }
    
    // Convert to Vercel-like request/response objects
    const vercelReq = {
      ...req,
      query: url.parse(req.url, true).query,
      body: body,
      headers: req.headers // Ensure headers are properly preserved
    };
    
    const vercelRes = {
      status: (code) => {
        res.statusCode = code;
        return vercelRes;
      },
      json: (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      },
      send: (data) => {
        if (typeof data === 'string') {
          res.end(data);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        }
      },
      end: () => {
        res.end();
      },
      setHeader: (key, value) => {
        res.setHeader(key, value);
        return vercelRes;
      }
    };
    
    await handler(vercelReq, vercelRes);
  });
  
  server.listen(PORT, () => {
    console.log(`✅ Local serverless backend running on port ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 API endpoints: http://localhost:${PORT}/api`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/api/admin/panel`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('📴 Received SIGTERM, shutting down gracefully...');
    if (dbInstance) {
      await dbInstance.disconnect();
    }
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', async () => {
    console.log('📴 Received SIGINT, shutting down gracefully...');
    if (dbInstance) {
      await dbInstance.disconnect();
    }
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}

module.exports = handler;
module.exports.default = handler;

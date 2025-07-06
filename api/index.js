const { getDatabase } = require('../backend/database');
const { createRoutes } = require('../backend/routes');
const { corsHeaders } = require('../backend/utils');
const url = require('url');

// Global database instance for serverless functions
let dbInstance = null;
let routeHandlers = null;

// Initialize database and routes if needed
async function initializeBackend() {
  if (!dbInstance) {
    dbInstance = getDatabase();
    await dbInstance.connect();
    routeHandlers = createRoutes(dbInstance);
  }
  return { db: dbInstance, routes: routeHandlers };
}

// Add CORS headers
function addCorsHeaders(res, origin = null) {
  // Get allowed origins
  const allowedOrigins = [
    'https://onlyfur.net',
    'https://onlyfur.vercel.app', 
    'http://localhost:5173',
    'http://localhost:3000',
    'http://onlyfur.net:5173'
  ];
  
  // Determine the appropriate origin
  let allowedOrigin = 'https://onlyfur.net'; // Default to production
  
  if (origin && allowedOrigins.includes(origin)) {
    allowedOrigin = origin;
  }
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };
  
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

async function handler(req, res) {
  const { method } = req;
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const origin = req.headers.origin;
  
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
    }
    
    if (handler) {
      // Convert Vercel req/res to Node.js format for compatibility
      const nodeReq = {
        ...req,
        url: req.url,
        method: req.method,
        headers: req.headers
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
      body: body
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

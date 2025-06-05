const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server: SocketServer } = require('socket.io');

// Load environment variables
dotenv.config();

// Basic validation for required environment variables
function validateEnv() {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  
  // Warn about optional but recommended variables
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not set - using mock database for development');
  }
  
  console.log('✅ Environment variables validated successfully');
}

// Validate environment
validateEnv();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_BASE_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https://js.stripe.com", "https://checkout.stripe.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com", "wss:", "ws:"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    originalEnd.apply(this, args);
  };
  
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation (basic info)
app.get('/api', (req, res) => {
  res.json({
    name: 'OnlyFur Platform API',
    version: '1.0.0',
    description: 'API for OnlyFur - Premium furry content platform',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      subscriptions: '/api/subscriptions',
      content: '/api/content',
      payments: '/api/payments',
      messaging: '/api/messaging',
      admin: '/api/admin',
      upload: '/api/upload',
      analytics: '/api/analytics'
    },
    health: '/api/health'
  });
});

// Initialize services
async function initializeServices() {
  try {
    console.log('🔧 Initializing services...');
    
    // Initialize database
    try {
      const { initializeDatabase } = require('./services/database.cjs');
      await initializeDatabase();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      // Don't exit - let the server start anyway for development
    }

    // Initialize other services (non-blocking)
    try {
      const { initializeStripe } = require('./services/stripe.cjs');
      await initializeStripe();
      console.log('✅ Stripe service initialized');
    } catch (error) {
      console.warn('⚠️  Stripe service not configured:', error.message);
    }

    try {
      const { initializeEmailService } = require('./services/email.cjs');
      await initializeEmailService();
      console.log('✅ Email service initialized');
    } catch (error) {
      console.warn('⚠️  Email service not configured:', error.message);
    }

    try {
      const { initializeS3 } = require('./services/s3.cjs');
      await initializeS3();
      console.log('✅ S3 service initialized');
    } catch (error) {
      console.warn('⚠️  S3 service not configured:', error.message);
    }

    // Initialize Socket.IO (basic setup)
    initializeSocketServer(io);
    console.log('✅ Socket.IO server initialized');

  } catch (error) {
    console.error('❌ Failed to initialize some services:', error.message);
    // Continue anyway for development
  }
}

// Basic Socket.IO setup
function initializeSocketServer(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
    
    // Basic ping/pong for connection testing
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });
}

// Load API routes (with error handling)
try {
  // Import routes with fallback
  const { router: authRoutes } = require('./routes/auth.cjs');
  const subscriptionRoutes = require('./routes/subscriptions.cjs');
  // const userRoutes = require('./routes/users');
  // const contentRoutes = require('./routes/content');
  // const paymentRoutes = require('./routes/payments');
  // const messagingRoutes = require('./routes/messaging');
  // const adminRoutes = require('./routes/admin');
  // const uploadRoutes = require('./routes/upload');
  // const analyticsRoutes = require('./routes/analytics');

  // Register routes
  app.use('/api/auth', authRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);
  // app.use('/api/users', userRoutes);
  // app.use('/api/content', contentRoutes);
  // app.use('/api/payments', paymentRoutes);
  // app.use('/api/messaging', messagingRoutes);
  // app.use('/api/admin', adminRoutes);
  // app.use('/api/upload', uploadRoutes);
  // app.use('/api/analytics', analyticsRoutes);

  console.log('✅ API routes loaded');
} catch (error) {
  console.error('❌ Failed to load some API routes:', error.message);
  console.log('🔧 Server will continue with basic functionality');
}

// Placeholder routes for missing endpoints
const createPlaceholderRoute = (name, description) => {
  const router = express.Router();
  router.all('*', (req, res) => {
    res.status(501).json({
      success: false,
      message: `${description} endpoint not yet implemented`,
      endpoint: name
    });
  });
  return router;
};

app.use('/api/users', createPlaceholderRoute('users', 'User management'));
app.use('/api/content', createPlaceholderRoute('content', 'Content management'));
app.use('/api/payments', createPlaceholderRoute('payments', 'Payment processing'));
app.use('/api/messaging', createPlaceholderRoute('messaging', 'Messaging system'));
app.use('/api/admin', createPlaceholderRoute('admin', 'Admin operations'));
app.use('/api/upload', createPlaceholderRoute('upload', 'File upload'));
app.use('/api/analytics', createPlaceholderRoute('analytics', 'Analytics'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.statusCode || 500).json({
    error: error.name || 'Error',
    message: error.message || 'Internal server error',
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString()
  });
});

// Start server
async function startServer() {
  try {
    await initializeServices();

    httpServer.listen(PORT, () => {
      console.log('\n🚀 OnlyFur Backend Server started successfully!');
      console.log(`📡 API endpoint: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api`);
      console.log(`🔗 Client URL: ${process.env.CLIENT_BASE_URL || 'http://localhost:5173'}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
      console.log('\n📚 Available endpoints:');
      console.log('  - GET  /api/health          Health check');
      console.log('  - GET  /api                 API information');
      console.log('  - POST /api/auth/login      User login');
      console.log('  - POST /api/auth/register   User registration');
      console.log('  - GET  /api/subscriptions/tiers  Subscription tiers');
      console.log('\n⚠️  Note: Some services may not be fully configured');
      console.log('   Check the startup logs above for service status\n');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
  });

  // Close database connections if available
  try {
    const { disconnectDatabase } = require('./services/database.cjs');
    await disconnectDatabase();
  } catch (error) {
    // Database service might not be available
  }
  
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
  });

  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in development - just log it
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit in development - just log it
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Start the server
startServer();

module.exports = { app, io };

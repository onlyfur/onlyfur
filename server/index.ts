import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { logger, requestLogger } from './middleware/logger';
import { validateEnv } from './config/validation';

// Import routes
import authRoutes from './routes/auth';
import authEnhancedRoutes from './routes/authEnhanced';
import userRoutes from './routes/users';
import usersEnhancedRoutes from './routes/usersEnhanced';
import subscriptionRoutes from './routes/subscriptions';
import contentRoutes from './routes/content';
import contentEnhancedRoutes from './routes/contentEnhanced';
import paymentRoutes from './routes/payments';
import messagingRoutes from './routes/messaging';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';
import analyticsRoutes from './routes/analytics';
// V2.9 New routes
import twoFactorRoutes from './routes/twoFactor';
import notificationRoutes from './routes/notifications';
import moderationRoutes from './routes/moderation';
// V3.6 New routes
import creatorDashboardRoutes from './routes/creatorDashboard';
import advancedAnalyticsRoutes from './routes/advancedAnalytics';\nimport webhookRoutes from './routes/webhooks';
// V3.0 New routes
import userPreferencesRoutes from './routes/userPreferences';
import aiRoutes from './routes/ai';
import liveStreamingRoutes from './routes/liveStreaming';
import enhancedPaymentsRoutes from './routes/enhancedPayments';
import enhancedSearchRoutes from './routes/enhancedSearch';\nimport stripeIntegrationRoutes from './routes/stripeIntegration';\nimport vercelBlobUploadRoutes from './routes/vercelBlobUpload';\nimport realDataRoutes from './routes/realData';\nimport onlineStatusRoutes from './routes/onlineStatus';
// V3.7 New routes
import liveStreamingCompleteRoutes from './routes/liveStreamingComplete';
import advancedAnalyticsV2Routes from './routes/advancedAnalyticsV2';
import aiContentAssistantRoutes from './routes/aiContentAssistant';

// V3.8 Complete Integration Routes
import authCompleteRoutes from './routes/authComplete';
import usersCompleteRoutes from './routes/usersComplete';
import contentCompleteRoutes from './routes/contentComplete';
import subscriptionsCompleteRoutes from './routes/subscriptionsComplete';
import homeExploreAIRoutes from './routes/homeExploreAI';\nimport aiCompleteRoutes from './routes/aiComplete';\nimport userAnalyticsV3Routes from './routes/userAnalyticsV3';\nimport aiOptimizationV3Routes from './routes/aiOptimizationV3';\nimport aiCommunityV3Routes from './routes/aiCommunityV3';
import aiCompleteRoutes from './routes/aiComplete';

// Import services
import { initializeDatabase } from './services/database';
import { initializeSocketServer } from './services/socket';
import { initializeStripe } from './services/stripe';
import { initializeEmailService } from './services/email';
import { initializeS3 } from './services/s3';
import vercelIntegration from './services/vercelIntegration';

// Load environment variables
dotenv.config();

// Validate environment variables
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
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://onlyfur.vercel.app'
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100, // limit each IP to 100 requests per windowMs
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

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation (in development)
if (process.env.NODE_ENV === 'development' && process.env.ENABLE_API_DOCS === 'true') {
  import('swagger-ui-express').then(swaggerUi => {
    import('./config/swagger').then(({ swaggerSpec }) => {
      app.use('/api/docs', swaggerUi.default.serve, swaggerUi.default.setup(swaggerSpec));
      logger.info('API Documentation available at /api/docs');
    });
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth-v2', authEnhancedRoutes); // Enhanced auth with PostgreSQL integration
app.use('/api/users', userRoutes);
app.use('/api/users-v2', usersEnhancedRoutes); // Enhanced users with PostgreSQL integration
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/content-v2', contentEnhancedRoutes); // Enhanced content with Blob storage
app.use('/api/payments', paymentRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
// V2.9 New routes
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/advanced-analytics', advancedAnalyticsRoutes);\napp.use('/api/webhooks', webhookRoutes);
// V3.6 Creator Dashboard
app.use('/api/creator', creatorDashboardRoutes);
// V3.0 New routes
app.use('/api/preferences', userPreferencesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/streaming', liveStreamingRoutes);
app.use('/api/payments', enhancedPaymentsRoutes);
app.use('/api/search', enhancedSearchRoutes);\napp.use('/api/stripe', stripeIntegrationRoutes);\napp.use('/api/blob', vercelBlobUploadRoutes);\napp.use('/api/real-data', realDataRoutes);\napp.use('/api/online-status', onlineStatusRoutes);
// V3.7 New routes
app.use('/api/streaming-v2', liveStreamingCompleteRoutes);
app.use('/api/analytics-v2', advancedAnalyticsV2Routes);
app.use('/api/ai-assistant', aiContentAssistantRoutes);

// V3.8 Complete Integration Routes (Vercel PostgreSQL + Blob + AI)
app.use('/api/auth-v3', authCompleteRoutes);
app.use('/api/users-v3', usersCompleteRoutes);
app.use('/api/content-v3', contentCompleteRoutes);
app.use('/api/subscriptions-v3', subscriptionsCompleteRoutes);
app.use('/api/home-v2', homeExploreAIRoutes);

// V3.9 AI-Powered Features (Complete AI Integration)
app.use('/api/ai', aiCompleteRoutes);
app.use('/api/analytics-v3', userAnalyticsV3Routes);
app.use('/api/ai-optimization', aiOptimizationV3Routes);
app.use('/api/ai-community', aiCommunityV3Routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize services
async function initializeServices() {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Initialize Stripe
    await initializeStripe();
    logger.info('Stripe service initialized');

    // Initialize email service
    await initializeEmailService();
    logger.info('Email service initialized');

    // Initialize S3
    await initializeS3();
    logger.info('S3 service initialized');

    // Initialize Socket.IO
    initializeSocketServer(io);
    logger.info('Socket.IO server initialized');

    // Initialize AI Engine (V3.0)
    const { aiEngine } = await import('./services/aiEngine');
    await aiEngine.initialize();
    logger.info('AI Engine initialized');

    // Initialize Vercel Integration (V3.8)
    await vercelIntegration.connectDatabase();
    const healthCheck = await vercelIntegration.healthCheck();
    if (healthCheck.database === 'healthy' && healthCheck.blobStorage === 'healthy') {
      logger.info('Vercel PostgreSQL + Blob Storage initialized successfully');
    } else {
      logger.warn('Vercel services partially initialized:', healthCheck);
    }

  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await initializeServices();

    httpServer.listen(PORT, () => {
      logger.info(`🚀 OnlyFur Backend Server running on port ${PORT}`);
      logger.info(`📡 API endpoint: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api`);
      logger.info(`🔗 Client URL: ${process.env.CLIENT_BASE_URL || 'http://localhost:5173'}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.ENABLE_API_DOCS === 'true') {
        logger.info(`📚 API Docs: http://localhost:${PORT}/api/docs`);
      }
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  // Close database connections, etc.
  // await prisma.$disconnect();
  
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

export { app, io };

const { app, initializeDatabase, ensureUploadDir, config, prisma } = require('./app.cjs');
const multer = require('multer');
const http = require('http');
const { initializeSocket } = require('./services/socket-messaging.cjs');
const { createSubscriptionPayment, handleWebhook } = require('./services/stripe-payment.cjs');

// Import route modules
const authModule = require('./routes/auth.cjs');
const subscriptionRoutes = require('./routes/subscriptions.cjs');
const contentRoutes = require('./routes/content.cjs');
const messageRoutes = require('./routes/messages.cjs');
const userRoutes = require('./routes/users.cjs');
const adminRoutes = require('./routes/admin.cjs');

// Extract router and middleware
const authRoutes = authModule.router;
const authenticateToken = authModule.authenticateToken;

// Payment routes
app.post('/api/payments/create-intent', authenticateToken, async (req, res) => {
  try {
    const { tierId } = req.body;
    const result = await createSubscriptionPayment(req.user.id, tierId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/payments/webhook', async (req, res) => {
  try {
    await handleWebhook(req.body);
    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Additional endpoints
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await prisma.user.aggregate({
      _count: true
    });

    const contentCount = await prisma.content.count({
      where: { isActive: true }
    });

    res.json({
      success: true,
      stats: {
        totalUsers: stats._count,
        totalContent: contentCount,
        platform: 'OnlyFur',
        version: '1.0.0'
      }
    });
  } catch (error) {
    res.json({
      success: true,
      stats: {
        totalUsers: 0,
        totalContent: 0,
        platform: 'OnlyFur',
        version: '1.0.0'
      }
    });
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large'
      });
    }
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize and start server
async function startServer() {
  try {
    console.log('🚀 Starting OnlyFur Platform Server...');
    
    // Ensure upload directories exist
    await ensureUploadDir();
    console.log('📁 Upload directories initialized');

    // Initialize database
    const dbInitialized = await initializeDatabase();
    if (dbInitialized) {
      console.log('🗄️  Database connected and initialized');
    } else {
      console.log('⚠️  Running in development mode with mock data');
    }

    // Create HTTP server and initialize Socket.io
    const server = http.createServer(app);
    const io = initializeSocket(server);

    // Start server
    server.listen(config.port, () => {
      console.log(`🚀 OnlyFur API Server running on port ${config.port}`);
      console.log(`📋 Health check: http://localhost:${config.port}/health`);
      console.log(`📋 API info: http://localhost:${config.port}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
      console.log('📚 Available endpoints:');
      console.log('  - /api/auth/* - Authentication');
      console.log('  - /api/users/* - User management');
      console.log('  - /api/content/* - Content management');
      console.log('  - /api/subscriptions/* - Subscription management');
      console.log('  - /api/messages/* - Messaging');
      console.log('  - /api/admin/* - Admin operations');
      console.log('  - /uploads/* - File serving');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`🛑 ${signal} received, shutting down gracefully`);
      
      server.close(async () => {
        console.log('📴 HTTP server closed');
        
        try {
          await prisma.$disconnect();
          console.log('🗄️  Database connection closed');
        } catch (error) {
          console.error('Error closing database connection:', error);
        }
        
        process.exit(0);
      });

      // Force close server after 30 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };

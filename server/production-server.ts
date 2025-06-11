import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.join(__dirname, '..', envFile) });

// Import middleware
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

// Import routes
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscriptions';
import contentRoutes from './routes/content';
import userRoutes from './routes/users';
import messagingRoutes from './routes/messaging';
import adminRoutes from './routes/admin';
import paymentRoutes from './routes/payments';
import uploadBlobRoutes from './routes/upload-blob';
import creatorPagesRoutes from './routes/creatorPages';

// Import services
import stripeService from './services/stripe-production';
import emailService from './services/email-notifications';

// Initialize Prisma
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error'],
});

// Create Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https:', 'wss:'],
      frameSrc: ["'self'", 'https://js.stripe.com'],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: { error: 'Too many requests from this IP' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messagingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadBlobRoutes);
app.use('/api/creator', creatorPagesRoutes);

// Stripe webhook handling (raw body needed)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const event = stripeService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await stripeService.handleStripeWebhook(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    // Verify JWT token (you'll need to implement this)
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // socket.userId = decoded.userId;
    
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      // Handle message sending logic
      const { recipientId, content, roomId } = data;
      
      // Save message to database
      // const message = await prisma.message.create({ ... });
      
      // Emit to room
      io.to(roomId).emit('new_message', data);
    } catch (error) {
      console.error('Message send error:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(frontendPath));
  
  // Serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
}

// Error handling
app.use(errorHandler);

// Database initialization
const initializeDatabase = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Check if we need to seed data
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('🌱 Seeding initial data...');
      await seedDatabase();
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Database seeding
const seedDatabase = async () => {
  try {
    // Create subscription tiers
    const tiers = [
      {
        id: 'free',
        name: 'Free',
        description: 'Basic access to the platform',
        price: 0,
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        type: 'SUBSCRIBER',
        level: 'basic',
        features: JSON.stringify(['Basic content access', 'Community features']),
        limitations: JSON.stringify(['Limited messages per day']),
        messagingFeatures: JSON.stringify({ maxConversations: 5, maxFileSize: 5 }),
        contentAccess: JSON.stringify(['free']),
        color: '#6B7280',
        isActive: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Full access with premium features',
        price: 999, // $9.99 in cents
        currency: 'USD',
        billingPeriod: 'MONTHLY',
        type: 'SUBSCRIBER',
        level: 'premium',
        features: JSON.stringify(['All content access', 'Unlimited messaging', 'Early access']),
        limitations: JSON.stringify([]),
        messagingFeatures: JSON.stringify({ maxConversations: -1, maxFileSize: 50 }),
        contentAccess: JSON.stringify(['free', 'premium']),
        color: '#8B5CF6',
        isActive: true,
      },
    ];

    for (const tier of tiers) {
      await prisma.platformSubscriptionTier.upsert({
        where: { id: tier.id },
        update: tier,
        create: tier,
      });
    }

    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'admin123',
      parseInt(process.env.BCRYPT_ROUNDS || '12')
    );

    await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL || 'admin@onlyfur.com' },
      update: {},
      create: {
        email: process.env.ADMIN_EMAIL || 'admin@onlyfur.com',
        username: process.env.ADMIN_USERNAME || 'admin',
        displayName: 'Platform Admin',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
        subscriptionTier: 'premium',
        subscriptionStatus: 'ACTIVE',
      },
    });

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('🔄 Graceful shutdown initiated...');
  
  server.close(() => {
    console.log('📡 HTTP server closed');
  });
  
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await initializeDatabase();
    
    server.listen(PORT, () => {
      console.log(`🚀 OnlyFur Platform Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base: ${process.env.API_BASE_URL}/api`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📚 API Docs: ${process.env.API_BASE_URL}/api-docs`);
        console.log(`🔍 Prisma Studio: npx prisma studio`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Export for testing
export { app, server, prisma };

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

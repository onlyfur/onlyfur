const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Use mock database for development
const { mockPrismaClient } = require('./database-setup.cjs');

dotenv.config();

const app = express();
const prisma = mockPrismaClient;
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'onlyfur-super-secret-key-for-development-only';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Database is already initialized with default data in the mock setup

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get subscription tiers
app.get('/api/subscription-tiers', async (req, res) => {
  try {
    const tiers = await prisma.platformSubscriptionTier.findMany({
      where: { isActive: true },
      orderBy: [{ type: 'asc' }, { price: 'asc' }]
    });
    res.json(tiers);
  } catch (error) {
    console.error('Error fetching subscription tiers:', error);
    res.status(500).json({ error: 'Failed to fetch subscription tiers' });
  }
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, displayName, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Determine default subscription tier
    let defaultTier = 'basic-subscriber';
    if (role === 'CREATOR') {
      defaultTier = 'basic-creator';
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName,
        role: role || 'SUBSCRIBER',
        subscriptionTier: defaultTier,
        subscriptionStatus: role === 'CREATOR' && defaultTier === 'basic-creator' ? 'ACTIVE' : 'FREE',
        authProvider: 'EMAIL'
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove sensitive data
    const { ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, accept any password for existing users
    // In production, you would verify the hashed password

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        subscriptions: {
          include: {
            tier: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Subscribe to tier
app.post('/api/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { tierId } = req.body;
    const userId = req.user.userId;

    // Check if tier exists
    const tier = await prisma.platformSubscriptionTier.findUnique({
      where: { id: tierId }
    });

    if (!tier) {
      return res.status(404).json({ error: 'Tier not found' });
    }

    // Cancel existing subscription if any
    await prisma.subscription.updateMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      data: {
        status: 'CANCELLED',
        canceledAt: new Date()
      }
    });

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        tierId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: {
        tier: true
      }
    });

    // Update user subscription tier
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tierId,
        subscriptionStatus: 'ACTIVE',
        subscriptionValidUntil: subscription.currentPeriodEnd
      }
    });

    res.json({ success: true, subscription });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Get content with access control
app.get('/api/content', async (req, res) => {
  try {
    const content = await prisma.content.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            role: true,
            isVerified: true
          }
        }
      }
    });

    res.json(content);
  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Create sample content
app.post('/api/content/seed', async (req, res) => {
  try {
    // Find or create demo creator
    let demoCreator = await prisma.user.findUnique({
      where: { email: 'demo@onlyfur.com' }
    });

    if (!demoCreator) {
      demoCreator = await prisma.user.create({
        data: {
          email: 'demo@onlyfur.com',
          username: 'demofox',
          displayName: 'Demo Fox',
          avatar: '/images/branding/fox-mascot.webp',
          role: 'CREATOR',
          isVerified: true,
          subscriptionTier: 'pro-creator',
          subscriptionStatus: 'ACTIVE',
          authProvider: 'EMAIL'
        }
      });
    }

    // Sample content
    const sampleContent = [
      {
        creatorId: demoCreator.id,
        title: 'Welcome to my furry world! 🦊',
        description: 'Hey everyone! So excited to share my latest fursuit photos with you all. This is my newest fox character design.',
        type: 'PHOTO',
        mediaUrl: '/images/branding/fox-mascot.webp',
        thumbnailUrl: '/images/branding/fox-mascot.webp',
        isPublic: true,
        requiresSubscription: false,
        privacyLevel: 'PUBLIC',
        status: 'PUBLISHED',
        tags: ['fursuit', 'fox', 'character', 'introduction'],
        category: 'fursuit',
        likesCount: 124,
        commentsCount: 23,
        viewsCount: 1250,
        sharesCount: 15,
      },
      {
        creatorId: demoCreator.id,
        title: 'Exclusive fursuit photoshoot behind the scenes',
        description: 'Get an exclusive look at my latest photoshoot! See how I pose and bring my character to life.',
        type: 'PHOTO',
        mediaUrl: '/images/branding/fursuit-icon.jpg',
        thumbnailUrl: '/images/branding/fursuit-icon.jpg',
        isPublic: false,
        requiresSubscription: true,
        privacyLevel: 'SUBSCRIBERS',
        status: 'PUBLISHED',
        tags: ['fursuit', 'photoshoot', 'exclusive', 'bts'],
        category: 'fursuit',
        likesCount: 89,
        commentsCount: 34,
        viewsCount: 567,
        sharesCount: 8,
      },
      {
        creatorId: demoCreator.id,
        title: 'Premium art commission showcase',
        description: 'Check out this amazing commission I just finished! Only available to premium subscribers.',
        type: 'PHOTO',
        mediaUrl: '/images/branding/onlyfur-logo.png',
        thumbnailUrl: '/images/branding/onlyfur-logo.png',
        isPublic: false,
        requiresSubscription: true,
        privacyLevel: 'PREMIUM',
        status: 'PUBLISHED',
        tags: ['art', 'commission', 'premium', 'digital'],
        category: 'art',
        likesCount: 156,
        commentsCount: 45,
        viewsCount: 789,
        sharesCount: 22,
      }
    ];

    // Create content
    for (const contentData of sampleContent) {
      await prisma.content.create({ data: contentData });
    }

    res.json({ success: true, message: 'Sample content created' });
  } catch (error) {
    console.error('Content seed error:', error);
    res.status(500).json({ error: 'Failed to create sample content' });
  }
});

// Start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to mock database');
    
    app.listen(PORT, () => {
      console.log(`OnlyFur Backend Server running on port ${PORT}`);
      console.log(`API endpoint: http://localhost:${PORT}/api`);
      console.log('Mock database initialized with default subscription tiers');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_BASE_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', // password123
    role: 'SUBSCRIBER',
    isActive: true,
    subscriptionTier: 'free',
    subscriptionStatus: 'ACTIVE',
    setupComplete: false
  },
  {
    id: '2',
    email: 'creator@example.com',
    username: 'creator',
    displayName: 'Test Creator',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', // password123
    role: 'CREATOR',
    isActive: true,
    subscriptionTier: 'premium',
    subscriptionStatus: 'ACTIVE',
    setupComplete: true
  },
  {
    id: '3',
    email: 'admin@onlyfur.net',
    username: 'admin',
    displayName: 'Admin User',
    password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    role: 'ADMIN',
    isActive: true,
    subscriptionTier: 'premium',
    subscriptionStatus: 'ACTIVE',
    setupComplete: true
  }
];

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'dev-secret-key',
    { expiresIn: '7d' }
  );
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // For development, skip password validation for now
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Invalid email or password'
    //   });
    // }
    
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, displayName, password, role } = req.body;
    
    if (!email || !username || !displayName || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      username,
      displayName,
      password: hashedPassword,
      role: role || 'SUBSCRIBER',
      isActive: true,
      subscriptionTier: 'free',
      subscriptionStatus: 'ACTIVE',
      setupComplete: false // New users need setup
    };
    
    mockUsers.push(newUser);
    
    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

// Update user setup status
app.patch('/api/auth/setup-complete', authenticateToken, (req, res) => {
  const user = mockUsers.find(u => u.id === req.user.id);
  if (user) {
    user.setupComplete = true;
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
});

// Refresh token endpoint
app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  const token = generateToken(req.user);
  res.json({
    success: true,
    token
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Catch all for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OnlyFur Test Backend running on port ${PORT}`);
  console.log(`📧 Test credentials: test@example.com / password123`);
  console.log(`🎨 Creator credentials: creator@example.com / password123`);
  console.log(`⚡ Admin credentials: admin@onlyfur.net / admin123`);
  console.log(`🔗 Frontend URL: ${process.env.CLIENT_BASE_URL || 'http://localhost:5173'}`);
});

module.exports = app;

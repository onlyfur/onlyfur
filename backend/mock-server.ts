import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 3002;

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', // password123
    role: 'SUBSCRIBER',
    isVerified: true,
    authProvider: 'EMAIL',
    subscriptionTier: 'free',
    subscriptionStatus: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'creator@example.com',
    username: 'creator',
    displayName: 'Test Creator',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', // password123
    role: 'CREATOR',
    isVerified: true,
    authProvider: 'EMAIL',
    subscriptionTier: 'premium',
    subscriptionStatus: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // For mock server, skip password validation
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Invalid email or password'
    //   });
    // }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'mock-secret',
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        refreshToken: 'mock-refresh-token'
      }
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
      isVerified: false,
      authProvider: 'EMAIL',
      subscriptionTier: 'free',
      subscriptionStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUsers.push(newUser);
    
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      'mock-secret',
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        refreshToken: 'mock-refresh-token'
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Profile endpoint
app.get('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, 'mock-secret') as any;
    
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Catch all other API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log(`📧 Test credentials: test@example.com / password123`);
  console.log(`🎨 Creator credentials: creator@example.com / password123`);
});

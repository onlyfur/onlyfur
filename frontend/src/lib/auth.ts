import { User } from '@/types';

// Mock authentication functions for frontend-only deployment
// In production, these would connect to a real backend API

// Admin credentials from environment variables
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@onlyfur.net';
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const ADMIN_DISPLAY_NAME = import.meta.env.VITE_ADMIN_DISPLAY_NAME || 'OnlyFur Admin';

const DEMO_USERS: User[] = [
  {
    id: '1',
    email: ADMIN_EMAIL,
    username: ADMIN_USERNAME,
    displayName: ADMIN_DISPLAY_NAME,
    role: 'admin' as const,
    avatar: '/images/branding/onlyfur-logo.png',
    bio: 'Platform Administrator',
    isVerified: true,
    subscriptionTier: undefined,
    subscriptionStatus: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'demo@onlyfur.com',
    username: 'demofox',
    displayName: 'Demo Fox',
    role: 'creator' as const,
    avatar: '/images/branding/fox-mascot.webp',
    bio: 'Furry content creator and artist 🦊',
    isVerified: true,
    subscriptionTier: undefined,
    subscriptionStatus: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'demo@creatorhub.com',
    username: 'democreator',
    displayName: 'Demo Creator',
    role: 'creator' as const,
    avatar: '/images/branding/fursuit-icon.jpg',
    bio: 'Professional fursuit creator and photographer',
    isVerified: true,
    subscriptionTier: undefined,
    subscriptionStatus: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }
];

// Mock password verification
const verifyPassword = (email: string, password: string): boolean => {
  // For demo purposes, check admin credentials from environment variables
  const validCredentials = [
    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    { email: 'admin@creatorhub.com', password: 'password123' },
    { email: 'demo@onlyfur.com', password: 'password123' },
    { email: 'demo@creatorhub.com', password: 'password123' }
  ];

  return validCredentials.some(
    cred => cred.email === email && cred.password === password
  );
};

export const authenticateUser = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Verify credentials
  if (!verifyPassword(email, password)) {
    throw new Error('Invalid email or password');
  }

  // Find user by email
  const user = DEMO_USERS.find(u => u.email === email);
  if (!user) {
    throw new Error('User not found');
  }

  // Store auth token (mock)
  const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
  localStorage.setItem('onlyfur-auth-token', token);

  return user;
};

export const registerUser = async (userData: Partial<User> & { password?: string }): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if email already exists
  const existingUser = DEMO_USERS.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // For demo purposes, create a new user (but don't persist it)
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email: userData.email || '',
    username: userData.username || userData.email?.split('@')[0] || '',
    displayName: userData.displayName || userData.username || 'New User',
    role: 'subscriber' as const, // New users are subscribers by default
    avatar: userData.avatar || '/images/branding/paw-logo.jpg',
    bio: userData.bio || '',
    isVerified: false,
    subscriptionTier: undefined,
    subscriptionStatus: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Store auth token (mock)
  const token = btoa(JSON.stringify({ userId: newUser.id, email: newUser.email }));
  localStorage.setItem('onlyfur-auth-token', token);

  return newUser;
};

export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    // Decode token
    const decoded = JSON.parse(atob(token));
    
    // Find user
    const user = DEMO_USERS.find(u => u.id === decoded.userId);
    return user || null;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return DEMO_USERS.find(u => u.id === id) || null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return DEMO_USERS.find(u => u.email === email) || null;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('onlyfur-auth-token');
  if (!token) return null;
  
  return verifyToken(token);
};

export const logout = (redirectPath?: string): void => {
  localStorage.removeItem('onlyfur-auth-token');
};

// Password hashing functions (mock for frontend)
export const hashPassword = async (password: string): Promise<string> => {
  // In a real app, this would use bcrypt or similar
  // For demo purposes, just return a mock hash
  return btoa(password + 'salt');
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  // In a real app, this would use bcrypt.compare
  // For demo purposes, just compare with mock hash
  return btoa(password + 'salt') === hash;
};

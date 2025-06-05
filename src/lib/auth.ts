// Simple auth implementation without external dependencies for testing
// In production, use proper bcrypt and JWT libraries
import { User } from '@/types';

// Development constants for authentication
const JWT_SECRET = 'onlyfur-super-secret-key-for-development';
const JWT_EXPIRES_IN = '7d';
const BCRYPT_ROUNDS = 12;

// User database simulation (replace with real database in production)
interface UserCredentials {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  role: 'user' | 'creator' | 'admin';
  is_verified: boolean;
  profile_image?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

// Mock database - replace with real database
const mockUsers: UserCredentials[] = [
  {
    id: 'admin-1',
    email: 'admin@onlyfur.com',
    username: 'admin',
    password_hash: '$2a$12$cGFzc3dvcmQxMjNzYWx0', // password123
    role: 'admin',
    is_verified: true,
    profile_image: '/images/branding/fox-mascot.webp',
    bio: 'OnlyFur Platform Administrator',
    created_at: new Date('2024-01-01'),
    updated_at: new Date(),
  },
  {
    id: 'creator-1',
    email: 'demo@onlyfur.com',
    username: 'demofox',
    password_hash: '$2a$12$cGFzc3dvcmQxMjNzYWx0', // password123
    role: 'creator',
    is_verified: true,
    profile_image: '/images/branding/fox-silhouette.jpg',
    bio: 'Furry content creator specializing in fursuit photography and art',
    created_at: new Date('2024-01-15'),
    updated_at: new Date(),
  },
  {
    id: 'creator-2', 
    email: 'demo@creatorhub.com',
    username: 'democreator',
    password_hash: '$2a$12$cGFzc3dvcmQxMjNzYWx0', // password123
    role: 'creator',
    is_verified: true,
    profile_image: '/images/branding/paw-logo.jpg',
    bio: 'Demo creator account for testing',
    created_at: new Date('2024-01-15'),
    updated_at: new Date(),
  }
];

// Simple hash function for development (replace with bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  // Simple mock hash for development
  return `$2a$12$${btoa(password + 'salt').replace(/[+/=]/g, 'x')}`;
}

// Simple password verification for development
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const expectedHash = await hashPassword(password);
  return hash === expectedHash;
}

// Simple token generation for development (replace with JWT in production)
export function generateToken(userId: string, email: string, role: string): string {
  const tokenData = {
    userId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };
  return btoa(JSON.stringify(tokenData));
}

// Simple token verification for development
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

// Authenticate user with email and password
export async function authenticateUser(email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}> {
  try {
    // Find user by email
    const userCredentials = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!userCredentials) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, userCredentials.password_hash);
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Generate token
    const token = generateToken(userCredentials.id, userCredentials.email, userCredentials.role);

    // Return user data (without password hash)
    const user: User = {
      id: userCredentials.id,
      email: userCredentials.email,
      username: userCredentials.username,
      displayName: userCredentials.username,
      role: userCredentials.role,
      isVerified: userCredentials.is_verified,
      avatar: userCredentials.profile_image,
      bio: userCredentials.bio,
      createdAt: userCredentials.created_at,
      updatedAt: userCredentials.updated_at,
    };

    return {
      success: true,
      user,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
}

// Register new user
export async function registerUser(userData: {
  email: string;
  username: string;
  password: string;
  role?: 'user' | 'creator';
}): Promise<{
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}> {
  try {
    // Check if user already exists
    const existingUser = mockUsers.find(
      u => u.email.toLowerCase() === userData.email.toLowerCase() || 
           u.username.toLowerCase() === userData.username.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        error: 'User with this email or username already exists'
      };
    }

    // Validate password strength
    if (userData.password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long'
      };
    }

    // Hash password
    const password_hash = await hashPassword(userData.password);

    // Create new user
    const newUserCredentials: UserCredentials = {
      id: `user-${Date.now()}`,
      email: userData.email,
      username: userData.username,
      password_hash,
      role: userData.role || 'user',
      is_verified: false, // Requires email verification
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Add to mock database
    mockUsers.push(newUserCredentials);

    // Generate token
    const token = generateToken(newUserCredentials.id, newUserCredentials.email, newUserCredentials.role);

    // Return user data
    const user: User = {
      id: newUserCredentials.id,
      email: newUserCredentials.email,
      username: newUserCredentials.username,
      displayName: newUserCredentials.username,
      role: newUserCredentials.role,
      isVerified: newUserCredentials.is_verified,
      createdAt: newUserCredentials.created_at,
      updatedAt: newUserCredentials.updated_at,
    };

    return {
      success: true,
      user,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: 'Registration failed'
    };
  }
}

// Get user by ID
export function getUserById(userId: string): User | null {
  const userCredentials = mockUsers.find(u => u.id === userId);
  
  if (!userCredentials) {
    return null;
  }

  return {
    id: userCredentials.id,
    email: userCredentials.email,
    username: userCredentials.username,
    displayName: userCredentials.username,
    role: userCredentials.role,
    isVerified: userCredentials.is_verified,
    avatar: userCredentials.profile_image,
    bio: userCredentials.bio,
    createdAt: userCredentials.created_at,
    updatedAt: userCredentials.updated_at,
  };
}

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Username validation
export function validateUsername(username: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters long');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Generate secure random token for email verification
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

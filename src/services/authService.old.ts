import { User } from '@/types';
import { apiClient, AuthResponse } from './apiClient';

// Response interface for auth operations
interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  error?: string;
}

  async register(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    role: 'SUBSCRIBER' | 'CREATOR';
  }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email || u.username === userData.username);
      if (existingUser) {
        return { success: false, error: 'User with this email or username already exists' };
      }

      // Create new user
      const newUser: StoredUser = {
        id: this.generateId(),
        email: userData.email,
        username: userData.username,
        displayName: userData.displayName,
        password: userData.password, // In real app, hash this
        role: userData.role.toLowerCase() as 'creator' | 'subscriber',
        isVerified: false,
        authProvider: 'email',
        subscriptionTier: userData.role === 'CREATOR' ? 'basic-creator' : 'basic-subscriber',
        subscriptionStatus: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);
      this.saveUsers(users);

      // Create session
      const token = this.generateToken();
      const sessions = this.getSessions();
      sessions[token] = {
        userId: newUser.id,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };
      this.saveSessions(sessions);

      return {
        success: true,
        user: this.userToPublic(newUser),
        token
      };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  async login(credentials: { 
    email: string; 
    password: string; 
  }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const users = this.getUsers();
      
      // Find user by email
      const user = users.find(u => u.email === credentials.email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Check password (in real app, compare hashed password)
      if (user.password !== credentials.password) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create session
      const token = this.generateToken();
      const sessions = this.getSessions();
      sessions[token] = {
        userId: user.id,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };
      this.saveSessions(sessions);

      // Update last login
      user.updatedAt = new Date();
      this.saveUsers(users);

      return {
        success: true,
        user: this.userToPublic(user),
        token
      };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  async getProfile(token: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const sessions = this.getSessions();
      const session = sessions[token];
      
      if (!session || session.expiresAt < Date.now()) {
        // Clean up expired session
        if (session) {
          delete sessions[token];
          this.saveSessions(sessions);
        }
        return { success: false, error: 'Session expired' };
      }

      const users = this.getUsers();
      const user = users.find(u => u.id === session.userId);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        user: this.userToPublic(user)
      };
    } catch (error) {
      return { success: false, error: 'Failed to get profile' };
    }
  }

  async logout(token: string): Promise<{ success: boolean }> {
    try {
      const sessions = this.getSessions();
      delete sessions[token];
      this.saveSessions(sessions);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async registerOrLoginWithGoogle(googleUser: {
    sub: string;
    email: string;
    name: string;
    picture?: string;
    email_verified: boolean;
  }, userType: 'creator' | 'subscriber'): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const users = this.getUsers();
      
      // Check if user already exists with this Google ID or email
      let existingUser = users.find(u => u.googleId === googleUser.sub || u.email === googleUser.email);
      
      if (existingUser) {
        // Update existing user with Google info if needed
        if (!existingUser.googleId) {
          existingUser.googleId = googleUser.sub;
          existingUser.authProvider = 'google';
          existingUser.isVerified = googleUser.email_verified;
          existingUser.avatar = googleUser.picture;
          existingUser.updatedAt = new Date();
          this.saveUsers(users);
        }
      } else {
        // Create new user
        existingUser = {
          id: this.generateId(),
          email: googleUser.email,
          username: googleUser.email.split('@')[0],
          displayName: googleUser.name,
          password: `google_${googleUser.sub}_temp`, // Temp password for Google users
          role: userType,
          avatar: googleUser.picture,
          isVerified: googleUser.email_verified,
          authProvider: 'google',
          googleId: googleUser.sub,
          subscriptionTier: userType === 'creator' ? 'basic-creator' : 'basic-subscriber',
          subscriptionStatus: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        users.push(existingUser);
        this.saveUsers(users);
      }

      // Create session
      const token = this.generateToken();
      const sessions = this.getSessions();
      sessions[token] = {
        userId: existingUser.id,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };
      this.saveSessions(sessions);

      return {
        success: true,
        user: this.userToPublic(existingUser),
        token
      };
    } catch (error) {
      return { success: false, error: 'Google authentication failed' };
    }
  }

  // Initialize with demo users
  initializeDemoUsers(): void {
    const users = this.getUsers();
    
    if (users.length === 0) {
      const demoUsers: StoredUser[] = [
        {
          id: 'demo-creator-1',
          email: 'demo@creatorhub.com',
          username: 'democreator',
          displayName: 'Demo Creator',
          password: 'password123',
          role: 'creator',
          avatar: '/images/branding/fox-mascot.webp',
          isVerified: true,
          authProvider: 'email',
          subscriptionTier: 'pro-creator',
          subscriptionStatus: 'ACTIVE',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        },
        {
          id: 'demo-subscriber-1',
          email: 'subscriber@demo.com',
          username: 'demosubscriber',
          displayName: 'Demo Subscriber',
          password: 'password123',
          role: 'subscriber',
          isVerified: true,
          authProvider: 'email',
          subscriptionTier: 'premium-subscriber',
          subscriptionStatus: 'ACTIVE',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        }
      ];

      this.saveUsers(demoUsers);
    }
  }
}

// Create singleton instance
const mockDB = new MockAuthDatabase();

// Enhanced Auth Service
export class AuthService {
  private isDevelopment = import.meta.env.DEV;

  constructor() {
    // Initialize demo users in development
    if (this.isDevelopment) {
      mockDB.initializeDemoUsers();
    }
  }

  async register(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    role: 'SUBSCRIBER' | 'CREATOR';
  }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    if (this.isDevelopment) {
      return mockDB.register(userData);
    } else {
      // Real API call would go here
      throw new Error('Production API not implemented');
    }
  }

  async login(credentials: { 
    email: string; 
    password: string; 
  }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    if (this.isDevelopment) {
      return mockDB.login(credentials);
    } else {
      // Real API call would go here
      throw new Error('Production API not implemented');
    }
  }

  async getProfile(token: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (this.isDevelopment) {
      return mockDB.getProfile(token);
    } else {
      // Real API call would go here
      throw new Error('Production API not implemented');
    }
  }

  async logout(token: string): Promise<{ success: boolean }> {
    if (this.isDevelopment) {
      return mockDB.logout(token);
    } else {
      // Real API call would go here
      return { success: true };
    }
  }

  async loginWithGoogle(googleUser: {
    sub: string;
    email: string;
    name: string;
    picture?: string;
    email_verified: boolean;
  }, userType: 'creator' | 'subscriber'): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    if (this.isDevelopment) {
      return mockDB.registerOrLoginWithGoogle(googleUser, userType);
    } else {
      // Real API call would go here
      throw new Error('Production API not implemented');
    }
  }

  // Session management
  setSession(token: string, rememberMe: boolean = false): void {
    setSessionCookie('auth_token', token, rememberMe);
    localStorage.setItem('auth_token', token);
  }

  getSession(): string | null {
    // Try cookie first, then localStorage
    return getCookie('auth_token') || localStorage.getItem('auth_token');
  }

  clearSession(): void {
    deleteCookie('auth_token');
    localStorage.removeItem('auth_token');
  }

  // Enhanced password utilities with automatic features
  getSavedCredentials(): { email: string; password: string; lastUsed?: string } | null {
    try {
      const saved = localStorage.getItem('onlyfur_saved_credentials');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveCredentials(email: string, password: string): void {
    const credentials = {
      email,
      password,
      lastUsed: new Date().toISOString(),
      autoSave: true
    };
    localStorage.setItem('onlyfur_saved_credentials', JSON.stringify(credentials));
  }

  clearSavedCredentials(): void {
    localStorage.removeItem('onlyfur_saved_credentials');
  }

  // Auto-login with saved credentials
  async tryAutoLogin(): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const savedCredentials = this.getSavedCredentials();
      if (!savedCredentials) {
        return { success: false, error: 'No saved credentials' };
      }

      // Attempt automatic login
      const result = await this.login({
        email: savedCredentials.email,
        password: savedCredentials.password
      });

      if (result.success) {
        // Update last used timestamp
        this.saveCredentials(savedCredentials.email, savedCredentials.password);
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Auto-login failed' };
    }
  }

  // Check if auto-login should be attempted
  shouldAttemptAutoLogin(): boolean {
    const session = this.getSession();
    if (session) return false; // Already logged in

    const credentials = this.getSavedCredentials();
    if (!credentials) return false; // No saved credentials

    // Check if credentials were used recently (within 7 days)
    if (credentials.lastUsed) {
      const lastUsed = new Date(credentials.lastUsed);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastUsed > weekAgo;
    }

    return true; // Default to trying auto-login
  }
}

// Export singleton instance
export const authService = new AuthService();

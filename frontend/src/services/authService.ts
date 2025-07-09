import { User } from '@/types';
import { apiClient, AuthResponse } from './apiClient';
import {
  setAuthToken,
  setRefreshToken,
  setUserData,
  setRememberMe,
  getAuthToken,
  getRefreshToken,
  getUserData,
  getRememberMe,
  clearAuthCookies,
  hasValidAuthSession,
  isSessionNearExpiration,
  validateAndCleanupSession
} from '../utils/cookieUtils';

// Response interface for auth operations
interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  error?: string;
}

// Session validation interface
interface SessionValidationResult {
  isValid: boolean;
  needsRefresh: boolean;
  user?: User;
  error?: string;
}

// Mock users for development/offline mode
const MOCK_USERS: (User & { setupComplete: boolean })[] = [
  {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
    role: 'SUBSCRIBER',
    isVerified: true,
    subscriptionStatus: 'ACTIVE',
    setupComplete: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'creator@example.com',
    username: 'creator',
    displayName: 'Test Creator',
    role: 'CREATOR',
    isVerified: true,
    subscriptionStatus: 'ACTIVE',
    setupComplete: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'admin@onlyfur.net',
    username: 'admin',
    displayName: 'Admin User',
    role: 'ADMIN',
    isVerified: true,
    subscriptionStatus: 'ACTIVE',
    setupComplete: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Development mode flag
const IS_DEVELOPMENT = (import.meta as any).env?.MODE === 'development';

// Session storage keys (for saved credentials only - not auth tokens)
const CREDENTIALS_KEY = 'onlyfur_saved_credentials';

class AuthService {
  private isOfflineMode = false;
  private tokenRefreshPromise: Promise<AuthResult> | null = null;
  
  // Initialize periodic session validation
  constructor() {
    // Validate session on startup
    this.validateStoredSession();
    
    // Set up periodic validation every 5 minutes
    setInterval(() => {
      this.periodicSessionValidation();
    }, 5 * 60 * 1000);
    
    // Set up automatic token refresh check
    setInterval(() => {
      this.checkAndRefreshToken();
    }, 60 * 1000); // Check every minute
  }
  
  // Periodic session validation
  private periodicSessionValidation(): void {
    if (!validateAndCleanupSession()) {
      // Session is invalid, could trigger logout or re-authentication
      console.log('Session validation failed, cleaning up');
      this.clearSession();
    }
  }
  
  // Check if token needs refresh and do it automatically
  private async checkAndRefreshToken(): Promise<void> {
    if (!hasValidAuthSession()) return;
    
    if (isSessionNearExpiration()) {
      console.log('Token is near expiration, attempting refresh');
      try {
        await this.refreshAuthToken();
      } catch (error) {
        console.warn('Automatic token refresh failed:', error);
      }
    }
  }
  
  // Validate stored session and return status
  public validateStoredSession(): SessionValidationResult {
    try {
      if (!validateAndCleanupSession()) {
        return { isValid: false, needsRefresh: false, error: 'No valid session found' };
      }
      
      const user = getUserData();
      const needsRefresh = isSessionNearExpiration();
      
      return {
        isValid: true,
        needsRefresh,
        user,
      };
    } catch (error) {
      return { isValid: false, needsRefresh: false, error: 'Session validation failed' };
    }
  }
  
  // Check if backend is available
  private async checkBackendAvailability(): Promise<boolean> {
    try {
      return await apiClient.checkBackendAvailability();
    } catch (error) {
      console.warn('Backend availability check failed:', error);
      return false;
    }
  }

  // Mock authentication for development/offline mode
  private async mockAuth(email: string, password: string): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
    
    // For development, accept any password
    const mockToken = `mock-token-${user.id}-${Date.now()}`;
    const mockRefreshToken = `mock-refresh-${user.id}-${Date.now()}`;
    
    return {
      success: true,
      user,
      token: mockToken,
      refreshToken: mockRefreshToken
    };
  }
  // Mock registration for development/offline mode
  private async mockRegister(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    role: 'creator' | 'subscriber';
  }): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      return {
        success: false,
        error: 'User already exists'
      };
    }
    
    const newUser: User & { setupComplete: boolean } = {
      id: String(MOCK_USERS.length + 1),
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      role: userData.role.toUpperCase() as 'CREATOR' | 'SUBSCRIBER',
      isVerified: true,
      subscriptionStatus: 'ACTIVE',
      setupComplete: false, // New users need setup
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mock users (in memory only)
    MOCK_USERS.push(newUser);
    
    const mockToken = `mock-token-${newUser.id}-${Date.now()}`;
    const mockRefreshToken = `mock-refresh-${newUser.id}-${Date.now()}`;
    
    return {
      success: true,
      user: newUser,
      token: mockToken,
      refreshToken: mockRefreshToken
    };
  }
  // Register a new user
  async register(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    role: 'subscriber' | 'creator';
  }, remember: boolean = false): Promise<AuthResult> {
    try {
      // Check backend availability first
      const backendAvailable = await this.checkBackendAvailability();
      
      if (!backendAvailable || this.isOfflineMode) {
        console.warn('Using offline mode for registration');
        const result = await this.mockRegister(userData);
        
        if (result.success && result.user && result.token) {
          this.setSession(result.token, remember, result.refreshToken, result.user);
        }
        
        return result;
      }
      
      const apiUserData = {
        ...userData,
        role: userData.role.toUpperCase() as 'CREATOR' | 'SUBSCRIBER'
      };
      
      const response = await apiClient.register(apiUserData);
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        if (user && token) {
          // Store session in cookies for persistence
          this.setSession(token, remember, refreshToken, this.normalizeUser(user));
          
          return {
            success: true,
            user: this.normalizeUser(user),
            token,
            refreshToken,
          };
        }
      }      
      return {
        success: false,
        error: response.error || 'Registration failed',
      };
    } catch (error) {
      console.error('Registration error:', error);
      // Fall back to offline mode on network error
      console.warn('Network error, falling back to offline mode');
      const result = await this.mockRegister(userData);
      
      if (result.success && result.user && result.token) {
        this.setSession(result.token, remember, result.refreshToken, result.user);
      }
      
      return result;
    }
  }

  // Login with email and password
  async login(credentials: { 
    email: string; 
    password: string; 
  }, remember: boolean = false): Promise<AuthResult> {
    try {
      // Check backend availability first
      const backendAvailable = await this.checkBackendAvailability();
      
      if (!backendAvailable || this.isOfflineMode) {
        console.warn('Using offline mode for login');
        const result = await this.mockAuth(credentials.email, credentials.password);
        
        if (result.success && result.user && result.token) {
          this.setSession(result.token, remember, result.refreshToken, result.user);
        }
        
        return result;
      }
      
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        if (user && token) {
          // Store session in cookies for persistence
          this.setSession(token, remember, refreshToken, this.normalizeUser(user));
          
          return {
            success: true,
            user: this.normalizeUser(user),
            token,
            refreshToken,
          };
        }
      }
      
      return {
        success: false,
        error: response.error || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      // Fall back to offline mode on network error
      console.warn('Network error, falling back to offline mode');
      const result = await this.mockAuth(credentials.email, credentials.password);
      
      if (result.success && result.user && result.token) {
        this.setSession(result.token, remember, result.refreshToken, result.user);
      }
      
      return result;
    }
  }

  // Login with Google OAuth
  async loginWithGoogle(
    credential: string, 
    userType: 'creator' | 'subscriber' = 'subscriber'
  ): Promise<AuthResult> {
    try {
      const response = await apiClient.loginWithGoogle({
        credential,
        userType,
      });
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        if (user && token) {
          return {
            success: true,
            user: this.normalizeUser(user),
            token,
            refreshToken,
          };
        }
      }
      
      return {
        success: false,
        error: response.error || 'Google login failed',
      };
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: 'Network error during Google login',
      };
    }
  }

  // Register with Google OAuth
  async registerWithGoogle(
    credential: string, 
    userType: 'creator' | 'subscriber' = 'subscriber'
  ): Promise<AuthResult> {
    try {
      const response = await apiClient.registerWithGoogle({
        credential,
        userType,
      });
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        if (user && token) {
          return {
            success: true,
            user: this.normalizeUser(user),
            token,
            refreshToken,
          };
        }
      }
      
      return {
        success: false,
        error: response.error || 'Google registration failed',
      };
    } catch (error) {
      console.error('Google registration error:', error);
      return {
        success: false,
        error: 'Network error during Google registration',
      };
    }
  }

  // Get current user profile
  async getProfile(token?: string): Promise<AuthResult> {
    try {
      // Use provided token or get from storage
      const authToken = token || this.getSession();
      
      if (!authToken) {
        return {
          success: false,
          error: 'No authentication token found',
        };
      }

      const response = await apiClient.getProfile();
      
      if (response.success && response.data) {
        return {
          success: true,
          user: this.normalizeUser(response.data),
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to get profile',
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Network error while fetching profile',
      };
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<AuthResult> {
    try {
      const response = await apiClient.updateProfile(profileData);
      
      if (response.success && response.data) {
        const updatedUser = this.normalizeUser(response.data);
        
        // Update stored user data
        this.updateStoredUser(updatedUser);
        
        return {
          success: true,
          user: updatedUser,
        };
      }
      
      return {
        success: false,
        error: response.error || 'Failed to update profile',
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Network error while updating profile',
      };
    }
  }
  // Refresh authentication token
  async refreshAuthToken(): Promise<AuthResult> {
    // Prevent multiple simultaneous refresh attempts
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }
    
    this.tokenRefreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.tokenRefreshPromise;
      return result;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }
  
  private async performTokenRefresh(): Promise<AuthResult> {
    try {
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        return {
          success: false,
          error: 'No refresh token found',
        };
      }

      const response = await apiClient.refreshToken(refreshToken);
      
      if (response.success && response.data) {
        const { user, token, refreshToken: newRefreshToken } = response.data;
        
        if (token) {
          // Update stored tokens while preserving remember preference
          const remember = this.isRememberMeEnabled();
          this.setSession(token, remember, newRefreshToken || refreshToken, user ? this.normalizeUser(user) : undefined);
          
          console.log('Token refreshed successfully');
          
          return {
            success: true,
            user: user ? this.normalizeUser(user) : undefined,
            token,
            refreshToken: newRefreshToken || refreshToken,
          };
        }
      }
      
      return {
        success: false,
        error: response.error || 'Token refresh failed',
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Network error during token refresh',
      };
    }
  }

  // Logout user
  async logout(): Promise<{ success: boolean }> {
    try {
      // Attempt to logout on server
      await apiClient.logout();
    } catch (error) {
      console.error('Server logout error:', error);
      // Continue with local logout even if server call fails
    }
    
    // Clear local session data
    this.clearSession();
    
    return { success: true };
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.forgotPassword(email);
      
      return {
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: 'Network error while sending reset email',
      };
    }
  }

  // Reset password
  async resetPassword(token: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.resetPassword(token, password);
      
      return {
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'Network error while resetting password',
      };
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.verifyEmail(token);
      
      return {
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: 'Network error while verifying email',
      };
    }
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.resendVerificationEmail();
      
      return {
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: 'Network error while resending verification email',
      };
    }
  }

  // Enhanced session management using secure cookies
  setSession(token: string, remember: boolean = false, refreshToken?: string, user?: User): void {
    try {
      // Set auth token with enhanced security
      setAuthToken(token, remember);
      setRememberMe(remember);
      
      if (refreshToken) {
        setRefreshToken(refreshToken, remember);
      }
      
      if (user) {
        // Ensure no sensitive data is stored
        const safeUser = { ...user };
        delete (safeUser as any).password;
        delete (safeUser as any).passwordHash;
        setUserData(safeUser, remember);
      }
      
      console.log(`Session stored successfully (remember: ${remember})`);
    } catch (error) {
      console.error('Failed to store session:', error);
      throw new Error('Failed to store authentication session');
    }
  }

  getSession(): string | null {
    return getAuthToken();
  }
  
  setRefreshTokenValue(refreshToken: string, remember: boolean = false): void {
    setRefreshToken(refreshToken, remember);
  }

  getRefreshTokenValue(): string | null {
    return getRefreshToken();
  }

  setUser(user: User, remember: boolean = false): void {
    // Ensure no sensitive data is stored
    const safeUser = { ...user };
    delete (safeUser as any).password;
    delete (safeUser as any).passwordHash;
    setUserData(safeUser, remember);
  }

  getStoredUser(): User | null {
    return getUserData();
  }

  updateStoredUser(user: User): void {
    const remember = getRememberMe();
    // Ensure no sensitive data is stored
    const safeUser = { ...user };
    delete (safeUser as any).password;
    delete (safeUser as any).passwordHash;
    setUserData(safeUser, remember);
  }

  isRememberMeEnabled(): boolean {
    return getRememberMe();
  }

  clearSession(): void {
    clearAuthCookies();
    // Don't clear saved credentials on logout - they should persist for "remember me"
    // localStorage.removeItem(CREDENTIALS_KEY);
    this.tokenRefreshPromise = null;
  }

  // Auto-login functionality with enhanced security
  saveCredentials(email: string, password: string): void {
    // Only save email for "remember me" functionality
    // Never save the actual password in plaintext
    const credentials = { 
      email, 
      lastUsed: new Date().toISOString() 
    };
    
    try {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.warn('Failed to save login preferences:', error);
    }
  }

  getSavedCredentials(): { email: string; password: string } | null {
    // This method is kept for compatibility but now returns null
    // since we don't store actual passwords
    return null;
  }
  
  getSavedEmail(): string | null {
    try {
      const stored = localStorage.getItem(CREDENTIALS_KEY);
      if (!stored) return null;
      
      const credentials = JSON.parse(stored);
      return credentials.email || null;
    } catch {
      return null;
    }
  }

  clearSavedCredentials(): void {
    localStorage.removeItem(CREDENTIALS_KEY);
  }

  shouldAttemptAutoLogin(): boolean {
    // Only attempt auto-login if we have a valid stored session
    return hasValidAuthSession();
  }

  async tryAutoLogin(): Promise<AuthResult> {
    // Enhanced auto-login only works with stored tokens, not credentials
    const validation = this.validateStoredSession();
    
    if (!validation.isValid) {
      return { success: false, error: 'No valid session found' };
    }
    
    if (validation.needsRefresh) {
      return await this.refreshAuthToken();
    }
    
    return {
      success: true,
      user: validation.user,
      token: getAuthToken() || undefined
    };
  }

  // User data normalization
  private normalizeUser(userData: any): User {
    return {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      displayName: userData.displayName,
      avatar: userData.avatar,
      role: userData.role,
      isVerified: userData.isVerified,
      authProvider: userData.authProvider,
      googleId: userData.googleId,
      subscriptionTier: userData.subscriptionTier,
      subscriptionStatus: userData.subscriptionStatus,
      createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
      bio: userData.bio,
      coverImage: userData.coverImage,
      socialLinks: userData.socialLinks,
    };
  }

  // Utility methods
  isAuthenticated(): boolean {
    return hasValidAuthSession();
  }

  // Get current authenticated user
  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we have tokens in cookies
      const token = getAuthToken();
      const user = getUserData();
      
      if (!token || !user) {
        return null;
      }

      // Try to validate token with backend
      const backendAvailable = await this.checkBackendAvailability();
      if (!backendAvailable) {
        // If backend is unavailable but we have session data, return cached user
        return user;
      }

      // Validate with backend and get fresh user data
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        const freshUser = this.normalizeUser(response.data);
        // Update cached user data
        setUserData(freshUser, getRememberMe());
        return freshUser;
      }

      // If backend call fails but we have cached data, return cached user
      return user;
    } catch (error) {
      console.error('Get current user failed:', error);
      // Return cached user data if available
      return getUserData();
    }
  }

  getCurrentUserId(): string | null {
    const user = this.getStoredUser();
    return user?.id || null;
  }

  getCurrentUserRole(): string | null {
    const user = this.getStoredUser();
    return user?.role || null;
  }

  isCreator(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'CREATOR' || role === 'creator';
  }

  isAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'ADMIN' || role === 'admin';
  }

  // File upload helper
  async uploadFile(file: File, type: 'avatar' | 'content' | 'cover'): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const response = await apiClient.uploadFile(file, type);
      
      if (response.success && response.data) {
        return {
          success: true,
          url: response.data.url || response.data.fileUrl,
        };
      }
      
      return {
        success: false,
        error: response.error || 'Upload failed',
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: 'Network error during file upload',
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;

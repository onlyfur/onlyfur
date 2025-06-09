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

// Session storage keys
const TOKEN_KEY = 'onlyfur_token';
const REFRESH_TOKEN_KEY = 'onlyfur_refresh_token';
const USER_KEY = 'onlyfur_user';
const REMEMBER_KEY = 'onlyfur_remember';
const CREDENTIALS_KEY = 'onlyfur_saved_credentials';

class AuthService {
  // Register a new user
  async register(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    role: 'SUBSCRIBER' | 'CREATOR';
  }): Promise<AuthResult> {
    try {
      const response = await apiClient.register(userData);
      
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
        error: response.error || 'Registration failed',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error during registration',
      };
    }
  }

  // Login with email and password
  async login(credentials: { 
    email: string; 
    password: string; 
  }): Promise<AuthResult> {
    try {
      const response = await apiClient.login(credentials);
      
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
        error: response.error || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error during login',
      };
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
    try {
      const refreshToken = this.getRefreshToken();
      
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
          // Update stored tokens
          this.setSession(token, this.isRememberMeEnabled());
          if (newRefreshToken) {
            this.setRefreshToken(newRefreshToken);
          }
          
          return {
            success: true,
            user: user ? this.normalizeUser(user) : undefined,
            token,
            refreshToken: newRefreshToken,
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

  // Session management
  setSession(token: string, remember: boolean = false): void {
    const storage = remember ? localStorage : sessionStorage;
    
    storage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_KEY, remember.toString());
    
    // Remove from the other storage type
    const otherStorage = remember ? sessionStorage : localStorage;
    otherStorage.removeItem(TOKEN_KEY);
  }

  getSession(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  setRefreshToken(refreshToken: string): void {
    const storage = this.isRememberMeEnabled() ? localStorage : sessionStorage;
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setUser(user: User): void {
    const storage = this.isRememberMeEnabled() ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  updateStoredUser(user: User): void {
    const storage = this.isRememberMeEnabled() ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  isRememberMeEnabled(): boolean {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
  }

  clearSession(): void {
    // Clear from both storage types
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(TOKEN_KEY);
      storage.removeItem(REFRESH_TOKEN_KEY);
      storage.removeItem(USER_KEY);
    });
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(CREDENTIALS_KEY);
  }

  // Auto-login functionality
  saveCredentials(email: string, password: string): void {
    const credentials = { email, password };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  }

  getSavedCredentials(): { email: string; password: string } | null {
    try {
      const credentials = localStorage.getItem(CREDENTIALS_KEY);
      return credentials ? JSON.parse(credentials) : null;
    } catch {
      return null;
    }
  }

  clearSavedCredentials(): void {
    localStorage.removeItem(CREDENTIALS_KEY);
  }

  shouldAttemptAutoLogin(): boolean {
    return !!this.getSavedCredentials() && this.isRememberMeEnabled();
  }

  async tryAutoLogin(): Promise<AuthResult> {
    const credentials = this.getSavedCredentials();
    
    if (!credentials) {
      return { success: false, error: 'No saved credentials' };
    }

    try {
      const result = await this.login(credentials);
      
      if (!result.success) {
        // Clear invalid credentials
        this.clearSavedCredentials();
      }
      
      return result;
    } catch (error) {
      this.clearSavedCredentials();
      return { success: false, error: 'Auto-login failed' };
    }
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
    return !!this.getSession();
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
    return this.getCurrentUserRole() === 'CREATOR';
  }

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'ADMIN';
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

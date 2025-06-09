import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authService } from '@/services/authService';
import onlineStatusAPI from '@/services/onlineStatusAPI';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: Partial<User> & { password?: string }) => Promise<void>;
  loginWithGoogle: (credential: string, userType: 'creator' | 'subscriber') => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  getSavedCredentials: () => { email: string; password: string } | null;
  saveCredentials: (email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored authentication and attempt auto-login
    const checkAuth = async () => {
      try {
        const storedToken = authService.getSession();
        
        if (storedToken) {
          // Verify existing token and get fresh user data
          const result = await authService.getProfile(storedToken);
          if (result.success && result.user) {
            setUser(result.user);
            setIsLoading(false);
            return; // Session is valid, no need for auto-login
          } else {
            // Token is invalid, clear storage
            authService.clearSession();
          }
        }

        // If no valid session, try auto-login with saved credentials
        if (authService.shouldAttemptAutoLogin()) {
          try {
            const autoLoginResult = await authService.tryAutoLogin();
            if (autoLoginResult.success && autoLoginResult.user && autoLoginResult.token) {
              setUser(autoLoginResult.user);
              authService.setSession(autoLoginResult.token, true); // Remember the auto-login
              console.log('Auto-login successful');
            }
          } catch (autoLoginError) {
            console.log('Auto-login failed:', autoLoginError);
          }
        }
        
      } catch (error) {
        console.error('Failed to validate stored authentication:', error);
        authService.clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login({ email, password });
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Invalid email or password');
      }

      setUser(result.user);
      authService.setSession(result.token, rememberMe);
      
      // Start online status tracking
      onlineStatusAPI.startTracking().catch(console.error);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        authService.saveCredentials(email, password);
      } else {
        authService.clearSavedCredentials();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password?: string }): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!userData.email || !userData.username || !userData.password || !userData.displayName) {
        throw new Error('Email, username, display name, and password are required');
      }

      const result = await authService.register({
        email: userData.email,
        username: userData.username,
        displayName: userData.displayName,
        password: userData.password,
        role: (userData.role as 'SUBSCRIBER' | 'CREATOR') || 'SUBSCRIBER',
      });
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Registration failed');
      }

      setUser(result.user);
      authService.setSession(result.token, true); // Auto-remember for new registrations
      
      // Start online status tracking
      onlineStatusAPI.startTracking().catch(console.error);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string, userType: 'creator' | 'subscriber'): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Decode the JWT credential from Google
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const googleUser = JSON.parse(jsonPayload);
      
      // Use the enhanced auth service for Google login
      const result = await authService.loginWithGoogle(googleUser, userType);
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Google authentication failed');
      }

      setUser(result.user);
      authService.setSession(result.token, true); // Auto-remember for Google login
      
      // Start online status tracking
      onlineStatusAPI.startTracking().catch(console.error);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (redirectPath: string = '/') => {
    try {
      const token = authService.getSession();
      if (token) {
        await authService.logout(token);
      }
      
      // Stop online status tracking
      onlineStatusAPI.stopTracking().catch(console.error);
      
      // Clear user state immediately
      setUser(null);
      
      // Clear all session data
      authService.clearSession();
      
      // Clear any saved credentials if user chooses to logout
      // (Optional: could be configurable)
      
      // Automatic redirect after logout
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100); // Minimal delay for state cleanup
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      authService.clearSession();
      
      // Still redirect to ensure user is logged out locally
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date() };
      setUser(updatedUser);
      // TODO: Implement user update API call to backend
    }
  };

  const clearError = () => {
    setError(null);
  };

  const getSavedCredentials = () => {
    return authService.getSavedCredentials();
  };

  const saveCredentials = (email: string, password: string) => {
    authService.saveCredentials(email, password);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
    clearError,
    getSavedCredentials,
    saveCredentials,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import onlineStatusAPI from '../services/onlineStatusAPI';
import { getRedirectPathAfterLogin } from '../utils/userUtils';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean, onSuccess?: (user: User) => void) => Promise<void>;
  register: (userData: Partial<User> & { password?: string }, onSuccess?: (user: User) => void) => Promise<void>;
  loginWithGoogle: (credential: string, userType: 'creator' | 'subscriber', onSuccess?: (user: User) => void) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  getSavedEmail: () => { email: string; lastUsed: string } | null;
  saveEmail: (email: string) => void;
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
  
  // Ref to track if we've initialized to prevent infinite loops
  const hasInitializedRef = useRef(false);
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initial authentication check - only runs once
  useEffect(() => {
    if (hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    // Enhanced authentication checking and auto-login
    const checkAuth = async () => {
      try {
        // First, validate any stored session
        const sessionValidation = authService.validateStoredSession();
        
        if (sessionValidation.isValid && sessionValidation.user) {
          // We have a valid stored session
          setUser(sessionValidation.user);
          
          // If session needs refresh, do it in background
          if (sessionValidation.needsRefresh) {
            try {
              await authService.refreshAuthToken();
              console.log('Token refreshed in background');
            } catch (error) {
              console.warn('Background token refresh failed:', error);
            }
          }
          
          // Start online status tracking with better error handling
          onlineStatusAPI.startTracking().catch((error) => {
            // Don't let online status errors affect authentication
            console.warn('Online status tracking failed, continuing without it:', error.message);
          });
          
          setIsLoading(false);
          return;
        }
        
        // If no valid session, try to get fresh user data if we have tokens
        const storedToken = authService.getSession();
        const storedUser = authService.getStoredUser();
        
        if (storedToken && storedUser) {
          // Try to verify the token and get fresh user data
          try {
            const result = await authService.getProfile(storedToken);
            if (result.success && result.user) {
              setUser(result.user);
              
              // Start online status tracking with better error handling
              onlineStatusAPI.startTracking().catch((error) => {
                console.warn('Online status tracking failed, continuing without it:', error.message);
              });
              
              setIsLoading(false);
              return;
            } else {
              // Token is invalid, clear storage
              console.log('Stored token is invalid, clearing session');
              authService.clearSession();
            }
          } catch (error) {
            console.warn('Token validation failed:', error);
            authService.clearSession();
          }
        }

        // If still no valid session, try auto-login (only if valid session exists)
        if (authService.shouldAttemptAutoLogin()) {
          try {
            const autoLoginResult = await authService.tryAutoLogin();
            if (autoLoginResult.success && autoLoginResult.user) {
              setUser(autoLoginResult.user);
              
              // Start online status tracking with better error handling
              onlineStatusAPI.startTracking().catch((error) => {
                console.warn('Online status tracking failed, continuing without it:', error.message);
              });
              
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
  
  // Separate effect for session monitoring - only starts after user is set
  useEffect(() => {
    if (!user) {
      // Clear any existing interval when user logs out
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
        sessionCheckIntervalRef.current = null;
      }
      return;
    }
    
    // Set up session monitoring only when user is authenticated
    if (sessionCheckIntervalRef.current) {
      clearInterval(sessionCheckIntervalRef.current);
    }
    
    sessionCheckIntervalRef.current = setInterval(() => {
      // Periodically validate session
      const validation = authService.validateStoredSession();
      if (!validation.isValid) {
        console.log('Session expired, logging out user');
        setUser(null);
        authService.clearSession();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => {
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
        sessionCheckIntervalRef.current = null;
      }
    };
  }, [user?.id]); // Only depend on user ID to prevent unnecessary re-runs

  const login = async (email: string, password: string, rememberMe: boolean = false, onSuccess?: (user: User) => void): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login({ email, password });
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Invalid email or password');
      }

      setUser(result.user);
      authService.setSession(result.token, rememberMe, result.refreshToken, result.user);
      
      // Start online status tracking with better error handling
      onlineStatusAPI.startTracking().catch((error) => {
        console.warn('Online status tracking failed, continuing without it:', error.message);
      });
      
      // Save user email preference for convenience (but not password)
      if (rememberMe) {
        authService.saveEmail(email);
      } else {
        authService.clearSavedEmail();
      }

      // Call success callback with user data
      if (onSuccess) {
        onSuccess(result.user);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  const register = async (userData: Partial<User> & { password?: string }, onSuccess?: (user: User) => void): Promise<void> => {
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
        role: (userData.role?.toLowerCase?.() as 'subscriber' | 'creator') || 'subscriber',
      });
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Registration failed');
      }

      setUser(result.user);
      authService.setSession(result.token, true, result.refreshToken, result.user); // Auto-remember for new registrations
      
      // Start online status tracking with better error handling
      onlineStatusAPI.startTracking().catch((error) => {
        console.warn('Online status tracking failed, continuing without it:', error.message);
      });

      // Call success callback with user data
      if (onSuccess) {
        onSuccess(result.user);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  const loginWithGoogle = async (credential: string, userType: 'creator' | 'subscriber', onSuccess?: (user: User) => void): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Pass the credential directly to the auth service (don't decode manually)
      const result = await authService.loginWithGoogle(credential, userType);
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Google authentication failed');
      }

      setUser(result.user);
      authService.setSession(result.token, true, result.refreshToken, result.user); // Auto-remember for Google login
      
      // Start online status tracking with better error handling
      onlineStatusAPI.startTracking().catch((error) => {
        console.warn('Online status tracking failed, continuing without it:', error.message);
      });

      // Call success callback with user data
      if (onSuccess) {
        onSuccess(result.user);
      }
      
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
      // Stop online status tracking BEFORE clearing session data
      onlineStatusAPI.stopTracking().catch(console.error);
      
      const token = authService.getSession();
      if (token) {
        await authService.logout();
      }
      
      // Clear user state immediately
      setUser(null);
      
      // Clear all session data (already done by authService.logout(), but keeping for safety)
      authService.clearSession();
      
      // Clear any saved credentials if user chooses to logout
      // (Optional: could be configurable)
      
      // Automatic redirect after logout
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100); // Minimal delay for state cleanup
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, stop tracking and clear local state
      onlineStatusAPI.stopTracking().catch(console.error);
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

  const getSavedEmail = () => {
    return authService.getSavedEmail();
  };

  const saveEmail = (email: string) => {
    authService.saveEmail(email);
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
    getSavedEmail,
    saveEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

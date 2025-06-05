import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password?: string }) => Promise<void>;
  loginWithGoogle: (credential: string, userType: 'creator' | 'subscriber') => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
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
    // Check for stored authentication on component mount
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedToken) {
          // Verify token with backend and get fresh user data
          const result = await authAPI.getProfile();
          if (result.user) {
            setUser(result.user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Failed to validate stored authentication:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authAPI.login({ email, password });
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Invalid email or password');
      }

      setUser(result.user);
      localStorage.setItem('auth_token', result.token);
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

      const result = await authAPI.register({
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
      localStorage.setItem('auth_token', result.token);
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
      
      // For demo purposes, create a user account automatically
      const newUser: User = {
        id: `google_${googleUser.sub}`,
        email: googleUser.email,
        username: googleUser.email.split('@')[0],
        displayName: googleUser.name,
        avatar: googleUser.picture,
        role: userType,
        isVerified: googleUser.email_verified,
        authProvider: 'google',
        googleId: googleUser.sub,
        subscriptionTier: userType === 'creator' ? 'basic-creator' : 'basic-subscriber',
        subscriptionStatus: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Try to register this user in the backend
      try {
        const result = await authAPI.register({
          email: newUser.email,
          username: newUser.username,
          displayName: newUser.displayName,
          password: `google_${googleUser.sub}_temp_password`, // Temporary password for Google users
          role: userType.toUpperCase() as 'SUBSCRIBER' | 'CREATOR',
        });
        
        setUser(result.user);
        localStorage.setItem('auth_token', result.token);
      } catch (backendError) {
        // If backend registration fails, try to login (user might already exist)
        try {
          const loginResult = await authAPI.login({
            email: newUser.email,
            password: `google_${googleUser.sub}_temp_password`,
          });
          
          setUser(loginResult.user);
          localStorage.setItem('auth_token', loginResult.token);
        } catch (loginError) {
          // If both fail, create a local session (demo mode)
          setUser(newUser);
          localStorage.setItem('auth_token', btoa(JSON.stringify({ userId: newUser.id, email: newUser.email })));
        }
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

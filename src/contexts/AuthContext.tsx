import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authenticateUser, registerUser, verifyToken, getUserById, getCurrentUser, logout as authLogout } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password?: string }) => Promise<void>;
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
        // Use consistent getCurrentUser function
        const user = await getCurrentUser();
        
        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('Failed to validate stored authentication:', error);
        // Clear any invalid tokens
        localStorage.removeItem('onlyfur-auth-token');
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
      // authenticateUser returns the user directly and handles token storage internally
      const user = await authenticateUser(email, password);
      setUser(user);
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
      if (!userData.email || !userData.username || !userData.password) {
        throw new Error('Email, username, and password are required');
      }

      // registerUser returns the user directly and handles token storage internally
      const user = await registerUser(userData);
      setUser(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authLogout(); // This removes the correct localStorage key
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date() };
      setUser(updatedUser);
      // For demo purposes, we don't persist user updates to localStorage
      // In a real app, this would update the backend
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

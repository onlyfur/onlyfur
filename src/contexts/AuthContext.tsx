import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authenticateUser, registerUser, verifyToken, getUserById } from '@/lib/auth';

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
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('onlyfur-token');
        const storedUser = localStorage.getItem('onlyfur-user');
        
        if (storedToken && storedUser) {
          // Verify token validity
          const tokenData = verifyToken(storedToken);
          
          if (tokenData) {
            // Token is valid, get fresh user data
            const user = getUserById(tokenData.userId);
            if (user) {
              setUser(user);
            } else {
              // User not found, clear storage
              localStorage.removeItem('onlyfur-user');
              localStorage.removeItem('onlyfur-token');
            }
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('onlyfur-user');
            localStorage.removeItem('onlyfur-token');
          }
        }
      } catch (error) {
        console.error('Failed to validate stored authentication:', error);
        localStorage.removeItem('onlyfur-user');
        localStorage.removeItem('onlyfur-token');
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
      // Use real authentication with password hashing
      const result = await authenticateUser(email, password);
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Invalid email or password');
      }

      setUser(result.user);
      localStorage.setItem('onlyfur-user', JSON.stringify(result.user));
      localStorage.setItem('onlyfur-token', result.token);
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
    try {
      if (!userData.email || !userData.username || !userData.password) {
        throw new Error('Email, username, and password are required');
      }

      // Use real registration with password hashing
      const result = await registerUser({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        role: (userData.role as 'user' | 'creator') || 'user',
      });
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Registration failed');
      }

      setUser(result.user);
      localStorage.setItem('onlyfur-user', JSON.stringify(result.user));
      localStorage.setItem('onlyfur-token', result.token);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('onlyfur-user');
    localStorage.removeItem('onlyfur-token');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date() };
      setUser(updatedUser);
      localStorage.setItem('onlyfur-user', JSON.stringify(updatedUser));
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

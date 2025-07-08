/**
 * Production API Configuration
 * This file handles API calls in production to prevent CORS errors
 */

// In production (Vercel), API calls should be relative since both frontend and API are served from same domain
const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

export const API_CONFIG = {
  baseUrl: isProduction ? '' : (import.meta.env?.VITE_API_URL || 'http://localhost:3001'),
  isDevelopment: !isProduction,
  isProduction: isProduction,
};

// Build proper API URL for the current environment
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (API_CONFIG.isProduction) {
    // In production, use relative URLs
    return cleanEndpoint;
  } else {
    // In development, use full URL with base
    return `${API_CONFIG.baseUrl}${cleanEndpoint}`;
  }
}

// Enhanced fetch with error handling for production
export async function safeFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(endpoint);
  
  // Add default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Add auth token if available
  const token = localStorage.getItem('onlyfur_auth_token') || localStorage.getItem('auth_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    // Only include credentials in same-origin requests
    credentials: API_CONFIG.isProduction ? 'same-origin' : 'include',
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    // Only log in development
    if (API_CONFIG.isDevelopment) {
      console.error('API fetch error:', { url, error });
    }
    throw error;
  }
}

// Safe JSON fetch with error handling
export async function fetchJson<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await safeFetch(endpoint, options);
  
  if (!response.ok) {
    // Handle auth errors
    if (response.status === 401) {
      localStorage.removeItem('onlyfur_auth_token');
      localStorage.removeItem('auth_token');
      if (API_CONFIG.isDevelopment) {
        console.warn('Authentication expired');
      }
      throw new Error('Authentication required');
    }
    
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}

// Debounced API calls to prevent spam
class ApiDebouncer {
  private timers = new Map<string, NodeJS.Timeout>();
  
  debounce<T extends (...args: any[]) => Promise<any>>(
    key: string,
    fn: T,
    delay: number = 1000
  ): T {
    return ((...args: any[]) => {
      return new Promise((resolve, reject) => {
        // Clear existing timer
        const existingTimer = this.timers.get(key);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }
        
        // Set new timer
        const timer = setTimeout(async () => {
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            this.timers.delete(key);
          }
        }, delay);
        
        this.timers.set(key, timer);
      });
    }) as T;
  }
}

export const apiDebouncer = new ApiDebouncer();

// Environment info for debugging
export const getEnvironmentInfo = () => ({
  isProduction: API_CONFIG.isProduction,
  isDevelopment: API_CONFIG.isDevelopment,
  baseUrl: API_CONFIG.baseUrl,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
  mode: import.meta.env?.MODE || 'unknown'
});

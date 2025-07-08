/**
 * API Configuration and URL handling
 * Prevents CORS issues in production by properly handling API endpoints
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Get the correct API base URL based on environment
function getApiBaseUrl(): string {
  // In production (Vercel), use relative URLs since API is served from same domain
  if (isProduction) {
    return '';
  }
  
  // In development, use the configured API URL or default to localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
}

// Build proper API URL
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (baseUrl) {
    return `${baseUrl}${cleanEndpoint}`;
  }
  
  return cleanEndpoint;
}

// Enhanced fetch with proper error handling and CORS prevention
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = buildApiUrl(endpoint);
  
  // Add default headers for better CORS handling
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge with provided headers
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  // Add auth token if available
  const token = localStorage.getItem('onlyfur_auth_token') || localStorage.getItem('auth_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    // Add credentials for CORS
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    
    // Log CORS errors for debugging
    if (!response.ok && response.status === 0) {
      console.warn('CORS error detected:', { url, status: response.status });
    }
    
    return response;
  } catch (error) {
    console.error('API fetch error:', { url, error });
    throw error;
  }
}

// Enhanced fetch with JSON response handling
export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(endpoint, options);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Rate limited fetch to prevent API spam
class RateLimitedFetcher {
  private pendingRequests = new Map<string, Promise<any>>();
  private lastRequestTime = new Map<string, number>();
  private minInterval = 1000; // Minimum 1 second between requests to same endpoint

  async fetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const key = `${options.method || 'GET'}:${endpoint}`;
    const now = Date.now();
    const lastRequest = this.lastRequestTime.get(key) || 0;
    
    // If there's already a pending request for this endpoint, return it
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    // Rate limiting: ensure minimum interval between requests
    const timeSinceLastRequest = now - lastRequest;
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest));
    }
    
    // Make the request
    const promise = apiRequest<T>(endpoint, options);
    this.pendingRequests.set(key, promise);
    this.lastRequestTime.set(key, Date.now());
    
    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(key);
    }
  }
}

export const rateLimitedApi = new RateLimitedFetcher();

// Environment info for debugging
export const apiConfig = {
  isDevelopment,
  isProduction,
  baseUrl: getApiBaseUrl(),
  mode: import.meta.env.MODE,
};

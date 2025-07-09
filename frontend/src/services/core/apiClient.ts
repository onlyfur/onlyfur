import { APIResponse } from '../types/onlineStatus.types';

// Use fetch instead of axios for better CORS compatibility
const API_BASE_URL = (() => {
  if ((import.meta as any).env?.VITE_API_BASE_URL) {
    return (import.meta as any).env.VITE_API_BASE_URL;
  } else if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    
    if (currentHost === 'onlyfur.net' || currentHost === 'www.onlyfur.net') {
      return '/api';
    } else if (currentHost === 'creatorplattform.vercel.app') {
      return '/api';
    } else if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:3001/api';
    } else {
      return '/api';
    }
  } else {
    return '/api';
  }
})();

export class OnlineStatusAPIClient {
  private baseURL = `${API_BASE_URL}/online-status`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        credentials: 'include', // Important for CORS with cookies
      });

      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || data.message || `Request failed with status ${response.status}` 
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('Online status API request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Unable to connect to server. Please check your internet connection and try again.',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }
}

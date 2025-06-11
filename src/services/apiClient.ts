// API client for backend communication

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: any;
    token: string;
    refreshToken?: string;
  };
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    // Use environment variable or fallback to production server
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getStoredToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('onlyfur_token') || sessionStorage.getItem('onlyfur_token');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        // Handle different error response formats
        if (data.error) {
          return { success: false, error: data.error };
        } else if (data.message) {
          return { success: false, error: data.message };
        } else if (data.errors) {
          // Validation errors
          const errorMessages = Object.values(data.errors).flat().join(', ');
          return { success: false, error: errorMessages, errors: data.errors };
        } else {
          return { success: false, error: `Request failed with status ${response.status}` };
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network error. Please check your connection and try again.',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  // Authentication endpoints
  async register(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    role: 'CREATOR' | 'SUBSCRIBER';
  }): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    return {
      success: response.success,
      data: response.data ? {
        user: (response.data as any).user || response.data,
        token: (response.data as any).token,
        refreshToken: (response.data as any).refreshToken
      } : undefined,
      message: response.message,
      error: response.error
    };
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    return {
      success: response.success,
      data: response.data ? {
        user: (response.data as any).user || response.data,
        token: (response.data as any).token,
        refreshToken: (response.data as any).refreshToken
      } : undefined,
      message: response.message,
      error: response.error
    };
  }

  async loginWithGoogle(googleData: {
    credential: string;
    userType?: 'creator' | 'subscriber';
  }): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
    
    return {
      success: response.success,
      data: response.data ? {
        user: (response.data as any).user || response.data,
        token: (response.data as any).token,
        refreshToken: (response.data as any).refreshToken
      } : undefined,
      message: response.message,
      error: response.error
    };
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/profile');
  }

  async updateProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    
    return {
      success: response.success,
      data: response.data ? {
        user: (response.data as any).user || response.data,
        token: (response.data as any).token,
        refreshToken: (response.data as any).refreshToken
      } : undefined,
      message: response.message,
      error: response.error
    };
  }

  async logout(): Promise<ApiResponse> {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.makeRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(): Promise<ApiResponse> {
    return this.makeRequest('/auth/resend-verification', {
      method: 'POST',
    });
  }

  // Content endpoints
  async getContent(page: number = 1, limit: number = 20): Promise<ApiResponse> {
    return this.makeRequest(`/content?page=${page}&limit=${limit}`);
  }

  async getContentById(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/content/${id}`);
  }

  async createContent(contentData: FormData): Promise<ApiResponse> {
    return this.makeRequest('/content', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData - let browser set it with boundary
        ...(this.getStoredToken() && { Authorization: `Bearer ${this.getStoredToken()}` }),
      },
      body: contentData,
    });
  }

  async updateContent(id: string, contentData: any): Promise<ApiResponse> {
    return this.makeRequest(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  }

  async deleteContent(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/content/${id}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUsers(page: number = 1, limit: number = 20): Promise<ApiResponse> {
    return this.makeRequest(`/users?page=${page}&limit=${limit}`);
  }

  async getUserById(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/users/${id}`);
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse> {
    return this.makeRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Upload endpoints
  async uploadFile(file: File, type: 'avatar' | 'content' | 'cover'): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.makeRequest('/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData
        ...(this.getStoredToken() && { Authorization: `Bearer ${this.getStoredToken()}` }),
      },
      body: formData,
    });
  }

  // Subscription endpoints
  async getSubscriptionTiers(): Promise<ApiResponse> {
    return this.makeRequest('/subscriptions/tiers');
  }

  async subscribe(tierId: string): Promise<ApiResponse> {
    return this.makeRequest('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ tierId }),
    });
  }

  async getSubscriptionStatus(): Promise<ApiResponse> {
    return this.makeRequest('/subscriptions/status');
  }

  // Analytics endpoints
  async getAnalytics(type: string): Promise<ApiResponse> {
    return this.makeRequest(`/analytics/${type}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('/health');
  }

  // Generic request method for custom endpoints
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, options);
  }
}

export const apiClient = new ApiClient();
export default apiClient;

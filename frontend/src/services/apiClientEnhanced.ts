import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClientEnhanced {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.token = token;
    }
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  async register(userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
  }) {
    const response = await this.client.post('/auth-v2/register', userData);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async login(credentials: {
    email?: string;
    username?: string;
    password: string;
  }) {
    const response = await this.client.post('/auth-v2/login', credentials);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async googleAuth(token: string) {
    const response = await this.client.post('/auth-v2/google', { token });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async logout() {
    try {
      await this.client.post('/auth-v2/logout');
    } finally {
      this.clearToken();
    }
  }

  async verifyToken() {
    const response = await this.client.get('/auth-v2/verify-token');
    return response.data;
  }

  async getCurrentProfile() {
    const response = await this.client.get('/auth-v2/profile');
    return response.data;
  }

  async updateProfile(profileData: FormData) {
    const response = await this.client.put('/auth-v2/profile', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async deleteAccount(data: { password?: string; confirmDelete: boolean }) {
    const response = await this.client.delete('/auth-v2/delete-account', { data });
    this.clearToken();
    return response.data;
  }

  async getUserProfile(userId: string) {
    const response = await this.client.get(`/users-v2/profile/${userId}`);
    return response.data;
  }

  async updateUserProfile(profileData: FormData) {
    const response = await this.client.put('/users-v2/profile', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async getUserSettings() {
    const response = await this.client.get('/users-v2/settings');
    return response.data;
  }

  async updateUserSettings(settings: any) {
    const response = await this.client.put('/users-v2/settings', settings);
    return response.data;
  }

  async searchUsers(params: {
    q: string;
    limit?: number;
    offset?: number;
    role?: string;
    isVerified?: boolean;
    sortBy?: string;
  }) {
    const response = await this.client.get('/users-v2/search', { params });
    return response.data;
  }

  async getUserFollowers(userId: string, params?: { limit?: number; offset?: number }) {
    const response = await this.client.get(`/users-v2/${userId}/followers`, { params });
    return response.data;
  }

  async getUserFollowing(userId: string, params?: { limit?: number; offset?: number }) {
    const response = await this.client.get(`/users-v2/${userId}/following`, { params });
    return response.data;
  }

  async followUser(userId: string) {
    const response = await this.client.post(`/users-v2/follow/${userId}`);
    return response.data;
  }

  async unfollowUser(userId: string) {
    const response = await this.client.post(`/users-v2/unfollow/${userId}`);
    return response.data;
  }

  async uploadContent(contentData: FormData) {
    const response = await this.client.post('/content-v2/upload', contentData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000
    });
    return response.data;
  }

  async updateContent(contentId: string, contentData: FormData) {
    const response = await this.client.put(`/content-v2/${contentId}`, contentData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000
    });
    return response.data;
  }

  async getContent(contentId: string) {
    const response = await this.client.get(`/content-v2/${contentId}`);
    return response.data;
  }

  async deleteContent(contentId: string) {
    const response = await this.client.delete(`/content-v2/${contentId}`);
    return response.data;
  }

  async getMyContent(params?: {
    type?: string;
    status?: string;
    isPublic?: boolean;
    isPremium?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const response = await this.client.get('/content-v2/my-content', { params });
    return response.data;
  }

  async getContentFeed(params?: {
    type?: string;
    category?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: string;
  }) {
    const response = await this.client.get('/content-v2/feed', { params });
    return response.data;
  }

  async getStripeCustomer() {
    const response = await this.client.get('/stripe/customer');
    return response.data;
  }

  async getSubscriptions() {
    const response = await this.client.get('/stripe/subscriptions');
    return response.data;
  }

  async createSubscription(data: {
    creatorId: string;
    tier: string;
    paymentMethodId?: string;
  }) {
    const response = await this.client.post('/stripe/subscriptions', data);
    return response.data;
  }

  async cancelSubscription(subscriptionId: string, data?: { cancelImmediately?: boolean }) {
    const response = await this.client.post(`/stripe/subscriptions/${subscriptionId}/cancel`, data);
    return response.data;
  }

  async getInvoices() {
    const response = await this.client.get('/stripe/invoices');
    return response.data;
  }

  async downloadInvoice(invoiceId: string) {
    const response = await this.client.get(`/stripe/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    });
    return response;
  }

  async getSpendingStats() {
    const response = await this.client.get('/stripe/spending');
    return response.data;
  }

  handleError(error: any): string {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  createProfileFormData(data: {
    displayName?: string;
    bio?: string;
    socialLinks?: any;
    preferredLanguage?: string;
    timezone?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    marketingEmails?: boolean;
    avatar?: File;
    coverImage?: File;
  }): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'avatar' || key === 'coverImage') {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return formData;
  }

  createContentFormData(data: {
    title: string;
    description?: string;
    type: string;
    tags?: string[];
    isPublic?: boolean;
    isPremium?: boolean;
    price?: number;
    category?: string;
    metadata?: any;
    mainFile?: File;
    thumbnail?: File;
    additionalFiles?: File[];
  }): FormData {
    const formData = new FormData();

    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('type', data.type);
    if (data.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));
    if (data.isPremium !== undefined) formData.append('isPremium', String(data.isPremium));
    if (data.price !== undefined) formData.append('price', String(data.price));
    if (data.category) formData.append('category', data.category);

    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (data.metadata) formData.append('metadata', JSON.stringify(data.metadata));

    if (data.mainFile) formData.append('mainFile', data.mainFile);
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    if (data.additionalFiles) {
      data.additionalFiles.forEach(file => {
        formData.append('additionalFiles', file);
      });
    }

    return formData;
  }
}

export const apiClientEnhanced = new ApiClientEnhanced();
export default apiClientEnhanced;

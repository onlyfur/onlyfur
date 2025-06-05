const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    username: string;
    displayName: string;
    password: string;
    role: 'SUBSCRIBER' | 'CREATOR';
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/me');
  },
};

// Subscription API
export const subscriptionAPI = {
  getTiers: async () => {
    // Use real API endpoint instead of mock data
    return apiRequest('/subscriptions/tiers');
  },

  subscribe: async (tierId: string) => {
    return apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ tierId }),
    });
  },

  cancel: async () => {
    return apiRequest('/subscriptions/cancel', {
      method: 'POST',
    });
  },

  getStatus: async () => {
    return apiRequest('/subscriptions/status');
  },
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: async (data: {
    tierId: string;
    amount: number;
    currency: string;
  }) => {
    return apiRequest('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  confirmPayment: async (paymentIntentId: string) => {
    return apiRequest('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    });
  },
};

// Combined function for easier use
export const createSubscriptionPayment = async (data: {
  tierId: string;
  amount: number;
  currency: string;
}) => {
  return paymentAPI.createPaymentIntent(data);
};

// Content API
export const contentAPI = {
  getContent: async () => {
    return apiRequest('/content');
  },

  createContent: async (contentData: {
    title: string;
    description: string;
    type: string;
    requiredTier: string;
    mediaUrls: string[];
    tags: string[];
  }) => {
    return apiRequest('/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  },

  updateContent: async (contentId: string, contentData: any) => {
    return apiRequest(`/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  },

  deleteContent: async (contentId: string) => {
    return apiRequest(`/content/${contentId}`, {
      method: 'DELETE',
    });
  },

  seedContent: async () => {
    return apiRequest('/content/seed', { method: 'POST' });
  },
};

// User API
export const userAPI = {
  getProfile: async (userId?: string) => {
    const endpoint = userId ? `/users/${userId}` : '/users/me';
    return apiRequest(endpoint);
  },

  updateProfile: async (profileData: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: any;
  }) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getFollowers: async (userId: string) => {
    return apiRequest(`/users/${userId}/followers`);
  },

  getFollowing: async (userId: string) => {
    return apiRequest(`/users/${userId}/following`);
  },

  follow: async (userId: string) => {
    return apiRequest(`/users/${userId}/follow`, {
      method: 'POST',
    });
  },

  unfollow: async (userId: string) => {
    return apiRequest(`/users/${userId}/unfollow`, {
      method: 'POST',
    });
  },
};

// Upload API
export const uploadAPI = {
  uploadFile: async (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        // Don't set Content-Type for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  uploadAvatar: async (file: File) => {
    return uploadAPI.uploadFile(file, 'avatars');
  },

  uploadContent: async (file: File) => {
    return uploadAPI.uploadFile(file, 'content');
  },
};

// Messaging API
export const messagingAPI = {
  getConversations: async () => {
    return apiRequest('/messages/conversations');
  },

  getMessages: async (conversationId: string) => {
    return apiRequest(`/messages/${conversationId}`);
  },

  sendMessage: async (data: {
    recipientId?: string;
    conversationId?: string;
    content: string;
    type?: string;
  }) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  markAsRead: async (conversationId: string) => {
    return apiRequest(`/messages/${conversationId}/read`, {
      method: 'POST',
    });
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
};

export default {
  auth: authAPI,
  subscription: subscriptionAPI,
  payment: paymentAPI,
  content: contentAPI,
  user: userAPI,
  upload: uploadAPI,
  messaging: messagingAPI,
  healthCheck,
};

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
    // For demo purposes, return mock data instead of API call
    const { subscriberTiers, creatorTiers } = await import('@/data/subscriptionTiers');
    
    // Convert to the format expected by the frontend
    const allTiers = [
      ...subscriberTiers.map(tier => ({ ...tier, type: 'SUBSCRIBER' })),
      ...creatorTiers.map(tier => ({ ...tier, type: 'CREATOR' }))
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return allTiers;
  },

  subscribe: async (tierId: string) => {
    return apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ tierId }),
    });
  },
};

// Content API
export const contentAPI = {
  getContent: async () => {
    return apiRequest('/content');
  },

  seedContent: async () => {
    return apiRequest('/content/seed', { method: 'POST' });
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
};

export default {
  auth: authAPI,
  subscription: subscriptionAPI,
  content: contentAPI,
  healthCheck,
};

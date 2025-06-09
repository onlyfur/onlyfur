// Google OAuth configuration and utilities

interface GoogleConfig {
  clientId: string;
  redirectUri: string;
}

class GoogleAuthService {
  private config: GoogleConfig;
  private isInitialized = false;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    };
  }

  // Initialize Google OAuth
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.config.clientId) {
      console.warn('Google OAuth not configured - VITE_GOOGLE_CLIENT_ID missing');
      return;
    }

    try {
      // Load Google OAuth script if not already loaded
      if (!window.google) {
        await this.loadGoogleScript();
      }

      // Initialize Google OAuth
      await new Promise<void>((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: this.config.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        
        this.isInitialized = true;
        resolve();
      });
    } catch (error) {
      console.error('Failed to initialize Google OAuth:', error);
      throw error;
    }
  }

  // Load Google OAuth script dynamically
  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="accounts.google.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google OAuth script'));
      
      document.head.appendChild(script);
    });
  }

  // Handle credential response from Google
  private handleCredentialResponse(response: any): void {
    // This is just a fallback - actual handling should be done by components
    console.log('Google credential response:', response);
  }

  // Render Google Sign-In button
  renderButton(element: HTMLElement, options: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    width?: number;
    callback?: (response: any) => void;
  } = {}): void {
    if (!this.isInitialized) {
      console.warn('Google OAuth not initialized');
      return;
    }

    const defaultOptions = {
      theme: 'outline' as const,
      size: 'large' as const,
      text: 'signin_with' as const,
      shape: 'rectangular' as const,
      width: 280,
    };

    const config = { ...defaultOptions, ...options };

    // Set custom callback if provided
    if (config.callback) {
      window.google.accounts.id.initialize({
        client_id: this.config.clientId,
        callback: config.callback,
      });
    }

    window.google.accounts.id.renderButton(element, {
      theme: config.theme,
      size: config.size,
      text: config.text,
      shape: config.shape,
      width: config.width,
    });
  }

  // Programmatic sign-in
  async signIn(): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Google OAuth not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to popup
            this.openPopup().then(resolve).catch(reject);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Open Google OAuth popup
  private openPopup(): Promise<any> {
    return new Promise((resolve, reject) => {
      const popup = window.open(
        `https://accounts.google.com/oauth/authorize?` +
        `client_id=${this.config.clientId}&` +
        `redirect_uri=${encodeURIComponent(this.config.redirectUri)}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `state=${Math.random().toString(36)}`,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('Failed to open popup'));
        return;
      }

      // Listen for messages from popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve(event.data.credential);
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          window.removeEventListener('message', messageListener);
          popup.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          reject(new Error('Popup closed by user'));
        }
      }, 1000);
    });
  }

  // Get user info from Google
  async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Google user info:', error);
      throw error;
    }
  }

  // Check if Google OAuth is available
  isAvailable(): boolean {
    return !!this.config.clientId && this.isInitialized;
  }

  // Get configuration
  getConfig(): GoogleConfig {
    return { ...this.config };
  }
}

// Extend Window interface for Google OAuth
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: any) => void;
          cancel: () => void;
          onGoogleLibraryLoad: () => void;
        };
      };
    };
  }
}

// Export singleton instance
export const googleAuthService = new GoogleAuthService();
export default googleAuthService;

// Utility functions
export const parseJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;
  
  return Date.now() >= payload.exp * 1000;
};

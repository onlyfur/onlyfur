import { OAuth2Client } from 'google-auth-library';
import { logger } from '../middleware/logger';

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
}

class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      logger.warn('Google OAuth not configured - GOOGLE_CLIENT_ID missing');
    }
    this.client = new OAuth2Client(clientId);
  }

  /**
   * Verify Google ID token and extract user information
   */
  async verifyIdToken(idToken: string): Promise<GoogleUserInfo | null> {
    try {
      if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error('Google OAuth not configured');
      }

      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      // Extract user information
      const userInfo: GoogleUserInfo = {
        id: payload.sub,
        email: payload.email!,
        name: payload.name || payload.email!,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        email_verified: payload.email_verified,
      };

      logger.info('Google token verified successfully', {
        userId: userInfo.id,
        email: userInfo.email,
      });

      return userInfo;
    } catch (error) {
      logger.error('Google token verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Verify Google credential (for Google Sign-In)
   */
  async verifyCredential(credential: string): Promise<GoogleUserInfo | null> {
    try {
      // The credential from Google Sign-In is actually an ID token
      return await this.verifyIdToken(credential);
    } catch (error) {
      logger.error('Google credential verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Generate a unique username from Google user info
   */
  generateUsername(userInfo: GoogleUserInfo): string {
    // Start with the part before @ in email
    let baseUsername = userInfo.email.split('@')[0];
    
    // If we have a name, try to use that instead
    if (userInfo.name) {
      baseUsername = userInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
    }

    // Fallback to email prefix if name processing resulted in empty string
    if (!baseUsername) {
      baseUsername = userInfo.email.split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
    }

    return baseUsername;
  }

  /**
   * Extract display name from Google user info
   */
  getDisplayName(userInfo: GoogleUserInfo): string {
    if (userInfo.name) {
      return userInfo.name;
    }
    
    if (userInfo.given_name && userInfo.family_name) {
      return `${userInfo.given_name} ${userInfo.family_name}`;
    }
    
    if (userInfo.given_name) {
      return userInfo.given_name;
    }
    
    // Fallback to email prefix
    return userInfo.email.split('@')[0];
  }

  /**
   * Check if Google OAuth is properly configured
   */
  isConfigured(): boolean {
    return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  }

  /**
   * Get OAuth configuration for frontend
   */
  getClientConfig() {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID,
      configured: this.isConfigured(),
    };
  }
}

export const googleAuthService = new GoogleAuthService();
export default googleAuthService;

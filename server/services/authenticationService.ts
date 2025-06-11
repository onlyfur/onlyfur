import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog } from './auditLog';
import { emailService } from './emailService';
import { googleAuthService } from './googleAuth';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  subscriptionStatus: string;
  authProvider: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface RegisterData {
  email: string;
  username: string;
  displayName: string;
  password?: string;
  authProvider?: string;
  googleId?: string;
  avatar?: string;
}

export interface LoginData {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  refreshToken?: string;
  message?: string;
  error?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Comprehensive Authentication Service with PostgreSQL Integration
 */
export class AuthenticationService {
  private static instance: AuthenticationService;

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  /**
   * Register new user account
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.findUserByEmailOrUsername(data.email, data.username);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email or username already exists'
        };
      }

      // Hash password if provided (for email/password auth)
      let hashedPassword: string | undefined;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 12);
      }

      // Create user in PostgreSQL
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          displayName: data.displayName,
          password: hashedPassword,
          authProvider: data.authProvider || 'EMAIL',
          googleId: data.googleId,
          avatar: data.avatar,
          role: 'SUBSCRIBER',
          isActive: true,
          isEmailVerified: data.authProvider === 'GOOGLE',
          subscriptionStatus: 'FREE',
          lastLoginAt: new Date()
        }
      });

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'CREATE' as any,
        resource: 'user',
        resourceId: user.id,
        metadata: {
          email: data.email,
          username: data.username,
          authProvider: data.authProvider
        }
      });

      // Generate JWT token
      const token = this.generateToken(user);

      logger.info('User registered successfully', {
        userId: user.id,
        email: user.email,
        username: user.username,
        authProvider: user.authProvider
      });

      return {
        success: true,
        user: this.mapUserToAuthUser(user),
        token
      };

    } catch (error: any) {
      logger.error('Registration failed', {
        email: data.email,
        username: data.username,
        error: error.message
      });

      // Handle specific database errors
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'User with this email or username already exists'
        };
      }

      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * Login user with email/username and password
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Find user by email or username
      const user = await this.findUserByEmailOrUsername(
        data.email || '',
        data.username || ''
      );

      if (!user) {
        // Create audit log for failed login attempt
        await createAuditLog({
          action: 'LOGIN' as any,
          resource: 'auth',
          resourceId: 'login_failed',
          metadata: {
            email: data.email,
            username: data.username,
            reason: 'user_not_found'
          }
        });

        return {
          success: false,
          error: 'Invalid email/username or password'
        };
      }

      // Check if account is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated. Please contact support.'
        };
      }

      // Verify password
      if (!user.password || !await bcrypt.compare(data.password, user.password)) {
        // Increment login attempts
        await this.incrementLoginAttempts(user.id);

        await createAuditLog({
          userId: user.id,
          action: 'LOGIN' as any,
          resource: 'auth',
          resourceId: 'login_failed',
          metadata: {
            reason: 'invalid_password',
            loginAttempts: user.loginAttempts + 1
          }
        });

        return {
          success: false,
          error: 'Invalid email/username or password'
        };
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        return {
          success: false,
          error: 'Account is temporarily locked. Please try again later.'
        };
      }

      // Successful login - update user data
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          loginAttempts: 0,
          lockedUntil: null
        }
      });

      // Generate JWT token
      const token = this.generateToken(updatedUser);

      // Create audit log for successful login
      await createAuditLog({
        userId: user.id,
        action: 'LOGIN' as any,
        resource: 'auth',
        resourceId: 'login_success',
        metadata: {
          email: user.email,
          username: user.username
        }
      });

      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
        username: user.username
      });

      return {
        success: true,
        user: this.mapUserToAuthUser(updatedUser),
        token
      };

    } catch (error: any) {
      logger.error('Login failed', {
        email: data.email,
        username: data.username,
        error: error.message
      });

      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Google OAuth login/register
   */
  async googleAuth(credential: string, userType?: 'creator' | 'subscriber'): Promise<AuthResponse> {
    try {
      // Verify Google credential
      const googleUserInfo = await googleAuthService.verifyCredential(credential);
      
      if (!googleUserInfo) {
        return {
          success: false,
          error: 'Invalid Google credential'
        };
      }

      // Check if user exists with Google ID
      let user = await prisma.user.findUnique({
        where: { googleId: googleUserInfo.id }
      });

      if (!user) {
        // Check if user exists with same email
        user = await prisma.user.findUnique({
          where: { email: googleUserInfo.email }
        });

        if (user) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: googleUserInfo.id,
              authProvider: 'GOOGLE',
              isEmailVerified: true,
              lastLoginAt: new Date()
            }
          });
        } else {
          // Create new user
          const username = await this.generateUniqueUsername(
            googleUserInfo.name, 
            googleUserInfo.email
          );
          
          user = await prisma.user.create({
            data: {
              email: googleUserInfo.email,
              username,
              displayName: googleAuthService.getDisplayName(googleUserInfo),
              googleId: googleUserInfo.id,
              authProvider: 'GOOGLE',
              avatar: googleUserInfo.picture,
              role: userType === 'creator' ? 'CREATOR' : 'SUBSCRIBER',
              isActive: true,
              isEmailVerified: true,
              subscriptionStatus: 'FREE',
              lastLoginAt: new Date()
            }
          });

          // Send welcome email
          await emailService.sendWelcomeEmail(user.email, user.displayName);
        }
      } else {
        // Update last login for existing Google user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginAttempts: 0,
            lockedUntil: null
          }
        });
      }

      // Generate tokens
      const tokens = this.generateTokenPair(user);

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'LOGIN' as any,
        resource: 'auth',
        resourceId: 'google_login',
        metadata: {
          googleId: googleUserInfo.id,
          email: googleUserInfo.email
        }
      });

      logger.info('Google authentication successful', {
        userId: user.id,
        email: user.email,
        googleId: googleUserInfo.id
      });

      return {
        success: true,
        user: this.mapUserToAuthUser(user),
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };

    } catch (error: any) {
      logger.error('Google authentication failed', {
        error: error.message
      });

      return {
        success: false,
        error: 'Google authentication failed. Please try again.'
      };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token to database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetTokenExpires
        }
      });

      // Send reset email
      const emailSent = await emailService.sendPasswordResetEmail(
        user.email,
        resetToken,
        user.displayName
      );

      if (!emailSent) {
        return {
          success: false,
          error: 'Failed to send password reset email. Please try again.'
        };
      }

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED' as any,
        resource: 'auth',
        resourceId: user.id,
        metadata: {
          email: user.email
        }
      });

      logger.info('Password reset email sent', {
        userId: user.id,
        email: user.email
      });

      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      };

    } catch (error: any) {
      logger.error('Password reset email failed', {
        email,
        error: error.message
      });

      return {
        success: false,
        error: 'Failed to send password reset email. Please try again.'
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Find user with valid reset token
      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return {
          success: false,
          error: 'Invalid or expired reset token'
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          loginAttempts: 0,
          lockedUntil: null,
          updatedAt: new Date()
        }
      });

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'PASSWORD_RESET_COMPLETED' as any,
        resource: 'auth',
        resourceId: user.id,
        metadata: {
          email: user.email
        }
      });

      logger.info('Password reset completed', {
        userId: user.id,
        email: user.email
      });

      return {
        success: true,
        message: 'Password has been reset successfully'
      };

    } catch (error: any) {
      logger.error('Password reset failed', {
        error: error.message
      });

      return {
        success: false,
        error: 'Failed to reset password. Please try again.'
      };
    }
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      if (user.isEmailVerified) {
        return {
          success: false,
          error: 'Email is already verified'
        };
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Save verification token to database
      await prisma.user.update({
        where: { id: userId },
        data: {
          emailVerificationToken: verificationToken,
          emailVerifiedAt: verificationExpires
        }
      });

      // Send verification email
      const emailSent = await emailService.sendVerificationEmail(
        user.email,
        verificationToken,
        user.displayName
      );

      if (!emailSent) {
        return {
          success: false,
          error: 'Failed to send verification email. Please try again.'
        };
      }

      logger.info('Verification email sent', {
        userId: user.id,
        email: user.email
      });

      return {
        success: true,
        message: 'Verification email sent successfully'
      };

    } catch (error: any) {
      logger.error('Send verification email failed', {
        userId,
        error: error.message
      });

      return {
        success: false,
        error: 'Failed to send verification email. Please try again.'
      };
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Find user with valid verification token
      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: token,
          emailVerifiedAt: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return {
          success: false,
          error: 'Invalid or expired verification token'
        };
      }

      // Update user as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerifiedAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'EMAIL_VERIFIED' as any,
        resource: 'auth',
        resourceId: user.id,
        metadata: {
          email: user.email
        }
      });

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.displayName);

      logger.info('Email verified successfully', {
        userId: user.id,
        email: user.email
      });

      return {
        success: true,
        message: 'Email verified successfully'
      };

    } catch (error: any) {
      logger.error('Email verification failed', {
        error: error.message
      });

      return {
        success: false,
        error: 'Failed to verify email. Please try again.'
      };
    }
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      // Generate new token pair
      const tokens = this.generateTokenPair(user);

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: 'TOKEN_REFRESH' as any,
        resource: 'auth',
        resourceId: user.id,
        metadata: {
          email: user.email
        }
      });

      logger.info('Tokens refreshed successfully', {
        userId: user.id,
        email: user.email
      });

      return {
        success: true,
        user: this.mapUserToAuthUser(user),
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken
      };

    } catch (error: any) {
      logger.error('Token refresh failed', {
        error: error.message
      });

      return {
        success: false,
        error: 'Invalid refresh token'
      };
    }
  }

  /**
   * Logout user and invalidate sessions
   */
  async logout(userId: string, sessionToken?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Invalidate specific session if provided
      if (sessionToken) {
        await prisma.userSession.updateMany({
          where: {
            userId,
            sessionToken
          },
          data: {
            isActive: false
          }
        });
      } else {
        // Invalidate all sessions for user
        await prisma.userSession.updateMany({
          where: { userId },
          data: {
            isActive: false
          }
        });
      }

      // Create audit log
      await createAuditLog({
        userId,
        action: 'LOGOUT' as any,
        resource: 'auth',
        resourceId: userId,
        metadata: {
          sessionToken: sessionToken ? 'specific' : 'all'
        }
      });

      logger.info('User logged out successfully', {
        userId,
        sessionType: sessionToken ? 'specific' : 'all'
      });

      return {
        success: true,
        message: 'Logged out successfully'
      };

    } catch (error: any) {
      logger.error('Logout failed', {
        userId,
        error: error.message
      });

      return {
        success: false,
        error: 'Logout failed. Please try again.'
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: {
      displayName?: string;
      bio?: string;
      socialLinks?: any;
      preferredLanguage?: string;
      timezone?: string;
      emailNotifications?: boolean;
      pushNotifications?: boolean;
      marketingEmails?: boolean;
      avatar?: string;
      coverImage?: string;
    }
  ): Promise<AuthResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update user in PostgreSQL
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });

      // Create audit log
      await createAuditLog({
        userId,
        action: 'UPDATE' as any,
        resource: 'user',
        resourceId: userId,
        metadata: {
          updates: Object.keys(updates)
        }
      });

      logger.info('User profile updated', {
        userId,
        updates: Object.keys(updates)
      });

      return {
        success: true,
        user: this.mapUserToAuthUser(updatedUser)
      };

    } catch (error: any) {
      logger.error('Profile update failed', {
        userId,
        error: error.message
      });

      return {
        success: false,
        error: 'Profile update failed. Please try again.'
      };
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string, password?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Verify password for email/password users
      if (user.authProvider === 'EMAIL' && password) {
        if (!user.password || !await bcrypt.compare(password, user.password)) {
          return {
            success: false,
            error: 'Invalid password'
          };
        }
      }

      // Delete user from PostgreSQL (this will cascade delete related records)
      await prisma.user.delete({
        where: { id: userId }
      });

      // Create audit log
      await createAuditLog({
        userId,
        action: 'DELETE' as any,
        resource: 'user',
        resourceId: userId,
        metadata: {
          email: user.email,
          username: user.username
        }
      });

      logger.info('User account deleted', {
        userId,
        email: user.email,
        username: user.username
      });

      return {
        success: true,
        message: 'Account deleted successfully'
      };

    } catch (error: any) {
      logger.error('Account deletion failed', {
        userId,
        error: error.message
      });

      return {
        success: false,
        error: 'Account deletion failed. Please try again.'
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<AuthUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      return user ? this.mapUserToAuthUser(user) : null;
    } catch (error: any) {
      logger.error('Failed to get user by ID', {
        userId,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
      return null;
    }
  }

  // Private helper methods

  private async findUserByEmailOrUsername(email: string, username: string): Promise<any | null> {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });
  }

  private async incrementLoginAttempts(userId: string): Promise<void> {
    const maxAttempts = 5;
    const lockDuration = 30 * 60 * 1000; // 30 minutes

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return;

    const newAttempts = user.loginAttempts + 1;
    const shouldLock = newAttempts >= maxAttempts;

    await prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: newAttempts,
        lockedUntil: shouldLock ? new Date(Date.now() + lockDuration) : null
      }
    });
  }

  private generateToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
  }

  private generateRefreshToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
  }

  private generateTokenPair(user: any): TokenPair {
    return {
      accessToken: this.generateToken(user),
      refreshToken: this.generateRefreshToken(user)
    };
  }

  private async generateUniqueUsername(name: string, email: string): Promise<string> {
    // Create base username from name or email
    let baseUsername = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);

    if (!baseUsername) {
      baseUsername = email.split('@')[0].toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
    }

    let username = baseUsername;
    let counter = 1;

    // Check if username exists and add number if needed
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }

  private mapUserToAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      subscriptionStatus: user.subscriptionStatus,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };
  }
}

export const authenticationService = AuthenticationService.getInstance();
export default authenticationService;

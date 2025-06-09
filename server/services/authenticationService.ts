import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';
import { vercelBlobStorage } from './vercelBlobStorage';
import { User, UserRole, AuthProvider, SubscriptionStatus } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  subscriptionStatus: SubscriptionStatus;
  authProvider: AuthProvider;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface RegisterData {
  email: string;
  username: string;
  displayName: string;
  password?: string;
  authProvider?: AuthProvider;
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
  message?: string;
  error?: string;
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
          authProvider: data.authProvider || AuthProvider.EMAIL,
          googleId: data.googleId,
          avatar: data.avatar,
          role: UserRole.SUBSCRIBER,
          isActive: true,
          isEmailVerified: data.authProvider === AuthProvider.GOOGLE, // Auto-verify for Google
          subscriptionStatus: SubscriptionStatus.FREE,
          lastLoginAt: new Date()
        }
      });

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: AuditActions.CREATE,
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
          userId: null,
          action: AuditActions.VIEW,
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
          action: AuditActions.VIEW,
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
        action: AuditActions.VIEW,
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
  async googleAuth(googleData: {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }): Promise<AuthResponse> {
    try {
      // Check if user exists with Google ID
      let user = await prisma.user.findUnique({
        where: { googleId: googleData.googleId }
      });

      if (!user) {
        // Check if user exists with same email
        user = await prisma.user.findUnique({
          where: { email: googleData.email }
        });

        if (user) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: googleData.googleId,
              authProvider: AuthProvider.GOOGLE,
              isEmailVerified: true,
              lastLoginAt: new Date()
            }
          });
        } else {
          // Create new user
          const username = await this.generateUniqueUsername(googleData.name, googleData.email);
          
          user = await prisma.user.create({
            data: {
              email: googleData.email,
              username,
              displayName: googleData.name,
              googleId: googleData.googleId,
              authProvider: AuthProvider.GOOGLE,
              avatar: googleData.picture,
              role: UserRole.SUBSCRIBER,
              isActive: true,
              isEmailVerified: true,
              subscriptionStatus: SubscriptionStatus.FREE,
              lastLoginAt: new Date()
            }
          });
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

      // Generate JWT token
      const token = this.generateToken(user);

      // Create audit log
      await createAuditLog({
        userId: user.id,
        action: AuditActions.VIEW,
        resource: 'auth',
        resourceId: 'google_login',
        metadata: {
          googleId: googleData.googleId,
          email: googleData.email
        }
      });

      logger.info('Google authentication successful', {
        userId: user.id,
        email: user.email,
        googleId: googleData.googleId
      });

      return {
        success: true,
        user: this.mapUserToAuthUser(user),
        token
      };

    } catch (error: any) {
      logger.error('Google authentication failed', {
        googleId: googleData.googleId,
        email: googleData.email,
        error: error.message
      });

      return {
        success: false,
        error: 'Google authentication failed. Please try again.'
      };
    }
  }

  /**
   * Update user profile with blob storage for images
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
    },
    avatarFile?: Express.Multer.File,
    coverImageFile?: Express.Multer.File
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

      let avatarUrl = user.avatar;
      let coverImageUrl = user.coverImage;

      // Upload avatar to Vercel Blob if provided
      if (avatarFile) {
        const avatarUpload = await vercelBlobStorage.uploadFile(avatarFile, {
          userId,
          category: 'avatar',
          metadata: { type: 'user_avatar' }
        });
        avatarUrl = avatarUpload.blobUrl;
      }

      // Upload cover image to Vercel Blob if provided
      if (coverImageFile) {
        const coverUpload = await vercelBlobStorage.uploadFile(coverImageFile, {
          userId,
          category: 'cover',
          metadata: { type: 'user_cover' }
        });
        coverImageUrl = coverUpload.blobUrl;
      }

      // Update user in PostgreSQL
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updates,
          avatar: avatarUrl,
          coverImage: coverImageUrl,
          updatedAt: new Date()
        }
      });

      // Create audit log
      await createAuditLog({
        userId,
        action: AuditActions.UPDATE,
        resource: 'user',
        resourceId: userId,
        metadata: {
          updates: Object.keys(updates),
          hasAvatar: !!avatarFile,
          hasCoverImage: !!coverImageFile
        }
      });

      logger.info('User profile updated', {
        userId,
        updates: Object.keys(updates),
        hasAvatar: !!avatarFile,
        hasCoverImage: !!coverImageFile
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
   * Delete user account and cleanup blob storage
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
      if (user.authProvider === AuthProvider.EMAIL && password) {
        if (!user.password || !await bcrypt.compare(password, user.password)) {
          return {
            success: false,
            error: 'Invalid password'
          };
        }
      }

      // Get all user files from blob storage
      const userFiles = await vercelBlobStorage.getUserFiles(userId);
      
      // Delete all user files from blob storage
      for (const file of userFiles.files) {
        try {
          await vercelBlobStorage.deleteFile(file.id, userId);
        } catch (error) {
          logger.warn('Failed to delete user file during account deletion', {
            userId,
            fileId: file.id,
            error: error.message
          });
        }
      }

      // Delete user from PostgreSQL (this will cascade delete related records)
      await prisma.user.delete({
        where: { id: userId }
      });

      // Create audit log
      await createAuditLog({
        userId,
        action: AuditActions.DELETE,
        resource: 'user',
        resourceId: userId,
        metadata: {
          email: user.email,
          username: user.username,
          deletedFilesCount: userFiles.files.length
        }
      });

      logger.info('User account deleted', {
        userId,
        email: user.email,
        username: user.username,
        deletedFilesCount: userFiles.files.length
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

  private async findUserByEmailOrUsername(email: string, username: string): Promise<User | null> {
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

  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
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

  private mapUserToAuthUser(user: User): AuthUser {
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

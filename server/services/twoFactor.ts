import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { prisma } from './database';
import { logger } from '../middleware/logger';

export interface TwoFactorSetupResult {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerificationResult {
  isValid: boolean;
  backupCodeUsed?: boolean;
}

/**
 * Generate a new 2FA secret and QR code for a user
 */
export async function setupTwoFactor(
  userId: string, 
  userEmail: string
): Promise<TwoFactorSetupResult> {
  try {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `OnlyFur (${userEmail})`,
      issuer: 'OnlyFur Platform',
      length: 32
    });

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    // Generate QR code URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store secret in database (encrypted)
    await prisma.twoFactorSecret.upsert({
      where: { userId },
      create: {
        userId,
        secret: secret.base32,
        backupCodes: backupCodes,
        isActive: false // Will be activated after verification
      },
      update: {
        secret: secret.base32,
        backupCodes: backupCodes,
        isActive: false
      }
    });

    logger.info('2FA setup initiated', { userId, email: userEmail });

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    };

  } catch (error) {
    logger.error('2FA setup failed', { userId, error: error.message });
    throw new Error('Failed to setup two-factor authentication');
  }
}

/**
 * Verify 2FA token and activate 2FA for user
 */
export async function verifyAndActivateTwoFactor(
  userId: string, 
  token: string
): Promise<boolean> {
  try {
    const twoFactorSecret = await prisma.twoFactorSecret.findUnique({
      where: { userId }
    });

    if (!twoFactorSecret) {
      throw new Error('2FA not set up for this user');
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: twoFactorSecret.secret,
      encoding: 'base32',
      token,
      window: 2 // Allow some time drift
    });

    if (verified) {
      // Activate 2FA
      await Promise.all([
        prisma.twoFactorSecret.update({
          where: { userId },
          data: { isActive: true }
        }),
        prisma.user.update({
          where: { id: userId },
          data: { twoFactorEnabled: true }
        })
      ]);

      logger.info('2FA activated', { userId });
      return true;
    }

    return false;

  } catch (error) {
    logger.error('2FA activation failed', { userId, error: error.message });
    throw new Error('Failed to activate two-factor authentication');
  }
}

/**
 * Verify 2FA token during login
 */
export async function verifyTwoFactor(
  userId: string, 
  token: string
): Promise<TwoFactorVerificationResult> {
  try {
    const twoFactorSecret = await prisma.twoFactorSecret.findUnique({
      where: { userId, isActive: true }
    });

    if (!twoFactorSecret) {
      throw new Error('2FA not enabled for this user');
    }

    // First try to verify with TOTP
    const totpVerified = speakeasy.totp.verify({
      secret: twoFactorSecret.secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (totpVerified) {
      return { isValid: true };
    }

    // Check if it's a backup code
    const backupCodes = twoFactorSecret.backupCodes as string[];
    const codeIndex = backupCodes.indexOf(token.toUpperCase());

    if (codeIndex !== -1) {
      // Remove used backup code
      const updatedBackupCodes = backupCodes.filter((_, index) => index !== codeIndex);
      
      await prisma.twoFactorSecret.update({
        where: { userId },
        data: { backupCodes: updatedBackupCodes }
      });

      logger.info('2FA backup code used', { userId, codesRemaining: updatedBackupCodes.length });

      return { isValid: true, backupCodeUsed: true };
    }

    return { isValid: false };

  } catch (error) {
    logger.error('2FA verification failed', { userId, error: error.message });
    throw new Error('Failed to verify two-factor authentication');
  }
}

/**
 * Disable 2FA for a user
 */
export async function disableTwoFactor(userId: string): Promise<void> {
  try {
    await Promise.all([
      prisma.twoFactorSecret.deleteMany({
        where: { userId }
      }),
      prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: false }
      })
    ]);

    logger.info('2FA disabled', { userId });

  } catch (error) {
    logger.error('2FA disable failed', { userId, error: error.message });
    throw new Error('Failed to disable two-factor authentication');
  }
}

/**
 * Generate new backup codes
 */
export async function regenerateBackupCodes(userId: string): Promise<string[]> {
  try {
    const newBackupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    await prisma.twoFactorSecret.update({
      where: { userId },
      data: { backupCodes: newBackupCodes }
    });

    logger.info('2FA backup codes regenerated', { userId });

    return newBackupCodes;

  } catch (error) {
    logger.error('2FA backup codes regeneration failed', { userId, error: error.message });
    throw new Error('Failed to regenerate backup codes');
  }
}

/**
 * Check if user has 2FA enabled
 */
export async function isTwoFactorEnabled(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true }
    });

    return user?.twoFactorEnabled ?? false;

  } catch (error) {
    logger.error('2FA status check failed', { userId, error: error.message });
    return false;
  }
}

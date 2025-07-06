import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler, ValidationError, AuthenticationError } from '../middleware/errorHandler';
import { logger } from '../middleware/logger';
import {
  setupTwoFactor,
  verifyAndActivateTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  regenerateBackupCodes,
  isTwoFactorEnabled
} from '../services/twoFactor';
import { createAuditLog, AuditActions, extractRequestInfo } from '../services/auditLog';

const router = express.Router();

// Validation schemas
const setupTwoFactorSchema = z.object({
  // No additional fields needed - user info comes from token
});

const verifySetupSchema = z.object({
  token: z.string().min(6, 'Token must be at least 6 characters').max(8, 'Token must be at most 8 characters')
});

const verifyLoginSchema = z.object({
  token: z.string().min(6, 'Token must be at least 6 characters').max(16, 'Token must be at most 16 characters') // Allows backup codes
});

/**
 * @swagger
 * /api/2fa/setup:
 *   post:
 *     summary: Setup two-factor authentication
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 qrCodeUrl:
 *                   type: string
 *                   description: QR code data URL for scanning
 *                 backupCodes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Backup codes for account recovery
 */
router.post('/setup', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const userEmail = req.user!.email;

  // Check if 2FA is already enabled
  const isEnabled = await isTwoFactorEnabled(userId);
  if (isEnabled) {
    throw new ValidationError('Two-factor authentication is already enabled');
  }

  const setupResult = await setupTwoFactor(userId, userEmail);

  // Log the setup attempt
  await createAuditLog({
    userId,
    action: AuditActions.USER_UPDATE_PROFILE,
    resource: 'two_factor_setup',
    resourceId: userId,
    ...extractRequestInfo(req)
  });

  res.json({
    success: true,
    qrCodeUrl: setupResult.qrCodeUrl,
    backupCodes: setupResult.backupCodes
  });
}));

/**
 * @swagger
 * /api/2fa/verify-setup:
 *   post:
 *     summary: Verify and activate two-factor authentication
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP token
 *     responses:
 *       200:
 *         description: 2FA activated successfully
 */
router.post('/verify-setup', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = verifySetupSchema.parse(req.body);

  const isValid = await verifyAndActivateTwoFactor(userId, validatedData.token);

  if (!isValid) {
    throw new AuthenticationError('Invalid verification token');
  }

  // Log successful 2FA activation
  await createAuditLog({
    userId,
    action: AuditActions.USER_UPDATE_PROFILE,
    resource: 'two_factor_activation',
    resourceId: userId,
    newValues: { twoFactorEnabled: true },
    ...extractRequestInfo(req)
  });

  res.json({
    success: true,
    message: 'Two-factor authentication has been successfully activated'
  });
}));

/**
 * @swagger
 * /api/2fa/verify:
 *   post:
 *     summary: Verify two-factor authentication token (for login)
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP token or backup code
 *     responses:
 *       200:
 *         description: Token verified successfully
 */
router.post('/verify', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = verifyLoginSchema.parse(req.body);

  const result = await verifyTwoFactor(userId, validatedData.token);

  if (!result.isValid) {
    // Log failed verification attempt
    await createAuditLog({
      userId,
      action: AuditActions.USER_LOGIN,
      resource: 'two_factor_verification',
      resourceId: userId,
      metadata: { success: false, reason: 'invalid_token' },
      ...extractRequestInfo(req)
    });

    throw new AuthenticationError('Invalid two-factor authentication token');
  }

  // Log successful verification
  await createAuditLog({
    userId,
    action: AuditActions.USER_LOGIN,
    resource: 'two_factor_verification',
    resourceId: userId,
    metadata: { 
      success: true, 
      backupCodeUsed: result.backupCodeUsed 
    },
    ...extractRequestInfo(req)
  });

  res.json({
    success: true,
    message: 'Two-factor authentication verified successfully',
    backupCodeUsed: result.backupCodeUsed
  });
}));

/**
 * @swagger
 * /api/2fa/disable:
 *   post:
 *     summary: Disable two-factor authentication
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP token for confirmation
 *     responses:
 *       200:
 *         description: 2FA disabled successfully
 */
router.post('/disable', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = verifyLoginSchema.parse(req.body);

  // Verify token before disabling
  const result = await verifyTwoFactor(userId, validatedData.token);

  if (!result.isValid) {
    throw new AuthenticationError('Invalid two-factor authentication token');
  }

  await disableTwoFactor(userId);

  // Log 2FA disable
  await createAuditLog({
    userId,
    action: AuditActions.USER_UPDATE_PROFILE,
    resource: 'two_factor_disable',
    resourceId: userId,
    oldValues: { twoFactorEnabled: true },
    newValues: { twoFactorEnabled: false },
    ...extractRequestInfo(req)
  });

  res.json({
    success: true,
    message: 'Two-factor authentication has been disabled'
  });
}));

/**
 * @swagger
 * /api/2fa/backup-codes:
 *   post:
 *     summary: Regenerate backup codes
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: 6-digit TOTP token for confirmation
 *     responses:
 *       200:
 *         description: Backup codes regenerated successfully
 */
router.post('/backup-codes', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const validatedData = verifyLoginSchema.parse(req.body);

  // Verify token before regenerating codes
  const result = await verifyTwoFactor(userId, validatedData.token);

  if (!result.isValid) {
    throw new AuthenticationError('Invalid two-factor authentication token');
  }

  const newBackupCodes = await regenerateBackupCodes(userId);

  // Log backup code regeneration
  await createAuditLog({
    userId,
    action: AuditActions.USER_UPDATE_PROFILE,
    resource: 'two_factor_backup_codes',
    resourceId: userId,
    metadata: { action: 'regenerate' },
    ...extractRequestInfo(req)
  });

  res.json({
    success: true,
    backupCodes: newBackupCodes,
    message: 'Backup codes have been regenerated'
  });
}));

/**
 * @swagger
 * /api/2fa/status:
 *   get:
 *     summary: Get two-factor authentication status
 *     tags: [Two-Factor Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA status retrieved successfully
 */
router.get('/status', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const isEnabled = await isTwoFactorEnabled(userId);

  res.json({
    success: true,
    twoFactorEnabled: isEnabled
  });
}));

export default router;

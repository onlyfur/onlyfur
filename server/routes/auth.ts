import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { authenticationService } from '../services/authenticationService';
import { blobService } from '../services/blob';
import { authenticateToken } from '../middleware/auth';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = Router();

interface RegisterRequest extends Request {
  file?: Express.Multer.File;
}

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
    subscriptionTier?: string;
    subscriptionStatus?: string;
  };
  file?: Express.Multer.File;
}

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Register new user with optional avatar upload
 */
const registerHandler: AsyncRequestHandler = async (req, res) => {
  try {
    const registerReq = req as RegisterRequest;
    // Handle file upload if avatar is provided
    let avatarUrl: string | undefined;
    if (registerReq.file) {
      const uploadResult = await blobService.uploadAvatar(registerReq.body.email, registerReq.file);
      avatarUrl = uploadResult.blobUrl;
    }

    const result = await authenticationService.register({
      ...registerReq.body,
      avatar: avatarUrl
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Login with email/password
 */
const loginHandler: AsyncRequestHandler = async (req, res) => {
  try {
    const result = await authenticationService.login(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Google OAuth login/register
 */
const googleAuthHandler: AsyncRequestHandler = async (req, res) => {
  try {
    const result = await authenticationService.googleAuth(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Update user profile with optional avatar upload
 */
const updateProfileHandler: AsyncRequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const updates = { ...req.body };
    
    // Handle avatar upload if provided
    if (authReq.file) {
      try {
        const uploadResult = await blobService.uploadAvatar(authReq.user.userId, authReq.file);
        updates.avatar = uploadResult.blobUrl;
        
        // Get current user to check for existing avatar
        const currentUser = await authenticationService.getUserById(authReq.user.userId);
        if (currentUser?.avatar) {
          try {
            // Extract fileId from the avatar URL
            const avatarUrl = new URL(currentUser.avatar);
            const avatarFileId = avatarUrl.pathname.split('/').pop() || '';
            if (avatarFileId) {
              await blobService.deleteFile(avatarFileId, authReq.user.userId);
            }
          } catch (error) {
            console.error('Failed to delete old avatar:', error);
          }
        }
      } catch (uploadError: any) {
        res.status(400).json({
          success: false,
          error: `Avatar upload failed: ${uploadError.message}`
        });
        return;
      }
    }

    const result = await authenticationService.updateProfile(authReq.user.userId, updates);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: `Profile update failed: ${error.message}`
    });
  }
};

/**
 * Get current user profile
 */
const getProfileHandler: AsyncRequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const user = await authenticationService.getUserById(authReq.user.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    res.json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Delete user account
 */
const deleteAccountHandler: AsyncRequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    // Get user files before deleting account
    const userFiles = await blobService.getUserFiles(authReq.user.userId);
    
    // Delete user account first
    const result = await authenticationService.deleteAccount(authReq.user.userId, req.body.password);
    
    if (result.success) {
      // Delete all user files after account deletion
      for (const file of userFiles.files) {
        try {
          await blobService.deleteFile(file.id, authReq.user.userId);
        } catch (error) {
          console.error('Failed to delete user file during account deletion:', error);
        }
      }
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: `Account deletion failed: ${error.message}`
    });
  }
};

// Route handlers
router.post('/register', upload.single('avatar'), registerHandler);
router.post('/login', loginHandler);
router.post('/google', googleAuthHandler);
router.put('/profile', authenticateToken, upload.single('avatar'), updateProfileHandler);
router.get('/profile', authenticateToken, getProfileHandler);
router.delete('/account', authenticateToken, deleteAccountHandler);

export default router;

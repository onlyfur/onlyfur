import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { authenticationService } from '../services/authenticationService';
import { blobService } from '../services/blob';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../services/database';
import bcrypt from 'bcryptjs';

const router = Router();
const storage = multer.memoryStorage();

// Routes
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@onlyfur.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

    if (email === ADMIN_EMAIL) {
      let adminUser = await prisma.user.findUnique({
        where: { email: ADMIN_EMAIL }
      });

      if (!adminUser) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
        adminUser = await prisma.user.create({
          data: {
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME,
            displayName: 'Platform Administrator',
            role: 'ADMIN',
            isVerified: true,
            isActive: true,
            isEmailVerified: true,
            password: hashedPassword,
            authProvider: 'EMAIL',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log(`✅ Default admin user created: ${ADMIN_EMAIL}`);
      } else {
        const passwordMatches = await bcrypt.compare(ADMIN_PASSWORD, adminUser.password);
        if (!passwordMatches) {
          const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
          adminUser = await prisma.user.update({
            where: { email: ADMIN_EMAIL },
            data: {
              password: hashedPassword,
              updatedAt: new Date()
            }
          });
          console.log(`🔄 Admin password updated from environment variable for: ${ADMIN_EMAIL}`);
        }
      }

      const validPassword = await bcrypt.compare(password, adminUser.password);
      if (!validPassword) {
        res.status(400).json({
          success: false,
          error: 'Invalid email or password'
        });
        return;
      }

      const token = authenticationService['generateToken'](adminUser);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
          displayName: adminUser.displayName,
          role: adminUser.role
        },
        token
      });
      return;
    }

    const result = await authenticationService.login(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const result = await authenticationService.register(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        avatar: true,
        bio: true,
        isVerified: true,
        createdAt: true
      }
    });

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
});

export default router;

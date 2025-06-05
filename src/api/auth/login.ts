import { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, updateUserLastLogin } from '@/lib/database';
import { applyRateLimit, applyCors } from '@/lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  await applyCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply rate limiting: 5 attempts per 15 minutes
    const rateLimitResult = await applyRateLimit(req, res, {
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many login attempts, please try again in 15 minutes'
    });

    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { email, password, rememberMe = false } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user by email
    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if account is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({ 
        error: 'Account suspended. Please contact support.' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.emailVerified && process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in' 
      });
    }

    // Generate JWT token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET!,
      { expiresIn: tokenExpiry }
    );

    // Update last login
    await updateUserLastLogin(user.id);

    // Return user data (without password hash)
    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName || user.username,
      role: user.role,
      isVerified: user.emailVerified,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: {
        species: user.species,
        fursona: user.fursona,
        interests: user.interests,
        location: user.location
      },
      subscription: {
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        expiresAt: user.subscriptionExpiresAt
      }
    };

    // Set secure HTTP-only cookie for token
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days
    res.setHeader('Set-Cookie', [
      `onlyfur-token=${token}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=${maxAge}; Path=/`
    ]);

    res.status(200).json({
      success: true,
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

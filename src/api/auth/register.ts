import { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByEmail, getUserByUsername } from '@/lib/database';
import { applyRateLimit, applyCors } from '@/lib/middleware';
import { sendVerificationEmail } from '@/lib/email';

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { valid: errors.length === 0, errors };
};

const validateUsername = (username: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 30) {
    errors.push('Username must be no more than 30 characters long');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }
  
  // Reserved usernames
  const reserved = ['admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'root', 'support', 'onlyfur'];
  if (reserved.includes(username.toLowerCase())) {
    errors.push('This username is reserved');
  }
  
  return { valid: errors.length === 0, errors };
};

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
    // Apply rate limiting: 3 registrations per hour
    const rateLimitResult = await applyRateLimit(req, res, {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3,
      message: 'Too many registration attempts, please try again in 1 hour'
    });

    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { 
      email, 
      username, 
      password, 
      role = 'user',
      species,
      fursona,
      acceptTerms,
      acceptPrivacy,
      ageConfirmation
    } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({ 
        error: 'Email, username, and password are required' 
      });
    }

    // Age verification for adult content platform
    if (!ageConfirmation) {
      return res.status(400).json({ 
        error: 'Age confirmation required for adult content platform' 
      });
    }

    // Terms acceptance
    if (!acceptTerms || !acceptPrivacy) {
      return res.status(400).json({ 
        error: 'Terms of service and privacy policy acceptance required' 
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.errors[0] });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.errors[0] });
    }

    // Validate role
    if (!['user', 'creator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if email already exists
    const existingEmail = await getUserByEmail(email.toLowerCase());
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Check if username already exists
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create user
    const userData = {
      id: uuidv4(),
      email: email.toLowerCase(),
      username,
      displayName: username,
      passwordHash,
      role,
      species: species || null,
      fursona: fursona || null,
      emailVerified: false,
      verificationToken,
      status: 'active',
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const user = await createUser(userData);

    // Send verification email (if enabled)
    if (process.env.ENABLE_EMAIL_VERIFICATION === 'true') {
      try {
        await sendVerificationEmail(user.email, verificationToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue with registration even if email fails
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data (without password hash)
    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      isVerified: user.emailVerified,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: {
        species: user.species,
        fursona: user.fursona
      }
    };

    // Set secure HTTP-only cookie for token
    res.setHeader('Set-Cookie', [
      `onlyfur-token=${token}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    ]);

    res.status(201).json({
      success: true,
      user: userResponse,
      token,
      message: process.env.ENABLE_EMAIL_VERIFICATION === 'true' ? 
        'Registration successful! Please check your email to verify your account.' :
        'Registration successful! Welcome to OnlyFur!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

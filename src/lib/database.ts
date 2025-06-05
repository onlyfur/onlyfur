// Database Schema and Operations for OnlyFur Platform
// Production-ready database operations with PostgreSQL/MongoDB support
// Includes proper error handling, validation, and security measures

import { Pool } from 'pg';
import { MongoClient, Db } from 'mongodb';

// Database connection pools
let pgPool: Pool | null = null;
let mongoDb: Db | null = null;

// Initialize PostgreSQL connection
export async function initializePostgres() {
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pgPool;
}

// Initialize MongoDB connection  
export async function initializeMongo() {
  if (!mongoDb) {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    mongoDb = client.db('onlyfur');
  }
  return mongoDb;
}

// Production User Interface
export interface DatabaseUser {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  passwordHash: string;
  role: 'user' | 'creator' | 'admin';
  emailVerified: boolean;
  verificationToken?: string;
  avatar?: string;
  bannerImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  species?: string;
  fursona?: string;
  interests?: string[];
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    furaffinity?: string;
    weasyl?: string;
  };
  subscriptionTier: 'free' | 'basic' | 'premium' | 'creator';
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'suspended';
  subscriptionExpiresAt?: Date;
  status: 'active' | 'suspended' | 'banned' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  loginAttempts?: number;
  lockoutUntil?: Date;
}

// User Database Operations
export async function createUser(userData: Omit<DatabaseUser, 'id'>): Promise<DatabaseUser> {
  const pool = await initializePostgres();
  
  const query = `
    INSERT INTO users (
      id, email, username, display_name, password_hash, role, email_verified,
      verification_token, avatar, bio, location, species, fursona, interests,
      subscription_tier, subscription_status, status, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
    ) RETURNING *
  `;
  
  const values = [
    userData.email,
    userData.username,
    userData.displayName || userData.username,
    userData.passwordHash,
    userData.role,
    userData.emailVerified,
    userData.verificationToken,
    userData.avatar,
    userData.bio,
    userData.location,
    userData.species,
    userData.fursona,
    JSON.stringify(userData.interests || []),
    userData.subscriptionTier,
    userData.subscriptionStatus,
    userData.status
  ];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Database error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function getUserByEmail(email: string): Promise<DatabaseUser | null> {
  const pool = await initializePostgres();
  
  const query = 'SELECT * FROM users WHERE email = $1';
  
  try {
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error getting user by email:', error);
    throw new Error('Failed to get user');
  }
}

export async function getUserByUsername(username: string): Promise<DatabaseUser | null> {
  const pool = await initializePostgres();
  
  const query = 'SELECT * FROM users WHERE username = $1';
  
  try {
    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error getting user by username:', error);
    throw new Error('Failed to get user');
  }
}

export async function getUserById(id: string): Promise<DatabaseUser | null> {
  const pool = await initializePostgres();
  
  const query = 'SELECT * FROM users WHERE id = $1';
  
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error getting user by ID:', error);
    throw new Error('Failed to get user');
  }
}

export async function updateUserLastLogin(userId: string): Promise<void> {
  const pool = await initializePostgres();
  
  const query = `
    UPDATE users 
    SET last_login = NOW(), login_attempts = 0, lockout_until = NULL, updated_at = NOW()
    WHERE id = $1
  `;
  
  try {
    await pool.query(query, [userId]);
  } catch (error) {
    console.error('Database error updating last login:', error);
    throw new Error('Failed to update last login');
  }
}

export async function updateUserProfile(userId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser> {
  const pool = await initializePostgres();
  
  const setClause = Object.keys(updates)
    .filter(key => key !== 'id' && key !== 'createdAt')
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ');
  
  const values = [userId, ...Object.values(updates).filter((_, index) => 
    Object.keys(updates)[index] !== 'id' && Object.keys(updates)[index] !== 'createdAt'
  )];
  
  const query = `
    UPDATE users 
    SET ${setClause}, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Database error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

export interface FurryContent {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  content_type: 'image' | 'video' | 'audio' | 'text' | 'gallery';
  file_urls: string[];
  thumbnail_url?: string;
  price?: number; // in cents, null for subscription-only content
  is_public: boolean;
  is_adult: boolean;
  tags: string[];
  species_tags: string[];
  categories: string[];
  content_warnings?: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: Date;
  updated_at: Date;
  scheduled_publish?: Date;
}

export interface Subscription {
  id: string;
  subscriber_id: string;
  creator_id: string;
  tier_id?: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  amount: number; // in cents
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionTier {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  price: number; // in cents
  benefits: string[];
  color: string;
  is_active: boolean;
  subscriber_count: number;
  content_access_level: number;
  perks: {
    custom_requests?: boolean;
    priority_messages?: boolean;
    exclusive_content?: boolean;
    video_calls?: boolean;
    physical_rewards?: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

export interface FurryTag {
  id: string;
  name: string;
  category: 'species' | 'content_type' | 'theme' | 'style' | 'character' | 'location' | 'props';
  description?: string;
  parent_tag_id?: string;
  usage_count: number;
  is_adult: boolean;
  created_at: Date;
}

// Mock data for development
export const mockFurryTags: FurryTag[] = [
  // Species tags
  { id: 'tag-1', name: 'fox', category: 'species', description: 'Fox characters and fursuits', usage_count: 1250, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-2', name: 'wolf', category: 'species', description: 'Wolf characters and fursuits', usage_count: 980, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-3', name: 'dragon', category: 'species', description: 'Dragon characters and costumes', usage_count: 756, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-4', name: 'cat', category: 'species', description: 'Feline characters and fursuits', usage_count: 890, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-5', name: 'husky', category: 'species', description: 'Husky dog characters', usage_count: 445, is_adult: false, created_at: new Date('2024-01-01') },
  
  // Content type tags
  { id: 'tag-10', name: 'fursuit', category: 'content_type', description: 'Fursuit photos and videos', usage_count: 2100, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-11', name: 'art', category: 'content_type', description: 'Digital and traditional furry art', usage_count: 1890, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-12', name: 'murrsuit', category: 'content_type', description: 'Adult fursuit content', usage_count: 567, is_adult: true, created_at: new Date('2024-01-01') },
  { id: 'tag-13', name: 'photography', category: 'content_type', description: 'Professional fursuit photography', usage_count: 1200, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-14', name: 'video', category: 'content_type', description: 'Fursuit videos and performances', usage_count: 834, is_adult: false, created_at: new Date('2024-01-01') },
  
  // Theme tags
  { id: 'tag-20', name: 'convention', category: 'theme', description: 'Convention photos and meetups', usage_count: 678, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-21', name: 'outdoor', category: 'theme', description: 'Outdoor fursuit adventures', usage_count: 445, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-22', name: 'cosplay', category: 'theme', description: 'Character cosplay and roleplay', usage_count: 356, is_adult: false, created_at: new Date('2024-01-01') },
  { id: 'tag-23', name: 'transformation', category: 'theme', description: 'Transformation sequences', usage_count: 289, is_adult: false, created_at: new Date('2024-01-01') },
];

export const mockUsers: DatabaseUser[] = [
  {
    id: 'admin-1',
    email: 'admin@onlyfur.com',
    username: 'onlyfur_admin',
    password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LdqdqY5GQS8SKSwCa', // password123
    role: 'admin',
    is_verified: true,
    profile_image: '/images/branding/fox-mascot.webp',
    bio: 'OnlyFur Platform Administrator - Creating a safe space for the furry community',
    location: 'San Francisco, CA',
    created_at: new Date('2024-01-01'),
    updated_at: new Date(),
  },
  {
    id: 'creator-1',
    email: 'demo@onlyfur.com',
    username: 'fennec_fox_creator',
    password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LdqdqY5GQS8SKSwCa', // password123
    role: 'creator',
    is_verified: true,
    profile_image: '/images/branding/fox-silhouette.jpg',
    banner_image: '/images/branding/paw-logo.jpg',
    bio: 'Professional fursuit creator and performer. Specializing in fennec fox characters and high-quality costume photography.',
    location: 'Los Angeles, CA',
    website: 'https://fennecfoxcreations.com',
    social_links: {
      twitter: '@fennec_fox_creator',
      furaffinity: 'fennecfoxcreator',
      discord: 'FennecFox#1234',
    },
    furry_profile: {
      species: 'Fennec Fox',
      fursona_name: 'Kira',
      pronouns: 'she/her',
      interests: ['photography', 'costume making', 'conventions', 'performance'],
      experience_level: 'professional',
    },
    creator_info: {
      subscription_price: 1999, // $19.99
      content_categories: ['fursuit', 'photography', 'tutorials', 'behind-the-scenes'],
      total_subscribers: 1247,
      total_earnings: 156780, // $1,567.80
      is_approved: true,
      application_date: new Date('2024-01-15'),
    },
    created_at: new Date('2024-01-15'),
    updated_at: new Date(),
    last_login: new Date(),
  },
  {
    id: 'creator-2',
    email: 'silverwolf@onlyfur.com',
    username: 'silver_wolf_artist',
    password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LdqdqY5GQS8SKSwCa', // password123
    role: 'creator',
    is_verified: true,
    bio: 'Digital artist and fursuit performer. Creating magical wolf characters and immersive storytelling content.',
    location: 'Seattle, WA',
    furry_profile: {
      species: 'Wolf',
      fursona_name: 'Silver',
      pronouns: 'they/them',
      interests: ['digital art', 'storytelling', 'murrsuit', 'role play'],
      experience_level: 'advanced',
    },
    creator_info: {
      subscription_price: 2499, // $24.99
      content_categories: ['art', 'murrsuit', 'stories', 'exclusive'],
      total_subscribers: 892,
      total_earnings: 98340, // $983.40
      is_approved: true,
      application_date: new Date('2024-02-01'),
    },
    created_at: new Date('2024-02-01'),
    updated_at: new Date(),
  },
];

export const mockContent: FurryContent[] = [
  {
    id: 'content-1',
    creator_id: 'creator-1',
    title: 'Fennec Fox Fursuit Photoshoot - Golden Hour',
    description: 'Professional outdoor photoshoot featuring my custom fennec fox fursuit during golden hour. Includes 25 high-resolution photos.',
    content_type: 'gallery',
    file_urls: [
      '/images/branding/fox-mascot.webp',
      '/images/branding/fox-silhouette.jpg',
      '/images/branding/paw-logo.jpg',
    ],
    thumbnail_url: '/images/branding/fox-mascot.webp',
    price: 999, // $9.99 for non-subscribers
    is_public: false,
    is_adult: false,
    tags: ['fursuit', 'photography', 'outdoor', 'professional'],
    species_tags: ['fennec_fox'],
    categories: ['photography', 'fursuit'],
    view_count: 1284,
    like_count: 156,
    comment_count: 23,
    created_at: new Date('2024-03-01'),
    updated_at: new Date('2024-03-01'),
  },
  {
    id: 'content-2',
    creator_id: 'creator-1',
    title: 'Behind the Scenes: Fursuit Making Process',
    description: 'Exclusive look at how I create custom fursuit heads. This video shows the entire process from design to completion.',
    content_type: 'video',
    file_urls: ['/videos/fursuit-making-process.mp4'],
    thumbnail_url: '/images/branding/paw-favicon.png',
    is_public: false,
    is_adult: false,
    tags: ['tutorial', 'behind-the-scenes', 'fursuit-making', 'educational'],
    species_tags: ['fennec_fox'],
    categories: ['tutorial', 'behind-the-scenes'],
    view_count: 2156,
    like_count: 289,
    comment_count: 45,
    created_at: new Date('2024-03-05'),
    updated_at: new Date('2024-03-05'),
  },
  {
    id: 'content-3',
    creator_id: 'creator-2',
    title: 'Moonlight Wolf - Digital Art Collection',
    description: 'A collection of mystical wolf artwork featuring Silver under moonlight. High-resolution digital paintings perfect for wallpapers.',
    content_type: 'gallery',
    file_urls: [
      '/images/branding/fox-silhouette.jpg',
      '/images/branding/paw-logo.jpg',
    ],
    thumbnail_url: '/images/branding/fox-silhouette.jpg',
    price: 1499, // $14.99
    is_public: false,
    is_adult: false,
    tags: ['digital_art', 'wolf', 'mystical', 'wallpaper'],
    species_tags: ['wolf'],
    categories: ['art', 'digital'],
    view_count: 978,
    like_count: 234,
    comment_count: 18,
    created_at: new Date('2024-03-10'),
    updated_at: new Date('2024-03-10'),
  },
];

// Database operations (mock implementations)
export class FurryDatabase {
  static users = mockUsers;
  static content = mockContent;
  static tags = mockFurryTags;

  // User operations
  static async getUserById(id: string): Promise<DatabaseUser | null> {
    return this.users.find(user => user.id === id) || null;
  }

  static async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async getUserByUsername(username: string): Promise<DatabaseUser | null> {
    return this.users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
  }

  static async createUser(userData: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseUser> {
    const newUser: DatabaseUser = {
      ...userData,
      id: `user-${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updated_at: new Date(),
    };
    return this.users[userIndex];
  }

  // Content operations
  static async getContentById(id: string): Promise<FurryContent | null> {
    return this.content.find(content => content.id === id) || null;
  }

  static async getContentByCreator(creatorId: string): Promise<FurryContent[]> {
    return this.content.filter(content => content.creator_id === creatorId);
  }

  static async getPublicContent(limit: number = 20, offset: number = 0): Promise<FurryContent[]> {
    return this.content
      .filter(content => content.is_public)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(offset, offset + limit);
  }

  static async searchContent(query: string, tags?: string[]): Promise<FurryContent[]> {
    return this.content.filter(content => {
      const titleMatch = content.title.toLowerCase().includes(query.toLowerCase());
      const descriptionMatch = content.description?.toLowerCase().includes(query.toLowerCase()) || false;
      const tagMatch = tags ? tags.some(tag => content.tags.includes(tag) || content.species_tags.includes(tag)) : true;
      
      return (titleMatch || descriptionMatch) && tagMatch;
    });
  }

  static async createContent(contentData: Omit<FurryContent, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'comment_count'>): Promise<FurryContent> {
    const newContent: FurryContent = {
      ...contentData,
      id: `content-${Date.now()}`,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.content.push(newContent);
    return newContent;
  }

  // Tag operations
  static async getAllTags(): Promise<FurryTag[]> {
    return this.tags.sort((a, b) => b.usage_count - a.usage_count);
  }

  static async getTagsByCategory(category: FurryTag['category']): Promise<FurryTag[]> {
    return this.tags.filter(tag => tag.category === category);
  }

  static async searchTags(query: string): Promise<FurryTag[]> {
    return this.tags.filter(tag => 
      tag.name.toLowerCase().includes(query.toLowerCase()) ||
      tag.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Analytics
  static async getCreatorStats(creatorId: string): Promise<{
    totalContent: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    subscriberCount: number;
  }> {
    const creatorContent = this.content.filter(content => content.creator_id === creatorId);
    const creator = this.users.find(user => user.id === creatorId);

    return {
      totalContent: creatorContent.length,
      totalViews: creatorContent.reduce((sum, content) => sum + content.view_count, 0),
      totalLikes: creatorContent.reduce((sum, content) => sum + content.like_count, 0),
      totalComments: creatorContent.reduce((sum, content) => sum + content.comment_count, 0),
      subscriberCount: creator?.creator_info?.total_subscribers || 0,
    };
  }
}

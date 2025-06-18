// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: 'creator' | 'subscriber' | 'admin' | 'CREATOR' | 'SUBSCRIBER' | 'ADMIN';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptionTier?: UserSubscriptionTier;
  subscriptionStatus?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED';
  authProvider?: 'email' | 'google';
  googleId?: string;
  bio?: string;
  coverImage?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

// Subscription Tier Types for Users
export interface UserSubscriptionTier {
  id: string;
  name: string;
  type: 'subscriber' | 'creator';
  level: 'basic' | 'pro' | 'premium' | 'vip';
  price: number;
  features: string[];
  messagingFeatures: {
    canMessageCreators: boolean;
    allowedCreatorTiers: string[];
    maxConversationsPerDay: number;
    canSendMedia: boolean;
    canReceivePrioritySupport: boolean;
    canSendBulkMessages: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
    allowedSenderTiers?: string[];
  };
  contentAccess: {
    canViewPremiumContent: boolean;
    canViewExclusiveContent: boolean;
    downloadPermissions: boolean;
    earlyAccess: boolean;
    canViewLiveStreams: boolean;
    qualityLimits: 'sd' | 'hd' | 'uhd';
  };
  creatorFeatures?: {
    maxUploadsPerDay: number;
    maxSubscribers: number;
    analyticsAccess: 'basic' | 'advanced' | 'premium';
    customBranding: boolean;
    liveStreamingEnabled: boolean;
    bulkMessageLimit: number;
    platformFeePercentage: number;
    canSetContentTiers: boolean;
    canCreateCollections: boolean;
    maxStorageGB: number;
    advancedScheduling: boolean;
    customPricing: boolean;
  };
  maxConversations: number;
  supportLevel: 'basic' | 'priority' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  validUntil?: Date;
}

// Messaging Permissions
export interface MessagingPermissions {
  canReceiveMessages: boolean;
  allowedSenderTiers: string[];
  canSendBulkMessages: boolean;
  maxMessagesPerDay: number;
  canSendMedia: boolean;
  canReceiveTips: boolean;
}

export interface Creator extends User {
  role: 'creator';
  bio?: string;
  coverImage?: string;
  subscriptionPrice: number;
  subscriberCount: number;
  totalEarnings: number;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

// Content Types
export interface Content {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  type: 'photo' | 'video' | 'text' | 'livestream';
  mediaUrl?: string;
  mediaUrls?: string[]; // For multiple images/videos
  thumbnailUrl?: string;
  isPublic: boolean;
  requiresSubscription: boolean;
  privacyLevel: 'public' | 'subscribers' | 'premium' | 'private';
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  scheduledAt?: Date;
  tags: string[];
  category?: string;
  fileSize?: number;
  fileName?: string;
  mimeType?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // For videos
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface ContentUpload {
  title: string;
  description: string;
  files: ContentFile[];
  tags: string[];
  category: string;
  privacyLevel: 'public' | 'subscribers' | 'premium' | 'private';
  scheduledAt?: Date;
}

export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  contentCount: number;
}

export interface ContentAnalytics {
  contentId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  revenue?: number;
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
  demographicData?: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
  };
}

export interface ContentFolder {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  contentCount: number;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription Types
// Subscription interface moved to payment section to avoid conflicts

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  isActive: boolean;
}

// Enhanced Platform Subscription Tiers with Detailed Permissions
export interface PlatformSubscriptionTier {
  id: string;
  name: string;
  type: 'subscriber' | 'creator';
  level: 'basic' | 'pro' | 'premium' | 'vip';
  price: number;
  currency: string;
  usdPrice: number;
  billingPeriod: 'monthly' | 'yearly';
  description: string;
  features: string[];
  limitations: string[];
  messagingFeatures: {
    canMessageCreators: boolean;
    allowedCreatorTiers: string[];
    maxConversationsPerDay: number;
    canSendMedia: boolean;
    canReceivePrioritySupport: boolean;
    canSendBulkMessages: boolean;
    maxFileSize: number; // in MB
    allowedFileTypes: string[];
  };
  contentAccess: {
    canViewPremiumContent: boolean;
    canViewExclusiveContent: boolean;
    downloadPermissions: boolean;
    earlyAccess: boolean;
    canViewLiveStreams: boolean;
    qualityLimits: 'sd' | 'hd' | 'uhd';
  };
  creatorFeatures?: {
    maxUploadsPerDay: number;
    maxSubscribers: number;
    analyticsAccess: 'basic' | 'advanced' | 'premium';
    customBranding: boolean;
    liveStreamingEnabled: boolean;
    bulkMessageLimit: number;
    platformFeePercentage: number;
    canSetContentTiers: boolean;
    canCreateCollections: boolean;
    maxStorageGB: number;
    advancedScheduling: boolean;
    customPricing: boolean;
  };
  isPopular: boolean;
  color: string;
  badge?: string;
}

// Enhanced Content Access Permissions
export interface ContentAccessLevel {
  id: string;
  name: string;
  requiredTiers: string[]; // Array of tier IDs that can access this level
  color: string;
  icon: string;
  description: string;
}

// Creator Content Settings
export interface CreatorContentSettings {
  id: string;
  creatorId: string;
  defaultPrivacyLevel: 'public' | 'subscribers' | 'premium' | 'private';
  allowedMessagingTiers: string[];
  customAccessLevels: ContentAccessLevel[];
  subscriptionPrice?: number;
  tipSettings: {
    enabled: boolean;
    minimumAmount: number;
    suggestedAmounts: number[];
  };
  liveStreamSettings: {
    enabled: boolean;
    subscriberOnly: boolean;
    requiredTier?: string;
  };
}

// Permission Validation Results
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
  requiredTier?: string;
  currentTier?: string;
  upgradeUrl?: string;
}

// Tier Comparison Data
export interface TierComparison {
  feature: string;
  basic: boolean | string | number;
  pro: boolean | string | number;
  premium?: boolean | string | number;
  vip?: boolean | string | number;
}

// Registration with Role and Tier Selection
export interface EnhancedRegistrationData {
  email: string;
  username: string;
  displayName: string;
  password: string;
  role: 'creator' | 'subscriber';
  selectedTier?: string; // Tier ID for immediate subscription
  agreeToTerms: boolean;
  newsletter?: boolean;
}

// Legacy Message Types (replaced by detailed messaging types below)
// These are kept for backward compatibility but should use the detailed types

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'tip' | 'payout';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'stripe' | 'paypal';
  transactionId?: string;
  createdAt: Date;
}

// Analytics Types
export interface Analytics {
  totalRevenue: number;
  monthlyRevenue: number;
  subscriberGrowth: number;
  contentViews: number;
  engagement: number;
  topContent: Content[];
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: number | string;
  disabled?: boolean;
  external?: boolean;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: 'creator' | 'subscriber';
  agreeToTerms: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Platform Stats
export interface PlatformStats {
  totalUsers: number;
  totalCreators: number;
  totalRevenue: number;
  totalContent: number;
  monthlyActiveUsers: number;
}

// Content Management Form Types
export interface ContentFormData {
  title: string;
  description: string;
  tags: string[];
  category: string;
  privacyLevel: 'public' | 'subscribers' | 'premium' | 'private';
  scheduledAt?: Date;
  folderId?: string;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// File Upload Types
export type SupportedImageType = 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/webp' | 'image/gif';
export type SupportedVideoType = 'video/mp4' | 'video/webm' | 'video/mov' | 'video/quicktime';
export type SupportedFileType = SupportedImageType | SupportedVideoType;

export interface FileValidation {
  maxImageSize: number; // in MB
  maxVideoSize: number; // in MB
  supportedImageTypes: SupportedImageType[];
  supportedVideoTypes: SupportedVideoType[];
}

// Content Filter Types
export interface ContentFilter {
  type?: 'photo' | 'video' | 'text' | 'all';
  category?: string;
  status?: 'draft' | 'published' | 'archived' | 'all';
  privacyLevel?: 'public' | 'subscribers' | 'premium' | 'private' | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'mostViewed' | 'mostLiked' | 'alphabetical';
  folderId?: string;
}

// Content Statistics
export interface ContentStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  archivedContent: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagement: number;
  topPerformingContent: Content[];
  recentActivity: Array<{
    type: 'view' | 'like' | 'comment' | 'share';
    contentId: string;
    contentTitle: string;
    timestamp: Date;
    userId?: string;
    username?: string;
  }>;
}

// Subscription & Payment Types
export interface SubscriptionTier {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  price: number; // Monthly price in cents
  benefits: string[];
  color: string;
  isActive: boolean;
  subscriberCount: number;
  contentAccess: 'all' | 'tier-specific' | 'premium-only';
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  creatorId: string;
  tierId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing' | 'paused';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'stripe' | 'paypal';
  provider: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  paypalEmail?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  paymentMethodId?: string;
  subscriptionId?: string;
  clientSecret?: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  creatorId?: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'tip' | 'one_time' | 'refund' | 'payout';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethodType: 'stripe' | 'paypal';
  paymentIntentId?: string;
  description: string;
  fees: number;
  netAmount: number;
  createdAt: Date;
  processedAt?: Date;
}

export interface Payout {
  id: string;
  creatorId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';
  payoutMethodType: 'bank_transfer' | 'paypal' | 'debit_card';
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    bankName: string;
  };
  paypalEmail?: string;
  fees: number;
  netAmount: number;
  scheduledFor: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface Revenue {
  id: string;
  creatorId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  periodStart: Date;
  periodEnd: Date;
  grossRevenue: number;
  platformFees: number;
  paymentProcessingFees: number;
  netRevenue: number;
  subscriptionRevenue: number;
  tipRevenue: number;
  oneTimeRevenue: number;
  subscriberCount: number;
  newSubscribers: number;
  churnedSubscribers: number;
  averageRevenuePerUser: number;
  createdAt: Date;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  userId: string;
  creatorId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  paidAt?: Date;
  paymentIntentId?: string;
  billingAddress?: BillingAddress;
  taxAmount?: number;
  discountAmount?: number;
  subtotal: number;
  total: number;
  invoiceUrl?: string;
  createdAt: Date;
}

// Payment Form Types
export interface SubscriptionFormData {
  tierId: string;
  paymentMethodType: 'stripe' | 'paypal';
  billingAddress?: BillingAddress;
  taxId?: string;
  couponCode?: string;
}

export interface PaymentMethodFormData {
  type: 'stripe' | 'paypal';
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvc?: string;
  paypalEmail?: string;
  billingAddress: BillingAddress;
  setAsDefault: boolean;
}

export interface TierFormData {
  name: string;
  description: string;
  price: number;
  benefits: string[];
  color: string;
  contentAccess: 'all' | 'tier-specific' | 'premium-only';
}

// Analytics Types
export interface PaymentAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  totalSubscribers: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  lifetimeValue: number;
  revenueByTier: Array<{
    tierId: string;
    tierName: string;
    revenue: number;
    subscriberCount: number;
  }>;
  revenueOverTime: Array<{
    date: string;
    revenue: number;
    subscribers: number;
  }>;
  paymentMethodDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  topEarningContent: Array<{
    contentId: string;
    title: string;
    revenue: number;
    views: number;
  }>;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  newSubscriptionsThisMonth: number;
  churnedSubscriptionsThisMonth: number;
  churnRate: number;
  retentionRate: number;
  subscriptionsByTier: Array<{
    tierId: string;
    tierName: string;
    count: number;
    revenue: number;
  }>;
  subscriptionGrowth: Array<{
    date: string;
    new: number;
    churned: number;
    net: number;
  }>;
  averageSubscriptionLength: number;
  cancellationReasons: Array<{
    reason: string;
    count: number;
  }>;
}

// Context Types
export interface PaymentContextType {
  // Subscription Tiers
  subscriptionTiers: SubscriptionTier[];
  createTier: (tierData: TierFormData) => Promise<SubscriptionTier>;
  updateTier: (tierId: string, updates: Partial<SubscriptionTier>) => Promise<SubscriptionTier>;
  deleteTier: (tierId: string) => Promise<void>;
  
  // Subscriptions
  userSubscriptions: Subscription[];
  creatorSubscriptions: Subscription[];
  subscribe: (subscriptionData: SubscriptionFormData) => Promise<Subscription>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (paymentMethodData: PaymentMethodFormData) => Promise<PaymentMethod>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  
  // Transactions & Billing
  transactions: Transaction[];
  invoices: Invoice[];
  getTransactionHistory: (filters?: any) => Promise<Transaction[]>;
  getInvoices: () => Promise<Invoice[]>;
  
  // Payouts & Revenue
  payouts: Payout[];
  revenue: Revenue[];
  requestPayout: (amount: number, payoutMethod: any) => Promise<Payout>;
  getRevenue: (period: string) => Promise<Revenue>;
  
  // Analytics
  paymentAnalytics: PaymentAnalytics | null;
  subscriptionAnalytics: SubscriptionAnalytics | null;
  refreshAnalytics: () => Promise<void>;
  
  // State
  isLoading: boolean;
  error: string | null;
}

// Stripe Types
export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

// PayPal Types
export interface PayPalOrderData {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}

export interface PayPalSubscriptionData {
  id: string;
  status: string;
  billing_info: {
    next_billing_time: string;
  };
}

// Feature Access Types
export interface ContentAccess {
  canView: boolean;
  canDownload: boolean;
  canComment: boolean;
  requiresUpgrade: boolean;
  requiredTier?: string;
  message?: string;
}

export interface FeatureAccess {
  contentAccess: ContentAccess;
  messagingAccess: boolean;
  prioritySupport: boolean;
  exclusiveContent: boolean;
  liveStreamAccess: boolean;
  customRequests: boolean;
}

// Messaging & Communication Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: MessageAttachment[];
  replyTo?: string;
  reactions?: MessageReaction[];
  editedAt?: Date;
  deletedAt?: Date;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'file' | 'voice';
  name: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
  duration?: number; // for video/voice
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface MessageReaction {
  id: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'broadcast' | 'support';
  name?: string;
  description?: string;
  avatar?: string;
  participants: ConversationParticipant[];
  creatorId?: string;
  lastMessage?: Message;
  lastMessageAt?: Date;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  isPinned: boolean;
  settings: ConversationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationParticipant {
  userId: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  lastReadAt?: Date;
  isActive: boolean;
  permissions: ParticipantPermissions;
}

export interface ParticipantPermissions {
  canSendMessages: boolean;
  canSendMedia: boolean;
  canAddParticipants: boolean;
  canRemoveParticipants: boolean;
  canEditConversation: boolean;
  canDeleteMessages: boolean;
}

export interface ConversationSettings {
  isEncrypted: boolean;
  allowFileSharing: boolean;
  allowVoiceMessages: boolean;
  maxParticipants?: number;
  autoDeleteAfter?: number; // days
  moderationEnabled: boolean;
  wordFilter: string[];
}

export interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  isTyping?: {
    conversationId: string;
    timestamp: Date;
  };
  customStatus?: string;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  };
  messagePreview: boolean;
  vibration: boolean;
  notificationSound: string;
}

export interface MessageNotification {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  type: 'message' | 'mention' | 'reaction' | 'broadcast';
  title: string;
  body: string;
  avatar?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface BroadcastMessage {
  id: string;
  senderId: string;
  title: string;
  content: string;
  recipients: BroadcastRecipient[];
  attachments?: MessageAttachment[];
  scheduledFor?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  analytics: BroadcastAnalytics;
  createdAt: Date;
}

export interface BroadcastRecipient {
  userId: string;
  tier?: string;
  deliveredAt?: Date;
  readAt?: Date;
  status: 'pending' | 'delivered' | 'read' | 'failed';
}

export interface BroadcastAnalytics {
  totalRecipients: number;
  delivered: number;
  read: number;
  failed: number;
  engagement: {
    replies: number;
    reactions: number;
    clicks: number;
  };
}

export interface VoiceMessage {
  id: string;
  messageId: string;
  duration: number;
  waveform: number[];
  transcription?: string;
  isPlaying: boolean;
  currentTime: number;
}

export interface ChatTheme {
  id: string;
  name: string;
  bubbleColors: {
    sent: string;
    received: string;
  };
  textColors: {
    sent: string;
    received: string;
  };
  backgroundColor: string;
  wallpaper?: string;
}

export interface MessageDraft {
  conversationId: string;
  content: string;
  attachments: MessageAttachment[];
  replyTo?: string;
  lastModified: Date;
}

// Messaging Context Types
export interface MessagingContextType {
  // Conversations
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  createConversation: (type: string, participants: string[], name?: string) => Promise<Conversation>;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  
  // Messages
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, content: string, type?: string, attachments?: MessageAttachment[]) => Promise<Message>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  markAsRead: (conversationId: string, messageId?: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  
  // Media & Files
  uploadAttachment: (file: File, type: string) => Promise<MessageAttachment>;
  recordVoiceMessage: () => Promise<MessageAttachment>;
  
  // Presence & Typing
  userPresence: Record<string, UserPresence>;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  updateStatus: (status: string, customMessage?: string) => void;
  
  // Broadcasts
  broadcasts: BroadcastMessage[];
  createBroadcast: (title: string, content: string, recipients: string[], attachments?: MessageAttachment[]) => Promise<BroadcastMessage>;
  scheduleBroadcast: (broadcastId: string, scheduledFor: Date) => Promise<void>;
  
  // Notifications
  notifications: MessageNotification[];
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  
  // Search & Filters
  searchMessages: (query: string, conversationId?: string) => Promise<Message[]>;
  searchConversations: (query: string) => Promise<Conversation[]>;
  
  // Drafts
  drafts: Record<string, MessageDraft>;
  saveDraft: (conversationId: string, content: string, attachments: MessageAttachment[]) => void;
  loadDraft: (conversationId: string) => MessageDraft | null;
  clearDraft: (conversationId: string) => void;
  
  // Settings
  chatTheme: ChatTheme;
  setChatTheme: (theme: ChatTheme) => void;
  
  // State
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
}

// Emoji and Stickers
export interface EmojiCategory {
  id: string;
  name: string;
  emojis: Emoji[];
}

export interface Emoji {
  id: string;
  unicode: string;
  name: string;
  keywords: string[];
  category: string;
}

export interface Sticker {
  id: string;
  name: string;
  url: string;
  packId: string;
  keywords: string[];
}

export interface StickerPack {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  stickers: Sticker[];
  isPremium: boolean;
}

// ========================================
// ADMIN PANEL TYPES
// ========================================

// Admin User Management
export interface AdminUser extends User {
  status: 'active' | 'suspended' | 'banned' | 'pending';
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  loginHistory: LoginRecord[];
  subscriptions: Subscription[];
  totalSpent: number;
  lastActiveAt: Date;
  ipAddress: string;
  location?: {
    country: string;
    city: string;
  };
  flaggedReasons?: string[];
  moderationNotes?: string;
  createdContentCount: number;
  subscriptionCount: number;
}

export interface LoginRecord {
  id: string;
  userId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
  };
  success: boolean;
  failureReason?: string;
}

export interface UserVerificationRequest {
  id: string;
  userId: string;
  type: 'identity' | 'creator' | 'age';
  status: 'pending' | 'approved' | 'rejected';
  documents: VerificationDocument[];
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

export interface VerificationDocument {
  id: string;
  type: 'id_front' | 'id_back' | 'selfie' | 'address_proof' | 'business_license';
  url: string;
  filename: string;
  uploadedAt: Date;
}

// Admin Content Management
export interface AdminContent extends Content {
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  flags: ContentFlag[];
  reports: ContentReport[];
  engagementMetrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    subscriptionsGenerated: number;
  };
  revenue: {
    direct: number;
    subscriptions: number;
    tips: number;
  };
}

export interface ContentFlag {
  id: string;
  contentId: string;
  reason: 'inappropriate' | 'spam' | 'copyright' | 'violence' | 'harassment' | 'other';
  description?: string;
  flaggedBy: string; // system or user ID
  flaggedAt: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'dismissed';
}

export interface ContentReport {
  id: string;
  contentId: string;
  reportedBy: string;
  reason: string;
  description: string;
  reportedAt: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  resolution?: string;
}

export interface ModerationAction {
  id: string;
  type: 'approve' | 'reject' | 'remove' | 'flag' | 'warn' | 'suspend';
  targetType: 'content' | 'user' | 'comment';
  targetId: string;
  moderatorId: string;
  reason: string;
  notes?: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Admin Payment Management
export interface AdminPayment extends Payment {
  fees: {
    platform: number;
    processor: number;
    total: number;
  };
  refunds: PaymentRefund[];
  disputes: PaymentDispute[];
  riskScore: number;
  processingDetails: {
    processor: 'stripe' | 'paypal';
    processorTransactionId: string;
    processingTime: number;
    retryCount: number;
  };
}

export interface PaymentRefund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  requestedBy: string;
  processedAt?: Date;
  processorRefundId?: string;
}

export interface PaymentDispute {
  id: string;
  paymentId: string;
  reason: string;
  amount: number;
  status: 'open' | 'under_review' | 'resolved' | 'lost';
  evidence: DisputeEvidence[];
  createdAt: Date;
  resolvedAt?: Date;
}

export interface DisputeEvidence {
  id: string;
  type: 'document' | 'screenshot' | 'communication';
  url: string;
  description: string;
  uploadedAt: Date;
}

export interface CreatorPayout {
  id: string;
  creatorId: string;
  amount: number;
  fees: number;
  netAmount: number;
  period: {
    start: Date;
    end: Date;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: {
    type: 'bank_transfer' | 'paypal' | 'stripe';
    details: any;
  };
  processedAt?: Date;
  failureReason?: string;
}

// Admin Analytics
export interface PlatformAnalytics {
  overview: {
    totalUsers: number;
    totalCreators: number;
    totalSubscribers: number;
    totalRevenue: number;
    totalContent: number;
    activeSessions: number;
  };
  growth: {
    newUsers: GrowthMetric;
    newCreators: GrowthMetric;
    newSubscriptions: GrowthMetric;
    revenue: GrowthMetric;
    content: GrowthMetric;
  };
  engagement: {
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    contentViews: number;
    messagesSent: number;
  };
  financial: {
    revenue: RevenueBreakdown;
    payouts: PayoutMetrics;
    refunds: RefundMetrics;
    fees: FeeMetrics;
  };
  content: {
    totalUploads: number;
    pendingModeration: number;
    flaggedContent: number;
    topCategories: CategoryMetric[];
  };
}

export interface GrowthMetric {
  current: number;
  previous: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RevenueBreakdown {
  subscriptions: number;
  tips: number;
  payPerView: number;
  total: number;
  byPeriod: TimePeriodData[];
}

export interface PayoutMetrics {
  totalPayouts: number;
  pendingPayouts: number;
  averagePayoutTime: number;
  payoutFailureRate: number;
}

export interface RefundMetrics {
  totalRefunds: number;
  refundRate: number;
  averageRefundAmount: number;
  refundsByReason: { [key: string]: number };
}

export interface FeeMetrics {
  platformFees: number;
  processingFees: number;
  totalFees: number;
  feePercentage: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
  revenue: number;
  growth: number;
}

export interface TimePeriodData {
  period: string;
  value: number;
  date: Date;
}

// Admin Support System
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'content' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
  assignedTo?: string;
  tags: string[];
  attachments: TicketAttachment[];
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  satisfaction?: {
    rating: number;
    feedback?: string;
  };
}

export interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'admin';
  content: string;
  attachments: TicketAttachment[];
  isInternal: boolean;
  createdAt: Date;
}

export interface SupportAgent extends User {
  role: 'admin';
  agentStatus: 'available' | 'busy' | 'offline';
  specializations: string[];
  assignedTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
}

// Admin System Monitoring
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  services: ServiceStatus[];
  metrics: SystemMetrics;
  alerts: SystemAlert[];
  lastUpdated: Date;
}

export interface ServiceStatus {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: number;
  responseTime: number;
  lastIncident?: Date;
}

export interface SystemMetrics {
  serverLoad: number;
  memoryUsage: number;
  diskUsage: number;
  databaseConnections: number;
  queueSize: number;
  errorRate: number;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  service?: string;
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}

// Admin Security
export interface SecurityIncident {
  id: string;
  type: 'login_attempt' | 'data_breach' | 'ddos' | 'fraud' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedUsers: string[];
  ipAddresses: string[];
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  detectedAt: Date;
  resolvedAt?: Date;
  actions: SecurityAction[];
}

export interface SecurityAction {
  id: string;
  type: 'block_ip' | 'suspend_user' | 'increase_monitoring' | 'notify_users';
  description: string;
  executedBy: string;
  executedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Admin Settings
export interface PlatformSettings {
  general: {
    platformName: string;
    platformDescription: string;
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
  };
  features: {
    userRegistration: boolean;
    contentModeration: boolean;
    autoApproval: boolean;
    subscriptions: boolean;
    tips: boolean;
    messaging: boolean;
    livestreaming: boolean;
  };
  content: {
    maxFileSize: number;
    allowedTypes: string[];
    requireModeration: boolean;
    autoDeleteAfter: number;
    watermark: boolean;
  };
  payments: {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    platformFee: number;
    minimumPayout: number;
    payoutSchedule: 'daily' | 'weekly' | 'monthly';
  };
  security: {
    requireEmailVerification: boolean;
    require2FA: boolean;
    sessionTimeout: number;
    passwordPolicy: PasswordPolicy;
    ipWhitelist: string[];
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    webhooks: WebhookConfig[];
  };
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxAge: number;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}

// Admin Context Type
export interface AdminContextType {
  // User Management
  users: AdminUser[];
  verificationRequests: UserVerificationRequest[];
  getUserById: (id: string) => AdminUser | null;
  updateUserStatus: (userId: string, status: string) => Promise<void>;
  verifyUser: (userId: string, approved: boolean, notes?: string) => Promise<void>;
  banUser: (userId: string, reason: string) => Promise<void>;
  getUserAnalytics: (userId: string) => Promise<any>;
  
  // Content Management
  pendingContent: AdminContent[];
  flaggedContent: AdminContent[];
  getContentById: (id: string) => AdminContent | null;
  moderateContent: (contentId: string, action: string, notes?: string) => Promise<void>;
  flagContent: (contentId: string, reason: string) => Promise<void>;
  getContentAnalytics: () => Promise<any>;
  
  // Payment Management
  payments: AdminPayment[];
  payouts: CreatorPayout[];
  getPaymentById: (id: string) => AdminPayment | null;
  processRefund: (paymentId: string, amount: number, reason: string) => Promise<void>;
  processPayout: (creatorId: string, amount: number) => Promise<void>;
  getFinancialAnalytics: () => Promise<any>;
  
  // Analytics
  platformAnalytics: PlatformAnalytics;
  refreshAnalytics: () => Promise<void>;
  generateReport: (type: string, filters: any) => Promise<any>;
  
  // Support
  supportTickets: SupportTicket[];
  supportAgents: SupportAgent[];
  createTicket: (ticket: Partial<SupportTicket>) => Promise<SupportTicket>;
  updateTicket: (ticketId: string, updates: Partial<SupportTicket>) => Promise<void>;
  assignTicket: (ticketId: string, agentId: string) => Promise<void>;
  
  // System Monitoring
  systemHealth: SystemHealth;
  auditLogs: AuditLog[];
  securityIncidents: SecurityIncident[];
  getSystemMetrics: () => Promise<SystemMetrics>;
  createAlert: (alert: Partial<SystemAlert>) => Promise<void>;
  
  // Settings
  platformSettings: PlatformSettings;
  updateSettings: (settings: Partial<PlatformSettings>) => Promise<void>;
  
  // Tag Management
  tags: PlatformTag[];
  createTag: (tag: Partial<PlatformTag>) => Promise<void>;
  updateTag: (tagId: string, updates: Partial<PlatformTag>) => Promise<void>;
  deleteTag: (tagId: string) => Promise<void>;
  getTagAnalytics: (tagId?: string) => Promise<TagAnalytics>;
  bulkTagOperations: (operation: 'apply' | 'remove', tagIds: string[], contentIds: string[]) => Promise<void>;
  
  // Enhanced User Management
  editUser: (userId: string, updates: Partial<AdminUser>) => Promise<void>;
  promoteUser: (userId: string, role: 'creator' | 'admin') => Promise<void>;
  getUserActivity: (userId: string) => Promise<UserActivity[]>;
  bulkUserOperations: (operation: 'activate' | 'suspend' | 'ban', userIds: string[]) => Promise<void>;
  
  // Enhanced Content Moderation
  deleteContent: (contentId: string, reason: string) => Promise<void>;
  bulkContentOperations: (operation: 'approve' | 'reject' | 'delete', contentIds: string[], reason?: string) => Promise<void>;
  searchContent: (query: string, filters?: ContentSearchFilters) => Promise<AdminContent[]>;
  editContent: (contentId: string, updates: Partial<AdminContent>) => Promise<void>;
  
  // State
  isLoading: boolean;
  error: string | null;
  selectedUser: AdminUser | null;
  setSelectedUser: (user: AdminUser | null) => void;
}

// Enhanced Admin Types

// Tag Management Types
export interface PlatformTag {
  id: string;
  name: string;
  description?: string;
  color: string;
  category: string;
  usageCount: number;
  isActive: boolean;
  parentTagId?: string; // For hierarchical tags
  childTags: string[]; // IDs of child tags
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin user ID
}

export interface TagAnalytics {
  tagId: string;
  tagName: string;
  usageCount: number;
  contentCount: number;
  popularityTrend: TimePeriodData[];
  associatedCreators: number;
  revenue: number;
  engagementMetrics: {
    averageLikes: number;
    averageViews: number;
    averageComments: number;
  };
}

// Enhanced User Management Types
export interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'content_upload' | 'purchase' | 'subscription' | 'message' | 'report';
  description: string;
  timestamp: Date;
  ipAddress: string;
  device: string;
  location?: string;
  metadata?: Record<string, any>;
}

// Enhanced Content Moderation Types
export interface ContentSearchFilters {
  creatorId?: string;
  type?: 'photo' | 'video' | 'text' | 'livestream';
  status?: 'draft' | 'published' | 'archived' | 'scheduled';
  moderationStatus?: 'pending' | 'approved' | 'rejected' | 'flagged';
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  minViews?: number;
  maxViews?: number;
  hasReports?: boolean;
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AdminContextType,
  AdminUser,
  AdminContent,
  AdminPayment,
  CreatorPayout,
  PlatformAnalytics,
  SupportTicket,
  SupportAgent,
  SystemHealth,
  AuditLog,
  SecurityIncident,
  PlatformSettings,
  UserVerificationRequest,
  SystemAlert,
  GrowthMetric,
  TimePeriodData,
  PlatformTag,
  TagAnalytics,
  UserActivity,
  ContentSearchFilters,
} from '@/types';
import { useAuth } from './AuthContext';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<UserVerificationRequest[]>([]);
  const [pendingContent, setPendingContent] = useState<AdminContent[]>([]);
  const [flaggedContent, setFlaggedContent] = useState<AdminContent[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [payouts, setPayouts] = useState<CreatorPayout[]>([]);
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics>({} as PlatformAnalytics);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [supportAgents, setSupportAgents] = useState<SupportAgent[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({} as SystemHealth);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({} as PlatformSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  // Enhanced State
  const [tags, setTags] = useState<PlatformTag[]>([]);

  // Initialize data when user changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      initializeAdminData();
    }
  }, [user]);

  const initializeAdminData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadContent(),
        loadPayments(),
        loadAnalytics(),
        loadSupportData(),
        loadSystemData(),
        loadSettings(),
        loadTags(),
      ]);
    } catch (error) {
      console.error('Failed to initialize admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    // Mock user data - in real app, this would be API calls
    const mockUsers: AdminUser[] = [
      {
        id: 'user-1',
        email: 'creator@example.com',
        username: 'alexcreator',
        displayName: 'Alex Creative',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'creator',
        isVerified: true,
        status: 'active',
        verificationStatus: 'verified',
        loginHistory: [],
        subscriptions: [],
        totalSpent: 0,
        lastActiveAt: new Date(Date.now() - 3600000), // 1 hour ago
        ipAddress: '192.168.1.100',
        location: { country: 'United States', city: 'San Francisco' },
        createdContentCount: 156,
        subscriptionCount: 2847,
        createdAt: new Date(Date.now() - 86400000 * 90), // 90 days ago
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        email: 'subscriber@example.com',
        username: 'johnsub',
        displayName: 'John Subscriber',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'subscriber',
        isVerified: true,
        status: 'active',
        verificationStatus: 'verified',
        loginHistory: [],
        subscriptions: [],
        totalSpent: 299.99,
        lastActiveAt: new Date(Date.now() - 1800000), // 30 minutes ago
        ipAddress: '192.168.1.101',
        location: { country: 'Canada', city: 'Toronto' },
        createdContentCount: 0,
        subscriptionCount: 3,
        createdAt: new Date(Date.now() - 86400000 * 45), // 45 days ago
        updatedAt: new Date(),
      },
      {
        id: 'user-3',
        email: 'pending@example.com',
        username: 'newcreator',
        displayName: 'New Creator',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        role: 'creator',
        isVerified: false,
        status: 'pending',
        verificationStatus: 'pending',
        loginHistory: [],
        subscriptions: [],
        totalSpent: 0,
        lastActiveAt: new Date(Date.now() - 7200000), // 2 hours ago
        ipAddress: '192.168.1.102',
        location: { country: 'United Kingdom', city: 'London' },
        createdContentCount: 3,
        subscriptionCount: 0,
        createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
        updatedAt: new Date(),
      },
      {
        id: 'user-4',
        email: 'flagged@example.com',
        username: 'flaggeduser',
        displayName: 'Flagged User',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        role: 'creator',
        isVerified: true,
        status: 'suspended',
        verificationStatus: 'verified',
        loginHistory: [],
        subscriptions: [],
        totalSpent: 0,
        lastActiveAt: new Date(Date.now() - 86400000), // 1 day ago
        ipAddress: '192.168.1.103',
        location: { country: 'Australia', city: 'Sydney' },
        flaggedReasons: ['Inappropriate content', 'Multiple reports'],
        moderationNotes: 'Suspended for policy violations. Under review.',
        createdContentCount: 45,
        subscriptionCount: 234,
        createdAt: new Date(Date.now() - 86400000 * 120), // 120 days ago
        updatedAt: new Date(),
      },
    ];

    const mockVerificationRequests: UserVerificationRequest[] = [
      {
        id: 'verification-1',
        userId: 'user-3',
        type: 'creator',
        status: 'pending',
        documents: [
          {
            id: 'doc-1',
            type: 'id_front',
            url: '/mock-id-document.jpg',
            filename: 'drivers_license_front.jpg',
            uploadedAt: new Date(Date.now() - 86400000),
          },
          {
            id: 'doc-2',
            type: 'selfie',
            url: '/mock-selfie.jpg',
            filename: 'verification_selfie.jpg',
            uploadedAt: new Date(Date.now() - 86400000),
          },
        ],
        submittedAt: new Date(Date.now() - 86400000),
      },
    ];

    setUsers(mockUsers);
    setVerificationRequests(mockVerificationRequests);
  };

  const loadContent = async () => {
    const mockPendingContent: AdminContent[] = [
      {
        id: 'content-pending-1',
        creatorId: 'user-3',
        title: 'New Photography Tutorial',
        description: 'Learn advanced lighting techniques',
        type: 'video',
        mediaUrl: '/mock-video.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300',
        isPublic: false,
        requiresSubscription: true,
        privacyLevel: 'subscribers',
        status: 'published',
        tags: ['photography', 'tutorial', 'lighting'],
        category: 'Education',
        likesCount: 0,
        commentsCount: 0,
        viewsCount: 0,
        sharesCount: 0,
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        moderationStatus: 'pending',
        flags: [],
        reports: [],
        engagementMetrics: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          subscriptionsGenerated: 0,
        },
        revenue: {
          direct: 0,
          subscriptions: 0,
          tips: 0,
        },
      },
    ];

    const mockFlaggedContent: AdminContent[] = [
      {
        id: 'content-flagged-1',
        creatorId: 'user-4',
        title: 'Controversial Content',
        description: 'This content has been flagged by users',
        type: 'photo',
        mediaUrl: '/mock-flagged-image.jpg',
        thumbnailUrl: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=300',
        isPublic: true,
        requiresSubscription: false,
        privacyLevel: 'public',
        status: 'published',
        tags: ['controversial'],
        category: 'Other',
        likesCount: 45,
        commentsCount: 23,
        viewsCount: 1250,
        sharesCount: 8,
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(Date.now() - 86400000 * 2),
        moderationStatus: 'flagged',
        flags: [
          {
            id: 'flag-1',
            contentId: 'content-flagged-1',
            reason: 'inappropriate',
            description: 'Content violates community guidelines',
            flaggedBy: 'system',
            flaggedAt: new Date(Date.now() - 43200000),
            severity: 'high',
            status: 'active',
          },
        ],
        reports: [
          {
            id: 'report-1',
            contentId: 'content-flagged-1',
            reportedBy: 'user-2',
            reason: 'Inappropriate content',
            description: 'This content is offensive and violates platform policies',
            reportedAt: new Date(Date.now() - 43200000),
            status: 'pending',
          },
        ],
        engagementMetrics: {
          views: 1250,
          likes: 45,
          comments: 23,
          shares: 8,
          subscriptionsGenerated: 2,
        },
        revenue: {
          direct: 0,
          subscriptions: 89.98,
          tips: 15.00,
        },
      },
    ];

    setPendingContent(mockPendingContent);
    setFlaggedContent(mockFlaggedContent);
  };

  const loadPayments = async () => {
    const mockPayments: AdminPayment[] = [
      {
        id: 'payment-1',
        userId: 'user-2',
        amount: 19.99,
        currency: 'USD',
        type: 'subscription',
        status: 'completed',
        paymentMethod: 'stripe',
        transactionId: 'txn_stripe_123',
        createdAt: new Date(Date.now() - 86400000),
        fees: {
          platform: 1.99,
          processor: 0.59,
          total: 2.58,
        },
        refunds: [],
        disputes: [],
        riskScore: 0.1,
        processingDetails: {
          processor: 'stripe',
          processorTransactionId: 'pi_stripe_123',
          processingTime: 2500,
          retryCount: 0,
        },
      },
      {
        id: 'payment-2',
        userId: 'user-2',
        amount: 50.00,
        currency: 'USD',
        type: 'tip',
        status: 'completed',
        paymentMethod: 'paypal',
        transactionId: 'txn_paypal_456',
        createdAt: new Date(Date.now() - 172800000),
        fees: {
          platform: 5.00,
          processor: 1.75,
          total: 6.75,
        },
        refunds: [],
        disputes: [],
        riskScore: 0.05,
        processingDetails: {
          processor: 'paypal',
          processorTransactionId: 'pp_456',
          processingTime: 1800,
          retryCount: 0,
        },
      },
    ];

    const mockPayouts: CreatorPayout[] = [
      {
        id: 'payout-1',
        creatorId: 'user-1',
        amount: 1500.00,
        fees: 75.00,
        netAmount: 1425.00,
        period: {
          start: new Date(Date.now() - 86400000 * 30),
          end: new Date(Date.now() - 86400000),
        },
        status: 'completed',
        paymentMethod: {
          type: 'bank_transfer',
          details: { accountNumber: '****1234', routingNumber: '****5678' },
        },
        processedAt: new Date(Date.now() - 86400000),
      },
      {
        id: 'payout-2',
        creatorId: 'user-1',
        amount: 2100.00,
        fees: 105.00,
        netAmount: 1995.00,
        period: {
          start: new Date(Date.now() - 86400000 * 60),
          end: new Date(Date.now() - 86400000 * 30),
        },
        status: 'pending',
        paymentMethod: {
          type: 'bank_transfer',
          details: { accountNumber: '****1234', routingNumber: '****5678' },
        },
      },
    ];

    setPayments(mockPayments);
    setPayouts(mockPayouts);
  };

  const loadAnalytics = async () => {
    const mockAnalytics: PlatformAnalytics = {
      overview: {
        totalUsers: 12847,
        totalCreators: 3421,
        totalSubscribers: 9426,
        totalRevenue: 284756.89,
        totalContent: 45672,
        activeSessions: 1247,
      },
      growth: {
        newUsers: { current: 156, previous: 142, percentageChange: 9.9, trend: 'up' },
        newCreators: { current: 23, previous: 19, percentageChange: 21.1, trend: 'up' },
        newSubscriptions: { current: 89, previous: 76, percentageChange: 17.1, trend: 'up' },
        revenue: { current: 12450.67, previous: 11234.89, percentageChange: 10.8, trend: 'up' },
        content: { current: 234, previous: 198, percentageChange: 18.2, trend: 'up' },
      },
      engagement: {
        dailyActiveUsers: 8934,
        monthlyActiveUsers: 28476,
        averageSessionDuration: 1847, // seconds
        contentViews: 156789,
        messagesSent: 23456,
      },
      financial: {
        revenue: {
          subscriptions: 215678.45,
          tips: 45632.12,
          payPerView: 23446.32,
          total: 284756.89,
          byPeriod: Array.from({ length: 30 }, (_, i) => ({
            period: `Day ${i + 1}`,
            value: Math.floor(Math.random() * 10000) + 5000,
            date: new Date(Date.now() - (29 - i) * 86400000),
          })),
        },
        payouts: {
          totalPayouts: 199929.62,
          pendingPayouts: 15678.45,
          averagePayoutTime: 2.3, // days
          payoutFailureRate: 0.8, // percentage
        },
        refunds: {
          totalRefunds: 5678.90,
          refundRate: 2.0, // percentage
          averageRefundAmount: 34.56,
          refundsByReason: {
            'Not as described': 45,
            'Technical issues': 23,
            'Billing error': 12,
            'Other': 8,
          },
        },
        fees: {
          platformFees: 28475.69,
          processingFees: 8542.71,
          totalFees: 37018.40,
          feePercentage: 13.0,
        },
      },
      content: {
        totalUploads: 45672,
        pendingModeration: 156,
        flaggedContent: 23,
        topCategories: [
          { category: 'Fitness', count: 8934, revenue: 67834.56, growth: 15.6 },
          { category: 'Art', count: 7821, revenue: 54321.78, growth: 12.3 },
          { category: 'Music', count: 6789, revenue: 45678.90, growth: 18.9 },
          { category: 'Lifestyle', count: 5432, revenue: 34567.12, growth: 8.7 },
          { category: 'Education', count: 4321, revenue: 23456.78, growth: 22.1 },
        ],
      },
    };

    setPlatformAnalytics(mockAnalytics);
  };

  const loadSupportData = async () => {
    const mockTickets: SupportTicket[] = [
      {
        id: 'ticket-1',
        userId: 'user-2',
        subject: 'Payment Issue - Unable to Subscribe',
        description: 'I am trying to subscribe to a creator but my payment keeps failing. I have checked my card details and they are correct.',
        category: 'billing',
        priority: 'high',
        status: 'open',
        tags: ['payment', 'subscription', 'credit-card'],
        attachments: [],
        messages: [
          {
            id: 'msg-1',
            ticketId: 'ticket-1',
            senderId: 'user-2',
            senderType: 'user',
            content: 'I am trying to subscribe to a creator but my payment keeps failing. I have checked my card details and they are correct.',
            attachments: [],
            isInternal: false,
            createdAt: new Date(Date.now() - 3600000),
          },
        ],
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
      },
      {
        id: 'ticket-2',
        userId: 'user-1',
        subject: 'Content Upload Failing',
        description: 'My video uploads keep timing out after 50% completion. This has been happening for the past 3 days.',
        category: 'technical',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'admin-1',
        tags: ['upload', 'video', 'timeout'],
        attachments: [],
        messages: [
          {
            id: 'msg-2',
            ticketId: 'ticket-2',
            senderId: 'user-1',
            senderType: 'user',
            content: 'My video uploads keep timing out after 50% completion. This has been happening for the past 3 days.',
            attachments: [],
            isInternal: false,
            createdAt: new Date(Date.now() - 86400000),
          },
          {
            id: 'msg-3',
            ticketId: 'ticket-2',
            senderId: 'admin-1',
            senderType: 'admin',
            content: 'Thank you for reporting this issue. We are investigating the upload timeout problem. Can you please try uploading a smaller file to test?',
            attachments: [],
            isInternal: false,
            createdAt: new Date(Date.now() - 43200000),
          },
        ],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 43200000),
      },
    ];

    const mockAgents: SupportAgent[] = [
      {
        id: 'admin-1',
        email: 'support1@creatorhub.com',
        username: 'support_agent_1',
        displayName: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        role: 'admin',
        isVerified: true,
        createdAt: new Date(Date.now() - 86400000 * 365),
        updatedAt: new Date(),
        agentStatus: 'available',
        specializations: ['billing', 'payments', 'subscriptions'],
        assignedTickets: 12,
        resolvedTickets: 156,
        averageResolutionTime: 4.2, // hours
        customerSatisfaction: 4.8,
      },
      {
        id: 'admin-2',
        email: 'support2@creatorhub.com',
        username: 'support_agent_2',
        displayName: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'admin',
        isVerified: true,
        createdAt: new Date(Date.now() - 86400000 * 300),
        updatedAt: new Date(),
        agentStatus: 'busy',
        specializations: ['technical', 'content', 'account'],
        assignedTickets: 8,
        resolvedTickets: 234,
        averageResolutionTime: 3.7, // hours
        customerSatisfaction: 4.9,
      },
    ];

    setSupportTickets(mockTickets);
    setSupportAgents(mockAgents);
  };

  const loadSystemData = async () => {
    const mockSystemHealth: SystemHealth = {
      status: 'healthy',
      services: [
        {
          name: 'Web Server',
          status: 'online',
          uptime: 99.9,
          responseTime: 120,
        },
        {
          name: 'Database',
          status: 'online',
          uptime: 99.8,
          responseTime: 45,
        },
        {
          name: 'File Storage',
          status: 'online',
          uptime: 99.7,
          responseTime: 200,
        },
        {
          name: 'Payment Gateway',
          status: 'degraded',
          uptime: 98.5,
          responseTime: 800,
          lastIncident: new Date(Date.now() - 3600000),
        },
        {
          name: 'Email Service',
          status: 'online',
          uptime: 99.9,
          responseTime: 300,
        },
      ],
      metrics: {
        serverLoad: 65,
        memoryUsage: 78,
        diskUsage: 45,
        databaseConnections: 234,
        queueSize: 12,
        errorRate: 0.05,
      },
      alerts: [
        {
          id: 'alert-1',
          type: 'warning',
          title: 'High Payment Gateway Response Time',
          description: 'Payment gateway response time is above threshold (800ms)',
          service: 'Payment Gateway',
          createdAt: new Date(Date.now() - 1800000),
        },
      ],
      lastUpdated: new Date(),
    };

    const mockAuditLogs: AuditLog[] = [
      {
        id: 'audit-1',
        userId: 'admin-1',
        action: 'user.suspend',
        resource: 'user',
        resourceId: 'user-4',
        details: { reason: 'Policy violation' },
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: 'audit-2',
        userId: 'admin-1',
        action: 'content.approve',
        resource: 'content',
        resourceId: 'content-123',
        details: { moderationNotes: 'Content approved after review' },
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 7200000),
      },
    ];

    const mockSecurityIncidents: SecurityIncident[] = [
      {
        id: 'incident-1',
        type: 'login_attempt',
        severity: 'medium',
        description: 'Multiple failed login attempts from same IP',
        affectedUsers: ['user-unknown'],
        ipAddresses: ['192.168.1.999'],
        status: 'resolved',
        detectedAt: new Date(Date.now() - 86400000),
        resolvedAt: new Date(Date.now() - 82800000),
        actions: [
          {
            id: 'action-1',
            type: 'block_ip',
            description: 'Blocked suspicious IP address',
            executedBy: 'system',
            executedAt: new Date(Date.now() - 82800000),
          },
        ],
      },
    ];

    setSystemHealth(mockSystemHealth);
    setAuditLogs(mockAuditLogs);
    setSecurityIncidents(mockSecurityIncidents);
  };

  const loadSettings = async () => {
    const mockSettings: PlatformSettings = {
      general: {
        platformName: 'OnlyFur',
        platformDescription: 'The ultimate platform for creators and their fans',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
      },
      features: {
        userRegistration: true,
        contentModeration: true,
        autoApproval: false,
        subscriptions: true,
        tips: true,
        messaging: true,
        livestreaming: false,
      },
      content: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'],
        requireModeration: true,
        autoDeleteAfter: 0, // Never
        watermark: false,
      },
      payments: {
        stripeEnabled: true,
        paypalEnabled: true,
        platformFee: 10, // 10%
        minimumPayout: 50,
        payoutSchedule: 'weekly',
      },
      security: {
        requireEmailVerification: true,
        require2FA: false,
        sessionTimeout: 24 * 60 * 60, // 24 hours
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: false,
          maxAge: 90, // days
        },
        ipWhitelist: [],
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        webhooks: [],
      },
    };

    setPlatformSettings(mockSettings);
  };

  const loadTags = async () => {
    const mockTags: PlatformTag[] = [
      {
        id: 'tag-1',
        name: 'Photography',
        description: 'Photography related content',
        color: '#3B82F6',
        category: 'Art',
        usageCount: 245,
        isActive: true,
        childTags: ['tag-4', 'tag-5'],
        createdAt: new Date(Date.now() - 86400000 * 30),
        updatedAt: new Date(Date.now() - 86400000 * 5),
        createdBy: 'admin-1',
      },
      {
        id: 'tag-2',
        name: 'Gaming',
        description: 'Gaming and streaming content',
        color: '#10B981',
        category: 'Entertainment',
        usageCount: 189,
        isActive: true,
        childTags: ['tag-6'],
        createdAt: new Date(Date.now() - 86400000 * 25),
        updatedAt: new Date(Date.now() - 86400000 * 3),
        createdBy: 'admin-1',
      },
      {
        id: 'tag-3',
        name: 'Fitness',
        description: 'Health and fitness content',
        color: '#EF4444',
        category: 'Lifestyle',
        usageCount: 156,
        isActive: true,
        childTags: [],
        createdAt: new Date(Date.now() - 86400000 * 20),
        updatedAt: new Date(Date.now() - 86400000 * 1),
        createdBy: 'admin-1',
      },
      {
        id: 'tag-4',
        name: 'Portrait',
        description: 'Portrait photography',
        color: '#8B5CF6',
        category: 'Art',
        usageCount: 98,
        isActive: true,
        parentTagId: 'tag-1',
        childTags: [],
        createdAt: new Date(Date.now() - 86400000 * 15),
        updatedAt: new Date(Date.now() - 86400000 * 2),
        createdBy: 'admin-1',
      },
      {
        id: 'tag-5',
        name: 'Landscape',
        description: 'Landscape photography',
        color: '#059669',
        category: 'Art',
        usageCount: 76,
        isActive: true,
        parentTagId: 'tag-1',
        childTags: [],
        createdAt: new Date(Date.now() - 86400000 * 12),
        updatedAt: new Date(Date.now() - 86400000 * 1),
        createdBy: 'admin-1',
      },
      {
        id: 'tag-6',
        name: 'FPS',
        description: 'First-person shooter games',
        color: '#F59E0B',
        category: 'Entertainment',
        usageCount: 54,
        isActive: true,
        parentTagId: 'tag-2',
        childTags: [],
        createdAt: new Date(Date.now() - 86400000 * 10),
        updatedAt: new Date(Date.now() - 86400000 * 1),
        createdBy: 'admin-1',
      }
    ];

    setTags(mockTags);
  };

  // User Management Methods
  const getUserById = (id: string): AdminUser | null => {
    return users.find(user => user.id === id) || null;
  };

  const updateUserStatus = async (userId: string, status: string): Promise<void> => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: status as any } : user
    ));
    
    // Log audit entry
    const auditEntry: AuditLog = {
      id: `audit-${Date.now()}`,
      userId: user?.id || 'system',
      action: 'user.status_change',
      resource: 'user',
      resourceId: userId,
      details: { newStatus: status },
      ipAddress: '192.168.1.200',
      userAgent: navigator.userAgent,
      timestamp: new Date(),
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  const verifyUser = async (userId: string, approved: boolean, notes?: string): Promise<void> => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            verificationStatus: approved ? 'verified' : 'rejected',
            isVerified: approved,
            moderationNotes: notes,
          } 
        : user
    ));

    setVerificationRequests(prev => prev.map(req =>
      req.userId === userId
        ? {
            ...req,
            status: approved ? 'approved' : 'rejected',
            reviewedAt: new Date(),
            reviewedBy: user?.id,
            notes,
          }
        : req
    ));
  };

  const banUser = async (userId: string, reason: string): Promise<void> => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: 'banned',
            flaggedReasons: [...(user.flaggedReasons || []), reason],
            moderationNotes: `Banned: ${reason}`,
          } 
        : user
    ));
  };

  const getUserAnalytics = async (userId: string): Promise<any> => {
    // Mock analytics for a specific user
    return {
      revenue: Math.floor(Math.random() * 10000),
      subscribers: Math.floor(Math.random() * 1000),
      content: Math.floor(Math.random() * 100),
      engagement: Math.floor(Math.random() * 100),
    };
  };

  // Content Management Methods
  const getContentById = (id: string): AdminContent | null => {
    return [...pendingContent, ...flaggedContent].find(content => content.id === id) || null;
  };

  const moderateContent = async (contentId: string, action: string, notes?: string): Promise<void> => {
    const updateContent = (content: AdminContent) => {
      if (content.id === contentId) {
        return {
          ...content,
          moderationStatus: action as any,
          moderationNotes: notes,
          moderatedBy: user?.id,
          moderatedAt: new Date(),
        };
      }
      return content;
    };

    setPendingContent(prev => prev.map(updateContent));
    setFlaggedContent(prev => prev.map(updateContent));

    // Remove from pending if approved/rejected
    if (action === 'approved' || action === 'rejected') {
      setPendingContent(prev => prev.filter(content => content.id !== contentId));
    }
  };

  const flagContent = async (contentId: string, reason: string): Promise<void> => {
    const content = getContentById(contentId);
    if (content) {
      const updatedContent = {
        ...content,
        moderationStatus: 'flagged' as any,
        flags: [
          ...content.flags,
          {
            id: `flag-${Date.now()}`,
            contentId,
            reason: reason as any,
            flaggedBy: user?.id || 'admin',
            flaggedAt: new Date(),
            severity: 'medium' as any,
            status: 'active' as any,
          },
        ],
      };

      setFlaggedContent(prev => {
        const existing = prev.find(c => c.id === contentId);
        if (existing) {
          return prev.map(c => c.id === contentId ? updatedContent : c);
        } else {
          return [...prev, updatedContent];
        }
      });
    }
  };

  const getContentAnalytics = async (): Promise<any> => {
    return {
      totalContent: pendingContent.length + flaggedContent.length,
      pendingReview: pendingContent.length,
      flaggedContent: flaggedContent.length,
      approvedToday: 45,
      rejectedToday: 3,
    };
  };

  // Payment Management Methods
  const getPaymentById = (id: string): AdminPayment | null => {
    return payments.find(payment => payment.id === id) || null;
  };

  const processRefund = async (paymentId: string, amount: number, reason: string): Promise<void> => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId
        ? {
            ...payment,
            refunds: [
              ...payment.refunds,
              {
                id: `refund-${Date.now()}`,
                paymentId,
                amount,
                reason,
                status: 'pending',
                requestedBy: user?.id || 'admin',
                processedAt: new Date(),
              },
            ],
          }
        : payment
    ));
  };

  const processPayout = async (creatorId: string, amount: number): Promise<void> => {
    const newPayout: CreatorPayout = {
      id: `payout-${Date.now()}`,
      creatorId,
      amount,
      fees: amount * 0.05,
      netAmount: amount * 0.95,
      period: {
        start: new Date(Date.now() - 86400000 * 30),
        end: new Date(),
      },
      status: 'pending',
      paymentMethod: {
        type: 'bank_transfer',
        details: {},
      },
    };

    setPayouts(prev => [newPayout, ...prev]);
  };

  const getFinancialAnalytics = async (): Promise<any> => {
    return {
      totalRevenue: platformAnalytics.overview?.totalRevenue || 0,
      totalPayouts: payouts.reduce((sum, payout) => sum + payout.amount, 0),
      pendingPayouts: payouts.filter(p => p.status === 'pending').length,
      refundRate: 2.5,
    };
  };

  // Analytics Methods
  const refreshAnalytics = async (): Promise<void> => {
    await loadAnalytics();
  };

  const generateReport = async (type: string, filters: any): Promise<any> => {
    // Mock report generation
    return {
      type,
      filters,
      data: 'Mock report data',
      generatedAt: new Date(),
    };
  };

  // Support Methods
  const createTicket = async (ticketData: Partial<SupportTicket>): Promise<SupportTicket> => {
    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      userId: ticketData.userId || '',
      subject: ticketData.subject || '',
      description: ticketData.description || '',
      category: ticketData.category || 'other',
      priority: ticketData.priority || 'medium',
      status: 'open',
      tags: ticketData.tags || [],
      attachments: [],
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicket = async (ticketId: string, updates: Partial<SupportTicket>): Promise<void> => {
    setSupportTickets(prev => prev.map(ticket =>
      ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: new Date() } : ticket
    ));
  };

  const assignTicket = async (ticketId: string, agentId: string): Promise<void> => {
    setSupportTickets(prev => prev.map(ticket =>
      ticket.id === ticketId 
        ? { ...ticket, assignedTo: agentId, status: 'in_progress', updatedAt: new Date() }
        : ticket
    ));
  };

  // System Methods
  const getSystemMetrics = async (): Promise<any> => {
    return systemHealth.metrics;
  };

  const createAlert = async (alertData: Partial<SystemAlert>): Promise<void> => {
    const newAlert: SystemAlert = {
      id: `alert-${Date.now()}`,
      type: alertData.type || 'info',
      title: alertData.title || '',
      description: alertData.description || '',
      service: alertData.service,
      createdAt: new Date(),
    };

    setSystemHealth(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts],
    }));
  };

  // Settings Methods
  const updateSettings = async (settings: Partial<PlatformSettings>): Promise<void> => {
    setPlatformSettings(prev => ({ ...prev, ...settings }));
  };

  // Enhanced Tag Management Methods
  const createTag = async (tag: Partial<PlatformTag>): Promise<void> => {
    const newTag: PlatformTag = {
      id: `tag-${Date.now()}`,
      name: tag.name || '',
      description: tag.description,
      color: tag.color || '#3B82F6',
      category: tag.category || 'General',
      usageCount: 0,
      isActive: true,
      parentTagId: tag.parentTagId,
      childTags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user?.id || 'admin',
    };
    setTags(prev => [...prev, newTag]);
  };

  const updateTag = async (tagId: string, updates: Partial<PlatformTag>): Promise<void> => {
    setTags(prev => prev.map(tag => 
      tag.id === tagId ? { ...tag, ...updates, updatedAt: new Date() } : tag
    ));
  };

  const deleteTag = async (tagId: string): Promise<void> => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const getTagAnalytics = async (tagId?: string): Promise<TagAnalytics> => {
    // Mock analytics data
    const mockAnalytics: TagAnalytics = {
      tagId: tagId || 'all',
      tagName: tagId ? tags.find(t => t.id === tagId)?.name || 'Unknown' : 'All Tags',
      usageCount: 245,
      contentCount: 156,
      popularityTrend: [
        { period: '2024-01', value: 45, date: new Date('2024-01-01') },
        { period: '2024-02', value: 67, date: new Date('2024-02-01') },
        { period: '2024-03', value: 89, date: new Date('2024-03-01') },
        { period: '2024-04', value: 134, date: new Date('2024-04-01') },
        { period: '2024-05', value: 178, date: new Date('2024-05-01') },
        { period: '2024-06', value: 245, date: new Date('2024-06-01') },
      ],
      associatedCreators: 34,
      revenue: 12450.50,
      engagementMetrics: {
        averageLikes: 89,
        averageViews: 1234,
        averageComments: 23,
      },
    };
    return mockAnalytics;
  };

  const bulkTagOperations = async (operation: 'apply' | 'remove', tagIds: string[], contentIds: string[]): Promise<void> => {
    // Mock implementation - in real app, would update content tags
    console.log(`Bulk ${operation} tags:`, { tagIds, contentIds });
  };

  // Enhanced User Management Methods
  const editUser = async (userId: string, updates: Partial<AdminUser>): Promise<void> => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates, updatedAt: new Date() } : user
    ));
  };

  const promoteUser = async (userId: string, role: 'creator' | 'admin'): Promise<void> => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role, updatedAt: new Date() } : user
    ));
  };

  const getUserActivity = async (userId: string): Promise<UserActivity[]> => {
    // Mock user activity data
    const mockActivity: UserActivity[] = [
      {
        id: 'activity-1',
        userId,
        type: 'login',
        description: 'User logged in from desktop',
        timestamp: new Date(Date.now() - 3600000),
        ipAddress: '192.168.1.100',
        device: 'Desktop Chrome',
        location: 'New York, USA',
      },
      {
        id: 'activity-2',
        userId,
        type: 'content_upload',
        description: 'Uploaded new photo',
        timestamp: new Date(Date.now() - 7200000),
        ipAddress: '192.168.1.100',
        device: 'Desktop Chrome',
        location: 'New York, USA',
      },
      {
        id: 'activity-3',
        userId,
        type: 'purchase',
        description: 'Purchased subscription',
        timestamp: new Date(Date.now() - 86400000),
        ipAddress: '192.168.1.100',
        device: 'Mobile Safari',
        location: 'New York, USA',
      },
    ];
    return mockActivity;
  };

  const bulkUserOperations = async (operation: 'activate' | 'suspend' | 'ban', userIds: string[]): Promise<void> => {
    const statusMap = {
      activate: 'active',
      suspend: 'suspended',
      ban: 'banned'
    };
    
    setUsers(prev => prev.map(user => 
      userIds.includes(user.id) ? { ...user, status: statusMap[operation] as any, updatedAt: new Date() } : user
    ));
  };

  // Enhanced Content Moderation Methods
  const deleteContent = async (contentId: string, reason: string): Promise<void> => {
    setPendingContent(prev => prev.filter(content => content.id !== contentId));
    setFlaggedContent(prev => prev.filter(content => content.id !== contentId));
    // Log the deletion
    console.log(`Content ${contentId} deleted. Reason: ${reason}`);
  };

  const bulkContentOperations = async (operation: 'approve' | 'reject' | 'delete', contentIds: string[], reason?: string): Promise<void> => {
    const updateStatus = (content: AdminContent) => {
      if (!contentIds.includes(content.id)) return content;
      
      switch (operation) {
        case 'approve':
          return { ...content, moderationStatus: 'approved' as const, moderatedAt: new Date(), moderatedBy: user?.id };
        case 'reject':
          return { ...content, moderationStatus: 'rejected' as const, moderatedAt: new Date(), moderatedBy: user?.id, moderationNotes: reason };
        case 'delete':
          return null; // Will be filtered out
        default:
          return content;
      }
    };

    if (operation === 'delete') {
      setPendingContent(prev => prev.filter(content => !contentIds.includes(content.id)));
      setFlaggedContent(prev => prev.filter(content => !contentIds.includes(content.id)));
    } else {
      setPendingContent(prev => prev.map(updateStatus).filter(Boolean) as AdminContent[]);
      setFlaggedContent(prev => prev.map(updateStatus).filter(Boolean) as AdminContent[]);
    }
  };

  const searchContent = async (query: string, filters?: ContentSearchFilters): Promise<AdminContent[]> => {
    // Mock search implementation
    const allContent = [...pendingContent, ...flaggedContent];
    return allContent.filter(content => 
      content.title.toLowerCase().includes(query.toLowerCase()) ||
      content.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const editContent = async (contentId: string, updates: Partial<AdminContent>): Promise<void> => {
    const updateContent = (content: AdminContent) => 
      content.id === contentId ? { ...content, ...updates, updatedAt: new Date() } : content;

    setPendingContent(prev => prev.map(updateContent));
    setFlaggedContent(prev => prev.map(updateContent));
  };

  const value: AdminContextType = {
    // User Management
    users,
    verificationRequests,
    getUserById,
    updateUserStatus,
    verifyUser,
    banUser,
    getUserAnalytics,
    
    // Content Management
    pendingContent,
    flaggedContent,
    getContentById,
    moderateContent,
    flagContent,
    getContentAnalytics,
    
    // Payment Management
    payments,
    payouts,
    getPaymentById,
    processRefund,
    processPayout,
    getFinancialAnalytics,
    
    // Analytics
    platformAnalytics,
    refreshAnalytics,
    generateReport,
    
    // Support
    supportTickets,
    supportAgents,
    createTicket,
    updateTicket,
    assignTicket,
    
    // System Monitoring
    systemHealth,
    auditLogs,
    securityIncidents,
    getSystemMetrics,
    createAlert,
    
    // Settings
    platformSettings,
    updateSettings,
    
    // Tag Management
    tags,
    createTag,
    updateTag,
    deleteTag,
    getTagAnalytics,
    bulkTagOperations,
    
    // Enhanced User Management
    editUser,
    promoteUser,
    getUserActivity,
    bulkUserOperations,
    
    // Enhanced Content Moderation
    deleteContent,
    bulkContentOperations,
    searchContent,
    editContent,
    
    // State
    isLoading,
    error,
    selectedUser,
    setSelectedUser,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

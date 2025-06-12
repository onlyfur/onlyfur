interface NeuralSearchVector {
  id: string;
  embedding: number[];
  metadata: {
    type: 'text' | 'image' | 'audio' | 'video';
    content: string;
    category: string;
    tags: string[];
    quality_score: number;
    title?: string;
    description?: string;
    url?: string;
  };
}

interface SearchContext {
  user_preferences: UserPreferences;
  search_history: string[];
  recent_interactions: string[];
  time_context: 'morning' | 'afternoon' | 'evening' | 'night';
  device_context: 'mobile' | 'desktop' | 'tablet';
}

interface UserPreferences {
  preferred_content_types: string[];
  favorite_creators: string[];
  interest_categories: string[];
  content_quality_threshold: number;
  language_preferences: string[];
  accessibility_needs: string[];
}

interface NeuralSearchResult {
  id: string;
  relevance_score: number;
  confidence_score: number;
  explanation: string;
  personalization_factors: string[];
  similar_items: string[];
  recommendation_reason: string;
}

class NeuralSearchEngine {
  private vectors: Map<string, NeuralSearchVector> = new Map();
  private userModel: Map<string, UserPreferences> = new Map();
  private searchHistory: Map<string, string[]> = new Map();
  
  // Neural network weights (simplified for demo)
  private weights = {
    text_similarity: 0.4,
    semantic_match: 0.3,
    user_preference: 0.2,
    temporal_relevance: 0.05,
    quality_score: 0.05
  };

  constructor() {
    this.initializeVectors();
    this.loadUserModels();
  }

  // Initialize vector embeddings for content
  private initializeVectors(): void {
    // Simulated vector embeddings for demo content
    this.vectors.set('creator-1', {
      id: 'creator-1',
      embedding: [0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.8, 0.3],
      metadata: {
        type: 'text',
        content: 'FurryArtist_Pro digital art character design commissions',
        category: 'creator',
        tags: ['digital-art', 'character-design', 'commissions'],
        quality_score: 0.95
      }
    });

    this.vectors.set('content-1', {
      id: 'content-1',
      embedding: [0.7, 0.8, 0.6, 0.9, 0.5, 0.7, 0.4, 0.8],
      metadata: {
        type: 'text',
        content: 'Digital Art Masterclass Character Design Fundamentals tutorial',
        category: 'tutorial',
        tags: ['tutorial', 'character-design', 'digital-art'],
        quality_score: 0.92
      }
    });

    this.vectors.set('content-2', {
      id: 'content-2',
      embedding: [0.6, 0.7, 0.8, 0.5, 0.9, 0.4, 0.7, 0.6],
      metadata: {
        type: 'video',
        content: 'Animation Basics Walk Cycles tutorial beginner',
        category: 'tutorial',
        tags: ['animation', 'tutorial', 'walk-cycle'],
        quality_score: 0.88
      }
    });

    this.vectors.set('content-3', {
      id: 'content-3',
      embedding: [0.9, 0.5, 0.7, 0.8, 0.6, 0.9, 0.3, 0.7],
      metadata: {
        type: 'text',
        content: 'Fursuit Construction Head Building Techniques crafting',
        category: 'tutorial',
        tags: ['fursuit', 'tutorial', 'crafting'],
        quality_score: 0.85
      }
    });

    // Help center articles
    this.vectors.set('help-account-creation', {
      id: 'help-account-creation',
      embedding: [0.85, 0.75, 0.65, 0.55, 0.8, 0.7, 0.6, 0.5],
      metadata: {
        type: 'text',
        content: 'How to create your OnlyFur account registration sign up email verification username password profile',
        category: 'help',
        tags: ['account', 'registration', 'getting-started', 'tutorial'],
        quality_score: 0.95,
        title: 'How to Create Your OnlyFur Account',
        description: 'Step-by-step guide to creating your account and joining the OnlyFur community',
        url: '/help/articles/how-to-create-account'
      }
    });

    this.vectors.set('help-age-verification', {
      id: 'help-age-verification',
      embedding: [0.7, 0.6, 0.65, 0.7, 0.75, 0.7, 0.65, 0.6],
      metadata: {
        type: 'text',
        content: 'Age verification process legal requirements government-issued ID privacy security',
        category: 'help',
        tags: ['age-verification', 'legal', 'privacy', 'security'],
        quality_score: 0.9,
        title: 'Age Verification Process',
        description: 'How to verify your age to access adult content',
        url: '/help/articles/age-verification'
      }
    });

    this.vectors.set('help-content-protection', {
      id: 'help-content-protection',
      embedding: [0.65, 0.7, 0.75, 0.7, 0.65, 0.6, 0.7, 0.75],
      metadata: {
        type: 'text',
        content: 'Content protection watermarking access controls reporting takedown unauthorized use',
        category: 'help',
        tags: ['content-protection', 'watermarking', 'access-control', 'reporting'],
        quality_score: 0.9,
        title: 'Content Protection for Creators',
        description: 'Tools to protect your content from unauthorized use',
        url: '/help/articles/content-protection'
      }
    });

    this.vectors.set('help-bulk-messaging', {
      id: 'help-bulk-messaging',
      embedding: [0.6, 0.65, 0.7, 0.75, 0.7, 0.65, 0.6, 0.7],
      metadata: {
        type: 'text',
        content: 'Bulk messaging messaging dashboard subscriber groups best practices',
        category: 'help',
        tags: ['bulk-messaging', 'messaging', 'subscribers', 'communication'],
        quality_score: 0.88,
        title: 'Bulk Messaging',
        description: 'How to send messages to multiple subscribers efficiently',
        url: '/help/articles/bulk-messaging'
      }
    });

    this.vectors.set('help-tax-information', {
      id: 'help-tax-information',
      embedding: [0.7, 0.75, 0.7, 0.65, 0.6, 0.7, 0.75, 0.7],
      metadata: {
        type: 'text',
        content: 'Tax information reporting income tax forms professional advice digital earnings',
        category: 'help',
        tags: ['tax', 'income', 'reporting', 'forms'],
        quality_score: 0.9,
        title: 'Tax Information for Creators',
        description: 'Important tax considerations for creators',
        url: '/help/articles/tax-information'
      }
    });

    this.vectors.set('help-refund-policy', {
      id: 'help-refund-policy',
      embedding: [0.65, 0.7, 0.75, 0.7, 0.65, 0.6, 0.7, 0.65],
      metadata: {
        type: 'text',
        content: 'Refund policy eligibility request processing time support team',
        category: 'help',
        tags: ['refund', 'policy', 'support', 'requests'],
        quality_score: 0.88,
        title: 'Refund Policy',
        description: 'Guidelines on refunds and how to request them',
        url: '/help/articles/refund-policy'
      }
    });


    this.vectors.set('help-subscription-management', {
      id: 'help-subscription-management',
      embedding: [0.7, 0.85, 0.75, 0.65, 0.6, 0.8, 0.7, 0.5],
      metadata: {
        type: 'text',
        content: 'Managing subscriptions billing payment methods cancel subscription renew subscription tiers pricing',
        category: 'help',
        tags: ['subscription', 'billing', 'payment', 'tutorial'],
        quality_score: 0.92,
        title: 'Subscription Management',
        description: 'Learn how to manage your subscriptions, billing, and payment methods',
        url: '/help/articles/subscription-management'
      }
    });

    this.vectors.set('help-content-privacy', {
      id: 'help-content-privacy',
      embedding: [0.65, 0.75, 0.85, 0.7, 0.6, 0.5, 0.8, 0.7],
      metadata: {
        type: 'text',
        content: 'Content privacy levels public private subscribers only premium content exclusive content',
        category: 'help',
        tags: ['privacy', 'content', 'security', 'tutorial'],
        quality_score: 0.9,
        title: 'Content Privacy Levels',
        description: 'Understanding the different privacy levels for your content',
        url: '/help/articles/content-privacy-levels'
      }
    });

    this.vectors.set('help-messaging-creators', {
      id: 'help-messaging-creators',
      embedding: [0.6, 0.7, 0.8, 0.85, 0.75, 0.65, 0.55, 0.45],
      metadata: {
        type: 'text',
        content: 'Messaging creators direct messages chat communication limits tips etiquette',
        category: 'help',
        tags: ['messaging', 'communication', 'creators', 'tutorial'],
        quality_score: 0.88,
        title: 'Messaging Creators',
        description: 'How to communicate with creators through the platform',
        url: '/help/articles/messaging-creators'
      }
    });

    this.vectors.set('help-creator-earnings', {
      id: 'help-creator-earnings',
      embedding: [0.55, 0.65, 0.75, 0.85, 0.8, 0.7, 0.6, 0.5],
      metadata: {
        type: 'text',
        content: 'Creator earnings revenue payout payment methods subscription income tips donations',
        category: 'help',
        tags: ['earnings', 'revenue', 'creator', 'tutorial'],
        quality_score: 0.91,
        title: 'Creator Earnings',
        description: 'Understanding how creators earn money and receive payments',
        url: '/help/articles/creator-earnings'
      }
    });

    this.vectors.set('help-account-security', {
      id: 'help-account-security',
      embedding: [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
      metadata: {
        type: 'text',
        content: 'Account security password two-factor authentication 2FA email verification secure login',
        category: 'help',
        tags: ['security', 'account', 'privacy', 'tutorial'],
        quality_score: 0.94,
        title: 'Account Security',
        description: 'Best practices for keeping your OnlyFur account secure',
        url: '/help/articles/account-security'
      }
    });

    this.vectors.set('help-mobile-app', {
      id: 'help-mobile-app',
      embedding: [0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6],
      metadata: {
        type: 'text',
        content: 'Mobile app iOS Android smartphone tablet features notifications settings',
        category: 'help',
        tags: ['mobile', 'app', 'ios', 'android', 'tutorial'],
        quality_score: 0.89,
        title: 'Mobile App',
        description: 'Guide to using the OnlyFur mobile application',
        url: '/help/articles/mobile-app'
      }
    });

    this.vectors.set('help-upload-content', {
      id: 'help-upload-content',
      embedding: [0.75, 0.65, 0.55, 0.45, 0.85, 0.75, 0.65, 0.55],
      metadata: {
        type: 'text',
        content: 'Upload organize content photos videos text posts scheduling folders tags',
        category: 'help',
        tags: ['upload', 'content', 'creator', 'tutorial'],
        quality_score: 0.93,
        title: 'Upload & Organize Content',
        description: 'How to upload and organize your content as a creator',
        url: '/help/articles/upload-organize-content'
      }
    });
    
    // Additional help articles
    this.vectors.set('help-finding-creators', {
      id: 'help-finding-creators',
      embedding: [0.7, 0.6, 0.8, 0.7, 0.5, 0.6, 0.9, 0.8],
      metadata: {
        type: 'text',
        content: 'Finding creators search discover follow recommendations browse categories tags interests',
        category: 'help',
        tags: ['search', 'discover', 'creators', 'tutorial'],
        quality_score: 0.91,
        title: 'Finding Creators',
        description: 'How to discover and follow creators on OnlyFur',
        url: '/help/articles/finding-creators'
      }
    });
    
    this.vectors.set('help-first-subscription', {
      id: 'help-first-subscription',
      embedding: [0.65, 0.75, 0.85, 0.6, 0.7, 0.8, 0.5, 0.6],
      metadata: {
        type: 'text',
        content: 'First subscription what to expect payment process content access tiers benefits',
        category: 'help',
        tags: ['subscription', 'payment', 'beginner', 'tutorial'],
        quality_score: 0.9,
        title: 'Your First Subscription',
        description: 'What to expect when subscribing to a creator for the first time',
        url: '/help/articles/first-subscription'
      }
    });
    
    this.vectors.set('help-subscription-tiers', {
      id: 'help-subscription-tiers',
      embedding: [0.7, 0.8, 0.9, 0.7, 0.6, 0.5, 0.8, 0.7],
      metadata: {
        type: 'text',
        content: 'Subscription tiers pricing levels benefits features comparison basic premium vip',
        category: 'help',
        tags: ['subscription', 'tiers', 'pricing', 'tutorial'],
        quality_score: 0.92,
        title: 'Subscription Tiers Overview',
        description: 'Understanding the different subscription levels and their benefits',
        url: '/help/articles/subscription-tiers-overview'
      }
    });
    
    this.vectors.set('help-payment-methods', {
      id: 'help-payment-methods',
      embedding: [0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5],
      metadata: {
        type: 'text',
        content: 'Payment methods credit card paypal bank transfer billing information update payment',
        category: 'help',
        tags: ['payment', 'billing', 'financial', 'tutorial'],
        quality_score: 0.9,
        title: 'Payment Methods',
        description: 'Managing your payment methods and billing information',
        url: '/help/articles/payment-methods'
      }
    });
    
    this.vectors.set('help-payment-system', {
      id: 'help-payment-system',
      embedding: [0.65, 0.75, 0.85, 0.9, 0.8, 0.7, 0.6, 0.5],
      metadata: {
        type: 'text',
        content: 'Payment system how payments work processing fees security encryption billing cycle',
        category: 'help',
        tags: ['payment', 'system', 'security', 'tutorial'],
        quality_score: 0.93,
        title: 'How Payments Work',
        description: 'Understanding the OnlyFur payment system and security',
        url: '/help/articles/payment-system'
      }
    });
    
    this.vectors.set('help-message-limits', {
      id: 'help-message-limits',
      embedding: [0.55, 0.65, 0.75, 0.7, 0.8, 0.9, 0.7, 0.6],
      metadata: {
        type: 'text',
        content: 'Message limits subscription tier messaging restrictions frequency length attachments',
        category: 'help',
        tags: ['messaging', 'limits', 'communication', 'tutorial'],
        quality_score: 0.88,
        title: 'Message Limits',
        description: 'Understanding messaging restrictions by subscription tier',
        url: '/help/articles/message-limits'
      }
    });
    
    this.vectors.set('help-messaging-tips', {
      id: 'help-messaging-tips',
      embedding: [0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6],
      metadata: {
        type: 'text',
        content: 'Messaging tips sending tips through messages tipping creators appreciation donations',
        category: 'help',
        tags: ['messaging', 'tips', 'payment', 'tutorial'],
        quality_score: 0.89,
        title: 'Messaging Tips',
        description: 'How to send tips to creators through messages',
        url: '/help/articles/messaging-tips'
      }
    });
    
    this.vectors.set('help-report-user-content', {
      id: 'help-report-user-content',
      embedding: [0.8, 0.7, 0.6, 0.5, 0.9, 0.8, 0.7, 0.6],
      metadata: {
        type: 'text',
        content: 'Report user content inappropriate behavior violation community guidelines moderation',
        category: 'help',
        tags: ['report', 'safety', 'moderation', 'tutorial'],
        quality_score: 0.92,
        title: 'Report User Content',
        description: 'How to report inappropriate content or behavior',
        url: '/help/articles/report-user-content'
      }
    });
    
    this.vectors.set('help-community-guidelines', {
      id: 'help-community-guidelines',
      embedding: [0.85, 0.75, 0.65, 0.55, 0.9, 0.8, 0.7, 0.6],
      metadata: {
        type: 'text',
        content: 'Community guidelines rules standards behavior content moderation safety respect',
        category: 'help',
        tags: ['guidelines', 'rules', 'community', 'tutorial'],
        quality_score: 0.95,
        title: 'Community Guidelines',
        description: 'Understanding our community standards and rules',
        url: '/help/articles/community-guidelines'
      }
    });
    
    this.vectors.set('help-pricing-strategies', {
      id: 'help-pricing-strategies',
      embedding: [0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4],
      metadata: {
        type: 'text',
        content: 'Pricing strategies subscription tiers pricing models revenue optimization creator income',
        category: 'help',
        tags: ['pricing', 'strategy', 'creator', 'tutorial'],
        quality_score: 0.9,
        title: 'Pricing Strategies',
        description: 'Tips for setting subscription and tip prices as a creator',
        url: '/help/articles/pricing-strategies'
      }
    });
    
    this.vectors.set('help-scheduling-features', {
      id: 'help-scheduling-features',
      embedding: [0.65, 0.75, 0.85, 0.75, 0.65, 0.55, 0.7, 0.8],
      metadata: {
        type: 'text',
        content: 'Scheduling features content calendar planned posts automatic publishing timed release',
        category: 'help',
        tags: ['scheduling', 'content', 'creator', 'tutorial'],
        quality_score: 0.89,
        title: 'Scheduling Features',
        description: 'How to schedule and plan your content releases',
        url: '/help/articles/scheduling-features'
      }
    });
    
    this.vectors.set('help-understanding-analytics', {
      id: 'help-understanding-analytics',
      embedding: [0.6, 0.7, 0.8, 0.7, 0.6, 0.5, 0.9, 0.8],
      metadata: {
        type: 'text',
        content: 'Understanding analytics metrics statistics insights performance tracking growth data',
        category: 'help',
        tags: ['analytics', 'metrics', 'creator', 'tutorial'],
        quality_score: 0.91,
        title: 'Understanding Analytics',
        description: 'How to interpret and use creator analytics',
        url: '/help/articles/understanding-analytics'
      }
    });
    
    this.vectors.set('help-custom-commissions', {
      id: 'help-custom-commissions',
      embedding: [0.55, 0.65, 0.75, 0.85, 0.75, 0.65, 0.55, 0.45],
      metadata: {
        type: 'text',
        content: 'Custom commissions personalized content requests pricing negotiation delivery process',
        category: 'help',
        tags: ['commissions', 'custom', 'creator', 'tutorial'],
        quality_score: 0.88,
        title: 'Custom Commissions',
        description: 'How to offer and manage personalized content requests',
        url: '/help/articles/custom-commissions'
      }
    });
    
    this.vectors.set('help-setting-up-creator-profile', {
      id: 'help-setting-up-creator-profile',
      embedding: [0.8, 0.7, 0.6, 0.5, 0.7, 0.8, 0.9, 0.7],
      metadata: {
        type: 'text',
        content: 'Setting up creator profile bio description images banner profile picture tags categories',
        category: 'help',
        tags: ['profile', 'setup', 'creator', 'tutorial'],
        quality_score: 0.92,
        title: 'Setting Up Creator Profile',
        description: 'Complete guide to creating an attractive creator profile',
        url: '/help/articles/setting-up-creator-profile'
      }
    });
    
    this.vectors.set('help-supported-formats', {
      id: 'help-supported-formats',
      embedding: [0.7, 0.6, 0.5, 0.4, 0.8, 0.9, 0.7, 0.6],
      metadata: {
        type: 'text',
        content: 'Supported file formats sizes image video audio text limitations restrictions upload',
        category: 'help',
        tags: ['formats', 'technical', 'upload', 'tutorial'],
        quality_score: 0.9,
        title: 'Supported Formats',
        description: 'File formats and sizes supported on OnlyFur',
        url: '/help/articles/supported-formats'
      }
    });
    
    this.vectors.set('help-upload-troubleshooting', {
      id: 'help-upload-troubleshooting',
      embedding: [0.65, 0.55, 0.45, 0.35, 0.75, 0.85, 0.95, 0.75],
      metadata: {
        type: 'text',
        content: 'Upload troubleshooting problems errors failed uploads solutions fixes common issues',
        category: 'help',
        tags: ['troubleshooting', 'upload', 'technical', 'tutorial'],
        quality_score: 0.88,
        title: 'Upload Troubleshooting',
        description: 'Solutions for common upload problems',
        url: '/help/articles/upload-troubleshooting'
      }
    });
    
    this.vectors.set('help-video-quality', {
      id: 'help-video-quality',
      embedding: [0.6, 0.5, 0.4, 0.3, 0.7, 0.8, 0.9, 0.8],
      metadata: {
        type: 'text',
        content: 'Video quality streaming resolution bitrate encoding compression optimization playback',
        category: 'help',
        tags: ['video', 'quality', 'technical', 'tutorial'],
        quality_score: 0.89,
        title: 'Video Quality',
        description: 'Optimizing video content for the platform',
        url: '/help/articles/video-quality'
      }
    });
    
    this.vectors.set('help-browser-compatibility', {
      id: 'help-browser-compatibility',
      embedding: [0.55, 0.45, 0.35, 0.25, 0.65, 0.75, 0.85, 0.95],
      metadata: {
        type: 'text',
        content: 'Browser compatibility supported browsers chrome firefox safari edge requirements',
        category: 'help',
        tags: ['browser', 'compatibility', 'technical', 'tutorial'],
        quality_score: 0.87,
        title: 'Browser Compatibility',
        description: 'Supported browsers and technical requirements',
        url: '/help/articles/browser-compatibility'
      }
    });
  }

  // Load user preference models
  private loadUserModels(): void {
    // Load from localStorage or default preferences
    const savedPreferences = localStorage.getItem('neural_search_user_model');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        this.userModel.set('current_user', parsed);
      } catch {
        this.setDefaultUserModel();
      }
    } else {
      this.setDefaultUserModel();
    }
  }

  private setDefaultUserModel(): void {
    this.userModel.set('current_user', {
      preferred_content_types: ['tutorial', 'art'],
      favorite_creators: [],
      interest_categories: ['digital-art', 'character-design'],
      content_quality_threshold: 0.8,
      language_preferences: ['en'],
      accessibility_needs: []
    });
  }

  // Convert query to vector embedding (simplified)
  private queryToVector(query: string): number[] {
    const words = query.toLowerCase().split(' ');
    const baseVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    
    // Track if we have category/type specific search
    let hasTypeSpecifier = false;
    let typeVector: number[] | null = null;
    
    // Simple keyword-based vector generation
    const keywords: { [key: string]: number[] } = {
      // Content keywords
      'art': [0.9, 0.7, 0.6, 0.4, 0.5, 0.3, 0.8, 0.2],
      'digital': [0.8, 0.8, 0.5, 0.6, 0.4, 0.7, 0.3, 0.9],
      'animation': [0.6, 0.9, 0.8, 0.7, 0.5, 0.4, 0.6, 0.8],
      'tutorial': [0.7, 0.6, 0.9, 0.8, 0.7, 0.5, 0.4, 0.6],
      'character': [0.8, 0.7, 0.6, 0.9, 0.8, 0.6, 0.5, 0.4],
      'fursuit': [0.5, 0.4, 0.6, 0.7, 0.9, 0.8, 0.7, 0.6],
      
      // Category/type keywords
      'help': [0.85, 0.75, 0.65, 0.55, 0.8, 0.7, 0.6, 0.5],
      'article': [0.8, 0.75, 0.7, 0.65, 0.75, 0.7, 0.65, 0.6],
      'creator': [0.7, 0.6, 0.5, 0.4, 0.9, 0.8, 0.7, 0.6],
      'content': [0.6, 0.7, 0.8, 0.9, 0.5, 0.6, 0.7, 0.8],
      'tag': [0.5, 0.6, 0.7, 0.8, 0.4, 0.5, 0.6, 0.7],
      
      // Help article specific keywords
      'account': [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
      'security': [0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5],
      'subscription': [0.7, 0.85, 0.75, 0.65, 0.6, 0.8, 0.7, 0.5],
      'payment': [0.65, 0.7, 0.75, 0.8, 0.85, 0.7, 0.65, 0.6],
      'privacy': [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.7, 0.65],
      'messaging': [0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.7],
      'upload': [0.75, 0.65, 0.55, 0.45, 0.85, 0.75, 0.65, 0.55],
      'mobile': [0.5, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6]
    };

    // Check for type-specific searches
    const typeKeywords = ['help', 'article', 'creator', 'content', 'tag'];
    const typeMatches = words.filter(word => typeKeywords.includes(word));
    
    // Special handling for compound terms
    if (query.includes('help article') || query.includes('help center')) {
      hasTypeSpecifier = true;
      typeVector = [0.85, 0.75, 0.65, 0.55, 0.8, 0.7, 0.6, 0.5]; // Help article vector
    } else if (typeMatches.length > 0) {
      hasTypeSpecifier = true;
      // Create a combined vector for all matched type keywords
      typeVector = new Array(8).fill(0.5);
      typeMatches.forEach(match => {
        const matchVector = keywords[match];
        if (matchVector) {
          matchVector.forEach((val: number, idx: number) => {
            typeVector![idx] = (typeVector![idx] + val) / 2;
          });
        }
      });
    }

    // Apply regular keyword matching
    words.forEach(word => {
      if (keywords[word]) {
        keywords[word].forEach((val: number, idx: number) => {
          baseVector[idx] = (baseVector[idx] + val) / 2;
        });
      }
    });

    // If we have a type specifier, blend it with the base vector
    if (hasTypeSpecifier && typeVector) {
      return baseVector.map((val, idx) => (val * 0.4) + (typeVector![idx] * 0.6));
    }

    return baseVector;
  }

  // Calculate cosine similarity between vectors
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, a, idx) => sum + a * vec2[idx], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, a) => sum + a * a, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  // Calculate semantic similarity (enhanced)
  private calculateSemanticSimilarity(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(' ');
    const contentWords = content.toLowerCase().split(' ');
    
    // Semantic word groups
    const semanticGroups = {
      art: ['art', 'drawing', 'painting', 'illustration', 'design', 'creative'],
      tutorial: ['tutorial', 'guide', 'lesson', 'walkthrough', 'howto', 'learn'],
      animation: ['animation', 'animated', 'motion', 'movement', 'sequence'],
      character: ['character', 'persona', 'avatar', 'figure', 'being'],
      digital: ['digital', 'electronic', 'computer', 'software', 'tech']
    };

    let matches = 0;
    let total = 0;

    queryWords.forEach(qWord => {
      contentWords.forEach(cWord => {
        total++;
        if (qWord === cWord) {
          matches += 1;
        } else {
          // Check semantic similarity
          for (const [group, words] of Object.entries(semanticGroups)) {
            if (words.includes(qWord) && words.includes(cWord)) {
              matches += 0.7; // Partial match for semantically related words
              break;
            }
          }
        }
      });
    });

    return total > 0 ? matches / total : 0;
  }

  // Calculate user preference alignment
  private calculateUserAlignment(vector: NeuralSearchVector, context: SearchContext): number {
    const preferences = context.user_preferences;
    let score = 0;
    let factors = 0;

    // Content type preference
    if (preferences.preferred_content_types.includes(vector.metadata.category)) {
      score += 0.3;
    }
    factors += 0.3;

    // Tag alignment
    const tagMatches = vector.metadata.tags.filter(tag => 
      preferences.interest_categories.includes(tag)
    ).length;
    score += (tagMatches / Math.max(vector.metadata.tags.length, 1)) * 0.4;
    factors += 0.4;

    // Quality threshold
    if (vector.metadata.quality_score >= preferences.content_quality_threshold) {
      score += 0.3;
    }
    factors += 0.3;

    return factors > 0 ? score / factors : 0;
  }

  // Calculate temporal relevance
  private calculateTemporalRelevance(context: SearchContext): number {
    // Boost certain content types based on time of day
    const timeBoosts = {
      morning: { tutorial: 0.3, educational: 0.2 },
      afternoon: { art: 0.2, creative: 0.3 },
      evening: { entertainment: 0.3, casual: 0.2 },
      night: { relaxing: 0.3, ambient: 0.2 }
    };

    return timeBoosts[context.time_context] ? 0.1 : 0;
  }

  // Neural search with personalization
  async neuralSearch(
    query: string, 
    context: SearchContext, 
    options: { limit?: number; threshold?: number; categoryFilter?: string } = {}
  ): Promise<NeuralSearchResult[]> {
    const { limit = 10, threshold = 0.1, categoryFilter } = options;
    
    const queryVector = this.queryToVector(query);
    const results: NeuralSearchResult[] = [];
    
    // Check for category/type specific searches in the query
    const queryLower = query.toLowerCase();
    const typeKeywords = {
      'help': ['help', 'article', 'help article', 'help center'],
      'creator': ['creator', 'artist', 'author'],
      'content': ['content', 'post', 'artwork'],
      'tag': ['tag', 'hashtag', 'topic']
    };
    
    // Determine if query has type specifiers
    let detectedTypes: string[] = [];
    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        detectedTypes.push(type);
      }
    }

    // Process each vector
    for (const [id, vector] of this.vectors) {
      // Skip if category filter is applied and doesn't match
      if (categoryFilter && vector.metadata.category !== categoryFilter) {
        continue;
      }
      
      // Apply type-based filtering from query
      if (detectedTypes.length > 0) {
        const matchesType = detectedTypes.some(type => {
          if (type === 'help' && vector.metadata.category === 'help') return true;
          if (type === 'creator' && vector.metadata.category === 'creator') return true;
          if (type === 'content' && ['tutorial', 'art', 'post'].includes(vector.metadata.category)) return true;
          if (type === 'tag' && vector.metadata.tags.length > 0) return true;
          return false;
        });
        
        // Skip if no type match (unless it's a very high semantic match)
        if (!matchesType) {
          const semanticSimilarity = this.calculateSemanticSimilarity(query, vector.metadata.content);
          if (semanticSimilarity < 0.8) {
            continue;
          }
        }
      }
      
      // Vector similarity
      const vectorSimilarity = this.cosineSimilarity(queryVector, vector.embedding);
      
      // Semantic similarity
      const semanticSimilarity = this.calculateSemanticSimilarity(query, vector.metadata.content);
      
      // User alignment
      const userAlignment = this.calculateUserAlignment(vector, context);
      
      // Temporal relevance
      const temporalRelevance = this.calculateTemporalRelevance(context);
      
      // Quality score
      const qualityScore = vector.metadata.quality_score;
      
      // Type match bonus (if query specifies a type)
      let typeMatchBonus = 0;
      if (detectedTypes.length > 0) {
        if ((detectedTypes.includes('help') && vector.metadata.category === 'help') ||
            (detectedTypes.includes('creator') && vector.metadata.category === 'creator') ||
            (detectedTypes.includes('content') && ['tutorial', 'art', 'post'].includes(vector.metadata.category)) ||
            (detectedTypes.includes('tag') && vector.metadata.tags.length > 0)) {
          typeMatchBonus = 0.2; // 20% boost for matching the requested type
        }
      }

      // Calculate final relevance score
      const relevanceScore = 
        (vectorSimilarity * this.weights.text_similarity) +
        (semanticSimilarity * this.weights.semantic_match) +
        (userAlignment * this.weights.user_preference) +
        (temporalRelevance * this.weights.temporal_relevance) +
        (qualityScore * this.weights.quality_score) +
        typeMatchBonus;

      // Calculate confidence based on score distribution
      const confidence = Math.min(1, relevanceScore * 1.2);

      if (relevanceScore >= threshold) {
        // Generate explanation
        const isTypeMatch = detectedTypes.length > 0 && (
          (detectedTypes.includes('help') && vector.metadata.category === 'help') ||
          (detectedTypes.includes('creator') && vector.metadata.category === 'creator') ||
          (detectedTypes.includes('content') && ['tutorial', 'art', 'post'].includes(vector.metadata.category)) ||
          (detectedTypes.includes('tag') && vector.metadata.tags.length > 0)
        );
        
        const explanation = this.generateExplanation(
          vectorSimilarity, semanticSimilarity, userAlignment, qualityScore, 
          isTypeMatch, vector.metadata.category
        );

        // Generate personalization factors
        const personalizationFactors = this.getPersonalizationFactors(
          vector, context, userAlignment
        );

        // Find similar items
        const similarItems = this.findSimilarItems(vector, 3);

        // Generate recommendation reason
        const recommendationReason = this.generateRecommendationReason(
          vector, context, relevanceScore
        );

        results.push({
          id,
          relevance_score: relevanceScore,
          confidence_score: confidence,
          explanation,
          personalization_factors: personalizationFactors,
          similar_items: similarItems,
          recommendation_reason: recommendationReason
        });
      }
    }

    // Sort by relevance score and limit results
    return results
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, limit);
  }

  // Generate human-readable explanation
  private generateExplanation(
    vectorSim: number, 
    semanticSim: number, 
    userAlign: number, 
    quality: number,
    typeMatch?: boolean,
    category?: string
  ): string {
    const factors = [];
    
    if (vectorSim > 0.7) factors.push('strong keyword match');
    if (semanticSim > 0.6) factors.push('semantic relevance');
    if (userAlign > 0.5) factors.push('matches your interests');
    if (quality > 0.8) factors.push('high-quality content');
    
    // Add category-specific explanations
    if (typeMatch) {
      if (category === 'help') {
        factors.push('help article match');
      } else if (category === 'creator') {
        factors.push('creator profile match');
      } else if (['tutorial', 'art', 'post'].includes(category)) {
        factors.push('content match');
      }
    }

    if (factors.length === 0) {
      return 'Basic relevance match';
    }

    return `Recommended due to: ${factors.join(', ')}`;
  }

  // Get personalization factors
  private getPersonalizationFactors(
    vector: NeuralSearchVector, 
    context: SearchContext, 
    alignment: number
  ): string[] {
    const factors = [];
    
    if (context.user_preferences.preferred_content_types.includes(vector.metadata.category)) {
      factors.push(`Matches your preferred ${vector.metadata.category} content`);
    }
    
    const tagMatches = vector.metadata.tags.filter(tag => 
      context.user_preferences.interest_categories.includes(tag)
    );
    
    if (tagMatches.length > 0) {
      factors.push(`Related to your interests: ${tagMatches.join(', ')}`);
    }
    
    if (vector.metadata.quality_score > context.user_preferences.content_quality_threshold) {
      factors.push('Meets your quality standards');
    }
    
    if (context.device_context === 'mobile' && vector.metadata.type === 'video') {
      factors.push('Optimized for mobile viewing');
    }

    return factors;
  }

  // Find similar items
  private findSimilarItems(targetVector: NeuralSearchVector, limit: number): string[] {
    const similarities = [];
    
    for (const [id, vector] of this.vectors) {
      if (id !== targetVector.id) {
        const similarity = this.cosineSimilarity(targetVector.embedding, vector.embedding);
        similarities.push({ id, similarity });
      }
    }
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.id);
  }

  // Generate recommendation reason
  private generateRecommendationReason(
    vector: NeuralSearchVector, 
    context: SearchContext, 
    score: number
  ): string {
    if (score > 0.8) {
      return 'Highly recommended based on your preferences and search intent';
    } else if (score > 0.6) {
      return 'Good match for your interests with relevant content';
    } else if (score > 0.4) {
      return 'May be of interest based on related topics';
    } else {
      return 'General relevance to your search query';
    }
  }

  // Get vector by ID (public method for external use)
  getVectorById(id: string): NeuralSearchVector | undefined {
    return this.vectors.get(id);
  }

  // Update user model based on interactions
  updateUserModel(interactions: {
    clicked_items: string[];
    liked_items: string[];
    search_queries: string[];
    time_spent: Map<string, number>;
  }): void {
    const currentModel = this.userModel.get('current_user');
    if (!currentModel) return;

    // Update interest categories based on clicked items
    interactions.clicked_items.forEach(itemId => {
      const vector = this.vectors.get(itemId);
      if (vector) {
        vector.metadata.tags.forEach(tag => {
          if (!currentModel.interest_categories.includes(tag)) {
            currentModel.interest_categories.push(tag);
          }
        });
      }
    });

    // Update preferred content types
    interactions.liked_items.forEach(itemId => {
      const vector = this.vectors.get(itemId);
      if (vector) {
        const category = vector.metadata.category;
        if (!currentModel.preferred_content_types.includes(category)) {
          currentModel.preferred_content_types.push(category);
        }
      }
    });

    // Save updated model
    this.userModel.set('current_user', currentModel);
    localStorage.setItem('neural_search_user_model', JSON.stringify(currentModel));
  }

  // Get current user model
  getUserModel(): UserPreferences {
    return this.userModel.get('current_user') || this.getDefaultUserModel();
  }

  private getDefaultUserModel(): UserPreferences {
    return {
      preferred_content_types: ['tutorial', 'art'],
      favorite_creators: [],
      interest_categories: ['digital-art'],
      content_quality_threshold: 0.7,
      language_preferences: ['en'],
      accessibility_needs: []
    };
  }

  // Reset user model
  resetUserModel(): void {
    this.setDefaultUserModel();
    localStorage.removeItem('neural_search_user_model');
  }

  // Get search context
  getSearchContext(): SearchContext {
    const hour = new Date().getHours();
    let timeContext: 'morning' | 'afternoon' | 'evening' | 'night';
    
    if (hour >= 5 && hour < 12) timeContext = 'morning';
    else if (hour >= 12 && hour < 17) timeContext = 'afternoon';
    else if (hour >= 17 && hour < 22) timeContext = 'evening';
    else timeContext = 'night';

    const deviceContext = this.detectDeviceContext();
    const searchHistory = this.getSearchHistory();
    
    return {
      user_preferences: this.getUserModel(),
      search_history: searchHistory,
      recent_interactions: this.getRecentInteractions(),
      time_context: timeContext,
      device_context: deviceContext
    };
  }

  private detectDeviceContext(): 'mobile' | 'desktop' | 'tablet' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getSearchHistory(): string[] {
    const history = localStorage.getItem('onlyfur_recent_searches') || '[]';
    return JSON.parse(history);
  }

  private getRecentInteractions(): string[] {
    const interactions = localStorage.getItem('neural_search_interactions');
    return interactions ? JSON.parse(interactions) : [];
  }

  // Add training data for continuous learning
  addTrainingData(query: string, selectedResult: string, rating: number): void {
    const trainingData = {
      query,
      result: selectedResult,
      rating,
      timestamp: Date.now(),
      context: this.getSearchContext()
    };

    const existingData = localStorage.getItem('neural_search_training');
    const trainingSet = existingData ? JSON.parse(existingData) : [];
    trainingSet.push(trainingData);

    // Keep only recent training data (last 1000 entries)
    if (trainingSet.length > 1000) {
      trainingSet.splice(0, trainingSet.length - 1000);
    }

    localStorage.setItem('neural_search_training', JSON.stringify(trainingSet));
  }

  // Get model performance metrics
  getModelMetrics(): {
    total_searches: number;
    avg_relevance_score: number;
    user_satisfaction: number;
    personalization_effectiveness: number;
  } {
    const trainingData = localStorage.getItem('neural_search_training');
    const data = trainingData ? JSON.parse(trainingData) : [];

    if (data.length === 0) {
      return {
        total_searches: 0,
        avg_relevance_score: 0,
        user_satisfaction: 0,
        personalization_effectiveness: 0
      };
    }

    const totalSearches = data.length;
    const avgRating = data.reduce((sum: number, item: any) => sum + item.rating, 0) / totalSearches;
    const avgRelevance = data.reduce((sum: number, item: any) => sum + (item.relevance_score || 0.5), 0) / totalSearches;
    
    // Calculate personalization effectiveness based on improvement over time
    const recentData = data.slice(-100); // Last 100 searches
    const oldData = data.slice(0, 100); // First 100 searches
    
    const recentAvg = recentData.length > 0 ? 
      recentData.reduce((sum: number, item: any) => sum + item.rating, 0) / recentData.length : 0;
    const oldAvg = oldData.length > 0 ? 
      oldData.reduce((sum: number, item: any) => sum + item.rating, 0) / oldData.length : 0;
    
    const personalizationEffectiveness = recentAvg > oldAvg ? 
      Math.min(1, (recentAvg - oldAvg) + 0.5) : 0.5;

    return {
      total_searches: totalSearches,
      avg_relevance_score: avgRelevance,
      user_satisfaction: avgRating / 5, // Normalize to 0-1
      personalization_effectiveness: personalizationEffectiveness
    };


  }
}

export const neuralSearchEngine = new NeuralSearchEngine();
export type { NeuralSearchResult, SearchContext, UserPreferences };

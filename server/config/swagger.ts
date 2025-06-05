import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OnlyFur Platform API',
      version: '1.0.0',
      description: 'API documentation for OnlyFur - Premium furry content platform',
      contact: {
        name: 'OnlyFur Platform',
        email: 'api@onlyfur.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.onlyfur.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            username: {
              type: 'string',
              description: 'Unique username',
            },
            displayName: {
              type: 'string',
              description: 'Display name',
            },
            avatar: {
              type: 'string',
              format: 'uri',
              description: 'Avatar image URL',
            },
            role: {
              type: 'string',
              enum: ['CREATOR', 'SUBSCRIBER', 'ADMIN'],
              description: 'User role',
            },
            isVerified: {
              type: 'boolean',
              description: 'Email verification status',
            },
            subscriptionTier: {
              type: 'string',
              description: 'Current subscription tier',
            },
            subscriptionStatus: {
              type: 'string',
              enum: ['FREE', 'ACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID', 'TRIALING', 'PAUSED', 'EXPIRED'],
              description: 'Subscription status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date',
            },
          },
        },
        SubscriptionTier: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Tier identifier',
            },
            name: {
              type: 'string',
              description: 'Tier name',
            },
            type: {
              type: 'string',
              enum: ['SUBSCRIBER', 'CREATOR'],
              description: 'Tier type',
            },
            level: {
              type: 'string',
              enum: ['BASIC', 'PRO', 'PREMIUM', 'VIP'],
              description: 'Tier level',
            },
            price: {
              type: 'number',
              description: 'Monthly price',
            },
            currency: {
              type: 'string',
              description: 'Currency code',
            },
            description: {
              type: 'string',
              description: 'Tier description',
            },
            features: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of features',
            },
            isPopular: {
              type: 'boolean',
              description: 'Popular tier flag',
            },
            color: {
              type: 'string',
              description: 'Theme color',
            },
          },
        },
        Content: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Content identifier',
            },
            title: {
              type: 'string',
              description: 'Content title',
            },
            description: {
              type: 'string',
              description: 'Content description',
            },
            type: {
              type: 'string',
              enum: ['PHOTO', 'VIDEO', 'TEXT', 'LIVESTREAM'],
              description: 'Content type',
            },
            mediaUrl: {
              type: 'string',
              format: 'uri',
              description: 'Media file URL',
            },
            thumbnailUrl: {
              type: 'string',
              format: 'uri',
              description: 'Thumbnail image URL',
            },
            isPublic: {
              type: 'boolean',
              description: 'Public visibility',
            },
            requiresSubscription: {
              type: 'boolean',
              description: 'Subscription requirement',
            },
            privacyLevel: {
              type: 'string',
              enum: ['PUBLIC', 'SUBSCRIBERS', 'PREMIUM', 'PRIVATE'],
              description: 'Privacy level',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED'],
              description: 'Content status',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Content tags',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date',
            },
          },
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Message identifier',
            },
            conversationId: {
              type: 'string',
              description: 'Conversation identifier',
            },
            senderId: {
              type: 'string',
              description: 'Sender user ID',
            },
            recipientId: {
              type: 'string',
              description: 'Recipient user ID',
            },
            content: {
              type: 'string',
              description: 'Message content',
            },
            messageType: {
              type: 'string',
              enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO'],
              description: 'Message type',
            },
            isRead: {
              type: 'boolean',
              description: 'Read status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Message timestamp',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Transaction identifier',
            },
            amount: {
              type: 'number',
              description: 'Transaction amount',
            },
            currency: {
              type: 'string',
              description: 'Currency code',
            },
            type: {
              type: 'string',
              enum: ['SUBSCRIPTION', 'TIP', 'ONE_TIME', 'REFUND', 'PAYOUT'],
              description: 'Transaction type',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED'],
              description: 'Transaction status',
            },
            description: {
              type: 'string',
              description: 'Transaction description',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction date',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Subscriptions',
        description: 'Subscription tier management',
      },
      {
        name: 'Content',
        description: 'Content creation and management',
      },
      {
        name: 'Messaging',
        description: 'Real-time messaging system',
      },
      {
        name: 'Payments',
        description: 'Payment processing and billing',
      },
      {
        name: 'Admin',
        description: 'Administrative operations',
      },
      {
        name: 'Analytics',
        description: 'Platform analytics and reporting',
      },
    ],
  },
  apis: [
    './server/routes/*.ts',
    './server/routes/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

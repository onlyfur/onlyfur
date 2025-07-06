import crypto from 'crypto';
import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: any;
  signature?: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  userId?: string;
  description?: string;
  headers?: Record<string, string>;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
  };
}

export interface WebhookDelivery {
  id: string;
  webhookEndpointId: string;
  event: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed' | 'retry';
  attemptCount: number;
  lastAttemptAt?: Date;
  deliveredAt?: Date;
  response?: any;
  error?: string;
}

/**
 * Webhook service for managing and delivering webhooks
 */
export class WebhookService {
  private static instance: WebhookService;
  private deliveryQueue: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  /**
   * Create a new webhook endpoint
   */
  async createWebhookEndpoint(data: {
    url: string;
    events: string[];
    userId?: string;
    description?: string;
    headers?: Record<string, string>;
  }): Promise<WebhookEndpoint> {
    try {
      const secret = this.generateSecret();
      
      const webhook = await prisma.webhookEndpoint.create({
        data: {
          url: data.url,
          secret,
          events: data.events,
          userId: data.userId,
          description: data.description,
          headers: data.headers ? JSON.stringify(data.headers) : null,
          isActive: true
        }
      });

      logger.info('Webhook endpoint created', {
        webhookId: webhook.id,
        url: data.url,
        events: data.events,
        userId: data.userId
      });

      // Audit log
      if (data.userId) {
        await createAuditLog({
          userId: data.userId,
          action: AuditActions.WEBHOOK_CREATE,
          resource: 'webhook_endpoint',
          resourceId: webhook.id,
          metadata: { url: data.url, events: data.events }
        });
      }

      return {
        id: webhook.id,
        url: webhook.url,
        secret: webhook.secret,
        events: webhook.events,
        isActive: webhook.isActive,
        userId: webhook.userId || undefined,
        description: webhook.description || undefined,
        headers: webhook.headers ? JSON.parse(webhook.headers) : undefined
      };

    } catch (error) {
      logger.error('Failed to create webhook endpoint', {
        error: error.message,
        data
      });
      throw error;
    }
  }

  /**
   * Get webhook endpoints for a user
   */
  async getUserWebhooks(userId: string): Promise<WebhookEndpoint[]> {
    try {
      const webhooks = await prisma.webhookEndpoint.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return webhooks.map(webhook => ({
        id: webhook.id,
        url: webhook.url,
        secret: webhook.secret,
        events: webhook.events,
        isActive: webhook.isActive,
        userId: webhook.userId || undefined,
        description: webhook.description || undefined,
        headers: webhook.headers ? JSON.parse(webhook.headers) : undefined
      }));

    } catch (error) {
      logger.error('Failed to get user webhooks', {
        userId,
        error: error.message
      });
      return [];
    }
  }

  /**
   * Update webhook endpoint
   */
  async updateWebhookEndpoint(
    webhookId: string, 
    userId: string,
    updates: Partial<Pick<WebhookEndpoint, 'url' | 'events' | 'isActive' | 'description' | 'headers'>>
  ): Promise<WebhookEndpoint | null> {
    try {
      const webhook = await prisma.webhookEndpoint.findUnique({
        where: { id: webhookId }
      });

      if (!webhook || webhook.userId !== userId) {
        return null;
      }

      const updatedWebhook = await prisma.webhookEndpoint.update({
        where: { id: webhookId },
        data: {
          ...updates,
          headers: updates.headers ? JSON.stringify(updates.headers) : undefined
        }
      });

      logger.info('Webhook endpoint updated', {
        webhookId,
        userId,
        updates
      });

      // Audit log
      await createAuditLog({
        userId,
        action: AuditActions.WEBHOOK_UPDATE,
        resource: 'webhook_endpoint',
        resourceId: webhookId,
        metadata: updates
      });

      return {
        id: updatedWebhook.id,
        url: updatedWebhook.url,
        secret: updatedWebhook.secret,
        events: updatedWebhook.events,
        isActive: updatedWebhook.isActive,
        userId: updatedWebhook.userId || undefined,
        description: updatedWebhook.description || undefined,
        headers: updatedWebhook.headers ? JSON.parse(updatedWebhook.headers) : undefined
      };

    } catch (error) {
      logger.error('Failed to update webhook endpoint', {
        webhookId,
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Delete webhook endpoint
   */
  async deleteWebhookEndpoint(webhookId: string, userId: string): Promise<boolean> {
    try {
      const webhook = await prisma.webhookEndpoint.findUnique({
        where: { id: webhookId }
      });

      if (!webhook || webhook.userId !== userId) {
        return false;
      }

      await prisma.webhookEndpoint.delete({
        where: { id: webhookId }
      });

      // Cancel any pending deliveries
      if (this.deliveryQueue.has(webhookId)) {
        clearTimeout(this.deliveryQueue.get(webhookId)!);
        this.deliveryQueue.delete(webhookId);
      }

      logger.info('Webhook endpoint deleted', {
        webhookId,
        userId
      });

      // Audit log
      await createAuditLog({
        userId,
        action: AuditActions.WEBHOOK_DELETE,
        resource: 'webhook_endpoint',
        resourceId: webhookId,
        metadata: { url: webhook.url }
      });

      return true;

    } catch (error) {
      logger.error('Failed to delete webhook endpoint', {
        webhookId,
        userId,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Trigger webhook event
   */
  async triggerEvent(event: string, data: any, userId?: string): Promise<void> {
    try {
      // Get all active webhook endpoints for this event
      const webhooks = await prisma.webhookEndpoint.findMany({
        where: {
          isActive: true,
          events: { has: event },
          ...(userId && { userId })
        }
      });

      if (webhooks.length === 0) {
        logger.debug('No webhooks found for event', { event, userId });
        return;
      }

      const payload: WebhookPayload = {
        event,
        timestamp: new Date().toISOString(),
        data
      };

      // Create delivery records and queue deliveries
      for (const webhook of webhooks) {
        const delivery = await prisma.webhookDelivery.create({
          data: {
            webhookEndpointId: webhook.id,
            event,
            payload: JSON.stringify(payload),
            status: 'pending',
            attemptCount: 0
          }
        });

        // Queue immediate delivery
        this.queueDelivery(delivery.id, webhook, payload);
      }

      logger.info('Webhook event triggered', {
        event,
        webhookCount: webhooks.length,
        userId
      });

    } catch (error) {
      logger.error('Failed to trigger webhook event', {
        event,
        userId,
        error: error.message
      });
    }
  }

  /**
   * Queue webhook delivery with retry logic
   */
  private async queueDelivery(
    deliveryId: string, 
    webhook: any, 
    payload: WebhookPayload, 
    retryCount: number = 0
  ): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, retryCount), 300000); // Max 5 minutes
    const maxRetries = 5;

    const timeoutId = setTimeout(async () => {
      try {
        await this.deliverWebhook(deliveryId, webhook, payload, retryCount);
      } catch (error) {
        logger.error('Webhook delivery failed', {
          deliveryId,
          webhookId: webhook.id,
          retryCount,
          error: error.message
        });

        if (retryCount < maxRetries) {
          // Schedule retry
          this.queueDelivery(deliveryId, webhook, payload, retryCount + 1);
        } else {
          // Mark as failed
          await prisma.webhookDelivery.update({
            where: { id: deliveryId },
            data: {
              status: 'failed',
              error: error.message,
              lastAttemptAt: new Date()
            }
          });
        }
      } finally {
        this.deliveryQueue.delete(deliveryId);
      }
    }, delay);

    this.deliveryQueue.set(deliveryId, timeoutId);
  }

  /**
   * Deliver webhook to endpoint
   */
  private async deliverWebhook(
    deliveryId: string,
    webhook: any,
    payload: WebhookPayload,
    retryCount: number
  ): Promise<void> {
    try {
      // Generate signature
      const signature = this.generateSignature(JSON.stringify(payload), webhook.secret);
      payload.signature = signature;

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'OnlyFur-Webhooks/1.0',
        'X-OnlyFur-Event': payload.event,
        'X-OnlyFur-Signature-256': signature,
        'X-OnlyFur-Delivery': deliveryId,
        ...(webhook.headers ? JSON.parse(webhook.headers) : {})
      };

      // Update delivery attempt
      await prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          status: 'retry',
          attemptCount: retryCount + 1,
          lastAttemptAt: new Date()
        }
      });

      // Make HTTP request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      };

      if (response.ok) {
        // Success
        await prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            status: 'delivered',
            deliveredAt: new Date(),
            response: JSON.stringify(responseData)
          }
        });

        logger.info('Webhook delivered successfully', {
          deliveryId,
          webhookId: webhook.id,
          status: response.status,
          retryCount
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      
      await prisma.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
          error: errorMessage,
          lastAttemptAt: new Date()
        }
      });

      throw error;
    }
  }

  /**
   * Get webhook deliveries for an endpoint
   */
  async getWebhookDeliveries(
    webhookId: string, 
    userId: string,
    limit: number = 50
  ): Promise<WebhookDelivery[]> {
    try {
      // Verify ownership
      const webhook = await prisma.webhookEndpoint.findUnique({
        where: { id: webhookId }
      });

      if (!webhook || webhook.userId !== userId) {
        return [];
      }

      const deliveries = await prisma.webhookDelivery.findMany({
        where: { webhookEndpointId: webhookId },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return deliveries.map(delivery => ({
        id: delivery.id,
        webhookEndpointId: delivery.webhookEndpointId,
        event: delivery.event,
        payload: JSON.parse(delivery.payload),
        status: delivery.status as any,
        attemptCount: delivery.attemptCount,
        lastAttemptAt: delivery.lastAttemptAt || undefined,
        deliveredAt: delivery.deliveredAt || undefined,
        response: delivery.response ? JSON.parse(delivery.response) : undefined,
        error: delivery.error || undefined
      }));

    } catch (error) {
      logger.error('Failed to get webhook deliveries', {
        webhookId,
        userId,
        error: error.message
      });
      return [];
    }
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(webhookId: string, userId: string): Promise<boolean> {
    try {
      const webhook = await prisma.webhookEndpoint.findUnique({
        where: { id: webhookId }
      });

      if (!webhook || webhook.userId !== userId) {
        return false;
      }

      const testPayload: WebhookPayload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook from OnlyFur',
          webhook_id: webhookId
        }
      };

      // Create test delivery
      const delivery = await prisma.webhookDelivery.create({
        data: {
          webhookEndpointId: webhook.id,
          event: 'test',
          payload: JSON.stringify(testPayload),
          status: 'pending',
          attemptCount: 0
        }
      });

      // Queue delivery
      this.queueDelivery(delivery.id, webhook, testPayload);

      return true;

    } catch (error) {
      logger.error('Failed to test webhook', {
        webhookId,
        userId,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Validate webhook signature
   */
  validateSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Generate webhook signature
   */
  private generateSignature(payload: string, secret: string): string {
    return `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
  }

  /**
   * Generate webhook secret
   */
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Cleanup old deliveries
   */
  async cleanupOldDeliveries(olderThanDays: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const result = await prisma.webhookDelivery.deleteMany({
        where: {
          createdAt: { lt: cutoffDate }
        }
      });

      logger.info('Cleaned up old webhook deliveries', {
        deletedCount: result.count,
        olderThanDays
      });

      return result.count;

    } catch (error) {
      logger.error('Failed to cleanup old deliveries', {
        error: error.message
      });
      return 0;
    }
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats(webhookId?: string, userId?: string): Promise<{
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageResponseTime: number;
    recentEvents: Array<{ event: string; count: number; }>;
  }> {
    try {
      const where: any = {};
      
      if (webhookId) {
        where.webhookEndpointId = webhookId;
      }
      
      if (userId && !webhookId) {
        // Get all webhooks for user
        const userWebhooks = await prisma.webhookEndpoint.findMany({
          where: { userId },
          select: { id: true }
        });
        where.webhookEndpointId = { in: userWebhooks.map(w => w.id) };
      }

      const [totalDeliveries, successfulDeliveries, failedDeliveries] = await Promise.all([
        prisma.webhookDelivery.count({ where }),
        prisma.webhookDelivery.count({ where: { ...where, status: 'delivered' } }),
        prisma.webhookDelivery.count({ where: { ...where, status: 'failed' } })
      ]);

      // Get recent events
      const recentEvents = await prisma.webhookDelivery.groupBy({
        by: ['event'],
        where: {
          ...where,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        },
        _count: true,
        orderBy: { _count: { event: 'desc' } },
        take: 10
      });

      return {
        totalDeliveries,
        successfulDeliveries,
        failedDeliveries,
        averageResponseTime: 0, // Would need to calculate from response times
        recentEvents: recentEvents.map(event => ({
          event: event.event,
          count: event._count
        }))
      };

    } catch (error) {
      logger.error('Failed to get webhook stats', {
        webhookId,
        userId,
        error: error.message
      });
      return {
        totalDeliveries: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        averageResponseTime: 0,
        recentEvents: []
      };
    }
  }
}

// Webhook events
export const WebhookEvents = {
  // User events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',

  // Content events
  CONTENT_CREATED: 'content.created',
  CONTENT_UPDATED: 'content.updated',
  CONTENT_DELETED: 'content.deleted',
  CONTENT_PUBLISHED: 'content.published',

  // Subscription events
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  SUBSCRIPTION_RENEWED: 'subscription.renewed',

  // Payment events
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYOUT_CREATED: 'payout.created',

  // Message events
  MESSAGE_SENT: 'message.sent',
  MESSAGE_RECEIVED: 'message.received',

  // Moderation events
  CONTENT_REPORTED: 'content.reported',
  CONTENT_MODERATED: 'content.moderated',

  // System events
  SYSTEM_MAINTENANCE: 'system.maintenance',
  SYSTEM_UPDATE: 'system.update'
} as const;

export const webhookService = WebhookService.getInstance();
export default webhookService;

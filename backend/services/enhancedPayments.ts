import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';
import { createNotification } from './notifications';
import { webhookService, WebhookEvents } from './webhooks';
import { NotificationType, NotificationPriority } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account' | 'paypal' | 'crypto' | 'apple_pay' | 'google_pay';
  provider: 'stripe' | 'paypal' | 'coinbase' | 'apple' | 'google';
  isDefault: boolean;
  isActive: boolean;
  metadata: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentIntent {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'tip' | 'content_purchase' | 'commission' | 'donation';
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
  paymentMethodId?: string;
  stripePaymentIntentId?: string;
  metadata: Record<string, any>;
  failureReason?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentSubscription {
  id: string;
  userId: string;
  creatorId: string;
  tierId: string;
  stripeSubscriptionId?: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDispute {
  id: string;
  paymentIntentId: string;
  stripeDisputeId?: string;
  reason: string;
  status: 'warning_needs_response' | 'warning_under_review' | 'warning_closed' | 'needs_response' | 'under_review' | 'charge_refunded' | 'won' | 'lost';
  amount: number;
  currency: string;
  evidence?: Record<string, any>;
  dueBy?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  subscriptionRevenue: number;
  oneTimeRevenue: number;
  refundedAmount: number;
  disputedAmount: number;
  successfulPayments: number;
  failedPayments: number;
  averageTransactionValue: number;
  topPaymentMethods: Array<{ method: string; count: number; amount: number; }>;
  revenueByCategory: Record<string, number>;
  monthlyGrowth: number;
}

export interface PayoutSchedule {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  scheduledAt: Date;
  processedAt?: Date;
  stripeTransferId?: string;
  failureReason?: string;
  createdAt: Date;
}

/**
 * Enhanced Payment Service - Comprehensive payment processing
 */
export class EnhancedPaymentService {
  private static instance: EnhancedPaymentService;

  static getInstance(): EnhancedPaymentService {
    if (!EnhancedPaymentService.instance) {
      EnhancedPaymentService.instance = new EnhancedPaymentService();
    }
    return EnhancedPaymentService.instance;
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(data: {
    userId: string;
    type: 'card' | 'bank_account' | 'paypal' | 'crypto' | 'apple_pay' | 'google_pay';
    stripePaymentMethodId?: string;
    isDefault?: boolean;
    metadata?: Record<string, any>;
  }): Promise<PaymentMethod> {
    try {
      // If this is the first payment method, make it default
      const existingMethods = await this.getUserPaymentMethods(data.userId);
      const isDefault = data.isDefault ?? existingMethods.length === 0;

      // If setting as default, unset other defaults
      if (isDefault) {
        await this.unsetDefaultPaymentMethods(data.userId);
      }

      const paymentMethod: PaymentMethod = {
        id: this.generatePaymentMethodId(),
        userId: data.userId,
        type: data.type,
        provider: this.getProviderForType(data.type),
        isDefault,
        isActive: true,
        metadata: {
          stripePaymentMethodId: data.stripePaymentMethodId,
          ...data.metadata
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await this.savePaymentMethodToDatabase(paymentMethod);

      // Audit log
      await createAuditLog({
        userId: data.userId,
        action: AuditActions.CREATE,
        resource: 'payment_method',
        resourceId: paymentMethod.id,
        metadata: {
          type: data.type,
          provider: paymentMethod.provider,
          isDefault
        }
      });

      logger.info('Payment method added', {
        paymentMethodId: paymentMethod.id,
        userId: data.userId,
        type: data.type
      });

      return paymentMethod;

    } catch (error) {
      logger.error('Failed to add payment method', {
        userId: data.userId,
        type: data.type,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Process payment
   */
  async processPayment(data: {
    userId: string;
    amount: number;
    currency: string;
    type: 'subscription' | 'tip' | 'content_purchase' | 'commission' | 'donation';
    paymentMethodId?: string;
    recipientId?: string;
    metadata?: Record<string, any>;
    description?: string;
  }): Promise<PaymentIntent> {
    try {
      // Get payment method
      const paymentMethod = data.paymentMethodId
        ? await this.getPaymentMethod(data.paymentMethodId)
        : await this.getDefaultPaymentMethod(data.userId);

      if (!paymentMethod) {
        throw new Error('No payment method available');
      }

      // Create payment intent
      const paymentIntent: PaymentIntent = {
        id: this.generatePaymentIntentId(),
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        type: data.type,
        status: 'pending',
        paymentMethodId: paymentMethod.id,
        metadata: {
          recipientId: data.recipientId,
          description: data.description,
          ...data.metadata
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await this.savePaymentIntentToDatabase(paymentIntent);

      // Process with Stripe
      if (paymentMethod.provider === 'stripe') {
        const stripeIntent = await stripe.paymentIntents.create({
          amount: Math.round(data.amount * 100), // Convert to cents
          currency: data.currency,
          payment_method: paymentMethod.metadata.stripePaymentMethodId,
          confirm: true,
          return_url: `${process.env.CLIENT_BASE_URL}/payment/return`,
          metadata: {
            paymentIntentId: paymentIntent.id,
            userId: data.userId,
            type: data.type
          }
        });

        paymentIntent.stripePaymentIntentId = stripeIntent.id;
        paymentIntent.status = this.mapStripeStatus(stripeIntent.status);
        
        if (stripeIntent.status === 'succeeded') {
          paymentIntent.processedAt = new Date();
          await this.handleSuccessfulPayment(paymentIntent);
        }
      }

      // Update payment intent
      await this.updatePaymentIntentInDatabase(paymentIntent);

      // Audit log
      await createAuditLog({
        userId: data.userId,
        action: AuditActions.CREATE,
        resource: 'payment_intent',
        resourceId: paymentIntent.id,
        metadata: {
          amount: data.amount,
          currency: data.currency,
          type: data.type,
          status: paymentIntent.status
        }
      });

      logger.info('Payment processed', {
        paymentIntentId: paymentIntent.id,
        userId: data.userId,
        amount: data.amount,
        status: paymentIntent.status
      });

      return paymentIntent;

    } catch (error) {
      logger.error('Failed to process payment', {
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Create subscription
   */
  async createSubscription(data: {
    userId: string;
    creatorId: string;
    tierId: string;
    paymentMethodId?: string;
    trialDays?: number;
  }): Promise<PaymentSubscription> {
    try {
      // Get tier details
      const tier = await this.getSubscriptionTier(data.tierId);
      if (!tier) {
        throw new Error('Subscription tier not found');
      }

      // Get payment method
      const paymentMethod = data.paymentMethodId
        ? await this.getPaymentMethod(data.paymentMethodId)
        : await this.getDefaultPaymentMethod(data.userId);

      if (!paymentMethod || paymentMethod.provider !== 'stripe') {
        throw new Error('Valid Stripe payment method required for subscriptions');
      }

      // Create Stripe subscription
      const stripeSubscription = await stripe.subscriptions.create({
        customer: await this.getOrCreateStripeCustomer(data.userId),
        items: [{
          price: tier.stripePriceId
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: data.trialDays,
        metadata: {
          userId: data.userId,
          creatorId: data.creatorId,
          tierId: data.tierId
        }
      });

      const subscription: PaymentSubscription = {
        id: this.generateSubscriptionId(),
        userId: data.userId,
        creatorId: data.creatorId,
        tierId: data.tierId,
        stripeSubscriptionId: stripeSubscription.id,
        status: this.mapStripeSubscriptionStatus(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: false,
        trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : undefined,
        trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await this.saveSubscriptionToDatabase(subscription);

      // Notify creator
      await createNotification({
        userId: data.creatorId,
        type: NotificationType.SUBSCRIPTION,
        title: 'New Subscriber',
        message: 'You have a new subscriber!',
        priority: NotificationPriority.HIGH,
        data: {
          subscriberId: data.userId,
          subscriptionId: subscription.id,
          tierId: data.tierId
        }
      });

      // Webhook event
      await webhookService.triggerEvent(WebhookEvents.SUBSCRIPTION_CREATED, {
        subscription,
        user: await this.getUser(data.userId),
        creator: await this.getUser(data.creatorId)
      }, data.creatorId);

      logger.info('Subscription created', {
        subscriptionId: subscription.id,
        userId: data.userId,
        creatorId: data.creatorId,
        tierId: data.tierId
      });

      return subscription;

    } catch (error) {
      logger.error('Failed to create subscription', {
        userId: data.userId,
        creatorId: data.creatorId,
        tierId: data.tierId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Process refund
   */
  async processRefund(data: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
    adminUserId?: string;
  }): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.getPaymentIntent(data.paymentIntentId);
      if (!paymentIntent) {
        throw new Error('Payment intent not found');
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Cannot refund non-successful payment');
      }

      const refundAmount = data.amount || paymentIntent.amount;

      // Process refund with Stripe
      if (paymentIntent.stripePaymentIntentId) {
        const refund = await stripe.refunds.create({
          payment_intent: paymentIntent.stripePaymentIntentId,
          amount: data.amount ? Math.round(data.amount * 100) : undefined,
          reason: data.reason as any,
          metadata: {
            paymentIntentId: paymentIntent.id,
            adminUserId: data.adminUserId
          }
        });

        paymentIntent.status = 'refunded';
        paymentIntent.updatedAt = new Date();
        await this.updatePaymentIntentInDatabase(paymentIntent);
      }

      // Notify user
      await createNotification({
        userId: paymentIntent.userId,
        type: NotificationType.PAYMENT,
        title: 'Refund Processed',
        message: `Your refund of ${refundAmount} ${paymentIntent.currency.toUpperCase()} has been processed.`,
        priority: NotificationPriority.HIGH,
        data: {
          paymentIntentId: paymentIntent.id,
          refundAmount,
          reason: data.reason
        }
      });

      // Audit log
      await createAuditLog({
        userId: data.adminUserId || 'system',
        action: AuditActions.UPDATE,
        resource: 'payment_refund',
        resourceId: paymentIntent.id,
        metadata: {
          originalAmount: paymentIntent.amount,
          refundAmount,
          reason: data.reason
        }
      });

      logger.info('Refund processed', {
        paymentIntentId: paymentIntent.id,
        refundAmount,
        reason: data.reason
      });

      return paymentIntent;

    } catch (error) {
      logger.error('Failed to process refund', {
        paymentIntentId: data.paymentIntentId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle payment disputes
   */
  async handleDispute(data: {
    stripeDisputeId: string;
    paymentIntentId: string;
    reason: string;
    amount: number;
    currency: string;
    status: string;
    dueBy?: Date;
  }): Promise<PaymentDispute> {
    try {
      const dispute: PaymentDispute = {
        id: this.generateDisputeId(),
        paymentIntentId: data.paymentIntentId,
        stripeDisputeId: data.stripeDisputeId,
        reason: data.reason,
        status: data.status as any,
        amount: data.amount,
        currency: data.currency,
        dueBy: data.dueBy,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await this.saveDisputeToDatabase(dispute);

      // Get payment intent to find the merchant
      const paymentIntent = await this.getPaymentIntent(data.paymentIntentId);
      if (paymentIntent && paymentIntent.metadata.recipientId) {
        // Notify merchant
        await createNotification({
          userId: paymentIntent.metadata.recipientId,
          type: NotificationType.PAYMENT,
          title: 'Payment Dispute',
          message: `A dispute has been opened for payment ${data.paymentIntentId}`,
          priority: NotificationPriority.URGENT,
          data: {
            disputeId: dispute.id,
            paymentIntentId: data.paymentIntentId,
            amount: data.amount,
            reason: data.reason,
            dueBy: data.dueBy
          }
        });
      }

      logger.info('Payment dispute created', {
        disputeId: dispute.id,
        paymentIntentId: data.paymentIntentId,
        amount: data.amount,
        reason: data.reason
      });

      return dispute;

    } catch (error) {
      logger.error('Failed to handle dispute', {
        stripeDisputeId: data.stripeDisputeId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(data: {
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    currency?: string;
  }): Promise<PaymentAnalytics> {
    try {
      const analytics = await this.calculatePaymentAnalytics(data);
      return analytics;
    } catch (error) {
      logger.error('Failed to get payment analytics', {
        userId: data.userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Schedule payout
   */
  async schedulePayout(data: {
    userId: string;
    amount: number;
    currency: string;
    scheduledAt?: Date;
  }): Promise<PayoutSchedule> {
    try {
      const payout: PayoutSchedule = {
        id: this.generatePayoutId(),
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        status: 'pending',
        scheduledAt: data.scheduledAt || new Date(),
        createdAt: new Date()
      };

      // Save to database
      await this.savePayoutToDatabase(payout);

      // If scheduled for now, process immediately
      if (!data.scheduledAt || data.scheduledAt <= new Date()) {
        await this.processPayout(payout.id);
      }

      logger.info('Payout scheduled', {
        payoutId: payout.id,
        userId: data.userId,
        amount: data.amount,
        scheduledAt: payout.scheduledAt
      });

      return payout;

    } catch (error) {
      logger.error('Failed to schedule payout', {
        userId: data.userId,
        amount: data.amount,
        error: error.message
      });
      throw error;
    }
  }

  // Private helper methods

  private generatePaymentMethodId(): string {
    return `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePaymentIntentId(): string {
    return `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDisputeId(): string {
    return `disp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePayoutId(): string {
    return `po_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getProviderForType(type: string): 'stripe' | 'paypal' | 'coinbase' | 'apple' | 'google' {
    switch (type) {
      case 'paypal':
        return 'paypal';
      case 'crypto':
        return 'coinbase';
      case 'apple_pay':
        return 'apple';
      case 'google_pay':
        return 'google';
      default:
        return 'stripe';
    }
  }

  private mapStripeStatus(status: string): 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded' {
    switch (status) {
      case 'succeeded':
        return 'succeeded';
      case 'processing':
        return 'processing';
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending';
      case 'canceled':
        return 'cancelled';
      default:
        return 'failed';
    }
  }

  private mapStripeSubscriptionStatus(status: string): 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'incomplete' {
    switch (status) {
      case 'active':
        return 'active';
      case 'canceled':
        return 'cancelled';
      case 'past_due':
        return 'past_due';
      case 'unpaid':
        return 'unpaid';
      default:
        return 'incomplete';
    }
  }

  private async handleSuccessfulPayment(paymentIntent: PaymentIntent): Promise<void> {
    // Handle post-payment actions based on type
    switch (paymentIntent.type) {
      case 'tip':
        await this.handleTipPayment(paymentIntent);
        break;
      case 'content_purchase':
        await this.handleContentPurchase(paymentIntent);
        break;
      case 'commission':
        await this.handleCommissionPayment(paymentIntent);
        break;
      case 'donation':
        await this.handleDonationPayment(paymentIntent);
        break;
    }
  }

  private async handleTipPayment(paymentIntent: PaymentIntent): Promise<void> {
    if (paymentIntent.metadata.recipientId) {
      await createNotification({
        userId: paymentIntent.metadata.recipientId,
        type: NotificationType.PAYMENT,
        title: 'Tip Received',
        message: `You received a tip of ${paymentIntent.amount} ${paymentIntent.currency.toUpperCase()}!`,
        priority: NotificationPriority.HIGH,
        data: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          senderId: paymentIntent.userId
        }
      });
    }
  }

  private async handleContentPurchase(paymentIntent: PaymentIntent): Promise<void> {
    // Grant access to purchased content
    if (paymentIntent.metadata.contentId) {
      // Implementation would grant access to the content
    }
  }

  private async handleCommissionPayment(paymentIntent: PaymentIntent): Promise<void> {
    // Handle commission payment
    if (paymentIntent.metadata.commissionId) {
      // Implementation would update commission status
    }
  }

  private async handleDonationPayment(paymentIntent: PaymentIntent): Promise<void> {
    // Handle donation
    if (paymentIntent.metadata.streamId) {
      // Implementation would update stream donation analytics
    }
  }

  private async getOrCreateStripeCustomer(userId: string): Promise<string> {
    // Implementation would get or create Stripe customer
    return `cus_${userId}`;
  }

  private async processPayout(payoutId: string): Promise<void> {
    // Implementation would process the payout
  }

  // Database methods - Actual implementations
  private async savePaymentMethodToDatabase(paymentMethod: PaymentMethod): Promise<void> {
    await prisma.paymentMethod.create({
      data: {
        id: paymentMethod.id,
        userId: paymentMethod.userId,
        type: paymentMethod.type,
        provider: paymentMethod.provider,
        isDefault: paymentMethod.isDefault,
        isActive: paymentMethod.isActive,
        metadata: JSON.stringify(paymentMethod.metadata),
        expiresAt: paymentMethod.expiresAt,
        createdAt: paymentMethod.createdAt,
        updatedAt: paymentMethod.updatedAt
      }
    });
  }

  private async savePaymentIntentToDatabase(paymentIntent: PaymentIntent): Promise<void> {
    await prisma.paymentIntent.create({
      data: {
        id: paymentIntent.id,
        userId: paymentIntent.userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        type: paymentIntent.type,
        status: paymentIntent.status,
        paymentMethodId: paymentIntent.paymentMethodId,
        stripePaymentIntentId: paymentIntent.stripePaymentIntentId,
        metadata: JSON.stringify(paymentIntent.metadata),
        failureReason: paymentIntent.failureReason,
        processedAt: paymentIntent.processedAt,
        createdAt: paymentIntent.createdAt,
        updatedAt: paymentIntent.updatedAt
      }
    });
  }

  private async updatePaymentIntentInDatabase(paymentIntent: PaymentIntent): Promise<void> {
    await prisma.paymentIntent.update({
      where: { id: paymentIntent.id },
      data: {
        status: paymentIntent.status,
        stripePaymentIntentId: paymentIntent.stripePaymentIntentId,
        failureReason: paymentIntent.failureReason,
        processedAt: paymentIntent.processedAt,
        updatedAt: paymentIntent.updatedAt
      }
    });
  }

  private async saveSubscriptionToDatabase(subscription: PaymentSubscription): Promise<void> {
    await prisma.paymentSubscription.create({
      data: {
        id: subscription.id,
        userId: subscription.userId,
        creatorId: subscription.creatorId,
        tierId: subscription.tierId,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        cancelledAt: subscription.cancelledAt,
        trialStart: subscription.trialStart,
        trialEnd: subscription.trialEnd,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt
      }
    });
  }

  private async saveDisputeToDatabase(dispute: PaymentDispute): Promise<void> {
    await prisma.paymentDispute.create({
      data: {
        id: dispute.id,
        paymentIntentId: dispute.paymentIntentId,
        stripeDisputeId: dispute.stripeDisputeId,
        reason: dispute.reason,
        status: dispute.status,
        amount: dispute.amount,
        currency: dispute.currency,
        evidence: JSON.stringify(dispute.evidence),
        dueBy: dispute.dueBy,
        createdAt: dispute.createdAt,
        updatedAt: dispute.updatedAt
      }
    });
  }

  private async savePayoutToDatabase(payout: PayoutSchedule): Promise<void> {
    await prisma.payoutSchedule.create({
      data: {
        id: payout.id,
        userId: payout.userId,
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
        scheduledAt: payout.scheduledAt,
        processedAt: payout.processedAt,
        stripeTransferId: payout.stripeTransferId,
        failureReason: payout.failureReason,
        createdAt: payout.createdAt
      }
    });
  }

  private async getPaymentMethod(id: string): Promise<PaymentMethod | null> {
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id }
    });
    
    if (!paymentMethod) return null;
    
    return {
      ...paymentMethod,
      metadata: JSON.parse(paymentMethod.metadata as string)
    };
  }

  private async getDefaultPaymentMethod(userId: string): Promise<PaymentMethod | null> {
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { 
        userId, 
        isDefault: true, 
        isActive: true 
      }
    });
    
    if (!paymentMethod) return null;
    
    return {
      ...paymentMethod,
      metadata: JSON.parse(paymentMethod.metadata as string)
    };
  }

  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId, isActive: true },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    return paymentMethods.map(pm => ({
      ...pm,
      metadata: JSON.parse(pm.metadata as string)
    }));
  }

  private async unsetDefaultPaymentMethods(userId: string): Promise<void> {
    await prisma.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }

  private async getPaymentIntent(id: string): Promise<PaymentIntent | null> {
    const paymentIntent = await prisma.paymentIntent.findUnique({
      where: { id }
    });
    
    if (!paymentIntent) return null;
    
    return {
      ...paymentIntent,
      metadata: JSON.parse(paymentIntent.metadata as string)
    };
  }

  private async getSubscriptionTier(id: string): Promise<any> {
    return await prisma.subscriptionTier.findUnique({
      where: { id }
    });
  }

  private async getUser(id: string): Promise<any> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  private async calculatePaymentAnalytics(data: any): Promise<PaymentAnalytics> {
    const { userId, startDate, endDate, currency } = data;
    
    const whereClause: any = {};
    if (userId) whereClause.userId = userId;
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }
    if (currency) whereClause.currency = currency;

    const payments = await prisma.paymentIntent.findMany({
      where: whereClause
    });

    const totalRevenue = payments
      .filter(p => p.status === 'succeeded')
      .reduce((sum, p) => sum + p.amount, 0);

    const refundedAmount = payments
      .filter(p => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0);

    const successfulPayments = payments.filter(p => p.status === 'succeeded').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;

    return {
      totalRevenue,
      monthlyRevenue: totalRevenue, // Simplified
      subscriptionRevenue: 0, // Would calculate from subscription payments
      oneTimeRevenue: totalRevenue,
      refundedAmount,
      disputedAmount: 0, // Would calculate from disputes
      successfulPayments,
      failedPayments,
      averageTransactionValue: successfulPayments > 0 ? totalRevenue / successfulPayments : 0,
      topPaymentMethods: [],
      revenueByCategory: {},
      monthlyGrowth: 0
    };
  }

  // Additional methods for missing functionality
  async removePaymentMethod(id: string, userId: string): Promise<void> {
    await prisma.paymentMethod.update({
      where: { id, userId },
      data: { isActive: false }
    });
  }

  async cancelSubscription(id: string, userId: string, options: { cancelAtPeriodEnd: boolean; reason?: string }): Promise<PaymentSubscription> {
    const subscription = await prisma.paymentSubscription.update({
      where: { id, userId },
      data: {
        cancelAtPeriodEnd: options.cancelAtPeriodEnd,
        cancelledAt: options.cancelAtPeriodEnd ? undefined : new Date(),
        status: options.cancelAtPeriodEnd ? 'active' : 'cancelled'
      }
    });

    return {
      ...subscription,
      metadata: {}
    };
  }

  async getUserPayouts(userId: string, options: { status?: string; limit: number; offset: number }): Promise<PayoutSchedule[]> {
    const whereClause: any = { userId };
    if (options.status) whereClause.status = options.status;

    return await prisma.payoutSchedule.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: options.limit,
      skip: options.offset
    });
  }

  async getDispute(id: string, userId: string): Promise<PaymentDispute | null> {
    const dispute = await prisma.paymentDispute.findFirst({
      where: { 
        id,
        paymentIntent: { userId }
      },
      include: {
        paymentIntent: true
      }
    });

    if (!dispute) return null;

    return {
      ...dispute,
      evidence: JSON.parse(dispute.evidence as string || '{}')
    };
  }

  async submitDisputeEvidence(id: string, userId: string, data: { evidence: any; additionalInfo?: string }): Promise<PaymentDispute> {
    const dispute = await prisma.paymentDispute.update({
      where: { 
        id,
        paymentIntent: { userId }
      },
      data: {
        evidence: JSON.stringify(data.evidence),
        updatedAt: new Date()
      }
    });

    return {
      ...dispute,
      evidence: JSON.parse(dispute.evidence as string)
    };
  }

  async handleWebhook(body: any, signature: string): Promise<any> {
    // Process Stripe webhook events
    try {
      const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleSubscriptionPayment(event.data.object);
          break;
        // Add more webhook handlers as needed
      }

      return event;
    } catch (error) {
      logger.error('Webhook processing failed', { error: error.message });
      throw error;
    }
  }

  private async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
    // Handle successful payment
  }

  private async handlePaymentFailed(paymentIntent: any): Promise<void> {
    // Handle failed payment
  }

  private async handleSubscriptionPayment(invoice: any): Promise<void> {
    // Handle subscription payment
  }
}

export const enhancedPaymentService = EnhancedPaymentService.getInstance();
export default enhancedPaymentService;

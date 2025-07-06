import Stripe from 'stripe';
import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';
import { createNotification } from './notifications';
import { NotificationType, NotificationPriority } from '@prisma/client';
import { put } from '@vercel/blob';
import PDFDocument from 'pdfkit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export interface StripeCustomer {
  id: string;
  userId: string;
  stripeCustomerId: string;
  email: string;
  name?: string;
  defaultPaymentMethodId?: string;
  billingAddress?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface StripeInvoice {
  id: string;
  stripeInvoiceId: string;
  customerId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  paidAt?: Date;
  dueDate?: Date;
  invoiceNumber: string;
  invoiceUrl?: string;
  invoicePdfUrl?: string;
  blobUrl?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface StripePayment {
  id: string;
  stripePaymentIntentId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'canceled' | 'processing' | 'requires_action';
  paymentMethodId?: string;
  invoiceId?: string;
  description?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSpending {
  totalSpent: number;
  monthlySpending: Array<{
    month: string;
    amount: number;
    subscriptions: number;
    oneTime: number;
  }>;
  activeSubscriptions: number;
  upcomingPayments: Array<{
    amount: number;
    currency: string;
    dueDate: Date;
    description: string;
  }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    currency: string;
    description: string;
    date: Date;
    status: string;
  }>;
}

/**
 * Comprehensive Stripe Integration Service
 */
export class StripeIntegrationService {
  private static instance: StripeIntegrationService;

  static getInstance(): StripeIntegrationService {
    if (!StripeIntegrationService.instance) {
      StripeIntegrationService.instance = new StripeIntegrationService();
    }
    return StripeIntegrationService.instance;
  }

  /**
   * Get or create Stripe customer
   */
  async getOrCreateCustomer(userId: string): Promise<StripeCustomer> {
    try {
      // Check if customer already exists
      let customer = await this.getCustomerByUserId(userId);
      if (customer) {
        return customer;
      }

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Create Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        metadata: {
          userId: userId,
          platform: 'onlyfur'
        }
      });

      // Save to database
      customer = {
        id: this.generateCustomerId(),
        userId,
        stripeCustomerId: stripeCustomer.id,
        email: user.email,
        name: user.displayName,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.saveCustomerToDatabase(customer);

      logger.info('Stripe customer created', {
        userId,
        customerId: customer.id,
        stripeCustomerId: stripeCustomer.id
      });

      return customer;

    } catch (error) {
      logger.error('Failed to get or create Stripe customer', {
        userId,
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
    priceId: string;
    paymentMethodId?: string;
    trialDays?: number;
  }): Promise<any> {
    try {
      const customer = await this.getOrCreateCustomer(data.userId);

      // Get or set payment method
      let paymentMethodId = data.paymentMethodId;
      if (!paymentMethodId) {
        paymentMethodId = customer.defaultPaymentMethodId;
      }

      if (!paymentMethodId) {
        throw new Error('No payment method available');
      }

      // Attach payment method to customer if not already attached
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.stripeCustomerId
      });

      // Set as default payment method
      await stripe.customers.update(customer.stripeCustomerId, {
        default_payment_method: paymentMethodId
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.stripeCustomerId,
        items: [{ price: data.priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: data.trialDays,
        metadata: {
          userId: data.userId,
          creatorId: data.creatorId,
          platform: 'onlyfur'
        }
      });

      // Save subscription to database
      await this.saveSubscriptionToDatabase({
        id: this.generateSubscriptionId(),
        userId: data.userId,
        creatorId: data.creatorId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: data.priceId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : undefined,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create notification
      await createNotification({
        userId: data.creatorId,
        type: NotificationType.SUBSCRIPTION,
        title: 'New Subscription',
        message: 'You have a new subscriber!',
        priority: NotificationPriority.HIGH,
        data: {
          subscriberId: data.userId,
          subscriptionId: subscription.id
        }
      });

      logger.info('Subscription created', {
        userId: data.userId,
        creatorId: data.creatorId,
        subscriptionId: subscription.id
      });

      return subscription;

    } catch (error) {
      logger.error('Failed to create subscription', {
        userId: data.userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, userId: string, immediately: boolean = false): Promise<any> {
    try {
      // Get subscription from database
      const dbSubscription = await this.getSubscriptionFromDatabase(subscriptionId, userId);
      if (!dbSubscription) {
        throw new Error('Subscription not found');
      }

      let updatedSubscription;
      
      if (immediately) {
        // Cancel immediately
        updatedSubscription = await stripe.subscriptions.cancel(dbSubscription.stripeSubscriptionId);
      } else {
        // Cancel at period end
        updatedSubscription = await stripe.subscriptions.update(dbSubscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
      }

      // Update database
      await this.updateSubscriptionInDatabase(subscriptionId, {
        status: updatedSubscription.status,
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
        cancelledAt: immediately ? new Date() : undefined,
        updatedAt: new Date()
      });

      // Create audit log
      await createAuditLog({
        userId,
        action: AuditActions.UPDATE,
        resource: 'subscription',
        resourceId: subscriptionId,
        metadata: {
          action: immediately ? 'cancel_immediately' : 'cancel_at_period_end',
          stripeSubscriptionId: dbSubscription.stripeSubscriptionId
        }
      });

      logger.info('Subscription cancelled', {
        userId,
        subscriptionId,
        immediately
      });

      return updatedSubscription;

    } catch (error) {
      logger.error('Failed to cancel subscription', {
        userId,
        subscriptionId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get user subscriptions
   */
  async getUserSubscriptions(userId: string): Promise<any[]> {
    try {
      const subscriptions = await prisma.stripeSubscription.findMany({
        where: { userId },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Enrich with Stripe data
      const enrichedSubscriptions = await Promise.all(
        subscriptions.map(async (sub) => {
          try {
            const stripeSubscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
            const price = await stripe.prices.retrieve(sub.stripePriceId);
            const product = await stripe.products.retrieve(price.product as string);

            return {
              ...sub,
              stripe: stripeSubscription,
              price: {
                amount: price.unit_amount! / 100,
                currency: price.currency,
                interval: price.recurring?.interval,
                intervalCount: price.recurring?.interval_count
              },
              product: {
                name: product.name,
                description: product.description
              }
            };
          } catch (error) {
            logger.error('Failed to enrich subscription with Stripe data', {
              subscriptionId: sub.id,
              error: error.message
            });
            return sub;
          }
        })
      );

      return enrichedSubscriptions;

    } catch (error) {
      logger.error('Failed to get user subscriptions', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get user invoices
   */
  async getUserInvoices(userId: string): Promise<StripeInvoice[]> {
    try {
      const customer = await this.getCustomerByUserId(userId);
      if (!customer) {
        return [];
      }

      // Get invoices from Stripe
      const stripeInvoices = await stripe.invoices.list({
        customer: customer.stripeCustomerId,
        limit: 100
      });

      // Get invoices from database
      const dbInvoices = await prisma.stripeInvoice.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: 'desc' }
      });

      // Merge and update database if needed
      const invoices: StripeInvoice[] = [];
      
      for (const stripeInvoice of stripeInvoices.data) {
        let dbInvoice = dbInvoices.find(inv => inv.stripeInvoiceId === stripeInvoice.id);
        
        if (!dbInvoice) {
          // Create new invoice record
          dbInvoice = {
            id: this.generateInvoiceId(),
            stripeInvoiceId: stripeInvoice.id,
            customerId: customer.id,
            amount: stripeInvoice.amount_paid / 100,
            currency: stripeInvoice.currency,
            status: stripeInvoice.status as any,
            paidAt: stripeInvoice.status_transitions.paid_at ? new Date(stripeInvoice.status_transitions.paid_at * 1000) : undefined,
            dueDate: stripeInvoice.due_date ? new Date(stripeInvoice.due_date * 1000) : undefined,
            invoiceNumber: stripeInvoice.number || `INV-${Date.now()}`,
            invoiceUrl: stripeInvoice.hosted_invoice_url || undefined,
            invoicePdfUrl: stripeInvoice.invoice_pdf || undefined,
            metadata: stripeInvoice.metadata,
            createdAt: new Date(stripeInvoice.created * 1000),
            updatedAt: new Date()
          };

          await this.saveInvoiceToDatabase(dbInvoice);
        }

        invoices.push(dbInvoice);
      }

      return invoices;

    } catch (error) {
      logger.error('Failed to get user invoices', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Download invoice PDF
   */
  async downloadInvoicePdf(invoiceId: string, userId: string): Promise<{ url: string; filename: string; }> {
    try {
      const invoice = await this.getInvoiceFromDatabase(invoiceId, userId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Check if we already have the PDF stored in Vercel Blob
      if (invoice.blobUrl) {
        return {
          url: invoice.blobUrl,
          filename: `invoice-${invoice.invoiceNumber}.pdf`
        };
      }

      // Get PDF from Stripe or generate one
      let pdfBuffer: Buffer;
      
      if (invoice.invoicePdfUrl) {
        // Download from Stripe
        const response = await fetch(invoice.invoicePdfUrl);
        pdfBuffer = Buffer.from(await response.arrayBuffer());
      } else {
        // Generate PDF
        pdfBuffer = await this.generateInvoicePdf(invoice);
      }

      // Upload to Vercel Blob
      const filename = `invoice-${invoice.invoiceNumber}.pdf`;
      const blob = await put(filename, pdfBuffer, {
        access: 'private'
      });

      // Update database with blob URL
      await this.updateInvoiceInDatabase(invoiceId, {
        blobUrl: blob.url,
        updatedAt: new Date()
      });

      logger.info('Invoice PDF downloaded', {
        userId,
        invoiceId,
        filename
      });

      return {
        url: blob.url,
        filename
      };

    } catch (error) {
      logger.error('Failed to download invoice PDF', {
        userId,
        invoiceId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get user spending analytics
   */
  async getUserSpending(userId: string): Promise<UserSpending> {
    try {
      const customer = await this.getCustomerByUserId(userId);
      if (!customer) {
        return {
          totalSpent: 0,
          monthlySpending: [],
          activeSubscriptions: 0,
          upcomingPayments: [],
          recentTransactions: []
        };
      }

      // Get payments from database
      const payments = await prisma.stripePayment.findMany({
        where: { 
          customerId: customer.id,
          status: 'succeeded'
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      });

      // Calculate total spent
      const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);

      // Calculate monthly spending
      const monthlySpending = this.calculateMonthlySpending(payments);

      // Get active subscriptions
      const activeSubscriptions = await prisma.stripeSubscription.count({
        where: {
          userId,
          status: 'active'
        }
      });

      // Get upcoming payments
      const upcomingPayments = await this.getUpcomingPayments(customer.stripeCustomerId);

      // Get recent transactions
      const recentTransactions = payments.slice(0, 10).map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        description: payment.description || 'Payment',
        date: payment.createdAt,
        status: payment.status
      }));

      return {
        totalSpent,
        monthlySpending,
        activeSubscriptions,
        upcomingPayments,
        recentTransactions
      };

    } catch (error) {
      logger.error('Failed to get user spending', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(body: Buffer, signature: string): Promise<void> {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      logger.info('Processing Stripe webhook', {
        eventType: event.type,
        eventId: event.id
      });

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        default:
          logger.info('Unhandled webhook event type', { eventType: event.type });
      }

    } catch (error) {
      logger.error('Failed to process Stripe webhook', {
        error: error.message
      });
      throw error;
    }
  }

  // Private helper methods

  private generateCustomerId(): string {
    return `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateInvoiceId(): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePaymentId(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async generateInvoicePdf(invoice: StripeInvoice): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Add content to PDF
        doc.fontSize(20).text('Invoice', 50, 50);
        doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 100);
        doc.text(`Amount: ${invoice.amount} ${invoice.currency.toUpperCase()}`, 50, 120);
        doc.text(`Status: ${invoice.status}`, 50, 140);
        if (invoice.paidAt) {
          doc.text(`Paid At: ${invoice.paidAt.toLocaleDateString()}`, 50, 160);
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private calculateMonthlySpending(payments: any[]): Array<{
    month: string;
    amount: number;
    subscriptions: number;
    oneTime: number;
  }> {
    const monthlyData = new Map();

    payments.forEach(payment => {
      const month = payment.createdAt.toISOString().substring(0, 7); // YYYY-MM
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          month,
          amount: 0,
          subscriptions: 0,
          oneTime: 0
        });
      }

      const data = monthlyData.get(month);
      data.amount += payment.amount;
      
      if (payment.invoiceId) {
        data.subscriptions += payment.amount;
      } else {
        data.oneTime += payment.amount;
      }
    });

    return Array.from(monthlyData.values()).sort((a, b) => b.month.localeCompare(a.month));
  }

  private async getUpcomingPayments(stripeCustomerId: string): Promise<Array<{
    amount: number;
    currency: string;
    dueDate: Date;
    description: string;
  }>> {
    try {
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: stripeCustomerId
      });

      return [{
        amount: upcomingInvoice.amount_due / 100,
        currency: upcomingInvoice.currency,
        dueDate: new Date(upcomingInvoice.period_end * 1000),
        description: 'Subscription renewal'
      }];
    } catch (error) {
      return [];
    }
  }

  // Webhook handlers
  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const customer = await this.getCustomerByStripeId(paymentIntent.customer as string);
    if (!customer) return;

    const payment: StripePayment = {
      id: this.generatePaymentId(),
      stripePaymentIntentId: paymentIntent.id,
      customerId: customer.id,
      amount: paymentIntent.amount_received / 100,
      currency: paymentIntent.currency,
      status: 'succeeded',
      paymentMethodId: paymentIntent.payment_method as string,
      description: paymentIntent.description,
      metadata: paymentIntent.metadata,
      createdAt: new Date(paymentIntent.created * 1000),
      updatedAt: new Date()
    };

    await this.savePaymentToDatabase(payment);
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const customer = await this.getCustomerByStripeId(paymentIntent.customer as string);
    if (!customer) return;

    const payment: StripePayment = {
      id: this.generatePaymentId(),
      stripePaymentIntentId: paymentIntent.id,
      customerId: customer.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: 'failed',
      paymentMethodId: paymentIntent.payment_method as string,
      description: paymentIntent.description,
      metadata: paymentIntent.metadata,
      createdAt: new Date(paymentIntent.created * 1000),
      updatedAt: new Date()
    };

    await this.savePaymentToDatabase(payment);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    // Implementation for invoice paid webhook
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    // Implementation for invoice payment failed webhook
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    // Implementation for subscription created webhook
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    // Implementation for subscription updated webhook
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Implementation for subscription deleted webhook
  }

  // Database methods
  private async getCustomerByUserId(userId: string): Promise<StripeCustomer | null> {
    const customer = await prisma.stripeCustomer.findUnique({
      where: { userId }
    });
    return customer;
  }

  private async getCustomerByStripeId(stripeCustomerId: string): Promise<StripeCustomer | null> {
    const customer = await prisma.stripeCustomer.findUnique({
      where: { stripeCustomerId }
    });
    return customer;
  }

  private async saveCustomerToDatabase(customer: StripeCustomer): Promise<void> {
    await prisma.stripeCustomer.create({
      data: customer
    });
  }

  private async saveSubscriptionToDatabase(subscription: any): Promise<void> {
    await prisma.stripeSubscription.create({
      data: subscription
    });
  }

  private async getSubscriptionFromDatabase(subscriptionId: string, userId: string): Promise<any> {
    return await prisma.stripeSubscription.findFirst({
      where: { id: subscriptionId, userId }
    });
  }

  private async updateSubscriptionInDatabase(subscriptionId: string, updates: any): Promise<void> {
    await prisma.stripeSubscription.update({
      where: { id: subscriptionId },
      data: updates
    });
  }

  private async saveInvoiceToDatabase(invoice: StripeInvoice): Promise<void> {
    await prisma.stripeInvoice.create({
      data: invoice
    });
  }

  private async getInvoiceFromDatabase(invoiceId: string, userId: string): Promise<StripeInvoice | null> {
    const invoice = await prisma.stripeInvoice.findFirst({
      where: { 
        id: invoiceId,
        customer: { userId }
      },
      include: { customer: true }
    });
    return invoice;
  }

  private async updateInvoiceInDatabase(invoiceId: string, updates: any): Promise<void> {
    await prisma.stripeInvoice.update({
      where: { id: invoiceId },
      data: updates
    });
  }

  private async savePaymentToDatabase(payment: StripePayment): Promise<void> {
    await prisma.stripePayment.create({
      data: payment
    });
  }
}

export const stripeIntegrationService = StripeIntegrationService.getInstance();
export default stripeIntegrationService;

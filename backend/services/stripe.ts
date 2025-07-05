import Stripe from 'stripe';
import { logger, logPaymentOperation } from '../middleware/logger';
import { PaymentError } from '../middleware/errorHandler';

let stripe: Stripe | null = null;

// Initialize Stripe service
export async function initializeStripe(): Promise<void> {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      logger.warn('Stripe not configured - STRIPE_SECRET_KEY missing');
      return;
    }

    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });

    // Test the connection
    await stripe.balance.retrieve();
    
    logger.info('Stripe service initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Stripe:', error);
    throw error;
  }
}

// Create a payment intent
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    logPaymentOperation('Payment intent created', {
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency
    });

    return paymentIntent;
  } catch (error) {
    logger.error('Failed to create payment intent:', error);
    throw new PaymentError('Failed to create payment intent');
  }
}

// Create a subscription
export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>
): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    logPaymentOperation('Subscription created', {
      subscriptionId: subscription.id,
      customerId,
      priceId
    });

    return subscription;
  } catch (error) {
    logger.error('Failed to create subscription:', error);
    throw new PaymentError('Failed to create subscription');
  }
}

// Create or retrieve a customer
export async function createOrRetrieveCustomer(
  email: string,
  name?: string,
  userId?: string
): Promise<Stripe.Customer> {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    // First, try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: userId ? { userId } : undefined,
    });

    logPaymentOperation('Customer created', {
      customerId: customer.id,
      email,
      userId
    });

    return customer;
  } catch (error) {
    logger.error('Failed to create/retrieve customer:', error);
    throw new PaymentError('Failed to create customer');
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    logPaymentOperation('Subscription cancelled', {
      subscriptionId
    });

    return subscription;
  } catch (error) {
    logger.error('Failed to cancel subscription:', error);
    throw new PaymentError('Failed to cancel subscription');
  }
}

// Update a subscription
export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Stripe.SubscriptionUpdateParams>
): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, updates);

    logPaymentOperation('Subscription updated', {
      subscriptionId,
      updates
    });

    return subscription;
  } catch (error) {
    logger.error('Failed to update subscription:', error);
    throw new PaymentError('Failed to update subscription');
  }
}

// Retrieve subscription
export async function retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    logger.error('Failed to retrieve subscription:', error);
    throw new PaymentError('Failed to retrieve subscription');
  }
}

// Create a price for a product
export async function createPrice(
  productId: string,
  amount: number,
  currency: string = 'usd',
  interval: 'month' | 'year' = 'month'
): Promise<Stripe.Price> {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: Math.round(amount * 100), // Convert to cents
      currency,
      recurring: {
        interval,
      },
    });

    logPaymentOperation('Price created', {
      priceId: price.id,
      productId,
      amount,
      interval
    });

    return price;
  } catch (error) {
    logger.error('Failed to create price:', error);
    throw new PaymentError('Failed to create price');
  }
}

// Create a product
export async function createProduct(
  name: string,
  description?: string
): Promise<Stripe.Product> {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    const product = await stripe.products.create({
      name,
      description,
    });

    logPaymentOperation('Product created', {
      productId: product.id,
      name
    });

    return product;
  } catch (error) {
    logger.error('Failed to create product:', error);
    throw new PaymentError('Failed to create product');
  }
}

// Handle webhook events
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  logPaymentOperation('Webhook received', {
    eventType: event.type,
    eventId: event.id
  });

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        logger.info('Unhandled webhook event type:', event.type);
    }
  } catch (error) {
    logger.error('Error handling webhook event:', {
      eventType: event.type,
      eventId: event.id,
      error: error instanceof Error ? error.message : error
    });
    throw error;
  }
}

// Webhook event handlers
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const { prisma } = await import('./database');
  
  logPaymentOperation('Payment succeeded', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100
  });
  
  try {
    // Update transaction status
    await prisma.transaction.updateMany({
      where: { paymentIntentId: paymentIntent.id },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
        fees: paymentIntent.application_fee_amount ? paymentIntent.application_fee_amount / 100 : 0
      }
    });

    // Update payment intent record
    await prisma.paymentIntent.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'succeeded',
        processedAt: new Date()
      }
    });

    logger.info('Payment intent succeeded - database updated', {
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    logger.error('Failed to update database for successful payment:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const { prisma } = await import('./database');
  
  logPaymentOperation('Payment failed', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100
  });
  
  try {
    // Update transaction status
    await prisma.transaction.updateMany({
      where: { paymentIntentId: paymentIntent.id },
      data: {
        status: 'FAILED',
        processedAt: new Date()
      }
    });

    // Update payment intent record
    await prisma.paymentIntent.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'failed',
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
        processedAt: new Date()
      }
    });

    logger.info('Payment intent failed - database updated', {
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    logger.error('Failed to update database for failed payment:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  const { prisma } = await import('./database');
  
  logPaymentOperation('Subscription created via webhook', {
    subscriptionId: subscription.id,
    customerId: subscription.customer
  });
  
  try {
    // Find user by Stripe customer ID
    const stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { stripeCustomerId: subscription.customer as string },
      include: { user: true }
    });

    if (!stripeCustomer) {
      logger.error('User not found for Stripe customer:', subscription.customer);
      return;
    }

    // Create or update subscription record
    await prisma.stripeSubscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      create: {
        userId: stripeCustomer.userId,
        creatorId: stripeCustomer.userId, // For platform subscriptions
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        metadata: subscription.metadata as any
      },
      update: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        metadata: subscription.metadata as any
      }
    });

    // Update user subscription status
    await prisma.user.update({
      where: { id: stripeCustomer.userId },
      data: {
        subscriptionStatus: subscription.status === 'active' ? 'ACTIVE' : 'FREE'
      }
    });

    logger.info('Subscription created - database updated', {
      subscriptionId: subscription.id,
      userId: stripeCustomer.userId
    });
  } catch (error) {
    logger.error('Failed to update database for subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const { prisma } = await import('./database');
  
  logPaymentOperation('Subscription updated via webhook', {
    subscriptionId: subscription.id,
    status: subscription.status
  });
  
  try {
    // Update subscription record
    const updatedSubscription = await prisma.stripeSubscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        cancelledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        metadata: subscription.metadata as any
      },
      include: { user: true }
    });

    // Update user subscription status
    let userStatus: 'FREE' | 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'UNPAID' = 'FREE';
    
    switch (subscription.status) {
      case 'active':
        userStatus = 'ACTIVE';
        break;
      case 'canceled':
        userStatus = 'CANCELLED';
        break;
      case 'past_due':
        userStatus = 'PAST_DUE';
        break;
      case 'unpaid':
        userStatus = 'UNPAID';
        break;
      default:
        userStatus = 'FREE';
    }

    await prisma.user.update({
      where: { id: updatedSubscription.userId },
      data: { subscriptionStatus: userStatus }
    });

    logger.info('Subscription updated - database updated', {
      subscriptionId: subscription.id,
      status: subscription.status,
      userId: updatedSubscription.userId
    });
  } catch (error) {
    logger.error('Failed to update database for subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const { prisma } = await import('./database');
  
  logPaymentOperation('Subscription deleted via webhook', {
    subscriptionId: subscription.id
  });
  
  try {
    // Update subscription record
    const deletedSubscription = await prisma.stripeSubscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        cancelledAt: new Date()
      },
      include: { user: true }
    });

    // Update user subscription status
    await prisma.user.update({
      where: { id: deletedSubscription.userId },
      data: { subscriptionStatus: 'CANCELLED' }
    });

    logger.info('Subscription deleted - database updated', {
      subscriptionId: subscription.id,
      userId: deletedSubscription.userId
    });
  } catch (error) {
    logger.error('Failed to update database for subscription deletion:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  const { prisma } = await import('./database');
  
  logPaymentOperation('Invoice payment succeeded', {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription
  });
  
  try {
    // Find customer
    const stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { stripeCustomerId: invoice.customer as string }
    });

    if (!stripeCustomer) {
      logger.error('Customer not found for invoice:', invoice.customer);
      return;
    }

    // Create or update invoice record
    await prisma.stripeInvoice.upsert({
      where: { stripeInvoiceId: invoice.id },
      create: {
        stripeInvoiceId: invoice.id,
        customerId: stripeCustomer.id,
        subscriptionId: invoice.subscription ? 
          (await prisma.stripeSubscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string }
          }))?.id : null,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: invoice.status || 'paid',
        paidAt: invoice.status_transitions?.paid_at ? 
          new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
        invoiceNumber: invoice.number || '',
        invoiceUrl: invoice.hosted_invoice_url,
        invoicePdfUrl: invoice.invoice_pdf,
        metadata: invoice.metadata as any
      },
      update: {
        status: invoice.status || 'paid',
        paidAt: invoice.status_transitions?.paid_at ? 
          new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
        invoiceUrl: invoice.hosted_invoice_url,
        invoicePdfUrl: invoice.invoice_pdf
      }
    });

    // If subscription invoice, ensure user status is active
    if (invoice.subscription) {
      const subscription = await prisma.stripeSubscription.findUnique({
        where: { stripeSubscriptionId: invoice.subscription as string }
      });

      if (subscription) {
        await prisma.user.update({
          where: { id: subscription.userId },
          data: { subscriptionStatus: 'ACTIVE' }
        });
      }
    }

    logger.info('Invoice payment succeeded - database updated', {
      invoiceId: invoice.id
    });
  } catch (error) {
    logger.error('Failed to update database for successful invoice payment:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const { prisma } = await import('./database');
  
  logPaymentOperation('Invoice payment failed', {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription
  });
  
  try {
    // Find customer
    const stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: { stripeCustomerId: invoice.customer as string }
    });

    if (!stripeCustomer) {
      logger.error('Customer not found for failed invoice:', invoice.customer);
      return;
    }

    // Update invoice record
    await prisma.stripeInvoice.upsert({
      where: { stripeInvoiceId: invoice.id },
      create: {
        stripeInvoiceId: invoice.id,
        customerId: stripeCustomer.id,
        subscriptionId: invoice.subscription ? 
          (await prisma.stripeSubscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string }
          }))?.id : null,
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
        status: 'uncollectible',
        invoiceNumber: invoice.number || '',
        invoiceUrl: invoice.hosted_invoice_url,
        invoicePdfUrl: invoice.invoice_pdf,
        metadata: invoice.metadata as any
      },
      update: {
        status: 'uncollectible',
        invoiceUrl: invoice.hosted_invoice_url,
        invoicePdfUrl: invoice.invoice_pdf
      }
    });

    // If subscription invoice failed, update user status
    if (invoice.subscription) {
      const subscription = await prisma.stripeSubscription.findUnique({
        where: { stripeSubscriptionId: invoice.subscription as string }
      });

      if (subscription) {
        await prisma.user.update({
          where: { id: subscription.userId },
          data: { subscriptionStatus: 'PAST_DUE' }
        });
      }
    }

    logger.info('Invoice payment failed - database updated', {
      invoiceId: invoice.id
    });
  } catch (error) {
    logger.error('Failed to update database for failed invoice payment:', error);
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  if (!stripe) {
    throw new PaymentError('Stripe not initialized');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    logger.error('Webhook signature verification failed:', error);
    throw new PaymentError('Invalid webhook signature');
  }
}

// Get Stripe instance (for direct usage if needed)
export function getStripeInstance(): Stripe | null {
  return stripe;
}

export default {
  initializeStripe,
  createPaymentIntent,
  createSubscription,
  createOrRetrieveCustomer,
  cancelSubscription,
  updateSubscription,
  retrieveSubscription,
  createPrice,
  createProduct,
  handleWebhookEvent,
  verifyWebhookSignature,
  getStripeInstance
};

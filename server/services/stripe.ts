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
  logPaymentOperation('Payment succeeded', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100
  });
  
  // TODO: Update database with successful payment
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  logPaymentOperation('Payment failed', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100
  });
  
  // TODO: Handle failed payment
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  logPaymentOperation('Subscription created via webhook', {
    subscriptionId: subscription.id,
    customerId: subscription.customer
  });
  
  // TODO: Update database with new subscription
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  logPaymentOperation('Subscription updated via webhook', {
    subscriptionId: subscription.id,
    status: subscription.status
  });
  
  // TODO: Update database with subscription changes
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  logPaymentOperation('Subscription deleted via webhook', {
    subscriptionId: subscription.id
  });
  
  // TODO: Update database to cancel subscription
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  logPaymentOperation('Invoice payment succeeded', {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription
  });
  
  // TODO: Update subscription status
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  logPaymentOperation('Invoice payment failed', {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription
  });
  
  // TODO: Handle failed payment, possibly suspend subscription
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

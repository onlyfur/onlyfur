import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

export interface PaymentIntentData {
  amount: number;
  currency: string;
  userId: string;
  tierId: string;
  metadata?: Record<string, string>;
}

export interface SubscriptionData {
  userId: string;
  tierId: string;
  priceId: string;
  trialDays?: number;
}

// Create payment intent for one-time subscription purchase
export const createSubscriptionPaymentIntent = async (data: PaymentIntentData) => {
  try {
    // Get user and tier details
    const [user, tier] = await Promise.all([
      prisma.user.findUnique({ where: { id: data.userId } }),
      prisma.platformSubscriptionTier.findUnique({ where: { id: data.tierId } })
    ]);

    if (!user || !tier) {
      throw new Error('User or subscription tier not found');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency.toLowerCase(),
      customer: user.stripeCustomerId || undefined,
      metadata: {
        userId: data.userId,
        tierId: data.tierId,
        type: 'subscription',
        tierName: tier.name,
        ...data.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
      description: `${tier.name} subscription for ${user.username}`,
    });

    // Log the payment intent creation
    await prisma.transaction.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        type: 'SUBSCRIPTION',
        status: 'PENDING',
        description: `Payment intent for ${tier.name} subscription`,
        stripeTransactionId: paymentIntent.id,
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw new Error(`Payment intent creation failed: ${error.message}`);
  }
};

// Create recurring subscription
export const createRecurringSubscription = async (data: SubscriptionData) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        metadata: {
          userId: user.id,
          username: user.username,
        },
      });
      
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: data.userId },
        data: { stripeCustomerId },
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: data.priceId }],
      trial_period_days: data.trialDays,
      metadata: {
        userId: data.userId,
        tierId: data.tierId,
      },
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
      status: subscription.status,
    };
  } catch (error) {
    console.error('Stripe subscription error:', error);
    throw new Error(`Subscription creation failed: ${error.message}`);
  }
};

// Confirm payment and update user subscription
export const confirmPaymentAndUpdateSubscription = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const { userId, tierId } = paymentIntent.metadata;
      
      if (!userId || !tierId) {
        throw new Error('Missing metadata in payment intent');
      }

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

      // Update user subscription
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: tierId,
          subscriptionStatus: 'ACTIVE',
          subscriptionValidUntil: endDate,
        },
        include: {
          platformSubscriptionTier: true,
        }
      });

      // Update transaction record
      await prisma.transaction.updateMany({
        where: {
          stripeTransactionId: paymentIntentId,
          status: 'PENDING',
        },
        data: {
          status: 'COMPLETED',
          description: `Subscription to ${tierId} tier - Payment confirmed`,
        },
      });

      // Send confirmation email (if email service is enabled)
      try {
        const emailService = await import('./email-notifications');
        await emailService.sendSubscriptionConfirmationEmail(updatedUser, updatedUser.platformSubscriptionTier);
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the payment confirmation if email fails
      }

      return {
        success: true,
        user: updatedUser,
        subscriptionTier: updatedUser.platformSubscriptionTier,
      };
    }
    
    return {
      success: false,
      status: paymentIntent.status,
      error: 'Payment not succeeded',
    };
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw new Error(`Payment confirmation failed: ${error.message}`);
  }
};

// Handle subscription status changes
export const handleSubscriptionStatusChange = async (subscription: Stripe.Subscription) => {
  try {
    const { userId } = subscription.metadata;
    
    if (!userId) {
      throw new Error('No userId in subscription metadata');
    }

    let subscriptionStatus: string;
    let subscriptionValidUntil: Date | null = null;

    switch (subscription.status) {
      case 'active':
        subscriptionStatus = 'ACTIVE';
        subscriptionValidUntil = new Date(subscription.current_period_end * 1000);
        break;
      case 'past_due':
        subscriptionStatus = 'PAST_DUE';
        subscriptionValidUntil = new Date(subscription.current_period_end * 1000);
        break;
      case 'canceled':
        subscriptionStatus = 'CANCELLED';
        break;
      case 'unpaid':
        subscriptionStatus = 'UNPAID';
        break;
      default:
        subscriptionStatus = 'CANCELLED';
    }

    // Update user subscription status
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus,
        subscriptionValidUntil,
        stripeSubscriptionId: subscription.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Subscription status change error:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeSubscriptionId: true, subscriptionValidUntil: true },
    });

    if (!user?.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    // Cancel at period end to allow access until current period expires
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update user record
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'CANCELLED',
        // Keep subscriptionValidUntil as is - user retains access until period end
      },
    });

    return {
      success: true,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      periodEnd: new Date(subscription.current_period_end * 1000),
    };
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw new Error(`Subscription cancellation failed: ${error.message}`);
  }
};

// Get subscription details
export const getSubscriptionDetails = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { platformSubscriptionTier: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let stripeSubscription = null;
    if (user.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      } catch (error) {
        console.error('Error retrieving Stripe subscription:', error);
      }
    }

    return {
      user: {
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionValidUntil: user.subscriptionValidUntil,
        platformSubscriptionTier: user.platformSubscriptionTier,
      },
      stripeSubscription,
    };
  } catch (error) {
    console.error('Get subscription details error:', error);
    throw error;
  }
};

// Handle webhook events
export const handleStripeWebhook = async (event: Stripe.Event) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await confirmPaymentAndUpdateSubscription(event.data.object.id);
        break;
        
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle payment failure
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionStatusChange(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_succeeded':
        // Handle successful recurring payment
        console.log('Invoice payment succeeded:', event.data.object.id);
        break;
        
      case 'invoice.payment_failed':
        // Handle failed recurring payment
        console.log('Invoice payment failed:', event.data.object.id);
        break;
        
      default:
        console.log('Unhandled event type:', event.type);
    }
    
    return { received: true };
  } catch (error) {
    console.error('Webhook handling error:', error);
    throw error;
  }
};

// Create Stripe price for subscription tier
export const createStripePrice = async (tierId: string) => {
  try {
    const tier = await prisma.platformSubscriptionTier.findUnique({
      where: { id: tierId }
    });

    if (!tier) {
      throw new Error('Subscription tier not found');
    }

    // Create product first
    const product = await stripe.products.create({
      name: `${tier.name} Subscription`,
      description: tier.description,
      metadata: {
        tierId: tier.id,
        platform: 'onlyfur',
      },
    });

    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(tier.price), // Ensure integer cents
      currency: tier.currency.toLowerCase(),
      recurring: {
        interval: tier.billingPeriod === 'YEARLY' ? 'year' : 'month',
      },
      metadata: {
        tierId: tier.id,
        tierLevel: tier.level,
      },
    });

    // Update tier with Stripe price ID
    await prisma.platformSubscriptionTier.update({
      where: { id: tierId },
      data: { stripePriceId: price.id },
    });

    return {
      productId: product.id,
      priceId: price.id,
    };
  } catch (error) {
    console.error('Create Stripe price error:', error);
    throw error;
  }
};

export default {
  stripe,
  createSubscriptionPaymentIntent,
  createRecurringSubscription,
  confirmPaymentAndUpdateSubscription,
  handleSubscriptionStatusChange,
  cancelSubscription,
  getSubscriptionDetails,
  handleStripeWebhook,
  createStripePrice,
};

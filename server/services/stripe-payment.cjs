const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key');
const { prisma } = require('../app.cjs');

// Create payment intent for subscription
const createSubscriptionPayment = async (userId, tierId) => {
  try {
    // Get tier details
    const tier = await prisma.platformSubscriptionTier.findUnique({
      where: { id: tierId }
    });

    if (!tier) {
      throw new Error('Subscription tier not found');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: tier.price, // Amount in cents
      currency: tier.currency.toLowerCase(),
      metadata: {
        userId,
        tierId,
        type: 'subscription'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw error;
  }
};

// Confirm payment and update subscription
const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const { userId, tierId } = paymentIntent.metadata;
      
      // Update user subscription
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: tierId,
          subscriptionStatus: 'ACTIVE',
          subscriptionValidUntil: endDate
        }
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          amount: paymentIntent.amount,
          type: 'SUBSCRIPTION',
          status: 'COMPLETED',
          description: `Subscription to ${tierId} tier`,
          stripeTransactionId: paymentIntentId
        }
      });

      return { success: true, user: updatedUser };
    }
    
    return { success: false, status: paymentIntent.status };
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw error;
  }
};

// Handle Stripe webhooks
const handleWebhook = async (event) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await confirmPayment(event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
};

module.exports = {
  createSubscriptionPayment,
  confirmPayment,
  handleWebhook,
  stripe
};

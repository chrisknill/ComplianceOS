import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    stripePriceId: null,
    features: [
      '1 user',
      '10 documents',
      '20 risk assessments',
      'Basic training matrix',
      'Community support',
    ],
    limits: {
      maxUsers: 1,
      maxDocuments: 10,
      maxRisks: 20,
      maxIncidents: 50,
    },
  },
  STARTER: {
    name: 'Starter',
    price: 29,
    stripePriceId: 'price_starter_monthly', // Replace with actual Stripe price ID
    features: [
      '5 users',
      '100 documents',
      'Unlimited risk assessments',
      'Full training matrix',
      'Email reminders',
      'CSV export',
      'Email support',
    ],
    limits: {
      maxUsers: 5,
      maxDocuments: 100,
      maxRisks: -1, // unlimited
      maxIncidents: -1,
    },
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 99,
    stripePriceId: 'price_professional_monthly',
    features: [
      '25 users',
      'Unlimited documents',
      'Unlimited risk assessments',
      'Advanced training matrix',
      'Email reminders',
      'PDF & CSV export',
      'File uploads',
      'Approval workflows',
      'Priority support',
    ],
    limits: {
      maxUsers: 25,
      maxDocuments: -1,
      maxRisks: -1,
      maxIncidents: -1,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 299,
    stripePriceId: 'price_enterprise_monthly',
    features: [
      'Unlimited users',
      'Unlimited everything',
      'All features',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Custom branding',
    ],
    limits: {
      maxUsers: -1,
      maxDocuments: -1,
      maxRisks: -1,
      maxIncidents: -1,
    },
  },
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
  })

  return session
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}


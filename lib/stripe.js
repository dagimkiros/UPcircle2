import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

// Format amount for Stripe (converts dollars to cents)
export function toStripeAmount(dollars) {
  return Math.round(dollars * 100)
}

// Format amount from Stripe (converts cents to dollars)
export function fromStripeAmount(cents) {
  return cents / 100
}

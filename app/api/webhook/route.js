import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export const config = {
  api: { bodyParser: false }
}

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Webhook signature error:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { userId, circleId, amount, circleName } = session.metadata

    try {
      // Record contribution in Supabase
      const { error: contribError } = await supabase
        .from('contributions')
        .insert({
          user_id: userId,
          circle_id: circleId,
          amount: parseFloat(amount),
          payment_method: 'stripe',
          stripe_session_id: session.id,
          status: 'completed',
        })

      if (contribError) throw contribError

      // Update member payment status
      await supabase
        .from('circle_members')
        .update({ payment_status: 'current' })
        .eq('user_id', userId)
        .eq('circle_id', circleId)

      // Update trust score — reward on-time payment
      const { data: profile } = await supabase
        .from('profiles')
        .select('trust_score')
        .eq('id', userId)
        .single()

      if (profile) {
        const newScore = Math.min(100, (profile.trust_score || 70) + 2)
        await supabase
          .from('profiles')
          .update({ trust_score: newScore })
          .eq('id', userId)
      }

      console.log(`✅ Payment recorded: ${userId} → ${circleName} — $${amount}`)

    } catch (error) {
      console.error('Error recording payment:', error)
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
    }
  }

  // Handle failed payment
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object
    const { userId, circleId } = session.metadata
    console.log(`⚠️ Payment expired: ${userId} → circle ${circleId}`)
  }

  return NextResponse.json({ received: true })
}

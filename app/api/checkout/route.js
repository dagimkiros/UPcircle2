import { NextResponse } from 'next/server'
import { stripe, toStripeAmount } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { circleId, amount, circleName } = await request.json()

    if (!circleId || !amount || !circleName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: toStripeAmount(amount),
            product_data: {
              name: `UpCircle Contribution — ${circleName}`,
              description: `Monthly contribution to your savings circle`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: profile?.email || user.email,
      metadata: {
        userId: user.id,
        circleId,
        amount: amount.toString(),
        circleName,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/circles/${circleId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/circles/${circleId}?payment=cancelled`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const priceId = formData.get('priceId') as string

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 })
    }

    const checkoutSession = await createCheckoutSession(
      session.user.id,
      priceId,
      `${process.env.NEXTAUTH_URL}/subscription/success`,
      `${process.env.NEXTAUTH_URL}/subscription`
    )

    return NextResponse.redirect(checkoutSession.url!)
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}


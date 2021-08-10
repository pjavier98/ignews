import {NextApiRequest, NextApiResponse} from "next";
import { getSession } from "next-auth/client";

import {stripe} from "../../services/stripe";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    const productId = 'price_1JMbx1Dh7PKaD9JlU8bPQxiv'

    const session = await getSession({ req: request })

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: productId, quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return response.status(201).json({ sessionId: stripeCheckoutSession.id });
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Method not allowed')
  }
}

import {NextApiRequest, NextApiResponse} from "next";
import { getSession } from "next-auth/client";

import {stripe} from "../../../services/stripe";
import {getUserByEmail, updateUser} from "../_lib/faunaDB/collections/usersQueries";

export default async function Subscribe(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const productId = 'price_1JMbx1Dh7PKaD9JlU8bPQxiv'

    const session = await getSession({ req: request })

    const user = await getUserByEmail(session.user.email)

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      })

      await updateUser({
        userRefId: user.ref.id,
        data: {
          stripe_customer_id: stripeCustomer.id
        }
      })

      customerId = stripeCustomer.id
    }


    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
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

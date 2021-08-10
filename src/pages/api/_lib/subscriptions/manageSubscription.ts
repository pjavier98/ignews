import {getUserByStripeCustomerId} from "../faunaDB/collections/usersQueries";
import {stripe} from "../../../../services/stripe";
import {createSubscription, updateSubscription} from "../faunaDB/collections/subscriptionsQueries";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  const userRef = await getUserByStripeCustomerId(customerId)

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  if (createAction) {
    await createSubscription({
      data: subscriptionData
    })
  } else {
    await updateSubscription({
      data: subscriptionData
    })
  }
}

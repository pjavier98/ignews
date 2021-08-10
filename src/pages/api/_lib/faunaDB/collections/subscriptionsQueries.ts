import {query as q} from "faunadb";
import {fauna} from "../../../../../services/fauna";
import {UserRef} from "./usersQueries";

type SubscriptionRef = {
  ref: {
    id: string;
  }
}

type NewSubscription = {
  data: {
    id: string;
    userId: UserRef;
    status: string;
    price_id: string;
  }
}

export const createSubscription = ({ data }: NewSubscription): Promise<void> => {
  return fauna.query(
    q.If(
      q.Not(
        q.Exists(
          q.Match(
            q.Index('subscription_by_id'),
            data.id
          ),
        ),
      ),
      q.Create(
        q.Collection('subscriptions'),
        { data }
      ),
      q.Get(
        q.Match(
          q.Index('subscription_by_id'),
          data.id
        )
      )
    )

  )
}

export const getSubscriptionById = (subscriptionId: string): Promise<SubscriptionRef> => {
  return fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('subscription_by_id'),
          subscriptionId
        )
      )
    )
  )
}

export const updateSubscription = async ({ data }: NewSubscription): Promise<void> => {
  const subscription = await getSubscriptionById(data.id)

  return fauna.query(
    q.Replace(
      subscription.ref.id,
      { data }
    )
  )
}

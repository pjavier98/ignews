import {query as q} from "faunadb";
import {fauna} from "../../../../../services/fauna";

type User = {
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
}

type UpdateUser = {
  userRefId: string;
  data: any;
}

export type UserRef = Pick<User, 'ref'>

export const createUserIfNotExists = async (email: string): Promise<void> => {
  await fauna.query(
    q.If(
      q.Not(
        q.Exists(
          q.Match(
            q.Index('user_by_email'),
            q.Casefold(email)
          ),
        ),
      ),
      q.Create(
        q.Collection('users'),
        { data: { email } }
      ),
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(email),
        )
      )
    )
  )
}

export const getUserByEmail = (email: string): Promise<User> => {
  return fauna.query<User>(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        q.Casefold(email)
      )
    )
  )
}

export const getUserByStripeCustomerId = (customerId: string): Promise<UserRef> => {
  return fauna.query<UserRef>(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )
}

export const updateUser = async ({ userRefId, data }: UpdateUser): Promise<void> => {
  await fauna.query(
    q.Update(
      q.Ref(q.Collection('users'), userRefId),
      {
        data
      }
    )
  )
}

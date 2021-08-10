import {query as q} from "faunadb";
import {fauna} from "../../../../../services/fauna";
import {UserRef} from "./usersQueries";

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
    q.Create(
      q.Collection('subscriptions'),
      { data }
    )
  )
}

import { signIn, useSession } from "next-auth/client";

import styles from './styles.module.scss';
import {api} from "../../services/api";
import {getStripeJS} from "../../services/stripe-js";
import {useRouter} from "next/router";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      await signIn('github')
      return
    }

    if (!session.activeSubscription) {
      await router.push('/posts')
      return;
    }

    try {
      const response = await api.post('/stripe/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJS()

      await stripe.redirectToCheckout({ sessionId })
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={() => handleSubscribe()}
    >
      Subscribe now
    </button>
  );
}


import {loadStripe} from "@stripe/stripe-js/pure";

export const getStripeJS = () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)


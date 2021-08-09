import { GetServerSideProps } from 'next'

import Head from 'next/head'
import Image from 'next/image'
import { SubscribeButton } from "../components/SubscribeButton";

import avatar from '../../public/images/avatar.svg'
import styles from '../styles/home.module.scss'
import {stripe} from "../services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>

    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br />
          <span>for ${product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.priceId}/>
      </section>

      <Image src={avatar} alt="girl coding" />
    </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const productId = 'price_1JMbx1Dh7PKaD9JlU8bPQxiv'

  const price = await stripe.prices.retrieve(productId)

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product
    }
  }
}

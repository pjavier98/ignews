import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import Head from "next/head";

import {getPost, SinglePostType} from "../api/_lib/prismic/queries";

import styles from './post.module.scss'

interface PostProps {
  post: SinglePostType
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>


      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content}}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({req})
  const {slug} = params

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const post = await getPost({
    req,
    slug: String(slug)
  })

  return {
    props: {
      post,
    }
  }
}

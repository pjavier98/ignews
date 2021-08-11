import Head from "next/head";
import {GetStaticPaths, GetStaticProps} from "next";
import Link from 'next/link'

import {getPostPreview, SinglePostType} from "../../api/_lib/prismic/queries";

import styles from '../post.module.scss'
import {useSession} from "next-auth/client";
import {useEffect} from "react";
import {useRouter} from "next/router";

interface PostPreviewProps {
  post: SinglePostType
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [post.slug, router, session])

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content}}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params}) => {
  const { slug } = params

  const post = await getPostPreview({
    slug: String(slug)
  })

  return {
    props: {
      post,
    },
    redirect: 60 * 60 // 1 hour
  }
}

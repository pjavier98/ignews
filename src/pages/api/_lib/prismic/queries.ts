import {getPrismicClient} from "../../../../services/prismic";
import Prismic from "@prismicio/client";
import {RichText} from "prismic-dom";
import {IncomingMessage} from "http";
import {NextApiRequestCookies} from "next/dist/next-server/server/api-utils";

export type PostType = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

export type SinglePostType = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export const getAllPosts = async (): Promise<PostType[]> => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }
  })

  return posts
}

type getPostProps = {
  req:  IncomingMessage & {cookies: NextApiRequestCookies};
  slug: string;
}

export const getPost = async ({ req, slug }: getPostProps): Promise<SinglePostType> => {
  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID('post', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }

  return post
}

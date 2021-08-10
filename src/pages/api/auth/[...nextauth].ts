import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna'
import { query as q } from 'faunadb';
import {createUserIfNotExists} from "../_lib/faunaDB/collections/usersQueries";

export default NextAuth({
  // jwt: {
  //   signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  // },
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await createUserIfNotExists(email)

        return true;
      } catch (e) {
        console.log(e)
        return false;
      }
    }
  }
})

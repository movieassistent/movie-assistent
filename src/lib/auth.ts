import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = await prisma.email.findUnique({
          where: { email: credentials.email },
          include: { user: true }
        })

        if (!email?.user || !email.user.password) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          email.user.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: email.user.id,
          email: email.email,
          name: email.user.name,
          role: email.user.role
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 Minuten in Sekunden
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  debug: false,
  secret: process.env.NEXTAUTH_SECRET
} 
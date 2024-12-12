import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Zuerst finden wir die verifizierte E-Mail
          const emailRecord = await prisma.email.findFirst({
            where: {
              email: credentials.email,
              verified: true
            },
            include: {
              user: true
            }
          })

          if (!emailRecord?.user) {
            return null
          }

          const user = emailRecord.user

          const passwordMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordMatch) {
            return null
          }

          // Stelle sicher, dass der Benutzer Einstellungen hat
          const userSettings = await prisma.userSettings.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              theme: 'movie assistent',
              sidebarPosition: 'links',
              startPage: 'dashboard',
              notifications: {
                email: false,
                push: false
              }
            },
            update: {} // Keine Aktualisierung, wenn Einstellungen existieren
          })

          // Hole alle E-Mails des Benutzers
          const userEmails = await prisma.email.findMany({
            where: {
              userId: user.id
            }
          })

          return {
            id: user.id,
            email: userEmails.find((email) => email.primary)?.email || userEmails[0].email,
            name: user.name,
            role: user.role
          }
        } finally {
          await prisma.$disconnect()
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 15 * 60 // 15 Minuten
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
    },
    async redirect({ url, baseUrl }) {
      // Wenn die URL nicht mit der baseUrl beginnt, zur baseUrl umleiten
      if (!url.startsWith(baseUrl)) {
        return baseUrl
      }

      // Für API-Routen keine Weiterleitung
      if (url.includes('/api/')) {
        return url
      }

      return url
    }
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/'
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { UserRole } from "@/generated/prisma"

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // No adapter needed for JWT strategy - reduces Edge Runtime issues
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        // Dynamic import to avoid Edge Runtime issues
        const prisma = (await import("@/lib/prisma")).default

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
          image: user.image,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google") {
        const prisma = (await import("@/lib/prisma")).default

        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (existingUser) {
            // Update existing user
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                image: user.image,
                emailVerified: new Date(),
                lastLogin: new Date(),
              },
            })
            // Set user id and role for JWT
            user.id = existingUser.id
            user.role = existingUser.role
          } else {
            // Create new user from Google OAuth
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                firstName: profile?.given_name || user.name?.split(' ')[0] || '',
                lastName: profile?.family_name || user.name?.split(' ').slice(1).join(' ') || '',
                image: user.image,
                emailVerified: new Date(),
                role: 'USER',
                lastLogin: new Date(),
              },
            })
            user.id = newUser.id
            user.role = newUser.role
          }
        } catch (error) {
          console.error('Error handling Google sign-in:', error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session.name
        token.email = session.email
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  events: {
    async signIn({ user, account }) {
      // Only update last login for non-Google users (Google handled in callback)
      if (account?.provider !== "google") {
        const prisma = (await import("@/lib/prisma")).default

        await prisma.user.update({
          where: { id: user.id! },
          data: { lastLogin: new Date() },
        })
      }
    },
  },
})

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type UserRole = "ADMIN" | "CUSTOMER";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-in-production",
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const DEMO_ACCOUNTS = [
          {
            id: "demo-admin",
            email: "admin@aquaflow.store",
            password: "admin123",
            name: "Admin User",
            role: "ADMIN" as const,
            image: null,
          },
          {
            id: "demo-customer",
            email: "customer@aquaflow.store",
            password: "customer123",
            name: "Jane Smith",
            role: "CUSTOMER" as const,
            image: null,
          },
        ];

        const demo = DEMO_ACCOUNTS.find(
          (a) => a.email === email && a.password === password
        );
        if (demo) {
          return {
            id: demo.id,
            email: demo.email,
            name: demo.name,
            image: demo.image,
            role: demo.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user.role ?? "CUSTOMER") as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});

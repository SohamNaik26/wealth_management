import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const formData = new URLSearchParams();
          formData.append("username", credentials.email);
          formData.append("password", credentials.password);

          const response = await axios.post(
            "http://localhost:8000/auth/token",
            formData.toString(),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (response.status === 200) {
            // Return a user object that will be stored in the JWT token
            return {
              id: credentials.email,
              email: credentials.email,
              accessToken: response.data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
});

export { handler as GET, handler as POST };

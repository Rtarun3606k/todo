import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Initial sign in
      if (account && user) {
        console.log('Google Profile Data:', profile);
        
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          provider: account.provider,
          providerId: account.providerAccountId,
          googleId: profile?.sub,
          email: profile?.email,
          emailVerified: profile?.email_verified,
          name: profile?.name,
          picture: profile?.picture,
          givenName: profile?.given_name,
          familyName: profile?.family_name,
          locale: profile?.locale,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          googleId: token.googleId,
          provider: token.provider,
          providerId: token.providerId,
          emailVerified: token.emailVerified,
          givenName: token.givenName,
          familyName: token.familyName,
          locale: token.locale,
        },
        accessToken: token.accessToken,
      };
    },
    async signIn({ user, account, profile }) {
      console.log('Sign in successful:', {
        user: user.email,
        provider: account.provider
      });
      return true;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
});

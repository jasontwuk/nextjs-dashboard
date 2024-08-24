import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    // *** Note: use the pages option to specify the route for custom sign-in, sign-out, and error pages. This is not required, but by adding signIn: '/login' into our pages option, the user will be redirected to our custom login page, rather than the NextAuth.js default page.
    signIn: "/login",
  },
  // *** Note:
  // *** 1. The "authorized" callback is used to verify if the request is authorized to access a page via Next.js Middleware.
  // *** 2. It is called before a request is completed, and it receives an object with the "auth" and "request" properties.
  // *** 3. The "auth" property contains the user's session, and the "request" property contains the incoming request.
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

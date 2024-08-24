import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// *** Note: initializing NextAuth.js with the "authConfig" object and exporting the "auth" property.
export default NextAuth(authConfig).auth;

// *** Note: "matcher" allows you to filter Middleware to run on specific paths.

// *** Note: match all request paths except for the ones starting with:
// *** 1. api (API routes)
// *** 2. _next/static (static files)
// *** 3. _next/image (image optimization files)
// *** 4. .png (any png files)
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { sql } from "@vercel/postgres";
import type { User } from "@/app/lib/definitions";

import bcryptjs from "bcryptjs";

// *** Note: queries the user from the database.
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // *** Note: the "providers" option is an array where you list different login options (eg. Google, GitHub or credentials provider).
  providers: [
    Credentials({
      // *** Note: use the authorize function to handle the authentication logic
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcryptjs.compare(
            password,
            user.password
          );
          // *** Note: if the passwords match you want to return the user, otherwise, return null
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");

        return null;
      },
    }),
  ],
});

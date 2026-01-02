//smart-resume\app\api\auth\[...nextauth]\route.ts

import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // basic sanity check
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // ensure DB connection (using your connectDB helper)
        await connectDB();

        // find user using Mongoose User model (normalize email)
        const email = credentials.email.toLowerCase().trim();
        const user = await User.findOne({ email });

        // not found
        if (!user) return null;

        // compare hashed passwords
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // return the object NextAuth expects (id must be string)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username || user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login", // your custom login page route
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
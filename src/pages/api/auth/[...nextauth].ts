import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoose from "mongoose";
import { dbConnect } from "../../../lib/middlewares/withDb";

// Make sure the db is connected before a user tries to login
(async () => {
  await dbConnect();
})();

export default NextAuth({
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        name: "mail.elevatedsoftware.dev",
        auth: {
          user: process.env.SMTP_EMAIL_USER,
          pass: process.env.SMTP_EMAIL_PW,
        },
      },
      from: process.env.STMP_EMAIL_FROM,
      // Email is valid for 2hrs
      maxAge: 60 * 60 * 2,
    }),
  ],
  adapter: MongoDBAdapter(
    new Promise((resolve, _) => resolve(mongoose.connection.getClient() as any))
  ),
  secret: process.env.EMAIL_SECRET,
  callbacks: {
    session({ session, user }) {
      session.user.userId = user.id;
      return session;
    },
  },
});

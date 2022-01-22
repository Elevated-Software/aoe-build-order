import NextAuth from 'next-auth';
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import mongoose from 'mongoose';
import { dbConnect } from '../../../lib/middlewares/withDb';

// Make sure the db is connected before a user tries to login
(async () => {
  await dbConnect();
})();

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.SMTP_SERVER,
      from: process.env.FROM_EMAIL,
      // Email is valid for 2hrs
      maxAge: 60 * 60 * 2,
    }),
  ],
  adapter: MongoDBAdapter(new Promise((resolve, reject) => resolve(mongoose.connection.getClient() as any))),
  secret: process.env.EMAIL_SECRET,
});

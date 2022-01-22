import NextAuth from 'next-auth';
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import mongoose from 'mongoose';
import { dbConnect } from '../../../lib/middleware/withDb';

// Make sure the db is connected before a user tries to login
(async () => {
  await dbConnect();
})();

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.SMTP_SERVER,
      from: process.env.FROM_EMAIL,
    }),
  ],
  adapter: MongoDBAdapter(new Promise((resolve, reject) => resolve(mongoose.connection.getClient() as any))),
  secret: 'my last cat was named pink',
});

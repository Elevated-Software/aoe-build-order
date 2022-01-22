import mongoose from 'mongoose';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const dbConnect = async () => {
  if (mongoose.connection.readyState) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI!);
};

const withDb = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (mongoose.connection.readyState) {
    return handler(req, res);
  }

  await mongoose.connect(process.env.MONGODB_URI!);
  return handler(req, res);
};

export default withDb;

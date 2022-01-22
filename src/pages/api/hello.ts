// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import withDb from '../../lib/middlewares/withDb';
import withHandleErrors from '../../lib/middlewares/withErrorHandler';
import { IUserDoc, User } from '../../lib/models/database/User';

type Data = {
  user: IUserDoc | null;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const user = await User.findOne({ email: 'brennendavis@gmail.com' }).exec();
  res.status(200).json({ user });
};

export default withHandleErrors(withDb(handler));

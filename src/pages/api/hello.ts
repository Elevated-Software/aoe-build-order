// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import withDb from '../../lib/middlewares/withDb';
import withHandleErrors from '../../lib/middlewares/withErrorHandler';
import { BuildOrder, IBuildOrderDoc } from '../../lib/models/database/BuildOrder';
import { IUserDoc, User } from '../../lib/models/database/User';

type Data = {
  user: IBuildOrderDoc | null;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const buildOrder = await BuildOrder.findOne({ name: 'Test Build Order' }).exec();
  console.log(`from not populated ${buildOrder?.user}`);

  const populatedBuildOrder = await BuildOrder.findOne({ name: 'Test Build Order' }).populate<{ user: IUserDoc; }>('user').exec();
  console.log(`from populated ${populatedBuildOrder.user.email}`);

  res.status(200).json({ user: populatedBuildOrder });
};

export default withHandleErrors(withDb(handler));

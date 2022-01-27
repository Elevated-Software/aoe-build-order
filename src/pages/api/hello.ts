// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withDb, withHandleErrors } from '../../lib/middlewares';
import { BuildOrder, IBoStepDoc, IBuildOrderDoc, IUserDoc } from '../../lib/models/database';

type Data = {
  bo: IBuildOrderDoc | null;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const buildOrder = await BuildOrder.findOne({ name: 'Test Build Order' }).exec();
  console.log(`from not populated ${buildOrder?.user}`);

  const populatedBuildOrder = await BuildOrder.findOne({ name: 'Test Build Order' }).populate<{ user: IUserDoc; steps: IBoStepDoc[]; }>('user steps').exec();
  console.log(`from populated ${populatedBuildOrder.user.email}`);

  res.status(200).json({ bo: populatedBuildOrder });
};

export default withHandleErrors(withDb(handler));

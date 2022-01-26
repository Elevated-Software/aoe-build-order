import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { Civilization } from '../../../lib/consts';
import { withDb, withHandleErrors } from '../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../lib/models/api';
import { BuildOrder, IBoLineItemDoc, IBuildOrderDoc } from '../../../lib/models/database';

interface Data {
  buildOrders: LeanDocument<IBuildOrderDoc>[];
};

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      const buildOrders = await get();
      res.json({ success: true, buildOrders });
      break;
    case 'POST':
      const session = await getSession({ req });
      const { name, description, civilization } = req.body;
      if (!session) {
        throw new EsError('You must be logged in to create a build order', 401);
      }

      const buildOrder = await post({ name, userId: session.user.userId, description, civilization });
      res.status(201).json({ success: true, buildOrders: [buildOrder] });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      throw new EsError(`Method ${method} Not Allowed`, 405);
  }
};

const get = async () => {
  return await BuildOrder.find({}).populate<{ lineItems: IBoLineItemDoc[]; }>('lineItems').lean().exec();
};

interface PostOpts {
  name: string,
  userId: string,
  description: string,
  civilization: Civilization,
}
const post = async ({ name, userId, description, civilization }: PostOpts) => {
  return await BuildOrder.create({
    name,
    user: userId,
    description,
    civilization
  });
};

export default withHandleErrors(withDb(handler));

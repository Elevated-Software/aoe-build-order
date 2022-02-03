import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { Civilization, Errors } from '../../../lib/consts';
import { withDb, withHandleErrors } from '../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../lib/models/api';
import { BuildOrder, IBoStepDoc, IBuildOrderDoc } from '../../../lib/models/database';
import { ensureLoggedIn } from '../../../lib/utils/api';

interface Data {
  buildOrders: LeanDocument<IBuildOrderDoc>[] | LeanDocument<IBuildOrderDoc>;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      const buildOrders = await get();
      res.json({ success: true, buildOrders });
      break;
    case 'POST':
      const session = await ensureLoggedIn(req);

      const { name, description, civilization } = req.body;
      const buildOrder = await post({ name, userId: session.user.userId, description, civilization });
      res.status(201).json({ success: true, buildOrders: buildOrder });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
  }
};

const get = async () => {
  return await BuildOrder.find({}).populate<{ steps: IBoStepDoc[]; }>('steps').lean().exec();
};

interface PostOpts {
  name: string,
  userId: string,
  description: string,
  civilization: Civilization,
}
const post = async ({ name, userId, description, civilization }: PostOpts) => {
  let buildOrder = new BuildOrder({
    name,
    user: userId,
    description,
    civilization
  });

  buildOrder = await buildOrder.save();
  return buildOrder.toObject();
};

export default withHandleErrors(withDb(handler));
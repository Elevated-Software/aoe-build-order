import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { Civilization } from '../../../lib/consts';
import { withDb, withHandleErrors } from '../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../lib/models/api';
import { BuildOrder, IBoLineItemDoc, IBuildOrderDoc } from '../../../lib/models/database';

interface Data {
  buildOrder: LeanDocument<IBuildOrderDoc>;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const {
    method,
    query: { id: boId }
  } = req;

  let buildOrder: LeanDocument<IBuildOrderDoc>;
  switch (method) {
    case 'GET':
      buildOrder = await get(boId as string);
      break;
    case 'PUT':
      const session = await getSession({ req });
      if (!session) {
        throw new EsError('You must be logged in to create a build order', 401);
      }

      const { name, description, civilization } = req.body;
      buildOrder = await put({ id: boId as string, name, userId: session.user.userId, description, civilization });
      break;
    default: {
      res.setHeader('Allow', ['GET']);
      throw new EsError(`Method ${method} Not Allowed`, 405);
    };
  }

  res.json({ success: true, buildOrder });
};

const get = async (boId: string) => {
  return await BuildOrder.findById(boId).populate<{ lineItems: IBoLineItemDoc[]; }>('lineItems').lean().exec();
};

interface PutOpts {
  id: string,
  name: string,
  userId: string,
  description: string,
  civilization: Civilization,
}
const put = async ({ id, name, userId, description, civilization }: PutOpts) => {
  return await BuildOrder.findByIdAndUpdate(
    id,
    { name, userId, description, civilization },
    { new: true })
    .populate<{ lineItems: IBoLineItemDoc[]; }>('lineItems').lean().exec();
};

export default withHandleErrors(withDb(handler));

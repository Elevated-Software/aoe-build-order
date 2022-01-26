import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { withDb, withHandleErrors } from '../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../lib/models/api';
import { BuildOrder, IBoLineItemDoc, IBuildOrderDoc } from '../../../lib/models/database';

interface Data {
  buildOrders: LeanDocument<IBuildOrderDoc>;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const {
    method,
    query: { id: boId }
  } = req;

  switch (method) {
    case 'GET': {
      const buildOrders = await get(boId as string);
      res.json({ success: true, buildOrders });
    }
    default: {
      res.setHeader('Allow', ['GET']);
      throw new EsError(`Method ${method} Not Allowed`, 405);
    };
  }
};

const get = async (boId: string) => {
  return await BuildOrder.findById(boId).populate<{ lineItems: IBoLineItemDoc[]; }>('lineItems').lean().exec();
};

export default withHandleErrors(withDb(handler));

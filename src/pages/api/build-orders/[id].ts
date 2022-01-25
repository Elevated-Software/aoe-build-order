import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { withDb, withHandleErrors } from '../../../lib/middlewares';
import { EsApiResponse } from '../../../lib/models/api';
import { BuildOrder, IBoLineItemDoc, IBuildOrderDoc } from '../../../lib/models/database';

interface Data {
  buildOrders: LeanDocument<IBuildOrderDoc>;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const { id: boId } = req.query;
  switch (req.method) {
    case 'GET': {
      const buildOrders = await get(boId as string);
      res.json({ success: true, buildOrders });
    }
    default: break;
  }
};

const get = async (boId: string) => {
  return await BuildOrder.findById(boId).populate<{ lineItems: IBoLineItemDoc[]; }>('lineItems').lean().exec();
};

export default withHandleErrors(withDb(handler));

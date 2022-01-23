// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withDb, withHandleErrors } from '../../../lib/middlewares';
import { EsApiResponse } from '../../../lib/models/api';
import { BuildOrder, IBoLineItemDoc, IBuildOrderDoc } from '../../../lib/models/database';

interface Data {
  buildOrders: LeanDocument<IBuildOrderDoc>[];
};

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  switch (req.method) {
    case 'GET': {
      const buildOrders = await get();
      res.json({ success: true, buildOrders });
    }
    default: break;
  }
};

const get = async () => {
  return await BuildOrder.find({}).populate<{ lineItems: IBoLineItemDoc[]; }>('lineItems').lean().exec();
};

export default withHandleErrors(withDb(handler));

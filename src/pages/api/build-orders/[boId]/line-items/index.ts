import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { withDb, withHandleErrors } from '../../../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../../../lib/models/api';
import { BoLineItem, BuildOrder, IBoLineItemDoc, IBuildOrderDoc } from '../../../../../lib/models/database';

interface Data {
  buildOrder: LeanDocument<IBuildOrderDoc>;
}

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const {
    method,
    query: { boId },
  } = req;

  switch (method) {
    case 'POST':
      const session = await getSession({ req });
      if (!session) {
        throw new EsError('You must be logged in to create a build order step', 401);
      }

      const { lineNumber, gameTime, population, food, wood, gold, stone, description } = req.body;
      const buildOrder = await post({ boId: boId as string, lineNumber, gameTime, population, food, wood, gold, stone, description });
      res.status(201).json({ success: true, buildOrder });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      throw new EsError(`Method ${method} Not Allowed`, 405);
  }
};

interface PostOpts {
  boId: string;
  lineNumber: number;
  gameTime: string;
  population: number;
  food: number;
  wood: number;
  gold: number;
  stone: number;
  description: string;
}
const post = async ({ boId, lineNumber, gameTime, population, food, wood, gold, stone, description }: PostOpts) => {
  const boLineItem = await BoLineItem.create({
    lineNumber,
    gameTime,
    population,
    food,
    wood,
    gold,
    stone,
    description,
  });

  return await BuildOrder.findByIdAndUpdate(
    boId,
    { $push: { lineItems: boLineItem } },
    { returnDocument: 'after' })
    .populate<{ lineItems: IBoLineItemDoc[]; }>('lineItems').lean().exec();
};

export default withHandleErrors(withDb(handler));

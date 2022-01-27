import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { withDb, withHandleErrors } from '../../../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../../../lib/models/api';
import { BoStep, BuildOrder, IBoStep, IBoStepDoc, IBuildOrderDoc } from '../../../../../lib/models/database';

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

      const { stepNumber, gameTime, population, food, wood, gold, stone, description } = req.body;
      const buildOrder = await post({ boId: boId as string, stepNumber, gameTime, population, food, wood, gold, stone, description });
      res.status(201).json({ success: true, buildOrder });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      throw new EsError(`Method ${method} Not Allowed`, 405);
  }
};

interface PostOpts extends IBoStep {
  boId: string;
}
const post = async ({ boId, stepNumber, gameTime, population, food, wood, gold, stone, description }: PostOpts) => {
  const boStep = await BoStep.create({
    stepNumber,
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
    { $push: { steps: boStep } },
    { returnDocument: 'after' })
    .populate<{ steps: IBoStepDoc[]; }>('steps').lean().exec();
};

export default withHandleErrors(withDb(handler));

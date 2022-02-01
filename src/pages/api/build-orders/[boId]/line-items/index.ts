import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { Errors } from '../../../../../lib/consts';
import { withDb, withHandleErrors } from '../../../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../../../lib/models/api';
import { BoStep, BuildOrder, IBoStep, IBoStepDoc, IBuildOrderDoc } from '../../../../../lib/models/database';
import { ensureLoggedIn } from '../../../../../lib/utils/api';

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
      await ensureLoggedIn(req);

      const { stepNumber, gameTime, population, food, wood, gold, stone, description } = req.body;
      const buildOrder = await post({ boId: boId as string, stepNumber, gameTime, population, food, wood, gold, stone, description });
      res.status(201).json({ success: true, buildOrder });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
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

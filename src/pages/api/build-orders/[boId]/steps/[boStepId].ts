import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { Errors } from '../../../../../lib/consts';
import { withDb, withHandleErrors } from '../../../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../../../lib/models/api';
import { BoStep, BuildOrder, IBoStep, IBoStepDoc, IBuildOrderDoc } from '../../../../../lib/models/database';
import { ensureLoggedIn } from '../../../../../lib/utils/api';
import { toObjectId } from '../../../../../lib/utils/database';

interface Data {
  buildOrder?: LeanDocument<IBuildOrderDoc>;
}

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const session = await ensureLoggedIn(req);
  const {
    method,
    query: {
      boId,
      boStepId,
    }
  } = req;


  switch (method) {
    case 'PUT':
      const { stepNumber, gameTime, population, food, wood, gold, stone, description } = req.body;
      const buildOrder = await put({ id: boStepId as string, boId: boId as string, userId: session.user.userId, stepNumber, gameTime, population, food, wood, gold, stone, description });
      res.json({ success: true, buildOrder });
      break;
    case 'DELETE':
      await deleteBoStep({ id: boStepId as string, boId: boId as string, userId: session.user.userId });
      res.json({ success: true });
      break;
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
  }
};

interface PutOpts extends IBoStep {
  id: string;
  boId: string;
  userId: string;
}
const put = async ({ id, boId, userId, stepNumber, gameTime, population, food, wood, gold, stone, description }: PutOpts) => {
  const boStep = await BoStep.findById(id).exec();
  if (!boStep) {
    throw new EsError(Errors.notFound('Build Order Step'), 404);
  }

  const objectIdUserId = toObjectId(userId);
  if (!objectIdUserId) {
    throw new EsError(Errors.notFound('User'), 404);
  }

  let buildOrder = await BuildOrder.findById(boId).lean().exec();
  if (!buildOrder) {
    throw new EsError(Errors.notFound('Build Order'), 404);
  }
  if (buildOrder.user.toString() !== userId) {
    throw new EsError(Errors.noPermission, 403);
  }

  boStep.stepNumber = stepNumber;
  boStep.gameTime = gameTime;
  boStep.population = population;
  boStep.food = food;
  boStep.wood = wood;
  boStep.gold = gold;
  boStep.stone = stone;
  boStep.description = description;

  await boStep.save();
  buildOrder = await BuildOrder.findById(boId).populate<{ steps: IBoStepDoc[]; }>('steps').lean().exec();
  return buildOrder;
};

interface DeleteOpts {
  id: string;
  boId: string;
  userId: string;
}
const deleteBoStep = async ({ id, boId, userId }: DeleteOpts) => {
  const buildOrder = await BuildOrder.findById(boId).exec();
  if (!buildOrder) {
    throw new EsError(Errors.notFound('Build Order'), 404);
  }

  if (buildOrder.user.toString() !== userId) {
    throw new EsError(Errors.noPermission, 403);
  }

  await BoStep.deleteOne({ _id: id }).exec();
};

export default withHandleErrors(withDb(handler));
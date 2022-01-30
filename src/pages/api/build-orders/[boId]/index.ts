import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { Civilization } from '../../../../lib/consts';
import { withDb, withHandleErrors } from '../../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../../lib/models/api';
import { BuildOrder, IBoStepDoc, IBuildOrderDoc } from '../../../../lib/models/database';
import { ensureLoggedIn } from '../../../../lib/utils/api';
import { toObjectId } from '../../../../lib/utils/database';

interface Data {
  buildOrder?: LeanDocument<IBuildOrderDoc>;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const {
    method,
    query: { boId },
  } = req;

  let buildOrder: LeanDocument<IBuildOrderDoc>;
  switch (method) {
    case 'GET':
      buildOrder = await get(boId as string);
      break;
    case 'PUT': {
      const session = await ensureLoggedIn(req, 'You must be logged in to update a Build Order');
      const { name, description, civilization } = req.body;
      buildOrder = await put({ id: boId as string, name, userId: session.user.userId, description, civilization });
      break;
    }
    case 'DELETE': {
      const session = await ensureLoggedIn(req, 'You must be logged in to delete a Build Order');
      await deleteAction({ id: boId as string, userId: session.user.userId, });
      res.json({ success: true });
    }
    default: {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      throw new EsError(`Method ${method} Not Allowed`, 405);
    };
  }

  res.json({ success: true, buildOrder });
};

const get = async (boId: string) => {
  return await BuildOrder.findById(boId).populate<{ steps: IBoStepDoc[]; }>('steps').lean().exec();
};

interface PutOpts {
  id: string;
  name: string;
  userId: string;
  description: string;
  civilization: Civilization;
}
const put = async ({ id, name, userId, description, civilization }: PutOpts) => {
  const buildOrder = await BuildOrder.findById(id).populate<{ steps: IBoStepDoc[]; }>('steps').exec();
  if (!buildOrder) {
    throw new EsError(`Build Order with ID ${id} not found`, 404);
  }

  if (buildOrder.user.toString() !== userId) {
    throw new EsError(`You don't have permission to edit this Build Order`, 403);
  }

  const objectIdUserId = toObjectId(userId);
  if (!objectIdUserId) {
    throw new EsError(`User does not exist`, 404);
  }

  buildOrder.name = name;
  buildOrder.user = objectIdUserId as any;
  buildOrder.description = description;
  buildOrder.civilization = civilization;
  return await buildOrder.save();
};

interface DeleteOpts {
  id: string;
  userId: string;
}
const deleteAction = async ({ id, userId }: DeleteOpts) => {
  const buildOrder = await BuildOrder.findById(id).exec();
  if (!buildOrder) {
    throw new EsError(`Build Order with ID ${id} not found`, 404);
  }

  if (buildOrder.user.toString() !== userId) {
    throw new EsError(`You don't have permission to delete this Build Order`, 403);
  }

  await buildOrder.delete();
};

export default withHandleErrors(withDb(handler));

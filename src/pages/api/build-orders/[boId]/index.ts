import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { Civilization, Errors, Tag } from '../../../../lib/consts';
import { withDb, withHandleErrors } from '../../../../lib/middlewares';
import { withObjectIdQueryParam } from '../../../../lib/middlewares/withObjectIdQueryParam';
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
      const session = await ensureLoggedIn(req);
      const { name, description, civilization, youtube, tags, patch } = req.body;
      buildOrder = await put({ id: boId as string, name, userId: session.user.userId, description, civilization, youtube, tags, patch });
      break;
    }
    case 'DELETE': {
      const session = await ensureLoggedIn(req);
      await deleteAction({ id: boId as string, userId: session.user.userId });
      res.json({ success: true });
      return;
    }
    default: {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
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
  youtube?: string;
  tags?: Tag[];
  patch?: string;
}
const put = async ({ id, name, userId, description, civilization, youtube, tags, patch }: PutOpts) => {
  let buildOrder = await BuildOrder.findById(id).populate<{ steps: IBoStepDoc[]; }>('steps').exec();
  if (!buildOrder) {
    throw new EsError(Errors.notFound('Build Order'), 404);
  }

  const objectIdUserId = toObjectId(userId);
  if (!objectIdUserId) {
    throw new EsError(Errors.notFound('User'), 404);
  }

  if (buildOrder.user.toString() !== userId) {
    throw new EsError(Errors.noPermission, 403);
  }

  buildOrder.name = name;
  buildOrder.description = description;
  buildOrder.civilization = civilization;
  buildOrder.youtube = youtube;
  buildOrder.tags = tags || [];
  buildOrder.patch = patch;
  buildOrder = await buildOrder.save();
  return buildOrder.toObject();
};

interface DeleteOpts {
  id: string;
  userId: string;
}
const deleteAction = async ({ id, userId }: DeleteOpts) => {
  const buildOrder = await BuildOrder.findById(id).exec();
  if (!buildOrder) {
    throw new EsError(Errors.notFound('Build Order'), 404);
  }

  if (buildOrder.user.toString() !== userId) {
    throw new EsError(Errors.noPermission, 403);
  }

  await buildOrder.delete();
};

export default withHandleErrors(withDb(withObjectIdQueryParam(handler, 'boId')));

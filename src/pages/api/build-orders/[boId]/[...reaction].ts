import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { Errors } from '../../../../lib/consts';
import { withDb, withHandleErrors } from '../../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../../lib/models/api';
import { BuildOrder, IBoStepDoc, IBuildOrderDoc } from '../../../../lib/models/database';
import { ensureLoggedIn } from '../../../../lib/utils/api';
import { toObjectId } from '../../../../lib/utils/database';

interface Data {
  buildOrder?: LeanDocument<IBuildOrderDoc>;
};

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const session = await ensureLoggedIn(req);
  const {
    method,
    query: { boId, reaction, direction },
  } = req;


  if (reaction.length === 0 || !(reaction.includes('like') || reaction.includes('dislike'))) {
    res.redirect('/');
    return;
  }

  if (!direction || !(direction === 'up' || direction === 'down')) {
    throw new EsError(Errors.badRequest);
  }

  const likeOrDislike: 'like' | 'dislike' = reaction[0] as 'like' | 'dislike';
  let buildOrder: LeanDocument<IBuildOrderDoc>;
  switch (method) {
    case 'POST':
      buildOrder = await post(session.user.userId, boId as string, likeOrDislike, direction as string);
      break;
    default: {
      res.setHeader('Allow', ['POST']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
    };
  }

  res.json({ success: true, buildOrder });
};

const post = async (userId: string, id: string, reaction: 'like' | 'dislike', direction: string) => {
  let buildOrder = await BuildOrder.findById(id).populate<{ steps: IBoStepDoc[]; }>('steps').exec();
  if (buildOrder.user.toString() !== userId) {
    throw new EsError(Errors.noPermission, 403);
  }

  const userObjectId = toObjectId(userId);
  if (!userObjectId) {
    throw new EsError(Errors.notFound('User'), 404);
  }

  const shortReaction = reaction === 'like' ? 'l' : 'd';
  if (direction === 'up') {
    buildOrder.reactions.push({ reaction: shortReaction, userId: userObjectId as any });
    buildOrder.reactionCounts[shortReaction]++;
  } else {
    buildOrder.reactions.filter(reaction => reaction.userId.toString() !== userObjectId.toString());
    buildOrder.reactionCounts[shortReaction]--;
  }

  buildOrder = await buildOrder.save();
  return buildOrder.toObject();
};

export default withHandleErrors(withDb(handler));

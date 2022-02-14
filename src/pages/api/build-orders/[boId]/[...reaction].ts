import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { Errors } from '../../../../lib/consts';
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
      buildOrder = await post(session.user.userId, boId as string, likeOrDislike, direction);
      break;
    default: {
      res.setHeader('Allow', ['POST']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
    };
  }

  res.json({ success: true, buildOrder });
};

const post = async (userId: string, id: string, reaction: 'like' | 'dislike', direction: 'up' | 'down') => {
  let buildOrder = await BuildOrder.findById(id).populate<{ steps: IBoStepDoc[]; }>('steps').exec();
  if (!buildOrder) {
    throw new EsError(Errors.notFound('Build Order'), 404);
  }

  const userObjectId = toObjectId(userId);
  if (!userObjectId) {
    throw new EsError(Errors.notFound('User'), 404);
  }

  const shortReaction = reaction === 'like' ? 'l' : 'd';
  const userReaction = buildOrder.reactions.find(reaction => reaction.userId.toString() === userId);
  if (direction === 'up') {
    if (userReaction) {
      throw new EsError(Errors.alreadyReacted, 403);
    }

    buildOrder.reactions.push({ reaction: shortReaction, userId: userObjectId as any });
    buildOrder.reactionCounts[shortReaction] += 1;
  } else if (direction === 'down' && userReaction) {
    if (userReaction.reaction !== shortReaction) {
      throw new EsError(Errors.alreadyReacted, 403);
    }

    buildOrder.reactions = buildOrder.reactions.filter(reaction => reaction.userId.toString() !== userId);
    if (buildOrder.reactionCounts[shortReaction] > 0) {
      buildOrder.reactionCounts[shortReaction] -= 1;
    }
  }

  buildOrder = await buildOrder.save();
  return buildOrder.toObject();
};

export default withHandleErrors(withDb(withObjectIdQueryParam(handler, 'boId')));

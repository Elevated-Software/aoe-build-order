import { FilterQuery, LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';
import { Civilization, codeToCiv, codeToTag, Errors, PAGE_LIMIT, Tag } from '../../../lib/consts';
import { withDb, withHandleErrors } from '../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../lib/models/api';
import { BuildOrder, IBoStepDoc, IBuildOrderDoc } from '../../../lib/models/database';
import { ensureLoggedIn } from '../../../lib/utils/api';

interface Data {
  pagesCount?: number;
  page?: number;
  size?: number;
  buildOrders: LeanDocument<IBuildOrderDoc>[] | LeanDocument<IBuildOrderDoc>;
};

interface QueryParams {
  page: number;
  tags: string;
  civ: string;
}

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const { method, query } = req;

  switch (method) {
    case 'GET': {
      const { page, tags, civ } = getQueryParams(query);

      const tagList: Tag[] = [];
      if (tags) {
        if (tags?.includes(',')) {
          const tagStrings = tags.split(',');
          for (const tag of tagStrings) {
            tagList.push(codeToTag[tag]);
          }
        } else {
          tagList.push(codeToTag[tags]);
        }
      }

      const { pagesCount, page: retPage, size, buildOrders } = await get(page, tagList, codeToCiv[civ]);
      res.json({ success: true, pagesCount, page: retPage, size, buildOrders });
      break;
    }
    case 'POST': {
      const session = await ensureLoggedIn(req);

      const { name, description, civilization, youtube, tags, patch } = req.body;
      if (!name || !description || !civilization) {
        throw new EsError(Errors.badRequest, 400);
      }

      const buildOrder = await post({ name, userId: session.user.userId, description, civilization, youtube, tags, patch });
      res.status(201).json({ success: true, buildOrders: buildOrder });
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
  }
};

const getQueryParams = (query: NextApiRequestQuery): QueryParams => {
  return { page: parseInt(query.page as string), tags: (query.tags as string), civ: (query.civ as string) };
};

const get = async (page: number, tags: Tag[], civ: Civilization) => {
  if (!page) {
    page = 1;
  }
  const skip = (page - 1) * PAGE_LIMIT;

  const query: FilterQuery<IBuildOrderDoc> = {};
  if (tags?.length > 0) {
    query.tags = { $all: tags };
  }
  if (civ) {
    query.civ = civ;
  }

  const buildOrderCount = await BuildOrder.find(query).countDocuments().exec();
  const pagesCount = Math.ceil(buildOrderCount / PAGE_LIMIT);

  const buildOrders = await BuildOrder.find(query).select('name description civilization tags reactionCounts').limit(PAGE_LIMIT).skip(skip).lean().exec();
  return { pagesCount, page, size: PAGE_LIMIT, buildOrders };
};

interface PostOpts {
  name: string;
  userId: string;
  description: string;
  civilization: Civilization;
  youtube?: string;
  tags?: Tag[];
  patch?: string;
}
const post = async ({ name, userId, description, civilization, youtube, tags, patch }: PostOpts) => {
  let buildOrder = new BuildOrder({
    name,
    user: userId,
    description,
    civilization,
    tags,
    youtube,
    patch,
  });

  buildOrder = await buildOrder.save();
  return buildOrder.toObject();
};

export default withHandleErrors(withDb(handler));

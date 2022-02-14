import { isValidObjectId } from 'mongoose';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Errors } from '../consts/errors';
import { EsError } from '../models/api';

const idNameToUserFriendly = {
  boId: 'Build Order',
  boStepId: 'Build Order Step',
};

export const withObjectIdQueryParam = (handler: NextApiHandler, ...checkTheseIds: Array<'boId' | 'boStepId'>) => async (req: NextApiRequest, res: NextApiResponse) => {
  for (const idName of checkTheseIds) {
    if (Object.keys(req.query).includes(idName) && !isValidObjectId(req.query[idName])) {
      throw new EsError(Errors.notFound(idNameToUserFriendly[idName]), 404);
    }
  }

  return handler(req, res);
};

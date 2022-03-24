import { NextApiRequest } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { Errors } from '../consts';
import { EsError } from '../models/api';

export const ensureLoggedIn = async (req: NextApiRequest): Promise<Session> => {
  const session = await getSession({ req });
  if (!session) {
    throw new EsError(Errors.mustBeLoggedIn, 401);
  }

  return session;
};

export const queryParamToEnumTag = (param: string) => {
  return param.toUpperCase().replace(/ /g, '_');
};

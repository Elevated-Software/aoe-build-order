import { NextApiRequest } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { EsError } from '../models/api';

export const ensureLoggedIn = async (req: NextApiRequest, errorMessage: string): Promise<Session> => {
  const session = await getSession({ req });
  if (!session) {
    throw new EsError(errorMessage, 401);
  }

  return session;
};

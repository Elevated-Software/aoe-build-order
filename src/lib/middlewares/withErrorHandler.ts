
import { NextApiHandler, NextApiRequest } from 'next';
import { EsApiResponse } from '../models/api';

interface EsError {
  code: number;
  message: string;
}

// https://github.com/zeit/micro#error-handling
export const withHandleErrors = (fn: NextApiHandler) => async (req: NextApiRequest, res: EsApiResponse<EsError>) => {
  try {
    return await fn(req, res);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }
    const code = (err as any).code || 500;
    const message = (err as any).message || 'Oops, something went wrong!';
    res.status(code).json({ success: false, code, message });
  }
};

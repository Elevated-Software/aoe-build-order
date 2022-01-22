
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

// https://github.com/zeit/micro#error-handling
const handleErrors = (fn: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    return await fn(req, res);
  } catch (err) {
    const statusCode = (err as any).statusCode || 500;
    const message = (err as any).message || 'Oops, something went wrong!';
    res.status(statusCode).json({ statusCode, message });
  }
};

export default handleErrors;
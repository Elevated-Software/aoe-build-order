import type { NextApiHandler, NextApiRequest } from 'next';
import { Errors } from '../../../../../lib/consts';
import { withDb, withHandleErrors } from '../../../../../lib/middlewares';
import { EsApiResponse, EsError } from '../../../../../lib/models/api';

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse) => {
  const {
    method,
    query: {
      boId,
      boLineItemId,
    }
  } = req;


  switch (method) {
    case 'PUT': break;
    case 'DELETE': break;
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
  }
};

export default withHandleErrors(withDb(handler));

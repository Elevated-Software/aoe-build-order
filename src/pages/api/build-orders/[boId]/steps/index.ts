import { LeanDocument } from 'mongoose';
import type { NextApiHandler, NextApiRequest } from 'next';
import { Errors } from '../../../../../lib/consts';
import { withDb, withHandleErrors } from '../../../../../lib/middlewares';
import { withObjectIdQueryParam } from '../../../../../lib/middlewares/withObjectIdQueryParam';
import { EsApiResponse, EsError } from '../../../../../lib/models/api';
import { BoStep, BuildOrder, IBoStep, IBoStepDoc, IBuildOrderDoc } from '../../../../../lib/models/database';
import { ensureLoggedIn } from '../../../../../lib/utils/api';

interface Data {
  buildOrder: LeanDocument<IBuildOrderDoc & { _id: any; } & { steps: IBoStepDoc[]; }>;
}

const handler: NextApiHandler = async (req: NextApiRequest, res: EsApiResponse<Data>) => {
  const {
    method,
    query: { boId },
    body: { steps },
  } = req;

  switch (method) {
    case 'POST':
      await ensureLoggedIn(req);

      const buildOrder = await post({ boId: boId as string, steps });
      res.status(201).json({ success: true, buildOrder });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      throw new EsError(Errors.methodNotAllowed(method as string), 405);
  }
};

interface PostOpts {
  boId: string;
  steps: IBoStep[];
}
const post = async ({ boId, steps }: PostOpts) => {
  const boSteps = await BoStep.create(steps);

  const buildOrder = await BuildOrder.findByIdAndUpdate(
    boId,
    { steps: boSteps },
    { new: true })
    .populate<{ steps: IBoStepDoc[]; }>('steps').lean().exec();

  if (!buildOrder) {
    throw new EsError(Errors.notFound('Build Order'), 404);
  }

  return buildOrder;
};

export default withHandleErrors(withDb(withObjectIdQueryParam(handler, 'boId')));

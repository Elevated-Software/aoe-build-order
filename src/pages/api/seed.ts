import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import withDb from '../../lib/middlewares/withDb';
import withHandleErrors from '../../lib/middlewares/withErrorHandler';
import { BoLineItem } from '../../lib/models/database/BoLineItem';
import { BuildOrder } from '../../lib/models/database/BuildOrder';
import { IUserDoc, User } from '../../lib/models/database/User';


const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<void>) => {
  const user = await User.findOne({ email: 'brennendavis@gmail.com' }).exec();
  if (!user) {
    throw new Error('No User Found');
  }

  const boLineItem = await BoLineItem.create({ lineNumber: 1 });
  const buildOrder = await BuildOrder.create({
    name: 'Test Build Order',
    user: user._id,
    lineItems: [boLineItem._id],
  });

  res.status(201).send();
};

export default withHandleErrors(withDb(handler));

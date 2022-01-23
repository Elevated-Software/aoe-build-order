import { ObjectId } from 'mongoose';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withDb, withHandleErrors } from '../../lib/middlewares';
import { BoLineItem, BuildOrder, User } from '../../lib/models/database';
import { getRandomInt } from '../../lib/utils/numbers';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<void>) => {
  await BuildOrder.deleteMany();
  await BoLineItem.deleteMany();

  const user = await User.findOne({ email: 'brennendavis@gmail.com' }).exec();
  if (!user) {
    throw new Error('No User Found');
  }

  const boLineItemIds: ObjectId[] = [];
  for (let i = 1; i <= 5; i++) {
    const boLineItem = await BoLineItem.create({
      lineNumber: i,
      gameTime: `${getRandomInt((0 + i) * i, 2 * i)}:${getRandomInt(0, 60)}`,
      population: getRandomInt((0 + i * i) * i, 10 * i),
      food: getRandomInt((0 + i) * i, 50 * i),
      wood: getRandomInt((0 + i) * i, 50 * i),
      gold: getRandomInt((0 + i) * i, 50 * i),
      stone: getRandomInt((0 + i) * i, 50 * i),
      description: `This is description ${i}`,
    });
    boLineItemIds.push(boLineItem._id);
  }

  await BuildOrder.create({
    name: 'Test Build Order',
    user: user._id,
    lineItems: boLineItemIds,
  });

  res.status(201).send();
};

export default withHandleErrors(withDb(handler));

import { ObjectId } from 'mongoose';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Civilization } from '../../lib/consts';
import { withDb, withHandleErrors } from '../../lib/middlewares';
import { BoStep, BuildOrder, User } from '../../lib/models/database';
import { getRandomInt } from '../../lib/utils/numbers';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<void>) => {
  await BuildOrder.deleteMany();
  await BoStep.deleteMany();

  const user = await User.findOne({ email: 'brennendavis@gmail.com' }).exec();
  if (!user) {
    throw new Error('No User Found');
  }

  const boStepIds: ObjectId[] = [];
  for (let i = 1; i <= 5; i++) {
    const boLineItem = await BoStep.create({
      stepNumber: i,
      gameTime: `${getRandomInt((0 + i) * i, 2 * i)}:${getRandomInt(0, 60)}`,
      population: getRandomInt((0 + i * i) * i, 10 * i),
      food: getRandomInt((0 + i) * i, 50 * i),
      wood: getRandomInt((0 + i) * i, 50 * i),
      gold: getRandomInt((0 + i) * i, 50 * i),
      stone: getRandomInt((0 + i) * i, 50 * i),
      description: `This is description ${i}`,
    });
    boStepIds.push(boLineItem._id);
  }

  await BuildOrder.create({
    name: 'Test Build Order',
    user: user._id,
    description: 'Ram Archer Rush',
    civilization: Civilization.DELHI_SULTANATE,
    steps: boStepIds,
  });

  res.status(201).send();
};

export default withHandleErrors(withDb(handler));

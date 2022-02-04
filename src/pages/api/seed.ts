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

  for (let j = 0; j < 3; j++) {
    const boStepIds: ObjectId[] = [];
    for (let i = 1; i <= 5; i++) {
      const boLineItem = await BoStep.create({
        stepNumber: i,
        gameTime: `${getRandomInt((0 + i) * i, 2 * i)}:${getRandomInt(0, 60)}`,
        population: getRandomInt((0 + i * i) * i, 10 * i),
        food: getRandomInt((0 + i) * i, 10 * i),
        wood: getRandomInt((0 + i) * i, 10 * i),
        gold: getRandomInt((0 + i) * i, 10 * i),
        stone: getRandomInt((0 + i) * i, 10 * i),
        description: `This is description ${i} attached to Build Order ${j} it might actually be a bit longer than this because people like to write things`,
      });
      boStepIds.push(boLineItem._id);
    }

    await BuildOrder.create({
      name: `Test Build Order ${j}`,
      user: user._id,
      description: 'Ram Archer Rush actually this is the super long description that would tell people about the build and what it\'s good for and bad against and stuff now i\'m just saying words',
      civilization: Civilization.DELHI_SULTANATE,
      steps: boStepIds,
    });
  }

  res.status(201).send();
};

export default withHandleErrors(withDb(handler));

import { ObjectId } from 'mongoose';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Civilization, Tag } from '../../lib/consts';
import { withDb, withHandleErrors } from '../../lib/middlewares';
import { BoStep, BuildOrder, User } from '../../lib/models/database';
import { getRandomInt } from '../../lib/utils/numbers';

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse<void>) => {
  // await BuildOrder.deleteMany();
  // await BoStep.deleteMany();

  // const user = await User.findOne({ email: 'brennendavis@gmail.com' }).exec();
  // if (!user) {
  //   throw new Error('No User Found');
  // }

  // const civs = [Civilization.ABBASID_DYNASTY, Civilization.CHINESE, Civilization.DELHI_SULTANATE, Civilization.ENGLISH, Civilization.FRENCH, Civilization.HOLY_ROMAN_EMPIRE, Civilization.MONGOLS, Civilization.RUS];

  // for (let j = 0; j < 10; j++) {
  //   const boStepIds: ObjectId[] = [];
  //   for (let i = 1; i <= 20; i++) {
  //     const boLineItem = await BoStep.create({
  //       gameTime: `${getRandomInt((0 + i) * i, 2 * i)}${getRandomInt((0 + i) * i, 2 * i)}:${getRandomInt(0, 9)}${getRandomInt(0, 9)}`,
  //       population: getRandomInt((0 + i * i) * i, 10 * i),
  //       food: getRandomInt((0 + i) * i, 10 * i),
  //       wood: getRandomInt((0 + i) * i, 10 * i),
  //       gold: getRandomInt((0 + i) * i, 10 * i),
  //       stone: getRandomInt((0 + i) * i, 10 * i),
  //       description: `This is description ${i} attached to Build Order ${j} it might actually be a bit longer than this because people like to write things`,
  //     });
  //     boStepIds.push(boLineItem._id);
  //   }

  //   const tags = [
  //     [],
  //     [Tag.CHEESE],
  //     [Tag.CHEESE, Tag.RUSH],
  //     [Tag.CHEESE, Tag.RUSH, Tag.BOOM, Tag.FAST_CASTLE],
  //     [Tag.CHEESE, Tag.RUSH, Tag.BOOM, Tag.FAST_FEUDAL, Tag.FAST_CASTLE, Tag.LAND, Tag.WATER],
  //   ];
  //   const civ = civs[getRandomInt(0, 8)];
  //   console.log(civ);
  //   await BuildOrder.create({
  //     name: `Test Build Order ${j}`,
  //     user: user._id,
  //     description: 'Ram Archer Rush actually this is the super long description that would tell people about the build and what it\'s good for and bad against and stuff now i\'m just saying words but this does need to be longer so that I can get three lines on the main page',
  //     civilization: civ,
  //     tags: tags[j],
  //     patch: '11963',
  //     youtube: 'https://www.youtube.com/embed/mO3aX06hmlc',
  //     steps: boStepIds,
  //     reactionCounts: {
  //       l: getRandomInt(0, 15),
  //       d: getRandomInt(0, 15),
  //     },
  //     reactionLimitReached: false,
  //     reactions: [{
  //       reaction: 'l',
  //       userId: user._id
  //     }]
  //   });
  // }

  res.status(201).send();
};

export default withHandleErrors(withDb(handler));

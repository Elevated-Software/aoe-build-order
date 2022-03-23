import mongoose, { Document, Model, model, Schema } from 'mongoose';
import { BuildOrder } from '.';
import { gameTimeRegex, STEP_DESCRIPTION_MAX_LENGTH } from '../../consts';

export interface IBoStep {
  gameTime: string,
  population: number,
  food: number,
  wood: number,
  gold: number,
  stone: number,
  description: string,
}

export interface IBoStepDoc extends IBoStep, Document { };

const BoStepSchemaFields: Record<keyof IBoStep, any> = {
  gameTime: {
    type: String,
    match: [gameTimeRegex, 'Game time must be in the format 0:00 or 00:00'],
  },
  population: Number,
  food: Number,
  wood: Number,
  gold: Number,
  stone: Number,
  description: {
    type: String,
    required: true,
    maxLength: STEP_DESCRIPTION_MAX_LENGTH,
  },
};
const BoStepSchema = new Schema(BoStepSchemaFields);

BoStepSchema.post('findOneAndDelete', async function (doc) {
  await BuildOrder.findOneAndUpdate({ steps: { $in: [doc._id] } }, { $pull: { steps: doc._id } }).exec();
});

export const BoStep: Model<IBoStepDoc> = mongoose.models.BoStep || model<IBoStepDoc>('BoStep', BoStepSchema);

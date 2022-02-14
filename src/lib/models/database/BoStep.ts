import mongoose, { Document, Model, model, Schema } from 'mongoose';
import { BuildOrder } from '.';

export interface IBoStep {
  stepNumber: number;
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
  stepNumber: {
    type: Number,
    require: true,
  },
  gameTime: String,
  population: Number,
  food: Number,
  wood: Number,
  gold: Number,
  stone: Number,
  description: {
    type: String,
    require: true,
  },
};
const BoStepSchema = new Schema(BoStepSchemaFields);

BoStepSchema.post('findOneAndDelete', async function (doc) {
  await BuildOrder.findOneAndUpdate({ steps: { $in: [doc._id] } }, { $pull: { steps: doc._id } }).exec();
});

export const BoStep: Model<IBoStepDoc> = mongoose.models.BoStep || model<IBoStepDoc>('BoStep', BoStepSchema);

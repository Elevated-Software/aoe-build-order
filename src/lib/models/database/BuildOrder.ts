import mongoose, { Document, Model, model, ObjectId, Schema } from 'mongoose';
import { Civilization, Tag } from '../../consts';
import { IBoStepDoc } from './BoStep';
import { IUserDoc } from './User';

export interface IBuildOrder {
  name: string;
  description: string;
  user: ObjectId | IUserDoc;
  civilization: Civilization;
  tags: Tag[];
  patch: string;
  youtube: string;
  steps: ObjectId[] | IBoStepDoc[];
}

export interface IBuildOrderDoc extends IBuildOrder, Document { };

const BuildOrderSchemaFields: Record<keyof IBuildOrder, any> = {
  name: {
    type: String,
    require: true,
  },
  description: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  civilization: {
    type: String,
    enum: Civilization,
    require: true,
  },
  tags: [{
    type: String,
    enum: Tag,
    default: [],
  }],
  patch: String,
  youtube: String,
  steps: [{
    type: Schema.Types.ObjectId,
    ref: 'BoStep',
    default: [],
  }],
};
const BuildOrderSchema = new Schema(BuildOrderSchemaFields, { timestamps: true });

export const BuildOrder: Model<IBuildOrderDoc> = mongoose.models.BuildOrder || model<IBuildOrderDoc>('BuildOrder', BuildOrderSchema);

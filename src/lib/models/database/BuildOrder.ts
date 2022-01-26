import mongoose, { Document, Model, model, ObjectId, Schema } from 'mongoose';
import { Civilization } from '../../consts';
import { IBoLineItemDoc } from './BoLineItem';
import { IUserDoc } from './User';

interface IBuildOrder {
  name: string;
  description: string;
  user: ObjectId | IUserDoc;
  civilization: string;
  lineItems: ObjectId[] | IBoLineItemDoc[];
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
  lineItems: [{
    type: Schema.Types.ObjectId,
    ref: 'BoLineItem',
    default: [],
  }],
};
const BuildOrderSchema = new Schema(BuildOrderSchemaFields);

export const BuildOrder: Model<IBuildOrderDoc> = mongoose.models.BuildOrder || model<IBuildOrderDoc>('BuildOrder', BuildOrderSchema);

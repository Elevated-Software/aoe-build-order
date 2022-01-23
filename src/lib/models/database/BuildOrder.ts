import mongoose, { Document, Model, model, ObjectId, Schema } from 'mongoose';
import { IBoLineItemDoc } from './BoLineItem';
import { IUserDoc } from './User';

interface IBuildOrder {
  name: string;
  user: ObjectId | IUserDoc;
  lineItems: ObjectId[] | IBoLineItemDoc[];
}

export interface IBuildOrderDoc extends IBuildOrder, Document { };

const BuildOrderSchemaFields: Record<keyof IBuildOrder, any> = {
  name: {
    type: String,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

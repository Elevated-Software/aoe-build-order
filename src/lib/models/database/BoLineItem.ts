import mongoose, { Document, Model, model, Schema } from 'mongoose';

interface IBoLineItem {
  lineNumber: number;
}

export interface IBoLineItemDoc extends IBoLineItem, Document { };

const BoLineItemSchemaFields: Record<keyof IBoLineItem, any> = {
  lineNumber: {
    type: Number,
    require: true,
  }
};
const BoLineItemSchema = new Schema(BoLineItemSchemaFields);

export const BoLineItem: Model<IBoLineItemDoc> = mongoose.models.BoLineItem || model<IBoLineItemDoc>('BoLineItem', BoLineItemSchema);

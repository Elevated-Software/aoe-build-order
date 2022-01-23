import mongoose, { Document, Model, model, Schema } from 'mongoose';

interface IBoLineItem {
  lineNumber: number;
  gameTime: string,
  population: number,
  food: number,
  wood: number,
  gold: number,
  stone: number,
  description: string,
}

export interface IBoLineItemDoc extends IBoLineItem, Document { };

const BoLineItemSchemaFields: Record<keyof IBoLineItem, any> = {
  lineNumber: {
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
const BoLineItemSchema = new Schema(BoLineItemSchemaFields);

export const BoLineItem: Model<IBoLineItemDoc> = mongoose.models.BoLineItem || model<IBoLineItemDoc>('BoLineItem', BoLineItemSchema);

import mongoose, { Document, Model, model, ObjectId, Schema, SchemaTimestampsConfig } from 'mongoose';
import { BO_DESCRIPTION_MAX_LENGTH, BO_NAME_MAX_LENGTH, Civilization, Tag } from '../../consts';
import { IBoStepDoc } from './BoStep';
import { IUserDoc } from './User';
const wilsonScore = require('wilson-score-rank');

const REACTION_LIMIT = 1000;

export interface IBuildOrder {
  name: string;
  description: string;
  user: ObjectId | IUserDoc;
  civilization: Civilization;
  tags: Tag[];
  patch?: string;
  youtube?: string;
  steps: ObjectId[] | IBoStepDoc[];
  wilsonScore: number;
  reactionCounts: { l: number, d: number; };
  reactionLimitReached: boolean,
  reactions: { reaction: 'l' | 'd', userId: ObjectId; }[];
}

export interface IBuildOrderDoc extends IBuildOrder, Document, SchemaTimestampsConfig { };

const BuildOrderSchemaFields: Record<keyof IBuildOrder, any> = {
  name: {
    type: String,
    required: true,
    maxLength: BO_NAME_MAX_LENGTH,
  },
  description: {
    type: String,
    maxLength: BO_DESCRIPTION_MAX_LENGTH,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  civilization: {
    type: String,
    enum: Civilization,
    required: true,
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
  wilsonScore: { type: Number, required: true, default: 0 },
  reactionCounts: {
    l: { type: Number, default: 0 },
    d: { type: Number, default: 0 },
  },
  reactionLimitReached: { type: Boolean, default: false },
  reactions: [{
    reaction: String,
    userId: Schema.Types.ObjectId,
  }]
};
const BuildOrderSchema = new Schema(BuildOrderSchemaFields, { timestamps: true });

BuildOrderSchema.pre('save', function (next) {
  if (this.isModified('reactionCounts')) {
    this.wilsonScore = wilsonScore.lowerBound(this.reactionCounts.l, this.reactionCounts.l + this.reactionCounts.d);
    if (!this.reactionLimitReached && (this.reactionCounts.l + this.reactionCounts.d) >= REACTION_LIMIT) {
      this.reactionLimitReached = true;
    }
  }

  next();
});

export const BuildOrder: Model<IBuildOrderDoc> = mongoose.models.BuildOrder || model<IBuildOrderDoc>('BuildOrder', BuildOrderSchema);

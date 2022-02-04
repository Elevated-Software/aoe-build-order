import { ObjectId } from 'mongodb';
import { LeanDocument } from 'mongoose';
import { IBoStepDoc, IBuildOrderDoc } from '../database';

export * from './EsApiResponse';
export * from './EsError';

export type BoWithPopulatedSteps = LeanDocument<IBuildOrderDoc & { _id: any; } & { steps: IBoStepDoc[]; }>;
export type Bo = LeanDocument<IBuildOrderDoc & { _id: any; } & { steps: ObjectId[]; }>;

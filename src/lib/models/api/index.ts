import { LeanDocument } from 'mongoose';
import { IBoStepDoc, IBuildOrderDoc } from '../database';

export * from './EsApiResponse';
export * from './EsError';

export interface BoWithPopulatedSteps {
  buildOrder: LeanDocument<IBuildOrderDoc & { _id: any; } & { steps: IBoStepDoc[]; }>;
}

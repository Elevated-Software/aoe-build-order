import { ObjectId } from 'mongodb';
import { LeanDocument } from 'mongoose';
import { Civilization, Tag } from '../../consts';
import { IBoStepDoc, IBuildOrderDoc } from '../database';

export * from './EsApiResponse';
export * from './EsError';

export type BoWithPopulatedSteps = LeanDocument<IBuildOrderDoc & { _id: any; } & { steps: IBoStepDoc[]; } & { updatedAt: string; }>;
export type Bo = LeanDocument<IBuildOrderDoc & { _id: any; } & { steps: ObjectId[]; } & { updatedAt: string; }>;
export type BoListItem = { _id: string; name: string; description: string; civilization: Civilization; tags: Tag[]; reactionCounts: { l: number; d: number; }; updatedAt: string; };

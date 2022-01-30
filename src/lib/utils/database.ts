import mongoose from 'mongoose';

export const toObjectId = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }

  return null;
};

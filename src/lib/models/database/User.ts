import mongoose, { Document, Model, model, Schema } from 'mongoose';

interface IUser {
  email: string;
  emailVerified: Date;
}

export interface IUserDoc extends IUser, Document { };

const UserSchemaFields: Record<keyof IUser, any> = {
  email: {
    type: String,
    unique: true,
  },
  emailVerified: Date,
};
const UserSchema = new Schema(UserSchemaFields);

export const User: Model<IUserDoc> = mongoose.models.User || model<IUserDoc>('User', UserSchema);

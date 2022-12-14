import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  image?: string;
  role: string;
  subscribers: number;
  subscribedUsers: string[];
  discordUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'editor', 'admin'],
      default: 'user',
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
    },
    discordUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserModel>('User', UserSchema);

import mongoose, { Document, Model } from 'mongoose';
import { IUserModel } from './User';

export interface IArticle {
  title: string;
  description: string;
  image?: string;
  user: IUserModel['_id'];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IArticleModel extends IArticle, Document {}

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IArticleModel>('Article', articleSchema);

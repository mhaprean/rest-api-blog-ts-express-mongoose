import mongoose, { Document, Model } from 'mongoose';
import { IUserModel } from './User';

export interface IArticle {
  title: string;
  description: string;
  image?: string;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags: string[];
  category: string;
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
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Tag',
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IArticleModel>('Article', articleSchema);

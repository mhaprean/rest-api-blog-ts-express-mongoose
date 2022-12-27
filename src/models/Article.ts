import mongoose, { Document, Model } from 'mongoose';
import { IUserModel } from './User';

export interface IArticle {
  title: string;
  description: string;
  image?: string;
  imageThumb?: string;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags: string[];
  category: string;
  likes: string[];
  _doc: Omit<this,'_doc'>; // try to do this in order to acces the _doc object
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
    imageThumb: {
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
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
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

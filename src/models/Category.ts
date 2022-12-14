import mongoose, { Document, Model } from 'mongoose';

export interface ICategory {
  title: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryModel extends ICategory, Document {}

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategoryModel>('category', categorySchema);

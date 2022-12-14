import mongoose, { Document, Model } from 'mongoose';

export interface ITag {
  title: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITagModel extends ITag, Document {}

const tagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    articles: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Article',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ITagModel>('Tag', tagSchema);

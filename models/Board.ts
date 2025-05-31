import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBoard extends Document {
  _id: Types.ObjectId;
  orgId: string;
  title: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageUserName: string;
  imageLinkHTML: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema({
  orgId: { type: String, required: true },
  title: { type: String, required: true },
  imageId: { type: String, required: true },
  imageThumbUrl: { type: String, required: true },
  imageFullUrl: { type: String, required: true },
  imageUserName: { type: String, required: true },
  imageLinkHTML: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema); 
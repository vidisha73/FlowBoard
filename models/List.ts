import mongoose, { Schema, Document } from 'mongoose';

export interface IList extends Document {
  title: string;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema: Schema = new Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  boardId: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.List || mongoose.model<IList>('List', ListSchema); 
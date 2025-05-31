import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description?: string;
  order: number;
  listId: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  order: { type: Number, required: true },
  listId: { type: String, required: true },
  boardId: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema); 
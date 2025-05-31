import mongoose, { Schema, Document } from 'mongoose';

export interface IOrgLimit extends Document {
  orgId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrgLimitSchema: Schema = new Schema({
  orgId: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
}, {
  timestamps: true
});

let OrgLimitModel: mongoose.Model<IOrgLimit>;

try {
  OrgLimitModel = mongoose.model<IOrgLimit>('OrgLimit');
} catch {
  OrgLimitModel = mongoose.model<IOrgLimit>('OrgLimit', OrgLimitSchema);
}

export default OrgLimitModel; 
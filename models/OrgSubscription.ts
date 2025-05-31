import mongoose, { Schema, Document } from 'mongoose';

export interface IOrgSubscription extends Document {
  orgId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrgSubscriptionSchema: Schema = new Schema({
  orgId: { type: String, required: true, unique: true },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  stripePriceId: { type: String },
  stripeCurrentPeriodEnd: { type: Date },
}, {
  timestamps: true
});

let OrgSubscriptionModel: mongoose.Model<IOrgSubscription>;

try {
  OrgSubscriptionModel = mongoose.model<IOrgSubscription>('OrgSubscription');
} catch {
  OrgSubscriptionModel = mongoose.model<IOrgSubscription>('OrgSubscription', OrgSubscriptionSchema);
}

export default OrgSubscriptionModel; 
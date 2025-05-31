import mongoose, { Schema, Document } from 'mongoose';

export enum ACTION {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export enum ENTITY_TYPE {
  BOARD = 'BOARD',
  LIST = 'LIST',
  CARD = 'CARD'
}

export interface IAuditLog extends Document {
  orgId: string;
  action: ACTION;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userId: string;
  userImage: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema: Schema = new Schema({
  orgId: { type: String, required: true },
  action: { type: String, enum: Object.values(ACTION), required: true },
  entityId: { type: String, required: true },
  entityType: { type: String, enum: Object.values(ENTITY_TYPE), required: true },
  entityTitle: { type: String, required: true },
  userId: { type: String, required: true },
  userImage: { type: String, required: true },
  userName: { type: String, required: true },
}, {
  timestamps: true
});

let AuditLogModel: mongoose.Model<IAuditLog>;

try {
  AuditLogModel = mongoose.model<IAuditLog>('AuditLog');
} catch {
  AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
}

export default AuditLogModel; 
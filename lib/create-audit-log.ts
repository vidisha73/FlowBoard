import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import AuditLog from "@/models/AuditLog";
import connectDB from "./mongodb";

export const createAuditLog = async (data: {
  orgId: string;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
  userId: string;
  userImage: string;
  userName: string;
}) => {
  try {
    await connectDB();
    const auditLog = await AuditLog.create(data);
    return auditLog;
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
    throw error;
  }
};

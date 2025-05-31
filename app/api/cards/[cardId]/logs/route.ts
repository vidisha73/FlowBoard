import { ENTITY_TYPE } from "@/models/AuditLog";
import AuditLog from "@/models/AuditLog";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { orgId } = auth();

    if (!orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const auditLogs = await AuditLog.find({
      orgId,
      entityId: params.cardId,
      entityType: ENTITY_TYPE.CARD,
    }).sort({ createdAt: "desc" });

    return NextResponse.json(auditLogs);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

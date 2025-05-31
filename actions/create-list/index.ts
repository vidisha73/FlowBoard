"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import List from "@/models/List";
import { createAuditLog } from "@/lib/create-audit-log";

export const createList = async (data: { title: string; boardId: string }) => {
  try {
    const { orgId, userId, sessionClaims } = auth();

    if (!orgId || !userId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const lastList = await List.findOne({ boardId: data.boardId })
      .sort({ order: -1 })
      .select('order');

    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = await List.create({
      title: data.title,
      boardId: data.boardId,
      order: newOrder,
      orgId,
    });

    await createAuditLog({
      orgId,
      entityId: list._id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: list.title,
      action: ACTION.CREATE,
      userId,
      userImage: (sessionClaims?.image as string) || "/placeholder.svg",
      userName: (sessionClaims?.name as string) || "User",
    });

    revalidatePath(`/board/${data.boardId}`);
    return list;
  } catch (error) {
    console.error("[CREATE_LIST_ERROR]", error);
    throw error;
  }
};

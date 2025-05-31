"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import List from "@/models/List";
import { createAuditLog } from "@/lib/create-audit-log";

export const updateList = async (data: { id: string; boardId: string; title: string }) => {
  try {
    const { orgId, userId, sessionClaims } = auth();

    if (!orgId || !userId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const list = await List.findOne({ _id: data.id });

    if (!list) {
      throw new Error("List not found");
    }

    const updatedList = await List.findByIdAndUpdate(
      data.id,
      { title: data.title },
      { new: true }
    );

    await createAuditLog({
      orgId,
      entityId: updatedList._id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: updatedList.title,
      action: ACTION.UPDATE,
      userId,
      userImage: sessionClaims?.image as string || "/placeholder.svg",
      userName: sessionClaims?.name as string || "User",
    });

    revalidatePath(`/board/${data.boardId}`);
    return JSON.parse(JSON.stringify(updatedList));
  } catch (error) {
    console.error("[UPDATE_LIST_ERROR]", error);
    throw error;
  }
};

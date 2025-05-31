"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import List from "@/models/List";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";

import { UpdateListOrder } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId, sessionClaims } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data;
  let lists;

  try {
    await connectDB();
    const updatePromises = items.map((list) =>
      List.findByIdAndUpdate(
        list.id,
        { order: list.order },
        { new: true }
      )
    );

    lists = await Promise.all(updatePromises);

    // Create audit log for each list update
    for (const list of lists) {
      await createAuditLog({
        orgId,
        entityId: list._id,
        entityType: ENTITY_TYPE.LIST,
        entityTitle: list.title,
        action: ACTION.UPDATE,
        userId,
        userImage: sessionClaims?.image as string || "/placeholder.svg",
        userName: sessionClaims?.name as string || "User",
      });
    }
  } catch (error) {
    return {
      error: "Failed to reorder.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);

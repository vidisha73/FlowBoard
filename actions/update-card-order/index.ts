"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";

import { UpdateCardOrder } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId, sessionClaims } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data;
  let updatedCards;

  try {
    await connectDB();
    const updatePromises = items.map((card) =>
      Card.findByIdAndUpdate(
        card.id,
        { 
          order: card.order,
          listId: card.listId
        },
        { new: true }
      )
    );

    updatedCards = await Promise.all(updatePromises);

    // Create audit log for each card update
    for (const card of updatedCards) {
      await createAuditLog({
        orgId,
        entityId: card._id,
        entityType: ENTITY_TYPE.CARD,
        entityTitle: card.title,
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
  return { data: updatedCards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);

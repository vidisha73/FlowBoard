"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { CardWithList } from "@/types";

type InputType = {
  id: string;
  boardId: string;
};

type ReturnType = ActionState<InputType, CardWithList>;

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  try {
    await connectDB();
    
    const card = await Card.findById(id);
    if (!card) {
      return {
        error: "Card not found",
      };
    }

    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return {
        error: "Failed to delete card",
      };
    }

    await createAuditLog({
      orgId,
      entityId: deletedCard._id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: deletedCard.title,
      action: ACTION.DELETE,
      userId,
      userImage: card.userImage || "/placeholder.svg",
      userName: card.userName || "User",
    });

    revalidatePath(`/board/${boardId}`);
    
    // Convert Mongoose document to plain object
    const plainCard = {
      id: deletedCard._id.toString(),
      title: deletedCard.title,
      description: deletedCard.description || "",
      order: deletedCard.order,
      listId: deletedCard.listId.toString(),
      boardId: deletedCard.boardId,
      createdAt: deletedCard.createdAt.toISOString(),
      updatedAt: deletedCard.updatedAt.toISOString(),
      list: {
        title: ""
      }
    };

    return { data: plainCard };
  } catch (error) {
    console.error("Delete card error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete",
    };
  }
};

export const deleteCard = createSafeAction(DeleteCard, handler);

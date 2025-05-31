"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";

import connectDB from "@/lib/mongodb";
import List from "@/models/List";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { ListWithCards } from "@/types";

type InputType = {
  id: string;
  boardId: string;
};

type ReturnType = ActionState<InputType, ListWithCards>;

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
    
    const list = await List.findById(id);
    if (!list) {
      return {
        error: "List not found",
      };
    }

    const deletedList = await List.findByIdAndDelete(id);
    if (!deletedList) {
      return {
        error: "Failed to delete list",
      };
    }

    await createAuditLog({
      orgId,
      entityId: deletedList._id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: deletedList.title,
      action: ACTION.DELETE,
      userId,
      userImage: list.userImage || "/placeholder.svg",
      userName: list.userName || "User",
    });

    revalidatePath(`/board/${boardId}`);
    
    // Convert Mongoose document to plain object
    const plainList = {
      id: deletedList._id.toString(),
      title: deletedList.title,
      order: deletedList.order,
      boardId: deletedList.boardId.toString(),
      createdAt: deletedList.createdAt.toISOString(),
      updatedAt: deletedList.updatedAt.toISOString(),
      cards: []
    };

    return { data: plainList };
  } catch (error) {
    console.error("Delete list error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete",
    };
  }
};

export const deleteList = createSafeAction(DeleteList, handler);

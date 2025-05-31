"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import Board from "@/models/Board";
import List from "@/models/List";
import Card from "@/models/Card";
import { createAuditLog } from "@/lib/create-audit-log";
import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

type InputType = {
  id: string;
};

type ReturnType = ActionState<InputType, any>;

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;

  try {
    await connectDB();
    
    const board = await Board.findById(id);
    if (!board) {
      return {
        error: "Board not found",
      };
    }

    // Delete all cards in the board first
    await Card.deleteMany({ boardId: id });

    // Delete all lists in the board
    await List.deleteMany({ boardId: id });

    // Delete the board
    const deletedBoard = await Board.findByIdAndDelete(id);
    if (!deletedBoard) {
      return {
        error: "Failed to delete board",
      };
    }

    const isPro = await checkSubscription();
    if (!isPro) {
      await decreaseAvailableCount();
    }

    try {
    await createAuditLog({
      orgId,
        entityId: deletedBoard._id.toString(),
      entityType: ENTITY_TYPE.BOARD,
      entityTitle: deletedBoard.title,
      action: ACTION.DELETE,
      userId,
      userImage: board.userImage || "/placeholder.svg",
      userName: board.userName || "User",
    });
    } catch (error) {
      console.error("Failed to create audit log:", error);
      // Continue execution even if audit log fails
    }

    revalidatePath(`/organization/${orgId}`);
    
    // Convert Mongoose document to plain object
    return { 
      data: {
      id: deletedBoard._id.toString(),
        title: deletedBoard.title
      }
    };
  } catch (error) {
    console.error("Delete board error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete board",
    };
  }
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);

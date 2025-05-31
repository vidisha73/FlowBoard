"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import Board from "@/models/Board";
import { createAuditLog } from "@/lib/create-audit-log";

export const updateBoard = async (data: { id: string; title: string }) => {
  try {
    const { orgId, userId, sessionClaims } = auth();

    if (!orgId || !userId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const board = await Board.findById(data.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      data.id,
      { title: data.title },
      { new: true }
    );

    await createAuditLog({
      orgId,
      entityId: updatedBoard._id,
      entityType: ENTITY_TYPE.BOARD,
      entityTitle: updatedBoard.title,
      action: ACTION.UPDATE,
      userId,
      userImage: sessionClaims?.image as string || "/placeholder.svg",
      userName: sessionClaims?.name as string || "User",
    });

    revalidatePath(`/board/${data.id}`);
    return JSON.parse(JSON.stringify(updatedBoard));
  } catch (error) {
    console.error("[UPDATE_BOARD_ERROR]", error);
    throw error;
  }
};

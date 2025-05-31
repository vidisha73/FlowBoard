"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import List from "@/models/List";
import Card from "@/models/Card";
import { createAuditLog } from "@/lib/create-audit-log";

export const copyList = async (data: { id: string; boardId: string }) => {
  try {
    const { orgId, userId, sessionClaims } = auth();

    if (!orgId || !userId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const listToCopy = await List.findOne({ _id: data.id });

    if (!listToCopy) {
      throw new Error("List not found");
    }

    const lastList = await List.findOne({ boardId: data.boardId })
      .sort({ order: -1 })
      .select('order');

    const newOrder = lastList ? lastList.order + 1 : 1;

    const newList = await List.create({
      title: `${listToCopy.title} - Copy`,
      boardId: data.boardId,
      order: newOrder,
      orgId,
    });

    // Copy all cards from the original list
    const cards = await Card.find({ listId: data.id });
    for (const card of cards) {
      await Card.create({
        title: card.title,
        description: card.description,
        order: card.order,
        listId: newList._id,
        boardId: data.boardId,
        orgId,
      });
    }

    await createAuditLog({
      orgId,
      entityId: newList._id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: newList.title,
      action: ACTION.CREATE,
      userId,
      userImage: sessionClaims?.image as string || "/placeholder.svg",
      userName: sessionClaims?.name as string || "User",
    });

    revalidatePath(`/board/${data.boardId}`);
    return JSON.parse(JSON.stringify(newList));
  } catch (error) {
    console.error("[COPY_LIST_ERROR]", error);
    throw error;
  }
};

"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";
import { createAuditLog } from "@/lib/create-audit-log";

export const copyCard = async (id: string, boardId: string) => {
  try {
    const { orgId, userId, sessionClaims } = auth();

    if (!orgId) {
      throw new Error("Unauthorized");
    }

    await connectDB();
    const cardToCopy = await Card.findOne({ _id: id });

    if (!cardToCopy) {
      throw new Error("Card not found");
    }

    const lastCard = await Card.findOne({ listId: cardToCopy.listId })
      .sort({ order: -1 })
      .limit(1);

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const card = new Card({
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      order: newOrder,
      listId: cardToCopy.listId,
      boardId,
      orgId,
    });

    await card.save();

    await createAuditLog({
      orgId,
      entityId: card._id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: card.title,
      action: ACTION.CREATE,
      userId,
      userImage: sessionClaims?.image as string || "/placeholder.svg",
      userName: sessionClaims?.name as string || "User",
    });

    revalidatePath(`/board/${boardId}`);
    return card;
  } catch (error) {
    console.error("[COPY_CARD_ERROR]", error);
    throw error;
  }
};

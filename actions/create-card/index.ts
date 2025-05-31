"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";
import List from "@/models/List";
import { createAuditLog } from "@/lib/create-audit-log";

export async function createCard(data: {
  title: string;
  listId: string;
  boardId: string;
}) {
  const { orgId, userId, sessionClaims } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  await connectDB();
  const list = await List.findById(data.listId);

  if (!list) {
    throw new Error("List not found");
  }

  const lastCard = await Card.findOne({ listId: data.listId })
    .sort({ order: -1 });

  const newOrder = lastCard ? lastCard.order + 1 : 1;

  const card = await Card.create({
    title: data.title,
    listId: data.listId,
    boardId: data.boardId,
    order: newOrder,
    orgId,
  });

  await createAuditLog({
    orgId,
    action: ACTION.CREATE,
    entityId: card._id.toString(),
    entityType: ENTITY_TYPE.CARD,
    entityTitle: card.title,
    userId,
    userImage: sessionClaims?.image as string || "/placeholder.svg",
    userName: sessionClaims?.name as string || "User",
  });

  revalidatePath(`/board/${data.boardId}`);
  
  // Return a serialized plain object instead of the Mongoose document
  return {
    id: card._id.toString(),
    title: card.title,
    description: card.description || "",
    order: card.order,
    listId: card.listId,
    boardId: card.boardId,
    createdAt: card.createdAt ? card.createdAt.toISOString() : null,
    updatedAt: card.updatedAt ? card.updatedAt.toISOString() : null
  };
}

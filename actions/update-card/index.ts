"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { CardWithList } from "@/types";

type InputType = {
  id: string;
  title?: string;
  description?: string;
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

  const { id, boardId, title, description } = data;

  try {
    await connectDB();
    
    const card = await Card.findById(id).populate("listId");
    if (!card || !card.listId) {
      return {
        error: "Card not found or invalid",
      };
    }

    const updateData: { title?: string; description?: string } = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("listId");

    if (!updatedCard || !updatedCard.listId) {
      return {
        error: "Failed to update card",
      };
    }

    // Convert Mongoose document to plain object
    const plainCard = {
      id: updatedCard._id.toString(),
      title: updatedCard.title || "",
      description: updatedCard.description || "",
      order: updatedCard.order || 0,
      listId: updatedCard.listId._id ? updatedCard.listId._id.toString() : updatedCard.listId.toString(),
      boardId: updatedCard.boardId.toString(),
      createdAt: updatedCard.createdAt.toISOString(),
      updatedAt: updatedCard.updatedAt.toISOString(),
      list: {
        title: typeof updatedCard.listId === 'object' && updatedCard.listId.title ? updatedCard.listId.title : ""
      }
    };

    revalidatePath(`/board/${boardId}`);
    return { data: plainCard };
  } catch (error) {
    console.error("Update card error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update",
    };
  }
};

export const updateCard = createSafeAction(UpdateCard, handler);

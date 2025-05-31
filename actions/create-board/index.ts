"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/models/AuditLog";
import connectDB from "@/lib/mongodb";
import Board from "@/models/Board";
import { createAuditLog } from "@/lib/create-audit-log";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

export const createBoard = async (data: { title: string; image?: string }) => {
  try {
    const { orgId, userId, sessionClaims } = auth();

    if (!orgId || !userId) {
      return {
        error: "Unauthorized"
      };
    }

    const canCreate = await hasAvailableCount();
    const isPro = await checkSubscription();

    if (!canCreate && !isPro) {
      return {
        error: "You have reached your limit of free boards. Please upgrade to create more."
      };
    }

    await connectDB();
    const board = await Board.create({
      title: data.title,
      orgId,
      imageId: "default",
      imageThumbUrl: "/placeholder.svg",
      imageFullUrl: "/placeholder.svg",
      imageLinkHTML: "<a href='/placeholder.svg'>Placeholder Image</a>",
      imageUserName: "User",
      ...(data.image && {
        imageId: data.image.split('|')[0],
        imageThumbUrl: data.image.split('|')[1],
        imageFullUrl: data.image.split('|')[2],
        imageLinkHTML: data.image.split('|')[3],
        imageUserName: data.image.split('|')[4],
      }),
    });

    if (!isPro) {
      await incrementAvailableCount();
    }

    await createAuditLog({
      orgId,
      entityId: board._id,
      entityType: ENTITY_TYPE.BOARD,
      entityTitle: board.title,
      action: ACTION.CREATE,
      userId,
      userImage: sessionClaims?.image as string || "/placeholder.svg",
      userName: sessionClaims?.name as string || "User",
    });

    revalidatePath(`/organization/${orgId}`);
    return { data: JSON.parse(JSON.stringify(board)) };
  } catch (error) {
    console.error("[CREATE_BOARD_ERROR]", error);
    return {
      error: error instanceof Error ? error.message : "Failed to create board"
    };
  }
};

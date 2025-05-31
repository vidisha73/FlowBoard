import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Card from "@/models/Card";
import List from "@/models/List";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();
    const card = await Card.findOne({ _id: params.cardId })
      .populate({
        path: 'listId',
        select: 'title',
        model: List
      });

    if (!card) {
      return new NextResponse("Card not found", { status: 404 });
    }

    const response = {
      id: card._id.toString(),
      title: card.title,
      description: card.description || "",
      order: card.order,
      listId: card.listId._id.toString(),
      boardId: card.boardId,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      list: {
        title: card.listId.title
      }
    };

    console.log("API Card Data:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET_CARD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

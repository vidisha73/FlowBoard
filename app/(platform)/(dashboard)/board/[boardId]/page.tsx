import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import connectDB from "@/lib/mongodb";
import List, { IList } from "@/models/List";
import Card, { ICard } from "@/models/Card";
import { ListContainer } from "./_components/list-container";
import { ListWithCards } from "@/types";
import { db } from "@/lib/db";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

interface LeanList {
  _id: Types.ObjectId;
  title: string;
  order: number;
  boardId: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LeanCard {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  listId: Types.ObjectId;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardPage = async ({ params }: BoardPageProps) => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  await connectDB();
  const lists = await List.find({ boardId: params.boardId })
    .sort({ order: 1 })
    .lean() as unknown as LeanList[];

  // Fetch all cards for this board at once
  const cards = await Card.find({ boardId: params.boardId })
    .sort({ order: 1 })
    .lean() as unknown as LeanCard[];

  // Create a map of listId to its cards
  const cardsByList = cards.reduce<Record<string, any[]>>((acc, card) => {
    const listId = card.listId.toString();
    if (!acc[listId]) {
      acc[listId] = [];
    }
    acc[listId].push({
      id: card._id.toString(),
      title: card.title,
      description: card.description,
      order: card.order,
      listId: listId,
      boardId: params.boardId,
      createdAt: card.createdAt ? card.createdAt.toISOString() : null,
      updatedAt: card.updatedAt ? card.updatedAt.toISOString() : null
    });
    return acc;
  }, {});

  // Add cards to each list
  const listsWithCards = lists.map(list => ({
    id: list._id.toString(),
    title: list.title,
    order: list.order,
    boardId: list.boardId,
    orgId: list.orgId,
    createdAt: list.createdAt ? list.createdAt.toISOString() : null,
    updatedAt: list.updatedAt ? list.updatedAt.toISOString() : null,
    cards: cardsByList[list._id.toString()] || []
  })) as unknown as ListWithCards[];

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer
        boardId={params.boardId}
        data={listsWithCards}
      />
    </div>
  );
};

export default BoardPage;

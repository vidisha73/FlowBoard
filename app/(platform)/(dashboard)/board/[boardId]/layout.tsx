import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Board, { IBoard } from "@/models/Board";
import { BoardNavbar } from "./_components/board-navbar";
import { SerializedBoard } from "./_components/types";

interface LeanBoard {
  _id: string;
  title: string;
  orgId: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageUserName: string;
  imageLinkHTML: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { boardId } = params;
  
  const authInfo = await auth();
  const { orgId } = authInfo;

  if (!orgId) {
    return {
      title: "Board",
    };
  }

  await connectDB();
  const board = await Board.findOne({ _id: boardId }).lean() as LeanBoard | null;

  return {
    title: board?.title || "Board",
  };
}

interface BoardIdLayoutProps {
  children: React.ReactNode;
  params: { boardId: string };
}

const BoardIdLayout = async ({
  children,
  params,
}: BoardIdLayoutProps) => {
  const { boardId } = params;
  
  const authInfo = await auth();
  const { orgId } = authInfo;

  if (!orgId) {
    redirect("/select-org");
  }

  await connectDB();
  const board = await Board.findOne({ _id: boardId, orgId }).lean() as LeanBoard | null;

  if (!board) {
    notFound();
  }

  // Convert _id to string to ensure it's serializable
  const serializedBoard: SerializedBoard = {
    _id: board._id.toString(),
    id: board._id.toString(),
    title: board.title,
    orgId: board.orgId,
    imageId: board.imageId,
    imageThumbUrl: board.imageThumbUrl,
    imageFullUrl: board.imageFullUrl,
    imageUserName: board.imageUserName,
    imageLinkHTML: board.imageLinkHTML,
    createdAt: board.createdAt ? new Date(board.createdAt).toISOString() : null,
    updatedAt: board.updatedAt ? new Date(board.updatedAt).toISOString() : null
  };

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${serializedBoard.imageFullUrl})` }}
    >
      <BoardNavbar data={serializedBoard} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;

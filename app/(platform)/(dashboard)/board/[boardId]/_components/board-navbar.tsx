import { IBoard } from "@/models/Board";

import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";
import { SerializedBoard } from "./types";
import { BackButton } from "./back-button";

interface BoardNavbarProps {
  data: SerializedBoard;
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BackButton orgId={data.orgId} />
      <BoardTitleForm data={data} />
      <div className="ml-auto">
        <BoardOptions id={data._id} />
      </div>
    </div>
  );
};

import { IBoard } from "@/models/Board";

export type InputType = {
  title: string;
  image: {
    imageId: string;
    imageThumbUrl: string;
    imageFullUrl: string;
    imageUserName: string;
    imageLinkHTML: string;
  };
};

export type ReturnType = IBoard;

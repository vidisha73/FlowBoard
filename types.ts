import { ICard } from "@/models/Card";
import { IList } from "@/models/List";

// Serialized types for client components
export type SerializedCard = {
  id: string;
  title: string;
  description?: string;
  order: number;
  listId: string;
  boardId: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SerializedList = {
  id: string;
  title: string;
  order: number;
  boardId: string;
  orgId: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Card = ICard;
export type List = IList;

export type CardWithList = {
  id: string;
  title: string;
  description: string;
  order: number;
  listId: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  list: {
    title: string;
  };
};

export type ListWithCards = SerializedList & { cards: SerializedCard[] };

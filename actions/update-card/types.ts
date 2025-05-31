import { ICard } from "@/models/Card";

export type InputType = {
  id: string;
  title: string;
  description?: string;
};

export type ReturnType = ICard;

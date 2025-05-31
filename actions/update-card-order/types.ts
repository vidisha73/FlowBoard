import { z } from "zod";
import { ICard } from "@/models/Card";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateCardOrder } from "./schema";

export type InputType = z.infer<typeof UpdateCardOrder>;
export type ReturnType = ActionState<InputType, ICard[]>;

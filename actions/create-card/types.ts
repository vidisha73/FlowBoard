import { z } from "zod";
import { Document } from "mongoose";
import { ICard } from "@/models/Card";

import { ActionState } from "@/lib/create-safe-action";

import { CreateCard } from "./schema";

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputType, ICard & Document>;

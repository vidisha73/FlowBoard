import { z } from "zod";
import { Document } from "mongoose";
import { IBoard } from "@/models/Board";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteBoard } from "./schema";

export type InputType = z.infer<typeof DeleteBoard>;
export type ReturnType = ActionState<InputType, IBoard & Document>;

import { z } from "zod";
import { Document } from "mongoose";
import { IList } from "@/models/List";

import { ActionState } from "@/lib/create-safe-action";

import { CreateList } from "./schema";

export type InputType = z.infer<typeof CreateList>;
export type ReturnType = ActionState<InputType, IList & Document>;

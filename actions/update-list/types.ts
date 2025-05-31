import { z } from "zod";
import { Document } from "mongoose";
import { IList } from "@/models/List";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateList } from "./schema";

export type InputType = z.infer<typeof UpdateList>;
export type ReturnType = ActionState<InputType, IList & Document>;

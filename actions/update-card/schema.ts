import { z } from "zod";

export const UpdateCard = z.object({
  boardId: z.string(),
  description: z.string().optional(),
  title: z.string().optional(),
  id: z.string(),
});

export type UpdateCardType = z.infer<typeof UpdateCard>;

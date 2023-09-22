import { z } from "zod";

export const editSchema = z.object({
  name: z.string().min(1, { message: "Name required" }),
  username: z.string().min(1, { message: "Username required" }),
  bio: z.string(),
});

export type editData = z.infer<typeof editSchema>;

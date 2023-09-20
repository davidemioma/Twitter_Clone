import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name required" }),
  username: z.string().min(1, { message: "Username required" }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .max(255, { message: "Email is too long." })
    .email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(20, { message: "Password must be at most 20 characters long." }),
});

export type registerData = z.infer<typeof registerSchema>;

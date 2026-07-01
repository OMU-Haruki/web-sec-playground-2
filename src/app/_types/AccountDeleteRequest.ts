import { z } from "zod";

export const accountDeleteRequestSchema = z.object({
  currentPassword: z.string().min(1, "退会するにはパスワードを入力してください"),
});

export type AccountDeleteRequest = z.infer<typeof accountDeleteRequestSchema>;

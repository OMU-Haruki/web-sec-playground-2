import { z } from "zod";
import { passwordSchema } from "@/app/_types/CommonSchemas";

export const passwordChangeRequestSchema = z
  .object({
    currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
    newPassword: passwordSchema,
    newPasswordConfirm: z.string().min(1, "新しいパスワード（確認）を入力してください"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "新しいパスワードが一致しません",
    path: ["newPasswordConfirm"],
  });

export type PasswordChangeRequest = z.infer<typeof passwordChangeRequestSchema>;

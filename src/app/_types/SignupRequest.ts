import { z } from "zod";
import {
  userNameSchema,
  emailSchema,
  passwordSchema,
} from "@/app/_types/CommonSchemas";

export const signupRequestSchema = z
  .object({
    name: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string().min(1, "確認用パスワードを入力してください"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "パスワードが一致しません",
    path: ["passwordConfirm"],
  });

export type SignupRequest = z.infer<typeof signupRequestSchema>;

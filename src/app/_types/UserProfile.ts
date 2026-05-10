import { z } from "zod";
import {
  userNameSchema,
  emailSchema,
  roleSchema,
  uuidSchema,
} from "./CommonSchemas";

export const userProfileSchema = z.object({
  id: uuidSchema,
  name: userNameSchema,
  email: emailSchema,
  role: roleSchema,
});

export type UserProfile = z.infer<typeof userProfileSchema>;

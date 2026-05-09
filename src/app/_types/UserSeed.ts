import { z } from "zod";
import {
  userNameSchema,
  emailSchema,
  passwordSchema,
  roleSchema,
  aboutSlugSchema,
  aboutContentSchema,
} from "./CommonSchemas";

export const userSeedSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
  aboutSlug: aboutSlugSchema.optional(),
  aboutContent: aboutContentSchema.optional(),
});

export type UserSeed = z.infer<typeof userSeedSchema>;

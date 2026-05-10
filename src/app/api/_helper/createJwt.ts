import { SignJWT, jwtVerify } from "jose";
import type { UserProfile } from "@/app/_types/UserProfile";
import { userProfileSchema } from "@/app/_types/UserProfile";
//
/**
 * JWT (JSON Web Token) を新規発行
 * @param userProfile - ユーザプロファイル情報
 * @param tokenMaxAgeSeconds - 有効期限（秒単位）
 * @returns - JWT (JSON Web Token)
 */
export const createJwt = async (
  userProfile: UserProfile,
  tokenMaxAgeSeconds: number,
): Promise<string> => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const expiresAt = new Date(Date.now() + tokenMaxAgeSeconds * 1000);

  // 余分なプロパティを削除
  const payload = userProfileSchema.parse(userProfile);
  // console.log("JWT Payload:", payload);

  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expiresAt)
      .sign(secret);
    return token;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Failed to sign JWT: ${e.message}`);
    }
    console.error("Failed to sign JWT");
  }
  return "";
};

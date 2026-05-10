import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { userProfileSchema } from "@/app/_types/UserProfile";

/**
 * Jwt を検証して成功すれば userId を返す
 */

export const verifyJwt = async (req: NextRequest): Promise<string | null> => {
  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!jwt) {
    console.error("JWT is missing in the request headers.");
    return null;
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  try {
    const { payload } = await jwtVerify(jwt, secret);
    const userProfile = userProfileSchema.parse(payload);
    return userProfile.id;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Failed to verify JWT: ${e.message}`);
    } else {
      console.error("Failed to verify JWT: Unknown error");
    }
    return null;
  }
};

import { userProfileSchema, type UserProfile } from "@/app/_types/UserProfile";
import { decodeJwt } from "jose";
import type { ApiResponse } from "../_types/ApiResponse";

export const jwtFetcher = (): ApiResponse<UserProfile | null> => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return { success: false, payload: null, message: "JWT not found" };
  }

  try {
    const payload = decodeJwt(jwt);
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwt");
      return { success: false, payload: null, message: "Token expired" };
    }

    // 期限が近づいているときは延長リクエストの処理を実装してみよう！

    return {
      success: true,
      payload: userProfileSchema.parse(payload),
      message: "",
    };
  } catch (err) {
    localStorage.removeItem("jwt");
    return { success: false, payload: null, message: "Invalid token" };
  }
};

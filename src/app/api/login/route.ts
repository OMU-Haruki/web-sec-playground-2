import { prisma } from "@/libs/prisma";
import { loginRequestSchema } from "@/app/_types/LoginRequest";
import { userProfileSchema } from "@/app/_types/UserProfile";
import type { UserProfile } from "@/app/_types/UserProfile";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import { NextResponse, NextRequest } from "next/server";
import { createJwt } from "@/app/api/_helper/createJwt";
import bcrypt from "bcryptjs";

// キャッシュを無効化して毎回最新情報を取得
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// ▼ 簡易的なレートリミット（オンメモリ）▼
// 本番環境では Redis 等の外部ストレージを利用することが推奨されます
type RateLimitInfo = { attempts: number; lockUntil: number | null };
const rateLimitMap = new Map<string, RateLimitInfo>();
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15分

export const POST = async (req: NextRequest) => {
  try {
    const result = loginRequestSchema.safeParse(await req.json());
    if (!result.success) {
      const res: ApiResponse<null> = {
        success: false,
        payload: null,
        message: "リクエストボディの形式が不正です。",
      };
      return NextResponse.json(res);
    }
    const loginRequest = result.data;
    const email = loginRequest.email;

    // --- レートリミットのチェック ---
    const rateLimitInfo = rateLimitMap.get(email) || { attempts: 0, lockUntil: null };
    if (rateLimitInfo.lockUntil && rateLimitInfo.lockUntil > Date.now()) {
      return NextResponse.json(
        {
          success: false,
          payload: { lockUntil: rateLimitInfo.lockUntil },
          message: "ログイン試行回数が上限を超えました。しばらく経ってから再度お試しください。",
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      rateLimitInfo.attempts += 1;
      if (rateLimitInfo.attempts >= MAX_ATTEMPTS) {
        rateLimitInfo.lockUntil = Date.now() + LOCK_TIME_MS;
      }
      rateLimitMap.set(email, rateLimitInfo);

      const res: ApiResponse<any> = {
        success: false,
        payload: { remainingAttempts: MAX_ATTEMPTS - rateLimitInfo.attempts },
        message: "メールアドレスまたはパスワードの組み合わせが正しくありません。",
      };
      return NextResponse.json(res);
    }

    // パスワードの検証
    // ✍ bcrypt でハッシュ化したパスワードを検証するように書き換えよ。
    const isValidPassword = await bcrypt.compare(loginRequest.password, user.password);
    if (!isValidPassword) {
      rateLimitInfo.attempts += 1;
      if (rateLimitInfo.attempts >= MAX_ATTEMPTS) {
        rateLimitInfo.lockUntil = Date.now() + LOCK_TIME_MS;
      }
      rateLimitMap.set(email, rateLimitInfo);

      const res: ApiResponse<any> = {
        success: false,
        payload: { remainingAttempts: MAX_ATTEMPTS - rateLimitInfo.attempts },
        message: "メールアドレスまたはパスワードの組み合わせが正しくありません。",
      };
      return NextResponse.json(res);
    }

    // ログイン成功時はレートリミット情報をリセット
    rateLimitMap.delete(email);

    const tokenMaxAgeSeconds = 60 * 60 * 3; // 3時間

    // トークンベース認証の処理
    const jwt = await createJwt(user, tokenMaxAgeSeconds);
    const res: ApiResponse<string> = {
      success: true,
      payload: jwt,
      message: "",
    };
    return NextResponse.json(res);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Internal Server Error";
    console.error(errorMsg);
    const res: ApiResponse<null> = {
      success: false,
      payload: null,
      message: "ログインのサーバサイドの処理に失敗しました。",
    };
    return NextResponse.json(res);
  }
};

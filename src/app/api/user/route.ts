import { prisma } from "@/libs/prisma";
import { accountDeleteRequestSchema } from "@/app/_types/AccountDeleteRequest";
import type { ApiResponse } from "@/app/_types/ApiResponse";
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export const DELETE = async (req: NextRequest) => {
  try {
    // Authorization ヘッダから JWT トークンを取得
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, payload: null, message: "認証されていません。" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];

    // JWT の検証
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    let payload;
    try {
      const { payload: decoded } = await jwtVerify(token, secret);
      payload = decoded;
    } catch (e) {
      return NextResponse.json(
        { success: false, payload: null, message: "トークンが無効または期限切れです。" },
        { status: 401 }
      );
    }

    const userId = payload.id as string;

    // リクエストボディの検証
    const result = accountDeleteRequestSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "リクエストの形式が不正です。",
      });
    }
    const { currentPassword } = result.data;

    // ユーザー取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "ユーザーが見つかりません。",
      });
    }

    // 現在のパスワードの検証
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        payload: null,
        message: "パスワードが正しくありません。",
      });
    }

    // ユーザー削除
    await prisma.user.delete({
      where: { id: userId },
    });

    const res: ApiResponse<null> = {
      success: true,
      payload: null,
      message: "退会処理が完了しました。",
    };
    return NextResponse.json(res);

  } catch (e) {
    console.error("Account delete error:", e);
    return NextResponse.json({
      success: false,
      payload: null,
      message: "退会処理中にエラーが発生しました。",
    });
  }
};

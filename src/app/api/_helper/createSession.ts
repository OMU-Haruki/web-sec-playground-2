import { cookies } from "next/headers";
import { prisma } from "@/libs/prisma";

/**
 * セッションを新規作成して Cookie に設定する。
 * @param userId - ユーザのID (UUID)
 * @param tokenMaxAgeSeconds - 有効期限（秒単位）
 * @returns - SessionID
 */
export const createSession = async (
  userId: string,
  tokenMaxAgeSeconds: number,
): Promise<string> => {
  // 💀 当該ユーザのセッションが既にDBに存在するなら消す処理を入れるべき
  // await prisma.session.deleteMany({ where: { userId: user.id } });
  // 👆 ただし、これだと全ての端末のセッションが無効になる ✍ どうすればよいか考えてみよう。
  const session = await prisma.session.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      expiresAt: new Date(Date.now() + tokenMaxAgeSeconds * 1000),
    },
  });

  const cookieStore = await cookies();
  // 💀 session_id というクッキー名が典型的すぎて狙われやすい（XSSでの標的）
  cookieStore.set("session_id", session.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: tokenMaxAgeSeconds,
    secure: false, // 💀 secure: false は開発用。deploy 時は要切替！
  });

  return session.id;
};

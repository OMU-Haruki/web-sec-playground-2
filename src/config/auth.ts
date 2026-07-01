// ▼▼ トークンベース認証 (JWT) に固定

export const AUTH = {
  mode: "jwt",
  isSession: false,
  isJWT: true,
} as const;

export type ApiResponse<T> = {
  success: boolean;
  payload: T;
  message: string; // 主にエラーメッセージなど
  metadata?: string; // JSON形式のメタ情報
};

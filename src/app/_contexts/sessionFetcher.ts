import type { ApiResponse } from "../_types/ApiResponse";

export const sessionFetcher = async (endPoint: string) => {
  const res = await fetch(endPoint, {
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

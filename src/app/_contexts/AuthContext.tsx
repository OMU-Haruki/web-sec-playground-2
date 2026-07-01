"use client";

import React, { useMemo, createContext } from "react";
import type { UserProfile } from "@/app/_types/UserProfile";
import useSWR, { mutate } from "swr";
import type { ApiResponse } from "../_types/ApiResponse";
import { jwtFetcher } from "./jwtFetcher";

interface AuthContextProps {
  userProfile: UserProfile | null;
  logout: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const { data: session } = useSWR<ApiResponse<UserProfile | null>>(
    "/api/auth",
    jwtFetcher
  );

  const userProfile = useMemo<UserProfile | null>(() => {
    if (session && session.success) return session.payload;
    return null;
  }, [session]);

  const logout = async () => {
    // ■■ トークンベース認証 ■■
    // ローカルストレージから jwt を削除
    localStorage.removeItem("jwt");
    // SWR キャッシュを無効化
    mutate(() => true, undefined, { revalidate: false });
    return true;
  };

  return (
    <AuthContext.Provider value={{ userProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

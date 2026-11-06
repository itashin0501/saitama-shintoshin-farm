"use client";

import { createContext, useContext } from "react";
import type { User } from "firebase/auth";
import type { AdminRole } from "@/lib/adminRoles";

type AdminContextValue = { user: User; role: AdminRole };

// 管理画面レイアウトで判定したログイン中の管理者と種別
export const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin は管理画面レイアウトの中でのみ使用できます");
  return value;
}

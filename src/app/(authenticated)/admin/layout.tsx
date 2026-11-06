"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  ADMIN_ROLE_LABELS,
  canAccessAdminPath,
  normalizeAdminRole,
  type AdminRole,
} from "@/lib/adminRoles";
import { AdminContext } from "@/components/admin/AdminContext";
import LogoutIcon from "@mui/icons-material/Logout";

type AuthState =
  | { status: "loading" }
  | { status: "admin"; user: User; role: AdminRole }
  | { status: "forbidden"; user: User };

// 管理者 = Firestore の admins/{uid} にドキュメントがあるユーザー（Firestore ルールと同じ判定）
// role（花野菜農園 / フルーツとやさい畑 / 全体）で開ける画面を制限する
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      try {
        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        setState(
          adminDoc.exists()
            ? { status: "admin", user, role: normalizeAdminRole(adminDoc.get("role")) }
            : { status: "forbidden", user }
        );
      } catch (error) {
        console.error("管理者確認エラー:", error);
        setState({ status: "forbidden", user });
      }
    });
    // pathname はリダイレクト先の記録用。変わるたびに購読し直す必要はない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (state.status === "forbidden") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold text-gray-800">
            管理画面へのアクセス権限がありません
          </h1>
          <p className="text-sm text-gray-600">
            {state.user.email} は管理者として登録されていません。
          </p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            <LogoutIcon fontSize="small" className="mr-1" />
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  const { user, role } = state;
  return (
    <AdminContext.Provider value={{ user, role }}>
      <div className="bg-gray-800 text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-end gap-4">
          <span className="truncate">{user.email}</span>
          <span className="hidden sm:inline text-gray-300 flex-shrink-0">
            {ADMIN_ROLE_LABELS[role]}
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center hover:text-gray-300 flex-shrink-0"
          >
            <LogoutIcon fontSize="small" className="mr-1" />
            ログアウト
          </button>
        </div>
      </div>
      {canAccessAdminPath(role, pathname) ? (
        children
      ) : (
        <div className="flex items-center justify-center p-4 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-800">
              この画面を開く権限がありません
            </h1>
            <p className="text-sm text-gray-600">
              {ADMIN_ROLE_LABELS[role]}の管理者は、この画面を利用できません。
            </p>
            <Link
              href="/admin"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              管理画面TOPへ戻る
            </Link>
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}

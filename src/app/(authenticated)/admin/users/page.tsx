"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminContext";
import {
  ADMIN_ROLES,
  ADMIN_ROLE_LABELS,
  type AdminRole,
  type AdminUser,
} from "@/lib/adminRoles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ROLE_BADGE_CLASSES: Record<AdminRole, string> = {
  hanayasai: "bg-pink-100 text-pink-800",
  fruitshatake: "bg-blue-100 text-blue-800",
  all: "bg-gray-200 text-gray-800",
};

export default function AdminUsersPage() {
  const { user } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("hanayasai");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // /api/admin/users は ID トークンで全体管理者かどうかを確認する
  const request = async (method: string, path = "", body?: unknown) => {
    const res = await fetch(`/api/admin/users${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "処理に失敗しました");
    return data;
  };

  useEffect(() => {
    request("GET")
      .then((data) => setUsers(data.users))
      .catch((error) => {
        console.error("管理者一覧取得エラー:", error);
        alert(error.message);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const data = await request("POST", "", { email, password, role });
      setUsers((prev) =>
        [...prev, data.user as AdminUser].sort((a, b) => a.email.localeCompare(b.email))
      );
      setMessage({
        type: "success",
        text: data.created
          ? `${data.user.email} を作成しました。初期パスワードを本人に伝えてください`
          : `既存のアカウント ${data.user.email} を管理者に登録しました（パスワードは変更していません）`,
      });
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (target: AdminUser, newRole: AdminRole) => {
    try {
      await request("PATCH", "", { uid: target.uid, role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.uid === target.uid ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleDelete = async (target: AdminUser) => {
    if (
      !confirm(
        `${target.email} を削除してもよろしいですか？\nログインアカウントも削除され、管理画面にログインできなくなります。`
      )
    ) {
      return;
    }
    try {
      await request("DELETE", `?uid=${encodeURIComponent(target.uid)}`);
      setUsers((prev) => prev.filter((u) => u.uid !== target.uid));
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowBackIcon className="mr-1" fontSize="small" />
          管理画面TOPへ戻る
        </Link>

        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <ManageAccountsIcon className="text-gray-700 mr-3" fontSize="large" />
            <h1 className="text-3xl font-bold text-gray-800">管理者ユーザー</h1>
          </div>
          <ul className="mt-4 text-sm text-gray-600 space-y-1">
            {ADMIN_ROLES.map((r) => (
              <li key={r}>
                <span className="font-semibold">{ADMIN_ROLE_LABELS[r]}</span>
                {r === "all"
                  ? "：両方の農園の管理と、管理者ユーザーの追加・削除ができます"
                  : "：この農園の画面だけを管理できます"}
              </li>
            ))}
          </ul>
        </div>

        {/* 追加フォーム */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-800">管理者を追加</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                初期パスワード（8文字以上）
              </label>
              <input
                type="text"
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                既にアカウントがある場合は入力不要です
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                種別
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-white"
              >
                {ADMIN_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ADMIN_ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.type === "error" ? "text-red-600" : "text-green-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <AddIcon className="mr-2" />
            {submitting ? "追加中..." : "追加する"}
          </button>
        </form>

        {/* 一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">登録済み一覧</h2>

          {loading ? (
            <p className="text-center text-gray-500 py-8">読み込み中...</p>
          ) : (
            <div className="space-y-3">
              {users.map((target) => {
                const isSelf = target.uid === user.uid;
                return (
                  <div
                    key={target.uid}
                    className="border-2 border-gray-200 rounded-lg p-4 flex flex-wrap items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 break-all">
                        {target.email}
                        {isSelf && (
                          <span className="ml-2 text-xs text-gray-500">（自分）</span>
                        )}
                      </p>
                    </div>

                    {isSelf ? (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${ROLE_BADGE_CLASSES[target.role]}`}
                      >
                        {ADMIN_ROLE_LABELS[target.role]}
                      </span>
                    ) : (
                      <>
                        <select
                          value={target.role}
                          onChange={(e) =>
                            handleRoleChange(target, e.target.value as AdminRole)
                          }
                          className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm bg-white"
                          aria-label={`${target.email} の種別`}
                        >
                          {ADMIN_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {ADMIN_ROLE_LABELS[r]}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDelete(target)}
                          className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          <DeleteIcon fontSize="small" className="mr-1" />
                          削除
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 管理者の種別。admins/{uid} の role フィールドに保存する
// （firestore.rules / storage.rules の判定と揃えること）
export const ADMIN_ROLES = ["hanayasai", "fruitshatake", "all"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

// 管理対象のサイト
export type AdminSite = "hanayasai" | "fruitshatake";

// /api/admin/users が返す管理者ユーザー
export type AdminUser = { uid: string; email: string; role: AdminRole };

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  hanayasai: "花野菜農園",
  fruitshatake: "フルーツとやさい畑",
  all: "全体管理者（両方＋ユーザー管理）",
};

export function isAdminRole(value: unknown): value is AdminRole {
  return ADMIN_ROLES.includes(value as AdminRole);
}

// role 導入前に登録された管理者（role 未設定）は全体管理者として扱う
export function normalizeAdminRole(value: unknown): AdminRole {
  return isAdminRole(value) ? value : "all";
}

export function canManageSite(role: AdminRole, site: AdminSite): boolean {
  return role === "all" || role === site;
}

// 管理者ユーザーの追加・削除は全体管理者のみ
export function canManageUsers(role: AdminRole): boolean {
  return role === "all";
}

// 管理画面のパスごとに必要な権限を判定する
export function canAccessAdminPath(role: AdminRole, pathname: string): boolean {
  const under = (prefix: string) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`);
  if (under("/admin/users")) return canManageUsers(role);
  if (under("/admin/hanayasai")) return canManageSite(role, "hanayasai");
  if (under("/admin/events") || under("/admin/announcements")) {
    return canManageSite(role, "fruitshatake");
  }
  return true;
}

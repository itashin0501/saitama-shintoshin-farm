import { NextResponse } from "next/server";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { verifyAdminRequest } from "@/lib/adminAuth";
import {
  canManageUsers,
  isAdminRole,
  normalizeAdminRole,
  type AdminUser,
} from "@/lib/adminRoles";

export const dynamic = "force-dynamic";

const forbidden = () =>
  NextResponse.json({ error: "権限がありません" }, { status: 403 });
const badRequest = (error: string) =>
  NextResponse.json({ error }, { status: 400 });

// 管理者ユーザーの管理は全体管理者のみ
async function requireUserManager(request: Request) {
  const admin = await verifyAdminRequest(request);
  return admin && canManageUsers(admin.role) ? admin : null;
}

export async function GET(request: Request) {
  if (!(await requireUserManager(request))) return forbidden();

  const app = getFirebaseAdminApp();
  const snapshot = await getFirestore(app).collection("admins").get();
  const uids = snapshot.docs.map((d) => ({ uid: d.id }));
  // メールアドレスは Auth 側を正とする（admins に email が無い既存データにも対応）
  const { users: authUsers } = uids.length
    ? await getAuth(app).getUsers(uids)
    : { users: [] };
  const emails = new Map(authUsers.map((u) => [u.uid, u.email ?? ""]));

  const users: AdminUser[] = snapshot.docs
    .map((d) => ({
      uid: d.id,
      email: emails.get(d.id) || (d.get("email") as string) || "(不明)",
      role: normalizeAdminRole(d.get("role")),
    }))
    .sort((a, b) => a.email.localeCompare(b.email));
  return NextResponse.json({ users });
}

// 追加：同じメールアドレスの Auth ユーザーが無ければ作成し、admins に登録する
export async function POST(request: Request) {
  if (!(await requireUserManager(request))) return forbidden();

  const { email, password, role } = await request.json().catch(() => ({}));
  if (typeof email !== "string" || !email.includes("@")) {
    return badRequest("メールアドレスを正しく入力してください");
  }
  if (!isAdminRole(role)) return badRequest("種別を選択してください");

  const app = getFirebaseAdminApp();
  const auth = getAuth(app);
  const normalizedEmail = email.trim().toLowerCase();

  let uid: string;
  let created = false;
  try {
    uid = (await auth.getUserByEmail(normalizedEmail)).uid;
  } catch (error) {
    if (
      !(error instanceof FirebaseAuthError) ||
      error.code !== "auth/user-not-found"
    ) {
      console.error("ユーザー取得エラー:", error);
      return NextResponse.json(
        { error: "ユーザーの確認に失敗しました" },
        { status: 500 }
      );
    }
    if (typeof password !== "string" || password.length < 8) {
      return badRequest("初期パスワードは8文字以上で入力してください");
    }
    try {
      uid = (await auth.createUser({ email: normalizedEmail, password })).uid;
      created = true;
    } catch (createError) {
      console.error("ユーザー作成エラー:", createError);
      return NextResponse.json(
        { error: "ユーザーの作成に失敗しました" },
        { status: 500 }
      );
    }
  }

  const ref = getFirestore(app).doc(`admins/${uid}`);
  if ((await ref.get()).exists) {
    return badRequest("このメールアドレスは既に管理者として登録されています");
  }
  await ref.set({
    email: normalizedEmail,
    role,
    createdAt: FieldValue.serverTimestamp(),
  });

  const user: AdminUser = { uid, email: normalizedEmail, role };
  return NextResponse.json({ user, created });
}

// 種別の変更
export async function PATCH(request: Request) {
  const admin = await requireUserManager(request);
  if (!admin) return forbidden();

  const { uid, role } = await request.json().catch(() => ({}));
  if (typeof uid !== "string" || !uid) return badRequest("不正なリクエストです");
  if (!isAdminRole(role)) return badRequest("種別を選択してください");
  // 全体管理者が誰もいなくなるのを防ぐため、自分の種別は変更できない
  if (uid === admin.uid) return badRequest("自分自身の種別は変更できません");

  const ref = getFirestore(getFirebaseAdminApp()).doc(`admins/${uid}`);
  if (!(await ref.get()).exists) return badRequest("管理者が見つかりません");
  await ref.update({ role, updatedAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ ok: true });
}

// 削除：管理者登録とログインアカウントの両方を削除する
export async function DELETE(request: Request) {
  const admin = await requireUserManager(request);
  if (!admin) return forbidden();

  const uid = new URL(request.url).searchParams.get("uid");
  if (!uid) return badRequest("不正なリクエストです");
  if (uid === admin.uid) return badRequest("自分自身は削除できません");

  const app = getFirebaseAdminApp();
  await getFirestore(app).doc(`admins/${uid}`).delete();
  try {
    await getAuth(app).deleteUser(uid);
  } catch (error) {
    // Auth 側が既に無い場合は admins の削除だけで完了とする
    if (
      !(error instanceof FirebaseAuthError) ||
      error.code !== "auth/user-not-found"
    ) {
      console.error("ユーザー削除エラー:", error);
      return NextResponse.json(
        { error: "ログインアカウントの削除に失敗しました" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ ok: true });
}

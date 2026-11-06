import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { normalizeAdminRole, type AdminRole } from "@/lib/adminRoles";

// サーバーサイド専用。Authorization: Bearer <ID トークン> から管理者と種別を判定する
// （Firestore ルールと同じく admins/{uid} の有無と role で判定）
// トークンが無効なら null を返す。Admin SDK の初期化や Firestore の失敗は
// 権限エラーと区別できるよう、ログに残して例外のまま投げる（呼び出し側で 500 になる）
export async function verifyAdminRequest(
  request: Request
): Promise<{ uid: string; role: AdminRole } | null> {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;

  let app;
  try {
    app = getFirebaseAdminApp();
  } catch (error) {
    console.error("Firebase Admin 初期化エラー:", error);
    throw error;
  }

  let uid: string;
  try {
    uid = (await getAuth(app).verifyIdToken(token)).uid;
  } catch (error) {
    console.error("ID トークン検証エラー:", error);
    return null;
  }

  try {
    const adminDoc = await getFirestore(app).doc(`admins/${uid}`).get();
    if (!adminDoc.exists) return null;
    return { uid, role: normalizeAdminRole(adminDoc.get("role")) };
  } catch (error) {
    console.error("管理者情報の取得エラー:", error);
    throw error;
  }
}

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { normalizeAdminRole, type AdminRole } from "@/lib/adminRoles";

// サーバーサイド専用。Authorization: Bearer <ID トークン> から管理者と種別を判定する
// （Firestore ルールと同じく admins/{uid} の有無と role で判定）
export async function verifyAdminRequest(
  request: Request
): Promise<{ uid: string; role: AdminRole } | null> {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;
  try {
    const app = getFirebaseAdminApp();
    const { uid } = await getAuth(app).verifyIdToken(token);
    const adminDoc = await getFirestore(app).doc(`admins/${uid}`).get();
    if (!adminDoc.exists) return null;
    return { uid, role: normalizeAdminRole(adminDoc.get("role")) };
  } catch {
    return null;
  }
}

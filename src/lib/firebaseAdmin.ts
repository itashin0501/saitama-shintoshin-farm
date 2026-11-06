import { initializeApp, getApps, cert, App } from "firebase-admin/app";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fruits-hatake";

// サーバーサイド専用。Firestore ルールを経由せずに書き込むため、API ルートからのみ使用すること
export function getFirebaseAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccount) {
    // App Hosting（Cloud Run）上ではキーが無くても実行環境のサービスアカウント
    // （Application Default Credentials）で認証できる
    return initializeApp({ projectId: PROJECT_ID });
  }

  const credentials = JSON.parse(serviceAccount);
  // 環境変数の書き方によって改行が "\\n" のまま残るため復元する
  credentials.private_key = credentials.private_key?.replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert(credentials),
    projectId: PROJECT_ID,
  });
}

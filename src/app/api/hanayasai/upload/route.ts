import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { MAX_UPLOAD_BYTES } from "@/lib/uploadLimits";

export const dynamic = "force-dynamic";

const FOLDERS = ["activities", "events"] as const;
type Folder = (typeof FOLDERS)[number];

const BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  "fruits-hatake.firebasestorage.app";

// 表示用は長辺 1920px、サムネイルは長辺 600px の WebP に変換する
const VARIANTS = {
  large: { size: 1920, quality: 82 },
  thumb: { size: 600, quality: 75 },
} as const;

// Firestore ルールと同じく admins/{uid} の有無で管理者を判定する
async function verifyAdmin(request: Request): Promise<boolean> {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return false;
  try {
    const app = getFirebaseAdminApp();
    const { uid } = await getAuth(app).verifyIdToken(token);
    const adminDoc = await getFirestore(app).doc(`admins/${uid}`).get();
    return adminDoc.exists;
  } catch {
    return false;
  }
}

async function saveVariant(path: string, buffer: Buffer): Promise<string> {
  const bucket = getStorage(getFirebaseAdminApp()).bucket(BUCKET);
  const token = randomUUID();
  await bucket.file(path).save(buffer, {
    contentType: "image/webp",
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      // クライアント SDK の getDownloadURL と同じ形式の URL を発行するためのトークン
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") as Folder;

  if (!(file instanceof File) || !FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `${file.name} は20MBを超えています` },
      { status: 413 }
    );
  }

  const input = Buffer.from(await file.arrayBuffer());

  let large: Buffer;
  let thumb: Buffer;
  try {
    // rotate() で EXIF の向きを反映（EXIF 自体は出力しないので位置情報も残らない）
    const resize = ({ size, quality }: { size: number; quality: number }) =>
      sharp(input)
        .rotate()
        .resize(size, size, { fit: "inside", withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();
    [large, thumb] = await Promise.all([
      resize(VARIANTS.large),
      resize(VARIANTS.thumb),
    ]);
  } catch (error) {
    console.error("画像変換エラー:", error);
    return NextResponse.json(
      {
        error: `${file.name} は読み込めない画像形式です（JPEG・PNG・WebP に対応しています）`,
      },
      { status: 415 }
    );
  }

  try {
    const base = `hanayasai/${folder}/${Date.now()}_${randomUUID().slice(0, 8)}`;
    const [url, thumbnailUrl] = await Promise.all([
      saveVariant(`${base}.webp`, large),
      saveVariant(`${base}_thumb.webp`, thumb),
    ]);
    return NextResponse.json({ url, thumbnailUrl });
  } catch (error) {
    console.error("画像保存エラー:", error);
    return NextResponse.json(
      { error: "画像の保存に失敗しました" },
      { status: 500 }
    );
  }
}

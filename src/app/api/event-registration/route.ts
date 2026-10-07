import { NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventId,
      eventTitle,
      name,
      email,
      phone,
      adultCount,
      childCount,
      message,
    } = body;

    // バリデーション
    if (!eventId || !name || !email || !phone) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // Firestoreに登録情報を保存
    const registrationData = {
      eventId,
      eventTitle: eventTitle || "",
      name,
      email,
      phone,
      adultCount: Number(adultCount) || 0,
      childCount: Number(childCount) || 0,
      message: message || "",
      createdAt: FieldValue.serverTimestamp(),
      status: "pending", // pending, confirmed, cancelled
    };

    // 参加者の個人情報を含むため、クライアントからは書き込めないルールにしている
    const docRef = await getFirestore(getFirebaseAdminApp())
      .collection("event-registrations")
      .add(registrationData);

    console.log("イベント参加登録が完了しました:", docRef.id);

    return NextResponse.json(
      {
        success: true,
        registrationId: docRef.id,
        message: "参加登録が完了しました",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("イベント参加登録エラー:", error);
    return NextResponse.json(
      { error: "登録処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

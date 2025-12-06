import { NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
      createdAt: serverTimestamp(),
      status: "pending", // pending, confirmed, cancelled
    };

    const docRef = await addDoc(
      collection(db, "event-registrations"),
      registrationData
    );

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
